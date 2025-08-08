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

// Tool to write experiment to database
server.registerTool(
  "write-experiment",
  {
    title: "Write Experiment",
    description: "Write improved CLAUDE.md content to experiments table",
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

      // Insert experiment
      const insertQuery = `
        INSERT INTO experiments (id, content, "workspaceId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        RETURNING id, "workspaceId", "createdAt"
      `;
      
      const result = await client.query(insertQuery, [content, workspaceId]);
      const experiment = result.rows[0];

      // Check count of experiments for this workspace
      const countQuery = `
        SELECT COUNT(*) as count
        FROM experiments
        WHERE "workspaceId" = $1
      `;
      
      const countResult = await client.query(countQuery, [workspaceId]);
      const count = parseInt(countResult.rows[0].count);

      return {
        content: [{
          type: "text",
          text: `Experiment saved successfully\nID: ${experiment.id}\nWorkspace: ${workspaceId}\nTotal experiments for workspace: ${count}`
        }]
      };
    } catch (error) {
      console.error("Error writing experiment:", error);
      return {
        content: [{
          type: "text",
          text: `Error writing experiment: ${error instanceof Error ? error.message : "Unknown error"}`
        }]
      };
    } finally {
      await client.end();
    }
  }
);

// Tool to check and return experiments for meshing
server.registerTool(
  "check-and-mesh-experiments",
  {
    title: "Check and Return Experiments for Meshing",
    description: "Check if workspace has 50+ experiments and return all their contents for Claude to mesh",
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

      // Count experiments for workspace
      const countQuery = `
        SELECT COUNT(*) as count
        FROM experiments
        WHERE "workspaceId" = $1
      `;
      
      const countResult = await client.query(countQuery, [workspaceId]);
      const count = parseInt(countResult.rows[0].count);

      if (count < 50) {
        return {
          content: [{
            type: "text",
            text: `Workspace has ${count} experiments. Need ${50 - count} more to create a variant.`
          }]
        };
      }

      // Fetch last 50 experiments with full content
      const experimentsQuery = `
        SELECT id, content, "createdAt"
        FROM experiments
        WHERE "workspaceId" = $1
        ORDER BY "createdAt" DESC
        LIMIT 50
      `;
      
      const experimentsResult = await client.query(experimentsQuery, [workspaceId]);
      const experiments = experimentsResult.rows;

      // Return all experiment contents for Claude to mesh
      const experimentsData = experiments.map((exp: {
        id: string;
        content: string;
        createdAt: Date;
      }) => ({
        id: exp.id,
        content: exp.content,
        createdAt: exp.createdAt.toISOString()
      }));

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            status: "ready_to_mesh",
            workspaceId: workspaceId,
            experimentCount: experiments.length,
            experiments: experimentsData
          })
        }]
      };
    } catch (error) {
      console.error("Error checking experiments:", error);
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

const transport = new StdioServerTransport();
await server.connect(transport);

// Cleanup on exit
process.on("SIGINT", async () => {
  process.exit(0);
});