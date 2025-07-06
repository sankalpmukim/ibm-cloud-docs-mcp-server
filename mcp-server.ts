#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDocumentation, fetchToc } from "./ibm-cloud-api.js";
import { parseDocsUrl, extractContentAndConvertToMarkdown } from "./utils.js";

// Simplified types for MCP responses
interface SimpleSearchResult {
  href: string;
  title: string;
  description: string;
}

interface SimpleSearchResponse {
  results: SimpleSearchResult[];
}

// Create MCP server
const server = new McpServer({
  name: "ibm-cloud-docs",
  version: "1.0.0",
});

// Register search_documentation tool
server.registerTool(
  "search_documentation",
  {
    title: "Search IBM Cloud Documentation",
    description: "Search IBM Cloud documentation for relevant topics and articles",
    inputSchema: {
      query: z.string().describe("Search query for IBM Cloud documentation"),
      limit: z.number().min(1).max(20).default(10).optional().describe("Maximum number of results to return (1-20, default 10)"),
    },
  },
  async ({ query, limit = 10 }) => {
    try {
      const searchResults = await searchDocumentation({
        q: query,
        offset: 0,
      });

      // Transform to simplified format with only essential information
      const simpleResults: SimpleSearchResult[] = searchResults.topics
        .slice(0, limit)
        .map((topic) => ({
          href: topic.href,
          title: topic.title,
          description: topic.description || topic.summary?.join(" ") || "No description available",
        }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ results: simpleResults }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching documentation: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Register read_documentation tool
server.registerTool(
  "read_documentation",
  {
    title: "Read IBM Cloud Documentation",
    description: "Read and convert IBM Cloud documentation page to clean markdown format",
    inputSchema: {
      href: z.string().describe("Documentation href from search results (e.g., '/docs/containers?topic=containers-getting-started')"),
    },
  },
  async ({ href }) => {
    try {
      // Parse the documentation URL to extract path and topic
      const urlParams = parseDocsUrl(href);
      
      // Fetch the documentation content
      const htmlContent = await fetchToc(urlParams);
      
      // Convert to clean markdown
      const markdownContent = extractContentAndConvertToMarkdown(htmlContent);

      return {
        content: [
          {
            type: "text",
            text: markdownContent,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error reading documentation: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("IBM Cloud Documentation MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});