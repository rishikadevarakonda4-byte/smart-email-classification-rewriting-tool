# Smart Email UI

A React + Vite frontend for a FastAPI backend that classifies and rewrites email content.

## Features

- Email classification with category, confidence, and reasoning
- Email rewriting with tone selection and polished results
- Tailwind CSS responsive SaaS-style UI
- API integration using Axios and React Query
- Loading states and error handling

## Prerequisites

- Node.js 18+ or compatible package manager environment
- FastAPI backend running on `http://localhost:8000`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Confirm the FastAPI backend runs on `http://localhost:8000` and that `/api` proxy is configured.

## Build

```bash
npm run build
```
