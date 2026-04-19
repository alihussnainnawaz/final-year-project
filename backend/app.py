"""
Flask Application
Exposes REST API endpoints consumed by the frontend.
"""
import logging
import time
from collections import defaultdict
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import config
from prompt_refiner import refine_prompt
from debate_engine import run_debate
from code_generator import generate_full_project

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if config.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ── App setup ─────────────────────────────────────────────────────────────────
app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": config.ALLOWED_ORIGINS}},
    supports_credentials=False,
)

# ── Rate limiting (simple in-memory, per IP) ──────────────────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)


def rate_limited(f):
    """Decorator: allow at most RATE_LIMIT requests per minute per IP."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        ip = request.remote_addr or "unknown"
        now = time.time()
        window = 60.0
        limit = config.RATE_LIMIT

        # Prune old timestamps
        _rate_store[ip] = [t for t in _rate_store[ip] if now - t < window]

        if len(_rate_store[ip]) >= limit:
            return jsonify({"error": "Rate limit exceeded. Please wait a moment."}), 429

        _rate_store[ip].append(now)
        return f(*args, **kwargs)
    return wrapper


# ── Input validation helpers ──────────────────────────────────────────────────
def _require_json_field(field: str, min_len: int = 5) -> tuple[str | None, tuple | None]:
    """
    Extract a required string field from the JSON body.
    Returns (value, None) on success or (None, error_response) on failure.
    """
    data = request.get_json(silent=True)
    if not data:
        return None, (jsonify({"error": "Request body must be JSON."}), 400)

    value = data.get(field, "")
    if not isinstance(value, str) or len(value.strip()) < min_len:
        return None, (
            jsonify({"error": f"'{field}' must be a non-empty string (min {min_len} chars)."}),
            400,
        )
    return value.strip(), None


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    """Quick liveness check."""
    return jsonify({"status": "ok", "model": config.OPENAI_MODEL})


@app.post("/api/refinePrompt")
@rate_limited
def api_refine_prompt():
    """Refine a raw user prompt into a professional specification."""
    prompt, err = _require_json_field("prompt", min_len=5)
    if err:
        return err

    try:
        refined = refine_prompt(prompt)
        log.info("refinePrompt OK (len=%d)", len(refined))
        return jsonify({"refinedPrompt": refined})
    except Exception as exc:
        log.exception("refinePrompt failed")
        return jsonify({"error": str(exc)}), 500


@app.post("/api/runDebate")
@rate_limited
def api_run_debate():
    """Run the Optimist/Pessimist debate for a given topic."""
    topic, err = _require_json_field("topic", min_len=10)
    if err:
        return err

    try:
        result = run_debate(topic)
        log.info("runDebate OK (rounds=%d)", len(result.get("rounds", [])))
        return jsonify(result)
    except Exception as exc:
        log.exception("runDebate failed")
        return jsonify({"error": str(exc)}), 500


@app.post("/api/generateCode")
@rate_limited
def api_generate_code():
    """
    Generate a single file.
    Body: { refinedPrompt, conclusion, fileInfo: {path, type, description} }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    refined_prompt = data.get("refinedPrompt", "").strip()
    conclusion = data.get("conclusion", "").strip()
    file_info = data.get("fileInfo", {})

    if not refined_prompt:
        return jsonify({"error": "'refinedPrompt' is required."}), 400
    if not isinstance(file_info, dict) or not file_info.get("path"):
        return jsonify({"error": "'fileInfo.path' is required."}), 400

    try:
        from code_generator import _generate_file  # reuse internal helper
        content = _generate_file(file_info, refined_prompt, conclusion, [file_info])
        log.info("generateCode OK (path=%s)", file_info.get("path"))
        return jsonify({"content": content, "path": file_info.get("path")})
    except Exception as exc:
        log.exception("generateCode failed")
        return jsonify({"error": str(exc)}), 500


@app.post("/api/generateFullProject")
@rate_limited
def api_generate_full_project():
    """
    Generate a complete, multi-file frontend project.
    Body: { refinedPrompt, conclusion }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    refined_prompt = data.get("refinedPrompt", "").strip()
    conclusion = data.get("conclusion", "").strip()

    if not refined_prompt:
        return jsonify({"error": "'refinedPrompt' is required."}), 400

    try:
        project = generate_full_project(refined_prompt, conclusion)
        log.info(
            "generateFullProject OK (files=%d)", len(project.get("files", {}))
        )
        return jsonify(project)
    except Exception as exc:
        log.exception("generateFullProject failed")
        return jsonify({"error": str(exc)}), 500


# ── 404 / 405 handlers ────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Endpoint not found."}), 404


@app.errorhandler(405)
def method_not_allowed(_):
    return jsonify({"error": "Method not allowed."}), 405


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if not config.OPENAI_API_KEY:
        log.warning(
            "OPENAI_API_KEY is not set! "
            "Copy backend/.env.example to backend/.env and add your key."
        )
    log.info("Starting server on %s:%d (debug=%s)", config.HOST, config.PORT, config.DEBUG)
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
