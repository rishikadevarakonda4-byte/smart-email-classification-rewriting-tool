# Smart Email Classifier & Rewriter 📧

A FastAPI microservice that uses OpenAI's GPT-4o-mini to **classify** emails into
categories and **rewrite** them in any tone — built for the Gen-AI Internship Assessment.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [APIs Used](#apis-used)
3. [Setup & Run](#setup--run)
4. [Run with Docker](#run-with-docker)
5. [API Reference](#api-reference)
6. [Sample Input / Output](#sample-input--output)
7. [Prompt Design](#prompt-design)

---

## Project Structure

```
smart-email-api/
├── main.py                  # FastAPI app — all endpoints live here
├── models/
│   └── schemas.py           # Pydantic request/response models
├── services/
│   └── llm_service.py       # OpenAI API calls (classify + rewrite)
├── prompts/
│   ├── classify_prompt.py   # Classification prompt template
│   └── rewrite_prompt.py    # Rewrite prompt template + tone guidelines
├── requirements.txt
├── Dockerfile
├── .env.example             # Copy to .env and add your key
└── README.md
```

---

## APIs Used

| Service | Purpose | Model |
|---------|---------|-------|
| [OpenAI Chat Completions](https://platform.openai.com/docs/api-reference/chat) | Email classification & rewriting | `gpt-4o-mini` |

**Why gpt-4o-mini?**
- Cheap (~$0.15 / 1M input tokens — nearly free for testing)
- Fast response times
- Strong instruction-following for structured JSON output
- Can be swapped to `gpt-4o` by changing `OPENAI_MODEL` in `.env`

---

## Setup & Run

### Prerequisites
- Python 3.10 or higher
- An [OpenAI account](https://platform.openai.com/) with an API key

### Step 1 — Clone / download the project
```bash
# If using Git
git clone <your-repo-url>
cd smart-email-api

# Or just unzip and cd into the folder
```

### Step 2 — Create a virtual environment
```bash
python -m venv venv

# Activate it:
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Add your OpenAI API key
```bash
cp .env.example .env
```
Open `.env` in any text editor and replace `sk-...your-key-here...` with your real key:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```
> Get your key at https://platform.openai.com/api-keys

### Step 5 — Run the server
```bash
python main.py
```
The API is now live at **http://localhost:8000**

Open the interactive docs at **http://localhost:8000/docs** (Swagger UI).

---

## Run with Docker

```bash
# Build the image
docker build -t smart-email-api .

# Run the container (pass your Gemini API key)
docker run -p 8000:8000 -e GEMINI_API_KEY=your_gemini_api_key smart-email-api
```

If you want to override the default model, add:
```bash
docker run -p 8000:8000 -e GEMINI_API_KEY=your_gemini_api_key -e GEMINI_MODEL=gemini-2.5-flash smart-email-api
```

---

## API Reference

### `POST /classify_email`
Classifies an email into one of: **Work**, **Personal**, **Finance**, **Spam**

**Request body:**
```json
{
  "email_content": "<raw email text>"
}
```

**Response:**
```json
{
  "category": "Work | Personal | Finance | Spam",
  "confidence": "High | Medium | Low",
  "reasoning": "Explanation of the classification."
}
```

---

### `POST /rewrite_email`
Rewrites an email in the specified tone.

**Request body:**
```json
{
  "email_content": "<raw email text>",
  "tone": "professional | friendly | formal | casual | concise | empathetic"
}
```

**Response:**
```json
{
  "original_email": "...",
  "rewritten_email": "...",
  "tone_applied": "professional"
}
```

---

## Sample Input / Output

### Classification Example
**Input:**
```json
{
  "email_content": "Hi Sarah, please review the attached invoice #INV-2024-089 for $1,250. Payment is due by June 30. Let me know if you have questions."
}
```
**Output:**
```json
{
  "category": "Finance",
  "confidence": "High",
  "reasoning": "The email is about a payment invoice with a specific amount and due date, which are clear Finance indicators."
}
```

---

### Rewrite Example
**Input:**
```json
{
  "email_content": "hey can u send me the report asap thx",
  "tone": "professional"
}
```
**Output:**
```json
{
  "original_email": "hey can u send me the report asap thx",
  "rewritten_email": "Hi,\n\nCould you please send me the report at your earliest convenience?\n\nThank you,\n[Your Name]",
  "tone_applied": "professional"
}
```

---

## Prompt Design

Prompts are stored in `prompts/` and are designed around three principles:

1. **Explicit category definitions** — Each category (Work, Personal, Finance, Spam) has a clear written definition in the prompt so the model never has to guess boundary cases (e.g. "is a salary slip Work or Finance?" → Finance by our definition).

2. **Structured output enforcement** — The classification prompt requests a strict JSON format and the API call uses `response_format: {"type": "json_object"}` to guarantee parseable output without post-processing.

3. **Tone guidelines dictionary** — The rewrite prompt looks up a `TONE_GUIDELINES` dict for the requested tone, translating vague words like "professional" into concrete instructions for the model (e.g. *"avoid contractions, maintain respectful distance"*). Unknown tones fall back gracefully.

**Temperature choices:**
- Classification: `0.1` — low randomness for consistent, reproducible labels
- Rewriting: `0.7` — moderate creativity for natural-sounding output
