// "Our culture" showcase on the Heritage page. Keys live under heritagePage.showcase.
type Row = [path: string, en: string, de: string, mn: string, tr: string];

const rows: Row[] = [
  ['badge', 'Our culture', 'Unsere Kultur', 'Манай соёл', 'Kültürümüz'],
  ['deel.title', 'The deel', 'Der Deel', 'Дээл', 'Deel'],
  [
    'deel.text',
    'The traditional robe, worn at celebrations and in everyday life. Its colour, cut and sash carry the identity of a family and a region.',
    'Das traditionelle Gewand, getragen bei Festen und im Alltag. Farbe, Schnitt und Gürtel tragen die Identität einer Familie und einer Region.',
    'Баяр ёслол, өдөр тутмын амьдралд өмсдөг уламжлалт хувцас. Өнгө, хэв загвар, бүс нь айл, нутгийн өвөрмөц онцлогийг илтгэдэг.',
    'Bayramlarda ve gündelik yaşamda giyilen geleneksel giysi. Rengi, kesimi ve kuşağı bir ailenin ve bir bölgenin kimliğini taşır.',
  ],
  ['script.title', 'The Mongolian script', 'Die mongolische Schrift', 'Монгол бичиг', 'Moğol yazısı'],
  [
    'script.text',
    'Written from top to bottom in flowing lines, the traditional script is a strong symbol of Mongolian identity.',
    'Von oben nach unten in fließenden Linien geschrieben, ist die traditionelle Schrift ein starkes Symbol mongolischer Identität.',
    'Дээрээс доош урсгал зураасаар бичдэг уламжлалт бичиг нь монгол үндэсний өвөрмөц онцлогийн хүчтэй бэлгэдэл юм.',
    'Yukarıdan aşağıya akıcı çizgilerle yazılan geleneksel yazı, Moğol kimliğinin güçlü bir simgesidir.',
  ],
  ['stage.title', 'Song and stage', 'Lied und Bühne', 'Дуу хөгжим, тайз', 'Şarkı ve sahne'],
  [
    'stage.text',
    'Music, song and dance bring our celebrations to life.',
    'Musik, Gesang und Tanz machen unsere Feste lebendig.',
    'Хөгжим, дуу, бүжиг манай баяр ёслолыг амилуулдаг.',
    'Müzik, şarkı ve dans kutlamalarımıza can verir.',
  ],
];

function build(index: number) {
  const out: Record<string, any> = {};
  for (const row of rows) {
    const path = row[0].split('.');
    let node = out;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]] ??= {};
    node[path[path.length - 1]] = row[index + 1];
  }
  return { heritagePage: { showcase: out } };
}

export default {
  en: build(0),
  de: build(1),
  mn: build(2),
  tr: build(3),
};
