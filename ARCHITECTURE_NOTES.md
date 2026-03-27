# AgileTaskManager - Architecture Notes

## Project Overview

**Framework**: Express.js with TypeScript  
**Architecture Pattern**: MVC (Models, Views, Controllers, Services)  
**Port**: 4000  
**Build**: TypeScript compiled to JavaScript in `/dist` directory

---

## 1. Core Architecture

### Directory Structure
```
src/
├── App.ts                 # Express app setup and middleware configuration
├── index.ts               # Server entry point
├── controllers/           # HTTP request handlers
├── routes/                # Route definitions
├── services/              # Business logic and data operations
├── models/                # Data models and type definitions
├── errors/                # Custom error classes
└── middleware/            # Express middleware (error handling, etc.)
```

### Request Flow
```
Request → Route → Controller → Service → Response
```

1. **Route** accepts HTTP request to endpoint
2. **Controller** extracts request data and calls service
3. **Service** handles business logic and validation
4. **Response** returns JSON with appropriate status code

### Middleware Stack
- `express.json()` - Parses JSON request bodies
- Error handling middleware catches exceptions and returns standardized error responses

---

## 2. `/health` Endpoint

**Purpose**: Verify application is running and responsive

**What it is**: Health check route that provides uptime and timestamp information

**Why it exists**: Enables monitoring and orchestration platforms to verify service availability

**Who uses it**:
- Infrastructure monitoring tools (NewRelic, Datadog, etc.)
- Load balancers for routing decisions
- Container orchestrators (Kubernetes liveness probes)
- Developers for manual connectivity testing

**Endpoint Details**:
- **Method**: GET
- **Path**: `/health`
- **Response**: `{"status":"OK","uptime":7,"timestamp":"2026-03-25T01:43:40.277Z"}`
- **Status Code**: 200

**Error Scenarios**:
- Returns 404 if application is not running

**Production Considerations**:
- Keep checks lightweight (no expensive operations)
- Consider liveness vs readiness probes:
  - **Liveness**: Is the app running?
  - **Readiness**: Are all dependencies ready?
- Fast response time is critical for high-frequency monitoring polls

---

## 3. `/users` Endpoint (User CRUD Operations)

### Overview
Complete user management system with create, read, update, delete (CRUD) operations.

### Endpoints

#### 3.1 Get All Users
- **Method**: GET
- **Path**: `/users`
- **Response**: 
  - 200 OK (returns array of all users)
    ```json
    [
      {
        "id": "usr_user_1",
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securePassword123"
      },
      {
        "id": "usr_user_2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "password": "anotherPassword456"
      }
    ]
    ```
  - 404 No users found

