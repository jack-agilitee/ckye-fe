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

// Tool to write suggestion to database
server.registerTool(
  "write-suggestion",
  {
    title: "Write Suggestion",
    description: "Write improved CLAUDE.md content to suggestions table",
    inputSchema: {
      content: z.string().describe("The improved CLAUDE.md content"),
      workspaceId: z.string().describe("The workspace ID")
    }
  },
  async ({ content, workspaceId }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      // Insert suggestion
      const insertQuery = `
        INSERT INTO suggestions (id, content, "workspaceId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        RETURNING id, "workspaceId", "createdAt"
      `;
      
      const result = await client.query(insertQuery, [content, workspaceId]);
      const suggestion = result.rows[0];

      // Check count of suggestions for this workspace
      const countQuery = `
        SELECT COUNT(*) as count
        FROM suggestions
        WHERE "workspaceId" = $1
      `;
      
      const countResult = await client.query(countQuery, [workspaceId]);
      const count = parseInt(countResult.rows[0].count);

      return {
        content: [{
          type: "text",
          text: `Suggestion saved successfully\nID: ${suggestion.id}\nWorkspace: ${workspaceId}\nTotal suggestions for workspace: ${count}`
        }]
      };
    } catch (error) {
      console.error("Error writing suggestion:", error);
      return {
        content: [{
          type: "text",
          text: `Error writing suggestion: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
      await client.end();
    }
  }
);

// Tool to check and return suggestions for meshing
server.registerTool(
  "check-and-mesh-suggestions",
  {
    title: "Check and Return Suggestions for Meshing",
    description: "Check if workspace has 50+ suggestions and return all their contents for Claude to mesh",
    inputSchema: {
      workspaceId: z.string().describe("The workspace ID to check")
    }
  },
  async ({ workspaceId }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      // Count suggestions for workspace
      const countQuery = `
        SELECT COUNT(*) as count
        FROM suggestions
        WHERE "workspaceId" = $1
      `;
      
      const countResult = await client.query(countQuery, [workspaceId]);
      const count = parseInt(countResult.rows[0].count);

      if (count < 50) {
        return {
          content: [{
            type: "text",
            text: `Workspace has ${count} suggestions. Need ${50 - count} more to create a variant.`
          }]
        };
      }

      // Fetch last 50 suggestions with full content
      const suggestionsQuery = `
        SELECT id, content, "createdAt"
        FROM suggestions
        WHERE "workspaceId" = $1
        ORDER BY "createdAt" DESC
        LIMIT 50
      `;
      
      const suggestionsResult = await client.query(suggestionsQuery, [workspaceId]);
      const suggestions = suggestionsResult.rows;

      // Return all suggestion contents for Claude to mesh
      const suggestionsData = suggestions.map((sug: {
        id: string;
        content: string;
        createdAt: Date;
      }) => ({
        id: sug.id,
        content: sug.content,
        createdAt: sug.createdAt.toISOString()
      }));

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "ready_to_mesh",
            workspaceId: workspaceId,
            suggestionCount: suggestions.length,
            suggestions: suggestionsData
          })
        }]
      };
    } catch (error) {
      console.error("Error checking suggestions:", error);
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
      await client.end();
    }
  }
);

// Tool to write variant to database
server.registerTool(
  "write-variant",
  {
    title: "Write Variant",
    description: "Write meshed CLAUDE.md variant to variants table",
    inputSchema: {
      content: z.string().describe("The meshed CLAUDE.md content"),
      workspaceId: z.string().describe("The workspace ID")
    }
  },
  async ({ content, workspaceId }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      // Insert variant
      const insertQuery = `
        INSERT INTO variants (id, content, "workspaceId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        RETURNING id, "workspaceId", "createdAt"
      `;
      
      const result = await client.query(insertQuery, [content, workspaceId]);
      const variant = result.rows[0];

      return {
        content: [{
          type: "text",
          text: `Variant saved successfully\nID: ${variant.id}\nWorkspace: ${workspaceId}\nCreated: ${variant.createdAt.toISOString()}`
        }]
      };
    } catch (error) {
      console.error("Error writing variant:", error);
      return {
        content: [{
          type: "text",
          text: `Error writing variant: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
      await client.end();
    }
  }
);

// Tool to delete all suggestions for a workspace
server.registerTool(
  "delete-suggestions",
  {
    title: "Delete Suggestions",
    description: "Delete all suggestions for a specific workspace",
    inputSchema: {
      workspaceId: z.string().describe("The workspace ID to delete suggestions for")
    }
  },
  async ({ workspaceId }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      // Delete all suggestions for the workspace
      const deleteQuery = `
        DELETE FROM suggestions
        WHERE "workspaceId" = $1
        RETURNING id
      `;
      
      const result = await client.query(deleteQuery, [workspaceId]);
      const deletedCount = result.rowCount;

      return {
        content: [{
          type: "text",
          text: `Successfully deleted ${deletedCount} suggestions for workspace: ${workspaceId}`
        }]
      };
    } catch (error) {
      console.error("Error deleting suggestions:", error);
      return {
        content: [{
          type: "text",
          text: `Error deleting suggestions: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
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