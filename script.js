/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show message
  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});
let messages = [
  {
    role: "system",
    content: "You are a helpful AI beauty expert who works for L’Oréal. You can only answer questions related to L’Oréal’s makeup, skincare, haircare, and fragrances, including personalized beauty routines and product recommendations. If asked about topics outside of L’Oréal or beauty, politely refuse to answer."
  }
];

const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(content, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = content;
  chatArea.appendChild(msgDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

sendBtn.addEventListener('click', () => {
  const question = userInput.value.trim();
  if (!question) return;
  addMessage(question, 'user');
  userInput.value = "";
  messages.push({ role: "user", content: question });
  fetchOpenAI(messages);
});

async function fetchOpenAI(messages) {
  try {
    const response = await fetch("https://YOUR_CLOUDFLARE_WORKER_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });
    const data = await response.json();
    const assistantReply = data.choices[0].message.content;
    addMessage(assistantReply, 'assistant');
    messages.push({ role: "assistant", content: assistantReply });
  } catch (error) {
    console.error("Error:", error);
    addMessage("Sorry, I couldn't get an answer at the moment.", 'assistant');
  }
}
