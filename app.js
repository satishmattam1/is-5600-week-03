// app.js

const express = require('express');
const path = require('path');
const EventEmitter = require('events');

// create an instance of express
const app = express();

// create an event emitter for chat messages
const chatEmitter = new EventEmitter();

// define port
const port = process.env.PORT || 3000;

// tell express to serve static files from "public" folder
app.use(express.static(__dirname + '/public'));

/* -----------------------------------
   1. BASIC ROUTES
------------------------------------*/

// Respond with plain text
function respondText(req, res) {
  res.send('hi');
}

// Respond with JSON
function respondJson(req, res) {
  res.json({
    text: 'hi',
    numbers: [1, 2, 3],
  });
}

// Respond with input transformations
function respondEcho(req, res) {
  const { input = '' } = req.query;
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    charCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
}

/* -----------------------------------
   2. CHAT APP ENDPOINTS
------------------------------------*/

// Serve chat.html at root
function chatApp(req, res) {
  res.sendFile(path.join(__dirname, '/chat.html'));
}

// Receive chat message
function respondChat(req, res) {
  const { message } = req.query;
  if (message) {
    console.log(`💬 New message: ${message}`);
    chatEmitter.emit('message', message);
  }
  res.end();
}

// Server-Sent Events (SSE) for broadcasting messages
function respondSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  });

  // send new message events to connected clients
  const onMessage = (message) => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  // remove listener when client disconnects
  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}

/* -----------------------------------
   3. REGISTER ROUTES
------------------------------------*/

app.get('/', chatApp);           // serve chat app
app.get('/json', respondJson);   // JSON route
app.get('/echo', respondEcho);   // echo route
app.get('/chat', respondChat);   // chat messages
app.get('/sse', respondSSE);     // SSE stream

/* -----------------------------------
   4. START SERVER
------------------------------------*/

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
