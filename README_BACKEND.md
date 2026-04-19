# Backend Documentation

## Overview

The Python Flask backend for the AI Frontend Generator securely wraps the OpenAI API
and exposes REST endpoints consumed by the frontend.  
**The OpenAI API key is stored only in the backend** – it is never exposed to the browser.

---

## Requirements

- Python 3.11+
- An OpenAI API key with access to `gpt-4o-mini` (or another model)

---

## Quick Start

```bash
# 1. Enter the backend directory
cd backend

# 2. Create & activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=sk-...

# 5. Start the server
python app.py
```

The server starts on **http://localhost:5000** by default.

---

## Project Structure

```
backend/
├── app.py              ← Flask application & API routes
├── config.py           ← Configuration (reads from .env)
├── api_client.py       ← OpenAI client wrapper
├── prompt_refiner.py   ← Prompt refinement logic
├── debate_engine.py    ← Multi-agent debate system
├── code_generator.py   ← Code generation logic
├── requirements.txt    ← Python dependencies
├── .env.example        ← Environment variable template
└── .gitignore          ← Git ignore rules
```

---

## API Endpoints

All endpoints accept and return JSON.

### `GET /api/health`

Liveness check.

**Response**
```json
{ "status": "ok", "model": "gpt-4o-mini" }
```

---

### `POST /api/refinePrompt`

Refine a casual user description into a professional specification.

**Request**
```json
{ "prompt": "landing page for a coffee shop" }
```

**Response**
```json
{ "refinedPrompt": "Detailed professional specification..." }
```

---

### `POST /api/runDebate`

Run the Optimist / Pessimist debate for a given topic.

**Request**
```json
{ "topic": "Refined specification..." }
```

**Response**
```json
{
  "rounds": [
    { "optimist": "Round 1 proposal...", "pessimist": "Round 1 critique..." },
    { "optimist": "Round 2 refinement...", "pessimist": "Round 2 validation..." }
  ],
  "conclusion": "Balanced implementation plan..."
}
```

---

### `POST /api/generateCode`

Generate the code for a single file.

**Request**
```json
{
  "refinedPrompt": "...",
  "conclusion": "...",
  "fileInfo": { "path": "index.html", "type": "html", "description": "Main page" }
}
```

**Response**
```json
{ "path": "index.html", "content": "<!DOCTYPE html>..." }
```

---

### `POST /api/generateFullProject`

Generate the complete multi-file project in one call.

**Request**
```json
{
  "refinedPrompt": "...",
  "conclusion": "..."
}
```

**Response**
```json
{
  "files": {
    "index.html": "...",
    "css/main.css": "...",
    "js/main.js": "..."
  },
  "structure": [
    { "path": "index.html", "type": "html", "description": "Main page" }
  ],
  "summary": "Generated 5 files: index.html, css/main.css, ..."
}
```

---

## Configuration Reference

| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | *(required)* | Your OpenAI secret key |
| `OPENAI_MODEL` | `gpt-4o-mini` | Model to use |
| `OPENAI_MAX_TOKENS` | `4000` | Max response tokens |
| `OPENAI_TEMPERATURE` | `0.7` | Sampling temperature |
| `DEBATE_ROUNDS` | `2` | Number of debate rounds |
| `FLASK_DEBUG` | `false` | Enable Flask debug mode |
| `HOST` | `0.0.0.0` | Bind host |
| `PORT` | `5000` | Bind port |
| `ALLOWED_ORIGINS` | *(localhost variants)* | CORS allowed origins (comma-separated) |
| `RATE_LIMIT` | `10` | Max requests per minute per IP |

---

## Security Notes

- The `.env` file is listed in `.gitignore` and **must never be committed**.
- CORS is configured to allow only the origins listed in `ALLOWED_ORIGINS`.
- Rate limiting prevents abuse (configurable via `RATE_LIMIT`).
- Input validation rejects empty or too-short prompts before hitting the AI.

---

## Production Deployment

### With Gunicorn

```bash
gunicorn --workers 2 --bind 0.0.0.0:5000 "app:app"
```

### With Docker

```bash
# Build
docker build -t ai-frontend-generator .

# Run
docker run -p 5000:5000 \
  -e OPENAI_API_KEY=sk-... \
  ai-frontend-generator
```

Or use Docker Compose (see `docker-compose.yml` in the project root).

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `OPENAI_API_KEY is not set` | Copy `.env.example` → `.env` and add your key |
| `429 Too Many Requests` | Wait 60 seconds or increase `RATE_LIMIT` |
| CORS errors in browser | Add your frontend origin to `ALLOWED_ORIGINS` in `.env` |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` inside the `backend/` directory |
