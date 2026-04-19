"""
Prompt Refiner
Transforms a casual user description into a professional frontend specification.
"""
from api_client import chat_completion

_SYSTEM_PROMPT = (
    "You are an expert UI/UX designer and senior web developer. "
    "Your task is to take a user's rough idea for a website or web application "
    "and refine it into a detailed, professional specification.\n\n"
    "Analyse the user's input and provide:\n"
    "1. A clear, enhanced description of what they want to build\n"
    "2. Key features and functionality that should be included\n"
    "3. Suggested design elements and visual style\n"
    "4. Technical requirements (responsive, accessibility, etc.)\n"
    "5. User experience considerations\n\n"
    "Format your response as a structured specification that will be used "
    "to guide code generation. Be thorough but concise."
)


def refine_prompt(user_prompt: str) -> str:
    """
    Refine a raw user prompt into a professional specification.

    Args:
        user_prompt: The user's raw description.

    Returns:
        A refined, detailed specification string.
    """
    messages = [
        {"role": "system", "content": _SYSTEM_PROMPT},
        {"role": "user", "content": user_prompt},
    ]
    return chat_completion(messages, temperature=0.5, max_tokens=1500)
