# OMSK IMPIRE — цифровой музей чата

Сайт-лаборатория: каждый участник чата — отдельная 3D-скульптура на своей
странице. Фигуру можно крутить и переодевать, все цитаты — вербатим из выгрузки
Telegram (185 639 сообщений, 2024-03-04 → 2026-08-08).

- `/` — хаб: манифест, счётчики, каталог образцов (drag-карусель).
- `/p/[slug]` — страница участника, 6 экранов, hero-вариант «Картотека».
- `/together` — общий снимок: все фигуры на одном подиуме + экспорт PNG.
- `/wiki` — Чат.вики: таймлайн, словарь, легенды, титулы.
- `/lab` — секретная секция (10 кликов по логотипу или `/lab` в терминале).
- `not-found` — мемная 404.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Требования: Node 20+, npm 10+. Внешних ассетов и CMS нет — все данные лежат в
`src/data/*.ts`, все текстуры генерируются в рантайме на canvas.

### Деплой на Vercel

```bash
npx vercel --prod
```

Переменных окружения нет. `metadataBase` задан в `src/app/layout.tsx` —
поменяйте домен на свой, иначе OG-ссылки будут указывать на
`https://omsk-impire.vercel.app`.

## Стек

Next.js 15 (App Router) + TypeScript · React Three Fiber + drei +
postprocessing · GSAP/ScrollTrigger · Lenis · Framer Motion · Tailwind CSS +
CSS-переменные · zustand + localStorage.

## Архитектура

```
src/
  app/
    layout.tsx            шрифты, тема, персистентный канвас, шторка, прелоадер
    globals.css           дизайн-система: токены, сетка, .display/.label/.micro
    page.tsx              /            → HubView
    p/[slug]/page.tsx     /p/:slug     → PersonView (+ opengraph-image.tsx)
    together/page.tsx     /together    → TogetherView
    wiki/page.tsx         /wiki        → WikiView
    lab/page.tsx          /lab         → LabView
    not-found.tsx         404
  components/
    chrome.tsx            хедер, футер, курсор, grain, VHS, счётчики, карусель
    flow.tsx              прелоадер, Lenis, шторка перехода, экраны, терминал
    Wardrobe.tsx          панель переодевания (bottom sheet на мобилке)
    views/*.tsx           контент страниц
  three/
    PersistentCanvas.tsx  один <Canvas> на всё приложение
    scenes.tsx            PersonScene / HubScene / TogetherScene / LabScene
    Figure.tsx            процедурная фигура из примитивов
    props.tsx             все предметы гардероба как меши
    Stage.tsx             камень, пол, свет, туман, постпроцессинг
    matcap.ts             matcap/normal-текстуры, генерируются на canvas
    poses.ts              8 поз
  store/
    outfit.ts             образы участников (persist)
    ui.ts                 звук, ацид, VHS, анимации, ачивки, курсор (persist)
    scene.ts              что показывает канвас: сцена, фокус, прогресс hero
  lib/
    easter.ts             sfx, терминал, лабораторный анализ, ачивки
    fitUrl.ts             ?fit=hoodie.moss,cap.ink,pose.2
    screenshot.ts         PNG с рамкой и этикеткой образца
    hooks.ts              inView, magnetic, hotkey, cursor-zone, DPR
```

Канвас **персистентный**: он смонтирован в `layout.tsx` и не пересоздаётся при
навигации. Страницы только переключают сцену через `useScene`, поэтому модели не
перезагружаются, а шторка перехода (`--curtain`, 820 мс) идёт поверх живого
WebGL.

## Как добавить участника

1. Откройте `src/data/people.ts` и добавьте объект в `PEOPLE`:

