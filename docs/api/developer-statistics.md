# Developer Statistics API Documentation

## Overview
The Developer Statistics API provides endpoints to track and retrieve pull request statistics for developers within a workspace. It stores information about merged PRs including the developer who created them, when they were merged, and estimated development time.

## Base URL
`/api/developer-statistics`

## Authentication
Currently, no authentication is required. This may change in future versions.

## Endpoints

### List Developer Statistics by Workspace
```
GET /api/developer-statistics
```

Retrieves developer statistics filtered by workspace ID. The `workspaceId` parameter is required.

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| workspaceId | string | Yes | - | The workspace ID to filter statistics |
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Items per page (max 100) |
| sortBy | string | No | mergedDate | Field to sort by (user, prNumber, mergedDate, estimatedTime, createdAt, updatedAt) |
| sortOrder | string | No | desc | Sort order (asc or desc) |

#### Response
```json
{
  "data": [
    {
      "id": "cuid-string",
      "user": "john-doe",
      "workspaceId": "workspace-123",
      "prNumber": 42,
      "mergedDate": "2024-01-15T10:00:00.000Z",
      "estimatedTime": 5.5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "workspaceId": "workspace-123"
  }
}
```

### Create Developer Statistic
```
POST /api/developer-statistics
```

Creates a new developer statistic entry for a merged pull request.

#### Request Body
```json
{
  "user": "john-doe",
  "workspaceId": "workspace-123",
  "prNumber": 42,
  "mergedDate": "2024-01-15T10:00:00.000Z",
  "estimatedTime": 5.5
}
```

#### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user | string | Yes | GitHub username of the PR author |
| workspaceId | string | Yes | ID of the workspace |
| prNumber | number | Yes | Pull request number |
| mergedDate | string/Date | Yes | ISO 8601 date when PR was merged |
| estimatedTime | number | No | Estimated development time in hours |

#### Response
```json
{
  "id": "cuid-string",
  "user": "john-doe",
  "workspaceId": "workspace-123",
  "prNumber": 42,
  "mergedDate": "2024-01-15T10:00:00.000Z",
  "estimatedTime": 5.5,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Error Responses

### 400 Bad Request
Returned when required parameters are missing or invalid.

```json
{
  "error": "workspaceId parameter is required"
}
```

```json
{
  "error": "PR number is required and must be a number"
}
```

```json
{
  "error": "Invalid merged date format"
}
```

### 409 Conflict
Returned when trying to create a duplicate entry.

```json
{
  "error": "A developer stat with these unique fields already exists"
}
```

### 500 Internal Server Error
Returned when a server error occurs.

```json
{
  "error": "Failed to fetch developer statistics"
}
```

## Usage Examples

### JavaScript/TypeScript

#### Using the API Client Functions
```javascript
import { 
  getDeveloperStatsByWorkspace, 
  createDeveloperStat,
  getWorkspaceSummaryStats 
} from '@/lib/api/developer-statistics';

// Fetch statistics for a workspace
const stats = await getDeveloperStatsByWorkspace('workspace-123', {
  page: 1,
  limit: 20,
  sortBy: 'mergedDate',
  sortOrder: 'desc'
});
console.log(stats.data);

// Create a new statistic entry
const newStat = await createDeveloperStat({
  user: 'john-doe',
  workspaceId: 'workspace-123',
  prNumber: 42,
  mergedDate: new Date('2024-01-15'),
  estimatedTime: 5.5
});

// Get summary statistics for a workspace
const summary = await getWorkspaceSummaryStats('workspace-123');
console.log(`Total PRs: ${summary.totalPRs}`);
console.log(`Average time per PR: ${summary.averageTimePerPR} hours`);
```

#### Direct Fetch Calls
```javascript
// GET request
const response = await fetch('/api/developer-statistics?workspaceId=workspace-123&page=1&limit=10');
const data = await response.json();

// POST request
const response = await fetch('/api/developer-statistics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user: 'john-doe',
    workspaceId: 'workspace-123',
    prNumber: 42,
    mergedDate: '2024-01-15T10:00:00Z',
    estimatedTime: 5.5
  })
});
const newStat = await response.json();
```

### cURL

#### List Statistics
```bash
# Get statistics for a workspace
curl -X GET "http://localhost:3000/api/developer-statistics?workspaceId=workspace-123&page=1&limit=10"

# With sorting
curl -X GET "http://localhost:3000/api/developer-statistics?workspaceId=workspace-123&sortBy=estimatedTime&sortOrder=desc"
```

#### Create Statistic
```bash
curl -X POST "http://localhost:3000/api/developer-statistics" \
  -H "Content-Type: application/json" \
  -d '{
    "user": "john-doe",
    "workspaceId": "workspace-123",
    "prNumber": 42,
    "mergedDate": "2024-01-15T10:00:00Z",
    "estimatedTime": 5.5
  }'
```

## Data Validation

### GitHub Username Format
- Must be 1-39 characters long
- Can contain alphanumeric characters and hyphens
- Cannot start or end with a hyphen
- Cannot have consecutive hyphens

### PR Number
- Must be a positive integer
- Cannot be 0 or negative

### Merged Date
- Must be a valid ISO 8601 date string
- Cannot be in the future

### Estimated Time
- Must be a positive number
- Maximum value: 1000 hours
- Can include decimals (e.g., 5.5 hours)

## Performance Considerations

- The API implements pagination to handle large datasets efficiently
- Default page size is 10 items, maximum is 100
- Database queries use indexes on `workspaceId`, `user`, and `mergedDate` for optimal performance
- All database operations use Prisma's query optimization

## Future Enhancements

Planned features for future versions:
- Authentication and authorization
- Bulk create/update operations
- Additional filtering options (date ranges, multiple users)
- Aggregation endpoints for analytics
- Webhook support for automated PR tracking
- Export functionality (CSV, JSON)