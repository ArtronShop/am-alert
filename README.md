# 🚨 Am Alert

**Am Alert** is a notification service for IoT applications that allows sending alerts from various devices to users quickly and conveniently.

## 🧰 Tech Stack

- [SvelteKit](https://kit.svelte.dev/) – Frontend Framework
- [Drizzle ORM](https://orm.drizzle.team/) – Type-safe ORM for database

## 🛠️ How to Run Locally

1. Create a `.env` file or set up the necessary environment variables.
```bash
PUBLIC_URL=<Site Domain>

# Database
DATABASE_URL=postgres://<username>:<password>@<host>:5432/<database>

# Login
JWT_SECRET=<Login JWT Secret>

# API
API_JWT_SECRET=<API JWT Secret>

# Subscription
PUBLIC_VAPID_KEY=
PRIVATE_VAPID_KEY=
ADMIN_EMAIL=<Your email>
```
2. Install the dependencies by running:
```bash
npm install
```
3. Initialize PostgreSQL database with Drizzle ORM :
```bash
npx drizzle-kit push
```
4. Run the project in development mode:
```bash
npm run dev
```
## 🚀 How to Run in Production

Follow the SvelteKit – Running in Production guide, and choose the appropriate adapter for your server (such as Node.js, Vercel, Cloudflare, etc.).

> 💡 If you have suggestions or encounter issues, feel free to create an Issue on the GitHub repository!
