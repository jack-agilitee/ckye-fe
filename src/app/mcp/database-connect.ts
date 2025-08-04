import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pg from "pg";
const { Client } = pg;

// Database connection string
const DATABASE_URL = "postgres://ckye_admin:w6W4Jzl2%23%3CYY@ckye.postgres.database.azure.com:5432/postgres?sslmode=require";

const server = new McpServer({
  name: "Database Connector Service",
  version: "1.0.0",
});

server.registerTool(
  "fetch-pages-by-company",
  {
    title: "Fetch Pages by Company",
    description: "Retrieve all pages for a specific company from the database",
    inputSchema: {
      company: z.string().describe("The company name to filter pages")
    }
  },
  async ({ company }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      // Connect to the database
      await client.connect();

      // Fetch pages from database with case-insensitive search
      const query = `
        SELECT id, name, content, company, "createdAt", "updatedAt"
        FROM pages
        WHERE LOWER(company) = LOWER($1)
        ORDER BY "createdAt" DESC
      `;
      
      const result = await client.query(query, [company]);
      const pages = result.rows;

      // Format the response
      const formattedPages = pages.map((page: {
        id: string;
        name: string;
        content: string;
        company: string;
        createdAt: Date;
        updatedAt: Date;
      }) => 
        `Page: ${page.name}\n` +
        `Company: ${page.company}\n` +
        `Content: ${page.content}\n` +
        `Created: ${page.createdAt.toISOString()}\n` +
        `Updated: ${page.updatedAt.toISOString()}\n` +
        `---`
      ).join("\n\n");

      return {
        content: [{
          type: "text",
          text: pages.length > 0 
            ? `Found ${pages.length} page(s) for company "${company}":\n\n${formattedPages}`
            : `No pages found for company "${company}"`
        }]
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        content: [{
          type: "text",
          text: `Error fetching pages: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
      // Always disconnect from the database
      await client.end();
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

// Cleanup on exit
process.on("SIGINT", async () => {
  process.exit(0);
});