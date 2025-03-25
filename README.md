# 💾 Login module

A complete full-stack boilerplate for building secure apps with **JWT-based authentication**, **role-based access (admin/user)**, and **clean modern UI** — powered by:

- 🧠 **Next.js (App Router)** for frontend
- 🔐 **NestJS + TypeORM** for backend
- 🐘 **PostgreSQL** via Docker
- 💨 **Tailwind CSS** for styling
- 🍪 **Secure cookie-based refresh tokens**
- 🧑‍💻 **Admin panel** with editable user modal
- 🌙 **Dark mode**, spinners, toasts, and reusable layout, although shitty at best, dark mode only switches in the settings page :D but its a NTH.

---

## 🧱 Monorepo Structure

socio/ ├── backend/ # NestJS + TypeORM API + Auth + DB ├── frontend/ # Next.js App Router + Tailwind UI ├── docker-compose.yml # Dev-only: local Postgres setup └── README.md # This file

yaml
Copy
Edit

---

## 🚀 Get Started

### 🔧 Backend

## ```bash
cd backend
cp .env.example .env
npm install
docker-compose up --build   # starts backend + db
Backend runs on: http://localhost:3001

💻 Frontend
bash
Copy
Edit
cd frontend
cp .env.example .env.local
npm install
npm run dev
Frontend runs on: http://localhost:3000

🧪 Features
✅ Login + refresh token system

✅ Admin-only user list + editable modal

✅ Secure HTTP-only cookies (SameSite=None, Secure, HttpOnly)

✅ Session-based redirects (/login → /dashboard)

✅ Dark mode toggle = shitty at best for now

✅ Toasts for login/logout/error

✅ Loading spinners for better UX

✅ Fully tested with unit + render tests

🔄 Ready for MS Entra ID B2C extension

📦 Tech Stack
Layer	Tech
Frontend	Next.js (App Router)
Styling	Tailwind CSS
UI Logic	React, TypeScript
Backend	NestJS, TypeORM
Database	PostgreSQL (Dockerized)
Auth	JWT (Access + Refresh)
🧠 Future-Ready
This boilerplate is designed to evolve — you can:

🔁 Clone it for new secure apps

🧪 Extend it with Cypress E2E tests(still has some work left)

🧑‍💼 Fork it into a MS Entra B2C login system(is what i am going to do next)

📄 License
MIT — do what you want, just don’t sell it as-is without love.

What started as a project with ambitious goals made me realize there were already existing solutions out there.
That’s why I chose to focus on building a solid, reusable foundation — a core piece that I can adapt and build on for future projects.
This was my fourth attempt for this project, started somewhere around 20th of Januari 2025 with the first attempt. 
The fourth attempt(start: 20th of March) has been build in less than 40 hours(25th of March). 
