import {
  AppWindow,
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  QrCode,
  Router,
  Shield,
  UserRound,
  Wallet,
} from "lucide-react";

import type { PayloadType } from "../../types";

const icons = {
  URL: Globe,
  UPI: Wallet,
  WIFI: Router,
  SMS: MessageSquareText,
  EMAIL: Mail,
  TEL: Phone,
  VCARD: UserRound,
  GEO: MapPin,
  CALENDAR: CalendarDays,
  INTENT: AppWindow,
  TEXT: QrCode,
} satisfies Record<PayloadType, typeof Shield>;

export default function TypeIcon({ type, className = "h-5 w-5" }: { type: PayloadType; className?: string }) {
  const Icon = icons[type] ?? Shield;
  return <Icon className={className} />;
}
