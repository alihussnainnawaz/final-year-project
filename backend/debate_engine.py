"""
Debate Engine
Runs a multi-agent debate between an Optimist and a Pessimist agent
to arrive at an optimal frontend implementation plan.
"""
from api_client import chat_completion
from config import config

_OPTIMIST_SYSTEM = (
    "You are an optimistic AI agent debating web development approaches. "
    "Your role is to:\n"
    "- Propose innovative, feature-rich solutions\n"
    "- Suggest modern, cutting-edge approaches\n"
    "- Focus on exceptional user experiences\n"
    "- Embrace new technologies when appropriate\n"
    "- Be enthusiastic but remain realistic and professional.\n\n"
    "Keep each response focused and concise (3-5 sentences)."
)

_PESSIMIST_SYSTEM = (
    "You are a cautious, analytical AI agent debating web development approaches. "
    "Your role is to:\n"
    "- Identify potential problems and edge cases\n"
    "- Emphasise practical constraints (time, complexity, browser compatibility)\n"
    "- Advocate for simpler, more maintainable solutions\n"
    "- Prioritise reliability, performance, and accessibility\n"
    "- Be constructive – the goal is the best outcome, not negativity.\n\n"
    "Keep each response focused and concise (3-5 sentences)."
)

_CONCLUSION_SYSTEM = (
    "You are a senior software architect. "
    "Given a debate between an Optimist and a Pessimist agent about a web project, "
    "synthesise their perspectives into a balanced, actionable implementation plan. "
    "The plan should list the key design decisions, recommended features, file structure hints, "
    "and any important trade-offs. Be concise and practical."
)


def run_debate(refined_prompt: str) -> dict:
    """
    Run DEBATE_ROUNDS rounds between Optimist and Pessimist agents,
    then generate a final conclusion.

    Args:
        refined_prompt: The refined project specification.

    Returns:
        {
            "rounds": [{"optimist": str, "pessimist": str}, ...],
            "conclusion": str
        }
    """
    rounds: list[dict] = []
    history: list[str] = []  # running transcript for context

    for round_num in range(1, config.DEBATE_ROUNDS + 1):
        context_block = (
            "\n\nPrevious debate:\n" + "\n".join(history) if history else ""
        )

        # --- Optimist ---
        opt_user_content = (
            f"Project specification:\n{refined_prompt}"
            f"{context_block}\n\n"
            f"Round {round_num}: What is your proposal for this project?"
        )
        optimist_reply = chat_completion(
            [
                {"role": "system", "content": _OPTIMIST_SYSTEM},
                {"role": "user", "content": opt_user_content},
            ],
            temperature=0.8,
            max_tokens=600,
        )
        history.append(f"Optimist (Round {round_num}):\n{optimist_reply}")

        # --- Pessimist ---
        pess_user_content = (
            f"Project specification:\n{refined_prompt}"
            f"\n\n{chr(10).join(history)}\n\n"
            f"Round {round_num}: What are your concerns and counter-proposals?"
        )
        pessimist_reply = chat_completion(
            [
                {"role": "system", "content": _PESSIMIST_SYSTEM},
                {"role": "user", "content": pess_user_content},
            ],
            temperature=0.7,
            max_tokens=600,
        )
        history.append(f"Pessimist (Round {round_num}):\n{pessimist_reply}")

        rounds.append({"optimist": optimist_reply, "pessimist": pessimist_reply})

    # --- Conclusion ---
    conclusion_prompt = (
        f"Project specification:\n{refined_prompt}\n\n"
        f"Debate transcript:\n{chr(10).join(history)}\n\n"
        "Synthesise the debate into a concise, actionable implementation plan."
    )
    conclusion = chat_completion(
        [
            {"role": "system", "content": _CONCLUSION_SYSTEM},
            {"role": "user", "content": conclusion_prompt},
        ],
        temperature=0.6,
        max_tokens=1000,
    )

    return {"rounds": rounds, "conclusion": conclusion}
