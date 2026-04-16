import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        events: 'Events',
        news: 'News',
        gallery: 'Gallery',
        impact: 'Impact',
        contact: 'Contact',
        signIn: 'Sign In',
        signOut: 'Log Out',
        mongolian: 'Mongolian',
        center: 'Center',
        location: 'Vienna • Austria',
        admin: 'Admin',
        member: 'Member'
      },
      common: {
        locale: 'en-GB',
        back: 'Back',
        loading: 'Loading...',
        register: 'Register Now',
        or: 'or',
        error: {
          signIn: 'Failed to sign in. Please check if popups are blocked.',
          server: 'Server error: {{status}}',
          checkout: 'No checkout URL received from server',
          unexpected: 'An unexpected error occurred. Please try again.'
        }
      },
      hero: {
        tag: 'Vienna • Austria',
        title: 'Bridging Cultures,',
        titleItalic: 'Building Community',
        subtitle: 'Welcome to the official website of the Mongolian Center in Vienna. We are a vibrant cultural hub dedicated to preserving our heritage, fostering community integration, and celebrating the rich tapestry of Mongolian traditions in the heart of Austria.',
        ctaEvents: 'Explore Events',
        ctaImpact: 'Our Impact',
        ctaStory: 'Our Story',
        established: 'Established'
      },
      pillars: {
        title: 'Our Core Pillars',
        community: {
          title: 'Community Hub',
          desc: 'A space where Mongolians and locals connect through networking and shared experiences.'
        },
        arts: {
          title: 'Arts & Gallery',
          desc: 'Showcasing traditional and contemporary Mongolian artists in cross-cultural exhibitions.'
        },
        impact: {
          title: 'Social Impact',
          desc: 'Fostering solidarity through donation initiatives supporting causes in Austria and Mongolia.'
        }
      },
      legacy: {
        title: 'Legacy of the',
        titleItalic: 'Great Steppe',
        quote: '"From the vast horizons of the Mongolian plateau to the heart of Vienna, we carry the spirit of the nomad—resilient, free, and deeply connected to our roots."',
        archery: 'Archery',
        tradition: 'Tradition',
        horsemanship: 'Horsemanship',
        freedom: 'Freedom',
        wrestling: 'Wrestling',
        strength: 'Strength',
        wisdom: 'Wisdom',
        heritage: 'Heritage'
      },
      highlight: {
        tag: 'Highlight',
        title: 'Cultural Festival:',
        titleItalic: 'Echoes of the Steppe',
        desc: 'Join us for an immersive weekend of Mongolian music, traditional dance, and culinary delights. Experience the rich heritage of Mongolia right here in Vienna.',
        date: 'June 15-17, 2026',
        nextEvent: 'Next Event',
        audience: 'Open to all community members',
        cta: 'View All Events'
      },
      impactCta: {
        title: 'Make an Impact Together',
        desc: 'Your support helps us maintain this cultural bridge and fund social initiatives in both Austria and Mongolia.',
        cta: 'Support Our Initiatives'
      },
      about: {
        tag: 'Our Story',
        story: 'Our Story &',
        mission: 'Mission',
        bridging: 'Bridging',
        cultures: 'Cultures',
        founded: 'Founded in Vienna, the Mongolian Center in Austria emerged from a vision to create a dedicated home for cultural exchange, artistic expression, and community solidarity.',
        heritage: 'Our Heritage',
        hubTitle: 'A Vibrant Hub in Vienna',
        hubDesc1: 'The Mongolian Center in Austria is a dynamic NGO based in Vienna, dedicated to building a vibrant cultural and community hub for Mongolians and locals alike. It serves as a space where people can connect, experience, and celebrate Mongolian culture through thoughtfully curated events.',
        hubDesc2: 'Our activities range from high-level networking gatherings that foster professional connections to colorful cultural festivals and educational workshops that keep our traditions alive for the next generation.',
        hubDesc3: 'We believe that culture is a living, breathing entity. By bringing Mongolian traditions to the heart of Europe, we create a dialogue that enriches both communities.',
        vision: {
          title: 'Our Vision',
          desc: 'To be the primary bridge between Austria and Mongolia, fostering a world where cultural diversity is celebrated and community bonds are unbreakable.'
        },
        values: {
          tag: 'Core Principles',
          title: 'Our Values',
          desc: 'Solidarity, cultural integrity, social responsibility, and artistic excellence guide every initiative we undertake.'
        },
        impact: {
          title: 'Our Impact',
          desc: 'Through our donation initiatives, we support meaningful causes both locally in Vienna and across the vast landscapes of Mongolia.'
        },
        team: {
          tag: 'The Leadership',
          title: 'Our Team',
          quote: '"Dedicated professionals committed to the preservation and promotion of Mongolian heritage in Europe."',
          roles: {
            director: 'Executive Director',
            manager: 'Cultural Program Manager',
            outreach: 'Community Outreach'
          }
        },
        join: {
          tag: 'Join Our Family',
          title: 'Become a',
          titleItalic: 'Member',
          desc: 'We are always looking for passionate souls to join our journey. Let\'s make an impact together!',
          form: {
            name: 'Your Name',
            email: 'Email Address',
            reason: 'Why do you want to join us?',
            submit: 'Apply to Join'
          }
        }
      },
      events: {
        tag: 'Calendar',
        title: 'Upcoming',
        titleItalic: 'Events',
        subtitle: 'From cultural festivals to educational workshops, join us in celebrating and experiencing Mongolian heritage.',
        register: 'Register Now',
        nextUpcoming: 'Next Upcoming Event',
        viewDetails: 'View Details',
        price: 'Price',
        date: 'Date',
        time: 'Time',
        location: 'Location',
        category: 'Category',
        tba: 'TBA',
        vienna: 'Vienna',
        defaultCategory: 'Event',
        bespoke: {
          title: 'Bespoke',
          titleItalic: 'Cultural Experiences',
          desc: 'We offer private cultural consulting and bespoke event planning for organizations and individuals seeking a deeper connection with Mongolian heritage.',
          cta: 'Inquire Privately'
        },
        details: {
          notFound: 'Event not found',
          back: 'Back to Events',
          category: 'Cultural Event',
          date: 'Date',
          time: 'Time',
          location: 'Location',
          included: "What's Included",
          fee: 'Registration Fee',
          cta: 'Secure Your Spot'
        }
      },
      news: {
        tag: 'Journal',
        title: 'Insights &',
        titleItalic: 'Updates',
        subtitle: 'Stay informed about our community activities, cultural insights, and organizational updates.',
        readMore: 'Read More',
        readFull: 'Read Full Story',
        featured: 'Featured',
        update: 'Update',
        noNews: 'No journal entries found at this time.',
        postedOn: 'Posted on',
        newsletter: {
          title: 'Stay',
          titleItalic: 'Informed',
          desc: 'Subscribe to our quarterly journal for exclusive insights into the cultural and economic landscape of Austria and Mongolia.',
          placeholder: 'Email Address',
          cta: 'Subscribe'
        }
      },
      gallery: {
        tag: 'Exhibition',
        title: 'Visual',
        titleItalic: 'Heritage',
        subtitle: 'Explore a curated collection of Mongolian art, photography, and traditional crafts.',
        all: 'All Works',
        painting: 'Painting',
        photography: 'Photography',
        crafts: 'Crafts',
        traditional: 'Traditional',
        contemporary: 'Contemporary',
        crossCultural: 'Cross-Cultural',
        viewArtwork: 'View Artwork',
        by: 'by',
        submission: {
          title: 'Showcase Your',
          titleItalic: 'Vision',
          desc: 'We are always looking for talented artists to feature in our physical and digital exhibitions. Share your work with our international community.',
          cta: 'Submit Portfolio'
        },
        artworks: {
          spirit: { title: 'Spirit of the Steppe', artist: 'Bat-Erdene B.' },
          nomad: { title: "Nomad's Journey", artist: 'Saran G.' },
          vienna: { title: 'Vienna Blue', artist: 'Enkhmaa T.' },
          sky: { title: 'Eternal Sky', artist: 'Ochir P.' },
          gobi: { title: 'Golden Gobi', artist: 'Tsolmon D.' },
          urban: { title: 'Urban Nomad', artist: 'Zorigoo S.' }
        }
      },
      impact: {
        tag: 'Our Legacy',
        title: 'Measurable',
        titleItalic: 'Impact',
        subtitle: 'At our core, we are driven by impact. Through our donation initiatives, we foster a spirit of solidarity, cultural exchange, and social responsibility.',
        totalImpact: 'Total Impact in 2025',
        initiatives: {
          tag: 'Core',
          title: 'Initiatives',
          desc: 'Our work is focused on three strategic pillars that drive sustainable growth and cultural understanding.',
          preservation: 'Cultural Preservation',
          preservationDesc: 'Supporting traditional Mongolian arts, music, and language programs across Europe.',
          bridge: 'Economic Bridge',
          bridgeDesc: 'Facilitating trade and investment opportunities between Austrian and Mongolian enterprises.',
          exchange: 'Educational Exchange',
          exchangeDesc: 'Creating pathways for academic collaboration and student exchange programs.'
        },
        donate: 'Donate Now',
        goal: 'Goal',
        transparency: {
          title: 'Commitment to',
          titleItalic: 'Transparency',
          desc: 'As a non-profit organization, we maintain the highest standards of financial accountability and ethical governance. Our annual reports are available for public review.',
          cta: 'Download Annual Report'
        },
        report: 'Download 2025 Impact Report (PDF)',
        stats: {
          events: 'Cultural Events',
          members: 'Community Members',
          scholarships: 'Scholarships Awarded',
          partnerships: 'Business Partnerships'
        },
        donation: {
          tag: 'Support Our Mission',
          title1: 'Your',
          title2: 'Generosity',
          title3: 'Preserves',
          title4: 'Heritage',
          mainDesc: 'Every contribution, no matter the size, helps us keep the Mongolian spirit alive in the heart of Europe. Your support directly funds cultural education, community events, and heritage preservation.',
          impactNote: '100% of your donation goes directly to our initiatives.',
          taxNote: 'We are a registered non-profit organization.',
          chooseAmount: 'Choose an Amount',
          oneTime: 'One-time contribution',
          small: 'Provides educational materials for one child.',
          medium: 'Supports a cultural workshop for the community.',
          large: 'Funds the preservation of traditional artifacts.',
          extra: 'Sponsors a major cultural exchange event.',
          customPlaceholder: 'Enter custom amount',
          customCta: 'Donate Custom Amount',
          secure: 'Secure Payment via Stripe',
          invalidAmount: 'Please enter a valid amount.',
          successTitle: 'Thank You for Your Support!',
          successDesc: 'Your contribution makes a real difference.'
        }
      },
      footer: {
        desc: 'A prestigious cultural institution in Vienna, dedicated to fostering elite partnerships and preserving the rich heritage of Mongolia through art, diplomacy, and community.',
        navTitle: 'Navigation',
        legalTitle: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        imprint: 'Imprint',
        governance: 'Governance',
        copyright: '© 2026 Mongolian Center in Austria. ZVR: 123456789',
        vienna: 'Vienna',
        ulaanbaatar: 'Ulaanbaatar'
      },
      contact: {
        tag: 'Get in Touch',
        title: 'Connect with',
        titleItalic: 'Us',
        subtitle: 'Have questions or want to get involved? Reach out to our team in Vienna.',
        info: {
          location: 'Location',
          vienna: 'Vienna, Austria',
          hub: 'Cultural Hub & Gallery',
          email: 'Email',
          phone: 'Phone',
          hours: 'Mon-Fri, 10:00 - 18:00',
          quote: '"Bridging cultures through meaningful dialogue and sustainable partnerships."'
        },
        form: {
          title: 'Send us a Message',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email Address',
          subject: 'Subject',
          message: 'Message',
          send: 'Send Message',
          placeholders: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            message: 'How can we help you?'
          },
          subjects: {
            general: 'General Inquiry',
            investment: 'Investment Opportunities',
            cultural: 'Cultural Partnerships',
            events: 'Event Collaboration'
          }
        },
        success: 'Message sent successfully!',
        error: 'Failed to send message. Please try again.'
      },
      cookies: {
        title: 'Privacy & Heritage',
        description: 'To preserve the digital experience of our cultural center, we use cookies. Some are essential for the site to function, while others help us understand our community better. In accordance with Austrian DSGVO standards, you have full control over your data.',
        policy: 'Privacy Policy',
        settings: 'Settings',
        reject: 'Reject All',
        accept: 'Accept All',
        preferences: 'Data Preferences',
        save: 'Save Preferences',
        essential: 'Essential',
        essentialDesc: 'Required for the site to function securely.',
        analytics: 'Analytics',
        analyticsDesc: 'Helps us understand visitor patterns.',
        marketing: 'Marketing',
        marketingDesc: 'Used for cultural event outreach.'
      },
      marquee: {
        next: 'Next Upcoming Event'
      }
    }
  },
  de: {
    translation: {
      nav: {
        home: 'Startseite',
        about: 'Über uns',
        events: 'Veranstaltungen',
        news: 'Neuigkeiten',
        gallery: 'Galerie',
        impact: 'Wirkung',
        contact: 'Kontakt',
        signIn: 'Anmelden',
        signOut: 'Abmelden',
        mongolian: 'Mongolisches',
        center: 'Zentrum',
        location: 'Wien • Österreich',
        admin: 'Admin',
        member: 'Mitglied'
      },
      common: {
        locale: 'de-AT',
        back: 'Zurück',
        loading: 'Wird geladen...',
        register: 'Jetzt registrieren',
        or: 'oder',
        error: {
          signIn: 'Anmeldung fehlgeschlagen. Bitte prüfen Sie, ob Popups blockiert sind.',
          server: 'Serverfehler: {{status}}',
          checkout: 'Keine Checkout-URL vom Server erhalten',
          unexpected: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        }
      },
      hero: {
        tag: 'Wien • Österreich',
        title: 'Kulturen verbinden,',
        titleItalic: 'Gemeinschaft aufbauen',
        subtitle: 'Willkommen auf der offiziellen Website des Mongolischen Zentrums in Wien. Wir sind ein lebendiges kulturelles Zentrum, das sich der Bewahrung unseres Erbes, der Förderung der Gemeinschaftsintegration und der Feier der vielfältigen mongolischen Traditionen im Herzen Österreichs widmet.',
        ctaEvents: 'Veranstaltungen erkunden',
        ctaImpact: 'Unsere Wirkung',
        ctaStory: 'Unsere Geschichte',
        established: 'Gegründet'
      },
      pillars: {
        title: 'Unsere Kernsäulen',
        community: {
          title: 'Gemeinschaftszentrum',
          desc: 'Ein Raum, in dem sich Mongolen und Einheimische durch Networking und gemeinsame Erfahrungen vernetzen.'
        },
        arts: {
          title: 'Kunst & Galerie',
          desc: 'Präsentation traditioneller und zeitgenössischer mongolischer Künstler in interkulturellen Ausstellungen.'
        },
        impact: {
          title: 'Soziale Wirkung',
          desc: 'Förderung der Solidarität durch Spendeninitiativen zur Unterstützung von Anliegen in Österreich und der Mongolei.'
        }
      },
      legacy: {
        title: 'Das Erbe der',
        titleItalic: 'Großen Steppe',
        quote: '"Vom weiten Horizont des mongolischen Plateaus bis ins Herz Wiens tragen wir den Geist der Nomaden in uns – widerstandsfähig, frei und tief mit unseren Wurzeln verbunden."',
        archery: 'Bogenschießen',
        tradition: 'Tradition',
        horsemanship: 'Reitkunst',
        freedom: 'Freiheit',
        wrestling: 'Ringen',
        strength: 'Stärke',
        wisdom: 'Weisheit',
        heritage: 'Erbe'
      },
      highlight: {
        tag: 'Highlight',
        title: 'Kulturfestival:',
        titleItalic: 'Echos der Steppe',
        desc: 'Begleiten Sie uns zu einem immersiven Wochenende mit mongolischer Musik, traditionellem Tanz und kulinarischen Köstlichkeiten. Erleben Sie das reiche Erbe der Mongolei direkt hier in Wien.',
        date: '15.-17. Juni 2026',
        nextEvent: 'Nächste Veranstaltung',
        audience: 'Offen für alle Community-Mitglieder',
        cta: 'Alle Veranstaltungen ansehen'
      },
      impactCta: {
        title: 'Gemeinsam etwas bewirken',
        desc: 'Ihre Unterstützung hilft uns, diese kulturelle Brücke aufrechtzuerhalten und soziale Initiativen sowohl in Österreich als auch in der Mongolei zu finanzieren.',
        cta: 'Unsere Initiativen unterstützen'
      },
      about: {
        tag: 'Unsere Geschichte',
        story: 'Unsere Geschichte &',
        mission: 'Mission',
        bridging: 'Brücken',
        cultures: 'bauen',
        founded: 'Gegründet in Wien, entstand das Mongolische Zentrum in Österreich aus der Vision, ein engagiertes Zuhause für kulturellen Austausch, künstlerischen Ausdruck und gemeinschaftliche Solidarität zu schaffen.',
        heritage: 'Unser Erbe',
        hubTitle: 'Ein lebendiger Knotenpunkt in Wien',
        hubDesc1: 'Das Mongolische Zentrum in Österreich ist eine dynamische NGO mit Sitz in Wien, die sich dem Aufbau eines lebendigen Kultur- und Gemeinschaftszentrums für Mongolen und Einheimische widmet. Es dient als Raum, in dem Menschen durch sorgfältig kuratierte Veranstaltungen in Kontakt treten, die mongolische Kultur erleben und feiern können.',
        hubDesc2: 'Unsere Aktivitäten reichen von hochkarätigen Networking-Treffen, die berufliche Verbindungen fördern, bis hin zu farbenfrohen Kulturfestivals und Bildungs-Workshops, die unsere Traditionen für die nächste Generation am Leben erhalten.',
        hubDesc3: 'Wir glauben, dass Kultur ein lebendiges, atmendes Wesen ist. Indem wir mongolische Traditionen in das Herz Europas bringen, schaffen wir einen Dialog, der beide Gemeinschaften bereichert.',
        vision: {
          title: 'Unsere Vision',
          desc: 'Die primäre Brücke zwischen Österreich und der Mongolei zu sein und eine Welt zu fördern, in der kulturelle Vielfalt gefeiert wird und Gemeinschaftsbindungen unzerbrechlich sind.'
        },
        values: {
          tag: 'Grundprinzipien',
          title: 'Unsere Werte',
          desc: 'Solidarität, kulturelle Integrität, soziale Verantwortung und künstlerische Exzellenz leiten jede unserer Initiativen.'
        },
        impact: {
          title: 'Unsere Wirkung',
          desc: 'Durch unsere Spendeninitiativen unterstützen wir sinnvolle Anliegen sowohl lokal in Wien als auch in den weiten Landschaften der Mongolei.'
        },
        team: {
          tag: 'Die Leitung',
          title: 'Unser Team',
          quote: '"Engagierte Fachleute, die sich für die Bewahrung und Förderung des mongolischen Erbes in Europa einsetzen."',
          roles: {
            director: 'Geschäftsführender Direktor',
            manager: 'Kulturprogramm-Manager',
            outreach: 'Gemeinschaftsarbeit'
          }
        },
        join: {
          tag: 'Werden Sie Teil unserer Familie',
          title: 'Werden Sie',
          titleItalic: 'Mitglied',
          desc: 'Wir sind immer auf der Suche nach leidenschaftlichen Seelen, die sich unserer Reise anschließen. Lassen Sie uns gemeinsam etwas bewirken!',
          form: {
            name: 'Ihr Name',
            email: 'E-Mail-Adresse',
            reason: 'Warum möchten Sie sich uns anschließen?',
            submit: 'Bewerben'
          }
        }
      },
      events: {
        tag: 'Kalender',
        title: 'Kommende',
        titleItalic: 'Veranstaltungen',
        subtitle: 'Von Kulturfestivals bis hin zu Bildungs-Workshops – feiern und erleben Sie mit uns das mongolische Erbe.',
        register: 'Jetzt registrieren',
        nextUpcoming: 'Nächste Veranstaltung',
        viewDetails: 'Details anzeigen',
        price: 'Preis',
        date: 'Datum',
        time: 'Uhrzeit',
        location: 'Ort',
        category: 'Kategorie',
        tba: 'Wird noch bekannt gegeben',
        vienna: 'Wien',
        defaultCategory: 'Veranstaltung',
        bespoke: {
          title: 'Maßgeschneiderte',
          titleItalic: 'Kulturelle Erlebnisse',
          desc: 'Wir bieten private Kulturberatung und maßgeschneiderte Veranstaltungsplanung für Organisationen und Einzelpersonen, die eine tiefere Verbindung zum mongolischen Erbe suchen.',
          cta: 'Privat anfragen'
        },
        details: {
          notFound: 'Veranstaltung nicht gefunden',
          back: 'Zurück zu den Veranstaltungen',
          category: 'Kulturveranstaltung',
          date: 'Datum',
          time: 'Zeit',
          location: 'Ort',
          included: 'Was ist enthalten',
          fee: 'Anmeldegebühr',
          cta: 'Sichern Sie sich Ihren Platz'
        }
      },
      news: {
        tag: 'Journal',
        title: 'Einblicke &',
        titleItalic: 'Updates',
        subtitle: 'Bleiben Sie über unsere Gemeinschaftsaktivitäten, kulturellen Einblicke und organisatorischen Updates informiert.',
        readMore: 'Weiterlesen',
        readFull: 'Ganze Geschichte lesen',
        featured: 'Hervorgehoben',
        update: 'Update',
        noNews: 'Derzeit keine Journal-Einträge gefunden.',
        postedOn: 'Veröffentlicht am',
        newsletter: {
          title: 'Bleiben Sie',
          titleItalic: 'informiert',
          desc: 'Abonnieren Sie unser vierteljährliches Journal für exklusive Einblicke in die kulturelle und wirtschaftliche Landschaft Österreichs und der Mongolei.',
          placeholder: 'E-Mail-Adresse',
          cta: 'Abonnieren'
        }
      },
      gallery: {
        tag: 'Ausstellung',
        title: 'Visuelles',
        titleItalic: 'Erbe',
        subtitle: 'Entdecken Sie eine kuratierte Sammlung mongolischer Kunst, Fotografie und traditionellem Handwerk.',
        all: 'Alle Werke',
        painting: 'Malerei',
        photography: 'Fotografie',
        crafts: 'Handwerk',
        traditional: 'Traditionell',
        contemporary: 'Zeitgenössisch',
        crossCultural: 'Interkulturell',
        viewArtwork: 'Kunstwerk ansehen',
        by: 'von',
        submission: {
          title: 'Präsentieren Sie Ihre',
          titleItalic: 'Vision',
          desc: 'Wir sind immer auf der Suche nach talentierten Künstlern, die wir in unseren physischen und digitalen Ausstellungen präsentieren können. Teilen Sie Ihre Arbeit mit unserer internationalen Community.',
          cta: 'Portfolio einreichen'
        },
        artworks: {
          spirit: { title: 'Geist der Steppe', artist: 'Bat-Erdene B.' },
          nomad: { title: 'Reise des Nomaden', artist: 'Saran G.' },
          vienna: { title: 'Wiener Blau', artist: 'Enkhmaa T.' },
          sky: { title: 'Ewiger Himmel', artist: 'Ochir P.' },
          gobi: { title: 'Goldene Gobi', artist: 'Tsolmon D.' },
          urban: { title: 'Urbaner Nomade', artist: 'Zorigoo S.' }
        }
      },
      impact: {
        tag: 'Unser Erbe',
        title: 'Messbare',
        titleItalic: 'Wirkung',
        subtitle: 'Im Kern sind wir von Wirkung getrieben. Durch unsere Spendeninitiativen fördern wir einen Geist der Solidarität, des kulturellen Austauschs und der sozialen Verantwortung.',
        totalImpact: 'Gesamtwirkung im Jahr 2025',
        initiatives: {
          tag: 'Kern-',
          title: 'Initiativen',
          desc: 'Unsere Arbeit konzentriert sich auf drei strategische Säulen, die nachhaltiges Wachstum und kulturelles Verständnis fördern.',
          preservation: 'Kulturelle Bewahrung',
          preservationDesc: 'Unterstützung traditioneller mongolischer Kunst-, Musik- und Sprachprogramme in ganz Europa.',
          bridge: 'Wirtschaftliche Brücke',
          bridgeDesc: 'Erleichterung von Handels- und Investitionsmöglichkeiten zwischen österreichischen und mongolischen Unternehmen.',
          exchange: 'Bildungsaustausch',
          exchangeDesc: 'Schaffung von Wegen für akademische Zusammenarbeit und Studentenaustauschprogramme.'
        },
        donate: 'Jetzt spenden',
        goal: 'Ziel',
        transparency: {
          title: 'Engagement für',
          titleItalic: 'Transparenz',
          desc: 'Als gemeinnützige Organisation halten wir höchste Standards an finanzieller Rechenschaftspflicht und ethischer Führung ein. Unsere Jahresberichte stehen zur öffentlichen Einsichtnahme zur Verfügung.',
          cta: 'Jahresbericht herunterladen'
        },
        report: 'Impact Report 2025 herunterladen (PDF)',
        stats: {
          events: 'Kulturveranstaltungen',
          members: 'Community-Mitglieder',
          scholarships: 'Vergebene Stipendien',
          partnerships: 'Geschäftspartnerschaften'
        },
        donation: {
          tag: 'Unterstützen Sie unsere Mission',
          title1: 'Ihre',
          title2: 'Großzügigkeit',
          title3: 'Bewahrt',
          title4: 'Erbe',
          mainDesc: 'Jeder Beitrag, egal wie groß, hilft uns, den mongolischen Geist im Herzen Europas lebendig zu halten. Ihre Unterstützung finanziert direkt kulturelle Bildung, Gemeinschaftsveranstaltungen und die Bewahrung des Erbes.',
          impactNote: '100% Ihrer Spende gehen direkt in unsere Initiativen.',
          taxNote: 'Wir sind eine eingetragene gemeinnützige Organisation.',
          chooseAmount: 'Wählen Sie einen Betrag',
          oneTime: 'Einmalige Spende',
          small: 'Stellt Lehrmaterialien für ein Kind bereit.',
          medium: 'Unterstützt einen Kulturworkshop für die Gemeinschaft.',
          large: 'Finanziert die Bewahrung traditioneller Artefakte.',
          extra: 'Sponsert eine große kulturelle Austauschveranstaltung.',
          customPlaceholder: 'Benutzerdefinierten Betrag eingeben',
          customCta: 'Benutzerdefinierten Betrag spenden',
          secure: 'Sichere Zahlung über Stripe',
          invalidAmount: 'Bitte geben Sie einen gültigen Betrag ein.',
          successTitle: 'Vielen Dank für Ihre Unterstützung!',
          successDesc: 'Ihr Beitrag macht einen echten Unterschied.'
        }
      },
      footer: {
        desc: 'Eine renommierte Kulturinstitution in Wien, die sich der Förderung hochkarätiger Partnerschaften und der Bewahrung des reichen Erbes der Mongolei durch Kunst, Diplomatie und Gemeinschaft widmet.',
        navTitle: 'Navigation',
        legalTitle: 'Rechtliches',
        privacy: 'Datenschutzerklärung',
        terms: 'Nutzungsbedingungen',
        imprint: 'Impressum',
        governance: 'Governance',
        copyright: '© 2026 Mongolisches Zentrum in Österreich. ZVR: 123456789',
        vienna: 'Wien',
        ulaanbaatar: 'Ulaanbaatar'
      },
      contact: {
        tag: 'Kontakt aufnehmen',
        title: 'Verbinden Sie sich mit',
        titleItalic: 'uns',
        subtitle: 'Haben Sie Fragen oder möchten Sie sich engagieren? Kontaktieren Sie unser Team in Wien.',
        info: {
          location: 'Standort',
          vienna: 'Wien, Österreich',
          hub: 'Kulturzentrum & Galerie',
          email: 'E-Mail',
          phone: 'Telefon',
          hours: 'Mo-Fr, 10:00 - 18:00',
          quote: '"Kulturen durch bedeutungsvollen Dialog und nachhaltige Partnerschaften verbinden."'
        },
        form: {
          title: 'Schreiben Sie uns eine Nachricht',
          firstName: 'Vorname',
          lastName: 'Nachname',
          email: 'E-Mail-Adresse',
          subject: 'Betreff',
          message: 'Nachricht',
          send: 'Nachricht senden',
          placeholders: {
            firstName: 'Max',
            lastName: 'Mustermann',
            email: 'max@beispiel.de',
            message: 'Wie können wir Ihnen helfen?'
          },
          subjects: {
            general: 'Allgemeine Anfrage',
            investment: 'Investitionsmöglichkeiten',
            cultural: 'Kulturelle Partnerschaften',
            events: 'Veranstaltungszusammenarbeit'
          }
        },
        success: 'Nachricht erfolgreich gesendet!',
        error: 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.'
      },
      cookies: {
        title: 'Datenschutz & Erbe',
        description: 'Um das digitale Erlebnis unseres Kulturzentrums zu bewahren, verwenden wir Cookies. Einige sind für das Funktionieren der Website unerlässlich, während andere uns helfen, unsere Gemeinschaft besser zu verstehen. Gemäß den österreichischen DSGVO-Standards haben Sie die volle Kontrolle über Ihre Daten.',
        policy: 'Datenschutzerklärung',
        settings: 'Einstellungen',
        reject: 'Alle ablehnen',
        accept: 'Alle akzeptieren',
        preferences: 'Dateneinstellungen',
        save: 'Einstellungen speichern',
        essential: 'Essenziell',
        essentialDesc: 'Erforderlich für das sichere Funktionieren der Website.',
        analytics: 'Analyse',
        analyticsDesc: 'Hilft uns, Besuchermuster zu verstehen.',
        marketing: 'Marketing',
        marketingDesc: 'Wird für die Bekanntmachung kultureller Veranstaltungen verwendet.'
      },
      marquee: {
        next: 'Nächste bevorstehende Veranstaltung'
      }
    }
  },
  mn: {
    translation: {
      nav: {
        home: 'Нүүр',
        about: 'Бидний тухай',
        events: 'Арга хэмжээ',
        news: 'Мэдээ',
        gallery: 'Галлерей',
        impact: 'Нөлөөлөл',
        contact: 'Холбоо барих',
        signIn: 'Нэвтрэх',
        signOut: 'Гарах',
        mongolian: 'Монгол',
        center: 'Төв',
        location: 'Вена • Австри',
        admin: 'Админ',
        member: 'Гишүүн'
      },
      common: {
        locale: 'mn-MN',
        back: 'Буцах',
        loading: 'Уншиж байна...',
        register: 'Бүртгүүлэх',
        or: 'эсвэл',
        error: {
          signIn: 'Нэвтэрч чадсангүй. Поп-ап хаагдсан эсэхийг шалгана уу.',
          server: 'Серверийн алдаа: {{status}}',
          checkout: 'Төлбөрийн холбоос хүлээн авсангүй',
          unexpected: 'Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.'
        }
      },
      hero: {
        tag: 'Вена • Австри',
        title: 'Соёлыг холбож,',
        titleItalic: 'Хамт олныг бүтээнэ',
        subtitle: 'Вена дахь Монгол Төвийн албан ёсны цахим хуудсанд тавтай морилно уу. Бид Австри улсын зүрхэнд монгол соёлын баялаг өв уламжлалыг хадгалан хамгаалах, хамт олны эв нэгдлийг дэмжих, тэмдэглэн өнгөрүүлэх зорилготой эрч хүчтэй соёлын төв юм.',
        ctaEvents: 'Арга хэмжээ үзэх',
        ctaImpact: 'Бидний нөлөө',
        ctaStory: 'Бидний түүх',
        established: 'Байгуулагдсан'
      },
      pillars: {
        title: 'Бидний тулгуур багана',
        community: {
          title: 'Хамт олны төв',
          desc: 'Монголчууд болон нутгийн иргэд хоорондоо танилцаж, туршлага хуваалцах орон зай.'
        },
        arts: {
          title: 'Урлаг ба Галлерей',
          desc: 'Монголын уламжлалт болон орчин үеийн уран бүтээлчдийг олон улсын үзэсгэлэнд танилцуулах.'
        },
        impact: {
          title: 'Нийгмийн нөлөө',
          desc: 'Австри болон Монгол дахь сайн үйлсийн аяныг дэмжих замаар эв нэгдлийг бэхжүүлэх.'
        }
      },
      legacy: {
        title: 'Их талын',
        titleItalic: 'Өв соёл',
        quote: '"Монголын өргөн уудам тал нутгаас Вена хотын зүрх хүртэл бид нүүдэлчин соёлынхоо тэсвэр хатуужил, эрх чөлөө, язгуур үндэснийхээ үзэл санааг тээж явна."',
        archery: 'Сур харваа',
        tradition: 'Уламжлал',
        horsemanship: 'Морин спорт',
        freedom: 'Эрх чөлөө',
        wrestling: 'Бөх',
        strength: 'Хүч чадал',
        wisdom: 'Мэргэн ухаан',
        heritage: 'Өв соёл'
      },
      highlight: {
        tag: 'Онцлох',
        title: 'Соёлын наадам:',
        titleItalic: 'Талын цуурай',
        desc: 'Монгол хөгжим, уламжлалт бүжиг, амтат хоолтой мартагдашгүй амралтын өдрүүдэд бидэнтэй нэгдээрэй. Монголын баялаг өв соёлыг Вена хотод мэдрээрэй.',
        date: '2026 оны 6-р сарын 15-17',
        nextEvent: 'Дараагийн арга хэмжээ',
        audience: 'Бүх хүнд нээлттэй',
        cta: 'Бүх арга хэмжээг үзэх'
      },
      impactCta: {
        title: 'Хамтдаа өөрчлөлтийг бүтээе',
        desc: 'Таны дэмжлэг бидэнд соёлын гүүрийг хадгалах, Австри болон Монгол дахь нийгмийн санаачилгыг санхүүжүүлэхэд тусална.',
        cta: 'Биднийг дэмжих'
      },
      about: {
        tag: 'Бидний түүх',
        story: 'Бидний түүх ба',
        mission: 'Зорилго',
        bridging: 'Соёлыг',
        cultures: 'холбоно',
        founded: 'Вена хотод байгуулагдсан Австри дахь Монгол Төв нь соёлын солилцоо, уран сайхны илэрхийлэл, хамт олны эв нэгдлийн төлөөх алсын хараанаас үүссэн юм.',
        heritage: 'Бидний өв уламжлал',
        hubTitle: 'Вена дахь эрч хүчтэй төв',
        hubDesc1: 'Австри дахь Монгол Төв нь Вена хотод төвтэй, монголчууд болон нутгийн иргэдэд зориулсан соёл, хамт олны төвийг байгуулах зорилготой идэвхтэй ТББ юм. Энэ нь хүмүүс хоорондоо холбогдож, монгол соёлыг мэдэрч, тэмдэглэх орон зай юм.',
        hubDesc2: 'Бидний үйл ажиллагаа нь мэргэжлийн харилцааг дэмжих уулзалтуудаас эхлээд соёлын наадам, уламжлалаа хойч үедээ өвлүүлэн үлдээх сургалт семинар хүртэл өргөн хүрээг хамардаг.',
        hubDesc3: 'Соёл бол амьд оршихуй гэдэгт бид итгэдэг. Монгол уламжлалыг Европын зүрхэнд авчирснаар бид хоёр орны хамт олныг баяжуулах яриа хэлцлийг бий болгодог.',
        vision: {
          title: 'Алсын хараа',
          desc: 'Австри болон Монгол улсын хоорондох гол гүүр болж, соёлын олон янз байдлыг тэмдэглэдэг, хамт олны хэлхээ холбоо бат бөх ертөнцийг цогцлоох.'
        },
        values: {
          tag: 'Үндсэн зарчим',
          title: 'Үнэт зүйлс',
          desc: 'Эв нэгдэл, соёлын бүрэн бүтэн байдал, нийгмийн хариуцлага, уран сайхны шилдэг байдал нь бидний санаачилга бүрийн үндэс юм.'
        },
        impact: {
          title: 'Бидний нөлөө',
          desc: 'Бид сайн үйлсийн аянаараа дамжуулан Вена хот болон Монгол орны өргөн уудам нутаг дэвсгэрт хэрэгтэй тусламжийг үзүүлдэг.'
        },
        team: {
          tag: 'Удирдлага',
          title: 'Манай баг',
          quote: '"Европ дахь Монгол өв соёлыг хадгалан хамгаалах, сурталчлах үйлсэд зүтгэж буй мэргэжлийн баг хамт олон."',
          roles: {
            director: 'Гүйцэтгэх захирал',
            manager: 'Соёлын хөтөлбөрийн менежер',
            outreach: 'Олон нийтийн харилцаа'
          }
        },
        join: {
          tag: 'Манай гэр бүлд нэгдээрэй',
          title: 'Гишүүн',
          titleItalic: 'Болох',
          desc: 'Бидний аялалд нэгдэх хүсэл тэмүүлэлтэй хүмүүсийг бид үргэлж хайж байдаг. Хамтдаа өөрчлөлтийг бүтээцгээе!',
          form: {
            name: 'Таны нэр',
            email: 'Имэйл хаяг',
            reason: 'Та яагаад бидэнтэй нэгдэхийг хүсэж байна вэ?',
            submit: 'Өргөдөл илгээх'
          }
        }
      },
      events: {
        tag: 'Хуанли',
        title: 'Удахгүй болох',
        titleItalic: 'Арга хэмжээ',
        subtitle: 'Соёлын наадмаас эхлээд сургалт семинар хүртэл монгол өв соёлыг тэмдэглэх, мэдрэх арга хэмжээнд нэгдээрэй.',
        register: 'Одоо бүртгүүлэх',
        nextUpcoming: 'Дараагийн арга хэмжээ',
        viewDetails: 'Дэлгэрэнгүй үзэх',
        price: 'Үнэ',
        date: 'Огноо',
        time: 'Цаг',
        location: 'Байршил',
        category: 'Төрөл',
        tba: 'Удахгүй зарлана',
        vienna: 'Вена',
        defaultCategory: 'Арга хэмжээ',
        bespoke: {
          title: 'Тусгай',
          titleItalic: 'Соёлын туршлага',
          desc: 'Бид Монгол өв соёлтой илүү гүнзгий холбогдохыг хүссэн байгууллага, хувь хүмүүст зориулсан соёлын зөвлөгөө, тусгай арга хэмжээний төлөвлөлтийг санал болгож байна.',
          cta: 'Хувиар холбогдох'
        },
        details: {
          notFound: 'Арга хэмжээ олдсонгүй',
          back: 'Арга хэмжээ рүү буцах',
          category: 'Соёлын арга хэмжээ',
          date: 'Огноо',
          time: 'Цаг',
          location: 'Байршил',
          included: 'Багтсан зүйлс',
          fee: 'Бүртгэлийн хураамж',
          cta: 'Суудлаа баталгаажуулах'
        }
      },
      news: {
        tag: 'Сэтгүүл',
        title: 'Мэдээлэл ба',
        titleItalic: 'Шинэчлэлт',
        subtitle: 'Манай хамт олны үйл ажиллагаа, соёлын мэдээлэл, байгууллагын шинэчлэлийн талаар мэдээлэлтэй байгаарай.',
        readMore: 'Дэлгэрэнгүй',
        readFull: 'Бүрэн эхийг унших',
        featured: 'Онцлох',
        update: 'Шинэчлэлт',
        noNews: 'Одоогоор сэтгүүл олдсонгүй.',
        postedOn: 'Нийтэлсэн огноо',
        newsletter: {
          title: 'Мэдээлэлтэй',
          titleItalic: 'байх',
          desc: 'Австри болон Монгол улсын соёл, эдийн засгийн байдлын талаарх онцлох мэдээллийг авахын тулд манай улирал тутмын сэтгүүлд бүртгүүлээрэй.',
          placeholder: 'Имэйл хаяг',
          cta: 'Бүртгүүлэх'
        }
      },
      gallery: {
        tag: 'Үзэсгэлэн',
        title: 'Дүрслэх',
        titleItalic: 'Өв соёл',
        subtitle: 'Монголын урлаг, гэрэл зураг, уламжлалт гар урлалын цуглуулгатай танилцаарай.',
        all: 'Бүх бүтээл',
        painting: 'Уран зураг',
        photography: 'Гэрэл зураг',
        crafts: 'Гар урлал',
        traditional: 'Уламжлалт',
        contemporary: 'Орчин үеийн',
        crossCultural: 'Олон соёлын',
        viewArtwork: 'Бүтээлийг үзэх',
        by: '-ийн',
        submission: {
          title: 'Өөрийн',
          titleItalic: 'төсөөллөө харуул',
          desc: 'Бид биет болон дижитал үзэсгэлэндээ авьяаслаг уран бүтээлчдийг оролцуулахдаа үргэлж таатай байдаг. Өөрийн бүтээлээ манай олон улсын хамт олонтой хуваалцаарай.',
          cta: 'Портфолио илгээх'
        },
        artworks: {
          spirit: { title: 'Талын сүнс', artist: 'Бат-Эрдэнэ Б.' },
          nomad: { title: 'Нүүдэлчний аялал', artist: 'Саран Г.' },
          vienna: { title: 'Вена цэнхэр', artist: 'Энхмаа Т.' },
          sky: { title: 'Мөнх тэнгэр', artist: 'Очир П.' },
          gobi: { title: 'Алтан говь', artist: 'Цолмон Д.' },
          urban: { title: 'Хотын нүүдэлчин', artist: 'Зоригоо С.' }
        }
      },
      impact: {
        tag: 'Бидний өв',
        title: 'Хэмжигдэхүйц',
        titleItalic: 'Нөлөөлөл',
        subtitle: 'Бидний үйл ажиллагааны цөм нь нөлөөлөл юм. Сайн үйлсийн аянаараа дамжуулан бид эв нэгдэл, соёлын солилцоо, нийгмийн хариуцлагыг дэмждэг.',
        totalImpact: '2025 оны нийт нөлөөлөл',
        initiatives: {
          tag: 'Үндсэн',
          title: 'Санаачилга',
          desc: 'Бидний ажил тогтвортой өсөлт, соёлын ойлголтыг дэмжих гурван стратегийн тулгуур дээр төвлөрдөг.',
          preservation: 'Соёлын өвийг хадгалах',
          preservationDesc: 'Европ даяар Монголын уламжлалт урлаг, хөгжим, хэлний хөтөлбөрүүдийг дэмжих.',
          bridge: 'Эдийн засгийн гүүр',
          bridgeDesc: 'Австри болон Монголын аж ахуйн нэгжүүдийн хооронд худалдаа, хөрөнгө оруулалтын боломжийг хөнгөвчлөх.',
          exchange: 'Боловсролын солилцоо',
          exchangeDesc: 'Академик хамтын ажиллагаа болон оюутан солилцооны хөтөлбөрүүдийн замыг бий болгох.'
        },
        donate: 'Хандив өгөх',
        goal: 'Зорилго',
        transparency: {
          title: 'Ил тод',
          titleItalic: 'байдал',
          desc: 'Ашгийн бус байгууллагын хувьд бид санхүүгийн хариуцлага, ёс зүйн засаглалын хамгийн өндөр стандартыг баримталдаг. Манай жилийн тайлангууд олон нийтэд нээлттэй.',
          cta: 'Жилийн тайлан татах'
        },
        report: '2025 оны нөлөөллийн тайлан татах (PDF)',
        stats: {
          events: 'Соёлын арга хэмжээ',
          members: 'Хамт олны гишүүд',
          scholarships: 'Олгосон тэтгэлэг',
          partnerships: 'Бизнесийн түншлэл'
        },
        donation: {
          tag: 'Бидний зорилгыг дэмжих',
          title1: 'Таны',
          title2: 'Өгөөмөр сэтгэл',
          title3: 'Өв соёлыг',
          title4: 'Хамгаална',
          mainDesc: 'Хэмжээнээс үл хамааран хандив бүр Европын зүрхэнд монгол соёлын үзэл санааг амьд байлгахад тусалдаг. Таны дэмжлэг соёлын боловсрол, олон нийтийн арга хэмжээ, өв соёлыг хадгалан хамгаалахад шууд зарцуулагдана.',
          impactNote: 'Таны хандивын 100% нь бидний санаачилгад шууд зарцуулагдана.',
          taxNote: 'Бид бүртгэлтэй ашгийн бус байгууллага юм.',
          chooseAmount: 'Хэмжээгээ сонгоно уу',
          oneTime: 'Нэг удаагийн хандив',
          small: 'Нэг хүүхдэд сургалтын материал олгоно.',
          medium: 'Хамт олны соёлын сургалтыг дэмжинэ.',
          large: 'Уламжлалт олдворуудыг хадгалан хамгаалахад зарцуулна.',
          extra: 'Соёлын томоохон солилцооны арга хэмжээг ивээн тэтгэнэ.',
          customPlaceholder: 'Хэмжээгээ оруулна уу',
          customCta: 'Хандив өгөх',
          secure: 'Stripe-ээр дамжуулан найдвартай төлбөр тооцоо',
          invalidAmount: 'Хүчинтэй хэмжээ оруулна уу.',
          successTitle: 'Дэмжлэг үзүүлсэнд баярлалаа!',
          successDesc: 'Таны хувь нэмэр бодит өөрчлөлтийг авчирна.'
        }
      },
      footer: {
        desc: 'Вена хот дахь нэр хүндтэй соёлын байгууллага бөгөөд урлаг, дипломат харилцаа, хамт олноор дамжуулан Монголын баялаг өв соёлыг хадгалах, түншлэлийг дэмжих зорилготой.',
        navTitle: 'Цэс',
        legalTitle: 'Хууль эрх зүй',
        privacy: 'Нууцлалын бодлого',
        terms: 'Үйлчилгээний нөхцөл',
        imprint: 'Импринт',
        governance: 'Засаглал',
        copyright: '© 2026 Австри дахь Монгол Төв. ZVR: 123456789',
        vienna: 'Вена',
        ulaanbaatar: 'Улаанбаатар'
      },
      contact: {
        tag: 'Холбоо барих',
        title: 'Бидэнтэй',
        titleItalic: 'холбогдох',
        subtitle: 'Асуух зүйл байна уу эсвэл хамтран ажиллахыг хүсэж байна уу? Вена дахь манай багтай холбогдоорой.',
        info: {
          location: 'Байршил',
          vienna: 'Вена, Австри',
          hub: 'Соёлын төв ба Галлерей',
          email: 'Имэйл',
          phone: 'Утас',
          hours: 'Да-Ба, 10:00 - 18:00',
          quote: '"Утга учиртай яриа хэлцэл, тогтвортой түншлэлээр дамжуулан соёлыг холбоно."'
        },
        form: {
          title: 'Зурвас илгээх',
          firstName: 'Нэр',
          lastName: 'Овог',
          email: 'Имэйл хаяг',
          subject: 'Гарчиг',
          message: 'Зурвас',
          send: 'Зурвас илгээх',
          placeholders: {
            firstName: 'Бат',
            lastName: 'Болд',
            email: 'bat@example.com',
            message: 'Бид танд хэрхэн туслах вэ?'
          },
          subjects: {
            general: 'Ерөнхий асуулга',
            investment: 'Хөрөнгө оруулалтын боломж',
            cultural: 'Соёлын түншлэл',
            events: 'Арга хэмжээний хамтын ажиллагаа'
          }
        },
        success: 'Зурвас амжилттай илгээгдлээ!',
        error: 'Зурвас илгээхэд алдаа гарлаа. Дахин оролдоно уу.'
      },
      cookies: {
        title: 'Нууцлал ба Өв соёл',
        description: 'Манай соёлын төвийн дижитал туршлагыг хадгалахын тулд бид күүки ашигладаг. Зарим нь сайтын аюулгүй ажиллагаанд зайлшгүй шаардлагатай бол бусад нь манай хамт олныг илүү сайн ойлгоход тусалдаг. Австрийн DSGVO стандартын дагуу та өөрийн өгөгдлийг бүрэн хянах боломжтой.',
        policy: 'Нууцлалын бодлого',
        settings: 'Тохиргоо',
        reject: 'Бүгдээс татгалзах',
        accept: 'Бүгдийг зөвшөөрөх',
        preferences: 'Өгөгдлийн тохиргоо',
        save: 'Тохиргоог хадгалах',
        essential: 'Үндсэн',
        essentialDesc: 'Сайтын аюулгүй ажиллагаанд шаардлагатай.',
        analytics: 'Шинжилгээ',
        analyticsDesc: 'Зочдын хандалтыг ойлгоход тусална.',
        marketing: 'Маркетинг',
        marketingDesc: 'Соёлын арга хэмжээг сурталчлахад ашиглана.'
      },
      marquee: {
        next: 'Дараагийн удаа болох арга хэмжээ'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
