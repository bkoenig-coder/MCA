import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Users, ShieldCheck, FileText, Award, Scale } from 'lucide-react';

export default function Governance() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // Localized Copy
  const translations = {
    mn: {
      tag: "Хууль эрх зүй ба Нийцэл",
      title: "Удирдлагын бүтэц",
      titleItalic: "& Ёс зүй",
      intro: "Вена дахь Монгол Төв (Mongolian Center in Vienna) нь бүх үйл ажиллагаандаа ил тод байдал, хариуцлагатай байх, ёс зүйн өндөр стандартыг баримтлан ажилладаг.",
      integrityTitle: "Шударга байдал",
      integrityDesc: "Бид санхүүгийн болон үйл ажиллагааны тайланг туйлын шударга, бодитоор гаргадаг.",
      inclusivityTitle: "Оролцоог хангах",
      inclusivityDesc: "Бидний засаглалын бүтэц нь хамт олны олон талт төлөөлөл, шийдвэр гаргалтад хүн бүрийн оролцох боломжийг хангадаг.",
      s1Title: "1. Байгууллагын бүтэц",
      s1Desc: "Австри улсад бүртгэлтэй албан ёсны холбоо (Verein) болохын хувьд манай бүтэц нь Ерөнхий ассамблей, Гүйцэтгэх зөвлөл, Хөндлөнгийн хянан шалгагчдаас бүрддэг. Ерөнхий ассамблей нь холбооны дээд удирдах байгууллага бөгөөд жил бүр хуралддаг.",
      s2Title: "2. Төлөөлөн удирдах зөвлөл",
      s2Desc: "Гүйцэтгэх зөвлөл нь Төвийн стратегийн чиглэл, өдөр тутмын үйл ажиллагааг удирдах үүрэгтэй. Удирдах зөвлөлийн гишүүдийг Ерөнхий ассамблейгаас хоёр жилийн хугацаатай сонгодог.",
      s3Title: "3. Ёс зүйн хэм хэмжээ",
      s3Desc: "Бид ашиг сонирхлын зөрчил, авлига, ялгаварлан гадуурхалтыг хориглосон ёс зүйн хатуу дүрмийг баримталдаг. Бүх ажилтан, сайн дурынхан эдгээр стандартыг гарын үсэг зурж баталгаажуулдаг.",
      s4Title: "4. Санхүүгийн ил тод байдал",
      s4Desc: "Манай санхүүгийн бүртгэлийг жил бүр хараат бус аудиторууд шалгадаг. Манай гишүүд болон хандивлагчдад ил тод байх үүднээс бид үйл ажиллагаа, санхүүгийн үр дүнгээ харуулсан жилийн тайланг олон нийтэд нээлттэй нийтэлдэг.",
      s5Title: "5. Австрийн хууль тогтоомжийн хэрэгжилт",
      s5Desc: "Бид Австрийн Холбооны тухай хууль (Vereinsgesetz) болон бусад холбогдох хууль эрх зүйн шаардлагуудыг бүрэн биелүүлж ажилладаг.",
      footerTitle: "Засаглалын талаарх асуулга",
      association: "Mongolian Center in Austria (Mongolisches Zentrum in Österreich)"
    },
    de: {
      tag: "Recht und Compliance",
      title: "Governance",
      titleItalic: "& Ethik",
      intro: "Das Mongolische Zentrum in Wien setzt sich für höchste Standards in Bezug auf Transparenz, Rechenschaftspflicht und ethisches Verhalten bei allen seinen Aktivitäten ein.",
      integrityTitle: "Integrität",
      integrityDesc: "Wir wahren absolute Integrität in unserer Finanz- und Betriebsberichterstattung.",
      inclusivityTitle: "Inklusion",
      inclusivityDesc: "Unsere Führungsstruktur sichert vielfältige Repräsentation und inklusive Entscheidungsverfahren.",
      s1Title: "1. Organisationsstruktur",
      s1Desc: "Als eingetragener Verein (Verein) in Österreich besteht unsere Struktur aus der Generalversammlung, dem Vorstand und den Rechnungsprüfern. Die Generalversammlung ist das oberste Organ des Vereins und tritt jährlich zusammen.",
      s2Title: "2. Vorstand",
      s2Desc: "Der Vorstand ist für die strategische Ausrichtung und das laufende Management des Zentrums verantwortlich. Die Vorstandsmitglieder werden von der Generalversammlung für eine Amtszeit von zwei Jahren gewählt.",
      s3Title: "3. Ethische Standards",
      s3Desc: "Wir halten uns an einen strengen Verhaltenskodex, der Interessenkonflikte, Bestechung und Diskriminierung verbietet. Alle Mitarbeiter und Freiwilligen sind verpflichtet, diese Standards zu unterzeichnen und einzuhalten.",
      s4Title: "4. Finanzielle Transparenz",
      s4Desc: "Unsere Finanzberichte werden jährlich von unabhängigen Rechnungsprüfern geprüft. Wir veröffentlichen einen Jahresbericht, in dem unsere Aktivitäten und unsere finanzielle Leistung detailliert aufgeführt sind, um volle Transparenz für unsere Mitglieder und Spender zu gewährleisten.",
      s5Title: "5. Einhaltung des österreichischen Rechts",
      s5Desc: "Wir arbeiten in voller Übereinstimmung mit dem österreichischen Vereinsgesetz und allen anderen relevanten gesetzlichen und regulatorischen Anforderungen.",
      footerTitle: "Governance-Fragen",
      association: "Mongolian Center in Austria (Mongolisches Zentrum in Österreich)"
    },
    en: {
      tag: "Legal & Compliance",
      title: "Governance",
      titleItalic: "& Ethics",
      intro: "The Mongolian Center in Vienna is committed to the highest standards of transparency, accountability, and ethical conduct in all its operations.",
      integrityTitle: "Integrity",
      integrityDesc: "We maintain absolute integrity in our financial and operational reporting.",
      inclusivityTitle: "Inclusivity",
      inclusivityDesc: "Our governance structure ensures diverse representation and inclusive decision-making.",
      s1Title: "1. Organizational Structure",
      s1Desc: "As a registered association (Verein) in Austria, our structure consists of the General Assembly, the Executive Board, and the Auditors. The General Assembly is the supreme body of the association and meets annually.",
      s2Title: "2. Board of Directors",
      s2Desc: "The Executive Board is responsible for the strategic direction and day-to-day management of the center. Board members are elected by the General Assembly for a term of two years.",
      s3Title: "3. Ethical Standards",
      s3Desc: "We adhere to a strict Code of Conduct that prohibits conflicts of interest, bribery, and discrimination. All staff and volunteers are required to sign and uphold these standards.",
      s4Title: "4. Financial Transparency",
      s4Desc: "Our financial records are audited annually by independent auditors. We publish an annual report detailing our activities and financial performance to ensure full transparency for our members and donors.",
      s5Title: "5. Compliance with Austrian Law",
      s5Desc: "We operate in full compliance with the Austrian Association Act (Vereinsgesetz) and all other relevant legal and regulatory requirements.",
      footerTitle: "Governance Inquiries",
      association: "Mongolian Center in Vienna"
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
                {text.intro}
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-16">
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <ShieldCheck className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{text.integrityTitle}</h3>
                  <p className="text-sm">{text.integrityDesc}</p>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-brand-ink/5 shadow-sm">
                  <Users className="text-brand-gold mb-4" size={32} />
                  <h3 className="text-xl font-serif text-brand-ink mb-2">{text.inclusivityTitle}</h3>
                  <p className="text-sm">{text.inclusivityDesc}</p>
                </div>
              </div>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.s1Title}</h2>
                <p>
                  {text.s1Desc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.s2Title}</h2>
                <p>
                  {text.s2Desc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.s3Title}</h2>
                <p>
                  {text.s3Desc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.s4Title}</h2>
                <p>
                  {text.s4Desc}
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-serif text-brand-ink mb-6">{text.s5Title}</h2>
                <p>
                  {text.s5Desc}
                </p>
              </section>

              <section className="pt-12 border-t border-brand-ink/10">
                <h2 className="text-2xl font-serif text-brand-ink mb-4">{text.footerTitle}</h2>
                <p className="font-medium text-brand-ink">{text.association}</p>
                <p>Email: info@mongoliancenter.org</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
