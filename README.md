# Peblo Notes Workspace

A lightweight, collaborative, AI-powered notes workspace built for the Peblo full-stack developer challenge.

## Features

1. **Authentication:** Secure user signup and login with persistent JWT sessions.
2. **Notes Workspace:** Create, edit, and organize notes with tags. Auto-saving ensures you never lose work.
3. **AI Integration:** Powered by Google Gemini to generate summaries, action items, and suggested titles from your notes.
4. **Search & Filtering:** Keyword search across titles and content, plus tag filtering.
5. **Public Sharing:** Generate public, read-only links for any note to share without requiring a login.
6. **Productivity Insights:** A dashboard showing total notes, recent activity, AI usage, and most-used tags.

## Architecture

- **Frontend & Backend:** Next.js (App Router) 
- **Styling:** Vanilla CSS (CSS Modules) with a custom, sleek dark-mode design system. No external UI frameworks.
- **Database:** SQLite with Prisma ORM. Selected for simplicity of evaluation (no Docker or external db required).
- **Authentication:** Custom JWT-based authentication using HTTP-only cookies.
- **AI Provider:** `@google/genai` (Gemini API) for structured outputs.

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Google Gemini API Key (Get one at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VibhuGupta-dev/Pablo-notes
   cd Pablo-notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of your project based on the `.env.example` file provided:
   
   ```env
   # .env.example
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-jwt-secret-here"
   LLM_API_KEY="your-google-gemini-api-key-here"
   NEXT_PUBLIC_APP_URL="https://your-production-url.vercel.app"
   ```
   
   Copy this into `.env` and replace `your-google-gemini-api-key-here` with your actual Gemini API key.

4. **Initialize the Database:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open the Application:**
   Visit `http://localhost:3000` in your browser.

## Testing the Application

1. **Auth:** Sign up for a new account. Notice the session persistence.
2. **Notes:** Create a note, add tags. Wait 1 second after typing to see the "Saved" indicator (auto-save).
3. **AI:** Paste some meeting notes and click "Generate Insights". It will extract action items, summarize, and suggest a title.
4. **Sharing:** Click the Share icon in the top right of the editor. Open the provided public link in an incognito window.
5. **Insights:** Click "View Insights" in the bottom left of the sidebar to see your metrics.

## Deployment

Peblo Notes is ready to be deployed to production using Vercel. 

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the project.
3. In the Environment Variables section, add:
   - `JWT_SECRET` (generate a random string)
   - `LLM_API_KEY` (your Google Gemini key)
4. Click **Deploy**. Since the app uses SQLite, it will work seamlessly for demonstration purposes out-of-the-box on serverless edges (though for a persistent, multi-user production app, you would swap SQLite for Postgres).
