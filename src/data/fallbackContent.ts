export interface FallbackPost {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  titleMn?: string;
  titleDe?: string;
  content: string;
  contentEn?: string;
  contentMn?: string;
  contentDe?: string;
  imageUrl: string;
  galleryImages?: string[];
  authorId?: string;
  createdAt: any;
  category?: string;
  tags?: string[];
  featured?: boolean;
}

export interface FallbackGalleryItem {
  id: string;
  title: string;
  titleEn?: string;
  titleMn?: string;
  titleDe?: string;
  artist: string;
  artistEn?: string;
  artistMn?: string;
  artistDe?: string;
  year: string;
  description: string;
  descriptionEn?: string;
  descriptionMn?: string;
  descriptionDe?: string;
  imageUrl: string;
  galleryImages?: string[];
  category: string;
  createdAt: any;
}

export interface FallbackEvent {
  id: string;
  title: string;
  titleEn?: string;
  titleMn?: string;
  titleDe?: string;
  description: string;
  descriptionEn?: string;
  descriptionMn?: string;
  descriptionDe?: string;
  price: number;
  capacity?: number;
  date: string;
  time?: string;
  location: string;
  locationEn?: string;
  locationMn?: string;
  locationDe?: string;
  imageUrl: string;
  galleryImages?: string[];
  category?: string;
  whatsIncluded?: string[];
  registeredCount?: number;
  createdAt: any;
}

// Helper timestamp mock that behaves like Firestore Timestamp
const createMockTimestamp = (dateString: string) => ({
  toDate: () => new Date(dateString),
  seconds: Math.floor(new Date(dateString).getTime() / 1000),
  nanoseconds: 0,
});

