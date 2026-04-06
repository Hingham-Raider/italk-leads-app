# ITALK Lead Management App

A multi-user web app for managing sales leads. Built with Node.js, Express, and SQLite.

## Quick Start (Local)

```bash
npm install
node seed.js      # Import your 44 leads from the spreadsheet
node server.js    # App runs at http://localhost:3000
```

## Deploy to Render (Free Hosting)

1. Push this folder to a GitHub repository
2. Go to [render.com](https://render.com) and sign in with GitHub
3. Click **New > Web Service** and select your repo
4. Render will auto-detect the `render.yaml` config
5. Click **Deploy** — your app will be live in ~2 minutes

The `render.yaml` file handles everything: install, seed data, and start the server with persistent storage.

## Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) and connect your repo
3. Set the start command to: `npm install && node seed.js && node server.js`
4. Deploy — you'll get a public URL automatically

## Features

- View all leads in a sortable, searchable table
- Add new leads via a clean form
- Edit any existing lead inline
- Delete leads with confirmation
- Status tracking: Open / Won / Lost
- Responsive design — works on desktop and mobile
- Multi-user: anyone with the URL can view and edit leads
- All 44 leads from your ITALK spreadsheet are pre-loaded

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **Frontend**: Vanilla HTML/CSS/JS (no build step)
