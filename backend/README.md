# User Registration Endpoint

This document explains the `/users/register` endpoint and the required request data.

## Endpoint

- Method: `POST`
- Route: `/users/register`
- Full URL example: `http://localhost:5000/users/register`

## Request Body

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securePass123"
}
```

### Required fields

- `fullname.firstname`:
  - Required
  - Must be a string
  - Minimum length: 3 characters

- `email`:
  - Required
  - Must be a valid email format

- `password`:
  - Required
  - Minimum length: 6 characters

### Optional field

- `fullname.lastname`:
  - Optional
  - If provided, it should be a string
  - Recommended minimum length: 3 characters

## Validation Rules

The route validates the incoming data before creating the user:

- `email` must pass `isEmail()`
- `fullname.firstname` must be at least 3 characters long
- `password` must be at least 6 characters long

If validation fails, the API returns a `400 Bad Request` response with the validation errors.

Example error response:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## How the Data Is Processed

When a valid request arrives:

1. The controller extracts `fullname`, `email`, and `password` from `req.body`.
2. The password is hashed using `bcrypt`.
3. The user is created in the database with:
   - `fullname.firstname`
   - `fullname.lastname`
   - `email`
   - hashed `password`
4. A JWT token is generated for the new user.
5. The server responds with the token and the created user object.

## Success Response

Successful registration returns a `201 Created` status code.

Example response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64c123abc456def789",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "[hashed]"
  }
}
```

## Example Request

```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

## Notes

- `fullname` is nested under the request body, not as flat fields.
- `firstname` is the only required name field in practice.
- Passwords are not stored in plain text; they are hashed before saving.

# User Login Endpoint

This document explains the `/users/login` endpoint and the required request data for signing in an existing user.

## Endpoint

- Method: `POST`
- Route: `/users/login`
- Full URL example: `http://localhost:5000/users/login`

## Request Body

The request body must be a JSON object with the following structure:

```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

### Required fields

- `email`:
  - Required
  - Must be a valid email format

- `password`:
  - Required
  - Must be at least 6 characters long

## Validation Rules

The route validates the incoming data before checking the user credentials:

- `email` must pass `isEmail()`
- `password` must be at least 6 characters long

If validation fails, the API returns a `400 Bad Request` response with the validation errors.

Example error response:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## How the Data Is Processed

When a valid request arrives:

1. The controller extracts `email` and `password` from `req.body`.
2. It looks up the user by email in the database.
3. It selects the stored password field to verify the submitted password.
4. If the password matches, a JWT token is generated for the user.
5. The server responds with the token and the authenticated user object.

## Success Response

Successful login returns a `200 OK` status code.

Example response:

```json
{
  "token": "******",
  "user": {
    "_id": "64c123abc456def789",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "[hashed]"
  }
}
```

## Error Responses

### Invalid credentials

If the email is not found or the password does not match, the API returns a `401 Unauthorized` response:

```json
{
  "message": "Inavlid email or password"
}
```

## Example Request

```bash
curl -X POST http://localhost:5000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

## Notes

- The app mounts the user routes under `/users`, so the login route is `/users/login`.
- Passwords are checked against the hashed value stored in the database.
- A JWT token is returned after successful authentication.
