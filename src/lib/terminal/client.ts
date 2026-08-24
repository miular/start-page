export type TerminalMessage =
  | { type: "hello"; token: string; cols: number; rows: number; sessionId?: string }
  | { type: "input"; data: string }
  | { type: "resize"; cols: number; rows: number }
  | { type: "ping" };

export type TerminalEvent =
  | { type: "ready"; sessionId: string }
  | { type: "output"; data: string }
  | { type: "exit"; code: number }
  | { type: "error"; message: string }
  | { type: "pong" }
  | { type: "status"; state: "connecting" | "connected" | "disconnected" | "error" };

type EventCallback = (event: TerminalEvent) => void;

export class TerminalClient {
  private ws: WebSocket | null = null;
  private onEvent: EventCallback | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private host = "127.0.0.1";
  private port = 5517;
  private token = "";
  private sessionId: string | null = null;
  private cols = 80;
  private rows = 24;

  connect(host: string, port: number, token: string, cols: number, rows: number, sessionId?: string) {
    this.host = host;
    this.port = port;
    this.token = token;
    this.cols = cols;
    this.rows = rows;
    this.sessionId = sessionId ?? null;
    this._connect();
  }

  on(callback: EventCallback) {
    this.onEvent = callback;
  }

  sendInput(data: string) {
    this._send({ type: "input", data });
  }

  sendResize(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;
    this._send({ type: "resize", cols, rows });
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  disconnect() {
    this._stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private _connect() {
    this._emit({ type: "status", state: "connecting" });
    this.ws = new WebSocket(`ws://${this.host}:${this.port}`);

    this.ws.onopen = () => {
      this._send({
        type: "hello",
        token: this.token,
        cols: this.cols,
        rows: this.rows,
        sessionId: this.sessionId ?? undefined,
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as TerminalEvent;
        this._handleMessage(msg);
      } catch {
        /* ignore malformed messages */
      }
    };

    this.ws.onclose = () => {
      this._emit({ type: "status", state: "disconnected" });
      this._stopPing();
    };

    this.ws.onerror = () => {
      this._emit({ type: "status", state: "error" });
    };
  }

  private _handleMessage(msg: TerminalEvent) {
    if (msg.type === "ready") {
      this.sessionId = msg.sessionId;
      this._emit({ type: "status", state: "connected" });
      this._startPing();
    }
    this._emit(msg);
  }

  private _send(msg: TerminalMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private _emit(event: TerminalEvent) {
    this.onEvent?.(event);
  }

  private _startPing() {
    this._stopPing();
    this.pingTimer = setInterval(() => {
      this._send({ type: "ping" });
    }, 30000);
  }

  private _stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}