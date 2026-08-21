from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found")

client = genai.Client(api_key=api_key)


def summarize_meeting(transcript: str) -> dict:

    prompt = f"""
You are an expert meeting assistant.

Analyze the following meeting transcript.

Return ONLY valid JSON with exactly these fields:

{{
    "summary": "A concise summary of the meeting",
    "key_decisions": [
        "Decision 1"
    ],
    "action_items": [
        {{
            "task": "Task description",
            "owner": "Person responsible or Unknown",
            "deadline": "Deadline or Unknown"
        }}
    ]
}}

Rules:
- Do not invent information.
- If no decisions were made, return an empty array.
- If no action items were assigned, return an empty array.
- Keep the summary concise.
- Preserve the meaning of the transcript.

Transcript:
{transcript}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Remove markdown code fences if Gemini adds them
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)