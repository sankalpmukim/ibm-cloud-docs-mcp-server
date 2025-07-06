# IBM Cloud Documentation MCP Server

A Model Context Protocol (MCP) server that provides AI clients with the ability to search and retrieve IBM Cloud documentation. This server exposes IBM Cloud's documentation as standardized tools that can be used by LLMs and AI applications.

## Features

- **Search Documentation**: Search IBM Cloud's extensive documentation library with pagination support
- **Read Documentation**: Retrieve and convert documentation pages to clean Markdown format
- **Clean API**: Simplified responses containing only essential information
- **MCP Compatible**: Works with any MCP-compatible client (Claude Desktop, VSCode with MCP extension, etc.)

## Installation

```bash
bun install
```

## Usage

### Running the MCP Server

```bash
bun run mcp
```

This starts the MCP server using stdio transport, making it compatible with MCP clients.

### Running the Demo Application

```bash
bun run index.ts
```

This runs a standalone demo that searches for Ubuntu VSI documentation and converts it to Markdown.

### Testing the MCP Server

```bash
bun run test-mcp
```

This runs a test client that connects to the MCP server and demonstrates both tools in action.

## MCP Tools

### `search_documentation`

Search IBM Cloud documentation for relevant topics and articles.

**Parameters:**

- `query` (string): Search query for IBM Cloud documentation
- `limit` (number, optional): Maximum number of results to return (1-20, default 10)
- `offset` (number, optional): Number of results to skip for pagination (default 0)

**Returns:** JSON object with search results, total count, and pagination info.

### `read_documentation`

Read and convert IBM Cloud documentation page to clean Markdown format.

**Parameters:**

- `href` (string): Documentation href from search results (e.g., '/docs/containers?topic=containers-getting-started')

**Returns:** Clean Markdown content of the documentation page.

## Integration with Claude Desktop

To use this MCP server with Claude Desktop, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ibm-cloud-docs": {
      "command": "bun",
      "args": ["--cwd", "/absolute/path/to/this/project", "run", "mcp"]
    }
  }
}
```

## Example Usage

1. **Search for documentation:**

   ```
   Search for "kubernetes deployment" with limit 5
   ```

2. **Read specific documentation:**

   ```
   Read documentation from href "/docs/containers?topic=containers-getting-started"
   ```

3. **Paginated search:**
   ```
   Search for "virtual servers" with offset 10 to get the next page
   ```

## Architecture

- **mcp-server.ts**: Main MCP server implementation
- **ibm-cloud-api.ts**: API client for IBM Cloud documentation
- **utils.ts**: Utility functions for URL parsing and HTML-to-Markdown conversion
- **types.ts**: TypeScript type definitions

The server reuses robust API integration code while providing a clean, simplified interface through the MCP protocol.

## Requirements

- [Bun](https://bun.sh) runtime
- Node.js 18+ (for MCP SDK compatibility)
- Internet connection (for accessing IBM Cloud documentation APIs)

## License

This project was created using `bun init` in bun v1.2.15.