#### 3.2 Create User
- **Method**: POST
- **Path**: `/users`
- **Request Body**:
  ```json
  {
    "id": "usr_unique_id",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: 
  - 201 Created
    ```json
    {
      "id": "usr_unique_id",
      "name": "John Doe",
      "email": "john@example.com",
      "password": "securePassword123"
    }
    ```
  - 400 Bad request (malformed JSON)
  - 422 Validation error (see Validation System section)

#### 3.3 Get User by ID
- **Method**: GET
- **Path**: `/users/:id`
- **Response**: 
  - 200 OK (returns user object)
  - 404 User not found

#### 3.4 Update User
- **Method**: PUT
- **Path**: `/users/:id`
- **Request Body**: Same as create (all fields required)
  ```json
  {
    "id": "usr_unique_id",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "password": "newPassword789"
  }
  ```
- **Response**: 
  - 200 OK (returns updated user object)
  - 404 User not found
  - 422 Validation error (see Validation System section)

#### 3.5 Delete User
- **Method**: DELETE
- **Path**: `/users/:id`
- **Response**: 
  - 200 OK with success message
    ```json
    {
      "message": "User deleted successfully"
    }
    ```
  - 404 User not found

---

## 4. Validation System

### User Model Validation

All validations are performed in `UserService.validateUser()`:

| Field | Rules | Error Code |
|-------|-------|------------|
| `id` | Required, must be string, non-empty | 422 |
| `name` | Required, must be string, non-empty | 422 |
| `email` | Required, must be string, valid email format (regex) | 422 |
| `password` | Required, string, minimum 8 characters | 422 |

### Email Uniqueness Validation

**Feature**: Duplicate email detection prevents multiple users from sharing the same email address during user creation.

**Implementation**:
- `isDuplicateEmail(email, excludeId?)` private method in `UserService`
- Checks during user creation (POST) only
- Throws `ValidationError` with status 422 if duplicate detected
- Note: The `excludeId` parameter is available for future use when update validation is needed

**Current Behavior**:
- **Creating user with unique email**: ✅ Succeeds with 201 Created
- **Creating user with duplicate email**: ❌ Fails with 422 Validation Error ("Email is already in use")
- **Updating user email to another user's email**: ✅ Currently allowed (no duplicate check on update)
- **Updating user with their own email**: ✅ Succeeds with 200 OK

**TODO**: Implement duplicate email validation during updates (PUT endpoint)

---

## 5. Error Handling

### HTTP Status Codes

| Status | Scenario | Example |
|--------|----------|---------|
| 200 | Success (GET, PUT, DELETE) | User retrieved or updated successfully |
| 201 | Resource created successfully | User created with POST |
| 400 | Bad request - malformed JSON | Invalid JSON sent in request body |
| 404 | Resource not found | User ID doesn't exist |
| 422 | Validation error | Invalid email format, duplicate email, password too short, required field missing |
| 500 | Internal server error | Unexpected exception during processing |

### Custom Error Classes

**ValidationError** (Status: 422)
- Extends `CustomError` base class
- Used for data validation failures
- Response format:
  ```json
  [
    {
      "message": "Email is already in use",
      "code": "VALIDATION_ERROR",
      "statusCode": 422
    }
  ]
  ```

### Error Handling in Controllers

All controllers that handle user data (create/update) implement try-catch blocks:

1. **ValidationError**: Caught and returns 422 with error details
2. **Other exceptions**: Return 500 Internal Server Error
3. **Not found scenarios**: Return 404 when user doesn't exist
4. **No results**: Return 404 when no users exist in getAllUsers

**Example from createUser()**:
```typescript
try {
    const createdUser = await UserService.createUser(user);
    res.status(201).json(createdUser);
} catch (error) {
    if (error instanceof ValidationError) {
        return res.status(error.statusCode).json(error.serializeErrors());
    }
    res.status(500).json({ message: 'Internal server error' });
}
```

**Example from getAllUsers()**:
```typescript
const users = await UserService.getAllUsers();
if (users.length === 0) {
    return res.status(404).json({ message: 'No users found' });
}
res.status(200).json(users);
```

---

## 6. Data Layer

### In-Memory Storage

**Current Implementation**: `UserModel[]` array in `UserService`
- Users stored in memory during application runtime
- Data is lost when server restarts
- Suitable for development and testing

**Future Considerations**:
- Migrate to persistent database (MongoDB, PostgreSQL, etc.)
- Implement connection pooling
- Add transaction support for multi-step operations

### UserModel Structure

```typescript
class UserModel {
    id: string;              // UUID or unique identifier
    name: string;            // User's full name
    email: string;           // Unique email address
    password: string;        // Currently stored as plain text (TODO: hash)
    createdAt?: string;      // ISO timestamp of creation
}
```

**Security Note**: Passwords are stored as plain text. In production, implement bcrypt or similar hashing.

---

## 7. Request/Response Examples

### Success Scenarios

**Create User (Success)**:
```
POST /users
Status: 201
Response: User object with all fields
```

**Get User (Success)**:
```
GET /users/usr_123
Status: 200
Response: User object
```

**Update User (Success)**:
```
PUT /users/usr_123
Status: 200
Response: Updated user object
```

**Delete User (Success)**:
```
DELETE /users/usr_123
Status: 200
Response: {"message": "User deleted successfully"}
```

### Error Scenarios

**Validation Error** (Duplicate Email):
```
POST /users
Status: 422
Response: [{"message": "Email is already in use", "code": "VALIDATION_ERROR", "statusCode": 422}]
```

**Invalid Email Format**:
```
POST /users
Status: 422
Response: [{"message": "Email format is invalid", "code": "VALIDATION_ERROR", "statusCode": 422}]
```

**User Not Found**:
```
GET /users/nonexistent_id
Status: 404
Response: {"message": "User not found"}
```

---

## 8. Production TODOs

### Security
- [ ] Hash passwords with bcrypt before storage
- [ ] Implement JWT authentication
- [ ] Add rate limiting
- [ ] Validate request size limits
- [ ] Implement CORS properly

### Data Persistence
- [ ] Replace in-memory storage with database
- [ ] Add connection pooling
- [ ] Implement transaction support
- [ ] Add database migrations

### Monitoring & Logging
- [ ] Add structured logging
- [ ] Implement request/response logging
- [ ] Add performance monitoring
- [ ] Set up error tracking (Sentry, etc.)

### Validation & Testing
- [ ] Add comprehensive unit tests
- [ ] Add integration tests
- [ ] Add API contract testing
- [ ] Implement input sanitization
- [ ] Add SQL injection prevention (if using database)

### API Design
- [ ] Add pagination for list endpoints
- [ ] Add filtering and sorting
- [ ] Implement versioning (v1, v2)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Consider GraphQL alternative