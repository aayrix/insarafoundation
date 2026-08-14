/* ==========================================================================
   INSARA FOUNDATION — CHATBOT SCRIPT
   Handles widget open/close, quick actions, API calls, and UI states.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
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

  /* ---------------- built-in response bank ----------------
     Curated variations cover greetings, donations, volunteering, contact,
     programs, and general questions. This works on static hosting without an API key.
  ---------------------------------------------------- */
  const responseBank = {
    greeting: [
      "Hello! Welcome to INSARA Foundation. How can I help you today?",
      "Hi there! I can help with donations, volunteering, programs, and contact details.",
      "Welcome to INSARA Foundation. What would you like to know?",
      "Assalam-o-Alaikum! How may I assist you?",
      "Good to see you. Ask me anything about INSARA Foundation.",
      "Hello and welcome! I am ready to help.",
      "Hi! I can guide you around INSARA Foundation and its services.",
      "Welcome! Let me know how I can support you.",
      "Greetings from INSARA Foundation. What can I explain?",
      "Hello! You can ask about our mission, projects, or ways to help.",
      "Hi! I am here to answer your foundation-related questions.",
      "Welcome. Tell me what information you need."
    ],
    donate: [
      "You can donate through the Donate page in the main navigation.",
      "Please open the Donate page to see the available contribution options.",
      "To support INSARA Foundation, select Donate from the website menu.",
      "Our Donate page explains how to contribute safely and directly.",
      "You can support education and food assistance by visiting the Donate page.",
      "For donation guidance, open Donate in the navigation or email insarafoundation@gmail.com.",
      "The Donate section contains the current ways to support our mission.",
      "Thank you for wanting to help. Please use the official Donate page.",
      "Donations help us serve communities in Mianwali. Visit the Donate page to begin.",
      "For questions about giving, contact insarafoundation@gmail.com.",
      "Please use the website's Donate link rather than sending payment details in chat.",
      "The safest way to contribute is through INSARA Foundation's official Donate page."
    ],
    volunteer: [
      "You can join us by visiting the Volunteer page and submitting your interest.",
      "We welcome people who want to support education, food assistance, and community work.",
      "Open the Volunteer page to learn how to get involved.",
      "To volunteer, complete the interest form on our Volunteer page.",
      "Volunteers help INSARA Foundation reach more families in need.",
      "Please email insarafoundation@gmail.com if you need volunteer guidance.",
      "There are many ways to help, including outreach, education, and community support.",
      "Visit Volunteer in the main menu to start your application.",
      "Thank you for offering your time. The Volunteer page has the next steps.",
      "You can volunteer locally or help us share our mission with others.",
      "Our team can explain current volunteer opportunities by email.",
      "Start by opening the Volunteer page and telling us how you would like to help."
    ],
    contact: [
      "You can contact us at insarafoundation@gmail.com.",
      "INSARA Foundation is based in Mianwali, Punjab, Pakistan.",
      "For general questions, email insarafoundation@gmail.com.",
      "The Contact page includes our official contact information.",
      "Our team can be reached through the Contact page or foundation email.",
      "We are serving communities in Mianwali, Punjab, Pakistan.",
      "Please send your question to insarafoundation@gmail.com and our team will guide you.",
      "Open Contact in the navigation for available ways to reach us.",
      "For partnerships or support, please use our official foundation email.",
      "Our contact email is insarafoundation@gmail.com.",
      "You can find location and contact details on the Contact page.",
      "We appreciate your message and will direct it to the appropriate team."
    ],
    programs: [
      "INSARA focuses on education support, food assistance, and community wellbeing.",
      "Our work supports underprivileged communities in Mianwali.",
      "You can explore our current direction on the Future Projects page.",
      "Education and food assistance are among our core areas of service.",
      "We aim to create compassionate, transparent, and sustainable community support.",
      "Our programs are designed around local community needs.",
      "Visit Future Projects for information about planned initiatives.",
      "INSARA Foundation works to expand opportunity and wellbeing for families in need.",
      "Our mission is inspired by humanity and driven by compassion.",
      "We share updates about programs and projects on the website.",
      "Community development and practical support guide our future work.",
      "Ask me about volunteering or donating to support these programs."
    ],
    general: [
      "I can help with donations, volunteering, programs, location, and contact details.",
      "Please ask about our mission, projects, volunteers, or ways to donate.",
      "INSARA Foundation is a nonprofit serving Mianwali, Punjab, Pakistan.",
      "Try asking: How can I donate? Where are you located? or How can I volunteer?",
      "I can explain the website pages and ways to connect with our team.",
      "Our goal is compassionate and transparent service to the community.",
      "You can ask me about education support, food assistance, or future projects.",
      "For details not listed here, email insarafoundation@gmail.com.",
      "I am ready to guide you through INSARA Foundation information.",
      "Ask a short question and I will point you to the right page.",
      "The main menu has Donate, Volunteer, Contact, Gallery, and Future Projects pages.",
      "How may I help you learn more about INSARA Foundation?"
    ]
  };

  const chooseReply = (message) => {
    const text = message.toLowerCase();
    let category = "general";
    if (/hello|hi|hey|salam|good morning|good afternoon|good evening|start/.test(text)) category = "greeting";
    else if (/donat|contribut|money|bank|give/.test(text)) category = "donate";
    else if (/volunteer|join|help out|participat/.test(text)) category = "volunteer";
    else if (/contact|email|phone|where|location|address|reach/.test(text)) category = "contact";
    else if (/program|project|event|education|food|mission|service/.test(text)) category = "programs";
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
    return responseBank[category][hash % responseBank[category].length];
  };

  /* ---------------- submission flow ---------------- */
  const submitMessage = async (message) => {
    if (!message || isWaitingForResponse) {
      return;
    }

    addMessage("user", message);
    setWaitingState(true);

    try {
      addMessage("bot", chooseReply(message));
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
