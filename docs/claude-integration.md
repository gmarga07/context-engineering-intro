# Claude / Cursor Integration Guide

Follow these steps to wire the Context-Engineering MCP server into Claude Desktop, Cursor, Windsurf, or any other MCP-aware client.

---

## 1  Install the package

```
npx -y @modelcontextprotocol/sdk install context-engineering-mcp
```

or add to your project:

```
npm install --save-dev context-engineering-mcp
```

---

## 2  Add to your MCP configuration

### Cursor (global)
Edit `~/.cursor/mcp.json` and add:

```jsonc
{
  "mcpServers": {
    "context-engineering": {
      "command": "npx",
      "args": [
        "-y",
        "--package=context-engineering-mcp",
        "context-engineering-mcp"
      ],
      "env": {}
    }
  }
}
```

### Claude Desktop
Edit (macOS) `~/Library/Application Support/Claude/mcp_config.json`:

```jsonc
{
  "mcpServers": {
    "context-engineering": {
      "command": "node",
      "args": [
        "/ABS/PATH/TO/node_modules/context-engineering-mcp/dist/server.js"
      ]
    }
  }
}
```

---

## 3  Use the tools in chat

```
use context-engineering.generatePRP {"featureFile":"INITIAL.md"}
use context-engineering.executePRP {"prpPath":"PRPs/initial.md"}
use context-engineering.listPRPs {}
use context-engineering.showPRP {"prpPath":"PRPs/initial.md", "maxChars":1000}
```

Progress will be streamed directly in the conversation and tool responses will be visible as JSON payloads.

---

## 4  Publishing (maintainers)

```
npm run build
npm publish --access public
```

Ensure `package.json` has the correct `version` before publishing.