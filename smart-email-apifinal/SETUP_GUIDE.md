# Complete Step-by-Step Guide: Smart Email Classifier & Rewriter

---

## What You're Building
A Python web API (FastAPI) with two endpoints that use OpenAI's GPT to:
1. Classify any email as Work / Personal / Finance / Spam
2. Rewrite any email in a different tone (professional, friendly, etc.)

**Time to complete: ~30–45 minutes**

---

## PART 1 — One-Time Setup (Do this once)

### Step 1: Install Python
1. Go to https://www.python.org/downloads/
2. Download **Python 3.11** (click the big yellow button)
3. Run the installer — **tick "Add Python to PATH"** before clicking Install
4. To verify, open a terminal and run:
   ```
   python --version
   ```
   You should see `Python 3.11.x`

> **What is a terminal?**
> - Windows: Press `Win + R`, type `cmd`, press Enter
> - Mac: Press `Cmd + Space`, type `Terminal`, press Enter

---

### Step 2: Get an OpenAI API Key (Free Trial Available)
1. Go to https://platform.openai.com/signup and create a free account
2. After logging in, go to https://platform.openai.com/api-keys
3. Click **"Create new secret key"**
4. Give it a name (e.g. `email-project`)
5. **Copy the key immediately** — it starts with `sk-proj-...`
   - You won't be able to see it again
   - Save it in Notepad for now
6. Add $5 credit: https://platform.openai.com/settings/billing/payment-methods
   - The model we use (gpt-4o-mini) costs ~$0.001 per request — $5 will last thousands of calls

---

### Step 3: Install Git (to upload to GitHub)
1. Go to https://git-scm.com/downloads
2. Download and install for your OS (default settings are fine)
3. Verify:
   ```
   git --version
   ```

---

## PART 2 — Project Setup

### Step 4: Create the Project Folder
Open a terminal and run these commands one by one:

```bash
mkdir smart-email-api
cd smart-email-api
```

---

### Step 5: Create a Virtual Environment
A virtual environment keeps this project's packages isolated from your system.

```bash
python -m venv venv
```

Now **activate** it:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

> You'll know it's active when you see `(venv)` at the start of your terminal prompt.

---

### Step 6: Create the Project Files
Create the following folder structure. You can do this in File Explorer / Finder,
or use these terminal commands:

```bash
mkdir models services prompts
```

Now create each file below using any text editor (VS Code is recommended).

> **Tip:** Install VS Code free at https://code.visualstudio.com/
> Open the project: `code .`

---

### Step 7: Copy All Project Files

Create these files exactly as provided:

```
smart-email-api/
├── main.py
├── models/
│   ├── __init__.py          (empty file)
│   └── schemas.py
├── services/
│   ├── __init__.py          (empty file)
│   └── llm_service.py
├── prompts/
│   ├── __init__.py          (empty file)
│   ├── classify_prompt.py
│   └── rewrite_prompt.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── .gitignore
└── README.md
```

---

### Step 8: Create Your .env File
In the terminal (inside your project folder):

```bash
copy .env.example .env        (Windows)
cp .env.example .env          (Mac/Linux)
```

Open `.env` in a text editor and replace the placeholder with your real key:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Step 9: Install Dependencies
Make sure your virtual environment is still active (you see `(venv)` in your prompt), then:

```bash
pip install -r requirements.txt
```

This installs FastAPI, the OpenAI SDK, and a few other packages.
It takes about 1–2 minutes.

---

## PART 3 — Run the App

### Step 10: Start the Server
```bash
python main.py
```

You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

**Your API is now running!** Keep this terminal window open.

---

### Step 11: Test It — Swagger UI (Easiest)
Open your browser and go to:
```
http://localhost:8000/docs
```

You'll see a beautiful interactive UI. To test an endpoint:
1. Click on **POST /classify_email**
2. Click **"Try it out"**
3. Replace the example with your own email text
4. Click **"Execute"**
5. See the result below

---

### Step 12: Test with curl (Command Line)

Open a **second terminal** window (keep the first one running the server).

**Test classification:**
```bash
curl -X POST "http://localhost:8000/classify_email" \
  -H "Content-Type: application/json" \
  -d "{\"email_content\": \"Hi Sarah, please review the Q3 report before our 10am meeting tomorrow. Thanks, John\"}"
```

**Expected response:**
```json
{
  "category": "Work",
  "confidence": "High",
  "reasoning": "The email is about reviewing a business report before a meeting, which are clear work-related activities."
}
```

---

**Test rewriting:**
```bash
curl -X POST "http://localhost:8000/rewrite_email" \
  -H "Content-Type: application/json" \
  -d "{\"email_content\": \"hey can u send me the report asap thx\", \"tone\": \"professional\"}"
```

**Expected response:**
```json
{
  "original_email": "hey can u send me the report asap thx",
  "rewritten_email": "Hi,\n\nCould you please send me the report at your earliest convenience?\n\nThank you,\n[Your Name]",
  "tone_applied": "professional"
}
```

---

## PART 4 — GitHub Submission

### Step 13: Create a GitHub Repository
1. Go to https://github.com and sign in (create account if needed)
2. Click the **"+"** icon → **"New repository"**
3. Name it: `smart-email-api`
4. Set it to **Public**
5. Do NOT tick "Add README" (you already have one)
6. Click **"Create repository"**

---

### Step 14: Push Your Code
Back in your terminal (in the project folder):

```bash
git init
git add .
git commit -m "Initial commit: Smart Email Classifier & Rewriter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-email-api.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

> **Important:** The `.gitignore` file already excludes your `.env` file,
> so your API key will NOT be uploaded. Never manually add `.env` to git.

---

## PART 5 — Bonus: Docker (Optional, adds marks)

### Step 15: Install Docker Desktop
1. Go to https://www.docker.com/products/docker-desktop/
2. Download and install Docker Desktop
3. Start Docker Desktop (leave it running in background)

### Step 16: Build and Run with Docker
```bash
docker build -t smart-email-api .

docker run -p 8000:8000 -e OPENAI_API_KEY=sk-proj-your-key-here smart-email-api
```

The API will be available at http://localhost:8000 — same as before.

---

## Quick Reference

| What | Where |
|------|-------|
| Interactive API docs | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |
| Classify endpoint | POST http://localhost:8000/classify_email |
| Rewrite endpoint | POST http://localhost:8000/rewrite_email |
| Change AI model | Edit OPENAI_MODEL in .env |

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again with venv active |
| `401 Unauthorized` | Your API key in `.env` is wrong or missing |
| `Port 8000 in use` | Another app is using port 8000; change to 8001 in `main.py` |
| `venv\Scripts\activate` not working on Windows | Use PowerShell instead of CMD, or run `Set-ExecutionPolicy RemoteSigned` |
| `curl` not found on Windows | Use the Swagger UI at http://localhost:8000/docs instead |
