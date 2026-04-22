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
        subtitle: 'Welcome to the official platform of the Mongolian Center in Vienna. We are a Non-Governmental Organization dedicated to preserving our cultural heritage and fostering strong community ties in Austria. Through this website, you can explore our ongoing initiatives, view the schedule of upcoming cultural events, complete your registrations online, and stay updated with our latest news, projects, and organizational developments.',
        ctaEvents: 'Explore Events',
        ctaImpact: 'Our Mission',
        ctaStory: 'Our Heritage',
        established: 'Founded in'
      },
      pillars: {
        title: 'Strategic Pillars',
        community: {
          title: 'Community Engagement',
          desc: 'Fostering a premier network where Mongolian professionals, students, and local Austrian partners connect and collaborate.'
        },
        arts: {
          title: 'Cultural Diplomacy',
          desc: 'Elevating both traditional and contemporary Mongolian artistry through high-profile, cross-cultural exhibitions in Europe.'
        },
        impact: {
          title: 'Sustainable Impact',
          desc: 'Driving meaningful social change and civic solidarity through targeted philanthropic initiatives in Austria and Mongolia.'
        }
      },
      legacy: {
        title: 'A Call for',
        titleItalic: 'Collaboration',
        quote: 'We believe the greatest legacies are built together. We invite innovators, cultural leaders, and organizations to partner with us in forging a dynamic, collaborative bridge between Austria and Mongolia.',
        archery: 'Partnership',
        tradition: 'Unity',
        horsemanship: 'Innovation',
        freedom: 'Future',
        wrestling: 'Exchange',
        strength: 'Growth',
        wisdom: 'Vision',
        heritage: 'Impact'
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
        title: 'Drive Global Impact',
        desc: 'Partner with us to sustain this vital cultural bridge and sponsor bilateral social initiatives that generate measurable results.',
        cta: 'Partner With Us'
      },
      about: {
        tag: 'Our Story',
        story: 'Our Story &',
        mission: 'Vision',
        bridging: 'Our',
        cultures: 'Story',
        founded: 'Established in Vienna, the Mongolian Center in Austria  emerged from a strategic vision to cultivate a premier platform for bilateral cultural exchange, diplomatic relations, and socioeconomic solidarity.',
        heritage: 'Our Strategy',
        hubTitle: 'A Hub for Bilateral Excellence',
        hubDesc1: 'Operating from the heart of Europe, our NGO serves as a dynamic nexus connecting Mongolian heritage with European innovation. We facilitate high-leverage networking, cultural showcases, and collaborative ventures.',
        hubDesc2: 'Our portfolio spans executive networking symposiums, contemporary cultural diplomacy events, and academic workshops designed to foster long-term partnerships between Austria and Mongolia.',
        hubDesc3: 'We view culture as the ultimate foundation for mutual trust. By integrating Mongolian traditions with European contexts, we engineer alliances that yield both cultural enrichment and strategic growth.',
        vision: {
          title: 'Our Strategic Vision',
          desc: 'To stand as the definitive bridge connecting Austrian and Mongolian interests—advancing a future built on mutual respect, cultural diversity, and unbreakable strategic partnerships.'
        },
        values: {
          tag: 'Core Principles',
          title: 'Our Values',
          desc: 'Integrity, cultural diplomacy, corporate responsibility, and artistic excellence dictate every strategic initiative we manage.'
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
            director: 'Co-founder',
            manager: 'Co-founder',
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
        totalImpact: 'Total Impact in 2026',
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
        report: 'Download 2026 Impact Report (PDF)',
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
        desc: 'The Mongolian Center in Austria is a non-governmental organization dedicated to bilateral cultural diplomacy, strategic community engagement, and the preservation of Mongolian heritage through high-leverage partnerships.',
        navTitle: 'Navigation',
        legalTitle: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        imprint: 'Imprint',
        governance: 'Governance',
        copyright: '© 2026 Mongolian Center in Austria.',
        vienna: 'Vienna',
        ulaanbaatar: 'Ulaanbaatar'
      },
      contact: {
        tag: 'Get in Touch',
        title: 'Partner with',
        titleItalic: 'Us',
        subtitle: 'Looking to collaborate, sponsor an initiative, or explore cultural and economic opportunities? Connect directly with our executive team in Vienna.',
        info: {
          location: 'Headquarters',
          vienna: 'Vienna, Austria',
          hub: 'Cultural & Business Hub',
          email: 'Executive Contact',
          phone: 'Direct Line',
          hours: 'Mon-Fri, 10:00 - 18:00',
          quote: '"Bridging markets and cultures through meaningful dialogue and high-value sustainable partnerships."'
        },
        form: {
          title: 'Initiate a Partnership',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Business Email',
          subject: 'Area of Interest',
          message: 'Proposal / Inquiry',
          send: 'Send Inquiry',
          placeholders: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@company.com',
            message: 'How can we partner to generate mutual impact?'
          },
          subjects: {
            general: 'General Inquiry',
            investment: 'Investment Opportunities',
            cultural: 'Cultural Partnerships',
            events: 'Event Collaboration'
          }
        },
        success: 'Your inquiry has been received. Our team will contact you shortly.',
        error: 'Failed to submit inquiry. Please try again or contact us directly.'
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
        titleItalic: 'Gemeinschaft leben',
        subtitle: 'Willkommen auf der offiziellen Plattform des Mongolischen Zentrums in Wien. Wir sind eine Nichtregierungsorganisation (NGO), die sich der Bewahrung unseres kulturellen Erbes sowie der Förderung starker Gemeinschaftsbindungen in Österreich widmet. Über diese Website können Sie unsere laufenden Initiativen erkunden, den Zeitplan kommender kultureller Veranstaltungen einsehen, sich online registrieren und sich über unsere neuesten Nachrichten, Projekte und organisatorischen Entwicklungen auf dem Laufenden halten.',
        ctaEvents: 'Veranstaltungen',
        ctaImpact: 'Unsere Mission',
        ctaStory: 'Unsere Geschichte',
        established: 'Gegründet im Jahr'
      },
      pillars: {
        title: 'Unsere strategischen Säulen',
        community: {
          title: 'Netzwerk & Gemeinschaft',
          desc: 'Aufbau eines erstklassigen Netzwerks, in dem mongolische Fachkräfte, Studierende und österreichische Partner kooperieren.'
        },
        arts: {
          title: 'Kulturdiplomatie',
          desc: 'Förderung traditioneller und zeitgenössischer mongolischer Kunst durch hochkarätige, interkulturelle Ausstellungen in Europa.'
        },
        impact: {
          title: 'Nachhaltige Wirkung',
          desc: 'Förderung von sozialem Wandel und zivilgesellschaftlicher Solidarität durch gezielte philanthropische Initiativen.'
        }
      },
      legacy: {
        title: 'Ein Aufruf zur',
        titleItalic: 'Zusammenarbeit',
        quote: 'Wir glauben, dass die größten Vermächtnisse gemeinsam geschaffen werden. Wir laden Innovatoren, Kulturschaffende und Organisationen ein, als Partner mit uns eine dynamische Brücke zwischen Österreich und der Mongolei zu bauen.',
        archery: 'Partnerschaft',
        tradition: 'Einheit',
        horsemanship: 'Innovation',
        freedom: 'Zukunft',
        wrestling: 'Austausch',
        strength: 'Wachstum',
        wisdom: 'Vision',
        heritage: 'Wirkung'
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
        title: 'Gemeinsam Wirkung erzielen',
        desc: 'Werden Sie Partner, um diese wichtige kulturelle Brücke zu erhalten und bilaterale soziale Initiativen mit messbaren Ergebnissen zu fördern.',
        cta: 'Mit uns zusammenarbeiten'
      },
      about: {
        tag: 'Unsere Geschichte',
        story: 'Unsere Geschichte &',
        mission: 'Vision',
        bridging: 'Unsere',
        cultures: 'Geschichte',
        founded: 'Gegründet in Wien, entstand das Mongolische Kulturzentrum Österreich aus der strategischen Vision, eine erstklassige Plattform für bilateralen Kulturaustausch, diplomatische Beziehungen und sozioökonomische Solidarität zu schaffen.',
        heritage: 'Unsere Strategie',
        hubTitle: 'Ein Zentrum für bilaterale Exzellenz',
        hubDesc1: 'Als im Herzen Europas agierende NGO fungieren wir als dynamischer Knotenpunkt, der mongolisches Erbe mit europäischer Innovation verbindet. Wir fördern hochgradiges Networking, kulturelle Präsentationen und gemeinsame Unternehmungen.',
        hubDesc2: 'Unser Portfolio umfasst exklusive Networking-Symposien, moderne Veranstaltungen zur Kulturdiplomatie und akademische Workshops, die darauf abzielen, langfristige Partnerschaften aufzubauen.',
        hubDesc3: 'Wir betrachten Kultur als das ultimative Fundament für gegenseitiges Vertrauen. Durch die Verbindung mongolischer Traditionen mit europäischen Kontexten schaffen wir Allianzen, die kulturelle Bereicherung und strategisches Wachstum fördern.',
        vision: {
          title: 'Unsere strategische Vision',
          desc: 'Die maßgebliche Brücke zwischen österreichischen und mongolischen Interessen zu sein – und eine Zukunft zu fördern, die auf gegenseitigem Respekt, kultureller Vielfalt und unzerbrechlichen strategischen Partnerschaften aufbaut.'
        },
        values: {
          tag: 'Kernprinzipien',
          title: 'Unsere Werte',
          desc: 'Integrität, Kulturdiplomatie, unternehmerische Verantwortung und künstlerische Exzellenz bestimmen jede unserer strategischen Initiativen.'
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
            director: 'Direktor',
            manager: 'Manager',
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
        totalImpact: 'Gesamtwirkung im Jahr 2026',
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
        report: 'Impact Report 2026 herunterladen (PDF)',
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
        desc: 'Das Mongolische Kulturzentrum Wien ist eine Nichtregierungsorganisation, die sich der bilateralen Kulturdiplomatie, dem strategischen Engagement der Gemeinschaft und der Bewahrung des mongolischen Erbes durch hochkarätige Partnerschaften widmet.',
        navTitle: 'Navigation',
        legalTitle: 'Rechtliches',
        privacy: 'Datenschutzerklärung',
        terms: 'Nutzungsbedingungen',
        imprint: 'Impressum',
        governance: 'Governance',
        copyright: '© 2026 Mongolisches Zentrum in Österreich.',
        vienna: 'Wien',
        ulaanbaatar: 'Ulaanbaatar'
      },
      contact: {
        tag: 'Kontakt aufnehmen',
        title: 'Partner',
        titleItalic: 'Werden',
        subtitle: 'Möchten Sie zusammenarbeiten, eine Initiative sponsern oder kulturelle und wirtschaftliche Möglichkeiten ausloten? Verbinden Sie sich direkt mit unserem Führungsteam in Wien.',
        info: {
          location: 'Hauptsitz',
          vienna: 'Wien, Österreich',
          hub: 'Kultur- & Geschäftszentrum',
          email: 'Executive Kontakt',
          phone: 'Direktwahl',
          hours: 'Mo-Fr, 10:00 - 18:00',
          quote: '"Brückenbau zwischen Märkten und Kulturen durch bedeutungsvollen Dialog und hochwertige, nachhaltige Partnerschaften."'
        },
        form: {
          title: 'Partnerschaft initiieren',
          firstName: 'Vorname',
          lastName: 'Nachname',
          email: 'Geschäftliche E-Mail',
          subject: 'Interessensgebiet',
          message: 'Vorschlag / Anfrage',
          send: 'Anfrage senden',
          placeholders: {
            firstName: 'Max',
            lastName: 'Mustermann',
            email: 'max@unternehmen.de',
            message: 'Wie können wir zusammenarbeiten, um gegenseitige Vorteile zu generieren?'
          },
          subjects: {
            general: 'Allgemeine Anfrage',
            investment: 'Investitionsmöglichkeiten',
            cultural: 'Kulturelle Partnerschaften',
            events: 'Veranstaltungszusammenarbeit'
          }
        },
        success: 'Ihre Anfrage wurde empfangen. Unser Team wird sich in Kürze bei Ihnen melden.',
        error: 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.'
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
        titleItalic: 'Хамт олныг бүтээе',
        subtitle: 'Вена дахь Монгол Төвийн албан ёсны цахим платформд тавтай морилно уу. Бид Монгол орныхоо баялаг өв соёлыг түгээн дэлгэрүүлэх, Австри улс дахь монгол иргэдийнхээ эв нэгдэл, хамтын ажиллагааг бэхжүүлэх зорилготой төрийн бус байгууллага юм. Энэхүү цахим хуудсаар дамжуулан та манай байгууллагын хэрэгжүүлж буй төсөл хөтөлбөрүүдтэй танилцах, удахгүй болох соёлын арга хэмжээний хуваарийг харах, цахимаар бүртгүүлэх болон хамгийн сүүлийн үеийн мэдээ мэдээллийг хүлээн авах боломжтой.',
        ctaEvents: 'Арга хэмжээнүүд',
        ctaImpact: 'Бидний зорилго',
        ctaStory: 'Бидний түүх',
        established: 'Үүсгэн байгуулагдсан он'
      },
      pillars: {
        title: 'Стратегийн тулгуур',
        community: {
          title: 'Олон нийтийн хамтын ажиллагаа',
          desc: 'Монголын мэргэжилтнүүд, оюутан залуус болон Австри улс дахь түншүүдийг холбосон дээд зэрэглэлийн сүлжээг бүтээн байгуулах.'
        },
        arts: {
          title: 'Соёлын дипломат харилцаа',
          desc: 'Монголын уламжлалт болон орчин үеийн урлагийг Европ дахь өндөр зэрэглэлийн, олон улсын үзэсгэлэнгээр дамжуулан сурталчлах.'
        },
        impact: {
          title: 'Тогтвортой нөлөөлөл',
          desc: 'Австри болон Монгол улсад чиглэсэн зорилтот сайн үйлсийн санаачилгуудаар дамжуулан нийгмийн бодит өөрчлөлтийг хөтлөх.'
        }
      },
      legacy: {
        title: 'Хамтын ажиллагааны',
        titleItalic: 'Урилга',
        quote: 'Аугаа үйл хэрэг хамтын хүчээр бүтдэг гэдэгт бид итгэдэг. Тиймээс шинийг санаачлагчид, соёлын зүтгэлтнүүд болон байгууллагуудыг Австри, Монгол хоёр орныг холбох гүүрийг хамтдаа хамтран бүтээхийг урьж байна.',
        archery: 'Түншлэл',
        tradition: 'Эв нэгдэл',
        horsemanship: 'Инноваци',
        freedom: 'Ирээдүй',
        wrestling: 'Солилцоо',
        strength: 'Өсөлт',
        wisdom: 'Алсын хараа',
        heritage: 'Нөлөөлөл'
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
        title: 'Хамтдаа бодит өөрчлөлтийг бүтээцгээе',
        desc: 'Энэхүү соёлын гүүрийг улам бэхжүүлж, хоёр орны нийгэмд бодит үр өгөөжөө өгөх төслүүдийг хамтран хэрэгжүүлэх урилга.',
        cta: 'Бидэнтэй түншлэх'
      },
      about: {
        tag: 'Бидний түүх',
        story: 'Бидний түүх ба',
        mission: 'Алсын хараа',
        bridging: 'Бидний',
        cultures: 'түүх',
        founded: 'Австри дахь Монгол Төв нь хоёр орны соёлын солилцоо, дипломат харилцааг өргөжүүлэх, нийгэм-эдийн засгийн хамтын ажиллагааг хөгжүүлэх стратегийн алсын харааны үндсэн дээр Вена хотноо байгуулагдсан.',
        heritage: 'Бидний Стратеги',
        hubTitle: 'Хоёр талт харилцааны төв',
        hubDesc1: 'Европын зүрхэнд үйл ажиллагаагаа явуулдаг манай байгууллага нь Монголын өв соёлыг Европын инновацитай холбогч динамик зангилаа юм. Бид дээд түвшний сүлжээ, соёлын арга хэмжээ, хамтарсан төслүүдийг хэрэгжүүлдэг.',
        hubDesc2: 'Бидний үйл ажиллагаа нь Австри болон Монгол улсын хооронд урт хугацааны түншлэлийг бий болгох зорилготой бизнес уулзалт, орчин үеийн соёлын арга хэмжээ болон академик сургалтуудаас бүрддэг.',
        hubDesc3: 'Соёл бол харилцан итгэлцлийн хамгийн бат бөх суурь гэж бид үздэг. Монгол уламжлалыг Европын хэв маягтай уялдуулснаар бид эдийн засаг болон соёлын өсөлтийг авчрах стратегийн түншлэлийг байгуулахыг зорьдог.',
        vision: {
          title: 'Бидний зорилго',
          desc: 'Австри, Монголын нийтлэг эрх ашгийг холбогч гол гүүр нь байж—харилцан хүндэтгэл, соёлын олон талт байдал, бат бэх стратегийн түншлэлд суурилсан ирээдүйг цогцлоох.'
        },
        values: {
          tag: 'Үндсэн зарчим',
          title: 'Үнэт зүйлс',
          desc: 'Шударга байдал, соёлын дипломат харилцаа, нийгмийн хариуцлага бөгөөд мэргэжлийн өндөр түвшин нь бидний бүх санаачилгыг удирдан чиглүүлдэг.'
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
            director: 'Үүсгэн байгуулагч',
            manager: 'Үүсгэн байгуулагч',
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
        title: 'Мэдээ ба',
        titleItalic: 'Мэдээлэл',
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
        totalImpact: '2026 оны нийт нөлөөлөл',
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
        report: '2026 оны нөлөөллийн тайлан татах (PDF)',
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
        desc: 'Австри дахь Монгол Төв нь хоёр орны соёлын дипломат харилцааг өргөжүүлэх, стратегийн түншлэлийг дэмжих, соёлын өвийг хамгаалах чиглэлээр үйл ажиллагаа явуулдаг төрийн бус байгууллага юм.',
        navTitle: 'Цэс',
        legalTitle: 'Хууль эрх зүй',
        privacy: 'Нууцлалын бодлого',
        terms: 'Үйлчилгээний нөхцөл',
        imprint: 'Импринт',
        governance: 'Засаглал',
        copyright: '© 2026 Австри дахь Монгол Төв.',
        vienna: 'Вена',
        ulaanbaatar: 'Улаанбаатар'
      },
      contact: {
        tag: 'Холбоо барих',
        title: 'Бидэнтэй',
        titleItalic: 'Түншлэх',
        subtitle: 'Та бидэнтэй хамтран ажиллах, төсөл хөтөлбөр ивээн тэтгэх эсвэл соёл, эдийн засгийн боломжуудыг судлахыг хүсэж байна уу? Вена дахь манай гүйцэтгэх багтай шууд холбогдоно уу.',
        info: {
          location: 'Төв оффис',
          vienna: 'Вена, Австри',
          hub: 'Соёл ба Бизнесийн Төв',
          email: 'Гүйцэтгэх багийн имэйл',
          phone: 'Шууд холбогдох утас',
          hours: 'Да-Ба, 10:00 - 18:00',
          quote: '"Утга учиртай яриа хэлцэл, өндөр үнэ цэнэ бүхий тогтвортой түншлэлээр дамжуулан зах зээл болон соёлыг холбоно."'
        },
        form: {
          title: 'Түншлэл эхлүүлэх',
          firstName: 'Нэр',
          lastName: 'Овог',
          email: 'Албаны имэйл',
          subject: 'Сонирхсон чиглэл',
          message: 'Санал / Хүсэлт',
          send: 'Хүсэлт илгээх',
          placeholders: {
            firstName: 'Бат',
            lastName: 'Болд',
            email: 'bat@company.com',
            message: 'Харилцан ашигтай нөлөөллийг бий болгохын тулд бид хэрхэн хамтран ажиллах вэ?'
          },
          subjects: {
            general: 'Ерөнхий асуулга',
            investment: 'Хөрөнгө оруулалтын боломж',
            cultural: 'Соёлын түншлэл',
            events: 'Арга хэмжээний хамтын ажиллагаа'
          }
        },
        success: 'Таны хүсэлтийг хүлээн авлаа. Манай баг тун удахгүй тантай холбогдох болно.',
        error: 'Хүсэлт илгээхэд алдаа гарлаа. Дахин оролдоно уу эсвэл бидэнтэй шууд холбогдоно уу.'
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
