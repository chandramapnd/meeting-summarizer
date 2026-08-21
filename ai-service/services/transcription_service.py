from google import genai
from dotenv import load_dotenv
import os
import tempfile

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found")

client = genai.Client(api_key=api_key)


def transcribe_audio(file_bytes: bytes, filename: str) -> str:

    # Create a temporary file
    suffix = os.path.splitext(filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        temp_file.write(file_bytes)
        temp_path = temp_file.name

    try:
        # Upload audio to Gemini
        uploaded_file = client.files.upload(
            file=temp_path
        )

        # Ask Gemini for transcription
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                """
                Generate an accurate transcript of the meeting audio.

                Requirements:
                - Transcribe the spoken content accurately.
                - Preserve the original meaning and order of the conversation.
                - Do not summarize or interpret the discussion.
                - Do not add information that was not spoken.
                - Identify different speakers when they can be reliably distinguished.
                - Do not guess speaker names or identities.
                - If speakers cannot be reliably distinguished, keep the transcript continuous.
                - Return only the transcript.
                """,
                uploaded_file
            ]
        )

        return response.text

    finally:
        # Delete temporary local file
        if os.path.exists(temp_path):
            os.remove(temp_path)