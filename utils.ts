import { JSDOM } from "jsdom";
import type { PageItemTopicPath } from "./types";
import TurndownService from "turndown";

export function parseDocsUrl(urlString: string): PageItemTopicPath {
  const regex = /^\/docs\/([^?]+)\?topic=(.+)$/;
  const match = urlString.match(regex);

  if (match === null || !match[1] || !match[2]) {
    throw new Error("could not find match");
  }

  return {
    path: match[1], // $1
    topic: match[2], // $2
  };
}

/**
 * Convert HTML string to Markdown
 */
export function htmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({
    headingStyle: "atx", // Use # style headings
    bulletListMarker: "-", // Use - for bullet lists
    codeBlockStyle: "fenced", // Use ``` for code blocks
    fence: "```",
    emDelimiter: "*",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
  });

  // Add custom rules for better conversion
  turndownService.addRule("removeScripts", {
    filter: ["script", "style", "meta", "head", "title"],
    replacement: () => "",
  });

  // Handle code elements better
  turndownService.addRule("code", {
    filter: "code",
    replacement: (content) => `\`${content}\``,
  });

  // Clean up the HTML and convert
  const markdown = turndownService.turndown(html);

  // Clean up extra whitespace and normalize line breaks
  return markdown
    .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove extra blank lines
    .replace(/^\s+|\s+$/g, "") // Trim whitespace
    .replace(/\n\s+/g, "\n"); // Remove leading spaces on lines
}

/**
 * Extract just the main content from HTML and convert to Markdown (Node.js version)
 */
export function extractContentAndConvertToMarkdown(html: string): string {
  // Create a JSDOM instance
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Try to find the main content area
  const mainContent =
    doc.querySelector("main") ||
    doc.querySelector("article") ||
    doc.querySelector("body");

  if (!mainContent) {
    return htmlToMarkdown(html);
  }

  // Remove script tags and other unwanted elements
  const scripts = mainContent.querySelectorAll("script, style, meta");
  scripts.forEach((script) => script.remove());

  return htmlToMarkdown(mainContent.innerHTML);
}

/**
 * Simple function that just converts the HTML directly without DOM parsing
 */
export function simpleHtmlToMarkdown(html: string): string {
  return htmlToMarkdown(html);
}
