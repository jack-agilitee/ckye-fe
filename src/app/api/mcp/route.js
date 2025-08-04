import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import pg from "pg";
const { Client } = pg;

const handler = createMcpHandler(
    (server) => {
        server.tool(
            'Fetch Pages by Company',
            'Retrieve all pages for a specific company from the database',
            { company: z.string().describe("The company name to filter pages") },
            async ({ company }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
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
                    const formattedPages = pages.map((page) =>
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
            },
        );
    },
    {},
    { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE };