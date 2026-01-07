# Backend API Documentation

This document details the API endpoints for the DCA Management System backend.

## Base URL
All API endpoints are prefixed with `/api`.
For example: `http://localhost:5000/api/cases`

## Authentication (`/api/auth`)

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates a user and returns a token and user details.
- **Input (JSON)**:
    - `email` (string): User email
    - `password` (string): User password
- **Processing**: Verifies credentials against the database. For this hackathon version, password check is simplified.
- **Output (JSON)**:
    ```json
    {
      "token": "fake-jwt-token-for-u1",
      "user": {
        "id": "u1",
        "name": "Admin User",
        "email": "admin@fedex.com",
        "role": "fedex"
      }
    }
    ```

### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Description**: Returns the currently authenticated user based on the `Authorization` header.
- **Input (Headers)**:
    - `Authorization`: `Bearer <token>` (Token format: `fake-jwt-token-for-<user_id>`)
- **Processing**: Extracts user ID from the fake token string and fetches user from DB.
- **Output (JSON)**:
    ```json
    {
      "user": {
        "id": "u1",
        "name": "Admin User",
        "email": "admin@fedex.com",
        "role": "fedex"
      }
    }
    ```

### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logs out the user (client-side token removal expected).
- **Input**: None
- **Output (JSON)**: `{"message": "Logged out successfully"}`

---

## Cases (`/api/cases`)

### Get All Cases
- **Endpoint**: `GET /api/cases`
- **Description**: Retrieves a paginated list of cases.
- **Input (Query Params)**:
    - `page` (int, default=1): Page number
    - `limit` (int, default=10): Items per page
    - `search` (string, optional): Search by customer name
    - `status` (string, optional): Filter by case status (e.g., 'pending', 'in_progress')
- **Output (JSON)**:
    ```json
    {
      "cases": [
        {
          "caseId": "CS-2024-001",
          "customerName": "Acme Corporation",
          "amount": 45000,
          "status": "in_progress",
          ...
        }
      ],
      "total": 50,
      "pages": 5,
      "current_page": 1
    }
    ```

### Get Single Case
- **Endpoint**: `GET /api/cases/:id`
- **Description**: Retrieves detailed information for a specific case.
- **Input**: `case_id` (URL parameter)
- **Output (JSON)**: Returns the `Case` object.

### Create Case
- **Endpoint**: `POST /api/cases`
- **Description**: Creates a new debt case.
- **Input (JSON)**:
    - `customerName` (string, required)
    - `amount` (number, required)
    - ... other optional fields
- **Processing**: Generates a new Case ID and saves to DB with status 'pending'.
- **Output (JSON)**: Returns the created `Case` object.

### Update Case
- **Endpoint**: `PUT /api/cases/:id`
- **Description**: Updates case details.
- **Input (JSON)**: Fields to update (e.g., `status`, `amount`).
- **Output (JSON)**: Returns the updated `Case` object.

### Assign Case
- **Endpoint**: `PUT /api/cases/:id/assign`
- **Description**: Assigns a case to a specific agency.
- **Input (JSON)**:
    - `agencyId` (string, required): ID of the agency to assign to.
- **Processing**: Updates case status to 'assigned', sets `assigned_agency_id`, and creates a 'Assigned to DCA' timeline event.
- **Output (JSON)**: Returns the updated `Case` object.

### Get Case Timeline
- **Endpoint**: `GET /api/cases/:id/timeline`
- **Description**: Retrieves history of events for a case.
- **Output (JSON)**: list of `TimelineEvent` objects.
    ```json
    [
      {
        "id": "evt-001",
        "timestamp": "...",
        "eventType": "status_change",
        "title": "Assigned",
        "metadata": { "previousStatus": "pending", "newStatus": "assigned" }
      }
    ]
    ```

### Send Email
- **Endpoint**: `POST /api/cases/:id/email`
- **Description**: Logs an email sent for a case.
- **Input (JSON)**:
    - `subject` (string)
    - `body` (string)
- **Processing**: Creates a new `TimelineEvent` of type 'email'.
- **Output (JSON)**: `{"message": "Email sent", "event": {...}}`

### Log Call
- **Endpoint**: `POST /api/cases/:id/call`
- **Description**: Logs a call made for a case.
- **Input (JSON)**:
    - `notes` (string)
- **Processing**: Creates a new `TimelineEvent` of type 'call'.
- **Output (JSON)**: `{"message": "Call logged", "event": {...}}`

---

## Agencies (`/api/agencies`)

### Get All Agencies
- **Endpoint**: `GET /api/agencies`
- **Description**: Returns a list of all collection agencies.
- **Output (JSON)**: List of `Agency` objects.

### Get Agency Details
- **Endpoint**: `GET /api/agencies/:id`
- **Description**: Returns details for a specific agency.
- **Output (JSON)**: `Agency` object.

### Get Agency Cases
- **Endpoint**: `GET /api/agencies/:id/cases`
- **Description**: Returns all cases assigned to a specific agency.
- **Output (JSON)**: List of `Case` objects.

---

## Customers (`/api/customers`)

### Get All Customers
- **Endpoint**: `GET /api/customers`
- **Description**: Returns a paginated list of customers.
- **Input (Query Params)**: `page`, `limit`, `search`.
- **Output (JSON)**: Paginated response similar to `/api/cases`.

### Get Customer Details
- **Endpoint**: `GET /api/customers/:id`
- **Description**: Returns details for a specific customer including total owed.
- **Output (JSON)**: `Customer` object.

### Get Customer Cases
- **Endpoint**: `GET /api/customers/:id/cases`
- **Description**: Returns all cases linked to a specific customer.
- **Output (JSON)**: List of `Case` objects.

---

## Dashboard & Actions (`/api`)

### Get Dashboard Stats
- **Endpoint**: `GET /api/dashboard/stats`
- **Description**: Aggregate statistics for the main dashboard.
- **Output (JSON)**:
    ```json
    {
      "totalCases": 100,
      "activeCases": 80,
      "resolvedCases": 20,
      "totalDebt": 500000,
      "recoveredAmount": 100000,
      "recoveryRate": 20.0
    }
    ```

### Get Recovery Stats
- **Endpoint**: `GET /api/stats/recovery`
- **Description**: Returns monthly recovery data for charts.
- **Output (JSON)**: List of `{ "month": "Jan", "recovered": 12000 }` objects.

### Get Agency Performance
- **Endpoint**: `GET /api/performance/agencies`
- **Description**: Returns agency list with performance metrics (same as `/api/agencies`).

### Get Pending Actions
- **Endpoint**: `GET /api/actions/pending`
- **Description**: Returns a list of pending actions for the logged-in user.
- **Processing**: Currently returns mock/hardcoded data.
- **Output (JSON)**: List of `Action` objects (id, type, priority, title, description, caseId).
