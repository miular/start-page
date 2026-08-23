import type { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = {
  variant?: "ghost" | "primary" | "icon";
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "ghost", children, className = "", ...props }: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}