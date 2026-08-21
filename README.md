##  MEETING SUMMARIZER VIDEO LINK : https://drive.google.com/drive/folders/1m3ObgTxKGJQTv1FyJrEBsX5ArpsFAqsz



# Meeting Summarizer

An AI-powered Meeting Summarizer that converts meeting audio into a text transcript and generates an action-oriented summary using a Large Language Model (LLM).

The system accepts a meeting audio file, transcribes the speech using Google Gemini, analyzes the transcript, generates a summary, identifies key decisions, extracts action items, and stores the processed meeting data in PostgreSQL.

## 1. Objective

The objective of this project is to automate the process of understanding meeting recordings.

Instead of manually listening to an entire meeting, the system:

1. Accepts a meeting audio file.
2. Converts the audio into a transcript.
3. Analyzes the transcript using an LLM.
4. Generates a concise meeting summary.
5. Identifies important key decisions.
6. Extracts actionable tasks.
7. Stores the meeting information for later viewing.

## 2. Assessment Alignment

This project implements the core requirements of the Meeting Summarizer assessment:

- Input: Meeting audio files
- Output: Text transcript, summary, and action items
- ASR API integration: Google Gemini
- Backend: Spring Boot
- Data storage: PostgreSQL
- LLM: Google Gemini
- LLM processing: Summary, key decisions, and action items
- Frontend: React interface for uploading and viewing processed meetings

The assessment focuses on transcription accuracy, summary quality, LLM prompt effectiveness, and code structure.

## 3. Features

- Upload meeting audio files
- Automatic speech-to-text transcription
- AI-generated meeting summary
- Key decision extraction
- Action item extraction
- Meeting data storage in PostgreSQL
- View previously processed meetings
- Delete meetings
- REST APIs for meeting and AI processing
- Web-based React frontend

## 4. System Architecture

```text
                    +-------------------------+
                    |     React Frontend      |
                    |     localhost:5173      |
                    +------------+------------+
                                 |
                                 | REST API
                                 v
                    +-------------------------+
                    |     Spring Boot         |
                    |        Backend           |
                    |     localhost:8080      |
                    +------------+------------+
                                 |
                    +------------+------------+
                    |                         |
                    v                         v
          +------------------+       +------------------+
          |    FastAPI       |       |    PostgreSQL    |
          |    AI Service    |       |    Database      |
          |    localhost:8000|       |                  |
          +--------+---------+       +------------------+
                   |
                   v
          +------------------+
          |    Gemini API    |
          |                  |
          | Transcription +  |
          | Summarization    |
          +------------------+
```

## 5. Processing Workflow

```text
Meeting Audio
      |
      v
React Frontend
      |
      v
Spring Boot Backend
      |
      v
FastAPI AI Service
      |
      v
Gemini
      |
      +----> Audio Transcription
      |
      v
Transcript
      |
      v
Gemini LLM
      |
      +----> Summary
      |
      +----> Key Decisions
      |
      +----> Action Items
      |
      v
Spring Boot Backend
      |
      v
PostgreSQL
      |
      v
React Frontend
```

## 6. Project Structure

```text
meeting-summarizer/
|
+-- README.md
|
+-- ai-service/
|   |
|   +-- services/
|   |   +-- summarization_service.py
|   |   +-- transcription_service.py
|   |
|   +-- main.py
|   +-- test_summarization.py
|   +-- test-gemini.py
|   +-- .env
|
+-- backend/
|   |
|   +-- src/
|       +-- main/
|           +-- java/
|           |   +-- com/
|           |       +-- meetingsummarizer/
|           |           +-- backend/
|           |               +-- ai/
|           |               |   +-- dto/
|           |               |       +-- ActionItem.java
|           |               |       +-- SummarizeRequest.java
|           |               |       +-- SummarizeResponse.java
|           |               |   +-- AiService.java
|           |               +-- controller/
|           |               |   +-- AiServiceController.java
|           |               |   +-- MeetingController.java
|           |               +-- entity/
|           |               |   +-- Meeting.java
|           |               +-- repository/
|           |               |   +-- MeetingRepository.java
|           |               +-- service/
|           |                   +-- MeetingService.java
|           |               +-- BackendApplication.java
|           +-- resources/
|               +-- application.properties
|   |
|   +-- pom.xml
|
+-- meeting-summarizer-frontend/
    |
    +-- src/
    |   +-- App.jsx
    |   +-- main.jsx
    |   +-- MeetingDetails.jsx
    |   +-- styles.css
    |
    +-- index.html
    +-- package.json
    +-- package-lock.json
```

