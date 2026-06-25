"""
llm_service.py
──────────────
Thin wrapper around the Google Gemini API (free tier).

• classify_email_with_llm  → ClassifyResponse
• rewrite_email_with_llm   → RewriteResponse

Uses gemini-1.5-flash by default — fast, free, and great at instruction-following.
"""

import json
import logging
import os
import asyncio

import google.generativeai as genai
from dotenv import load_dotenv

from models.schemas import ClassifyResponse, RewriteResponse
from prompts.classify_prompt import get_classify_prompt
from prompts.rewrite_prompt import get_rewrite_prompt

load_dotenv()

logger = logging.getLogger(__name__)

# ── Gemini client setup ───────────────────────────────────────────────────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# gemini-2.5-flash is free and fast; swap to "gemini-2.5-pro" for more power
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def _get_model(temperature: float):
    """Return a configured GenerativeModel instance."""
    logger.debug("Using Gemini model: %s", MODEL)
    return genai.GenerativeModel(
        model_name=MODEL,
        generation_config=genai.GenerationConfig(
            temperature=temperature,
            max_output_tokens=600,
        ),
    )


# ── Classification ────────────────────────────────────────────────────────────
async def classify_email_with_llm(email_content: str) -> ClassifyResponse:
    """
    Sends the email to Gemini and parses the JSON response into a
    ClassifyResponse object.
    """
    prompt = get_classify_prompt(email_content)
    system = (
        "You are an expert email classification assistant. "
        "Always respond with valid JSON only — no markdown, no extra text, no ```json fences."
    )

    model = _get_model(temperature=0.1)  # Low for deterministic classification

    # Gemini is synchronous — run in a thread so we don't block FastAPI
    response = await asyncio.to_thread(
        model.generate_content, f"{system}\n\n{prompt}"
    )

    raw = response.text.strip()
    # Strip accidental markdown fences if Gemini adds them
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    logger.debug("Raw classify response: %s", raw)

    data = json.loads(raw)
    return ClassifyResponse(**data)


# ── Rewriting ─────────────────────────────────────────────────────────────────
async def rewrite_email_with_llm(email_content: str, tone: str) -> RewriteResponse:
    """
    Sends the email + tone to Gemini and returns the rewritten text.
    """
    prompt = get_rewrite_prompt(email_content, tone)
    system = (
        "You are an expert email writer who can adapt any email "
        "to any tone while preserving the original meaning."
    )

    model = _get_model(temperature=0.7)  # Higher for creative rewriting

    response = await asyncio.to_thread(
        model.generate_content, f"{system}\n\n{prompt}"
    )

    rewritten = response.text.strip()
    logger.debug("Raw rewrite response: %s", rewritten)

    return RewriteResponse(
        original_email=email_content,
        rewritten_email=rewritten,
        tone_applied=tone,
    )
