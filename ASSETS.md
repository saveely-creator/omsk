# Ассеты

Сайт запускается **без единого внешнего файла**: всё, что нужно для картинки,
генерируется в рантайме. Ниже — что уже есть в коде и что можно добавить,
если захотите поднять уровень 3D.

## 1. Генерируется кодом (делать ничего не надо)

| Ассет                                    | Где                                                                           |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Matcap глины, камня, предметов           | `src/three/matcap.ts` — радиальные градиенты на canvas, кеш по цвету          |
| Normal map камня                         | `makeStoneNormalMap()` — value-noise → нормали                                |
| Film grain                               | SVG `feTurbulence` в `--grain-url` (`globals.css`)                            |
| VHS-дизеринг                             | CSS-слой `.vhs-layer` + `:root[data-vhs="on"]`                                |
| Звуки (тик, шторка, затвор, «разбудить») | `src/lib/easter.ts`, WebAudio-осцилляторы                                     |
| OG-картинки участников                   | `src/app/p/[slug]/opengraph-image.tsx` (`next/og`)                            |
| Шрифты                                   | `next/font/google`: Playfair Display (дисплей, есть кириллица) + Manrope (UI) |
| PNG-снимки с рамкой                      | `src/lib/screenshot.ts`, рисует этикетку на canvas                            |

Важно: Instrument Serif из брифа не содержит кириллицы, поэтому дисплейный
шрифт — Playfair Display. Если нужна PP Editorial New, купите лицензию, положите
файлы в `public/fonts/` и подключите через `next/font/local` в `layout.tsx`.

## 2. Опционально: GLB-пайплайн A (сгенерировать отдельно)

| Файл                              | Что это                                                | Бюджет          |
| --------------------------------- | ------------------------------------------------------ | --------------- |
| `public/models/clay-base.glb`     | базовая гипсовая фигура, A-поза, скелет                | ≤ 3 МБ          |
| `public/models/clay-base-low.glb` | LOD-версия для `/together` и карточек                  | ≤ 800 КБ        |
| `public/models/props/head-*.glb`  | шапка, кепка, капюшон, наушники, нимб, рога, бейсболка | ≤ 150 КБ каждый |
| `public/models/props/face-*.glb`  | очки, солнечные, маска, визор                          | ≤ 120 КБ        |
| `public/models/props/top-*.glb`   | худи, куртка, футболка, пиджак, шуба                   | ≤ 400 КБ        |
| `public/models/props/hands-*.glb` | телефон, кружка, гитара, меч, шаурма, киви, табличка   | ≤ 200 КБ        |
| `public/models/props/back-*.glb`  | крылья, рюкзак, плащ                                   | ≤ 300 КБ        |
| `public/models/props/pet-*.glb`   | улитка, киви-птица, сова, цыплёнок, кактус, куб        | ≤ 200 КБ        |
| `public/hdri/studio.hdr`          | студийный HDRI для `<Environment files=…>`             | ≤ 2 МБ, 1k      |

Сжатие: `npx gltf-transform optimize in.glb out.glb --texture-compress webp` и
`--compress meshopt` (или Draco). Проверьте, что в GLB остались кости с именами
`headTop`, `face`, `spine`, `handL`, `handR`, `back` — к ним крепятся слоты
гардероба.

### Как перейти с процедурной фигуры на GLB

1. Положите файлы в `public/models/`.
2. В `src/three/Figure.tsx` замените тело компонента на `useGLTF` +
   `SkeletonUtils.clone`, сохранив те же props (`outfit`, `accent`, `height`,
   `pose`, `wake`, `lod`, `dim`, `opacity`).
3. Предметы из `props.tsx` можно менять поштучно: каждый компонент
   (`HeadItem`, `FaceItem`, `TopItem`, …) получает `id` и `color`, так что
   `switch` просто начинает возвращать `<primitive object={gltf.scene} />`.
4. Углы из `src/three/poses.ts` перенесите на кости: имена сегментов
   совпадают (`armL`, `armR`, `legL`, `legR`, `head`, `torso`).
5. В `Stage.tsx` замените процедурный риг на
   `<Environment files="/hdri/studio.hdr" />`, если нужен точный свет Greta.

LOD: `Figure` уже принимает `lod="low" | "high"`. На `/together` и в карточках
хаба используется `low` — туда же подключайте `clay-base-low.glb`.

## 3. Опционально: ручные файлы

| Файл                                    | Зачем                                         |
| --------------------------------------- | --------------------------------------------- |
| `public/og-default.png` (1200×630)      | OG для `/`, `/together`, `/wiki`              |
| `public/icon.svg`                       | фавиконка (сейчас его роль играет emoji-глиф) |
| `public/apple-icon.png` (180×180)       | iOS-иконка                                    |
| `public/fonts/manrope-cyrillic-500.ttf` | чтобы OG-картинки собирались без сети         |

Если хотите полностью оффлайн-сборку OG: положите TTF в `public/fonts/` и
в `opengraph-image.tsx` замените `fetch(…)` на
`readFile(path.join(process.cwd(), "public/fonts/manrope-cyrillic-500.ttf"))`.

## 4. Чего в репозитории сознательно нет

Выгрузка Telegram (`omskimpirefull.zip`, 187 HTML-файлов) в поставку не входит:
в ней личные данные, медиа и чувствительные сообщения. На сайт попали только
прошедшие фильтр цитаты и агрегированная статистика в `src/data/*.ts`.
