from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="INSARA Foundation Chatbot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://insarafoundation.org",
        "https://www.insarafoundation.org",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request payload for the /chat endpoint.
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


@app.get("/")
async def root():
    return {"service": "INSARA Foundation Chatbot API", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "ok", "model": "gemini-2.5-flash"}


@app.post("/chat")
async def chat(data: ChatRequest):
    text = data.message.lower()
    if any(word in text for word in ("hello", "hi", "hey", "salam", "start")):
        reply = "Hello! Welcome to INSARA Foundation. How can I help you today?"
    elif any(word in text for word in ("donat", "contribut", "money", "bank")):
        reply = "You can donate through the Donate page in the main navigation, or email insarafoundation@gmail.com for help."
    elif any(word in text for word in ("volunteer", "join", "participat")):
        reply = "Please visit the Volunteer page to get involved with education, food assistance, and community support."
    elif any(word in text for word in ("contact", "email", "where", "location", "address")):
        reply = "INSARA Foundation is based in Mianwali, Punjab, Pakistan. Contact us at insarafoundation@gmail.com."
    elif any(word in text for word in ("program", "project", "event", "education", "food", "mission")):
        reply = "INSARA focuses on education support, food assistance, and sustainable community wellbeing in Mianwali."
    else:
        reply = "I can help with donations, volunteering, programs, location, and contact details. What would you like to know?"
    return {"reply": reply}
