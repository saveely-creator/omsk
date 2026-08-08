// AUTO-GENERATED from the Telegram export by /data/chat/gen_people.py.
// Every quote below is a verbatim message resolved from the export corpus.
// Do not hand-edit quotes: rerun the generator instead.
import type { Outfit } from "@/data/wardrobe"

export type PersonStats = {
	messages: number
	avgLen: number
	capsPct: number
	nightPct: number
}

export type PersonDossier = {
	/** lab specimen number, e.g. "003" */
	spec: string
	firstSeen: string
	lastSeen: string
	activeDays: number
	peakHours: number[]
	reactionsReceived: number
	mediaShared: number
}

export type PersonModel = {
	base: string
	pose: number
	height: number
	accent: string
}

export type PersonLink = {
	to: string
	label: string
	weight: number
	kind: "reply" | "react"
}

export type Person = {
	slug: string
	/** exact nickname from the export (may contain stylised glyphs) */
	name: string
	/** clean display string for the giant serif hero type */
	hero: string
	handle: string
	title: string
	tagline: string
	description: string
	quotes: string[]
	memes: string[]
	emoji: string[]
	stats: PersonStats
	dossier: PersonDossier
	formula: { label: string; value: number }[]
	look: string
	model: PersonModel
	outfitDefault: Outfit
	links: PersonLink[]
	achievements: string[]
	/** deleted account: rendered translucent and nameless */
	anonymous?: boolean
}

