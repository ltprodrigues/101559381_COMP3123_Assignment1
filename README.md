# COMP3123 Assignment 1

Letícia Rodrigues  
Student Number: 101559381

## About

This project is a backend API for managing employees. Users can create an account, log in, and manage the employees they created.

The API uses Node.js, Express, and MongoDB Atlas.

## Technologies

- Express and Mongoose
- bcrypt for password hashing
- jsonwebtoken for JWT authentication
- express-validator for input validation
- Helmet for security headers
- express-rate-limit for authentication rate limiting
- Winston and Morgan for local logging
- dotenv for environment variables
- Nodemon for development
- Postman for API testing

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ltprodrigues/101559381_COMP3123_Assignment1.git
cd 101559381_COMP3123_Assignment1
npm install
```

### MongoDB Atlas

1. Create a database named `comp3123_assignment1`.
2. Create a database user with read/write access to this database.
3. Add your current IP address to the network access list.
4. Get the cluster connection string.

The database runs on Atlas, so a local MongoDB installation is not required. The cluster must be available when starting the application.

### Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/comp3123_assignment1
JWT_SECRET=replace_with_a_random_secret
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

- `PORT`: port used by the server.
- `MONGODB_URI`: connection string for the assignment database.
- `JWT_SECRET`: secret used to sign and verify tokens.
- `JWT_EXPIRES_IN`: token lifetime.
- `NODE_ENV`: application environment.

Generate a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

If the database password contains reserved URL characters, percent-encode them in the connection string.

The actual `.env` file is excluded from Git.

### Start the Server

For development:

```bash
npm run dev
```

To run without Nodemon:

```bash
npm start
```

The application connects to MongoDB before starting the server.

Default URL:

```text
http://localhost:3000
```

## Project Structure

- `app.js`: configures Express, middleware, and routes.
- `server.js`: loads configuration, connects to MongoDB, and starts the server.
- `config/`: database connection.
- `models/`: User and Employee schemas.
- `controllers/`: authentication and employee operations.
- `routes/`: API endpoint definitions.
- `middleware/`: authentication, validation, error handling, and rate limiting.
- `validators/`: request validation rules.
- `utils/`: logger.
- `logs/`: generated local logs.
- `postman/`: exported Postman collection.
- `screenshots/`: testing and database evidence.

## Endpoints

### Users

- POST `/api/v1/user/signup` — Register a user. Returns 201.
- POST `/api/v1/user/login` — Log in and receive a JWT. Returns 200.

### Employees

All employee endpoints require a Bearer token.

- GET `/api/v1/emp/employees` — List the current user's employees. Returns 200.
- POST `/api/v1/emp/employees` — Create an employee. Returns 201.
- GET `/api/v1/emp/employees/:eid` — Get an employee by ID. Returns 200.
- PUT `/api/v1/emp/employees/:eid` — Update an employee. Returns 200.
- DELETE `/api/v1/emp/employees?eid=EMPLOYEE_ID` — Delete an employee. Returns 204 with no response body.

### Health Check

- GET `/health` — Check the API and database connection. Returns 200.

## Signup

Example request body:

```json
{
  "username": "testusera",
  "email": "usera@example.com",
  "password": "StudyPass123!"
}
```

Username and email must be unique.

Passwords must contain:

- At least eight characters
- An uppercase letter
- A lowercase letter
- A number

Passwords are limited to 72 UTF-8 bytes to avoid bcrypt truncation.

Successful signup returns the user's ID, username, email, and timestamps. It does not return the password or hash.

## Login and JWT

Login accepts either username or email with a password.

Using username:

```json
{
  "username": "testusera",
  "password": "StudyPass123!"
}
```

Using email:

```json
{
  "email": "usera@example.com",
  "password": "StudyPass123!"
}
```

Provide one identifier per request.

Successful login returns a JWT. Send it with employee requests:

```text
Authorization: Bearer YOUR_TOKEN
```

The token uses HS256 and stores the user's ID in the `sub` claim.

The authentication middleware checks the signature, expiration, and whether the user still exists. Missing, invalid, or expired tokens return 401.

## Employee Requests

POST and PUT require all seven editable fields:

```json
{
  "first_name": "Ana",
  "last_name": "Silva",
  "email": "ana@example.com",
  "position": "Software Developer",
  "salary": 75000,
  "date_of_joining": "2026-10-01",
  "department": "IT"
}
```

Salary must be a JSON number greater than or equal to `0.01`.

The joining date must be a valid calendar date in `YYYY-MM-DD` format.

MongoDB generates the employee `_id`. The server assigns the `user` field from the authenticated account. Clients cannot supply these fields.

User and Employee documents include `created_at` and `updated_at` timestamps.

## Employee Ownership

Each employee has a `user` field containing the owner's ObjectId. This references a document in the users collection.

When creating an employee, the controller uses the authenticated user's ID.

Employee lists are filtered by owner. Individual retrieval, update, and deletion check ownership before continuing.

Requests for another user's employee return 403. Changing the employee ID in the URL or query does not bypass this check.

## Security

### Passwords

Passwords are hashed with bcrypt using a cost factor of 12 before being saved.

Login uses `bcrypt.compare()` to check the submitted password against the stored hash.

Passwords and hashes are not included in API responses.

### Helmet

Helmet adds HTTP security headers, including Content Security Policy, frame protection, and content-type protection.

The response headers can be checked in Postman.

### Rate Limiting

Signup and login share a limit of 20 requests per IP address within a 15-minute window.

This limits repeated authentication attempts. Requests above the limit return 429 with a message asking the client to try again later.

The limiter uses an in-memory store, so its counters reset when the server restarts.

### Input Validation

express-validator checks required fields, string lengths, email formats, passwords, salary, dates, and MongoDB IDs.

Invalid requests return 400 with field names and validation messages.

### Configuration

Database credentials and the JWT secret are stored in `.env`.

The repository includes `.env.example` with placeholders. It does not include the actual secrets.

## Error Handling

Errors return JSON responses.

- 400: invalid fields, invalid IDs, or malformed JSON.
- 401: invalid login credentials or missing, invalid, or expired tokens.
- 403: the employee belongs to another user.
- 404: the employee or route does not exist.
- 409: username or email already exists.
- 429: authentication rate limit exceeded.
- 500: unexpected server error.

The centralized error handler avoids exposing stack traces or database credentials in responses.

## Local Logs

Logs are written to:

```text
logs/app.log
```

Morgan records HTTP methods, request paths, response statuses, and request duration. Winston writes timestamped JSON entries to the file.

Logged events include:

- Server startup
- Successful signup
- Successful and failed login
- Validation failures
- Employee ownership failures
- Handled errors

Passwords, password hashes, full tokens, database credentials, request bodies, and authorization headers are not intentionally logged.

Generated logs are excluded from Git. Logging evidence is included in the screenshots folder.

## Health Check

Send:

```text
GET http://localhost:3000/health
```

Expected response when connected:

```json
{
  "status": "ok",
  "message": "API is running",
  "database": "connected"
}
```

This endpoint does not require authentication.

## Postman Testing

Import:

```text
postman/COMP3123_Assignment1.postman_collection.json
```

Set the collection variable `baseUrl` to:

```text
http://localhost:3000
```

Create and select a local environment with:

- `tokenA`: token returned by User A's login.
- `tokenB`: token returned by User B's login.
- `expiredToken`: an expired token used for testing.

Log in as each user and copy the returned token into the matching variable. Use these variables in the Bearer Token fields.

Employee IDs depend on the database. Replace IDs in request URLs with the `_id` values returned when creating or listing employees.

### Test Scenarios

The collection includes:

- Signup and login with username or email
- Duplicate usernames and emails
- Missing or invalid fields
- Employee creation, listing, retrieval, update, and deletion
- Missing, invalid, and expired tokens
- Invalid and non-existing employee IDs
- Malformed JSON
- Cross-user access attempts
- Rate limiting

Ownership was tested in both directions: A attempting to access B's employee and B attempting to access A's employee.

Repeated authentication requests were sent until the API returned 429. Run this test last because it temporarily blocks signup and login.

A successful signup test needs an unused username and email. Repeating it with existing data returns 409.

Deletion tests need an existing employee owned by the authenticated user. Requests for the deleted employee then return 404.

### Test Accounts

User A:

```text
Username: testusera
Email: usera@example.com
Password: StudyPass123!
```

User B:

```text
Username: testuserb
Email: userb@example.com
Password: StudyPass123!
```

These are fictional application accounts, not Atlas database credentials.

If using a new database, create the accounts through signup first.


## Deployment

The API is hosted on Vercel:

https://101559381-comp-3123-assignment1.vercel.app

Health check:

https://101559381-comp-3123-assignment1.vercel.app/health

The root URL has no homepage. Use /health to check the API status.

Production environment variables are configured in Vercel.


Locally, logs are written to logs/app.log. On Vercel, logs are
sent to the console and viewed through Runtime Logs.

The authentication rate limiter uses in-memory counters per
instance. Counters are not shared between Vercel instances.

## Screenshots

The screenshots folder contains evidence of:

- Signup and login
- Employee CRUD
- Validation and error responses
- JWT and ownership checks
- Rate limiting
- Helmet headers
- Health check
- Local logging
- MongoDB users, password hashes, and employee ownership