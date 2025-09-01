# 📋 API Documentation - Note Taking App

Complete API reference for the Note Taking App backend service. All endpoints are RESTful and return JSON responses.

## 🔗 **Base URL**
```
http://localhost:5001/api
```

## 🔐 **Authentication**

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 **Response Format**

All API responses follow a consistent format:

### **Success Response**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { /* validation errors if applicable */ }
}
```

## 🔑 **Authentication Endpoints**

### **User Registration**
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b24a2001f5e9c8a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### **User Login**
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb54b24a2001f5e9c8a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### **Get Current User** 🔒
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ecb54b24a2001f5e9c8a",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2023-06-25T10:30:00.000Z"
  }
}
```

### **Get User Profile** 🔒
```http
GET /api/auth/profile
```
*Alias for `/api/auth/me` endpoint*

### **Update User Profile** 🔒
```http
PUT /api/auth/profile
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ecb54b24a2001f5e9c8a",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "updatedAt": "2023-06-25T11:30:00.000Z"
  }
}
```

### **Change Password** 🔒
```http
PUT /api/auth/password
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

## 📝 **Notes Endpoints**

All notes endpoints require authentication 🔒

### **Get All Notes** 🔒
```http
GET /api/notes
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ecb54b24a2001f5e9c8b",
      "title": "My First Note",
      "content": "This is my first note content.",
      "user": "60d5ecb54b24a2001f5e9c8a",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "updatedAt": "2023-06-25T10:30:00.000Z"
    },
    {
      "_id": "60d5ecb54b24a2001f5e9c8c",
      "title": "Another Note",
      "content": "More note content here.",
      "user": "60d5ecb54b24a2001f5e9c8a",
      "createdAt": "2023-06-25T11:00:00.000Z",
      "updatedAt": "2023-06-25T11:00:00.000Z"
    }
  ]
}
```

### **Create New Note** 🔒
```http
POST /api/notes
```

**Request Body:**
```json
{
  "title": "My New Note",
  "content": "This is the content of my new note."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54b24a2001f5e9c8d",
    "title": "My New Note",
    "content": "This is the content of my new note.",
    "user": "60d5ecb54b24a2001f5e9c8a",
    "createdAt": "2023-06-25T12:00:00.000Z",
    "updatedAt": "2023-06-25T12:00:00.000Z"
  }
}
```

### **Get Single Note** 🔒
```http
GET /api/notes/:id
```

**Parameters:**
- `id` - Note ID (MongoDB ObjectId)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54b24a2001f5e9c8b",
    "title": "My First Note",
    "content": "This is my first note content.",
    "user": "60d5ecb54b24a2001f5e9c8a",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```

### **Update Note** 🔒
```http
PUT /api/notes/:id
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated note content."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb54b24a2001f5e9c8b",
    "title": "Updated Note Title",
    "content": "Updated note content.",
    "user": "60d5ecb54b24a2001f5e9c8a",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T12:30:00.000Z"
  }
}
```

### **Delete Note** 🔒
```http
DELETE /api/notes/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

## 🔐 **OTP Endpoints**

### **Send OTP**
```http
POST /api/otp/send
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to user@example.com"
}
```

### **Verify OTP**
```http
POST /api/otp/verify
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

## ❌ **Error Codes**

### **HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### **Common Error Responses**

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Not authorized, token required"
}
```

**Resource Not Found (404):**
```json
{
  "success": false,
  "message": "Note not found"
}
```

**Duplicate Resource (409):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

## 🧪 **Testing the API**

### **Test User Credentials**
```json
{
  "email": "sumarduni@gmail.com",
  "password": "password123"
}
```

### **Example API Testing with curl**

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sumarduni@gmail.com", "password": "password123"}'
```

**Create Note:**
```bash
curl -X POST http://localhost:5001/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Test Note", "content": "This is a test note."}'
```

**Get All Notes:**
```bash
curl -X GET http://localhost:5001/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 **Rate Limiting**

Currently, no rate limiting is implemented, but it's recommended for production use.

## 📝 **Notes**

- All timestamps are in ISO 8601 format (UTC)
- MongoDB ObjectIds are used for resource identification
- JWT tokens expire after 30 days (configurable)
- Password minimum length is 6 characters
- Email addresses are automatically converted to lowercase
- User emails must be unique across the system

---

**API Documentation last updated: September 1, 2025**

2. POST /api/notes
   - Create new note
   - Body: { title, content }
   - Returns: { success, data: note }

3. GET /api/notes/:id
   - Get single note by ID
   - Returns: { success, data: note }

4. PUT /api/notes/:id
   - Update note by ID
   - Body: { title, content }
   - Returns: { success, data: note }

5. DELETE /api/notes/:id
   - Delete note by ID
   - Returns: { success, message }

### Security Features:
- JWT Authentication middleware
- User-specific note isolation
- Input validation
- Error handling
- CORS configured for localhost:3000

### Frontend Features Implemented:
1. Welcome Page after authentication
2. User profile display (name, email, avatar)
3. Notes CRUD operations with UI
4. Form validation and error handling
5. Loading indicators
6. Toast notifications
7. Delete confirmation modals
8. Responsive design
9. Clean UX with proper messaging

All routes are protected and linked to userId in database.