export const DEFAULT_POSTS: FallbackPost[] = [
  {
    id: "mca-vienna-cultural-gala-2026",
    slug: "mca-vienna-cultural-gala-2026",
    title: "Austrian-Mongolian Cultural Forum & Spring Gala in Vienna",
    titleEn: "Austrian-Mongolian Cultural Forum & Spring Gala in Vienna",
    titleMn: "Вена хотноо зохион байгуулагдсан Австри-Монголын соёлын форум ба Хаврын хүлээн авалт",
    titleDe: "Österreichisch-Mongolisches Kulturforum und Frühlingsgala in Wien",
    content: `The Mongolian Center Austria (MCA) proudly convened high-level diplomats, academic scholars, and diaspora leaders at the historic Palais Palffy in Vienna for the annual Austrian-Mongolian Cultural & Economic Forum.

The summit celebrated six decades of diplomatic harmony and cultural exchange between Austria and Mongolia, spotlighting initiatives in nomadic arts, educational partnerships with Austrian universities, and bilateral trade facilitation.

Keynote addresses were delivered by cultural attaches and Mongolian community leaders, followed by a classical and traditional Morin Khuur ensemble performance that mesmerized guests. Attendees explored collaborative ventures in sustainable green tourism, cultural preservation, and youth exchange programs between Ulaanbaatar and Vienna.`,
    contentEn: `The Mongolian Center Austria (MCA) proudly convened high-level diplomats, academic scholars, and diaspora leaders at the historic Palais Palffy in Vienna for the annual Austrian-Mongolian Cultural & Economic Forum.

The summit celebrated six decades of diplomatic harmony and cultural exchange between Austria and Mongolia, spotlighting initiatives in nomadic arts, educational partnerships with Austrian universities, and bilateral trade facilitation.

Keynote addresses were delivered by cultural attaches and Mongolian community leaders, followed by a classical and traditional Morin Khuur ensemble performance that mesmerized guests. Attendees explored collaborative ventures in sustainable green tourism, cultural preservation, and youth exchange programs between Ulaanbaatar and Vienna.`,
    contentMn: `Австри дахь Монгол Төв (MCA) нь Вена хотын түүхт Палайс Палффи ордонд жил тутмын Австри-Монголын соёл, эдийн засгийн чуулга уулзалт, Хаврын ёслолын арга хэмжээг дипломатууд, эрдэмтэн судлаачид болон монгол иргэдийн төлөөллийг оролцуулан амжилттай зохион байгууллаа.

Энэхүү арга хэмжээ нь хоёр орны дипломат харилцаа, соёлын хамтын ажиллагааг бэхжүүлэх, Австрийн их дээд сургуулиудтай хамтарсан оюутан солилцооны хөтөлбөр, нүүдэлчдийн соёлын өвийг сурталчлах зорилготой байв.

Тус ёслолын үеэр Морин хуурын чуулгын уран бүтээлчид болон уламжлалт хөөмийн үзүүлбэр эгшиглэж, ногоон аялал жуулчлал, хоёр талын худалдаа, соёлын хамтын ажиллагааны шинэ төслүүдийг танилцууллаа.`,
    contentDe: `Das Mongolian Center Austria (MCA) versammelte im historischen Palais Palffy in Wien hochrangige Diplomaten, Akademiker und Vertreter der mongolischen Gemeinschaft zum jährlichen Österreichisch-Mongolischen Kultur- und Wirtschaftsforum.

Die Tagung würdigte die bilateralen Beziehungen und den lebendigen kulturellen Austausch zwischen Österreich und der Mongolei mit Fokus auf nomadische Kunst, akademische Kooperationen mit österreichischen Universitäten und Wirtschaftsförderung.

Nach inspirierenden Festreden begeisterte ein Morin-Khuur- und Kehlgesangsensemble die Gäste. Im Mittelpunkt standen zukünftige Kooperationsprojekte in den Bereichen nachhaltiger Kulturtourismus und Jugendaustausch.`,
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop"
    ],
    createdAt: createMockTimestamp("2026-05-15T10:00:00Z"),
    category: "Diplomacy & Culture",
    featured: true
  },
  {
    id: "nomadic-heritage-exhibition-vienna",
    slug: "nomadic-heritage-exhibition-vienna",
    title: "Steppe Horizons: Masterpieces of Mongolian Nomadic Craft in Central Europe",
    titleEn: "Steppe Horizons: Masterpieces of Mongolian Nomadic Craft in Central Europe",
    titleMn: "Талын өнгө: Төв Европ дахь Монголын нүүдэлчдийн гар урлал, уран зураг",
    titleDe: "Steppenhorizonte: Meisterwerke mongolischer Nomadenkunst in Mitteleuropa",
    content: `An exquisite curation of handcrafted silver bowls, embroidered silk thangkas, and leather saddle crafts made its grand debut in Vienna's cultural district.

Curated in collaboration with prominent Mongolian artisan guilds, 'Steppe Horizons' showcases the deep ecological harmony embedded in centuries-old nomadic lifestyles. Visitors had the rare opportunity to observe live demonstrations of traditional felt-making and wood-carving techniques.

The exhibition continues throughout the season, inviting art historians, collectors, and community members across Austria to engage with ancient Eurasian artisanal traditions.`,
    contentEn: `An exquisite curation of handcrafted silver bowls, embroidered silk thangkas, and leather saddle crafts made its grand debut in Vienna's cultural district.

Curated in collaboration with prominent Mongolian artisan guilds, 'Steppe Horizons' showcases the deep ecological harmony embedded in centuries-old nomadic lifestyles. Visitors had the rare opportunity to observe live demonstrations of traditional felt-making and wood-carving techniques.

The exhibition continues throughout the season, inviting art historians, collectors, and community members across Austria to engage with ancient Eurasian artisanal traditions.`,
    contentMn: `Монголын нүүдэлчин ард түмний уламжлалт мөнгөн аяга, торгон зээгт наамал, ширэн эдлэл, модон сийлбэрийн шилдэг бүтээлүүдээс бүрдсэн 'Талын өнгө' үзэсгэлэн Вена хотноо нээгдлээ.

Монголын урчуудын эвлэлтэй хамтран зохион байгуулсан энэхүү үзэсгэлэнд байгаль дэлхийтэйгээ зохицон амьдрах нүүдэлчдийн гүн ухаан, ур ухааныг илтгэсэн бүтээлүүд тавигдсан бөгөөд эсгий урлал, сийлбэрийн мастер ангиуд амжилттай явагдав.

Энэхүү үзэсгэлэн нь Австри даяар урлаг сонирхогч, судлаачдын анхаарлыг ихээхэн татаж байна.`,
    contentDe: `Eine erlesene Kollektion handgefertigter Silberschalen, Seidenthangkas und Lederkunstarbeiten feierte im Wiener Kulturbezirk ihre feierliche Eröffnung.

In Kooperation mit namhaften mongolischen Kunsthandwerkern zeigt 'Steppenhorizonte' die tiefe ökologische Harmonie der jahrhundertealten nomadischen Lebensweise. Besucher erlebten Live-Vorführungen traditioneller Filz- und Schnitzkunst.

Die Ausstellung lädt Kunstliebhaber und Wissenschaftler in ganz Österreich ein, das reiche eurasische Kulturerbe hautnah zu erleben.`,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1600&auto=format&fit=crop"
    ],
    createdAt: createMockTimestamp("2026-04-28T14:30:00Z"),
    category: "Heritage",
    featured: false
  },
  {
    id: "academic-exchange-scholarship-vienna-ulaanbaatar",
    slug: "academic-exchange-scholarship-vienna-ulaanbaatar",
    title: "MCA Announces 2026 Austrian-Mongolian Youth & Academic Fellowship",
    titleEn: "MCA Announces 2026 Austrian-Mongolian Youth & Academic Fellowship",
    titleMn: "MCA 2026 оны Австри-Монголын Залуучууд ба Эрдэм шинжилгээний тэтгэлэг зарлалаа",
    titleDe: "MCA kündigt das Österreichisch-Mongolische Akademische Stipendium 2026 an",
    content: `In a landmark initiative to empower the next generation of researchers and cultural leaders, the Mongolian Center Austria has launched its flagship 2026 Fellowship Program.

Selected candidates will engage in bilateral research covering renewable energy, cross-cultural linguistics, and digital archive preservation between universities in Vienna, Graz, and Ulaanbaatar.

Applications are now open for enrolled undergraduate and postgraduate students. Fellows will receive mentorship, stipends, and networking opportunities with international institutions.`,
    contentEn: `In a landmark initiative to empower the next generation of researchers and cultural leaders, the Mongolian Center Austria has launched its flagship 2026 Fellowship Program.

Selected candidates will engage in bilateral research covering renewable energy, cross-cultural linguistics, and digital archive preservation between universities in Vienna, Graz, and Ulaanbaatar.

Applications are now open for enrolled undergraduate and postgraduate students. Fellows will receive mentorship, stipends, and networking opportunities with international institutions.`,
    contentMn: `Монгол Төв Австри (MCA) нь хоёр орны ирээдүйн залуу судлаач, манлайлагчдыг дэмжих зорилгоор 2026 оны эрдэм шинжилгээний тэтгэлэгт хөтөлбөрөө албан ёсоор эхлүүллээ.

Тэтгэлэгт шалгарсан оюутнууд Вена, Грац болон Улаанбаатарын их дээд сургуулиудын хооронд сэргээгдэх эрчим хүч, хэл шинжлэл, соёлын дижитал өв хамгааллын чиглэлээр хамтарсан судалгаа хийх боломжтой болно.

Бакалавр, магистр, докторын түвшний оюутнууд тэтгэлэгт хөтөлбөрт өргөдлөө илгээх боломжтой.`,
    contentDe: `Das Mongolian Center Austria hat sein wegweisendes Fellowship-Programm 2026 gestartet, um die nächste Generation von Forschern und Kulturvermittlern zu fördern.

Ausgewählte Stipendiaten forschen zu Themen wie erneuerbare Energien, Sprachwissenschaften und digitaler Denkmalpflege an Universitäten in Wien, Graz und Ulaanbaatar.

Bewerbungen für Studierende aller Fachrichtungen sind ab sofort möglich. Die Stipendiaten erhalten fachliche Mentorschaft und internationale Vernetzungsmöglichkeiten.`,
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=1600&auto=format&fit=crop"
    ],
    createdAt: createMockTimestamp("2026-03-20T09:00:00Z"),
    category: "Education",
    featured: false
  },
  {
    id: "tsagaan-sar-celebration-austria",
    slug: "tsagaan-sar-celebration-austria",
    title: "Tsagaan Sar in Austria: Welcoming the Year of the Fire Horse",
    titleEn: "Tsagaan Sar in Austria: Welcoming the Year of the Fire Horse",
    titleMn: "Цагаан сар Австрид: Гал морин жилийг угтан золгох баяр",
    titleDe: "Tsagaan Sar in Österreich: Neujahrsfeierlichkeiten der mongolischen Gemeinschaft",
    content: `Hundreds of community members gathered in Vienna for the annual Tsagaan Sar (Lunar New Year) celebration, observing traditional Zolgolt greetings, savoring festive buuz dumplings, and honoring eldest community members.

The event featured a youth wrestling demonstration, ankle-bone shooting (shagai), and a heartfelt address reaffirming the unity and enduring spirit of Mongolians living in Austria and Central Europe.`,
    contentEn: `Hundreds of community members gathered in Vienna for the annual Tsagaan Sar (Lunar New Year) celebration, observing traditional Zolgolt greetings, savoring festive buuz dumplings, and honoring eldest community members.

The event featured a youth wrestling demonstration, ankle-bone shooting (shagai), and a heartfelt address reaffirming the unity and enduring spirit of Mongolians living in Austria and Central Europe.`,
    contentMn: `Вена хотноо Австри болон хөрш зэргэлдээ орнуудад ажиллаж, амьдарч буй олон зуун монголчууд хуран цугларч, уламжлалт Цагаан сарын баяраа ёслол төгөлдөр тэмдэглэн өнгөрүүллээ.

Баярын хүрээнд ахмад настнууддаа хүндэтгэл үзүүлэх золголт, хүүхэд залуучуудын үндэсний бөхийн барилдаан, шагайн наадгай болон урлагийн тоглолтууд зохион байгуулагдлаа.`,
    contentDe: `Zahlreiche Mitglieder der mongolischen Diaspora versammelten sich in Wien zum traditionellen Tsagaan Sar (mongolisches Neujahrsfest).

Mit traditionellen Zolgolt-Segnungen, köstlichen Buuz-Spezialitäten, Ringkämpfen und traditionellen Knöchelspielen (Shagai) wurde das neue Jahr im Zeichen von Gemeinschaft und Zusammenhalt feierlich begrüßt.`,
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1600&auto=format&fit=crop"
    ],
    createdAt: createMockTimestamp("2026-02-18T18:00:00Z"),
    category: "Community",
    featured: false
  }
];

