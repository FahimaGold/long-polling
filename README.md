# Long-Polling Example

This repository contains examples of **long-polling** implemented in **Node.js**, **Django**, and a simple **React** client.

---

## 📚 What is Long-Polling?

**Long-polling** is a technique where the client opens a connection to the server and waits until:
- The server has a new message to send, or
- A timeout occurs.

Here's how the long-polling flow works:
1. **Client A** opens a connection asking if there are new messages.
2. The server keeps the connection open:
   - If a new message for **Client A** arrives before the timeout, the server immediately sends it.
   - If no message arrives and the timeout is reached, the server closes the connection.
3. After receiving a message or on timeout, **Client A** immediately opens a new connection, repeating the process.

---

## 🚀 How to Run the Examples

### Node.js Server
1. Navigate to the `nodejs` directory:
   ```bash
   cd nodejs
   node server.js
2. Navigate to the `react-client` directory and run:
   ```bash
   npm run dev

3. Use `Curl` to post a message to the server, example:
    ```bash
    curl -X POST http://localhost:3000/poll/send \
    -H "Content-Type: application/json" \
    -d '{"to": "client_kw_01", "message": "your message"}'

---
## 📒 Notes
- If the client is connected and waiting, the message will be delivered immediately.

- If no client is connected with the given ID, the server will log that the client is not connected.

- The connection automatically times out after 30 seconds if no message is received.
---
## Technologies Used
- Node.js (Express)

- Django

- React (Vite for frontend setup)

- cURL (for manual testing)
