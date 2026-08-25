# StampQuest

## 🌍 Overview

StampQuest is a React-based travel passport application where users collect digital stamps from places they visit and build their own personalised travel passport. The application helps travellers keep track of destinations, travel memories, and achievements through an engaging and interactive interface.

## ✨ Features

* Add visited destinations
* Collect unique digital stamps
* Personal travel passport
* Travel statistics dashboard
* Achievement badges
* Search and filter visited places
* Favourite destinations
* Responsive design
* Local Storage support for persistent data

## 🛠️ Tech Stack

* React
* Vite
* JavaScript (ES6+)
* CSS
* React Hooks
* Local Storage

## 🚀 Run Locally

```bash
git clone https://github.com/varshinik475/stampquest.git
cd stampquest
npm install
npm run dev
```

Open `http://127.0.0.1:4173/` for the main app. The interactive 3D experience is available at `http://127.0.0.1:4173/passport-orbit`.

## 🧪 Test And Build

```bash
npm ci
npm test
npm run test:e2e
npm run build
```

GitHub Actions runs the component and Playwright suites on every push and pull request. The workflow also uploads the passing primary-flow screenshot as an artifact.

## 🤖 AI Tool Contract

### `getDestinationInfo`

The StampQuest AI can call `getDestinationInfo` when
a user asks about a specific travel destination.

#### Input

```ts
{
  destination: string;
  country: string;
  description: string;
  bestFor: string[];
  stampDifficulty: string;
  recommendedDays: number;
  reason: string | null;
}
```

---

## 10. One important improvement

For the assignment, this simulated destination database is enough to demonstrate the **tool architecture**, but for your final StampQuest project I'd replace:

```tsx
getCountry()
getDescription()
getBestFor()

#architectural boundary
User
  ↓
Chat UI
  ↓
Claude
  ↓
getDestinationInfo tool
  ↓
Server-side data
  ↓
Typed tool result
  ↓
DestinationCard

## 📂 Project Structure

```
src/
├── app/
├── components/
├── pages/
├── context/
├── utils/
├── App.jsx
├── main.jsx
```

## 🎯 Future Improvements

* User authentication
* Cloud database integration
* Interactive travel map
* Photo gallery
* Travel sharing with friends

## 🌐 Deployment

The repository is connected to Vercel. The previously generated Vercel preview URL is protected by Vercel SSO, so the local URL above is the reliable development demo until a public production deployment is configured.

## 🧭 3D Passport Orbit

Visit `/passport-orbit` for a generated Three.js passport scene. Drag the passport to turn it, move the pointer to shift its perspective, switch cover materials, or pause the slow orbit. The route lazy-loads the 3D chunk, uses only low-poly primitives with no model download, caps the renderer pixel ratio at 1.5, and serves a static fallback for reduced-motion and low-power devices. With more time, I would add a compressed GLB stamp collection and measure frame time across a wider device matrix.

## 🤖 AI Usage

AI was used as a development assistant for generating component structures, suggesting React logic, creating responsive layouts, and improving the application's architecture. All generated code was manually reviewed, tested, and refined before being included in the final application.

## 👩‍💻 Author

K. Varshini
AI Frontend Engineering Intern
FlyRank AI
