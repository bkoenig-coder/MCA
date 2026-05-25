import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Globe, Info } from 'lucide-react';

export default function Imprint() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Localized Copy
  const translations = {
    mn: {
      tag: "Хууль эрх зүй ба Нийцэл",
      title: "Импринт нь",
      titleItalic: "(Impressum)",
      sub: "Австрийн ECG-ийн 5-р зүйл, UGB-ийн 14-р зүйл, MedienG-ийн 25-р зүйл, GewO-ийн 63-р зүйлд заасан мэдээлэл.",
      operatorTitle: "Операторын мэдээлэл",
      operatorName: "Австри дахь Монгол Төв холбоо (Mongolian Center in Vienna)",
      operatorZvr: "ZVR-Zahl: 1673049268 - Вена хотын захиргааны бүртгэл (Vereinsregister)",
      addressTitle: "Хаяг",
      contactTitle: "Холбоо барих",
      contactPhone: "Утас",
      contactEmail: "Имэйл",
      authorityTitle: "Хяналтын байгууллага",
      authorityDesc1: "Вена хотын захиргаа (Magistrat der Stadt Wien)",
      authorityDesc2: "Дүүргийн захиргааны газар (Bezirkshauptmannschaft)",
      liabilityContentTitle: "Агуулгын хариуцлага",
      liabilityContentDesc: "Барилгын агуулгыг өндөр нарийвчлалтайгаар бэлтгэсэн. Гэсэн хэдий ч бид агуулгын үнэн зөв, бүрэн бүтэн байдал, цаг үеийн нийцлийг бүрэн баталгаажуулах боломжгүй юм. Үйлчилгээ үзүүлэгчийн хувьд бид ерөнхий хууль тогтоомжийн дагуу эдгээр хуудсан дээрх өөрийн агуулгыг хариуцна.",
      liabilityLinksTitle: "Холбоосын хариуцлага",
      liabilityLinksDesc: "Манай санал болгож буй үйлчилгээ нь гуравдагч этгээдийн гаднах вэбсайтуудын холбоосыг агуулж байгаа бөгөөд тэдгээрийн агуулгад бид нөлөөлөх боломжгүй юм. Тиймээс бид эдгээр гадны агуулгын талаар ямар ч хариуцлага хүлээхгүй. Холбогдох хуудсуудын агуулгыг тухайн сайтын оператор үргэлж хариуцна.",
      copyrightTitle: "Зохиогчийн эрх",
      copyrightDesc: "Сайтын операторуудын бүтээсэн эдгээр хуудас дээрх агуулга, бүтээлүүд нь Австрийн зохиогчийн эрхийн хуульд хамаарна. Зохиогчийн эрхээс гадуур хуулбарлах, боловсруулах, түгээх болон аливаа хэлбэрээр ашиглахад холбогдох зохиогч эсвэл бүтээгчийн бичгээр өгсөн зөвшөөрөл шаардлагатай.",
      disclose1: "Австрийн Хэвлэл мэдээллийн тухай хуулийн (§ 25 MedienG) дагуу мэдээллийг нээлттэй болгох үүрэг.",
      disclose2: "Хэвлэл мэдээлэл эзэмшигч, хэвлэн нийтлэгч: Вена дахь Монгол Төв.",
      disclose3: "Холбооны зорилго: Австри улсад Монголын соёл, өв уламжлалыг сурталчлах, хадгалах."
    },
    de: {
      tag: "Recht & Compliance",
      title: "Impressum",
      titleItalic: "(Imprint)",
      sub: "Informationen gemäß § 5 ECG, § 14 UGB, § 25 MedienG und § 63 GewO.",
      operatorTitle: "Betreiberinformationen",
      operatorName: "Mongolisches Zentrum in Österreich (Mongolian Center in Vienna)",
      operatorZvr: "ZVR-Zahl: 1673049268 vom Magistrat der Stadt Wien (Vereinsregister)",
      addressTitle: "Adresse",
      contactTitle: "Kontakt",
      contactPhone: "Telefon",
      contactEmail: "E-Mail",
      authorityTitle: "Aufsichtsbehörde",
      authorityDesc1: "Magistrat der Stadt Wien",
      authorityDesc2: "Bezirkshauptmannschaft für den 21. Bezirk",
      liabilityContentTitle: "Haftung für Inhalte",
      liabilityContentDesc: "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.",
      liabilityLinksTitle: "Haftung für Links",
      liabilityLinksDesc: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.",
      copyrightTitle: "Urheberrecht",
      copyrightDesc: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.",
      disclose1: "Offenlegungspflicht gemäß § 25 MedienG.",
      disclose2: "Medieninhaber und Herausgeber: Mongolisches Zentrum in Österreich.",
      disclose3: "Vereinszweck: Förderung und Vermittlung der mongolischen Kultur und des Kulturguts in Österreich."
    },
    en: {
      tag: "Legal & Compliance",
      title: "Imprint",
      titleItalic: "(Impressum)",
      sub: "Information according to § 5 ECG, § 14 UGB, § 25 MedienG and § 63 GewO.",
      operatorTitle: "Operator Information",
      operatorName: "Mongolian Center in Vienna",
      operatorZvr: "ZVR-Zahl: 1673049268 from Magistrat der Stadt Wien (Vereinsregister)",
      addressTitle: "Address",
      contactTitle: "Contact",
      contactPhone: "Phone",
      contactEmail: "Email",
      authorityTitle: "Supervisory Authority",
      authorityDesc1: "Magistrat der Stadt Wien",
      authorityDesc2: "District Administration (Bezirkshauptmannschaft)",
      liabilityContentTitle: "Liability for Content",
      liabilityContentDesc: "The contents of our pages were created with great care. However, we cannot guarantee the accuracy, completeness and timeliness of the content. As a service provider, we are responsible for our own content on these pages according to the general laws.",
      liabilityLinksTitle: "Liability for Links",
      liabilityLinksDesc: "Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages.",
      copyrightTitle: "Copyright",
      copyrightDesc: "The contents and works on these pages created by the site operators are subject to Austrian copyright law. The reproduction, processing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator.",
      disclose1: "Disclosure according to the Austrian Media Act (Offenlegungspflicht gemäß § 25 MedienG).",
      disclose2: "Media owner and publisher: Mongolian Center in Vienna.",
      disclose3: "Purpose of the association: Promotion of Mongolian culture and heritage in Austria."
    }
  };

  const text = translations[currentLang === 'mn' ? 'mn' : currentLang === 'de' ? 'de' : 'en'];

  return (
    <div className="pt-20">
      <section className="relative py-24 md:py-32 px-6 bg-brand-paper overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-brand-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-brand-gold">
                {text.tag}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-12 tracking-tight text-brand-ink">
              {text.title} <span className="italic text-brand-gold">{text.titleItalic}</span>
            </h1>
            
            <div className="prose prose-lg prose-brand max-w-none text-brand-ink/70 font-light leading-relaxed space-y-12">
              <p className="text-xl text-brand-ink font-normal italic">
                {text.sub}
              </p>

              <div className="grid md:grid-cols-2 gap-12">
                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Info className="text-brand-gold" size={24} />
                    {text.operatorTitle}
                  </h2>
                  <div className="space-y-2">
                    <p className="font-bold text-brand-ink">{text.operatorName}</p>
                    <p>{text.operatorZvr}</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <MapPin className="text-brand-gold" size={24} />
                    {text.addressTitle}
                  </h2>
                  <div className="space-y-2">
                    <p>Schöpfleuthergasse 25, Vienna, Austria, 1210</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Mail className="text-brand-gold" size={24} />
                    {text.contactTitle}
                  </h2>
                  <div className="space-y-2">
                    <p>{text.contactPhone}: +4367761160389</p>
                    <p>{text.contactEmail}: info@mongoliancenter.org</p>
                    <p>Web: www.mongoliancenter.org</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-serif text-brand-ink mb-6 flex items-center gap-3">
                    <Globe className="text-brand-gold" size={24} />
                    {text.authorityTitle}
                  </h2>
                  <div className="space-y-2">
                    <p>{text.authorityDesc1}</p>
                    <p>{text.authorityDesc2}</p>
                  </div>
                </section>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.liabilityContentTitle}</h2>
                <p>
                  {text.liabilityContentDesc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.liabilityLinksTitle}</h2>
                <p>
                  {text.liabilityLinksDesc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.copyrightTitle}</h2>
                <p>
                  {text.copyrightDesc}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10 text-sm italic">
                <p>{text.disclose1}</p>
                <p>{text.disclose2}</p>
                <p>{text.disclose3}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
