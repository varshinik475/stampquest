# StampQuest 🌍

StampQuest is a React travel-passport experience where visitors collect digital stamps from places they visit and build a personal passport of destinations, memories, statistics, and achievements.

## ✨ What it does

- Collect and manage digital travel stamps
- Build a personal travel passport
- Explore destinations and travel information
- Track travel statistics and achievements
- Search, filter, and favourite destinations
- Persist travel data with Local Storage
- Responsive desktop and mobile UI
- Interactive 3D Passport Orbit experience
- AI travel assistant with destination information tooling

## 🖼️ Screenshots

The production submission should include screenshots of the home page, passport, explore experience, and AI chat here. They are intentionally not embedded until final production screenshots are captured so the README does not point at stale preview assets.

## 🛠️ Tech stack

- React 18
- TypeScript / JavaScript
- Vite
- React Router
- Tailwind CSS
- Three.js
- AI SDK
- Vitest
- Playwright

## 🚀 Run locally

```bash
git clone https://github.com/varshinik475/stampquest.git
cd stampquest
npm ci
npm run dev
```

Open the local URL printed by Vite.

### Production build

```bash
npm run build
npm run preview
```

### Tests

```bash
npm test
npm run test:e2e
```

## 🔐 Environment variables

Copy `.env.example` to `.env.local` for local development. Never commit the real API key.

| Variable | Required | Where it is used | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes for AI features | Server only | Anthropic API credential |

For Vercel, configure the variable in **Project Settings → Environment Variables** for the Production environment rather than committing `.env.local`.

## 🏗️ Architecture

```text
React UI
  ↓
React Router / pages / components
  ↓
TravelContext + Local Storage

AI chat
  ↓
Chat client
  ↓
Server chat route
  ↓
Input validation + request rate limit
  ↓
AI SDK / Claude
  ↓
getDestinationInfo tool
  ↓
Typed tool result
  ↓
Destination UI
```

The AI model configuration and system prompt live in `src/lib/ai.ts`. The server chat handler applies a 32 KB request cap, limits conversations to 30 messages, limits individual serialized messages to 4,000 characters, and applies an in-process limit of 10 requests per minute per forwarded client IP. Streaming requests have a `maxDuration` of 30 seconds.

> The in-process limiter is a lightweight production safeguard. For a high-traffic deployment, replace it with a shared provider such as Vercel KV/Redis so limits are consistent across serverless instances.

## 🧠 Key decisions

- **React + Vite:** keeps the main StampQuest experience fast and straightforward to deploy.
- **Local Storage:** provides persistence without requiring authentication or a database for the internship scope.
- **React Router:** separates the major passport, explore, map, profile, stamps, and achievement experiences.
- **Three.js:** powers the Passport Orbit interaction while keeping the scene lightweight.
- **Server-side AI access:** keeps the Anthropic credential away from browser code.
- **Input caps and rate limiting:** reduce accidental or abusive API-credit consumption.
- **Playwright + Vitest:** provide both browser-flow and component-level verification.

## 🧪 Production checklist

Before submitting Checkpoint 2:

- [ ] Deploy the latest `main` commit to the production environment.
- [ ] Configure `ANTHROPIC_API_KEY` in the hosting provider's production environment.
- [ ] Confirm `.env.local` is not tracked.
- [ ] Test Chrome.
- [ ] Test Firefox.
- [ ] Test Safari.
- [ ] Test mobile Chrome.
- [ ] Test mobile Safari.
- [ ] Verify the AI request cap and 429 response after repeated requests.
- [ ] Verify the AI route stops within the configured 30-second maximum.
- [ ] Capture final production screenshots and add them to this README.
- [ ] Record the final production URL in the checkpoint submission.

## 🤖 How AI tools built this

AI tools were used as development assistants rather than as an unattended implementation pipeline. They helped generate component structures, React logic, styling ideas, test cases, accessibility improvements, documentation, and the AI interaction architecture. Generated code was reviewed and adjusted manually, and the repository includes tests and explicit production safeguards.

The important manual work was deciding the product flow, reviewing generated code, checking edge cases, validating the UI across viewport sizes, correcting implementation details, and adding production protections such as request caps and rate limiting.

## 📁 Project structure

```text
src/
├── app/          # AI/server-facing application routes and styles
├── components/   # Shared UI
├── context/      # Travel state
├── data/         # Destination and stamp data
├── lib/          # AI configuration, tools, and rate limiting
├── pages/        # Main StampQuest screens
├── utils/        # Utility helpers
├── App.tsx       # Application routing
└── main.tsx      # Application entry point
```

## 🌐 Deployment

The repository is connected to Vercel. Configure production environment variables in Vercel and deploy from `main`. A custom domain can be added later from the Vercel project settings.

## 👩‍💻 Author

**K. Varshini**  
AI Frontend Engineering Intern — FlyRank AI
