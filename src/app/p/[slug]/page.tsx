import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PersonView from "@/components/views/PersonView";
import { CHAT } from "@/data/chat";
import { PEOPLE, getPerson } from "@/data/people";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return { title: "Образец не найден" };

  const description = `${person.title}. ${person.tagline}. ${person.stats.messages.toLocaleString(
    "ru-RU",
  )} сообщений в ${CHAT.name}, активных дней — ${person.dossier.activeDays}.`;

  return {
    title: person.hero,
    description,
    alternates: { canonical: `/p/${person.slug}` },
    openGraph: {
      title: `${person.hero} — ${CHAT.name}`,
      description,
      type: "profile",
      url: `/p/${person.slug}`,
    },
    twitter: { card: "summary_large_image", title: person.hero, description },
  };
}

export default async function PersonPage({ params }: Params) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) {
    notFound();
    return null;
  }
  return <PersonView person={person} />;
}