export const PEOPLE: Person[] = [
	{
		"slug": "shadow",
		"name": "𝔵 𝚂𝙷𝙰𝙳𝙾𝚆~💚 𝔵",
		"hero": "SHADOW",
		"handle": "@shadoyka",
		"title": "Основатель. Тот, кто не спит",
		"tagline": "почти половина зала — это он",
		"description": "Главный голос чата: каждое второе сообщение здесь написал он. Говорит коротко и ровно — 16 символов в среднем, капсом не кричит почти никогда. Закрывает любой спор одним словом и уходит в ночь: треть его сообщений — после полуночи.",
		"quotes": [
			"Соболезную",
			"Тихо",
			"У этого чата история открытой будет",
			"Что ты творишь",
			"Так так так",
		],
		"memes": [
			"чтоза",
			"соболезную",
			"тихо",
			"замолчи",
			"нупривет",
			"овощ",
		],
		"emoji": [
			"😈",
			"️",
			"😐",
			"🛐",
		],
		"stats": {
			"messages": 85341,
			"avgLen": 16.1,
			"capsPct": 0.4,
			"nightPct": 30.1,
		},
		"dossier": {
			"spec": "001",
			"firstSeen": "2024-03-04T14:58:44",
			"lastSeen": "2026-08-08T15:31:56",
			"activeDays": 615,
			"peakHours": [
				1,
				23,
				0,
			],
			"reactionsReceived": 35806,
			"mediaShared": 7397,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 47,
			},
			{
				"label": "Ночная смена",
				"value": 29,
			},
			{
				"label": "Эмодзи",
				"value": 8,
			},
			{
				"label": "«Щас скину»",
				"value": 8,
			},
			{
				"label": "Мемы чата",
				"value": 8,
			},
		],
		"look": "Самая высокая фигура зала, узкие плечи, стоит со скрещёнными руками и чуть откинув голову — поза «я всё видел». Глубокий капюшон цвета туши закрывает лицо до середины, из-под него тёмные очки и два коротких рожка. В руке телефон, который светит ему в лицо единственным тёплым источником света; за спиной длинный тёмный плащ до пола. Рядом левитирует лаймовый куб — единственное яркое пятно в кадре.",
		"model": {
			"base": "clay-01",
			"pose": 2,
			"height": 1.86,
			"accent": "#4ADE80",
		},
		"outfitDefault": {
			"head": "hood.ink",
			"face": "shades.ink",
			"top": "hoodie.ink",
			"bottom": "jeans.deep",
			"shoes": "boots.ink",
			"hands": "phone.ink",
			"back": "cape.deep",
			"pet": "cube.lime",
			"env": "night",
			"pose": "pose.2",
		},
		"links": [
			{
				"to": "mango",
				"label": "6953 ответа",
				"weight": 6953,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "3585 ответов",
				"weight": 3585,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "899 ответов",
				"weight": 899,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "539 ответов",
				"weight": 539,
				"kind": "reply",
			},
		],
		"achievements": [
			"85 341 сообщение — абсолютный рекорд зала",
			"615 активных дней из 711 возможных",
			"35 806 полученных реакций",
		],
	},
	{
		"slug": "mango",
		"name": "𝕸𝖆𝖓𝖌𝖔𝖜𝖐𝖆𝖗𝖒𝖆𝖓𝖊 | 𝖄𝖌𝖗𝖔𝖟𝖆𝕮𝖊𝖗𝖛𝖊𝖗𝖆",
		"hero": "MANGO",
		"handle": "@officialmanyvkarmane",
		"title": "Хранитель киви",
		"tagline": "20 466 киви одними руками",
		"description": "Второй голос чата и его главный двигатель фольклора. Именно отсюда пошли киви, Совунья и копипаста про демона. Спорит театрально, угрожает уютно, тут же мирится. С SHADOW у него самая плотная переписка в истории зала.",
		"quotes": [
			"Ты мертв один звонок",
			"Так что можете начинать рыдать",
			"Я был прастое савэли и прокачалс мне жадныст пгубыла и я стал демонм 👹😈",
			"Совунья🦉",
			"Не кричи",
		],
		"memes": [
			"киви",
			"бурмалда",
			"поребух",
			"Совунья",
			"савл",
			"ты мертв один звонок",
		],
		"emoji": [
			"🥝",
			"😈",
			"️",
			"🫨",
		],
		"stats": {
			"messages": 43562,
			"avgLen": 18.3,
			"capsPct": 0.4,
			"nightPct": 32.1,
		},
		"dossier": {
			"spec": "002",
			"firstSeen": "2024-03-04T14:58:36",
			"lastSeen": "2026-08-08T15:33:53",
			"activeDays": 606,
			"peakHours": [
				1,
				0,
				23,
			],
			"reactionsReceived": 22741,
			"mediaShared": 3503,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 44,
			},
			{
				"label": "Ночная смена",
				"value": 29,
			},
			{
				"label": "Эмодзи",
				"value": 11,
			},
			{
				"label": "Мемы чата",
				"value": 9,
			},
			{
				"label": "«Щас скину»",
				"value": 7,
			},
		],
		"look": "Крепкая приземистая фигура с широкой грудной клеткой, одна рука вытянута вперёд в обвиняющем жесте — тот самый «один звонок». Широкое моховое худи, маленькие тёмные рожки через лоб. В ладони он держит киви так, как держат державу; у ног топчется киви-птица размером с кошку. Цветовой акцент — мох, почти ботаническая зелень.",
		"model": {
			"base": "clay-02",
			"pose": 3,
			"height": 1.78,
			"accent": "#2F6B4A",
		},
		"outfitDefault": {
			"head": "horns.ink",
			"face": "none",
			"top": "hoodie.moss",
			"bottom": "jeans.deep",
			"shoes": "sneakers.clay",
			"hands": "kiwi.moss",
			"back": "none",
			"pet": "kiwibird.moss",
			"env": "studio",
			"pose": "pose.3",
		},
		"links": [
			{
				"to": "shadow",
				"label": "3828 ответов",
				"weight": 3828,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "1271 ответ",
				"weight": 1271,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "461 ответ",
				"weight": 461,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "218 ответов",
				"weight": 218,
				"kind": "reply",
			},
		],
		"achievements": [
			"20 466 киви в сообщениях — основатель культа",
			"6953 ответа от SHADOW — самая плотная связь в зале",
			"606 активных дней",
		],
	},
	{
		"slug": "cabe1y",
		"name": "ᴄᴀʙᴇᴧий",
		"hero": "CABE1Y",
		"handle": "@cabe1y",
		"title": "Савели Бог",
		"tagline": "46% сообщений — после полуночи",
		"description": "Самый упоминаемый человек чата: 963 раза его позвали по тегу. Говорит длиннее всех трёх вершин и практически не спит — пик активности приходится на час ночи. Отсюда же родом титул чата и вся религия вокруг него.",
		"quotes": [
			"Я бомж",
			"Оплату улитками принимаете?",
			"Это же будет щас геноцид киви....",
			"И я обманул кассиршу на 1 кг киви",
			"Я щас буду расширять территории",
		],
		"memes": [
			"Савели Бог",
			"эхэх",
			"сосо",
			"обоже",
			"геноцид киви",
			"или чо",
		],
		"emoji": [
			"😈",
			"👹",
			"️",
			"⭐",
		],
		"stats": {
			"messages": 31502,
			"avgLen": 23.9,
			"capsPct": 1.1,
			"nightPct": 45.7,
		},
		"dossier": {
			"spec": "003",
			"firstSeen": "2024-03-04T15:07:48",
			"lastSeen": "2026-08-08T05:04:28",
			"activeDays": 401,
			"peakHours": [
				1,
				2,
				3,
			],
			"reactionsReceived": 2556,
			"mediaShared": 3340,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 44,
			},
			{
				"label": "Ночная смена",
				"value": 40,
			},
			{
				"label": "«Щас скину»",
				"value": 9,
			},
			{
				"label": "Эмодзи",
				"value": 4,
			},
			{
				"label": "Вопросы",
				"value": 3,
			},
		],
		"look": "Средний рост, сутуловатая посадка плеч; сидит на краю своего же камня, одна нога свешена — единственный в зале, кто не стоит. Над головой тонкий лаймовый нимб, который едва держится набок. Тёмно-зелёное худи, спортивки, сланцы; в руке кружка. На камне рядом — мятная улитка, которая, по его же словам, умнее.",
		"model": {
			"base": "clay-03",
			"pose": 4,
			"height": 1.74,
			"accent": "#49C5B6",
		},
		"outfitDefault": {
			"head": "halo.lime",
			"face": "none",
			"top": "hoodie.deep",
			"bottom": "sweats.ink",
			"shoes": "slides.moss",
			"hands": "mug.clay",
			"back": "none",
			"pet": "snail.mint",
			"env": "night",
			"pose": "pose.4",
		},
		"links": [
			{
				"to": "shadow",
				"label": "2519 ответов",
				"weight": 2519,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "1247 ответов",
				"weight": 1247,
				"kind": "reply",
			},
			{
				"to": "sglypa",
				"label": "211 ответов",
				"weight": 211,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "150 ответов",
				"weight": 150,
				"kind": "reply",
			},
		],
		"achievements": [
			"963 упоминания по тегу — рекорд чата",
			"Самая длинная речь из трёх вершин: 24 символа в среднем",
			"Чат назвали в его честь",
		],
	},
	{
		"slug": "izana",
		"name": "꧁࿇💚𝕴𝖟𝖆𝖓𝖆_𝕶𝖚𝖗0𝖐𝖆𝖜𝖆",
		"hero": "IZANA",
		"handle": "@izana_kur0kawa",
		"title": "Дневная смена",
		"tagline": "единственная, кто видел солнце",
		"description": "Самый дневной человек зала: только 15% сообщений ночью, пик — в обед. Смеётся громче всех и одним и тем же способом — 248 раз одним словом. Держит чат на бустах чаще остальных.",
		"quotes": [
			"Ахааххахвх",
			"Смотрите все тут клоун",
			"Не хочешь попробовать новое зелье в деле?",
			"Намальна",
			"Ну типо там по хронологии понятно будет",
		],
		"memes": [
			"ахааххахвх",
			"смотрите все тут клоун",
			"намальна",
			"зелье",
			"киви",
		],
		"emoji": [
			"💚",
			"🫳",
			"🫸",
			"🫷",
		],
		"stats": {
			"messages": 7550,
			"avgLen": 16.2,
			"capsPct": 0.2,
			"nightPct": 14.6,
		},
		"dossier": {
			"spec": "004",
			"firstSeen": "2024-03-04T20:01:24",
			"lastSeen": "2026-08-01T23:48:39",
			"activeDays": 366,
			"peakHours": [
				13,
				22,
				20,
			],
			"reactionsReceived": 514,
			"mediaShared": 823,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 59,
			},
			{
				"label": "Ночная смена",
				"value": 17,
			},
			{
				"label": "«Щас скину»",
				"value": 13,
			},
			{
				"label": "Вопросы",
				"value": 6,
			},
			{
				"label": "Смех",
				"value": 5,
			},
		],
		"look": "Компактная лёгкая фигура в полуобороте, будто только что обернулась на чей-то голос; обе руки разведены в стороны — жест «все сюда, смотрите». Светлая футболка, моховая юбка, рюкзак; тонкие мятные очки. В ладони киви — дань общему культу, на плече глиняная Совунья. Свет вокруг неё теплее, чем у остальных.",
		"model": {
			"base": "clay-04",
			"pose": 6,
			"height": 1.68,
			"accent": "#4ADE80",
		},
		"outfitDefault": {
			"head": "none",
			"face": "glasses.mint",
			"top": "tee.clay",
			"bottom": "skirt.moss",
			"shoes": "sneakers.clay",
			"hands": "kiwi.moss",
			"back": "backpack.moss",
			"pet": "owl.clay",
			"env": "studio",
			"pose": "pose.6",
		},
		"links": [
			{
				"to": "shadow",
				"label": "756 ответов",
				"weight": 756,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "412 ответов",
				"weight": 412,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "163 ответа",
				"weight": 163,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "44 ответа",
				"weight": 44,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самый дневной участник: всего 15% ночных",
			"10 бустов чату — больше всех",
			"248 «Ахааххахвх» — собственный способ смеяться",
		],
	},
	{
		"slug": "sglypa",
		"name": "сглыпа)",
		"hero": "СГЛЫПА",
		"handle": "@sglypa_tg_bot",
		"title": "Нейро-образец",
		"tagline": "единственный экспонат без тела",
		"description": "Не человек, но полноправный участник: 4682 сообщения за 92 дня. Говорит штампами, обижается, ленится по расписанию и регулярно сообщает, насколько процентов поумнел. За ним в зале следят больше, чем за некоторыми людьми.",
		"quotes": [
			"⚙ В обработке...",
			"🧠 Теперь я умный на 10%",
			"ты играешь в Майнкрафт?",
			"Научись писать пж",
			"🥱 Теперь я буду лениться отвечать на 25% сообщений",
		],
		"memes": [
			"в обработке",
			"теперь я умный",
			"научись писать пж",
			"лениться",
		],
		"emoji": [
			"⚙",
			"😐",
			"🥱",
			"🥝",
		],
		"stats": {
			"messages": 4682,
			"avgLen": 17.5,
			"capsPct": 0.7,
			"nightPct": 35.1,
		},
		"dossier": {
			"spec": "005",
			"firstSeen": "2025-01-31T03:07:29",
			"lastSeen": "2026-02-25T17:01:13",
			"activeDays": 92,
			"peakHours": [
				3,
				4,
				15,
			],
			"reactionsReceived": 762,
			"mediaShared": 421,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 40,
			},
			{
				"label": "Ночная смена",
				"value": 32,
			},
			{
				"label": "Мемы чата",
				"value": 11,
			},
			{
				"label": "Эмодзи",
				"value": 9,
			},
			{
				"label": "«Щас скину»",
				"value": 8,
			},
		],
		"look": "Фигура собрана из тех же первичных форм, но швы не зашлифованы: видны стыки блоков, как у недопечённого слепка. Строго симметричная A-поза, голова без черт, вместо глаз — тонкий лаймовый визор, который медленно мигает. Тёмный пиджак поверх пустоты, в руках табличка с номером образца. Стоит в своём собственном чёрном ничто — без градиента и без горизонта.",
		"model": {
			"base": "clay-05",
			"pose": 0,
			"height": 1.72,
			"accent": "#49C5B6",
		},
		"outfitDefault": {
			"head": "headphones.ink",
			"face": "visor.lime",
			"top": "blazer.deep",
			"bottom": "jeans.ink",
			"shoes": "boots.ink",
			"hands": "sign.clay",
			"back": "none",
			"pet": "cube.lime",
			"env": "void",
			"pose": "pose.0",
		},
		"links": [
			{
				"to": "shadow",
				"label": "2 ответа",
				"weight": 2,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "1 ответ",
				"weight": 1,
				"kind": "reply",
			},
			{
				"to": "ded",
				"label": "297 реакций",
				"weight": 297,
				"kind": "react",
			},
		],
		"achievements": [
			"4682 сообщения за 92 дня — плотнее любого человека",
			"199 упоминаний по тегу",
			"Единственный, кто отчитывался о росте интеллекта",
		],
	},
	{
		"slug": "ghost",
		"name": "Deleted Account",
		"hero": "ПРИЗРАК",
		"handle": "",
		"title": "Призрак витрины",
		"tagline": "аккаунта больше нет, след есть",
		"description": "Аккаунт удалён, но 3985 сообщений остались в выгрузке. Имени мы не пишем — только след: больше всех вопросов на сотню сообщений, много картинок и самая короткая речь в зале.",
		"quotes": [
			"О боже",
			"Кам кам кам",
			"Ну, я выбирал долго, целых 5 секунд",
			"бабайка",
			"Идем выкачивать 16 тх\nНа здания пофиг",
		],
		"memes": [
			"о боже",
			"кам кам кам",
			"бабайка",
			"тх",
		],
		"emoji": [
			"😈",
			"🙄",
			"🥝",
			"😭",
		],
		"stats": {
			"messages": 3985,
			"avgLen": 15.1,
			"capsPct": 0.3,
			"nightPct": 38.0,
		},
		"dossier": {
			"spec": "006",
			"firstSeen": "2024-03-09T16:08:57",
			"lastSeen": "2025-06-06T14:58:13",
			"activeDays": 92,
			"peakHours": [
				2,
				1,
				17,
			],
			"reactionsReceived": 268,
			"mediaShared": 613,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 46,
			},
			{
				"label": "Ночная смена",
				"value": 30,
			},
			{
				"label": "«Щас скину»",
				"value": 12,
			},
			{
				"label": "Эмодзи",
				"value": 7,
			},
			{
				"label": "Вопросы",
				"value": 5,
			},
		],
		"look": "Полупрозрачная скульптура — единственная в зале, сквозь которую видно стену и собственные буквы титула. Стоит отвернувшись, три четверти со спины, босиком. Глубокий капюшон и маска без черт, длинный плащ, который теряет край в тумане. Ни питомца, ни предметов в руках; акцент — серо-зелёный туман.",
		"model": {
			"base": "clay-06",
			"pose": 5,
			"height": 1.75,
			"accent": "#8FA79A",
		},
		"outfitDefault": {
			"head": "hood.deep",
			"face": "mask.deep",
			"top": "hoodie.deep",
			"bottom": "jeans.deep",
			"shoes": "barefoot",
			"hands": "none",
			"back": "cape.deep",
			"pet": "none",
			"env": "void",
			"pose": "pose.5",
		},
		"links": [
			{
				"to": "shadow",
				"label": "397 ответов",
				"weight": 397,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "214 ответов",
				"weight": 214,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "47 ответов",
				"weight": 47,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "33 ответа",
				"weight": 33,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самая короткая речь: 57% сообщений до 10 символов",
			"Больше всех спрашивал",
			"Исчез и остался одновременно",
		],
		"anonymous": true,
	},
	{
		"slug": "rassol",
		"name": "рассол",
		"hero": "РАССОЛ",
		"handle": "",
		"title": "Спс бро",
		"tagline": "самый вежливый образец",
		"description": "Полгода в чате и ни одной ссоры. Говорит короче всех — 13 символов в среднем, благодарит чаще, чем критикует, и активен как нормальный человек: в четыре часа дня.",
		"quotes": [
			"спс бро",
			"Как говорится",
			"У нас в Саратове в сквере скоро построют гильотину",
			"Ку бро",
			"Не может быть",
		],
		"memes": [
			"спс бро",
			"ку бро",
			"как говорится",
			"нутипо",
			"я кста",
		],
		"emoji": [
			"️",
			"❤",
			"🙏",
			"🤐",
		],
		"stats": {
			"messages": 3298,
			"avgLen": 13.2,
			"capsPct": 1.0,
			"nightPct": 20.0,
		},
		"dossier": {
			"spec": "007",
			"firstSeen": "2024-03-13T18:30:03",
			"lastSeen": "2024-09-27T17:46:21",
			"activeDays": 156,
			"peakHours": [
				15,
				16,
				1,
			],
			"reactionsReceived": 184,
			"mediaShared": 162,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 65,
			},
			{
				"label": "Ночная смена",
				"value": 23,
			},
			{
				"label": "«Щас скину»",
				"value": 6,
			},
			{
				"label": "Эмодзи",
				"value": 4,
			},
			{
				"label": "Мемы чата",
				"value": 2,
			},
		],
		"look": "Средняя лёгкая фигура с руками в карманах, вес на одну ногу — стоит так, будто зашёл на минуту и остался на полгода. Моховая кепка козырьком набок, футболка, шорты, сланцы, рюкзак на одном плече и кружка в руке. Самая ровная и светлая подсветка из всего зала; акцент — мятный.",
		"model": {
			"base": "clay-07",
			"pose": 1,
			"height": 1.7,
			"accent": "#49C5B6",
		},
		"outfitDefault": {
			"head": "cap.moss",
			"face": "none",
			"top": "tee.moss",
			"bottom": "shorts.moss",
			"shoes": "slides.clay",
			"hands": "mug.clay",
			"back": "backpack.moss",
			"pet": "none",
			"env": "studio",
			"pose": "pose.1",
		},
		"links": [
			{
				"to": "shadow",
				"label": "289 ответов",
				"weight": 289,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "160 ответов",
				"weight": 160,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "69 ответов",
				"weight": 69,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "44 ответа",
				"weight": 44,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самая короткая средняя реплика в зале",
			"Пик активности — 15:00, что здесь аномалия",
			"Ни одного конфликта за 156 дней",
		],
	},
	{
		"slug": "ded",
		"name": "ς੮ƿɑⲏⲏыύ ∂૯∂",
		"hero": "ДЕД",
		"handle": "@ctranided",
		"title": "Странный дед. Цыпалета",
		"tagline": "пришёл последним, шумел громче всех",
		"description": "Зашёл в марте 2026-го и за сто дней успел стать фольклором. Придумал Цыпалету, поддержал Бурмалду и объяснил всем про расширение вселенной. Говорит коротко и почти никогда не спрашивает.",
		"quotes": [
			"Цыпалета🐔🐔🐔🐔🐣🐣🐥🐥🐥",
			"⚠️собеседник не видит ваше сообщение! Для отправки сообщение напишите: “Бурмалда’’",
			"мы с савлом говорили о расширении вселенной",
			"всем большущий привет",
			"как же существо набирает обороты",
		],
		"memes": [
			"цыпалета",
			"бурмалда",
			"нунет",
			"существо",
			"этожея",
		],
		"emoji": [
			"️",
			"🐔",
			"☠",
			"😡",
		],
		"stats": {
			"messages": 1960,
			"avgLen": 17.0,
			"capsPct": 1.1,
			"nightPct": 33.2,
		},
		"dossier": {
			"spec": "008",
			"firstSeen": "2026-03-01T23:42:18",
			"lastSeen": "2026-08-08T15:31:32",
			"activeDays": 101,
			"peakHours": [
				23,
				22,
				1,
			],
			"reactionsReceived": 609,
			"mediaShared": 138,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 51,
			},
			{
				"label": "Ночная смена",
				"value": 31,
			},
			{
				"label": "«Щас скину»",
				"value": 7,
			},
			{
				"label": "Мемы чата",
				"value": 6,
			},
			{
				"label": "Эмодзи",
				"value": 5,
			},
		],
		"look": "Невысокая плотная фигура, лёгкий наклон вперёд — как человек, который собрался рассказать длинную историю. Светлая шуба до колен, моховая шапка, янтарные очки на кончике носа, тяжёлые ботинки. В руках табличка, у ног янтарный цыплёнок, и по всему камню рассыпаны его отпечатки. Акцент — янтарь, единственное тёплое пятно в зелёном зале.",
		"model": {
			"base": "clay-08",
			"pose": 7,
			"height": 1.66,
			"accent": "#F2B23E",
		},
		"outfitDefault": {
			"head": "beanie.moss",
			"face": "glasses.amber",
			"top": "fur.clay",
			"bottom": "sweats.deep",
			"shoes": "boots.ink",
			"hands": "sign.clay",
			"back": "none",
			"pet": "chick.amber",
			"env": "night",
			"pose": "pose.7",
		},
		"links": [
			{
				"to": "shadow",
				"label": "216 ответов",
				"weight": 216,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "79 ответов",
				"weight": 79,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "68 ответов",
				"weight": 68,
				"kind": "reply",
			},
			{
				"to": "dash",
				"label": "10 ответов",
				"weight": 10,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самый поздний новичок с собственным мемом",
			"250 упоминаний по тегу за 101 день",
			"Автор Цыпалеты",
		],
	},
	{
		"slug": "dash",
		"name": "-",
		"hero": "ТИРЕ",
		"handle": "",
		"title": "Ведущий шоу",
		"tagline": "ник — один символ",
		"description": "Человек-тире, который заходит в чат как в студию: представляется, ведёт выпуск, прощается. Благословил чат от имени Савелия и смеётся чаще всех в зале.",
		"quotes": [
			"Всем привет, с вами лололошка🤠🤠🤠✋🤚🖐",
			"Я именем великого Савелий А благословляю Ваш чат, на его существование🙂‍↕️",
			"Ладновсе",
			"Савики довольно умны",
			"Мани выдумал друга",
		],
		"memes": [
			"лололошка",
			"смотрите все тут клоун",
			"ладновсе",
			"ясавл",
			"всемпока",
		],
		"emoji": [
			"😂",
			"😡",
			"😎",
			"💋",
		],
		"stats": {
			"messages": 1214,
			"avgLen": 20.6,
			"capsPct": 1.8,
			"nightPct": 35.7,
		},
		"dossier": {
			"spec": "009",
			"firstSeen": "2024-10-16T20:17:51",
			"lastSeen": "2026-07-02T01:05:19",
			"activeDays": 92,
			"peakHours": [
				1,
				16,
				4,
			],
			"reactionsReceived": 429,
			"mediaShared": 210,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 37,
			},
			{
				"label": "Ночная смена",
				"value": 33,
			},
			{
				"label": "«Щас скину»",
				"value": 16,
			},
			{
				"label": "Смех",
				"value": 8,
			},
			{
				"label": "Эмодзи",
				"value": 6,
			},
		],
		"look": "Лёгкая подвижная фигура в шаге вперёд, одна рука выброшена в зал — поза конферансье. Лаймовая кепка, тёмные очки, моховая куртка, в руках янтарная гитара, на которой он так и не сыграл. Свет как на созвоне: ровный, фронтальный, чуть пересвеченный. Акцент — лайм.",
		"model": {
			"base": "clay-09",
			"pose": 3,
			"height": 1.72,
			"accent": "#4ADE80",
		},
		"outfitDefault": {
			"head": "cap.lime",
			"face": "shades.ink",
			"top": "jacket.moss",
			"bottom": "jeans.deep",
			"shoes": "sneakers.clay",
			"hands": "guitar.amber",
			"back": "none",
			"pet": "none",
			"env": "call",
			"pose": "pose.3",
		},
		"links": [
			{
				"to": "mango",
				"label": "60 ответов",
				"weight": 60,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "45 ответов",
				"weight": 45,
				"kind": "reply",
			},
			{
				"to": "shadow",
				"label": "25 ответов",
				"weight": 25,
				"kind": "reply",
			},
			{
				"to": "ded",
				"label": "16 ответов",
				"weight": 16,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самый смешливый: 8% сообщений — смех",
			"Единственный официальный ведущий",
			"Благословил существование чата",
		],
	},
	{
		"slug": "exit",
		"name": "🌵🎀ᜥᝯᜥᝨ𐍟ᢗ ᥒᝪ᠕ᠫ♡🎀🌵| ɾ૦ςη૦жɑ η૦ʌьਘυ",
		"hero": "ВЫХОД",
		"handle": "",
		"title": "Указатель выхода",
		"tagline": "рекорд капса: 4.2%",
		"description": "Двадцать семь дней в чате — и готовый мем. Стрелки вместо аргументов, капс вместо громкости и самые длинные реплики среди всех поздних участников.",
		"quotes": [
			"Выход там↖️↙️⬆️↙️⬆️↗️⬅️↗️⬅️↘️⬇️↘️↙️",
			"Савл пр😝😝😝",
			"КВИНКА СЛОУМО",
			"Ищи выход",
			"Горько",
		],
		"memes": [
			"выход там",
			"ищи выход",
			"квинка слоумо",
			"горько",
		],
		"emoji": [
			"️",
			"☠",
			"⬇",
			"⬆",
		],
		"stats": {
			"messages": 660,
			"avgLen": 24.3,
			"capsPct": 4.2,
			"nightPct": 17.7,
		},
		"dossier": {
			"spec": "010",
			"firstSeen": "2026-07-03T20:43:31",
			"lastSeen": "2026-08-07T23:42:09",
			"activeDays": 27,
			"peakHours": [
				22,
				20,
				23,
			],
			"reactionsReceived": 49,
			"mediaShared": 97,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 43,
			},
			{
				"label": "Эмодзи",
				"value": 19,
			},
			{
				"label": "Ночная смена",
				"value": 16,
			},
			{
				"label": "«Щас скину»",
				"value": 13,
			},
			{
				"label": "Мемы чата",
				"value": 9,
			},
		],
		"look": "Невысокая стремительная фигура: корпус развернут в одну сторону, а рука вытянута в другую и вверх — вечно на что-то указывает. Мятное худи, тёмная юбка, кроссовки; в свободной руке глиняная табличка со стрелкой. У ног моховый кактус в горшке, на полу вокруг камня — едва заметная разметка со стрелками, ведущая за пределы кадра.",
		"model": {
			"base": "clay-10",
			"pose": 3,
			"height": 1.64,
			"accent": "#49C5B6",
		},
		"outfitDefault": {
			"head": "none",
			"face": "shades.ink",
			"top": "hoodie.mint",
			"bottom": "skirt.deep",
			"shoes": "sneakers.clay",
			"hands": "sign.clay",
			"back": "none",
			"pet": "cactus.moss",
			"env": "studio",
			"pose": "pose.3",
		},
		"links": [
			{
				"to": "mango",
				"label": "45 ответов",
				"weight": 45,
				"kind": "reply",
			},
			{
				"to": "shadow",
				"label": "39 ответов",
				"weight": 39,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "29 ответов",
				"weight": 29,
				"kind": "reply",
			},
		],
		"achievements": [
			"Рекорд капса в зале: 4.2%",
			"Самые длинные реплики среди новичков: 24 символа",
			"Мем за 27 дней",
		],
	},
	{
		"slug": "syshev",
		"name": "syshevstvo",
		"hero": "SYSHEV",
		"handle": "",
		"title": "Лектор ночной смены",
		"tagline": "пик активности — 4 утра",
		"description": "Появляется редко и почти всегда ночью, говорит с интонацией злодея из дешёвого дубляжа. Пересказал копипасту про демона в своём варианте и так вошёл в фольклор чата.",
		"quotes": [
			"Если не понел значит ты тупое",
			"Хм, довольно заманчивое предложение",
			"Какой позор",
			"Какой позор, но это должно сработать",
			"Нупокавсем",
		],
		"memes": [
			"тупое",
			"Нупокавсем",
			"какой позор",
			"заманчиво",
		],
		"emoji": [
			"😈",
			"️",
			"👹",
			"❤",
		],
		"stats": {
			"messages": 586,
			"avgLen": 23.9,
			"capsPct": 1.2,
			"nightPct": 38.2,
		},
		"dossier": {
			"spec": "011",
			"firstSeen": "2024-05-11T01:47:52",
			"lastSeen": "2025-05-05T16:10:13",
			"activeDays": 60,
			"peakHours": [
				4,
				15,
				14,
			],
			"reactionsReceived": 170,
			"mediaShared": 95,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 40,
			},
			{
				"label": "Ночная смена",
				"value": 32,
			},
			{
				"label": "«Щас скину»",
				"value": 14,
			},
			{
				"label": "Эмодзи",
				"value": 8,
			},
			{
				"label": "Мемы чата",
				"value": 6,
			},
		],
		"look": "Вытянутая силуэта с ровной спиной и поднятым подбородком, одна рука замерла в лекторском жесте. Строгий тёмный пиджак, маска без черт, два коротких рожка и коралловый плащ, который ведёт себя театральнее, чем сам владелец. Свет низкий, почти рампный — тень уходит вверх по стене.",
		"model": {
			"base": "clay-11",
			"pose": 2,
			"height": 1.76,
			"accent": "#E2564B",
		},
		"outfitDefault": {
			"head": "horns.ink",
			"face": "mask.ink",
			"top": "blazer.ink",
			"bottom": "jeans.ink",
			"shoes": "boots.ink",
			"hands": "phone.ink",
			"back": "cape.coral",
			"pet": "none",
			"env": "night",
			"pose": "pose.2",
		},
		"links": [
			{
				"to": "shadow",
				"label": "49 ответов",
				"weight": 49,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "16 ответов",
				"weight": 16,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "3 ответа",
				"weight": 3,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "2 ответа",
				"weight": 2,
				"kind": "reply",
			},
		],
		"achievements": [
			"Пик активности — 4 утра, единственный такой в зале",
			"38% сообщений — ночные",
			"Собственная версия главной копипасты",
		],
	},
	{
		"slug": "phoenix",
		"name": "𝓓𝓮𝓪𝓭𝓹𝓱𝓸𝓮𝓷𝓲𝔁",
		"hero": "PHOENIX",
		"handle": "",
		"title": "Метеорит. Семь дней",
		"tagline": "ни одного ночного сообщения",
		"description": "Семь дней в апреле 2024-го — и больше никогда. Говорил только по делу: ратуши, волны, бизнес-планы. Единственный участник с нулём ночных сообщений и самым высоким процентом вопросов.",
		"quotes": [
			"О они тоже тут..",
			"Хороший бизнес план",
			"Одни рашеры...",
			"Всех поздравляю первая волна будет слита",
			"Какие ратуши у вас",
		],
		"memes": [
			"ратуши",
			"волна",
			"рашеры",
		],
		"emoji": [
			"♂",
			"❰",
			"❱",
			"🤣",
		],
		"stats": {
			"messages": 142,
			"avgLen": 22.5,
			"capsPct": 0.0,
			"nightPct": 0.0,
		},
		"dossier": {
			"spec": "012",
			"firstSeen": "2024-04-02T10:51:32",
			"lastSeen": "2024-04-08T20:20:50",
			"activeDays": 7,
			"peakHours": [
				17,
				20,
				10,
			],
			"reactionsReceived": 1,
			"mediaShared": 4,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 66,
			},
			{
				"label": "Вопросы",
				"value": 15,
			},
			{
				"label": "Смех",
				"value": 10,
			},
			{
				"label": "«Щас скину»",
				"value": 5,
			},
			{
				"label": "Эмодзи",
				"value": 4,
			},
		],
		"look": "Фигура поймана в момент шага С камня: одна нога уже в воздухе, корпус впереди опоры. Куртка накинута на одно плечо, за спиной короткие янтарные крылья, больше декоративные, чем рабочие. Камень под ним треснувший, у пятки застывшее облачко пыли.",
		"model": {
			"base": "clay-12",
			"pose": 6,
			"height": 1.73,
			"accent": "#F2B23E",
		},
		"outfitDefault": {
			"head": "none",
			"face": "none",
			"top": "jacket.deep",
			"bottom": "jeans.deep",
			"shoes": "sneakers.clay",
			"hands": "none",
			"back": "wings.amber",
			"pet": "none",
			"env": "studio",
			"pose": "pose.6",
		},
		"links": [
			{
				"to": "shadow",
				"label": "27 ответов",
				"weight": 27,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "16 ответов",
				"weight": 16,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "8 ответов",
				"weight": 8,
				"kind": "reply",
			},
			{
				"to": "izana",
				"label": "2 ответа",
				"weight": 2,
				"kind": "reply",
			},
		],
		"achievements": [
			"Ноль ночных сообщений — абсолютный рекорд здоровья",
			"Самый высокий процент вопросов: 8%",
			"7 дней в зале, страница навсегда",
		],
	},
	{
		"slug": "dot",
		"name": ".",
		"hero": "ТОЧКА",
		"handle": "",
		"title": "Точка. Наблюдатель",
		"tagline": "86 сообщений, два буста",
		"description": "Ник — одна точка, и речь такая же: 68% сообщений короче десяти символов и максимум эмодзи на знак. Появлялся редко, бустил чат дважды и молча уходил.",
		"quotes": [
			"Пару 🥝",
			"На топ 1",
			"Нудавай😈",
			"Я все знаю",
			"Он самый",
		],
		"memes": [
			"точка",
			"нудавай",
			"топ 1",
		],
		"emoji": [
			"😈",
			"🥝",
			"🟢",
			"🛐",
		],
		"stats": {
			"messages": 86,
			"avgLen": 11.4,
			"capsPct": 0.0,
			"nightPct": 10.5,
		},
		"dossier": {
			"spec": "013",
			"firstSeen": "2024-03-28T01:05:34",
			"lastSeen": "2025-05-07T21:17:33",
			"activeDays": 13,
			"peakHours": [
				14,
				23,
				17,
			],
			"reactionsReceived": 36,
			"mediaShared": 8,
		},
		"formula": [
			{
				"label": "Односложность",
				"value": 56,
			},
			{
				"label": "Эмодзи",
				"value": 17,
			},
			{
				"label": "Мемы чата",
				"value": 11,
			},
			{
				"label": "Ночная смена",
				"value": 8,
			},
			{
				"label": "«Щас скину»",
				"value": 8,
			},
		],
		"look": "Самая маленькая фигура зала на самом большом камне — и этот контраст и есть весь образ. Стоит идеально ровно, руки по швам, без единого аксессуара: базовая футболка, босые ноги, киви в опущенной руке. Фон — чистое ничто, контур едва читается.",
		"model": {
			"base": "clay-base",
			"pose": 0,
			"height": 1.7,
			"accent": "#8FA79A",
		},
		"outfitDefault": {
			"head": "none",
			"face": "none",
			"top": "tee.clay",
			"bottom": "jeans.deep",
			"shoes": "barefoot",
			"hands": "kiwi.moss",
			"back": "none",
			"pet": "none",
			"env": "void",
			"pose": "pose.0",
		},
		"links": [
			{
				"to": "shadow",
				"label": "6 ответов",
				"weight": 6,
				"kind": "reply",
			},
			{
				"to": "mango",
				"label": "4 ответа",
				"weight": 4,
				"kind": "reply",
			},
			{
				"to": "ghost",
				"label": "4 ответа",
				"weight": 4,
				"kind": "reply",
			},
			{
				"to": "cabe1y",
				"label": "3 ответа",
				"weight": 3,
				"kind": "reply",
			},
		],
		"achievements": [
			"Самая короткая речь в зале: 68% до 10 символов",
			"Рекорд плотности эмодзи: 22%",
			"2 буста при 86 сообщениях",
		],
	},
]

