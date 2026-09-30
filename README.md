# HealTrip AI — Patient Decision Assistant

A clean engineering prototype of an AI-powered Patient Decision Assistant that helps patients find doctors and hospitals in Saudi Arabia. 

This project demonstrates a strict separation of concerns, native LLM tool calling, deterministic safety, and database grounding without unnecessary enterprise complexity.

## Architecture & Data Flow

The application follows a simple, explicit architecture:

1. **Next.js Frontend**: A React application providing a responsive, bilingual (Arabic/English) chat UI with RTL support.
2. **Node.js/Express Backend**: A dedicated API server (`POST /api/chat`) that orchestrates the AI and database logic.
3. **Validation & Safety**: Zod validates all inputs. A deterministic safety layer intercepts emergency symptoms *before* they reach the AI.
4. **AI Agent**: Orchestrates LLM interactions using native OpenAI function/tool calling.
5. **Database (Prisma + PostgreSQL)**: Provides the actual grounded data for hospitals and doctors.

**Why are Next.js and Express separated?**
To strictly enforce security boundaries. The browser cannot execute tools, access secrets, or query the database directly. The Node.js API acts as a secure orchestrator.

## Hallucination Prevention & Tool Calling

The AI Agent relies purely on native tool calling (`search_doctors`, `search_hospitals`). 

**The AI has no direct access to the database.** It cannot write SQL, use Prisma, or access environment variables. It can only request tools. The backend executes the tools, validates arguments with Zod, queries the database, and returns structured JSON to the AI. 

## File Upload & Context
Users can upload `.txt`, `.md`, or `.csv` files to the chat. 
- The client reads the content of the file and passes it to the AI securely as context.
- Uploads are validated strictly to be text formats. 
- This prevents large unparseable binaries from reaching the LLM and keeps the application secure without requiring heavy server-side file processing.
- The server limits payload sizes with express limits.

If the database returns no results, the AI is instructed to inform the user, preventing hallucination of non-existent medical providers.

## Security & Error Handling

- **Prompt Injection mitigation**: Bounded by architectural limitations. Even if injected, the AI cannot execute arbitrary code or query the DB freely.
- **Error Boundaries**: LLM failures, timeouts, and DB errors are caught and logged securely. The client only receives safe, generic error messages (e.g., "The assistant is temporarily unavailable"). No stack traces or secrets are ever exposed to the client.

## Quick Start

### 1. Requirements

- Node.js (v18+)
- PostgreSQL

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your details:

```bash
cp .env.example .env
```
Ensure you provide a valid `LLM_API_KEY` (OpenAI).

### 3. Install Dependencies

Install packages for both the root API and the Next.js frontend:

```bash
npm run install:all
```

### 4. Database Setup

Push the Prisma schema and run the seed script to populate mock hospitals and doctors:

```bash
npm run db:push
npm run db:seed
```

**Note**: The seed data (`prisma/seed.ts`) contains mock healthcare reference data created specifically for testing filtering, empty results, and AI tool calling. It includes several hospitals, specialized doctors, locations, and languages clearly labeled as demo data.

### 5. Start Development Servers

Run the backend API:
```bash
npm run dev:api
```

In a separate terminal, run the Next.js frontend:
```bash
npm run dev:web
```

The frontend will be available at `http://localhost:3000`.

## Testing

Run the test suite using Vitest:

```bash
npm test
```
Tests cover tool validation, safety interception, and API behaviors.
