# Smart Split API Documentation

This document describes the available REST API endpoints for the Smart Split application backend.

**Base URL**: `http://localhost:3000` (or your deployed server URL)
**Response Format**: All successful responses return a JSON object wrapping the payload inside a `data` key and include a descriptive `message`:
```json
{
  "data": { ... },
  "message": "Operation successful"
}
```

---

## 🧑‍🤝‍🧑 Users API (`/users`)

Manage the participants or users in the group.

### Get All Users
- **Endpoint**: `GET /users`
- **Description**: Returns a list of all registered users.
- **Example cURL**:
  ```bash
  curl -X GET http://localhost:3000/users
  ```


### Create User
- **Endpoint**: `POST /users`
- **Description**: Creates a new user in the system without requiring authentication.
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Example cURL**:
  ```bash
  curl -X POST http://localhost:3000/users \
       -H "Content-Type: application/json" \
       -d '{"name":"Jane Doe","email":"jane@example.com","password":"pwd"}'
  ```


## 💸 Expenses API (`/expenses`)

Manage shared transactions, calculate debts, and optimize settlements.

### Get All Expenses
- **Endpoint**: `GET /expenses/all`
- **Description**: Returns all recorded expenses, populated with Payer and Participant details.
- **Example cURL**:
  ```bash
  curl -X GET http://localhost:3000/expenses/all
  ```

### Create Expense
- **Endpoint**: `POST /expenses/create`
- **Description**: Records a new expense and automatically updates all relevant user balances. Supports `EQUAL` and `UNEQUAL` split types.
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "name": "Dinner",
    "description": "Team lunch at downtown",
    "totalAmount": 100,
    "payer": "userId1",
    "splitType": "EQUAL",
    "participants": [
      { "user": "userId1" },
      { "user": "userId2" }
    ]
  }
  ```
  *(Note: for `UNEQUAL` splits, include the `share` property for each participant: `{ "user": "userId1", "share": 60 }`)*
- **Example cURL**:
  ```bash
  curl -X POST http://localhost:3000/expenses/create \
       -H "Content-Type: application/json" \
       -d '{"name":"Coffee","totalAmount":15,"payer":"id","splitType":"EQUAL","participants":[{"user":"id"}]}'
  ```

### Delete Expense
- **Endpoint**: `DELETE /expenses/:id`
- **Description**: Deletes an expense and automatically reverses all associated balance impacts.

### Get Current Balances
- **Endpoint**: `GET /expenses/balances`
- **Description**: Returns the raw debt network outlining exactly who owes whom across the group.
- **Response Format**:
  Will return an array of objects representing debts, e.g.:
  `[{ "userFromName": "Alice", "userToName": "Bob", "amount": 50 }]`

### Get Optimized Settlements
- **Endpoint**: `GET /expenses/settlements`
- **Description**: Runs a greedy two-pointer algorithm to simplify all complex overlapping group debts into the fewest possible direct payments.
- **Response Format**:
  Similar structured objects mapping who should pay whom to settle all balances immediately.

---

## ⚙️ System (`/`)

### Health Check
- **Endpoint**: `GET /`
- **Description**: Used to quickly ping and verify that the Express server is online and responding.
