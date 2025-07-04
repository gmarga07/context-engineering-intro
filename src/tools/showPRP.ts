import { ToolDefinition } from "@modelcontextprotocol/sdk";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const showPRPTool: ToolDefinition = {
  name: "showPRP",
  description: "Return the raw markdown contents of the specified PRP file (truncated to 50k chars).",
  parameters: {
    type: "object",
    properties: {
      prpPath: {
        type: "string",
        description: "Path to the PRP markdown file"
      },
      maxChars: {
        type: "number",
        description: "Optional maximum characters to return (default 50000)",
        default: 50000
      }
    },
    required: ["prpPath"]
  },
  handler: async (args: any) => {
    const { prpPath, maxChars = 50000 } = args as {
      prpPath: string;
      maxChars?: number;
    };
    const abs = resolve(prpPath);
    const content = await readFile(abs, "utf8");
    return { content: content.slice(0, maxChars) };
  }
};