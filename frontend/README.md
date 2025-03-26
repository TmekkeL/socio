# 🧠 Frontend – Boilerplate

This is the frontend of the **Login module** project — built with **Next.js App Router**, **Tailwind CSS**, and reusable components.

The goal is to serve as a **clean boilerplate** for authentication-based apps with partly or whatever:
- Email/password login  
- Token management (access + refresh)  
- Role-based routing (admin/user)  
- Dark mode  
- Loading states, toasts & clean UI  
- Easy cloning & B2C extension

---

## ⚙️ 1. Getting Started

### 🧪 Install dependencies

```bash
cd frontend
npm install
Optional: Use pnpm if you prefer

🚀 Run dev server
bash
Copy
Edit
npm run dev
Starts the app on http://localhost:3000

⚠️ Environment Variables
Create a .env.local file using the example:

bash
Copy
Edit
cp .env.example .env.local
Example contents:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:3001
This is where the frontend fetches /auth/me, /login, etc. from the backend.

🧩 2. Project Structure
bash
Copy
Edit
src/
├── app/              # Pages & routes (Next.js App Router)
│   └── login/        # Example: /login page
├── components/       # Reusable UI components (Navbar, Spinner, etc.)
├── hooks/            # Custom React hooks (like useAuth)
├── utils/            # Utility functions (auth.ts, token logic)
├── styles/           # Tailwind CSS or global styles
🔁 3. Path Aliases (@/)
To avoid ../../../utils/auth, we use @/ as a shortcut to src/.

✅ Example:
ts
Copy
Edit
import { storeToken } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
🔧 Configured in tsconfig.json:
json
Copy
Edit
{
  "baseUrl": "./src",
  "paths": {
    "@/*": ["./*"]
  }
}
After editing this, always restart the dev server.

🌐 4. Tech Stack & Libraries
Tech	Purpose
Next.js	App Router structure
Tailwind CSS	Styling (dark/light support)
react-hot-toast	Feedback toasts
Cypress	E2E testing (planned)
TypeScript	Strong typing
JWT	Auth flow (via backend API)
✅ 5. Available Scripts
bash
Copy
Edit
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run cypress      # Launch Cypress test runner (if configured)
🧪 6. Testing
Unit & render tests live in __tests__/.
E2E tests (Cypress) will live in cypress/ once implemented.

To run tests:

bash
Copy
Edit
npm run test
💡 Developer Tips
Restart dev server after editing tsconfig.json

If @/ alias doesn't work, make sure you're importing from inside src/

Use Spinner or toast messages for feedback on all API interactions

Reuse useAuth() hook to centralize token logic

Dark mode toggle is available on /settings

📦 Ready to Clone