export const DEFAULT_GALLERY: FallbackGalleryItem[] = [
  {
    id: "eternal-blue-sky-altay",
    title: "Eternal Blue Sky over the Altay Peaks",
    titleEn: "Eternal Blue Sky over the Altay Peaks",
    titleMn: "Мөнх хөх тэнгэр ба Алтайн сүрлэг оргилууд",
    titleDe: "Ewiger blauer Himmel über den Altai-Gipfeln",
    artist: "Bat-Erdene Purev",
    artistEn: "Bat-Erdene Purev",
    artistMn: "Пүрэвийн Бат-Эрдэнэ",
    artistDe: "Bat-Erdene Purev",
    year: "2025",
    description: "Oil on canvas capturing the dramatic transition of golden twilight over the snow-dusted Altay Mountains in Western Mongolia.",
    descriptionEn: "Oil on canvas capturing the dramatic transition of golden twilight over the snow-dusted Altay Mountains in Western Mongolia.",
    descriptionMn: "Баруун Монголын Алтай нурууны мөнх цаст оргилууд дээрх нар жаргах агшны алтан туяа, байгалийн сүр хүчийг тосон будгаар дүрсэлсэн бүтээл.",
    descriptionDe: "Öl auf Leinwand, das den dramatischen Übergang des goldenen Abendlichts über den schneebedeckten Altai-Gipfeln einfängt.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1536611004753-2ceaea518206?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop"
    ],
    category: "Traditional",
    createdAt: createMockTimestamp("2026-04-10T12:00:00Z")
  },
  {
    id: "morin-khuur-cosmic-resonance",
    title: "Cosmic Resonance of the Horsehead Fiddle",
    titleEn: "Cosmic Resonance of the Horsehead Fiddle",
    titleMn: "Морин хуурын сансрын эгшиглэн",
    titleDe: "Kosmische Resonanz der Morin Khuur",
    artist: "Sonom Tseren",
    artistEn: "Sonom Tseren",
    artistMn: "Цэрэнгийн Соном",
    artistDe: "Sonom Tseren",
    year: "2026",
    description: "Contemporary mixed media composition fusing Mongolian cursive calligraphy (Bichig) with deep lapis lazuli mineral pigments.",
    descriptionEn: "Contemporary mixed media composition fusing Mongolian cursive calligraphy (Bichig) with deep lapis lazuli mineral pigments.",
    descriptionMn: "Монгол уран бичлэг болон лазурит байгалийн эрдэс будгийг хослуулан морин хуурын эгшиг, аялгууг орчин үеийн дүрслэх урлагийн хэлбэрээр илэрхийлсэн бүтээл.",
    descriptionDe: "Zeitgenössische Mischtechnik, die mongolische Kalligraphie mit tiefblauen Lapislazuli-Mineralpigmenten verschmilzt.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop"
    ],
    category: "Contemporary",
    createdAt: createMockTimestamp("2026-03-25T11:00:00Z")
  },
  {
    id: "danube-meets-tuul-river",
    title: "Bilateral Harmony: Where the Danube Meets the Steppe",
    titleEn: "Bilateral Harmony: Where the Danube Meets the Steppe",
    titleMn: "Хоёр их мөрний уулзвар: Дунай ба Туул гол",
    titleDe: "Bilaterale Harmonie: Wo die Donau auf die Steppe trifft",
    artist: "Elena Weber & Munkhbat G.",
    artistEn: "Elena Weber & Munkhbat G.",
    artistMn: "Елена Вебер ба Г.Мөнхбат",
    artistDe: "Elena Weber & Munkhbat G.",
    year: "2025",
    description: "Collaborative installation exploring the poetic connection between Central European waterways and Central Asian nomadic grasslands.",
    descriptionEn: "Collaborative installation exploring the poetic connection between Central European waterways and Central Asian nomadic grasslands.",
    descriptionMn: "Австри болон Монголын уран бүтээлчдийн хамтарсан бүтээл: Дунай мөрний долгион болон Монголын өргөн уудам тал нутгийн хослолыг харуулсан инстолляци.",
    descriptionDe: "Gemeinschaftsinstallation über die poetische Verbindung zwischen mitteleuropäischen Flüssen und zentralasiatischen Steppen.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop"
    ],
    category: "Cross-Cultural",
    createdAt: createMockTimestamp("2026-02-14T09:30:00Z")
  },
  {
    id: "golden-eagle-huntress-bayan-olgii",
    title: "Guardians of the Wind: Eagle Hunters of the Western Steppe",
    titleEn: "Guardians of the Wind: Eagle Hunters of the Western Steppe",
    titleMn: "Салхины эзэд: Баян-Өлгийн бүргэдчин",
    titleDe: "Hüter des Windes: Adlerjäger der westlichen Steppe",
    artist: "Chinzorig Davaadorj",
    artistEn: "Chinzorig Davaadorj",
    artistMn: "Даваадоржийн Чинзориг",
    artistDe: "Chinzorig Davaadorj",
    year: "2026",
    description: "High-contrast documentary fine-art portrait capturing the bond between an eagle hunter and her golden eagle during winter migration.",
    descriptionEn: "High-contrast documentary fine-art portrait capturing the bond between an eagle hunter and her golden eagle during winter migration.",
    descriptionMn: "Өвлийн нүүдлийн үеэр бүргэдчин болон түүний анч шувууны хоорондох нандин холбоог гэрэл зургийн өндөр ур чадвараар буулгасан баримтат урлагийн хөрөг.",
    descriptionDe: "Ausdrucksstarkes Fotokunstporträt über die tiefe Verbundenheit zwischen Adlerjägern und ihren Steinadlern.",
    imageUrl: "https://images.unsplash.com/photo-1536611004753-2ceaea518206?q=80&w=1600&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
    ],
    category: "Traditional",
    createdAt: createMockTimestamp("2026-01-20T16:00:00Z")
  }
];

