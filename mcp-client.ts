import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testMcpServer() {
  console.log("Starting MCP client test...");

  // Create transport to connect to our MCP server
  const transport = new StdioClientTransport({
    command: "bun",
    args: ["run", "mcp-server.ts"],
  });

  // Create client
  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  });

  try {
    // Connect to the server
    await client.connect(transport);
    console.log("✅ Connected to MCP server");

    // List available tools
    const tools = await client.listTools();
    console.log("📋 Available tools:", tools.tools?.map(t => t.name));

    // Test search_documentation tool
    console.log("\n🔍 Testing search_documentation tool...");
    const searchResult = await client.callTool({
      name: "search_documentation",
      arguments: {
        query: "how to start an ubuntu vsi",
        limit: 3,
      },
    });

    console.log("Search result:", searchResult.content[0]);
    
    // Parse the search results to get an href for testing read_documentation
    const searchContent = searchResult.content[0];
    if (searchContent.type === "text") {
      const searchData = JSON.parse(searchContent.text);
      if (searchData.results && searchData.results.length > 0) {
        const firstResult = searchData.results[0];
        console.log(`\n📖 Testing read_documentation tool with href: ${firstResult.href}`);
        
        // Test read_documentation tool
        const readResult = await client.callTool({
          name: "read_documentation",
          arguments: {
            href: firstResult.href,
          },
        });

        const readContent = readResult.content[0];
        if (readContent.type === "text") {
          // Show first 500 characters of the markdown content
          const preview = readContent.text.substring(0, 500);
          console.log("📄 Documentation content preview:");
          console.log(preview + "...");
          console.log(`\n📊 Full content length: ${readContent.text.length} characters`);
        }
      }
    }

    console.log("\n✅ All tests completed successfully!");

  } catch (error) {
    console.error("❌ Error during testing:", error);
  } finally {
    // Close the connection
    await client.close();
    console.log("🔌 Connection closed");
  }
}

// Run the test
testMcpServer().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});