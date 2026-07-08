from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("Key loaded:", api_key[:10] + "..." if api_key else "No key found")

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello in one sentence."
    )

    print("\n✅ SUCCESS")
    print(response.text)

except Exception as e:
    print("\n❌ ERROR")
    print(type(e).__name__)
    print(e)