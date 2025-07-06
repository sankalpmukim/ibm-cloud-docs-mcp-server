# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses Bun as the JavaScript runtime and package manager:

- `bun install` - Install dependencies
- `bun run index.ts` - Run the main application
- `bun --hot index.ts` - Run with hot reload for development
- `bun test` - Run tests (using Bun's built-in test runner)
- `bun build <file>` - Build files using Bun's bundler

## Architecture Overview

This is an IBM Cloud Documentation MCP (Model Context Protocol) server that provides search and content retrieval capabilities for IBM Cloud documentation.

### Core Components

- **`index.ts`** - Main entry point that demonstrates usage of the search functionality
- **`ibm-cloud-api.ts`** - Contains the primary API functions:
  - `searchDocumentation()` - Searches IBM Cloud docs using their search API
  - `fetchToc()` - Fetches table of contents and content for specific documentation topics
- **`types.ts`** - TypeScript interfaces for API responses and data structures
- **`utils.ts`** - Utility functions, primarily `parseDocsUrl()` for URL parsing

### API Structure

The system interacts with two main IBM Cloud documentation APIs:
1. **Search API** (`/docs/api/search`) - Returns search results with topics, summaries, and metadata
2. **Content API** (`/docs-content/v4/toc/`) - Fetches detailed content and table of contents

### Key Data Flow

1. Search queries are sent to the IBM Cloud search API
2. Results contain `href` URLs that are parsed using `parseDocsUrl()`  
3. Parsed URLs provide `path` and `topic` parameters for content retrieval
4. The `fetchToc()` function uses these parameters to get detailed content

## Runtime Environment

- **Runtime**: Bun (not Node.js)
- **TypeScript**: Strict mode enabled with modern ESNext target
- **Module System**: ESM with bundler resolution
- **Development**: Hot reload supported with `--hot` flag

## Cursor Rules

The project includes Cursor rules that enforce using Bun instead of Node.js/npm:
- Use `bun` commands instead of `node`, `npm`, `yarn`, or `pnpm`
- Prefer Bun's built-in APIs over external packages where possible
- Use `Bun.serve()` instead of Express for HTTP servers
- Use built-in WebSocket support instead of external libraries