export const DEFAULT_EVENTS: FallbackEvent[] = [
  {
    id: "vienna-mongolian-naadam-festival-2026",
    title: "Vienna Mongolian Naadam Festival 2026",
    titleEn: "Vienna Mongolian Naadam Festival 2026",
    titleMn: "Вена хотын Монгол Наадам 2026",
    titleDe: "Mongolisches Naadam-Fest Wien 2026",
    description: "The premier summer gathering of the Mongolian community in Austria. Featuring national wrestling, archery, traditional cuisine, and folk concerts under the open Vienna sky.",
    descriptionEn: "The premier summer gathering of the Mongolian community in Austria. Featuring national wrestling, archery, traditional cuisine, and folk concerts under the open Vienna sky.",
    descriptionMn: "Австри дахь Монголчуудын зуны их баяр наадам. Үндэсний бөх, сурын харваа, ардын урлагийн тоглолт, үндэсний зоог, олон нийтийн цэнгүүн.",
    descriptionDe: "Das große Sommerfest der mongolischen Gemeinschaft in Österreich mit traditionellem Ringen, Bogenschießen, Musik und Kulinarik.",
    price: 0,
    capacity: 500,
    date: "2026-07-11",
    time: "10:00 - 19:00",
    location: "Donaupark, 1220 Wien, Austria",
    locationEn: "Donaupark, 1220 Vienna, Austria",
    locationMn: "Донаупарк, 1220 Вена, Австри",
    locationDe: "Donaupark, 1220 Wien, Österreich",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1600&auto=format&fit=crop",
    category: "Cultural Festival",
    whatsIncluded: ["Festival Admission", "Cultural Performances", "Traditional Archery Viewing", "Children Games"],
    registeredCount: 142,
    createdAt: createMockTimestamp("2026-05-01T08:00:00Z")
  },
  {
    id: "mongolian-calligraphy-masterclass-vienna",
    title: "Mongolian Brush Calligraphy & Nomadic Script Masterclass",
    titleEn: "Mongolian Brush Calligraphy & Nomadic Script Masterclass",
    titleMn: "Монгол уран бичлэг, бичиг соёлын мастер анги",
    titleDe: "Mongolische Kalligraphie & Schriftkunst Masterclass",
    description: "Learn the graceful vertical strokes of the ancient Mongolian script with master calligraphers. All materials (bamboo brushes, rice paper, ink) provided.",
    descriptionEn: "Learn the graceful vertical strokes of the ancient Mongolian script with master calligraphers. All materials (bamboo brushes, rice paper, ink) provided.",
    descriptionMn: "Уран бичлэгийн мастер багш нараар уламжлалт босоо монгол бичгийн зурлага, бийр бэхний урлагийг заалгах тусгай сургалт.",
    descriptionDe: "Erlernen Sie die vertikalen Pinselstriche der mongolischen Schrift unter Anleitung von Meisterkalligraphen. Alle Materialien inklusive.",
    price: 3500,
    capacity: 25,
    date: "2026-06-20",
    time: "14:00 - 17:30",
    location: "MCA Cultural Studio, 1010 Wien, Austria",
    locationEn: "MCA Cultural Studio, 1010 Vienna, Austria",
    locationMn: "MCA Соёлын танхим, 1010 Вена, Австри",
    locationDe: "MCA Kulturstudio, 1010 Wien, Österreich",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
    category: "Workshop",
    whatsIncluded: ["Traditional Bamboo Brush", "Custom Ink & Handmade Paper", "Personalized Name Calligraphy Scroll", "Tea & Refreshments"],
    registeredCount: 18,
    createdAt: createMockTimestamp("2026-04-15T10:00:00Z")
  }
];

export function getFallbackPost(slugOrId: string): FallbackPost | undefined {
  return DEFAULT_POSTS.find(p => p.slug === slugOrId || p.id === slugOrId);
}

export function getFallbackGalleryItem(id: string): FallbackGalleryItem | undefined {
  return DEFAULT_GALLERY.find(g => g.id === id);
}

export function getFallbackEvent(id: string): FallbackEvent | undefined {
  return DEFAULT_EVENTS.find(e => e.id === id);
}