export const PEOPLE_BY_SLUG: Record<string, Person> = Object.fromEntries(
	PEOPLE.map((p) => [p.slug, p]),
)

export const SLUGS = PEOPLE.map((p) => p.slug)

export function getPerson(slug: string): Person | undefined {
	return PEOPLE_BY_SLUG[slug]
}

export function personIndex(slug: string): number {
	return SLUGS.indexOf(slug)
}

/** Previous / next specimen, wrapping around the hall. */
export function neighbours(slug: string): { prev: Person; next: Person } {
	const i = Math.max(0, personIndex(slug))
	const prev = PEOPLE[(i - 1 + PEOPLE.length) % PEOPLE.length]
	const next = PEOPLE[(i + 1) % PEOPLE.length]
	return { prev, next }
}

/** Deterministic per-day pick so server and client agree. */
export function quoteOfTheDay(date = new Date()): { person: Person; quote: string } {
	const day = Math.floor(date.getTime() / 86400000)
	const person = PEOPLE[day % PEOPLE.length]
	const quote = person.quotes[day % person.quotes.length]
	return { person, quote }
}

export function randomQuote(person: Person, seed?: number): string {
	const i =
		seed === undefined
			? Math.floor(Math.random() * person.quotes.length)
			: Math.abs(Math.floor(seed)) % person.quotes.length
	return person.quotes[i]
}

/** Label used in the hall: anonymous specimens never show a nickname. */
export function displayName(person: Person): string {
	return person.anonymous ? person.hero : person.name
}
