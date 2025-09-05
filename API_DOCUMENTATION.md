# API Documentation

## Leads API Endpoints

### GET `/api/leads`
Returns all leads with pagination, filtering, and sorting capabilities for infinite scrolling tables.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Number of items per page
- `search` (string) - Search in lead name, email, or company
- `status` (string) - Filter by lead status: "pending", "contacted", "responded", "converted"
- `campaignId` (string) - Filter by campaign ID
- `assignedTo` (string) - Filter by assigned user ID
- `priority` (string) - Filter by priority: "low", "medium", "high"
- `leadSource` (string) - Filter by lead source
- `sortBy` (string, default: "createdAt") - Sort field: "name", "email", "company", "status", "priority", "leadSource", "createdAt", "updatedAt"
- `sortOrder` (string, default: "desc") - Sort order: "asc" or "desc"

**Response Format:**
```json
{
  "data": [
    {
      "id": "lead-id",
      "name": "Lead Name",
      "email": "lead@example.com",
      "phone": "+1234567890",
      "company": "Company Name",
      "position": "Job Title",
      "status": "pending",
      "campaignId": "campaign-id",
      "campaignName": "Campaign Name",
      "lastContactDate": "2024-01-01T00:00:00Z",
      "assignedTo": "user-id",
      "assignedUserName": "User Name",
      "notes": "Lead notes",
      "leadSource": "LinkedIn",
      "priority": "medium",
      "tags": "[\"tag1\", \"tag2\"]",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCount": 200,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "filters": {
    "search": "",
    "status": "",
    "campaignId": "",
    "assignedTo": "",
    "priority": "",
    "leadSource": "",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

### GET `/api/leads/[id]`
Returns detailed lead information including basic data and interaction history.

**Response Format:**
```json
{
  "lead": {
    "id": "lead-id",
    "name": "Lead Name",
    "email": "lead@example.com",
    "phone": "+1234567890",
    "company": "Company Name",
    "position": "Job Title",
    "status": "pending",
    "campaignId": "campaign-id",
    "campaignName": "Campaign Name",
    "lastContactDate": "2024-01-01T00:00:00Z",
    "assignedTo": "user-id",
    "assignedUserName": "User Name",
    "notes": "Lead notes",
    "leadSource": "LinkedIn",
    "priority": "medium",
    "tags": ["tag1", "tag2"],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "interactions": [
    {
      "id": "interaction-id",
      "type": "email",
      "subject": "Follow up email",
      "message": "Email content",
      "scheduledAt": "2024-01-01T00:00:00Z",
      "completedAt": "2024-01-01T00:00:00Z",
      "createdBy": "user-id",
      "createdByName": "User Name",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Campaigns API Endpoints

### GET `/api/campaigns`
Returns all campaigns with pagination, filtering, sorting, and summary statistics for table display.

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 20) - Number of items per page
- `search` (string) - Search in campaign name
- `status` (string) - Filter by campaign status: "draft", "active", "paused", "completed"
- `createdBy` (string) - Filter by creator user ID
- `sortBy` (string, default: "createdAt") - Sort field: "name", "status", "totalLeads", "successfulLeads", "responseRate", "startDate", "endDate", "createdAt", "updatedAt"
- `sortOrder` (string, default: "desc") - Sort order: "asc" or "desc"

**Response Format:**
```json
{
  "data": [
    {
      "id": "campaign-id",
      "name": "Campaign Name",
      "description": "Campaign description",
      "status": "active",
      "totalLeads": 100,
      "successfulLeads": 25,
      "responseRate": "25.00",
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T00:00:00Z",
      "createdBy": "user-id",
      "createdByName": "User Name",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 100,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "filters": {
    "search": "",
    "status": "",
    "createdBy": "",
    "sortBy": "createdAt",
    "sortOrder": "desc"
  },
  "summary": {
    "totalCampaigns": 100,
    "activeCampaigns": 25,
    "totalLeadsAcrossAll": 5000,
    "totalSuccessfulLeads": 1250,
    "avgResponseRate": 25.5
  }
}
```

### GET `/api/campaigns/[id]`
Returns detailed campaign information including analytics, lead statistics, and recent leads.

**Response Format:**
```json
{
  "campaign": {
    "id": "campaign-id",
    "name": "Campaign Name",
    "description": "Campaign description",
    "status": "active",
    "totalLeads": 100,
    "successfulLeads": 25,
    "responseRate": "25.00",
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-12-31T00:00:00Z",
    "createdBy": "user-id",
    "createdByName": "User Name",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "leadStatusStats": [
    {
      "status": "pending",
      "count": 50
    },
    {
      "status": "contacted",
      "count": 30
    },
    {
      "status": "responded",
      "count": 15
    },
    {
      "status": "converted",
      "count": 5
    }
  ],
  "recentLeads": [
    {
      "id": "lead-id",
      "name": "Lead Name",
      "email": "lead@example.com",
      "company": "Company Name",
      "status": "pending",
      "priority": "medium",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "analytics": [
    {
      "id": "analytics-id",
      "date": "2024-01-01T00:00:00Z",
      "leadsAdded": 10,
      "leadsContacted": 8,
      "leadsResponded": 3,
      "leadsConverted": 1,
      "emailsSent": 50,
      "emailsOpened": 25,
      "emailsClicked": 5,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "conversionFunnel": {
    "totalLeads": 100,
    "contacted": 75,
    "responded": 30,
    "converted": 10
  },
  "metrics": {
    "conversionRate": 10.0,
    "contactRate": 75.0,
    "responseRate": 40.0
  }
}
```

## Features Included:

### For Leads API:
- ✅ Pagination for infinite scrolling
- ✅ Search across name, email, company
- ✅ Filter by status, campaign, assigned user, priority, lead source
- ✅ Sorting by multiple fields
- ✅ Join with campaign and user tables for related data
- ✅ Interaction history in detailed view

### For Campaigns API:
- ✅ Pagination for table display
- ✅ Search by campaign name
- ✅ Filter by status and creator
- ✅ Sorting by multiple fields
- ✅ Summary statistics across all campaigns
- ✅ Detailed analytics and metrics in individual campaign view
- ✅ Lead status breakdown and conversion funnel
- ✅ Recent leads preview

All APIs use Drizzle ORM with proper error handling and TypeScript types.
