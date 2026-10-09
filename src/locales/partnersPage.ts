// Translations for the "Partners & supporters" page. Keys live under the top-level key "partnersPage".
// Every row lists the same key in en, de, mn and tr.
type Row = [path: string, en: string, de: string, mn: string, tr: string];

const rows: Row[] = [
  ['navLabel', 'Partners & supporters', 'Partner & Unterstützer', 'Түнш ба дэмжигчид', 'Ortaklar ve destekçiler'],
  ['tag', 'Partners & supporters', 'Partner & Unterstützer', 'Түнш ба дэмжигчид', 'Ortaklar ve destekçiler'],
  ['title', 'Partner with ', 'Werden Sie Partner ', 'Хамтдаа ', 'Birlikte çalışalım: '],
  ['titleItalic', 'the Mongolian Center', 'des Mongolischen Zentrums', 'Монголын Төвтэй түншилье', 'Moğol Merkezi'],
  [
    'intro',
    'We are a non-profit association in Vienna that brings Mongolian culture and community to life and builds bridges between Austria and Mongolia. Funders, institutions and companies help us do more of it.',
    'Wir sind ein gemeinnütziger Verein in Wien, der mongolische Kultur und Gemeinschaft lebendig macht und Brücken zwischen Österreich und der Mongolei baut. Förderstellen, Institutionen und Unternehmen helfen uns, mehr davon zu bewirken.',
    'Бид Вена хотод монгол соёл, нийгэмлэгийг амьд байлгаж, Австри, Монгол хоёрын хооронд гүүр барьдаг ашгийн бус нийгэмлэг. Санхүүжүүлэгчид, байгууллага, компаниуд бидэнд илүү их зүйл хийхэд тусалдаг.',
    'Viyana’da Moğol kültürünü ve topluluğunu yaşatan, Avusturya ile Moğolistan arasında köprüler kuran kâr amacı gütmeyen bir derneğiz. Fon sağlayıcılar, kurumlar ve şirketler daha fazlasını yapmamıza yardımcı oluyor.',
  ],

  ['do.title', 'What we do', 'Was wir tun', 'Бидний үйл ажиллагаа', 'Ne yapıyoruz'],
  ['do.culture.title', 'Culture & heritage', 'Kultur & Erbe', 'Соёл ба өв', 'Kültür ve miras'],
  [
    'do.culture.text',
    'Events and celebrations that keep traditions alive: the deel, the horsehead fiddle, the Mongolian script and the festivals of the year.',
    'Veranstaltungen und Feste, die Traditionen lebendig halten: der Deel, die Pferdekopfgeige, die mongolische Schrift und die Feste im Jahreslauf.',
    'Уламжлалыг амьд байлгах арга хэмжээ, баяр ёслол: дээл, морин хуур, монгол бичиг, жилийн томоохон баяр наадам.',
    'Gelenekleri yaşatan etkinlikler ve kutlamalar: deel, atbaşı kemane, Moğol yazısı ve yılın bayramları.',
  ],
  ['do.community.title', 'Community & young people', 'Gemeinschaft & junge Menschen', 'Нийгэмлэг ба залуучууд', 'Topluluk ve gençler'],
  [
    'do.community.text',
    'A home for Mongolians in Austria: meetings, mentoring and practical help for students and newcomers.',
    'Ein Zuhause für Mongolinnen und Mongolen in Österreich: Treffen, Mentoring und praktische Hilfe für Studierende und Neuankömmlinge.',
    'Австри дахь монголчуудын гэр: уулзалт, зөвлөх дэмжлэг, оюутан болон шинээр ирэгчдэд практик тусламж.',
    'Avusturya’daki Moğollar için bir yuva: buluşmalar, mentorluk ve öğrencilere ile yeni gelenlere pratik destek.',
  ],
  ['do.exchange.title', 'Austria–Mongolia exchange', 'Austausch Österreich–Mongolei', 'Австри–Монголын солилцоо', 'Avusturya–Moğolistan değişimi'],
  [
    'do.exchange.text',
    'Bridges between people, organisations and businesses in Vienna and Ulaanbaatar.',
    'Brücken zwischen Menschen, Organisationen und Unternehmen in Wien und Ulaanbaatar.',
    'Вена, Улаанбаатар хоёрын хүмүүс, байгууллага, бизнесийн хооронд гүүр тавина.',
    'Viyana ile Ulan Batur’daki insanlar, kuruluşlar ve işletmeler arasında köprüler.',
  ],

  ['ways.title', 'Ways to partner', 'Möglichkeiten der Zusammenarbeit', 'Хамтрах боломжууд', 'İş birliği yolları'],
  ['ways.funding.title', 'Project funding', 'Projektförderung', 'Төслийн санхүүжилт', 'Proje fonu'],
  [
    'ways.funding.text',
    'Public and private funds for concrete projects: festivals, workshops, exhibitions and culture days.',
    'Öffentliche und private Fördermittel für konkrete Projekte: Feste, Workshops, Ausstellungen und Kulturtage.',
    'Тодорхой төслүүдэд төрийн болон хувийн санхүүжилт: баяр, сургалт, үзэсгэлэн, соёлын өдрүүд.',
    'Somut projeler için kamu ve özel fonlar: festivaller, atölyeler, sergiler ve kültür günleri.',
  ],
  ['ways.sponsor.title', 'Sponsorship', 'Sponsoring', 'Ивээн тэтгэх', 'Sponsorluk'],
  [
    'ways.sponsor.text',
    'Companies and foundations that back an event or programme and are named as partners.',
    'Unternehmen und Stiftungen, die eine Veranstaltung oder ein Programm unterstützen und als Partner genannt werden.',
    'Арга хэмжээ, хөтөлбөрийг дэмжиж, түншээр нэрлэгдэх компани, сангууд.',
    'Bir etkinliğe veya programa destek veren ve ortak olarak anılan şirketler ve vakıflar.',
  ],
  ['ways.inkind.title', 'In-kind support', 'Sachleistungen', 'Эд зүйлийн дэмжлэг', 'Ayni destek'],
  [
    'ways.inkind.text',
    'Rooms, equipment, printing, catering, expertise and volunteer time.',
    'Räume, Ausstattung, Druck, Catering, Fachwissen und ehrenamtliche Zeit.',
    'Танхим, тоног төхөөрөмж, хэвлэл, хоол, мэдлэг туршлага, сайн дурын цаг.',
    'Mekân, ekipman, baskı, ikram, uzmanlık ve gönüllü zaman.',
  ],
  ['ways.partner.title', 'Institutional partnership', 'Institutionelle Partnerschaft', 'Байгууллагын түншлэл', 'Kurumsal ortaklık'],
  [
    'ways.partner.text',
    'Embassies, schools, museums and associations that want to create projects together.',
    'Botschaften, Schulen, Museen und Vereine, die gemeinsam Projekte gestalten möchten.',
    'Элчин сайдын яам, сургууль, музей, нийгэмлэгүүд хамтдаа төсөл хэрэгжүүлэх.',
    'Birlikte proje geliştirmek isteyen büyükelçilikler, okullar, müzeler ve dernekler.',
  ],

  ['offer.title', 'What partners receive', 'Was Partner erhalten', 'Түншүүд юу авах вэ', 'Ortakların kazandıkları'],
  [
    'offer.1',
    'Named as a partner on our website, at events and in our materials',
    'Nennung als Partner auf unserer Website, bei Veranstaltungen und in unseren Materialien',
    'Манай вэбсайт, арга хэмжээ, материалд түншээр нэрлэгдэнэ',
    'Web sitemizde, etkinliklerimizde ve materyallerimizde ortak olarak anılma',
  ],
  [
    'offer.2',
    'A short report on what the support achieved',
    'Ein kurzer Bericht darüber, was die Unterstützung bewirkt hat',
    'Дэмжлэгээр юу бүтсэн тухай товч тайлан',
    'Desteğin neleri başardığına dair kısa bir rapor',
  ],
  [
    'offer.3',
    'Clear, transparent use of funds by a registered non-profit association',
    'Klare, transparente Mittelverwendung durch einen eingetragenen gemeinnützigen Verein',
    'Бүртгэлтэй ашгийн бус нийгэмлэгийн ил тод, тодорхой хөрөнгийн зарцуулалт',
    'Kayıtlı, kâr amacı gütmeyen bir dernek tarafından şeffaf ve açık fon kullanımı',
  ],
  [
    'offer.4',
    'Photos and video from the events you support',
    'Fotos und Videos von den Veranstaltungen, die Sie unterstützen',
    'Таны дэмжсэн арга хэмжээний зураг, бичлэг',
    'Desteklediğiniz etkinliklerden fotoğraf ve video',
  ],

  ['cta.title', 'Let’s talk', 'Sprechen wir miteinander', 'Ярилцъя', 'Konuşalım'],
  [
    'cta.text',
    'Tell us about your organisation or your idea. We answer personally.',
    'Erzählen Sie uns von Ihrer Organisation oder Ihrer Idee. Wir antworten persönlich.',
    'Өөрийн байгууллага эсвэл санаагаа бидэнд хэлээрэй. Бид биечлэн хариулна.',
    'Kuruluşunuzu veya fikrinizi bize anlatın. Size bizzat yanıt veririz.',
  ],
  ['cta.contact', 'Contact us', 'Kontakt aufnehmen', 'Холбоо барих', 'Bize ulaşın'],
  ['cta.donate', 'Give', 'Spenden', 'Хандив өгөх', 'Bağış yap'],
  ['facts', 'Registered non-profit association (Verein) · ZVR 1673049268 · Schöpfleuthergasse 25, 1210 Wien', 'Eingetragener gemeinnütziger Verein · ZVR-Zahl 1673049268 · Schöpfleuthergasse 25, 1210 Wien', 'Бүртгэлтэй ашгийн бус нийгэмлэг (Verein) · ZVR 1673049268 · Schöpfleuthergasse 25, 1210 Wien', 'Kayıtlı, kâr amacı gütmeyen dernek (Verein) · ZVR 1673049268 · Schöpfleuthergasse 25, 1210 Wien'],
];

function build(index: number) {
  const out: Record<string, any> = {};
  for (const row of rows) {
    const path = row[0].split('.');
    let node = out;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]] ??= {};
    node[path[path.length - 1]] = row[index + 1];
  }
  return { partnersPage: out };
}

export default {
  en: build(0),
  de: build(1),
  mn: build(2),
  tr: build(3),
};
