"""
Code Generator
Generates a structured, modular frontend project based on a refined
specification and debate conclusion.
"""
import json
import re
from api_client import chat_completion

_STRUCTURE_SYSTEM = (
    "You are a senior frontend architect. "
    "Given a project specification, plan the optimal file structure for a "
    "production-ready frontend project. "
    "Return ONLY a valid JSON array of objects with keys: "
    '\"path\" (string), \"type\" (\"html\"|\"css\"|\"js\"), \"description\" (string). '
    "Include at least: one index.html, one or two CSS files, and two to four JS files. "
    "No markdown, no code fences – raw JSON only."
)

_CODE_SYSTEM = (
    "You are an expert {file_type} developer. "
    "Generate clean, modern, production-ready {file_type} code. "
    "Requirements: semantic & accessible, responsive design, ES6+, CSS custom properties, "
    "well-commented, no external dependencies unless widely available via CDN. "
    "Respond with ONLY the raw code – no markdown code fences, no explanations."
)


def _plan_structure(refined_prompt: str, conclusion: str) -> list[dict]:
    """Ask the LLM for the optimal file structure and parse the JSON."""
    user_content = (
        f"Project specification:\n{refined_prompt}\n\n"
        f"Implementation plan:\n{conclusion}\n\n"
        "Return the file structure as a JSON array."
    )
    raw = chat_completion(
        [
            {"role": "system", "content": _STRUCTURE_SYSTEM},
            {"role": "user", "content": user_content},
        ],
        temperature=0.4,
        max_tokens=800,
    )

    # Strip any accidental markdown fences
    raw = re.sub(r"```(?:json)?", "", raw).strip().strip("`").strip()

    try:
        structure = json.loads(raw)
        if isinstance(structure, list):
            return structure
    except json.JSONDecodeError:
        pass

    # Fallback: minimal structure
    return [
        {"path": "index.html",       "type": "html", "description": "Main HTML file"},
        {"path": "css/main.css",     "type": "css",  "description": "Core styles"},
        {"path": "css/components.css","type": "css",  "description": "Component styles"},
        {"path": "js/main.js",       "type": "js",   "description": "Main application"},
        {"path": "js/utils.js",      "type": "js",   "description": "Utility functions"},
    ]


def _generate_file(
    file_info: dict,
    refined_prompt: str,
    conclusion: str,
    structure: list[dict],
) -> str:
    """Generate the code for a single file."""
    file_type = file_info.get("type", "html").upper()
    file_path = file_info.get("path", "")
    description = file_info.get("description", "")

    structure_summary = ", ".join(f["path"] for f in structure)

    system = _CODE_SYSTEM.format(file_type=file_type)
    user_content = (
        f"Project specification:\n{refined_prompt}\n\n"
        f"Implementation plan:\n{conclusion}\n\n"
        f"Project file structure: {structure_summary}\n\n"
        f"Generate the {file_type} code for: {file_path}\n"
        f"Purpose: {description}\n\n"
        "Important: output only the raw code, no markdown or explanations."
    )

    return chat_completion(
        [
            {"role": "system", "content": system},
            {"role": "user", "content": user_content},
        ],
        temperature=0.6,
        max_tokens=3000,
    )


def generate_full_project(refined_prompt: str, conclusion: str) -> dict:
    """
    Plan and generate all files for the project.

    Args:
        refined_prompt: Refined project specification.
        conclusion:     Debate conclusion / implementation plan.

    Returns:
        {
            "files":     { "<path>": "<content>", ... },
            "structure": [{"path", "type", "description"}, ...],
            "summary":   str
        }
    """
    structure = _plan_structure(refined_prompt, conclusion)

    files: dict[str, str] = {}
    for file_info in structure:
        path = file_info.get("path", "").strip()
        if not path:
            continue
        content = _generate_file(file_info, refined_prompt, conclusion, structure)
        files[path] = content

    file_count = len(files)
    summary = (
        f"Generated {file_count} file{'s' if file_count != 1 else ''}: "
        + ", ".join(files.keys())
    )

    return {"files": files, "structure": structure, "summary": summary}
