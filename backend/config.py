"""
Backend configuration.
Reads settings from environment variables (via .env file in development).
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # OpenAI
    OPENAI_API_KEY: str = os.environ.get("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_MAX_TOKENS: int = int(os.environ.get("OPENAI_MAX_TOKENS", "4000"))
    OPENAI_TEMPERATURE: float = float(os.environ.get("OPENAI_TEMPERATURE", "0.7"))

    # Debate
    DEBATE_ROUNDS: int = int(os.environ.get("DEBATE_ROUNDS", "2"))

    # Flask
    DEBUG: bool = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    HOST: str = os.environ.get("HOST", "0.0.0.0")
    PORT: int = int(os.environ.get("PORT", "5000"))

    # CORS – comma-separated list of allowed origins
    ALLOWED_ORIGINS: list[str] = [
        o.strip()
        for o in os.environ.get(
            "ALLOWED_ORIGINS",
            "http://localhost:3000,http://localhost:8000,http://127.0.0.1:8000,null"
        ).split(",")
        if o.strip()
    ]

    # Rate limiting (requests per minute per IP)
    RATE_LIMIT: int = int(os.environ.get("RATE_LIMIT", "10"))


config = Config()
