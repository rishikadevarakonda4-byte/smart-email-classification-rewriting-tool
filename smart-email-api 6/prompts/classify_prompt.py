"""
classify_prompt.py
──────────────────
Prompt template for the /classify_email endpoint.

Design decisions:
  1. Explicit category definitions prevent ambiguous edge cases
     (e.g. a salary email is Finance, not Work).
  2. Low temperature (0.1) is enforced in the LLM call for reproducibility.
  3. JSON-only output is requested so the response can be parsed directly
     into the ClassifyResponse schema without extra parsing.
  4. A short chain-of-thought is embedded ("reasoning") so evaluators can
     see the model's logic rather than a bare label.
"""


def get_classify_prompt(email_content: str) -> str:
    """Return the full classification prompt for the given email text."""

    return f"""You are an expert email classification assistant.

## Categories (pick exactly one)

| Category  | Definition |
|-----------|------------|
| Work      | Professional emails about job duties, meetings, projects, clients, or colleagues. |
| Personal  | Emails from friends or family about social or personal matters. |
| Finance   | Emails about banking, payments, invoices, receipts, loans, credit cards, or financial services. |
| Spam      | Unsolicited advertisements, phishing attempts, promotional blasts, or clearly irrelevant bulk mail. |

## Email to classify
\"\"\"
{email_content}
\"\"\"

## Instructions
1. Read the email carefully, paying attention to the sender context, subject, and body.
2. Assign exactly ONE category from the table above.
3. Rate your confidence as High, Medium, or Low.
4. Write 1-2 sentences explaining your reasoning.

## Output format
Respond ONLY with a valid JSON object — no markdown, no extra text:

{{
  "category": "<Work | Personal | Finance | Spam>",
  "confidence": "<High | Medium | Low>",
  "reasoning": "<your explanation>"
}}"""
