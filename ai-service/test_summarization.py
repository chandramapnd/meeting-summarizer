from services.summarization_service import summarize_meeting

transcript = """
Today we discussed the project deadline and backend implementation.

The team decided that the backend API should be completed by Friday.

Rahul will implement the meeting upload API.
Priya will prepare the frontend design.
Both tasks should be completed by Friday.
"""

result = summarize_meeting(transcript)

print("\nRESULT:")
print(result)