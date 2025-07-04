declare module "@modelcontextprotocol/sdk" {
  /**
   * Rough (incomplete) subset of the official MCP SDK typings.
   * This will be replaced once the SDK publishes proper TypeScript types.
   */
  export interface ToolDefinition {
    name: string;
    description: string;
    parameters: any;
    handler: (args: any, context?: any) => Promise<any>;
  }

  export class MCPServer {
    registerTool(tool: ToolDefinition): void;
    listen(): void;
  }
}