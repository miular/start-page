import { useState, useEffect } from "react";
import { formatTime, formatDate } from "../../lib/date";

export function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock-container">
      <time className="clock-time" dateTime={now.toISOString()}>
        {formatTime(now)}
      </time>
      <p className="clock-date">{formatDate(now)}</p>
    </div>
  );
}