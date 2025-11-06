// public/chat.js

// Create an EventSource connection for Server-Sent Events (SSE)
const eventSource = new EventSource("/sse");

// When the server sends a new message, display it
eventSource.onmessage = function (event) {
  const messageBox = document.getElementById("messages");
  messageBox.innerHTML += `<p>${event.data}</p>`;
  messageBox.scrollTop = messageBox.scrollHeight;
};

// Handle form submission
const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  // Send message to server via /chat endpoint
  fetch(`/chat?message=${encodeURIComponent(message)}`);
  input.value = "";
});
