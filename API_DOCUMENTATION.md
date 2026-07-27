# Tap Savvy Networks — Backend API Reference

This document is a concise API reference for frontend developers. It lists routes, expected request formats, responses, and example requests for common flows.

**General**
- **Base URL:** https://tapsavvynetwork-api.onrender.com/api
- **Auth header:** `Authorization: Bearer <accessToken>` for protected endpoints.
- **Response envelope:** All endpoints return the following JSON envelope:

```
{
  "success": true | false,
  "message": "Human readable message",
  "data": { ... }
}
```

**Environment variables (important)**
- **MONGO_URI:** MongoDB Atlas connection string
- **JWT_ACCESS_SECRET / JWT_REFRESH_SECRET**: JWT secrets
- **CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET**: Cloudinary credentials (media uploads)

-------------------------

**AUTH**

- **Register**: `POST /api/auth/register`
  - Body (application/json): `{ name, email, password }`
  - Success: 201 Created, `data: { id, email }`

- **Login**: `POST /api/auth/login`
  - Body (application/json): `{ email, password }`
  - Success: `data: { accessToken, refreshToken }`

- **Refresh**: `POST /api/auth/refresh`
  - Body (application/json): `{ refreshToken }`
  - Success: `data: { accessToken }`

- **Logout**: `POST /api/auth/logout`
  - Body (application/json): `{ refreshToken }`
  - Success: `{ success: true, message: 'Logged out' }`

Example (login -> use token):

```
POST /api/auth/login
Content-Type: application/json

{ "email": "alice@example.com", "password": "pass1234" }

Response: { "data": { "accessToken": "ey...", "refreshToken": "ey..." } }
```

-------------------------

**PROFILES**

- **Get my profile**: `GET /api/profiles/me` (auth)
  - Returns user's profile with populated `user` (name,email,role)

- **Create / Update my profile**: `POST /api/profiles/me` (auth)
  - Supports `multipart/form-data` for image uploads or JSON.
  - Profile fields: `userType`, `fullName`, `gender`, `jobTitle`, `companyName`, `company`, `jobCategory`, `phoneNumber`, `whatsappNumber`, `companyAddress`, `companyAddressType`, `dob`, `bio`, `location`, `website`, `industry`, `companySize`, `username`, `email`, `password`, `cardThemeColor`, `buttonThemeColor`, `links`, `userProfilePhotoPath`, `logoImagePath`, `companyRepresentativePhotoPath`, `selectedPlanName`, `isYearly`, `offeringType`, `offeringDescription`, `offeringImagePaths`, `offeringCaptions`, `websiteLink`, `instagramLink`, `linkedinLink`, `twitterLink`, `keepMeSignedIn`, `isBusiness`.
  - Upload file fields: `avatar`, `userProfilePhoto`, `logoImage`, `companyRepresentativePhoto`, `offeringImages`.
  - On success, returns saved profile.

- **Get public profile**: `GET /api/profiles/:id` (public)

Avatar upload notes:
- Uses Cloudinary. Uploaded file returns a remote `avatarUrl` (saved in `profile.avatarUrl`).

Example (upload with fetch):

```js
const fd = new FormData();
fd.append('displayName','Alice');
fd.append('avatar', fileInput.files[0]);
fetch('/api/profiles/me', { method: 'POST', headers: { Authorization: 'Bearer '+token }, body: fd });
```

-------------------------

**CONNECTIONS (Network)**

- **Send connection request**: `POST /api/connections/request` (auth)
  - Body: `{ recipientId, message }`
  - Response: created connection (status `pending`).

- **List incoming requests**: `GET /api/connections/requests` (auth)

- **Respond to request**: `POST /api/connections/:id/respond` (auth)
  - Body: `{ action: 'accept' | 'reject' | 'block' }`

- **List my connections**: `GET /api/connections/my` (auth)

- **Remove connection**: `DELETE /api/connections/:id` (auth)

-------------------------

**LEADS / CRM**

- **Create lead**: `POST /api/leads` (auth)
  - Body: `{ name, company, email, phone, rawText, source }`

- **List leads**: `GET /api/leads` (auth)

- **Scan (OCR stub)**: `POST /api/leads/scan` (auth)
  - Body: `{ text: 'plain OCR text' }` or `{ raw: '<base64>' }` (stub extracts email/phone)
  - Returns created Lead with `email` and `phone` extracted when available.

-------------------------

**NETWORK BOOK (Public directory)**

- **List business profiles**: `GET /api/network-book?q=<term>&page=<n>&limit=<n>` (public)
  - Returns: `{ items, page, limit, total }`

-------------------------

**TEAMS**

- **Create team**: `POST /api/teams` (auth)
  - Body: `{ name, description }` — owner is set to requestor, owner auto-added to members.

- **Add team member**: `POST /api/teams/:id/members` (auth)
  - Body: `{ memberId }` — only owner or admin can add.

- **List teams**: `GET /api/teams` (auth)

-------------------------

**ADMIN**

- **List users**: `GET /api/admin/users` (auth, role `admin|superadmin`)

- **Update user role**: `PATCH /api/admin/users/:id/role` (auth, role `superadmin`)
  - Body: `{ role: 'user'|'admin'|'superadmin' }`

-------------------------

**LOCALE**

- **Get locale**: `GET /api/locale?lang=<code>` (public)
  - Uses `Accept-Language` header when `lang` not present.

-------------------------

**Error handling & status codes**
- Validation or missing fields: 400
- Unauthorized: 401
- Forbidden: 403
- Not found: 404
- Server error: 500

-------------------------

Quick example flows (cURL)

- Register → Login → Create Profile (JSON):

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@example.com","password":"pass1234"}'

# Login
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"pass1234"}'

# Create profile (JSON)
curl -X POST http://localhost:5000/api/profiles/me -H "Content-Type: application/json" -H "Authorization: Bearer <accessToken>" -d '{"displayName":"Alice","company":"Acme"}'
```

- Upload avatar (multipart/form-data):

```bash
curl -X POST http://localhost:5000/api/profiles/me \
  -H "Authorization: Bearer <accessToken>" \
  -F "avatar=@/path/to/avatar.jpg" \
  -F "displayName=Alice"
```

-------------------------

Notes for frontend
- Always handle `401` by redirecting to login and attempt `refresh` with `refreshToken` if present.
- Use `Content-Type: multipart/form-data` when uploading files.
- For image display, use the returned `avatarUrl` directly (Cloudinary URLs are public by default).

-------------------------

Want me to:
- Generate a Postman collection and add it to the repo
- Produce an OpenAPI (Swagger) spec `openapi.yaml`
- Create example React fetch wrappers for these endpoints

If yes, tell me which format you prefer and I will add it to the repository.