> `node_modules`, Python virtual-environment files, generated cache files, IDE metadata, and build output are not part of the application source code.

## 7. Technology Stack

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate

### AI Service
- Python
- FastAPI
- Google Gemini API

### Database
- PostgreSQL

## 8. AI Processing

The AI service performs two major operations.

### 8.1 Audio Transcription

The uploaded audio file is processed by the FastAPI AI service and sent to Gemini for transcription.

The transcription prompt instructs the model to:

- Preserve the spoken meaning.
- Do not summarize.
- Do not add information that was not spoken.
- Separate different speakers when possible.
- Return only the transcript.

This keeps transcription separate from summarization.

### 8.2 Meeting Summarization

The generated transcript is sent to the summarization service.

The LLM generates structured meeting information containing:

```text
Summary
Key Decisions
Action Items
```

An action item can contain:

```text
Task
Owner
Deadline
```

## 9. Backend Responsibilities

The Spring Boot backend acts as the main application backend.

Its responsibilities include:

- Receiving meeting uploads.
- Communicating with the AI service.
- Receiving transcription and summarization results.
- Creating meeting records.
- Saving meeting information to PostgreSQL.
- Providing APIs to retrieve meetings.
- Providing APIs to delete meetings.

## 10. Database

Meeting information is stored in PostgreSQL.

The `Meeting` entity contains:

```text
id
title
audioFileName
transcript
summary
keyDecisions
actionItems
createdAt
```

The `keyDecisions` and `actionItems` fields are stored as JSON data in PostgreSQL.

## 11. API Endpoints

### Spring Boot Backend

Base URL:

```text
http://localhost:8080
```

### Get all meetings

```http
GET /api/meetings
```

### Get meeting by ID

```http
GET /api/meetings/{id}
```

### Delete meeting

```http
DELETE /api/meetings/{id}
```

### Process meeting

```http
POST /api/meetings/process
```

Request type:

```text
multipart/form-data
```

Parameters:

```text
title
file
```

Processing flow:

```text
Audio Upload
     |
     v
Transcription
     |
     v
Summarization
     |
     v
Database Storage
     |
     v
Response
```

## 12. FastAPI AI Service

The AI service runs separately from the Spring Boot backend.

Base URL:

```text
http://localhost:8000
```

### Root

```http
GET /
```

Checks that the AI service is running.

### Health Check

```http
GET /health
```

Returns the health status of the AI service.

### Transcription

```http
POST /transcribe
```

Accepts an audio file and returns the generated transcript.

### Summarization

```http
POST /summarize
```

Accepts a transcript and returns structured meeting insights.

## 13. Environment Variables

The AI service requires a Gemini API key.

Create a `.env` file inside:

```text
ai-service/
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the real API key to GitHub.

Make sure `.env` is included in `.gitignore`.

## 14. Prerequisites

Before running the project, install/configure:

- Java JDK
- Maven or the included Maven wrapper
- Python
- PostgreSQL
- Node.js and npm
- A Google Gemini API key

Make sure PostgreSQL is running and the database configuration in:

```text
backend/src/main/resources/application.properties
```

matches your local PostgreSQL setup.

## 15. Running the Project

The application contains three independently running parts:

```text
1. FastAPI AI Service
2. Spring Boot Backend
3. React Frontend
```

Run each part in a separate terminal.

### Step 1: Start the AI Service

From the project root:

```powershell
cd ai-service
```

Activate the Python virtual environment:

```powershell
.\.venv\Scripts\activate
```

Start FastAPI:

```powershell
uvicorn main:app --reload --port 8000
```

The AI service will be available at:

```text
http://localhost:8000
```

### Step 2: Start the Spring Boot Backend

Open a new terminal.

From the project root:

```powershell
cd backend
```

The backend can be started from IntelliJ IDEA by running:

```text
BackendApplication.java
```

Alternatively:

```powershell
.\mvnw spring-boot:run
```

The backend will be available at:

```text
http://localhost:8080
```

### Step 3: Start the React Frontend

Open another terminal.

From the project root:

```powershell
cd meeting-summarizer-frontend
```

Install dependencies if required:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 16. Using the Application

Once all three services are running:

1. Open the React frontend.
2. Open the upload meeting option.
3. Enter a meeting title.
4. Select a supported meeting audio file.
5. Upload the file.
6. The backend sends the audio to the AI service.
7. Gemini generates the transcript.
8. The transcript is summarized by the LLM.
9. Summary, key decisions, and action items are returned.
10. The meeting is stored in PostgreSQL.
11. The processed meeting can be viewed from the frontend.

## 17. Example

Example meeting:

```text
Title:
Planning Meeting

