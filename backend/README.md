# 🔐 Backend – Login module Boilerplate (NestJS + TypeORM)

This is the backend API for the **Login module** project. It provides:

- Secure user authentication (JWT + refresh tokens)
- Role-based access (admin/user)
- Token handling via HTTP-only cookies
- PostgreSQL database integration
- Modular NestJS setup
- Ready for local Docker use

---

## 🚀 1. Getting Started

### 🧱 Install dependencies

```bash
cd backend
npm install
🐳 Start with Docker (PostgreSQL + Backend)
bash
Copy
Edit
# Start both the backend and database
docker-compose up --build
Alternatively, start the backend manually after DB is up:

bash
Copy
Edit
docker start socio-db     # Start PostgreSQL
npm run start:dev         # Start NestJS backend
⚙️ 2. Environment Variables
Create a .env file based on the example:

bash
Copy
Edit
cp .env.example .env
Example .env:

env
Copy
Edit
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
DB_HOST=postgres
DB_PORT=5432
DB_USER=cunt
DB_PASSWORD=your_db_password
DB_NAME=socio
🔁 3. Auth Routes
All auth routes are prefixed with /auth.

Method	Route	Description
POST	/auth/signup	Register new user
POST	/auth/login	Login & receive tokens
POST	/auth/refresh	Refresh access token (via cookie)
GET	/auth/me	Get current user (requires access JWT)
Refresh token is stored in a secure, HTTP-only cookie

Access token is returned in the response body

🧩 4. Tech Stack
Tech	Purpose
NestJS	Backend framework (modular)
TypeORM	ORM for PostgreSQL
PostgreSQL	Database
JWT	Access + refresh token handling
Docker	Local development environment
Cookie-parser	Token storage via HTTP-only cookies
🧪 5. Testing
You can run tests with:

bash
Copy
Edit
npm run test
Unit and e2e testing can be extended based on needs.

🔒 6. Role-Based Access
Each user has a role column (admin or user).

Use guards to restrict access:

Example: @UseGuards(AuthGuard('jwt'), RolesGuard)

See: AuthGuard + RolesGuard implementation in the code

🗂 7. Users Table Structure
The users table (via TypeORM) contains:

Column	Type	Notes
id	integer	Primary key
username	varchar	Unique, not null
password	varchar	Hashed
role	varchar	"admin" or "user"
is_active	boolean	true/false
profile_picture	varchar	Optional URL
created_at	timestamp	Default: now()
updated_at	timestamp	Auto-updated
📂 8. File Overview
bash
Copy
Edit
backend/
├── src/
│   ├── auth/           # Auth logic, controllers, strategies
│   ├── user/           # User entity & service
│   ├── config/         # TypeORM + app config
│   ├── main.ts         # Entry point
├── .env.example        # Environment variable reference
├── docker-compose.yml  # Local setup
├── Dockerfile          # Backend Docker build
✅ 9. Tips
Backend must run on port 3001 for frontend compatibility

Frontend expects secure cookie responses (refresh tokens)

All cookies use:

httpOnly: true

secure: true

sameSite: "none"

domain: "localhost" (for local testing)

📦 Ready for Use