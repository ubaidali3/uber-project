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
