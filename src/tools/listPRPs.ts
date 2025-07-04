import { ToolDefinition } from "@modelcontextprotocol/sdk";
import fs from "fs/promises";
import path from "path";

async function getPRPFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await getPRPFiles(fullPath);
      files.push(...sub);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

export const listPRPsTool: ToolDefinition = {
  name: "listPRPs",
  description: "List all PRP markdown files in the repository.",
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false
  },
  handler: async () => {
    const prpRoot = path.resolve("PRPs");
    try {
      const files = await getPRPFiles(prpRoot);
      return { files };
    } catch {
      return { files: [] };
    }
  }
};