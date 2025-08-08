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

// Tool to check and mesh experiments into variant
server.registerTool(
  "check-and-mesh-experiments",
  {
    title: "Check and Mesh Experiments",
    description: "Check if workspace has 50+ experiments and mesh them into a variant",
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

      // Fetch last 50 experiments
      const experimentsQuery = `
        SELECT id, content, "createdAt"
        FROM experiments
        WHERE "workspaceId" = $1
        ORDER BY "createdAt" DESC
        LIMIT 50
      `;
      
      const experimentsResult = await client.query(experimentsQuery, [workspaceId]);
      const experiments = experimentsResult.rows;

      // Mesh experiments (combine and deduplicate improvements)
      const meshedContent = meshExperiments(experiments);

      // Insert variant
      const insertVariantQuery = `
        INSERT INTO variants (id, content, "workspaceId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        RETURNING id, "createdAt"
      `;
      
      const variantResult = await client.query(insertVariantQuery, [meshedContent, workspaceId]);
      const variant = variantResult.rows[0];

      return {
        content: [{
          type: "text",
          text: `Variant created successfully!\nVariant ID: ${variant.id}\nMeshed from: ${experiments.length} experiments\nWorkspace: ${workspaceId}`
        }]
      };
    } catch (error) {
      console.error("Error checking/meshing experiments:", error);
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

// Tool to fetch experiments for a workspace
server.registerTool(
  "fetch-experiments",
  {
    title: "Fetch Experiments",
    description: "Retrieve experiments for a specific workspace",
    inputSchema: {
      workspaceId: z.string().describe("The workspace ID"),
      limit: z.number().optional().describe("Number of experiments to fetch (default: 10)")
    }
  },
  async ({ workspaceId, limit = 10 }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      const query = `
        SELECT id, SUBSTRING(content, 1, 200) as content_preview, "createdAt"
        FROM experiments
        WHERE "workspaceId" = $1
        ORDER BY "createdAt" DESC
        LIMIT $2
      `;
      
      const result = await client.query(query, [workspaceId, limit]);
      const experiments = result.rows;

      const formatted = experiments.map((exp: {
        id: string;
        content_preview: string;
        createdAt: Date;
      }) => 
        `ID: ${exp.id}\nPreview: ${exp.content_preview}...\nCreated: ${exp.createdAt.toISOString()}`
      ).join("\n---\n");

      return {
        content: [{
          type: "text",
          text: experiments.length > 0 
            ? `Found ${experiments.length} experiment(s) for workspace "${workspaceId}":\n\n${formatted}`
            : `No experiments found for workspace "${workspaceId}"`
        }]
      };
    } catch (error) {
      console.error("Error fetching experiments:", error);
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

// Tool to fetch variants for a workspace
server.registerTool(
  "fetch-variants",
  {
    title: "Fetch Variants",
    description: "Retrieve variants for a specific workspace",
    inputSchema: {
      workspaceId: z.string().describe("The workspace ID")
    }
  },
  async ({ workspaceId }) => {
    const client = new Client({
      connectionString: DATABASE_URL,
    });

    try {
      await client.connect();

      const query = `
        SELECT id, SUBSTRING(content, 1, 500) as content_preview, "createdAt"
        FROM variants
        WHERE "workspaceId" = $1
        ORDER BY "createdAt" DESC
      `;
      
      const result = await client.query(query, [workspaceId]);
      const variants = result.rows;

      const formatted = variants.map((variant: {
        id: string;
        content_preview: string;
        createdAt: Date;
      }) => 
        `ID: ${variant.id}\nPreview: ${variant.content_preview}...\nCreated: ${variant.createdAt.toISOString()}`
      ).join("\n\n---\n\n");

      return {
        content: [{
          type: "text",
          text: variants.length > 0 
            ? `Found ${variants.length} variant(s) for workspace "${workspaceId}":\n\n${formatted}`
            : `No variants found for workspace "${workspaceId}"`
        }]
      };
    } catch (error) {
      console.error("Error fetching variants:", error);
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

// Helper function to mesh experiments
function meshExperiments(experiments: Array<{
  id: string;
  content: string;
  createdAt: Date;
}>): string {
  // Parse all experiment contents
  const allContents = experiments.map(exp => exp.content);
  
  // Find common patterns and improvements
  const improvements: Map<string, Set<string>> = new Map();
  
  allContents.forEach(content => {
    // Extract sections from content (simple pattern matching)
    const sections = content.split(/##\s+/);
    sections.forEach((section: string) => {
      const lines = section.split('\n');
      const sectionTitle = lines[0]?.trim();
      if (sectionTitle) {
        if (!improvements.has(sectionTitle)) {
          improvements.set(sectionTitle, new Set());
        }
        // Add unique content lines
        lines.slice(1).forEach((line: string) => {
          if (line.trim()) {
            improvements.get(sectionTitle)?.add(line);
          }
        });
      }
    });
  });

  // Build meshed content
  let meshedContent = "# CLAUDE.md - Meshed Variant\n\n";
  meshedContent += "This variant combines learnings from 50 experiments.\n\n";
  
  improvements.forEach((lines, section) => {
    meshedContent += `## ${section}\n\n`;
    lines.forEach(line => {
      meshedContent += `${line}\n`;
    });
    meshedContent += '\n';
  });

  return meshedContent;
}

const transport = new StdioServerTransport();
await server.connect(transport);

// Cleanup on exit
process.on("SIGINT", async () => {
  process.exit(0);
});