
# YouTube Video Summarizer & Q&A Web App

## Overview
A web application where users paste a YouTube video link, receive a structured AI-generated summary, and can ask follow-up questions about the video — all powered by AI with support for English, Hindi, and Kannada.

---

## Page 1: Main App (Single Page)

### Hero / Input Section
- Clean, modern header with app title and tagline ("Your AI Research Assistant for YouTube")
- A prominent input field to paste a YouTube URL with a "Summarize" button
- Language selector dropdown (English, Hindi, Kannada) to choose output language

### Video Summary Section (appears after submitting a link)
- Embedded YouTube video player thumbnail with video title
- Structured summary displayed with clear sections:
  - 🔑 **5 Key Points** — bullet-pointed highlights
  - ⏱️ **Important Timestamps** — clickable timestamp references
  - 💡 **Core Takeaway** — one-line insight
- Option to re-generate the summary in a different language

### Q&A Chat Section
- Chat-style interface below the summary
- Users can type follow-up questions about the video
- AI responses are grounded in the transcript (if a topic isn't covered, it says so)
- Conversation history maintained during the session
- Language of responses matches the selected language

---

## Backend (Supabase Edge Functions)

### Transcript Fetching
- Edge function that extracts the YouTube video ID from the URL
- Fetches the video transcript using a public transcript API
- Handles edge cases: invalid URLs, missing transcripts, non-English transcripts, very long videos

### AI Summarization
- Sends transcript to Lovable AI (Gemini) with a structured prompt
- Returns summary with key points, timestamps, and core takeaway
- Supports generating summaries in English, Hindi, or Kannada

### Q&A Function
- Receives user question + transcript context + conversation history
- AI answers grounded in the transcript content
- Responds in the user's selected language
- Gracefully handles questions not covered in the video

---

## Error Handling
- Invalid YouTube URL → friendly error message
- No transcript available → clear notification with suggestion
- Rate limiting → informative toast message
- Network errors → retry option

## Design
- Clean, minimal UI with a professional feel
- Responsive layout (works on mobile and desktop)
- Loading states with skeleton/spinners during transcript fetch and AI processing
- Toast notifications for errors and status updates