```ts
{
  slug: "newbie",                       // латиница, попадёт в /p/newbie
  name: "ник как в экспорте",
  hero: "NEWBIE",                       // чистая строка для гигантского серифа
  handle: "@newbie",
  title: "Хранитель оффтопа",
  tagline: "одна строка про человека",
  description: "2–3 предложения характера",
  quotes: ["только реальные фразы из чата"],
  memes: ["фирменные слова"],
  emoji: ["🥝"],
  stats: { messages: 100, avgLen: 18, capsPct: 1.2, nightPct: 30 },
  dossier: {
    spec: "014", firstSeen: "2026-01-01", lastSeen: "2026-08-08",
    activeDays: 40, peakHours: [23, 0, 1], reactionsReceived: 12, mediaShared: 3,
  },
  formula: [{ label: "мемы", value: 40 }, { label: "оффтоп", value: 60 }], // сумма = 100
  look: "абзац про телосложение, позу, шмот, питомца",
  model: { base: "clay-13", pose: 2, height: 1.74, accent: "#4ADE80" },
  outfitDefault: { head: "cap.moss", face: "none", top: "hoodie.moss",
    bottom: "jeans.deep", shoes: "sneakers.clay", hands: "mug.clay",
    back: "none", pet: "none", env: "studio", pose: "pose.2" },
  links: [{ to: "shadow", label: "120 ответов", weight: 120, kind: "reply" }],
  achievements: ["три коротких ачивки"],
}
```

2. Всё остальное подхватится автоматически: роут, статическая генерация,
   OG-картинка, карточка в каталоге, фигура в `/together`, легенда, стрелки
   «предыдущий/следующий», ачивка «посетить все страницы».
3. Значения `outfitDefault` берите только из `src/data/wardrobe.ts` — там же
   лежат все слоты, предметы, свотчи и пресеты.
4. Если фигура должна отличаться сильнее, поменяйте `model.height` (рост),
   `model.pose` (0–7) и `model.accent` (цвет подсветки).

Цитаты не выдумывайте: генератор данных собирал их из выгрузки, а поле
`quotes` — единственный источник текста для экрана «Цитаты», облачка над
моделью, цитаты дня и терминала.

## Пасхалки (14)

1. Конами-код (`↑↑↓↓←→←→ b a`) — ацид-зелёный режим.
2. 10 кликов по логотипу — открывается `/lab`.
3. Терминал по клавише `~`: `/who`, `/quote`, `/random`, `/lab`, `/acid`,
   `/vhs`, `/wake`, `/help`, `/clear`.
4. Кнопка «разбудить чат» — звук и все фигуры дёргаются.
5. Цитата дня в футере (детерминированная, сервер и клиент совпадают).
6. Счётчик «дней без оффтопа: 0».
7. Курсор-эмодзи в разделе мемов и на `/wiki`.
8. ASCII-пасхалка в консоли браузера.
9. VHS-дизеринг режим (тумблер в футере и на `/lab`).
10. «Лабораторный анализ» участника — наукообразная чушь на реальных числах.
11. Скрытая модель админа в `/lab` в god mode.
12. Экспонат 000: три сообщения 🍬🍬🍬 — всё, что осталось от одного участника.
13. Лабораторное радио на `/together` («Зайцев Нет», 1057 треков в выгрузке).
14. Ачивка за посещение всех страниц, включая все 13 образцов.

## Доступность и перф

- `prefers-reduced-motion` и тумблер «анимации» отключают Lenis, автоповорот,
  постпроцессинг и переводят канвас в `frameloop="demand"`.
- DPR ограничен: 1.5 на мобилке, 2 на десктопе; на мобилке меньше
  постпроцесса и упрощённые тени.
- Все кликабельные элементы ≥ 44 × 44 px, есть focus-стили, `aria-pressed` у
  переключателей, `.sr-only` для служебных подписей.
- Карусели работают мышью, пальцем и клавишами ← →.

## Ограничения этой поставки

- 3D-фигуры процедурные (вариант C из брифа) — сайт работает из коробки без
  внешних ассетов. Пайплайны A/B (GLB, image-to-3D) описаны в `ASSETS.md` и
  `PROMPTS.md`.
- Настоящий `InstancedMesh` для `/together` не используется: у каждого
  участника своя геометрия и свои предметы. Вместо этого — общий кеш matcap-
  материалов, `lod="low"` и отключённый постпроцессинг в групповой сцене.
- Проект собран как исходный код: в песочнице, где он писался, нет сети и
  npm-пакетов (`three`, `next`, `zustand`, `gsap`, `lenis`, `framer-motion`,
  `tailwindcss`), поэтому `npm install` и `next build` здесь не запускались.
  Первый запуск делайте у себя: `npm install && npm run dev`.
