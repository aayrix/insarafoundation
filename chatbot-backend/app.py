from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

# Gemini is optional: the API can still start and return a useful FAQ response
# while the deployment is being configured.
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

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


def local_reply(message: str) -> str:
    """Small dependency-free fallback for deployments without Gemini."""
    text = message.lower()
    if any(word in text for word in ("donat", "contribut", "bank")):
        return "You can make a contribution from the Donate page using the Donate link in the main navigation. For help, email insarafoundation@gmail.com."
    if any(word in text for word in ("volunteer", "join", "help out")):
        return "We welcome volunteers supporting education, food assistance, and community wellbeing. Please visit the Volunteer page or email insarafoundation@gmail.com."
    if any(word in text for word in ("program", "project", "event", "education", "food")):
        return "INSARA Foundation serves underprivileged communities in Mianwali, Punjab, focusing on education support, food assistance, and sustainable community development."
    if any(word in text for word in ("contact", "email", "location", "where")):
        return "You can reach INSARA Foundation at insarafoundation@gmail.com. We are based in Mianwali, Punjab, Pakistan."
    return "I can help with donations, volunteering, programs, events, and general INSARA Foundation information. What would you like to know?"


@app.get("/")
async def root():
    return {"message": "Insara Foundation Chatbot API is running."}


@app.post("/chat")
async def chat(data: ChatRequest):
    if client is None:
        return {"reply": local_reply(data.message)}

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
