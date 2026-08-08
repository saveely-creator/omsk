import type { Metadata } from "next";

import LabView from "@/components/views/LabView";

export const metadata: Metadata = {
  title: "Лаборатория",
  description: "Закрытая секция музея: экспонат 000 и скрытая модель админа.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return <LabView />;
}
