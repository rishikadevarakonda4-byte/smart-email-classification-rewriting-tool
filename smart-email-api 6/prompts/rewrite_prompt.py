"""
rewrite_prompt.py
─────────────────
Prompt template for the /rewrite_email endpoint.

Design decisions:
  1. Built-in tone guidelines mean the model doesn't have to guess what
     "professional" vs "formal" means — we define it explicitly.
  2. For unknown tones we fall back to a generic description so the
     endpoint never fails on unusual user inputs (e.g. "pirate").
  3. Temperature 0.7 in the LLM call gives creative latitude while still
     following instructions.
  4. We explicitly forbid adding new information to avoid hallucinations.
"""

# ── Tone guideline lookup ─────────────────────────────────────────────────────
TONE_GUIDELINES: dict[str, str] = {
    "professional": (
        "Use clear, polished, business-appropriate language. "
        "Avoid slang and contractions where possible. "
        "Maintain a respectful, results-focused tone."
    ),
    "friendly": (
        "Use warm, conversational language as if writing to a close colleague. "
        "Short sentences are fine. Light humour is welcome."
    ),
    "formal": (
        "Use highly structured, impersonal language. "
        "No contractions. Full sentences. Correct titles and salutations."
    ),
    "casual": (
        "Write as though texting a friend. "
        "Contractions, informal phrases, and short sentences are all fine."
    ),
    "concise": (
        "Cut every unnecessary word. "
        "Use bullet points if listing items. Aim for the shortest version that keeps all key facts."
    ),
    "empathetic": (
        "Lead with understanding and warmth. "
        "Acknowledge the reader's situation or feelings. "
        "Keep language gentle and supportive."
    ),
}


def get_tone_guideline(tone: str) -> str:
    """Return a guideline string for the requested tone (case-insensitive)."""
    return TONE_GUIDELINES.get(tone.lower(), f"a {tone} style — interpret this tone naturally and consistently.")


def get_rewrite_prompt(email_content: str, tone: str) -> str:
    """Return the full rewrite prompt for the given email text and tone."""

    guideline = get_tone_guideline(tone)

    return f"""You are an expert email writer who specialises in tone adaptation.

## Task
Rewrite the email below in a **{tone}** tone.

## What "{tone}" means
{guideline}

## Original email
\"\"\"
{email_content}
\"\"\"

## Rules
1. **Preserve** all key facts, requests, and information from the original.
2. **Do not** add information that was not in the original email.
3. **Adjust** the greeting, sign-off, and body language to match the {tone} tone.
4. **Keep** the rewritten email at a similar length — do not pad or drastically shorten.

## Output
Return ONLY the rewritten email text. No labels, no explanations, no markdown fences."""
