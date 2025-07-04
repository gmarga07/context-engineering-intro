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

    // Very naive implementation: just prepend a TODO header and copy content
    const contents = await fs.readFile(featurePath, "utf8");
    const prpContents = `# TODO: Auto-generated PRP based on ${path.basename(
      featureFile
    )}\n\n` + contents;
    await fs.writeFile(outPath, prpContents, "utf8");

    return { prpPath: outPath };
  }
};