import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { PORT } from "./config.mjs";
import { generateToken, validateOrigin, validateToken } from "./security.mjs";
import { SessionManager } from "./session.mjs";

const token = generateToken();
console.log(`\n╔══════════════════════════════════════════╗`);
console.log(`║  Start Page Terminal Daemon             ║`);
console.log(`║  Port: ${String(PORT).padEnd(36)}║`);
console.log(`║  Token: ${token.slice(0, 8)}...${token.slice(-4).padEnd(28)}║`);
console.log(`╚══════════════════════════════════════════╝\n`);
console.log(`Paste this token in Settings → Terminal:`);
console.log(`  ${token}\n`);

const sessions = new SessionManager();
const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const origin = req.headers.origin;
  if (!validateOrigin(origin)) {
    ws.close(4001, "Origin not allowed");
    return;
  }

  let sessionId = null;
  let authenticated = false;

  const helloTimeout = setTimeout(() => {
    if (!authenticated) {
      ws.close(4002, "Authentication timeout");
    }
  }, 10000);

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (!authenticated) {
      if (msg.type !== "hello" || !validateToken(msg.token, token)) {
        ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
        ws.close(4003, "Authentication failed");
        return;
      }
      authenticated = true;
      clearTimeout(helloTimeout);

      try {
        const onOutput = (data) => {
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "output", data }));
          }
        };
        const onExit = (code) => {
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: "exit", code }));
          }
        };

        if (msg.sessionId && sessions.has(msg.sessionId)) {
          sessions.restore(msg.sessionId, { onOutput, onExit });
          sessionId = msg.sessionId;
        } else {
          const result = sessions.create({
            cols: msg.cols ?? 80,
            rows: msg.rows ?? 24,
          });
          sessionId = result.sessionId;
          sessions.onOutput(sessionId, onOutput);
          sessions.onExit(sessionId, onExit);
        }

        ws.send(JSON.stringify({ type: "ready", sessionId }));
      } catch (e) {
        ws.send(JSON.stringify({ type: "error", message: e.message }));
        ws.close(4004, e.message);
      }
      return;
    }

    switch (msg.type) {
      case "input":
        if (sessionId) sessions.write(sessionId, msg.data);
        break;
      case "resize":
        if (sessionId) sessions.resize(sessionId, msg.cols, msg.rows);
        break;
      case "ping":
        ws.send(JSON.stringify({ type: "pong" }));
        break;
    }
  });

  ws.on("close", () => {
    clearTimeout(helloTimeout);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Daemon listening on ws://127.0.0.1:${PORT}`);
});