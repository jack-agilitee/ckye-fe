# Variants API Documentation

## Overview
The Variants API provides read-only access to CLAUDE.md file variants stored in the database. Each variant represents a different version or configuration of documentation for a specific workspace.

## Base URL
`/api/variants`

## Authentication
Currently, no authentication is required. Future versions may require Bearer token authentication.

## Endpoints

### List Variants
Retrieve a paginated list of variants with optional filtering and sorting.

```
GET /api/variants
```

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of items per page |
| workspaceId | string | - | Filter variants by workspace ID |
| search | string | - | Search in content and summary fields |
| sortBy | string | createdAt | Field to sort by (createdAt, updatedAt) |
| sortOrder | string | desc | Sort order (asc or desc) |

#### Response
```json
{
  "data": [
    {
      "id": "cuid_string",
      "content": "# Markdown content...",
      "summary": "Brief description of the variant",
      "workspaceId": "workspace_cuid",
      "createdAt": "2025-08-08T21:42:16.598Z",
      "updatedAt": "2025-08-08T21:42:16.598Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Single Variant
Retrieve a specific variant by its ID.

```
GET /api/variants/:id
```

#### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | The variant ID (CUID format) |

#### Response
```json
{
  "id": "cuid_string",
  "content": "# Markdown content...",
  "summary": "Brief description of the variant",
  "workspaceId": "workspace_cuid",
  "createdAt": "2025-08-08T21:42:16.598Z",
  "updatedAt": "2025-08-08T21:42:16.598Z"
}
```

## Error Responses

### 404 Not Found
Returned when a variant with the specified ID doesn't exist.

```json
{
  "error": "Variant not found"
}
```

### 500 Internal Server Error
Returned when a server error occurs.

```json
{
  "error": "Failed to fetch variants"
}
```

## Usage Examples

### JavaScript/TypeScript

#### Using the API Client Functions

```javascript
import { 
  getVariants, 
  getVariantById, 
  getVariantsByWorkspace,
  getLatestVariantForWorkspace 
} from '@/lib/api/variants';

// Fetch all variants with pagination
const response = await getVariants({ 
  page: 1, 
  limit: 20 
});
console.log(response.data); // Array of variants
console.log(response.meta); // Pagination metadata

// Fetch a single variant by ID
const variant = await getVariantById('cme3cq592001d8owemmgcko13');
console.log(variant.content);

// Fetch variants for a specific workspace
const workspaceVariants = await getVariantsByWorkspace('workspace_id', {
  limit: 50,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// Get the most recent variant for a workspace
const latestVariant = await getLatestVariantForWorkspace('workspace_id');
if (latestVariant) {
  console.log('Latest variant:', latestVariant.summary);
}
```

#### Direct Fetch API

```javascript
// Fetch variants with filters
const response = await fetch('/api/variants?workspaceId=ws_123&limit=5');
const data = await response.json();

// Fetch single variant
const variantResponse = await fetch('/api/variants/variant_id');
const variant = await variantResponse.json();
```

### React Component Example

```jsx
'use client';

import { useState, useEffect } from 'react';
import { getVariantsByWorkspace } from '@/lib/api/variants';

export default function VariantsList({ workspaceId }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        const response = await getVariantsByWorkspace(workspaceId);
        setVariants(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [workspaceId]);

  if (loading) return <div>Loading variants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {variants.map(variant => (
        <div key={variant.id}>
          <h3>{variant.summary}</h3>
          <pre>{variant.content}</pre>
          <small>Created: {new Date(variant.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
```

### cURL Examples

```bash
# List all variants
curl -X GET "http://localhost:3000/api/variants"

# List variants with pagination
curl -X GET "http://localhost:3000/api/variants?page=2&limit=20"

# Filter by workspace
curl -X GET "http://localhost:3000/api/variants?workspaceId=cme3cq4q600028owe428y4wfz"

# Search in content and summary
curl -X GET "http://localhost:3000/api/variants?search=security"

# Get single variant
curl -X GET "http://localhost:3000/api/variants/cme3cq592001d8owemmgcko13"

# Combined filters
curl -X GET "http://localhost:3000/api/variants?workspaceId=ws_123&search=API&sortBy=updatedAt&sortOrder=asc"
```

## Data Model

### Variant Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (CUID) |
| content | string | The full markdown content of the variant |
| summary | string | Brief description of the variant's purpose |
| workspaceId | string | Associated workspace identifier |
| createdAt | datetime | ISO 8601 timestamp of creation |
| updatedAt | datetime | ISO 8601 timestamp of last update |

## Rate Limiting

Currently, no rate limiting is implemented. Future versions may include:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Changelog

### Version 1.0.0 (2025-08-08)
- Initial release with GET endpoints
- Pagination support
- Workspace filtering
- Search functionality
- Sorting options