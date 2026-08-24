import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { TerminalClient } from "../../lib/terminal/client";
import { getTerminalToken } from "../../lib/terminal/token";
import { getSessionId, setSessionId } from "../../lib/terminal/session";
import "@xterm/xterm/css/xterm.css";

export function TerminalPane() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<TerminalClient | null>(null);
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    const token = getTerminalToken();
    if (!token) {
      setStatus("no-token");
      return;
    }

    const savedSessionId = getSessionId();

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 14,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
      theme: {
        background: "transparent",
        foreground: "#e0e0e0",
        cursor: "#e0e0e0",
        selectionBackground: "rgba(255, 255, 255, 0.2)",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    if (containerRef.current) {
      term.open(containerRef.current);
    }

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      const dims = fitAddon.proposeDimensions();
      if (dims) {
        clientRef.current?.sendResize(dims.cols, dims.rows);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const dims = fitAddon.proposeDimensions();
    const client = new TerminalClient();
    clientRef.current = client;

    client.on((event) => {
      switch (event.type) {
        case "ready":
          setSessionId(event.sessionId);
          setStatus("connected");
          break;
        case "output":
          term.write(event.data);
          break;
        case "exit":
          term.write(`\r\n\x1b[31mProcess exited with code ${event.code}\x1b[0m\r\n`);
          break;
        case "error":
          setStatus(`error: ${event.message}`);
          break;
        case "status":
          if (event.state === "disconnected") {
            setStatus("disconnected");
          } else if (event.state === "connecting") {
            setStatus("connecting");
          } else if (event.state === "error") {
            setStatus("error");
          }
          break;
      }
    });

    client.connect("127.0.0.1", 5517, token, dims?.cols ?? 80, dims?.rows ?? 24, savedSessionId ?? undefined);

    term.onData((data) => {
      client.sendInput(data);
    });

    return () => {
      resizeObserver.disconnect();
      client.disconnect();
      clientRef.current = null;
      term.dispose();
    };
  }, []);

  if (status === "no-token") {
    return (
      <div className="terminal-placeholder">
        <p>请先配置终端配对 Token</p>
        <p className="terminal-hint">在设置中粘贴守护进程生成的 Token 后刷新页面</p>
      </div>
    );
  }

  if (status === "connecting" || status === "disconnected" || status === "error") {
    return (
      <div className="terminal-placeholder">
        <p>{status === "connecting" ? "正在连接终端..." : status === "disconnected" ? "终端已断开" : "连接失败"}</p>
        <p className="terminal-hint">请确认守护进程正在运行（在项目目录执行 node server/daemon.mjs）</p>
      </div>
    );
  }

  return <div ref={containerRef} className="terminal-container" />;
}