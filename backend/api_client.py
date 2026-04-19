"""
OpenAI API client wrapper.
Provides a single `chat_completion` helper used by all backend modules.
"""
from openai import OpenAI
from config import config


_client: OpenAI | None = None


def get_client() -> OpenAI:
    """Return a cached OpenAI client instance."""
    global _client
    if _client is None:
        if not config.OPENAI_API_KEY:
            raise RuntimeError(
                "OPENAI_API_KEY is not set. "
                "Copy backend/.env.example to backend/.env and add your key."
            )
        _client = OpenAI(api_key=config.OPENAI_API_KEY)
    return _client


def chat_completion(
    messages: list[dict],
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> str:
    """
    Send a chat completion request to OpenAI and return the response text.

    Args:
        messages:    List of {"role": ..., "content": ...} dicts.
        temperature: Sampling temperature (defaults to config value).
        max_tokens:  Max tokens for the response (defaults to config value).

    Returns:
        The assistant's reply as a plain string.

    Raises:
        RuntimeError: If the API key is missing or the request fails.
    """
    client = get_client()
    response = client.chat.completions.create(
        model=config.OPENAI_MODEL,
        messages=messages,
        temperature=temperature if temperature is not None else config.OPENAI_TEMPERATURE,
        max_tokens=max_tokens if max_tokens is not None else config.OPENAI_MAX_TOKENS,
    )
    return response.choices[0].message.content or ""
