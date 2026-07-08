/* ==========================================================================
   INSARA FOUNDATION — CHATBOT SCRIPT
   Handles widget open/close, quick actions, API calls, and UI states.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- API configuration ----------------
     Change CHAT_ENDPOINT later to:
     https://your-backend-url.onrender.com/chat
  ---------------------------------------------------- */
  const API_CONFIG = {
    CHAT_ENDPOINT: "http://127.0.0.1:8000/chat",
  };

  /* ---------------- UI element bindings ---------------- */
  const chatWidget = document.getElementById("chat-widget");
  const chatMessages = document.getElementById("chat-messages");
  const chatTyping = document.getElementById("chat-typing");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const chatClear = document.getElementById("chat-clear");
  const quickActions = document.getElementById("chat-quick-actions");

  if (!chatWidget || !chatMessages || !chatForm || !chatInput || !chatSend) {
    return;
  }

  const FALLBACK_ERROR_TEXT = "The assistant is temporarily unavailable. Please try again later.";
  const WELCOME_TEXT = "👋 Welcome to Insara Foundation. I can help you with donations, volunteering, programs, and general information.";
  let isWaitingForResponse = false;

  /* ---------------- message rendering helpers ---------------- */
  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const createMessageBubble = (role, text) => {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-message", role);
    bubble.textContent = text;
    return bubble;
  };

  const addMessage = (role, text) => {
    chatMessages.appendChild(createMessageBubble(role, text));
    scrollToBottom();
  };

  const resetChat = () => {
    chatMessages.innerHTML = "";
    addMessage("bot", WELCOME_TEXT);
    chatInput.focus();
  };

  const setWaitingState = (isWaiting) => {
    isWaitingForResponse = isWaiting;
    chatSend.disabled = isWaiting;
    chatInput.disabled = isWaiting;
    chatTyping.classList.toggle("hidden", !isWaiting);
    chatTyping.setAttribute("aria-hidden", String(!isWaiting));
    scrollToBottom();
  };

  /* ---------------- backend call ---------------- */
  const fetchAssistantReply = async (message) => {
    const response = await fetch(API_CONFIG.CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error("Invalid API response format");
    }

    return data.reply.trim();
  };

  /* ---------------- submission flow ---------------- */
  const submitMessage = async (message) => {
    if (!message || isWaitingForResponse) {
      return;
    }

    addMessage("user", message);
    setWaitingState(true);

    try {
      const reply = await fetchAssistantReply(message);
      addMessage("bot", reply);
    } catch (error) {
      console.error("Chatbot request failed:", error);
      const errorBubble = createMessageBubble("error", FALLBACK_ERROR_TEXT);
      chatMessages.appendChild(errorBubble);
      scrollToBottom();
    } finally {
      setWaitingState(false);
      chatInput.focus();
    }
  };

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    chatInput.value = "";
    await submitMessage(message);
  });

  /* ---------------- quick action buttons ---------------- */
  if (quickActions) {
    quickActions.addEventListener("click", async (event) => {
      const button = event.target.closest(".chat-quick-action");
      if (!button || isWaitingForResponse) {
        return;
      }
      const suggestedMessage = button.dataset.message?.trim();
      if (!suggestedMessage) {
        return;
      }
      await submitMessage(suggestedMessage);
    });
  }

  /* ---------------- clear conversation ---------------- */
  if (chatClear) {
    chatClear.addEventListener("click", resetChat);
  }

  /* ---------------- initial assistant welcome ---------------- */
  resetChat();
});
