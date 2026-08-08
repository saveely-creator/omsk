import type { Metadata } from "next";

import WikiView from "@/components/views/WikiView";
import { CHAT, DICTIONARY, LEGENDS } from "@/data/chat";

export const metadata: Metadata = {
  title: "Чат.вики",
  description: `Словарь (${DICTIONARY.length} терминов), ${LEGENDS.length} легенд и таймлайн ${CHAT.name} за ${CHAT.years}.`,
  alternates: { canonical: "/wiki" },
};

export default function WikiPage() {
  return <WikiView />;
}
