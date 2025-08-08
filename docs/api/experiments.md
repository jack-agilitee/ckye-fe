# Experiments API Documentation

## Overview
The Experiments API provides endpoints to manage experiments - get experiments by workspace, create new experiments, and update experiment status (activate/deactivate/complete).

## Base URL
`/api/experiments`

## Authentication
Currently, no authentication is required. Future versions may require Bearer token authentication.

## Endpoints

### Get Experiments by Workspace
Retrieve experiments filtered by workspace ID with optional status filtering.

```
GET /api/experiments?workspaceId={workspaceId}
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| workspaceId | string | Yes | - | Filter experiments by workspace ID |
| status | string | No | - | Filter by status (active, inactive, completed) |
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of items per page |
| sortBy | string | No | createdAt | Field to sort by |
| sortOrder | string | No | desc | Sort order (asc or desc) |

#### Response
```json
{
  "data": [
    {
      "id": "cuid_string",
      "name": "Experiment Name",
      "description": "Experiment description",
      "variantId": "variant_cuid",
      "workspaceId": "workspace_cuid",
      "status": "active",
      "startDate": "2025-08-08T21:42:16.598Z",
      "endDate": null,
      "metrics": {
        "views": 1000,
        "conversions": 50
      },
      "createdBy": "user_cuid",
      "createdAt": "2025-08-08T21:42:16.598Z",
      "updatedAt": "2025-08-08T21:42:16.598Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Create Experiment
Create a new experiment.

```
POST /api/experiments
```

#### Request Body
```json
{
  "name": "A/B Test Homepage",
  "description": "Testing new homepage layout",
  "workspaceId": "workspace_cuid",
  "variantId": "variant_cuid",
  "status": "inactive",
  "startDate": "2025-08-10T00:00:00Z",
  "endDate": "2025-08-20T00:00:00Z",
  "metrics": {
    "targetConversionRate": 5
  },
  "createdBy": "user_cuid"
}
```

#### Required Fields
- `name` (string): Experiment name
- `workspaceId` (string): Associated workspace ID

#### Optional Fields
- `description` (string): Detailed description
- `variantId` (string): Associated variant ID
- `status` (string): Initial status (default: "inactive")
- `startDate` (datetime): Experiment start date
- `endDate` (datetime): Experiment end date
- `metrics` (object): JSON object with experiment metrics
- `createdBy` (string): User ID of creator

#### Response
```json
{
  "id": "new_experiment_cuid",
  "name": "A/B Test Homepage",
  "description": "Testing new homepage layout",
  "variantId": "variant_cuid",
  "workspaceId": "workspace_cuid",
  "status": "inactive",
  "startDate": "2025-08-10T00:00:00.000Z",
  "endDate": "2025-08-20T00:00:00.000Z",
  "metrics": {
    "targetConversionRate": 5
  },
  "createdBy": "user_cuid",
  "createdAt": "2025-08-08T21:42:16.598Z",
  "updatedAt": "2025-08-08T21:42:16.598Z"
}
```

### Update Experiment Status
Update the status of an experiment (activate, deactivate, or complete).

```
PATCH /api/experiments
```

#### Request Body
```json
{
  "id": "experiment_cuid",
  "status": "active",
  "metrics": {
    "views": 1500,
    "conversions": 75
  },
  "preserveDates": false
}
```

#### Required Fields
- `id` (string): Experiment ID
- `status` (string): New status (active, inactive, completed)

#### Optional Fields
- `metrics` (object): Updated metrics
- `preserveDates` (boolean): If false (default), automatically sets:
  - `startDate` when activating (if not already set)
  - `endDate` when completing (if not already set)

#### Response
```json
{
  "id": "experiment_cuid",
  "name": "A/B Test Homepage",
  "description": "Testing new homepage layout",
  "variantId": "variant_cuid",
  "workspaceId": "workspace_cuid",
  "status": "active",
  "startDate": "2025-08-08T21:42:16.598Z",
  "endDate": null,
  "metrics": {
    "views": 1500,
    "conversions": 75
  },
  "createdBy": "user_cuid",
  "createdAt": "2025-08-08T20:00:00.000Z",
  "updatedAt": "2025-08-08T21:42:16.598Z"
}
```

## Status Values

| Status | Description |
|--------|-------------|
| inactive | Experiment created but not started |
| active | Experiment is currently running |
| completed | Experiment has finished |

## Error Responses

### 400 Bad Request
Returned when required parameters are missing or invalid.

```json
{
  "error": "workspaceId is required"
}
```

```json
{
  "error": "Invalid status. Must be one of: active, inactive, completed"
}
```

### 404 Not Found
Returned when an experiment doesn't exist.

```json
{
  "error": "Experiment not found"
}
```

### 409 Conflict
Returned when trying to create a duplicate experiment.

```json
{
  "error": "An experiment with this name already exists"
}
```

### 500 Internal Server Error
Returned when a server error occurs.

```json
{
  "error": "Failed to fetch experiments"
}
```

## Usage Examples

### JavaScript/TypeScript

#### Using the API Client Functions

```javascript
import { 
  getExperimentsByWorkspace,
  getActiveExperiments,
  createExperiment,
  activateExperiment,
  deactivateExperiment,
  completeExperiment
} from '@/lib/api/experiments';

// Get all experiments for a workspace
const experiments = await getExperimentsByWorkspace('workspace_id', {
  page: 1,
  limit: 20
});

// Get only active experiments
const activeExperiments = await getActiveExperiments('workspace_id');

// Create a new experiment
const newExperiment = await createExperiment({
  name: 'Homepage Redesign Test',
  description: 'Testing new homepage layout',
  workspaceId: 'workspace_id',
  variantId: 'variant_id',
  status: 'inactive'
});

// Activate an experiment
const activated = await activateExperiment('experiment_id');

// Deactivate an experiment
const deactivated = await deactivateExperiment('experiment_id');

// Complete an experiment with final metrics
const completed = await completeExperiment('experiment_id', {
  views: 10000,
  conversions: 500,
  conversionRate: 5
});
```

### React Component Example

```jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  getExperimentsByWorkspace, 
  createExperiment,
  activateExperiment 
} from '@/lib/api/experiments';

export default function ExperimentsList({ workspaceId }) {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const response = await getExperimentsByWorkspace(workspaceId);
        setExperiments(response.data);
      } catch (error) {
        console.error('Failed to fetch experiments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, [workspaceId]);

  const handleCreateExperiment = async () => {
    try {
      const newExperiment = await createExperiment({
        name: 'New Experiment',
        workspaceId,
        description: 'Testing a new feature'
      });
      
      // Refresh the list
      const response = await getExperimentsByWorkspace(workspaceId);
      setExperiments(response.data);
    } catch (error) {
      console.error('Failed to create experiment:', error);
    }
  };

  const handleActivate = async (experimentId) => {
    try {
      await activateExperiment(experimentId);
      
      // Refresh the list
      const response = await getExperimentsByWorkspace(workspaceId);
      setExperiments(response.data);
    } catch (error) {
      console.error('Failed to activate experiment:', error);
    }
  };

  if (loading) return <div>Loading experiments...</div>;

  return (
    <div>
      <button onClick={handleCreateExperiment}>Create Experiment</button>
      {experiments.map(experiment => (
        <div key={experiment.id}>
          <h3>{experiment.name}</h3>
          <p>Status: {experiment.status}</p>
          {experiment.status === 'inactive' && (
            <button onClick={() => handleActivate(experiment.id)}>
              Activate
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### cURL Examples

```bash
# Get experiments for a workspace
curl -X GET "http://localhost:3000/api/experiments?workspaceId=workspace_123"

# Get active experiments only
curl -X GET "http://localhost:3000/api/experiments?workspaceId=workspace_123&status=active"

# Create a new experiment
curl -X POST "http://localhost:3000/api/experiments" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Button Color Test",
    "description": "Testing CTA button colors",
    "workspaceId": "workspace_123",
    "variantId": "variant_456"
  }'

# Activate an experiment
curl -X PATCH "http://localhost:3000/api/experiments" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "experiment_789",
    "status": "active"
  }'

# Complete an experiment with metrics
curl -X PATCH "http://localhost:3000/api/experiments" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "experiment_789",
    "status": "completed",
    "metrics": {
      "totalViews": 5000,
      "conversions": 250,
      "conversionRate": 5
    }
  }'
```

## Data Model

### Experiment Object

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (CUID) |
| name | string | Experiment name |
| description | string | Detailed description |
| variantId | string | Associated variant ID |
| workspaceId | string | Associated workspace ID |
| status | string | Current status (active/inactive/completed) |
| startDate | datetime | When experiment started |
| endDate | datetime | When experiment ended |
| metrics | object | JSON object with metrics |
| createdBy | string | User ID who created it |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last update timestamp |

## Best Practices

1. **Always specify workspaceId** when fetching experiments
2. **Use status filters** to get relevant experiments
3. **Track metrics** throughout the experiment lifecycle
4. **Set appropriate dates** for experiment duration
5. **Complete experiments** when finished to maintain data integrity

## Changelog

### Version 1.0.0 (2025-08-08)
- Initial release with GET, POST, and PATCH endpoints
- Support for workspace filtering
- Status management (active/inactive/completed)
- Metrics tracking
- Automatic date management