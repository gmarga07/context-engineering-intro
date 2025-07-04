import { MCPServer } from "@modelcontextprotocol/sdk";

// Import tool definitions
import { generatePRPTool } from "./tools/generatePRP";
import { executePRPTool } from "./tools/executePRP";

// Create the server instance
const server = new MCPServer();

// Register tools
server.registerTool(generatePRPTool);
server.registerTool(executePRPTool);

// Start listening on stdio (required by MCP clients like Claude Desktop)
server.listen();