import type { ComponentType } from "react";
import {
  Wrench, Sparkles, Folder, Code, Palette, Globe, Link2,
  Star, Heart, BookOpen, Film, Music, ShoppingCart, Users,
  Mail, CloudSun, Gamepad2, Plane, Wallet, Newspaper,
  Clock, Camera, Home, Bell, MapPin, Zap, Trophy, Gift, Shield, Search,
  Settings, Plus, Pencil, Trash2, X,
  Download, FileDown,
} from "lucide-react";

type IconComponent = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

const registry: Record<string, IconComponent> = {
  // 系统操作
  search: Search,
  settings: Settings,
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  close: X,
  // 通用
  globe: Globe,
  link: Link2,
  folder: Folder,
  star: Star,
  heart: Heart,
  home: Home,
  shield: Shield,
  gift: Gift,
  trophy: Trophy,
  // 工具 / 开发
  tools: Wrench,
  code: Code,
  palette: Palette,
  zap: Zap,
  // 大模型 / AI
  llm: Sparkles,
  // 内容
  book: BookOpen,
  film: Film,
  music: Music,
  newspaper: Newspaper,
  camera: Camera,
  // 社交 / 通信
  users: Users,
  mail: Mail,
  bell: Bell,
  // 生活
  cart: ShoppingCart,
  wallet: Wallet,
  plane: Plane,
  map: MapPin,
  weather: CloudSun,
  game: Gamepad2,
  clock: Clock,
  // 导出操作
  download: Download,
  fileDown: FileDown,
};

export const iconRegistry = Object.keys(registry);

export type IconName = keyof typeof registry;

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 20, className = "" }: IconProps) {
  const LucideIcon = registry[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} strokeWidth={1.5} />;
}