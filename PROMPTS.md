# Промпты для генерации 3D и текстур

Для Meshy / Tripo / Luma / Rodin. Это дружеские стилизованные аватары, а не
портреты реальных людей: лица обобщённые, без черт, как у 3D-скана.

## BASE — базовая фигура (главный ассет)

```
Full-body stylized human sculpture, matte plaster and clay material, off-white
#EAF3EC, smooth simplified anatomy, featureless generalized face without eyes
or mouth, soft rounded forms like a 3D body scan turned into a museum statue,
neutral A-pose, arms slightly away from body, standing straight, barefoot,
clean topology, subtle surface porosity, no texture patterns, no clothing,
no logos, studio lighting, neutral grey background, single centered subject,
full height in frame
```

Экспорт: GLB, Y-up, рост 1.75 м в мировых единицах, origin между стопами.
Кости обязательно назвать: `headTop`, `face`, `spine`, `handL`, `handR`,
`back` — именно по ним гардероб вешает предметы.

### Negative prompt (ко всем фигурам)

```
photorealistic skin, facial features, eyes, teeth, hair strands, anime style,
cartoon eyes, text, watermark, weapons aimed at viewer, gore, nudity, brand
logos, glossy plastic, metallic sheen, cluttered background
```

## STONE — камень-подиум

```
Dark rough stone plinth, irregular hand-chiseled boulder, matte basalt surface
#16321F tinted green-black, micro-cracks and shallow pits, flat top face,
physically based, high roughness 0.9, no moss, no vegetation, studio lighting,
single object on neutral background
```

## FLOOR — пол зала

```
Seamless matte museum floor texture, deep green-black micro-cement #0B1410,
very subtle grain, faint horizontal sheen, no tiles, no grout lines, 2k
tileable, PBR albedo + roughness + normal
```

## Персонажи (13 образцов)

Ко всем применяется BASE + negative. Ниже — что добавить.

### 001 · shadow — Основатель. Тот, кто не спит (`clay-01`, рост 1.86, акцент #4ADE80)

```
tall lean figure, slightly hunched shoulders of someone who sits at night,
hood pulled up over the head, oversized hoodie, straight jeans, heavy boots,
small phone held low in the right hand, long cape falling from shoulders,
contrapposto stance, weight on one leg, head tilted down as if reading a chat,
ink-black clothing, neon lime rim light from behind
```

### 002 · mango — Хранитель киви (`clay-02`, 1.78, #2F6B4A)

```
confident wide stance, chest forward, small curved horns on the head, moss
green hoodie, dark jeans, light sneakers, holding a single round kiwi fruit in
the left hand like a precious sample, tiny kiwi bird standing beside the right
foot, warm studio key light
```

### 003 · cabe1y — Савели Бог (`clay-03`, 1.74, #49C5B6)

```
medium build, one arm raised in a mock-blessing gesture, glowing thin halo
floating above the head, deep green hoodie, sweatpants, slides, ceramic mug in
the other hand, a snail slowly climbing the shoulder, night lighting with mint
rim, faint smug tilt of the head
```

### 004 · izana — Дневная смена (`clay-04`, 1.68, #4ADE80)

```
compact friendly silhouette, mid-step as if walking into frame, round glasses,
light tee, moss midi skirt, sneakers, small backpack, holding a kiwi, an owl
perched on the left shoulder, bright daylight studio setup
```

### 005 · sglypa — Нейро-образец (`clay-05`, 1.72, #49C5B6)

```
perfectly symmetrical rigid figure standing at attention, oversized headphones,
thin glowing visor across the face, structured blazer, dark jeans, boots,
holding a small blank sign, a levitating wireframe cube orbiting the head,
cold void lighting, slight digital scanline artifact on the surface
```

### 006 · ghost — Призрак витрины (`clay-06`, 1.75, #8FA79A)

```
semi-transparent frosted glass figure, no facial features at all, deep hood and
soft face covering, long draped cloak, barefoot, arms hanging still, standing
slightly off-center, edges dissolving into fog, dark void background, faint
inner glow
```

### 007 · rassol — Спс бро (`clay-07`, 1.70, #49C5B6)

```
relaxed friendly posture, one hand raised in a small greeting, moss cap worn
straight, plain tee, shorts, slides, mug in hand, light backpack, weight on
both feet, warm neutral studio light
```

### 008 · ded — Странный дед. Цыпалета (`clay-08`, 1.66, #F2B23E)

```
short stocky figure with a slight forward lean, knitted beanie, amber-tinted
round glasses, thick fur coat, sweatpants, boots, holding a small hand-written
sign, a tiny chick standing on the shoulder, warm amber key light, cozy
eccentric silhouette
```

### 009 · dash — Ведущий шоу (`clay-09`, 1.72, #4ADE80)

```
showman pose, one leg forward, arms open mid-announcement, lime cap turned
slightly, dark sunglasses, moss bomber jacket, jeans, sneakers, acoustic guitar
held by the neck in one hand, stage-like key light with soft spot on the face
```

### 010 · exit — Указатель выхода (`clay-10`, 1.64, #49C5B6)

```
small energetic figure caught mid-turn, one arm extended pointing off to the
side, dark sunglasses, mint hoodie, deep green skirt, sneakers, holding a plain
directional sign, a small potted cactus at the feet, crisp studio light
```

### 011 · syshev — Лектор ночной смены (`clay-11`, 1.76, #E2564B)

```
theatrical lecturer stance, one hand raised with an index finger up, small dark
horns, face half covered by a smooth mask, sharp black blazer, dark jeans,
boots, phone in the lowered hand, deep coral cape, dramatic night lighting with
a single hard key from above
```

### 012 · phoenix — Метеорит. Семь дней (`clay-12`, 1.73, #F2B23E)

```
figure caught mid-arrival, leaning forward as if landing, deep green jacket,
jeans, sneakers, large amber feathered wings half folded behind the back,
faint ember particles around the shoulders, bright warm rim light against a
cold background
```

### 013 · dot — Точка. Наблюдатель (`clay-base`, 1.70, #8FA79A)

```
absolutely neutral base figure, plain tee, dark jeans, barefoot, holding a
single kiwi, arms relaxed at the sides, perfectly still A-pose, flat even void
lighting, the quietest sample in the hall
```

## Текстуры предметов гардероба

```
Matte fabric material, flat single color, no pattern, no logo, slight woven
micro-texture, roughness 0.85, metalness 0, soft studio lighting, seamless 1k
tileable PBR set (albedo, roughness, normal)
```

Свотчи (должны совпадать с `src/data/wardrobe.ts`):
`clay #EAF3EC` · `mint #49C5B6` · `lime #4ADE80` · `moss #2F6B4A` ·
`deep #16321F` · `ink #0E1512` · `amber #F2B23E` · `coral #E2564B`.

## Обложка и OG

```
Wide museum hall interior, deep green-black gradient background, a row of
matte off-white plaster figures standing on dark stone plinths, volumetric
studio light from above, thin fog near the floor, shallow depth of field,
giant serif typography faintly visible behind the figures, editorial
photography look, 1200x630 composition with empty space on the left
```
