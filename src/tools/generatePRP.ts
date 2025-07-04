import { ToolDefinition } from "@modelcontextprotocol/sdk";
import fs from "fs/promises";
import path from "path";

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
  handler: async (args: any): Promise<any> => {
    const { featureFile, outputPath } = args as {
      featureFile: string;
      outputPath?: string;
    };

    const featurePath = path.resolve(featureFile);
    const defaultOut = path.join(
      "PRPs",
      path.basename(featureFile, path.extname(featureFile)) + ".md"
    );
    const outPath = path.resolve(outputPath || defaultOut);

    // Ensure destination directory exists
    await fs.mkdir(path.dirname(outPath), { recursive: true });

    // Load required files
    const featureMarkdown = await fs.readFile(featurePath, "utf8");

    // Try to load the base PRP template if it exists. Fallback to empty string.
    const baseTemplatePath = path.resolve(
      "PRPs/templates/prp_base.md"
    );
    let baseTemplate = "";
    try {
      baseTemplate = await fs.readFile(baseTemplatePath, "utf8");
    } catch {
      // ignore – keep template blank
    }

    // Compose the final PRP
    const prpHeader = `name: "${path
      .basename(featureFile, path.extname(featureFile))
      .replace(/_/g, " ")} PRP"\ndescription: |\n  Generated automatically from feature request **${path.basename(
      featureFile
    )}**.\n  Review and complete all TODO sections marked below before executing.\n\n`;

    const prpContents = [
      prpHeader,
      baseTemplate,
      "\n---\n\n## Original Feature Request (verbatim)\n",
      featureMarkdown
    ].join("");

    await fs.writeFile(outPath, prpContents, "utf8");

    return { prpPath: outPath };
  }
};