# Work Tracker 📝🚀

A gamified daily-activity journal that helps software engineers log work, visualise progress, and stay motivated with streaks & achievements.

## ✨ Key Features

• **Daily Activity Log** – quick form to record what you worked on each day, with category tags (Development, Testing, Analysis, Debugging, Learning, Work Items).  
• **Timeline** – filterable, scrollable list of past entries (Last 7 Days, 30 Days, etc.) with inline edit & delete.  
• **Stats & Achievements** – automatic streak tracking, unlockable badges (First Step, Week Warrior, 14-Day Streak, 100-Day Legend, etc.).  
• **Analytics Dashboard** – charts for weekly activity, 30-day trend and tag distribution (interactive pie chart).  
• **Sync & Auth** – Firebase Authentication (email+password) and Express + MongoDB backend (deployed on Render).  
• **Offline-friendly** – entries cached in local storage; UI works even without network.

## 🏗️ Tech Stack

Front-end
- React 18 + Vite + TypeScript
- TailwindCSS + shadcn/ui components
- Zustand state management
- Recharts for data-viz

Back-end (separate repo)
- Express router deployed as Firebase Cloud Function (or standalone on Render)
- MongoDB Atlas

CI/CD
- GitHub Actions → Firebase Hosting (static front-end)  
- Render auto-deploy for backend

## 🚀 Local Development

```bash
# 1. Clone & install
git clone https://github.com/<you>/work-tracker.git
cd work-tracker
npm install

# 2. Create .env
cp .env.example .env        # fill values (see below)

# 3. Run dev server
npm run dev                 # http://localhost:5173
```

`.env` keys (front-end)
```
VITE_API_URL=http://localhost:4000       # or Render URL in prod
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

For backend setup see **functions/README.md** in the server repo.

## 📦 Production Deploy

1. **Push to GitHub** – repo is the single source of truth; secrets and `node_modules` are ignored via `.gitignore`.
2. **Firebase Hosting** – GitHub Action builds (`vite build`) and deploys on every push to `main`.
3. **Render** – backend auto-deploys from its repo; environment variables configured in Render dashboard.
4. **UptimeRobot** – pings `/health` endpoint to keep Render dyno awake.

## 🤝 Contributing

Issues and PRs are welcome!  
Run `npm run lint` and `npm run build` before submitting.

## 📄 License

MIT © 2025 Shashank Nadikatla
