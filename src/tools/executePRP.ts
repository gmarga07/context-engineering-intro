import { ToolDefinition } from "@modelcontextprotocol/sdk";
import fs from "fs/promises";
import path from "path";

import { promisify } from "util";

export const executePRPTool: ToolDefinition = {
  name: "executePRP",
  description:
    "Parse a PRP markdown file, extract validation gates (bash commands) and execute them sequentially, streaming progress logs and returning a summary.",
  parameters: {
    type: "object",
    properties: {
      prpPath: {
        type: "string",
        description: "Absolute or relative path to the PRP markdown file."
      },
      stopOnFailure: {
        type: "boolean",
        description: "Whether to abort execution on first failed command. Default false.",
        default: false
      }
    },
    required: ["prpPath"]
  },
  handler: async (args: any, context: any): Promise<any> => {
    const { prpPath, stopOnFailure = false } = args as {
      prpPath: string;
      stopOnFailure?: boolean;
    };

    const send = context?.sendProgress;

    const absPath = path.resolve(prpPath);
    send?.(`Reading PRP from ${absPath} …`);

    let prpContent = "";
    try {
      prpContent = await fs.readFile(absPath, "utf8");
    } catch (err: any) {
      send?.(`❌ Failed to read PRP: ${err.message}`);
      throw err;
    }

    // Extract bash fenced blocks
    const bashBlocks = prpContent.match(/```bash[\s\S]*?```/g) || [];
    const commands: string[] = [];
    for (const block of bashBlocks) {
      const lines = block
        .replace(/```bash/, "")
        .replace(/```/, "")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"));
      commands.push(...lines);
    }

    if (commands.length === 0) {
      send?.("⚠️  No validation commands found in PRP.");
      return { status: "no-commands" };
    }

    send?.(`Found ${commands.length} validation command(s). Executing…`);

    const { exec } = await import("child_process");
    const execAsync: any = promisify(exec);

    const results: {
      command: string;
      exitCode: number;
      stdout: string;
      stderr: string;
    }[] = [];

    for (const cmd of commands) {
      send?.(`▶️  ${cmd}`);
      try {
        const { stdout, stderr } = await execAsync(cmd, {
          shell: "/bin/bash",
          maxBuffer: 1024 * 1024 * 10 // 10 MB
        });
        send?.(`✅ Success (${cmd})`);
        if (stdout.trim()) {
          send?.(stdout.trim());
        }
        if (stderr.trim()) {
          send?.(stderr.trim());
        }
        results.push({ command: cmd, exitCode: 0, stdout, stderr });
      } catch (error: any) {
        const stdout = error.stdout ?? "";
        const stderr = error.stderr ?? error.message;
        const code = error.code ?? 1;
        send?.(`❌ Failed (${cmd}) – exit code ${code}`);
        if (stdout.trim()) send?.(stdout.trim());
        if (stderr.trim()) send?.(stderr.trim());
        results.push({ command: cmd, exitCode: code, stdout, stderr });
        if (stopOnFailure) {
          send?.("Stopping on first failure as requested.");
          break;
        }
      }
    }

    const total = results.length;
    const failed = results.filter((r) => r.exitCode !== 0).length;
    const passed = total - failed;

    send?.(`Validation finished. Passed: ${passed}/${total}.`);

    return {
      status: failed === 0 ? "success" : "failed",
      summary: { total, passed, failed },
      results
    };
  }
};