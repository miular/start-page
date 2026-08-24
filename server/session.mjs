import { randomUUID } from "node:crypto";
import pty from "node-pty";
import { SHELL, IDLE_TIMEOUT_MS, MAX_SESSIONS } from "./config.mjs";

export class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.outputCallbacks = new Map();
    this.exitCallbacks = new Map();
    this.idleTimers = new Map();
  }

  create({ cols, rows, cwd }) {
    if (this.sessions.size >= MAX_SESSIONS) {
      throw new Error("Max sessions reached");
    }
    const sessionId = randomUUID();
    const shell = pty.spawn(SHELL, [], {
      name: "xterm-256color",
      cols: cols ?? 80,
      rows: rows ?? 24,
      cwd: cwd ?? process.env.USERPROFILE,
    });

    shell.onData((data) => {
      const cb = this.outputCallbacks.get(sessionId);
      if (cb) cb(data);
      this._resetIdleTimer(sessionId);
    });

    shell.onExit(({ exitCode }) => {
      const cb = this.exitCallbacks.get(sessionId);
      if (cb) cb(exitCode);
      this._cleanup(sessionId);
    });

    this.sessions.set(sessionId, shell);
    this._resetIdleTimer(sessionId);
    return { sessionId };
  }

  write(sessionId, data) {
    const shell = this.sessions.get(sessionId);
    if (!shell) throw new Error("Session not found");
    shell.write(data);
  }

  resize(sessionId, cols, rows) {
    const shell = this.sessions.get(sessionId);
    if (!shell) throw new Error("Session not found");
    shell.resize(cols, rows);
  }

  onOutput(sessionId, cb) {
    this.outputCallbacks.set(sessionId, cb);
  }

  onExit(sessionId, cb) {
    this.exitCallbacks.set(sessionId, cb);
  }

  has(sessionId) {
    return this.sessions.has(sessionId);
  }

  restore(sessionId, { onOutput, onExit }) {
    if (!this.sessions.has(sessionId)) {
      throw new Error("Session not found");
    }
    this.outputCallbacks.set(sessionId, onOutput);
    this.exitCallbacks.set(sessionId, onExit);
    this._resetIdleTimer(sessionId);
  }

  destroy(sessionId) {
    this._cleanup(sessionId);
  }

  _resetIdleTimer(sessionId) {
    const existing = this.idleTimers.get(sessionId);
    if (existing) clearTimeout(existing);
    this.idleTimers.set(
      sessionId,
      setTimeout(() => {
        this.destroy(sessionId);
      }, IDLE_TIMEOUT_MS),
    );
  }

  _cleanup(sessionId) {
    const shell = this.sessions.get(sessionId);
    if (shell) shell.kill();
    this.sessions.delete(sessionId);
    this.outputCallbacks.delete(sessionId);
    this.exitCallbacks.delete(sessionId);
    const timer = this.idleTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.idleTimers.delete(sessionId);
    }
  }
}