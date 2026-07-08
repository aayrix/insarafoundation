from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

# Gemini client initialization for chatbot responses.
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later change to https://insarafoundation.org
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request payload for the /chat endpoint.
class ChatRequest(BaseModel):
    message: str


SYSTEM_PROMPT = """
You are the official Insara Foundation Assistant.

About Insara Foundation:
- Nonprofit organization based in Mianwali, Punjab, Pakistan.
- Supports underprivileged communities with compassionate and transparent service.
- Core focus includes education support and food assistance.
- People can volunteer and donate to support the mission.

Rules:
- Be polite and professional.
- Keep answers clear, short, and practical.
- Prioritize topics about Insara Foundation, donations, volunteering, programs/events, and contact information.
- If details are missing, suggest contacting insarafoundation@gmail.com.
- Never invent donation links, phone numbers, or event details.
- When someone asks how to donate, clearly guide them to use the Donate page on the official INSARA Foundation website (the “Donate” link in the main navigation, usually at donate.html) instead of taking payments directly inside this chat.
"""


@app.get("/")
async def root():
    return {"message": "Insara Foundation Chatbot API is running."}


@app.post("/chat")
async def chat(data: ChatRequest):
    prompt = f"""
{SYSTEM_PROMPT}

User: {data.message}
Assistant:
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        reply_text = (response.text or "").strip()
        if not reply_text:
            reply_text = "I am here to help with donations, volunteering, programs, and general Insara Foundation information."
        return {"reply": reply_text}
    except Exception as exc:
        print("Chat endpoint error:", exc)
        raise HTTPException(
            status_code=503,
            detail="The assistant is temporarily unavailable. Please try again later."
        ) from exc