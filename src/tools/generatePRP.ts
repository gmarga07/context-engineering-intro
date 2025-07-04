import { ToolDefinition } from "@modelcontextprotocol/sdk";
import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

export const generatePRPTool: ToolDefinition = {
  name: "generatePRP",
  description: "Generate a PRP markdown file from a feature markdown file (e.g. INITIAL.md). This is a stub that simply copies the file for now.",
  parameters: {
    type: "object",
    properties: {
      featureFile: {
        type: "string",
        description: "Path to the feature markdown file (e.g. INITIAL.md)"
      },
      outputPath: {
        type: "string",
        description: "Optional path for the generated PRP file"
      }
    },
    required: ["featureFile"]
  },
  handler: async (args: any, context: any): Promise<any> => {
    const { featureFile, outputPath } = args as {
      featureFile: string;
      outputPath?: string;
    };

    const send = context?.sendProgress;
    try {
      send?.("Reading feature file…");

      const featurePath = path.resolve(featureFile);
      const defaultOut = path.join(
        "PRPs",
        path.basename(featureFile, path.extname(featureFile)) + ".md"
      );
      const outPath = path.resolve(outputPath || defaultOut);

      // Ensure destination directory exists
      await fs.mkdir(path.dirname(outPath), { recursive: true });

      // Load feature markdown
      const featureMarkdown = await fs.readFile(featurePath, "utf8");

      send?.("Loading PRP base template…");

      // Try to load the base PRP template if it exists.
      const baseTemplatePath = path.resolve(
        "PRPs/templates/prp_base.md"
      );
      let template = "";
      try {
        template = await fs.readFile(baseTemplatePath, "utf8");
      } catch {
        send?.("Base template not found. Proceeding with blank template.");
      }

      // Attempt to generate codebase tree overview
      let codebaseTree = "";
      send?.("Generating codebase tree overview…");
      try {
        const execAsync: any = promisify(exec);
        const { stdout } = await execAsync(
          'tree -L 2 -I ".git|node_modules|dist" || echo "(tree not available)"'
        );
        codebaseTree = stdout.trim();
      } catch {
        codebaseTree = "(tree command unavailable)";
      }

      // Inject codebase tree into template if placeholder exists
      template = template.replace(
        /```bash[\s\S]*?```/,
        (match) => {
          // replace first bash code block (current codebase tree section)
          if (match.startsWith("```bash\n\n")) {
            return "```bash\n" + codebaseTree + "\n```";
          }
          return match;
        }
      );

      // Compose PRP header
      const prpHeader = `name: "${path
        .basename(featureFile, path.extname(featureFile))
        .replace(/_/g, " ")} PRP"\ndescription: |\n  Generated automatically from feature request **${path.basename(
        featureFile
      )}**.\n  Review and complete all TODO sections marked below before executing.\n\n`;

      const prpContents = [
        prpHeader,
        template,
        "\n---\n\n## Original Feature Request (verbatim)\n",
        featureMarkdown
      ].join("");

      send?.("Writing PRP output…");
      await fs.writeFile(outPath, prpContents, "utf8");

      // Parse validation gates (bash code blocks inside Validation Loop)
      const bashBlocks = prpContents.match(/```bash[\s\S]*?```/g) || [];
      const validationCommands: string[] = [];
      for (const block of bashBlocks) {
        const lines = block
          .replace(/```bash/, "")
          .replace(/```/, "")
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith("#"));
        validationCommands.push(...lines);
      }

      send?.("PRP generation complete.");

      return { prpPath: outPath, validationCommands };
    } catch (err: any) {
      send?.(`Error: ${err.message}`);
      throw err;
    }
  }
};