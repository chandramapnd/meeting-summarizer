from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

from services.transcription_service import transcribe_audio
from services.summarization_service import summarize_meeting


app = FastAPI(
    title="Meeting AI Service",
    description="AI service for meeting transcription and summarization",
    version="1.0.0"
)


class SummarizeRequest(BaseModel):
    transcript: str


@app.get("/")
def root():
    return {
        "message": "Meeting AI Service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    allowed_types = {
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/aac",
        "audio/ogg",
        "audio/flac"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {file.content_type}"
        )

    try:
        file_bytes = await file.read()

        transcript = transcribe_audio(
            file_bytes,
            file.filename
        )

        return {
            "filename": file.filename,
            "transcript": transcript
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/summarize")
async def summarize(request: SummarizeRequest):

    try:
        result = summarize_meeting(request.transcript)

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )