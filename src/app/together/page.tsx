import type { Metadata } from "next";

import TogetherView from "@/components/views/TogetherView";
import { CHAT } from "@/data/chat";

export const metadata: Metadata = {
  title: "Общий снимок",
  description: `Все ${CHAT.totals.people} образцов ${CHAT.name} в одной сцене: облететь камерой, перемешать расстановку, одеть всех одинаково и скачать групповое фото.`,
  alternates: { canonical: "/together" },
};

export default function TogetherPage() {
  return <TogetherView />;
}
