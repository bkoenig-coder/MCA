// Texts of the Steppe Runner game. Keys live under heritagePage.runner.
type Row = [path: string, en: string, de: string, mn: string, tr: string];

const rows: Row[] = [
  ['score', 'Score', 'Punkte', 'Оноо', 'Puan'],
  ['best', 'Best', 'Bestwert', 'Шилдэг', 'En iyi'],
  ['level', 'Level', 'Stufe', 'Түвшин', 'Seviye'],
  ['combo', 'Combo', 'Combo', 'Комбо', 'Kombo'],
  ['shield', 'Shield', 'Schild', 'Бамбай', 'Kalkan'],
  ['title', 'Steppe Runner', 'Steppen-Läufer', 'Талын Гүйгч', 'Bozkır Koşucusu'],
  [
    'startText',
    'Ride across the golden steppe. Collect treasures, jump the obstacles and keep your combo alive.',
    'Reite über die goldene Steppe. Sammle Schätze, springe über Hindernisse und halte deine Combo am Leben.',
    'Алтан тал нутгаар давхи. Эрдэнэ цуглуул, саад бэрхшээлийг үсэрч давж, комбогоо тасалдуулахгүй байгаарай.',
    'Altın bozkırda dörtnala git. Hazineleri topla, engellerin üzerinden atla ve kombonu sürdür.',
  ],
  ['move', 'Move', 'Bewegen', 'Хөдлөх', 'Hareket'],
  ['jump', 'Jump', 'Springen', 'Үсрэх', 'Zıpla'],
  [
    'touchHint',
    'Swipe left or right to change lane, swipe up or tap to jump.',
    'Nach links oder rechts wischen, um die Spur zu wechseln. Nach oben wischen oder tippen zum Springen.',
    'Зам солихын тулд зүүн, баруун тийш шудрана. Үсрэхийн тулд дээш шудрах эсвэл товшино.',
    'Şerit değiştirmek için sola veya sağa kaydır, zıplamak için yukarı kaydır veya dokun.',
  ],
  ['tipCollect', 'Collect golden bows and fiddles', 'Goldene Bögen und Geigen sammeln', 'Алтан нум, хуур цуглуул', 'Altın yay ve kemaneleri topla'],
  ['tipShield', 'The blue shield protects you once', 'Der blaue Schild schützt dich einmal', 'Цэнхэр бамбай нэг удаа хамгаална', 'Mavi kalkan seni bir kez korur'],
  ['start', 'Start the ride', 'Ritt starten', 'Давхиж эхлэх', 'Yolculuğa başla'],
  ['gameOver', 'Game over', 'Spiel vorbei', 'Тоглоом дууслаа', 'Oyun bitti'],
  ['finalScore', 'Final score', 'Endstand', 'Эцсийн оноо', 'Son puan'],
  ['newBest', 'New personal best!', 'Neuer persönlicher Rekord!', 'Шинэ хувийн рекорд!', 'Yeni kişisel rekor!'],
  ['namePlaceholder', 'Enter your name', 'Name eingeben', 'Нэрээ бичнэ үү', 'Adını yaz'],
  ['submit', 'Submit score', 'Punkte speichern', 'Оноогоо хадгалах', 'Puanı kaydet'],
  ['saved', 'Score saved to the Hall of Heroes.', 'Punkte in der Heldenhalle gespeichert.', 'Оноо Баатруудын танхимд хадгалагдлаа.', 'Puan Kahramanlar Salonu’na kaydedildi.'],
  ['tryAgain', 'A brave ride. Try again!', 'Ein mutiger Ritt. Versuche es noch einmal!', 'Зоримог давхилаа. Дахин оролдоорой!', 'Cesur bir yolculuktu. Tekrar dene!'],
  ['challenge', 'Challenge: beat the score of {{score}}!', 'Herausforderung: Übertrifft {{score}} Punkte!', 'Сорилт: {{score}} онооноос илүү авна уу!', 'Meydan okuma: {{score}} puanı geç!'],
  ['beat', 'Magnificent! You beat {{score}}!', 'Großartig! Du hast {{score}} übertroffen!', 'Гайхалтай! Та {{score}} оноог давлаа!', 'Muhteşem! {{score}} puanı geçtin!'],
  ['noBeat', 'So close! The challenge was {{score}}. Try again!', 'Knapp! Die Herausforderung war {{score}}. Versuche es noch einmal!', 'Бага зэрэг дутлаа! Сорилт {{score}} байсан. Дахин оролдоорой!', 'Çok yakın! Hedef {{score}} puandı. Tekrar dene!'],
  ['playAgain', 'Play again', 'Nochmal spielen', 'Дахин тоглох', 'Tekrar oyna'],
  ['share', 'Share your score', 'Punkte teilen', 'Оноогоо түгээх', 'Puanını paylaş'],
  ['chooseCharacter', 'Choose your rider', 'Wähle deinen Reiter', 'Давхигчаа сонгоно уу', 'Binicini seç'],
  ['char.herder', 'Herder', 'Hirte', 'Малчин', 'Çoban'],
  ['char.khan', 'Khan', 'Khan', 'Хаан', 'Han'],
  ['char.warrior', 'Warrior', 'Krieger', 'Дайчин', 'Savaşçı'],
  ['char.queen', 'Queen', 'Königin', 'Хатан', 'Hatun'],
  ['hall', 'Hall of Heroes', 'Heldenhalle', 'Баатруудын танхим', 'Kahramanlar Salonu'],
  ['noHeroes', 'No heroes yet. Be the first!', 'Noch keine Helden. Sei der Erste!', 'Одоогоор баатар байхгүй. Та анхных нь болоорой!', 'Henüz kahraman yok. İlk sen ol!'],
  [
    'shareScore',
    'I scored {{score}} points in the Steppe Runner of the Mongolian Center! Can you beat it?',
    'Ich habe {{score}} Punkte im Steppen-Läufer des Mongolischen Zentrums erreicht! Kannst du mich schlagen?',
    'Би Монголын Төвийн Талын Гүйгч тоглоомд {{score}} оноо авлаа! Та миний оноог давах уу?',
    'Moğol Merkezi’nin Bozkır Koşucusu oyununda {{score}} puan yaptım! Sen geçebilir misin?',
  ],
  [
    'shareInvite',
    'Play the Steppe Runner of the Mongolian Center!',
    'Spiele den Steppen-Läufer des Mongolischen Zentrums!',
    'Монголын Төвийн Талын Гүйгч тоглоомыг тоглоорой!',
    'Moğol Merkezi’nin Bozkır Koşucusu oyununu oyna!',
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
  return { heritagePage: { runner: out } };
}

export default {
  en: build(0),
  de: build(1),
  mn: build(2),
  tr: build(3),
};