Audio:
planning-meeting-test.mp3
```

The system produces:

### Transcript

The spoken content of the meeting.

### Summary

A concise description of the main discussion.

### Key Decisions

Important decisions made during the meeting.

### Action Items

Tasks identified from the meeting, including owner and deadline when available.

## 18. Example Output

```json
{
  "id": 4,
  "title": "Planning Meeting",
  "audioFileName": "planning-meeting-test.mp3",
  "summary": "The council discussed the proposed subdivision and related planning matters.",
  "keyDecisions": [
    "Unanimously approved the meeting agenda.",
    "Unanimously adopted the meeting minutes."
  ],
  "actionItems": [],
  "transcript": "..."
}
```

The exact output depends on the contents of the uploaded meeting.

## 19. Testing

The AI service contains test files for AI functionality:

```text
ai-service/
|
+-- test_summarization.py
+-- test-gemini.py
```

The REST APIs can also be tested using Postman.

For example:

```text
POST http://localhost:8080/api/meetings/process
```

with `multipart/form-data`:

```text
title = Planning Meeting
file  = meeting-audio.mp3
```

## 20. Code Structure

The application separates responsibilities into different layers.

### AI Service
Responsible for:
- Audio transcription
- Meeting summarization

### Spring Boot Controller
Responsible for:
- Receiving HTTP requests
- Returning HTTP responses

### Spring Boot Service
Responsible for:
- Meeting processing workflow
- Communication with the AI service
- Saving meeting information

### Repository
Responsible for:
- Database operations

### Entity
Responsible for:
- Representing meeting data

### DTOs
Responsible for:
- Structured communication between services

### React Frontend
Responsible for:
- User interface
- Meeting upload
- Displaying processed meeting information

## 21. Assessment Evaluation Focus

The project is designed around the evaluation areas specified for the Meeting Summarizer.

### Transcription Accuracy

The system uses an AI-based speech transcription process to convert meeting audio into text while preserving the spoken meaning.

### Summary Quality

The LLM converts the transcript into a concise representation of the meeting.

### LLM Prompt Effectiveness

Prompts are used to guide the LLM toward producing:

- A meeting summary
- Key decisions
- Action items

### Code Structure

The application separates responsibilities across:

```text
React Frontend
       |
Spring Boot Backend
       |
FastAPI AI Service
       |
Gemini API
       |
PostgreSQL
```

## 22. Security

API keys and environment-specific configuration should not be committed to the repository.

The Gemini API key should be stored in:

```text
ai-service/.env
```

The `.env` file should be listed in `.gitignore`.

Before pushing the project to GitHub, verify that no API keys or passwords are present in committed files.

## 23. Demo Flow

The recommended demonstration flow is:

```text
Start AI Service
       |
       v
Start Spring Boot Backend
       |
       v
Start React Frontend
       |
       v
Open Meeting Summarizer
       |
       v
Upload Meeting Audio
       |
       v
AI Transcription
       |
       v
AI Summarization
       |
       +----> Summary
       |
       +----> Key Decisions
       |
       +----> Action Items
       |
       v
Save Meeting
       |
       v
View Processed Meeting
```

## 24. Repository

The project can be maintained as a single repository containing:

```text
meeting-summarizer/
├── ai-service/
├── backend/
├── meeting-summarizer-frontend/
└── README.md
```

This keeps all components required to demonstrate the project together.

## 25. Conclusion

Meeting Summarizer demonstrates an end-to-end AI workflow for processing meeting recordings.

The system combines:

```text
Audio
  ↓
AI Transcription
  ↓
Transcript
  ↓
LLM Analysis
  ↓
Summary + Key Decisions + Action Items
  ↓
PostgreSQL Storage
  ↓
Web Interface
```

The project focuses on the core Meeting Summarizer requirements: accurate transcription, useful meeting summaries, extraction of decisions and action items, effective LLM prompting, and clear separation of application components.
