from typing import Literal
from pydantic import BaseModel, Field


# ── /classify_email ───────────────────────────────────────────────────────────
class ClassifyRequest(BaseModel):
    email_content: str = Field(
        ...,
        min_length=1,
        description="Raw text of the email to classify.",
        examples=["Hi John, can you review the Q3 report before tomorrow's meeting? Thanks, Sarah"],
    )


class ClassifyResponse(BaseModel):
    category: Literal["Work", "Personal", "Finance", "Spam"]
    confidence: Literal["High", "Medium", "Low"]
    reasoning: str = Field(..., description="One or two sentences explaining the classification.")


# ── /rewrite_email ────────────────────────────────────────────────────────────
class RewriteRequest(BaseModel):
    email_content: str = Field(
        ...,
        min_length=1,
        description="Raw text of the email to rewrite.",
        examples=["hey can u send me the report asap thx"],
    )
    tone: str = Field(
        ...,
        description="Desired tone (e.g. professional, friendly, formal, casual, concise, empathetic).",
        examples=["professional"],
    )


class RewriteResponse(BaseModel):
    original_email: str
    rewritten_email: str
    tone_applied: str
