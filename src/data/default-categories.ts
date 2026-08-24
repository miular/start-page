import type { Category } from "../types/domain";

export const defaultCategories: Category[] = [
  { id: "cat-tools", name: "工具", icon: "tools", order: 0 },
  { id: "cat-llm", name: "大模型", icon: "llm", order: 1 },
];