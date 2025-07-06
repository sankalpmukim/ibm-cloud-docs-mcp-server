# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an IBM Cloud Documentation MCP (Model Context Protocol) server that enables searching and retrieving IBM Cloud documentation content. The server provides two main functions:
- Search IBM Cloud documentation using the official search API
- Fetch and convert individual documentation pages from HTML to Markdown

## Development Commands

### Installation and Setup
```bash
bun install
```

### Running the Demo Application
```bash
bun run index.ts
```

### Running the MCP Server
```bash
bun run mcp
```

### Development
The project uses Bun as the runtime. No build step is required - TypeScript files are executed directly.

## Architecture

### Core Components

- **index.ts**: Entry point that demonstrates the functionality by searching for Ubuntu VSI documentation and converting it to Markdown
- **mcp-server.ts**: MCP server implementation with two tools: search_documentation and read_documentation
- **ibm-cloud-api.ts**: API client functions for interacting with IBM Cloud's documentation search and content APIs
- **utils.ts**: Utility functions for URL parsing and HTML-to-Markdown conversion
- **types.ts**: TypeScript type definitions for API responses and data structures

### Key Functions

#### Documentation Search (`searchDocumentation`)
- Searches IBM Cloud documentation using the official `/docs/api/search` endpoint
- Takes search query and offset parameters
- Returns structured search results with topic metadata

#### Content Retrieval (`fetchToc`)
- Fetches table of contents metadata for a documentation path
- Retrieves the actual HTML content for a specific topic
- Returns raw HTML content ready for processing

#### Content Processing (`extractContentAndConvertToMarkdown`)
- Converts HTML documentation to clean Markdown format
- Uses JSDOM for DOM parsing and TurndownService for HTML-to-Markdown conversion
- Removes scripts, styles, and other unwanted elements
- Configures Markdown output with ATX headings, fenced code blocks, and clean formatting

### Data Flow

1. Search query → `searchDocumentation()` → Returns search results with hrefs
2. Parse documentation URL → `parseDocsUrl()` → Extracts path and topic parameters
3. Fetch content → `fetchToc()` → Retrieves HTML documentation
4. Convert to Markdown → `extractContentAndConvertToMarkdown()` → Clean Markdown output

### Configuration

- **TypeScript**: Configured for modern ES modules with strict type checking
- **Prettier**: Empty config (uses defaults)
- **Dependencies**: Minimal set focused on DOM manipulation (jsdom) and Markdown conversion (turndown)

## IBM Cloud Documentation API

The server interfaces with IBM Cloud's internal documentation APIs:
- Search API: `https://cloud.ibm.com/docs/api/search`
- Content API: `https://cloud.ibm.com/docs-content/v4/toc/{path}`
- Raw content: `https://cloud.ibm.com/docs-content/{content-path}`

URLs follow the pattern: `/docs/{path}?topic={topic-id}`

## MCP Server

The project includes an MCP (Model Context Protocol) server that exposes the IBM Cloud documentation functionality as standardized tools for AI clients.

### MCP Tools

#### `search_documentation`
- **Description**: Search IBM Cloud documentation for relevant topics and articles
- **Input**: 
  - `query` (string): Search query for IBM Cloud documentation
  - `limit` (number, optional): Maximum number of results to return (1-20, default 10)
- **Output**: JSON array of simplified search results with href, title, and description

#### `read_documentation`
- **Description**: Read and convert IBM Cloud documentation page to clean markdown format
- **Input**: 
  - `href` (string): Documentation href from search results (e.g., '/docs/containers?topic=containers-getting-started')
- **Output**: Clean markdown content of the documentation page

### Using the MCP Server

The MCP server uses StdioTransport and can be connected to any MCP-compatible client (like Claude Desktop, VSCode with MCP extension, etc.).

To configure with Claude Desktop, add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ibm-cloud-docs": {
      "command": "bun",
      "args": ["--cwd", "/absolute/path/to/project", "run", "mcp"]
    }
  }
}
```