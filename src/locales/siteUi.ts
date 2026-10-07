// Translations for siteUi (navigation, footer, home, about, assistant, SEO and other shared UI text).
// Keys live under the top-level key "siteUi". Every row lists the same key in en, de, mn and tr,
// so the four languages always share one key structure.
type Row = [path: string, en: string, de: string, mn: string, tr: string];

const rows: Row[] = [
  // Organisation
  ['org.name', 'Mongolian Center in Austria', 'Mongolisches Zentrum in Österreich', 'Австри дахь Монголын Төв', 'Avusturya Moğol Merkezi'],
  ['org.legalLine', 'Registered non-profit association (Verein)', 'Eingetragener gemeinnütziger Verein', 'Бүртгэлтэй ашгийн бус нийгэмлэг (Verein)', 'Kayıtlı, kâr amacı gütmeyen dernek (Verein)'],

  // Navbar
  ['nav.bannerLabel', 'Austrian–Mongolian Cultural & Business Center', 'Österreichisch-Mongolisches Kultur- & Geschäftszentrum', 'Австри-Монголын соёл, бизнесийн төв', 'Avusturya-Moğol Kültürel ve Ticari Merkezi'],
  ['nav.bannerPrefix', 'Austrian–Mongolian', 'Österreichisch-Mongolisches', 'Австри-Монголын', 'Avusturya-Moğol'],
  ['nav.bannerTitle', 'Cultural & Business Center', 'Kultur- & Geschäftszentrum', 'Соёл, бизнесийн төв', 'Kültürel ve Ticari Merkez'],
  ['nav.selectLanguage', 'Select language', 'Sprache wählen', 'Хэл сонгох', 'Dil seçin'],
  ['nav.switchLanguage', 'Switch language', 'Sprache wechseln', 'Хэл солих', 'Dili değiştir'],
  ['nav.changeLanguage', 'Change language', 'Sprache ändern', 'Хэл солих', 'Dili değiştir'],
  ['nav.logOut', 'Log out', 'Abmelden', 'Гарах', 'Çıkış yap'],
  ['nav.loginFailed', 'Sign-in failed. Please try again or open the site in a new tab.', 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut oder öffnen Sie die Seite in einem neuen Tab.', 'Нэвтэрч чадсангүй. Дахин оролдох эсвэл сайтыг шинэ табаар нээнэ үү.', 'Giriş yapılamadı. Lütfen tekrar deneyin veya siteyi yeni sekmede açın.'],
  ['nav.memberPortalAria', 'Sign in to the member portal', 'Im Mitgliederbereich anmelden', 'Гишүүдийн порталд нэвтрэх', 'Üye portalına giriş yap'],
  ['nav.memberPortal', 'Member Portal', 'Mitgliederbereich', 'Гишүүдийн портал', 'Üye Portalı'],
  ['nav.memberAccess', 'Member Access', 'Mitgliederzugang', 'Гишүүний нэвтрэлт', 'Üye Girişi'],
  ['nav.homeAria', 'Mongolian Center in Austria – Home', 'Mongolisches Zentrum in Österreich – Startseite', 'Австри дахь Монголын Төв – Нүүр', 'Avusturya Moğol Merkezi – Ana Sayfa'],
  ['nav.openMenu', 'Open menu', 'Menü öffnen', 'Цэс нээх', 'Menüyü aç'],
  ['nav.closeMenu', 'Close menu', 'Menü schließen', 'Цэсийг хаах', 'Menüyü kapat'],
  ['nav.menu', 'Menu', 'Menü', 'Цэс', 'Menü'],
  ['nav.close', 'Close', 'Schließen', 'Хаах', 'Kapat'],
  ['nav.viewProfile', 'View profile', 'Profil ansehen', 'Профайл харах', 'Profili görüntüle'],
  ['nav.badgeUpcoming', 'Upcoming', 'Demnächst', 'Удахгүй', 'Yaklaşan'],
  ['nav.badgeJoin', 'Join', 'Beitreten', 'Нэгдэх', 'Katıl'],
  ['nav.badgeGive', 'Give', 'Spenden', 'Хандивлах', 'Bağış'],
  ['nav.featuredBadge', 'Connecting cultures,', 'Kulturen verbinden,', 'Соёлыг холбож,', 'Kültürleri buluşturuyoruz,'],
  ['nav.featuredTitle', 'We specialize in connection', 'Unser Fachgebiet ist die Verbindung', 'Бидний мэргэшил бол холбоо', 'Uzmanlığımız bağ kurmak'],
  ['nav.featuredDesc', 'We help you discover new opportunities by bridging cultural insight with professional success.', 'Wir helfen Ihnen, neue Möglichkeiten zu entdecken und kulturelles Wissen mit beruflichem Erfolg zu verbinden.', 'Бид соёлын мэдлэгийг мэргэжлийн амжилттай холбон, шинэ боломжийг олоход тань тусална.', 'Kültürel birikimi mesleki başarıyla buluşturarak yeni fırsatlar keşfetmenize yardımcı oluyoruz.'],
  ['nav.hello', 'Hello!', 'Hallo!', 'Сайн байна уу!', 'Merhaba!'],
  ['nav.forStudents', 'For students', 'Für Studierende', 'Оюутнуудад', 'Öğrenciler için'],
  ['nav.forCompanies', 'For companies', 'Für Unternehmen', 'Компаниудад', 'Şirketler için'],
  ['nav.forInstitutions', 'For institutions', 'Für Institutionen', 'Байгууллагуудад', 'Kurumlar için'],

  // Footer and intro wordmark
  ['footer.monogram1', 'MONGOLIAN', 'MONGOLISCHES', 'МОНГОЛЫН', 'MOĞOL'],
  ['footer.monogram2', 'CENTER', 'ZENTRUM', 'ТӨВ', 'MERKEZİ'],
  ['footer.discoverSteppe', 'Discover the Steppe', 'Die Steppe entdecken', 'Тал нутгийг нээн үзэх', 'Bozkırı keşfedin'],
  ['footer.legalNote', 'Mongolian Center in Austria is a registered non-profit association (Verein), ZVR number 1673049268 (Association Register, City of Vienna). mongoliancenter.org is the association’s official website, owned and operated by the association.', 'Das Mongolische Zentrum in Österreich ist ein eingetragener gemeinnütziger Verein, ZVR-Zahl 1673049268 (Vereinsregister, Magistrat der Stadt Wien). mongoliancenter.org ist die offizielle Website des Vereins und wird vom Verein betrieben.', 'Австри дахь Монголын Төв нь бүртгэлтэй ашгийн бус нийгэмлэг (Verein) бөгөөд ZVR дугаар нь 1673049268 (Нийгэмлэгийн бүртгэл, Венийн хотын захиргаа). mongoliancenter.org нь нийгэмлэгийн албан ёсны вэбсайт бөгөөд нийгэмлэгийн мэдэлд, түүгээр удирдагддаг.', 'Avusturya Moğol Merkezi, kayıtlı ve kâr amacı gütmeyen bir dernektir (Verein); ZVR numarası 1673049268 (Dernekler Sicili, Viyana Şehri Magistrası). mongoliancenter.org derneğin resmi web sitesidir ve dernek tarafından işletilir.'],
  ['footer.backToTop', 'Back to top', 'Nach oben', 'Дээш буцах', 'Yukarı çık'],

  // Home
  ['home.estShort', 'Est. 2026', 'Gegr. 2026', '2026 оноос', 'Kuruluş 2026'],
  ['home.established', 'Established 2026', 'Gegründet 2026', '2026 онд байгуулагдсан', '2026’da kuruldu'],
  ['home.official', 'Official', 'Offiziell', 'Албан ёсны', 'Resmi'],
  ['home.tour', '3D Culture Tour', '3D-Kulturrundgang', '3D соёлын аялал', '3D Kültür Turu'],
  ['home.bridge.tag', 'Our mission', 'Unsere Mission', 'Бидний зорилго', 'Misyonumuz'],
  ['home.bridge.titleNormal', 'Two countries, ', 'Zwei Länder, ', 'Хоёр орон, ', 'İki ülke, '],
  ['home.bridge.titleItalic', 'one bridge', 'eine Brücke', 'нэг гүүр', 'tek köprü'],
  ['home.bridge.desc', 'From Ulaanbaatar to Vienna, we connect communities, students, artists and businesses, turning a long distance into a shared path of culture, education and opportunity.', 'Von Ulaanbaatar bis Wien verbinden wir Gemeinschaften, Studierende, Kunstschaffende und Unternehmen und machen aus einer großen Entfernung einen gemeinsamen Weg aus Kultur, Bildung und Chancen.', 'Улаанбаатараас Вена хүртэл бид хамт олон, оюутнууд, уран бүтээлчид, бизнесүүдийг холбож, холын зайг соёл, боловсрол, боломжийн нийтлэг зам болгон хувиргаж байна.', 'Ulanbator’dan Viyana’ya toplulukları, öğrencileri, sanatçıları ve işletmeleri bir araya getiriyor, uzun mesafeyi kültür, eğitim ve fırsatlardan oluşan ortak bir yola dönüştürüyoruz.'],
  ['home.bridge.km', 'km between Ulaanbaatar and Vienna', 'km zwischen Ulaanbaatar und Wien', 'км: Улаанбаатар, Вена хоёрын хоорондох зай', 'km: Ulanbator ile Viyana arası'],
  ['home.partnersTitle', 'Our partners & sponsors', 'Unsere Partner und Förderer', 'Манай түнш, ивээн тэтгэгчид', 'Ortaklarımız ve destekçilerimiz'],
  ['home.pastEvents', 'Past events', 'Vergangene Veranstaltungen', 'Өнгөрсөн арга хэмжээ', 'Geçmiş etkinlikler'],
  ['home.foundation.tag', 'Our Foundation', 'Unser Fundament', 'Бидний тулгуур', 'Temelimiz'],
  ['home.foundation.titleNormal', 'The Three ', 'Die drei ', 'Гурван ', 'Üç '],
  ['home.foundation.titleItalic', 'Pillars', 'Säulen', 'тулгуур', 'Sütun'],
  ['home.foundation.learnMore', 'Learn more', 'Mehr erfahren', 'Дэлгэрэнгүй', 'Daha fazla bilgi'],
  ['home.stats.yearLabel', 'Year established', 'Gründungsjahr', 'Байгуулагдсан он', 'Kuruluş yılı'],
  ['home.stats.yearDesc', 'Registered association (Verein) in Austria', 'Eingetragener Verein in Österreich', 'Австри дахь бүртгэлтэй нийгэмлэг (Verein)', 'Avusturya’da kayıtlı dernek (Verein)'],
  ['home.stats.membersLabel', 'Active members', 'Aktive Mitglieder', 'Идэвхтэй гишүүд', 'Aktif üyeler'],
  ['home.stats.membersDesc', 'Students, professionals and institutional partners', 'Studierende, Fachkräfte und institutionelle Partner', 'Оюутнууд, мэргэжилтнүүд болон байгууллагын түншүүд', 'Öğrenciler, profesyoneller ve kurumsal ortaklar'],
  ['home.stats.partnersLabel', 'Bilateral partners', 'Bilaterale Partner', 'Хоёр талын түншүүд', 'İkili ortaklar'],
  ['home.stats.partnersDesc', 'Embassy of Mongolia & educational partners', 'Botschaft der Mongolei und Bildungspartner', 'Монгол Улсын Элчин сайдын яам болон боловсролын түншүүд', 'Moğolistan Büyükelçiliği ve eğitim ortakları'],
  ['home.stats.projectsLabel', 'Culture & integration projects', 'Kultur- und Integrationsprojekte', 'Соёл, нэгдлийн төслүүд', 'Kültür ve entegrasyon projeleri'],
  ['home.stats.projectsDesc', 'Diorama, language courses & events', 'Diorama, Sprachkurse und Veranstaltungen', 'Диорама, хэлний курс, арга хэмжээ', 'Diorama, dil kursları ve etkinlikler'],
  ['home.impactAlt', 'Impact', 'Wirkung', 'Нөлөө', 'Etki'],
  ['home.reach.label', 'Community reach', 'Reichweite in der Gemeinschaft', 'Хамт олонд хүрсэн нөлөө', 'Topluluğa erişim'],
  ['home.reach.text', 'Lives touched through our cultural and social initiatives in 2026. Your support makes this possible.', 'Menschen, die wir 2026 mit unseren kulturellen und sozialen Initiativen erreicht haben. Ihre Unterstützung macht das möglich.', '2026 онд манай соёл, нийгмийн санаачилгаар хүрсэн хүмүүс. Таны дэмжлэгээр энэ бүхэн бүтэж байна.', '2026’da kültürel ve sosyal girişimlerimizle hayatlarına dokunduğumuz kişiler. Desteğiniz bunu mümkün kılıyor.'],

  // About
  ['about.factEstablished', 'Established', 'Gegründet', 'Байгуулагдсан', 'Kuruluş'],
  ['about.factForm', 'Legal form', 'Rechtsform', 'Эрх зүйн хэлбэр', 'Hukuki yapı'],
  ['about.factFormValue', 'Registered association (Verein)', 'Eingetragener Verein', 'Бүртгэлтэй нийгэмлэг (Verein)', 'Kayıtlı dernek (Verein)'],
  ['about.factSeat', 'Seat', 'Sitz', 'Төв оффис', 'Merkez'],
  ['about.factLanguages', 'Working languages', 'Arbeitssprachen', 'Ажлын хэл', 'Çalışma dilleri'],
  ['about.govGovernance', 'Governance', 'Governance', 'Засаглал', 'Yönetişim'],
  ['about.govGovernanceText', 'How the association is organised and run.', 'Wie der Verein organisiert ist und geführt wird.', 'Нийгэмлэг хэрхэн зохион байгуулагдаж, удирдагддаг тухай.', 'Derneğin nasıl örgütlendiği ve yönetildiği.'],
  ['about.govImprint', 'Imprint', 'Impressum', 'Хуулийн мэдээлэл', 'Künye'],
  ['about.govImprintText', 'Legal notice and responsible persons.', 'Rechtliche Hinweise und verantwortliche Personen.', 'Хуулийн мэдэгдэл ба хариуцах этгээдүүд.', 'Yasal bildirim ve sorumlu kişiler.'],
  ['about.govPrivacy', 'Privacy', 'Datenschutz', 'Нууцлал', 'Gizlilik'],
  ['about.govPrivacyText', 'How we handle personal data.', 'Wie wir mit personenbezogenen Daten umgehen.', 'Хувийн мэдээллийг хэрхэн боловсруулдаг тухай.', 'Kişisel verileri nasıl işlediğimiz.'],
  ['about.heroAlt', 'Mongolian landscape', 'Mongolische Landschaft', 'Монголын байгаль', 'Moğolistan manzarası'],
  ['about.heroLead', 'The Mongolian Center in Austria connects Mongolian heritage with European partners through culture, education and business.', 'Das Mongolische Zentrum in Österreich verbindet das mongolische Erbe durch Kultur, Bildung und Wirtschaft mit europäischen Partnern.', 'Австри дахь Монголын Төв нь Монголын өв соёлыг соёл, боловсрол, бизнесээр дамжуулан Европын түншүүдтэй холбодог.', 'Avusturya Moğol Merkezi, Moğol mirasını kültür, eğitim ve iş dünyası aracılığıyla Avrupalı ortaklarla buluşturur.'],
  ['about.who', 'Who we are', 'Wer wir sind', 'Бид хэн бэ', 'Biz kimiz'],
  ['about.visionLabel', 'Vision', 'Vision', 'Алсын хараа', 'Vizyon'],
  ['about.principlesTitle', 'What guides our work', 'Was unsere Arbeit leitet', 'Бидний ажлыг чиглүүлэгч зүйл', 'Çalışmalarımıza yön verenler'],
  ['about.seeMembership', 'See membership options', 'Mitgliedschaftsoptionen ansehen', 'Гишүүнчлэлийн сонголтыг үзэх', 'Üyelik seçeneklerine göz atın'],
  ['about.govTag', 'Transparency', 'Transparenz', 'Ил тод байдал', 'Şeffaflık'],
  ['about.govTitle', 'Governance and contact', 'Governance und Kontakt', 'Засаглал ба холбоо барих', 'Yönetişim ve iletişim'],
  ['about.govOpen', 'Read more', 'Mehr lesen', 'Дэлгэрэнгүй', 'Devamını oku'],
  ['about.govContact', 'Contact us', 'Kontakt aufnehmen', 'Бидэнтэй холбогдох', 'Bize ulaşın'],
  ['about.submittedTitle', 'Application submitted', 'Antrag gesendet', 'Өргөдөл илгээгдлээ', 'Başvuru gönderildi'],
  ['about.submittedText', 'We have received your application and will contact you shortly.', 'Wir haben Ihren Antrag erhalten und melden uns in Kürze bei Ihnen.', 'Бид таны өргөдлийг хүлээн авсан бөгөөд удахгүй тантай холбогдоно.', 'Başvurunuzu aldık ve kısa süre içinde sizinle iletişime geçeceğiz.'],
  ['about.phName', 'e.g. Saran', 'z. B. Saran', 'жишээ нь: Саран', 'ör. Saran'],
  ['about.phEmail', 'hello@example.com', 'name@beispiel.at', 'name@example.com', 'ad@ornek.com'],
  ['about.phReason', 'I would love to help with...', 'Ich würde gern mithelfen bei ...', 'Би ... чиглэлээр тусалмаар байна', 'Şu konuda yardımcı olmak isterim...'],
  ['about.submitting', 'Submitting...', 'Wird gesendet ...', 'Илгээж байна...', 'Gönderiliyor...'],

  // Assistant
  ['assistant.menu.events', 'Upcoming Events', 'Kommende Veranstaltungen', 'Удахгүй болох арга хэмжээ', 'Yaklaşan Etkinlikler'],
  ['assistant.menu.about', 'About Us', 'Über uns', 'Бидний тухай', 'Hakkımızda'],
  ['assistant.menu.howto', 'How To', 'Anleitungen', 'Заавар', 'Nasıl Yapılır'],
  ['assistant.greeting', 'Hi! What information would you like to get today?', 'Hallo! Welche Informationen möchten Sie heute erhalten?', 'Сайн байна уу! Өнөөдөр ямар мэдээлэл авахыг хүсэж байна вэ?', 'Merhaba! Bugün hangi bilgiyi almak istersiniz?'],
  ['assistant.followUp', 'Is there anything else I can help you with?', 'Kann ich Ihnen sonst noch weiterhelfen?', 'Өөр юугаар туслах вэ?', 'Size yardımcı olabileceğim başka bir konu var mı?'],
  ['assistant.generic', 'Thank you for reaching out! You can explore our Events, About, or Contact pages for more details.', 'Danke für Ihre Nachricht! Weitere Informationen finden Sie auf unseren Seiten „Veranstaltungen“, „Über uns“ und „Kontakt“.', 'Холбогдсонд баярлалаа! Дэлгэрэнгүй мэдээллийг манай “Арга хэмжээ”, “Бидний тухай”, “Холбоо барих” хуудаснаас үзнэ үү.', 'Bize ulaştığınız için teşekkürler! Daha fazla bilgi için Etkinlikler, Hakkımızda veya İletişim sayfalarımıza göz atabilirsiniz.'],
  ['assistant.fallback', 'The Mongolian Center in Austria warmly welcomes you! For specific inquiries, you can reach our team at info@mongoliancenter.org or visit our Contact page.', 'Das Mongolische Zentrum in Österreich heißt Sie herzlich willkommen! Bei konkreten Anfragen erreichen Sie unser Team unter info@mongoliancenter.org oder über unsere Kontaktseite.', 'Австри дахь Монголын Төв таныг халуун дотноор угтаж байна! Тодорхой асуулт байвал info@mongoliancenter.org хаягаар манай багтай холбогдох эсвэл “Холбоо барих” хуудсаар зочилно уу.', 'Avusturya Moğol Merkezi sizi sıcak bir şekilde karşılar! Özel sorularınız için ekibimize info@mongoliancenter.org adresinden ulaşabilir veya İletişim sayfamızı ziyaret edebilirsiniz.'],
  ['assistant.answers.events', 'We regularly host cultural events, workshops, and exhibitions. These include traditional music performances, Mongolian calligraphy workshops, and Shagai (ankle bone) game nights. You can view the full schedule and RSVP on our Events page.', 'Wir veranstalten regelmäßig Kulturveranstaltungen, Workshops und Ausstellungen, darunter traditionelle Musikaufführungen, Workshops zur mongolischen Kalligrafie und Shagai-Spieleabende (Knöchelspiele). Den vollständigen Programmkalender und die Anmeldung finden Sie auf unserer Seite „Veranstaltungen“.', 'Бид соёлын арга хэмжээ, сургалт, үзэсгэлэнг тогтмол зохион байгуулдаг. Үүнд уламжлалт хөгжмийн тоглолт, монгол уран бичлэгийн сургалт, шагайн тоглоомын үдэшлэг багтана. Бүрэн хуваарийг үзэж, бүртгүүлэхийг “Арга хэмжээ” хуудаснаас харна уу.', 'Düzenli olarak kültürel etkinlikler, çalıştaylar ve sergiler düzenliyoruz. Bunlar arasında geleneksel müzik performansları, Moğol hat sanatı çalıştayları ve Şagai (aşık kemiği) oyun geceleri yer alıyor. Programın tamamını görmek ve kayıt olmak için Etkinlikler sayfamıza göz atabilirsiniz.'],
  ['assistant.answers.about', 'The Mongolian Center in Austria, based in Vienna, is a cultural center dedicated to preserving and promoting Mongolian heritage. We offer a space for the community to gather, learn, and celebrate traditional arts, language, and nomadic customs.', 'Das Mongolische Zentrum in Österreich mit Sitz in Wien ist ein Kulturzentrum, das sich der Bewahrung und Förderung des mongolischen Erbes widmet. Wir bieten der Gemeinschaft einen Ort, um zusammenzukommen, zu lernen und traditionelle Kunst, Sprache und nomadische Bräuche zu feiern.', 'Вена хотод төвтэй Австри дахь Монголын Төв нь Монголын өв соёлыг хадгалан хамгаалах, сурталчлах соёлын төв юм. Бид хамт олондоо цугларах, суралцах, уламжлалт урлаг, хэл, нүүдэлчдийн ёс заншлаа тэмдэглэх орон зайг санал болгодог.', 'Merkezi Viyana’da bulunan Avusturya Moğol Merkezi, Moğol mirasını korumaya ve tanıtmaya adanmış bir kültür merkezidir. Topluluğumuza bir araya gelmek, öğrenmek ve geleneksel sanatları, dili ve göçebe gelenekleri kutlamak için bir alan sunuyoruz.'],
  ['assistant.answers.howto', 'Here are some quick guides:\n• How to join: You can sign up via the Membership page on our website or visit us in Vienna.\n• How to volunteer: We are always looking for passionate volunteers. Contact us through the Contact page.\n• How to explore: Open our interactive 3D Diorama from the menu to learn about the Ger, Shagai, and the Three Manly Skills.', 'Kurzanleitungen:\n• Mitglied werden: Sie können sich über die Seite „Mitgliedschaft“ auf unserer Website anmelden oder uns in Wien besuchen.\n• Ehrenamtlich mithelfen: Wir suchen laufend engagierte Freiwillige. Schreiben Sie uns über die Seite „Kontakt“.\n• Entdecken: Öffnen Sie im Menü unser interaktives 3D-Diorama, um mehr über die Ger, Shagai und die drei männlichen Fähigkeiten zu erfahren.', 'Товч заавар:\n• Хэрхэн элсэх вэ: Манай вэбсайтын “Гишүүнчлэл” хуудсаар бүртгүүлэх эсвэл Вена дахь манай байранд зочлоорой.\n• Хэрхэн сайн дурын ажил хийх вэ: Бид сайн дурынхныг үргэлж хүлээн авдаг. “Холбоо барих” хуудсаар бидэнтэй холбогдоорой.\n• Хэрхэн танилцах вэ: Цэснээс 3D диорамаг нээж, гэр, шагай, эрийн гурван наадмын тухай мэдээлэл аваарай.', 'Kısa rehber:\n• Nasıl üye olunur: Web sitemizdeki Üyelik sayfasından kaydolabilir veya bizi Viyana’da ziyaret edebilirsiniz.\n• Nasıl gönüllü olunur: Her zaman gönüllüler arıyoruz. İletişim sayfamızdan bize ulaşın.\n• Nasıl keşfedilir: Menüden etkileşimli 3D Diorama’yı açarak Ger, Şagai ve Üç Erkeksi Beceri hakkında bilgi edinin.'],
  ['assistant.sayHello', 'Say hello: open the support chat', 'Hallo sagen: Support-Chat öffnen', 'Мэндлэх: тусламжийн чатыг нээх', 'Merhaba deyin: destek sohbetini açın'],
  ['assistant.open', 'Open support chat', 'Support-Chat öffnen', 'Тусламжийн чатыг нээх', 'Destek sohbetini aç'],
  ['assistant.support', 'Support', 'Hilfe', 'Тусламж', 'Destek'],
  ['assistant.dialog', 'Help and support assistant', 'Hilfe- und Support-Assistent', 'Тусламж, дэмжлэгийн туслах', 'Yardım ve destek asistanı'],
  ['assistant.title', 'MCA Assistant', 'MCA-Assistent', 'MCA туслах', 'MCA Asistanı'],
  ['assistant.close', 'Close support chat', 'Support-Chat schließen', 'Тусламжийн чатыг хаах', 'Destek sohbetini kapat'],
  ['assistant.placeholder', 'Ask about events, membership, culture...', 'Fragen zu Veranstaltungen, Mitgliedschaft, Kultur ...', 'Арга хэмжээ, гишүүнчлэл, соёлын талаар асуух...', 'Etkinlikler, üyelik, kültür hakkında sorun...'],
  ['assistant.askLabel', 'Ask a question', 'Frage stellen', 'Асуулт асуух', 'Soru sorun'],
  ['assistant.send', 'Send question', 'Frage senden', 'Асуулт илгээх', 'Soruyu gönder'],
  ['boy.alt', 'A Mongolian boy in a traditional deel waving hello', 'Ein mongolischer Junge im traditionellen Deel winkt zur Begrüßung', 'Уламжлалт дээлтэй монгол хүү мэндэлж байна', 'Geleneksel deel giymiş bir Moğol çocuk el sallıyor'],

  // Impact and contact details
  ['impact.fundAll', 'All funds', 'Alle Fonds', 'Бүх сан', 'Tüm fonlar'],
  ['impact.fundHeritage', 'Nomadic heritage', 'Nomadisches Erbe', 'Нүүдэлчний өв', 'Göçebe mirası'],
  ['impact.fundBridge', 'Bilateral bridges', 'Bilaterale Brücken', 'Хоёр талын гүүр', 'İkili köprüler'],
  ['impact.fundExchange', 'Youth exchange', 'Jugendaustausch', 'Залуучуудын солилцоо', 'Gençlik değişimi'],
  ['impact.heroAlt', 'Mongolian landscape', 'Mongolische Landschaft', 'Монголын байгаль', 'Moğolistan manzarası'],
  ['impact.customAmount', 'Custom amount', 'Anderer Betrag', 'Өөр дүн', 'Başka tutar'],
  ['impact.processing', 'Processing...', 'Wird verarbeitet ...', 'Боловсруулж байна...', 'İşleniyor...'],
  ['impact.zvrLabel', 'ZVR number', 'ZVR-Zahl', 'ZVR дугаар', 'ZVR numarası'],
  ['impact.zvrRegister', 'Association Register, City of Vienna', 'Vereinsregister, Magistrat der Stadt Wien', 'Нийгэмлэгийн бүртгэл, Венийн хотын захиргаа', 'Dernekler Sicili, Viyana Şehri Magistrası'],

  // SEO
  ['seo.home', 'Cultural & Community Center in Vienna', 'Kultur- und Gemeinschaftszentrum in Wien', 'Вена дахь соёл, олон нийтийн төв', 'Viyana’da Kültür ve Topluluk Merkezi'],
  ['seo.members', 'Members Directory', 'Mitgliederverzeichnis', 'Гишүүдийн лавлах', 'Üye Dizini'],
  ['seo.diorama', '3D Interactive Diorama', 'Interaktives 3D-Diorama', '3D интерактив диорама', 'Etkileşimli 3D Diorama'],
  ['seo.description', 'The center for Mongolians in Austria. Join cultural events, language courses, traditional arts and Austrian–Mongolian cultural exchange.', 'Das Zentrum für Mongolinnen und Mongolen in Österreich: Kulturveranstaltungen, Sprachkurse, traditionelle Künste und österreichisch-mongolischer Kulturaustausch.', 'Австри дахь монголчуудын хамтын ажиллагааны төв. Соёлын арга хэмжээ, хэлний курс, уламжлалт урлаг, Австри-Монголын соёлын солилцоонд нэгдээрэй.', 'Avusturya’daki Moğollar için iş birliği merkezi. Kültürel etkinliklere, dil kurslarına, geleneksel sanatlara ve Avusturya–Moğolistan kültürel değişimine katılın.'],

  // Naadam section
  ['naadam.tag', 'Naadam', 'Naadam', 'Наадам', 'Naadam'],
  ['naadam.titleNormal', 'The Three Games of ', 'Die drei Spiele des ', 'Наадмын ', 'Naadam’ın Üç '],
  ['naadam.titleItalic', 'Naadam', 'Naadam', 'гурван төрөл', 'Oyunu'],
  ['naadam.desc', 'Eriin gurvan naadam, the festival at the heart of Mongolian culture, brings together wrestling, archery and horse racing each summer.', 'Eriin Gurvan Naadam, das Fest im Herzen der mongolischen Kultur, vereint jeden Sommer Ringen, Bogenschießen und Pferderennen.', 'Монгол соёлын цөм болсон Эрийн гурван наадам жил бүрийн зун бөх, сур харваа, морин уралдааныг нэгтгэдэг.', 'Moğol kültürünün kalbindeki festival Eriin Gurvan Naadam, her yaz güreşi, okçuluğu ve at yarışını bir araya getirir.'],
  ['naadam.wrestlingTitle', 'Wrestling', 'Ringen', 'Бөх', 'Güreş'],
  ['naadam.wrestlingText', 'No weight classes and no time limit: a bout ends when any part of the body other than the feet and hands touches the ground.', 'Keine Gewichtsklassen und kein Zeitlimit: Ein Kampf endet, sobald ein anderer Körperteil als Füße und Hände den Boden berührt.', 'Жингийн ангилал, цагийн хязгаар байхгүй: хөл, гараас бусад биеийн аль нэг хэсэг газарт хүрмэгц барилдаан дуусна.', 'Sıklet ve süre sınırı yoktur: ayaklar ve eller dışında vücudun herhangi bir yeri yere değdiğinde maç sona erer.'],
  ['naadam.archeryTitle', 'Archery', 'Bogenschießen', 'Сур харваа', 'Okçuluk'],
  ['naadam.archeryText', 'Traditional archery with a recurve bow, in which both men and women compete.', 'Traditionelles Bogenschießen mit dem Reflexbogen, an dem Männer wie Frauen teilnehmen.', 'Уламжлалт нумаар харвадаг бөгөөд эрэгтэй, эмэгтэй хоёулаа өрсөлддөг сур харваа.', 'Hem kadınların hem erkeklerin yarıştığı, refleks yayla yapılan geleneksel okçuluk.'],
  ['naadam.horseTitle', 'Horse racing', 'Pferderennen', 'Морин уралдаан', 'At yarışı'],
  ['naadam.horseText', 'Long-distance races across the open steppe, ridden by young jockeys.', 'Langstreckenrennen über die offene Steppe, geritten von jungen Jockeys.', 'Задгай тал нутгаар болдог холын зайн уралдаан бөгөөд морийг бага насны унаач хүүхдүүд унадаг.', 'Açık bozkırda yapılan, genç jokeylerin bindiği uzun mesafeli yarışlar.'],
  ['diorama.mood.dawn', 'Dawn', 'Morgen', 'Үүр', 'Şafak'],
  ['diorama.mood.day', 'Day', 'Tag', 'Өдөр', 'Gündüz'],
  ['diorama.mood.sunset', 'Sunset', 'Abend', 'Нар жаргах', 'Gün batımı'],
  ['diorama.mood.night', 'Night', 'Nacht', 'Шөнө', 'Gece'],
];

function build(index: number) {
  const out: Record<string, any> = {};
  for (const row of rows) {
    const path = row[0].split('.');
    let node = out;
    for (let i = 0; i < path.length - 1; i++) node = node[path[i]] ??= {};
    node[path[path.length - 1]] = row[index + 1];
  }
  return { siteUi: out };
}

const siteUi = {
  en: build(0),
  de: build(1),
  mn: build(2),
  tr: build(3),
};

export default siteUi;
