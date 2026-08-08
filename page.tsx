import type { Metadata } from "next";

import HubView from "@/components/views/HubView";
import { CHAT } from "@/data/chat";

export const metadata: Metadata = {
  title: "Цифровой музей чата",
  description: `Зал образцов ${CHAT.name}: ${CHAT.totals.people} фигур, ${CHAT.totals.messages.toLocaleString(
    "ru-RU",
  )} сообщений, ${CHAT.years}. Каждую скульптуру можно крутить и переодевать.`,
  alternates: { canonical: "/" },
};

export default function Page() {
  return <HubView />;
}
