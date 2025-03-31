# AI News Hub

A Next.js application for AI-powered news aggregation and summarization.

## MongoDB and OAuth Setup

This application uses MongoDB for user data storage and NextAuth.js for authentication with OAuth providers (Google and GitHub).

### Setting Up MongoDB

1. Create a MongoDB Atlas account or use an existing one
2. Create a new cluster or use an existing one
3. Create a database user with read/write permissions
4. Get your MongoDB connection string
5. Create a `.env.local` file in the root directory using the `.env.local.example` template
6. Add your MongoDB connection string to the `MONGODB_URI` variable

### Setting Up OAuth Providers

#### GitHub OAuth
1. Go to GitHub Developer Settings > OAuth Apps > New OAuth App
2. Set the Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
3. Add the GitHub Client ID and Secret to your `.env.local` file

#### Google OAuth
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
4. Add the Google Client ID and Secret to your `.env.local` file

### NextAuth Secret
Generate a random secret for NextAuth.js using:
```bash
openssl rand -base64 32
```
Add the generated string to your `.env.local` file as `NEXTAUTH_SECRET`

## Development Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create `.env.local` file with required environment variables
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- NextAuth.js
- MongoDB
- Mongoose 