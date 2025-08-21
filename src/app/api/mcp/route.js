import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import pg from "pg";
const { Client } = pg;

const handler = createMcpHandler(
    (server) => {
        // Tool to fetch pages by company
        server.tool(
            'fetch-pages-by-company',
            'Retrieve all pages for a specific company from the database',
            { company: z.string().describe("The company name to filter pages") },
            async ({ company }) => {
                console.log('Debug: Fetching pages for company:', company, 'at', new Date().toISOString());
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
                        `ID: ${page.id}\n` +
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

        // Tool to write suggestion to database
        server.tool(
            'write-suggestion',
            'Write improved CLAUDE.md content to suggestions table',
            {
                content: z.string().describe("The improved CLAUDE.md content"),
                workspaceId: z.string().describe("The workspace ID")
            },
            async ({ content, workspaceId }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
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
        server.tool(
            'check-and-mesh-suggestions',
            'Check if workspace has 50+ suggestions and return all their contents for Claude to mesh',
            {
                workspaceId: z.string().describe("The workspace ID to check")
            },
            async ({ workspaceId }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
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
                    const suggestionsData = suggestions.map((sug) => ({
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
        server.tool(
            'write-variant',
            'Write meshed CLAUDE.md variant to variants table',
            {
                content: z.string().describe("The meshed CLAUDE.md content"),
                summary: z.string().describe("A one-sentence summary of the changes"),
                workspaceId: z.string().describe("The workspace ID")
            },
            async ({ content, summary, workspaceId }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
                });

                try {
                    await client.connect();

                    // Insert variant
                    const insertQuery = `
        INSERT INTO variants (id, content, summary, "workspaceId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        RETURNING id, summary, "workspaceId", "createdAt"
      `;

                    const result = await client.query(insertQuery, [content, summary, workspaceId]);
                    const variant = result.rows[0];

                    return {
                        content: [{
                            type: "text",
                            text: `Variant saved successfully\nID: ${variant.id}\nSummary: ${variant.summary}\nWorkspace: ${workspaceId}\nCreated: ${variant.createdAt.toISOString()}`
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
        server.tool(
            'delete-suggestions',
            'Delete all suggestions for a specific workspace',
            {
                workspaceId: z.string().describe("The workspace ID to delete suggestions for")
            },
            async ({ workspaceId }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
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

        // Add this tool after your existing tools, before the closing of createMcpHandler
        server.tool(
            'query-database',
            'Execute a read-only SQL query on the PostgreSQL database for analysis and exploration',
            {
                sql: z.string().describe("The SQL query to execute (SELECT, WITH, or read-only operations only)"),
                limit: z.number().optional().default(100).describe("Maximum number of rows to return (default: 100, max: 1000)")
            },
            async ({ sql, limit = 100 }) => {
                console.log('Debug: Executing query at', new Date().toISOString());

                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
                });

                try {
                    await client.connect();

                    // Security: Only allow read operations
                    const normalizedSql = sql.trim().toUpperCase();
                    const readOnlyPrefixes = ['SELECT', 'WITH', 'SHOW', 'DESCRIBE', 'EXPLAIN'];
                    const isReadOnly = readOnlyPrefixes.some(prefix => normalizedSql.startsWith(prefix));

                    if (!isReadOnly) {
                        return {
                            content: [{
                                type: "text",
                                text: `Error: Only read-only queries are allowed (SELECT, WITH, SHOW, DESCRIBE, EXPLAIN). Your query starts with: ${normalizedSql.split(' ')[0]}`
                            }]
                        };
                    }

                    // Add LIMIT if not present and it's a SELECT query
                    let finalQuery = sql;
                    const maxLimit = Math.min(limit, 1000); // Cap at 1000 for safety

                    if (normalizedSql.startsWith('SELECT') && !normalizedSql.includes('LIMIT')) {
                        finalQuery = `${sql} LIMIT ${maxLimit}`;
                    }

                    const result = await client.query(finalQuery);

                    // Format response based on result size
                    if (result.rows.length === 0) {
                        return {
                            content: [{
                                type: "text",
                                text: "Query executed successfully but returned no rows."
                            }]
                        };
                    }

                    // For large results, provide summary
                    let responseText = `Query returned ${result.rowCount} rows.\n\n`;

                    if (result.rowCount <= 10) {
                        // For small results, show full data
                        responseText += JSON.stringify(result.rows, null, 2);
                    } else {
                        // For larger results, show sample and structure
                        responseText += `Showing first 5 rows as sample:\n`;
                        responseText += JSON.stringify(result.rows.slice(0, 5), null, 2);
                        responseText += `\n\n... and ${result.rowCount - 5} more rows`;

                        // Add column information
                        if (result.fields && result.fields.length > 0) {
                            responseText += `\n\nColumns (${result.fields.length}):\n`;
                            result.fields.forEach(field => {
                                responseText += `- ${field.name}\n`;
                            });
                        }
                    }

                    return {
                        content: [{
                            type: "text",
                            text: responseText
                        }]
                    };
                } catch (error) {
                    console.error("Error executing query:", error);
                    return {
                        content: [{
                            type: "text",
                            text: `Error executing query: ${error instanceof Error ? error.message : "Unknown error"}`
                        }]
                    };
                } finally {
                    await client.end();
                }
            }
        );

        // Add schema exploration tool
        server.tool(
            'explore-database-schema',
            'Explore database schema, tables, and columns',
            {
                action: z.enum(['list_tables', 'describe_table', 'list_columns']).describe("Action to perform"),
                tableName: z.string().optional().describe("Table name (required for describe_table and list_columns)")
            },
            async ({ action, tableName }) => {
                const client = new Client({
                    connectionString: process.env.DATABASE_URL,
                });

                try {
                    await client.connect();

                    let query;
                    let queryParams = [];

                    switch (action) {
                        case 'list_tables':
                            query = `
                        SELECT 
                            schemaname as schema,
                            tablename as table_name,
                            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
                        FROM pg_tables
                        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
                        ORDER BY schemaname, tablename;
                    `;
                            break;

                        case 'describe_table':
                            if (!tableName) {
                                return {
                                    content: [{
                                        type: "text",
                                        text: "Error: tableName is required for describe_table action"
                                    }]
                                };
                            }
                            query = `
                        SELECT 
                            column_name,
                            data_type,
                            character_maximum_length,
                            is_nullable,
                            column_default
                        FROM information_schema.columns
                        WHERE table_name = $1
                        ORDER BY ordinal_position;
                    `;
                            queryParams = [tableName];
                            break;

                        case 'list_columns':
                            if (!tableName) {
                                return {
                                    content: [{
                                        type: "text",
                                        text: "Error: tableName is required for list_columns action"
                                    }]
                                };
                            }
                            query = `
                        SELECT 
                            column_name,
                            data_type
                        FROM information_schema.columns
                        WHERE table_name = $1
                        ORDER BY ordinal_position;
                    `;
                            queryParams = [tableName];
                            break;
                    }

                    const result = await client.query(query, queryParams);

                    let responseText = `${action} results:\n\n`;
                    responseText += JSON.stringify(result.rows, null, 2);

                    return {
                        content: [{
                            type: "text",
                            text: responseText
                        }]
                    };
                } catch (error) {
                    console.error("Error exploring schema:", error);
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

    },
    {},
    { basePath: '/api' },
);

export { handler as GET, handler as POST, handler as DELETE };