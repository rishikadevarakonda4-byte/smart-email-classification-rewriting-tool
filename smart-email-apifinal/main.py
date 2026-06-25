import logging
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import (
    ClassifyRequest,
    ClassifyResponse,
    RewriteRequest,
    RewriteResponse,
)
from services.llm_service import classify_email_with_llm, rewrite_email_with_llm

# ── Logging setup ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Email Classifier & Rewriter",
    description=(
        "A GenAI-powered microservice that classifies emails into categories "
        "(Work / Personal / Finance / Spam) and rewrites them in any tone."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"message": "Smart Email Classifier & Rewriter API", "status": "running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


# ── /classify_email ───────────────────────────────────────────────────────────
@app.post("/classify_email", response_model=ClassifyResponse, tags=["Email"])
async def classify_email(request: ClassifyRequest):
    """
    Classify an email into one of four categories:
    **Work**, **Personal**, **Finance**, or **Spam**.
    """
    logger.info("POST /classify_email | preview: %.60s…", request.email_content)
    try:
        result = await classify_email_with_llm(request.email_content)
        logger.info("Classification result: %s (confidence: %s)", result.category, result.confidence)
        return result
    except Exception as exc:
        logger.error("Classification failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"LLM error: {exc}")


# ── /rewrite_email ────────────────────────────────────────────────────────────
@app.post("/rewrite_email", response_model=RewriteResponse, tags=["Email"])
async def rewrite_email(request: RewriteRequest):
    """
    Rewrite an email in the specified tone
    (e.g. *professional*, *friendly*, *formal*, *casual*, *concise*).
    """
    logger.info("POST /rewrite_email | tone: %s | preview: %.60s…", request.tone, request.email_content)
    try:
        result = await rewrite_email_with_llm(request.email_content, request.tone)
        logger.info("Rewrite complete for tone: %s", request.tone)
        return result
    except Exception as exc:
        logger.error("Rewrite failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"LLM error: {exc}")


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
