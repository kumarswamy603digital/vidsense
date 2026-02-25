# 🎬 VidSense

> **AI-powered YouTube video summarizer & interactive chat assistant**

VidSense lets you paste any YouTube URL and instantly get a structured AI-generated summary — then chat with the video's content in real-time using natural language. Supports multilingual output and streaming responses.

---

## ✨ Features

- 📋 **Instant Summaries** — Paste a YouTube URL and receive a clean, structured breakdown of the video content
- 💬 **Interactive Chat** — Ask questions grounded in the video transcript with full conversation history
- ⚡ **Slash Commands** — Use `/summary`, `/deepdive`, and `/actionpoints` for quick insights
- 🌐 **Multilingual Support** — Summarize and chat in English, Hindi, and Kannada
- 📡 **Streaming Responses** — Real-time AI replies via Server-Sent Events (SSE)
- 📱 **Fully Responsive** — Works seamlessly on mobile and desktop
- 🌙 **Dark Theme UI** — Professional dark UI with gradient accents and blur effects

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Routing** | React Router v6 |
| **State Management** | TanStack React Query |
| **Backend** | Supabase Edge Functions (Deno) |
| **AI Model** | Google Gemini Flash (via AI Gateway) |
| **Database / Auth** | Supabase |

---

## 📁 Project Structure

```
vidsense/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── ChatSection.tsx   # Chat interface with slash command support
│   │   ├── VideoSummary.tsx  # Structured summary display
│   │   └── NavLink.tsx       # Navigation component
│   └── ...
├── supabase/
│   └── functions/
│       ├── summarize/        # Edge function: transcript + AI summarization
│       └── chat/             # Edge function: streaming chat responses
├── .env
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **bun** package manager
- A **Supabase** account — [supabase.com](https://supabase.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kumarswamy603digital/vidsense.git

# 2. Navigate to the project directory
cd vidsense

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
# Open .env and fill in your Supabase credentials (see below)

# 5. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_public_key
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🔧 API Reference

### `POST /functions/v1/summarize`

Extracts a transcript from a YouTube video and returns an AI-generated structured summary.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "language": "en"
}
```

| Field | Type | Options |
|---|---|---|
| `url` | `string` | Any valid YouTube URL |
| `language` | `string` | `"en"`, `"hi"`, `"kn"` |

**Response:**
```json
{
  "videoId": "VIDEO_ID",
  "transcript": "Full transcript text...",
  "summary": "Structured AI summary..."
}
```

---

### `POST /functions/v1/chat`

Answers questions grounded in the video transcript, with support for slash commands and streaming responses.

**Request Body:**
```json
{
  "question": "What is the main argument of the video?",
  "transcript": "Full transcript text...",
  "history": [],
  "language": "en"
}
```

**Response:** Streaming SSE (Server-Sent Events)

**Supported Slash Commands:**

| Command | Description |
|---|---|
| `/summary` | Quick overview of the video |
| `/deepdive` | In-depth analysis of key topics |
| `/actionpoints` | Actionable takeaways from the video |

---

## 🎨 UI & Design

- **Dark theme** with gradient accents and backdrop blur effects
- **Skeleton loaders** for smooth loading states
- **Toast notifications** for errors and status updates
- **Responsive layout** — optimized for both mobile and desktop

---

## 🛡️ Error Handling

| Scenario | Behaviour |
|---|---|
| Invalid YouTube URL | Friendly validation error message |
| No transcript available | Clear notification with suggestion |
| Rate limiting `429` | Informative toast message |
| AI credits exhausted `402` | User-friendly notification |
| Network errors | Retry option with toast |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is open-source. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini](https://deepmind.google/technologies/gemini/) — AI model powering summaries and chat
- [Supabase](https://supabase.com) — Backend and Edge Functions platform
- [shadcn/ui](https://ui.shadcn.com/) — UI component library

---

<p align="center">Built with ❤️ by <a href="https://github.com/kumarswamy603digital">kumarswamy603digital</a></p>
