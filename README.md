 |-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Lovable Cloud (Edge Functions) |
| **AI Model** | Google Gemini 3 Flash (via Lovable AI Gateway) |
| **Backend** | Supabase Edge Functions (Deno) |
| **AI Model** | Google Gemini 3 Flash |
| **Routing** | React Router v6 |
| **State Management** | React Query (TanStack) |
| **State Management** | TanStack React Query |
---
├── src/
│   ├── assets/              
│   ├── components/
│   │   ├── ui/             
│   │   ├── ui/             
│   │   ├── ChatSection.tsx  
│   │   ├── VideoSummary.tsx 
│   │   └── NavLink.tsx

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm installed — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Node.js (v18+) & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for backend services
### Local Development

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
# Navigate to the project directory
cd <YOUR_PROJECT_NAME>
cd vidsense
# Install dependencies
npm install
# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key
# Start the development server
npm run dev
```
The app will be available at `http://localhost:5173`.
### Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |
---
---
## 🔧 Backend Functions
## 🔧 API Endpoints
### `/summarize`
- Accepts a YouTube URL and language
- Extracts video ID, fetches transcript
- Sends transcript to AI for structured summarization
- Returns: `{ videoId, transcript, summary }`
### `POST /functions/v1/summarize`
- **Body:** `{ url: string, language: "en" | "hi" | "kn" }`
- Extracts video ID, fetches transcript, generates structured summary
- **Response:** `{ videoId, transcript, summary }`
### `/chat`
- Accepts a question, transcript, conversation history, and language
### `POST /functions/v1/chat`
- **Body:** `{ question: string, transcript: string, history: array, language: string }`
- Supports slash commands (`/summary`, `/deepdive`, `/actionpoints`)
- Returns streaming AI response grounded in the transcript
- **Response:** Streaming SSE (Server-Sent Events)
---
## 🎨 Design
- Clean, minimal UI with a professional dark theme
- Responsive layout (mobile & desktop)
- Fully responsive layout (mobile & desktop)
- Loading states with skeleton placeholders
- Toast notifications for errors and status updates
- Gradient accents and backdrop blur effects
## 📝 Error Handling
- **Invalid YouTube URL** → friendly error message
- **No transcript available** → clear notification with suggestion
- **Rate limiting (429)** → informative toast message
- **AI credits exhausted (402)** → user-friendly notification
- **Network errors** → retry option with toast
| Scenario | Response |
|----------|----------|
| Invalid YouTube URL | Friendly validation error |
| No transcript available | Clear notification with suggestion |
| Rate limiting (429) | Informative toast message |
| AI credits exhausted (402) | User-friendly notification |
| Network errors | Retry option with toast |
---
## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
---
