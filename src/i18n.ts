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
        membership: 'Membership',
        news: 'News',
        gallery: 'Gallery',
        impact: 'Donation',
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
        title: 'The Mongolian Cultural &',
        titleItalic: 'Community Hub in Vienna',
        subtitle: 'Welcome to the official platform of the Mongolian Center in Vienna. We are a non-governmental organization with the goal of preserving our cultural heritage and fostering strong community connections in Austria. Through this website, you can explore our initiatives, learn about upcoming events, and follow the development of our project.',
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
        cta: 'Donate to us!'
      },
      homeMembership: {
        tag: 'Official Membership',
        titleNormal: 'Become a ',
        titleItalic: 'Member',
        desc: 'Join a growing platform connecting Austria and Mongolia. Gain access to a premium network, exclusive cultural events, and high-level bilateral opportunities.',
        btnApply: 'Become a Member',
        btnExplore: 'Explore Benefits',
        slides: {
          professional: {
            title: 'Professional Community',
            benefit1: 'International network access',
            benefit2: 'Exclusive event invitations',
            benefit3: 'Priority forum registration',
            benefit4: 'Cultural & professional exchange'
          },
          student: {
            title: 'Student Membership',
            benefit1: 'Access to junior network',
            benefit2: 'Mentorship opportunities',
            benefit3: 'Discounted event tickets',
            benefit4: 'Career development support'
          },
          institutional: {
            title: 'Institutional Partner',
            benefit1: 'Brand visibility',
            benefit2: 'Bespoke B2B introductions',
            benefit3: 'Co-hosting opportunities',
            benefit4: 'Strategic advisory access'
          }
        }
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
        benefitsSection: {
          tag: 'Missions & Benefits',
          title: 'Why join our network?',
          desc: 'Following the framework of global chambers, the Mongolian Center offers unparalleled opportunities to connect, learn, and grow. Our mission is to foster strong bilateral relations between Austria and Mongolia while delivering tangible benefits to our community.',
          items: {
            networking: {
              title: 'Networking & Connections',
              desc: 'Build lasting relationships with Mongolian professionals, cultural ambassadors, and Austrian partners in a high-level networking environment.'
            },
            events: {
              title: 'Exclusive Events',
              desc: 'Gain priority access to our cultural festivals, closed-door workshops, and VIP gatherings before they are released to the public.'
            },
            visibility: {
              title: 'Visibility & Promotion',
              desc: 'Showcase your heritage-aligned projects or business initiatives through our digital platforms and community events.'
            },
            insights: {
              title: 'Cultural Insights',
              desc: 'Receive deep, expert-level insights into Mongolian history, modern developments, and economic relations.'
            },
            advocacy: {
              title: 'Advocacy & Voice',
              desc: 'Add your voice to our collective effort to support the Mongolian diaspora and promote fair, culturally respectful policies.'
            },
            mentorship: {
              title: 'Mentorship',
              desc: 'Connect with established professionals for guidance, career development, and integration support in Central Europe.'
            }
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
        tag: 'Your Support',
        title: 'Make a',
        titleItalic: 'Donation',
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
      membershipPage: {
        hero: {
          tag: 'Membership',
          titleNormal: 'Become a ',
          titleItalic: 'Member',
          subtitle: 'Join a growing platform connecting Austria and Mongolia through culture, education, business, and international cooperation.',
          btnIndividual: 'Individual Membership',
          btnInstitutional: 'Institutional Membership'
        },
        benefits: {
          tag: 'Value Proposition',
          titleNormal: 'Become a member and ',
          titleItalic: 'benefit',
          titleSuffix: ' from our offerings',
          desc: 'Unlock exclusive opportunities and become part of a premier bilateral network connecting Austria and Mongolia.',
          btnPlans: 'View Plans',
          feature1: {
            title: 'Networking opportunities & events',
            desc: 'Connect with professionals, diplomats, and business leaders through our exclusive forums, cultural evenings, and networking receptions.'
          },
          feature2: {
            title: 'Access to inclusive information',
            desc: 'Stay informed with detailed insights into bilateral relations, cultural developments, and economic opportunities.'
          },
          feature3: {
            title: 'Access to embassy & decision makers',
            desc: 'Direct channels to the Mongolian Embassy in Vienna and high-level political decision makers in both nations.'
          },
          feature4: {
            title: 'Advocacy & Lobbying',
            desc: 'A collective voice representing the interests of the Mongolian-Austrian community in business and cultural spheres.'
          },
          feature5: {
            title: 'And many more...',
            desc: 'From mentorship programs to priority access for collaborative initiatives and community projects.'
          }
        },
        process: {
          titleNormal: 'How to ',
          titleItalic: 'Apply',
          desc: 'Joining the Mongolian Center is a straightforward process designed to ensure our community remains vibrant and engaged.',
          step1: {
            title: 'Submit Application',
            desc: 'Complete our online membership application form with your details and professional background.'
          },
          step2: {
            title: 'Board Review',
            desc: 'Our board reviews applications monthly to ensure alignment with our values and goals.'
          },
          step3: {
            title: 'Welcome aboard!',
            desc: 'Upon approval, you\'ll receive your membership welcome package and access to the network.'
          }
        },
        tiers: {
          titleNormal: 'Membership ',
          titleItalic: 'Tiers',
          desc: 'Choose the level of engagement that best aligns with your goals and organizational structure.',
          annual: 'Annual',
          free: 'Free',
          custom: 'Custom',
          hours: '/ year',
          under25: '/ under 25',
          recommended: 'Recommended',
          student: {
            name: 'Student & Youth',
            desc: 'Completely free annual membership for students and youth under 25.',
            cta: 'Activate Free Membership',
            benefits: [
              'Free event admission (2 times a year)',
              'Access to community events',
              'Student networking sessions',
              'Newsletter updates',
              'Youth representation & voting'
            ]
          },
          professional: {
            name: 'Professional',
            desc: 'For professionals, entrepreneurs, academics, and creatives.',
            cta: 'Apply for Professional',
            benefits: [
              'Full access to professional network',
              'Discounted event tickets',
              'Exclusive networking dinners',
              'Priority registration for forums',
              'Directory listing',
              'Voting rights at general assembly'
            ]
          },
          institutional: {
            name: 'Institutional',
            desc: 'For companies, universities, embassies, NGOs, and organizations.',
            cta: 'Apply for Institutional',
            benefits: [
              'Up to 5 delegate memberships',
              'Logo placement as partner',
              'Co-hosting opportunities',
              'B2B/B2G matchmaking support',
              'Premium directory profile'
            ]
          }
        },
        partners: {
          tag: 'Trusted By',
          title: 'Our Corporate & Institutional Partners',
          desc: 'Join a distinguished network of organizations committed to fostering bilateral relationships, cultural exchange, and sustainable growth.'
        },
        directory: {
          titleNormal: 'Explore Our ',
          titleItalic: 'Community',
          desc: 'Our members range from students to diplomats, artists to corporate leaders. Browse our directory to see who is already making an impact in the Austria-Mongolia network.',
          cta: 'View Members Directory'
        },
        finalCta: {
          titleNormal: 'Join the Austria–Mongolia ',
          titleItalic: 'Network',
          desc: 'Become part of a platform for cultural exchange, professional collaboration, and international connection.',
          cta: 'Apply for Membership'
        },
        form: {
          signInRequired: 'Sign in Required',
          loginDesc: 'You must be logged in with your Google Account to apply for a {{tier}} membership.',
          signInBtn: 'Sign in with Google',
          backBtn: 'Cancel & Go Back',
          submittedTitle: 'Form Submitted!',
          submittedDesc: 'Thank you for applying. Since memberships must be approved manually by our executive board, your status is now set to Pending Review.',
          submittedStudentTip: 'If you applied for the Student & Youth tier, once approved and active, you can sign up for events for free twice a year!',
          profileBtn: 'Go to Profile',
          tiersBtn: 'Membership Tiers',
          backToMemberships: 'Back to Memberships',
          applyTitle: '{{tier}} Application',
          subtitleText: 'Austria-Mongolia Community Network',
          errAge: 'The Student & Youth tier is strictly for individuals under 25 years old. You are currently {{age}} years old. Please apply for the Professional tier instead.',
          errSubmit: 'Please resolve form issues before submitting.',
          errGeneric: 'Failed to submit application.',
          statusPending: 'Application pending',
          statusApproved: 'Application approved',
          statusRejected: 'Application rejected',
          pendingDesc: 'We have received your application for the {{tier}} membership. Our administration is currently conducting a manual review. You will be notified once complete.',
          approvedDesc: 'Your application for the {{tier}} membership has been approved! Your profile is now successfully updated on the system.',
          rejectedDesc: 'We processed your application for the {{tier}} membership. Unfortunately, it could not be approved at this time. Please contact us for support.',
          appSummary: 'Application Summary',
          requestedTier: 'Requested Tier',
          submittedOn: 'Submitted On',
          applicantName: 'Applicant Name',
          myProfile: 'Go to my Profile',
          browseMemberships: 'Browse Memberships',
          secContact: '1. Contact Information',
          labelFirstName: 'First Name',
          labelLastName: 'Last Name',
          labelEmail: 'Google Email Address (Linked)',
          labelPhone: 'Phone Number',
          labelGender: 'Gender',
          labelDob: 'Date of Birth',
          labelNationality: 'Nationality',
          genderMale: 'Male',
          genderFemale: 'Female',
          genderOther: 'Other',
          genderPreferNotToSay: 'Prefer not to say',
          secCredentials: '2. {{tier}} Credentials',
          labelSchool: 'School / University',
          labelStudentId: 'Student ID Registration Number',
          labelOrgName: 'Organization / Corporate Name',
          labelPosition: 'Current Job Title / Position',
          labelLinkedin: 'LinkedIn / Professional Website URL',
          labelInstName: 'Institution / Corporate Entity Name',
          labelWebsite: 'Official Website Link',
          secMotivation: '3. Motivation Statement',
          labelMotivation: 'Tell us about your interest in Austria-Mongolia cultural or business exchange & motivation to join',
          placeholderMotivation: 'Please elaborate briefly on what value you wish to bring and obtain from the community network.',
          submitBtn: 'Submit Membership Application'
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
        membership: 'Mitgliedschaft',
        news: 'Neuigkeiten',
        gallery: 'Galerie',
        impact: 'Spende',
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
        title: 'Das Mongolische Kultur- &',
        titleItalic: 'Gemeinschaftszentrum in Wien',
        subtitle: 'Willkommen auf der offiziellen Plattform des Mongolischen Zentrums in Wien. Wir sind ein gemeinnütziger Verein mit dem Ziel, unser kulturelles Erbe zu bewahren und starke Gemeinschaftsbindungen in Österreich zu fördern. Über diese Website können Sie mehr über unsere Initiativen erfahren, sich über kommende Veranstaltungen informieren und die Entwicklung unseres Projekts verfolgen.',
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
        cta: 'Spenden Sie an uns!'
      },
      homeMembership: {
        tag: 'Offizielle Mitgliedschaft',
        titleNormal: 'Mitglied ',
        titleItalic: 'werden',
        desc: 'Treten Sie einer wachsenden Plattform bei, die Österreich und die Mongolei verbindet. Erhalten Sie Zugang zu einem erstklassigen Netzwerk, exklusiven kulturellen Veranstaltungen und hochrangigen bilateralen Möglichkeiten.',
        btnApply: 'Mitglied werden',
        btnExplore: 'Vorteile entdecken',
        slides: {
          professional: {
            title: 'Professionelles Netzwerk',
            benefit1: 'Internationaler Netzwerkzugang',
            benefit2: 'Exklusive Einladungen zu Events',
            benefit3: 'Bevorzugte Anmeldung im Forum',
            benefit4: 'Kultureller & beruflicher Austausch'
          },
          student: {
            title: 'Studentische Mitgliedschaft',
            benefit1: 'Zugang zum Junior-Netzwerk',
            benefit2: 'Mentoring-Möglichkeiten',
            benefit3: 'Ermäßigte Veranstaltungstickets',
            benefit4: 'Karriereentwicklungsunterstützung'
          },
          institutional: {
            title: 'Institutioneller Partner',
            benefit1: 'Markensichtbarkeit',
            benefit2: 'Maßgeschneiderte B2B-Kontakte',
            benefit3: 'Möglichkeiten zum Co-Hosting',
            benefit4: 'Umfassender strategischer Rat'
          }
        }
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
        benefitsSection: {
          tag: 'Ziele & Vorteile',
          title: 'Warum unserem Netzwerk beitreten?',
          desc: 'Nach dem Vorbild globaler Kammern bietet das Mongolische Zentrum unvergleichliche Möglichkeiten, sich zu vernetzen, zu lernen und zu wachsen. Unsere Mission ist es, starke bilaterale Beziehungen zwischen Österreich und der Mongolei zu fördern und gleichzeitig unserer Gemeinschaft spürbare Vorteile zu bieten.',
          items: {
            networking: {
              title: 'Netzwerk & Verbindungen',
              desc: 'Bauen Sie dauerhafte Beziehungen zu mongolischen Fachleuten, Kulturbotschaftern und österreichischen Partnern in einem hochkarätigen Netzwerkumfeld auf.'
            },
            events: {
              title: 'Exklusive Veranstaltungen',
              desc: 'Erhalten Sie bevorzugten Zugang zu unseren Kulturfestivals, geschlossenen Workshops und VIP-Treffen, noch bevor diese für die breite Öffentlichkeit freigegeben werden.'
            },
            visibility: {
              title: 'Sichtbarkeit & Werbung',
              desc: 'Präsentieren Sie Ihre traditionellen Projekte oder Geschäftsinitiativen über unsere digitalen Plattformen und Gemeinschaftsveranstaltungen.'
            },
            insights: {
              title: 'Kulturelle Einblicke',
              desc: 'Erhalten Sie fundierte Einblicke auf Expertenniveau in die mongolische Geschichte, moderne Entwicklungen und Wirtschaftsbeziehungen.'
            },
            advocacy: {
              title: 'Interessenvertretung & Stimme',
              desc: 'Bringen Sie Ihre Stimme in unsere gemeinsamen Bemühungen ein, die mongolische Diaspora zu unterstützen und eine gerechte, kulturell respektvolle Politik zu fördern.'
            },
            mentorship: {
              title: 'Mentoring',
              desc: 'Vernetzen Sie sich mit etablierten Fachleuten, um Beratung, Karriereentwicklung und Unterstützung bei der Integration in Mitteleuropa zu erhalten.'
            }
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
        tag: 'Ihre Unterstützung',
        title: 'Machen Sie eine',
        titleItalic: 'Spende',
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
        desc: 'Das Mongolische Kulturzentrum Wien ist ein Verein, der sich der bilateralen Kulturdiplomatie, dem strategischen Engagement der Gemeinschaft und der Bewahrung des mongolischen Erbes durch den Aufbau hochwertiger Partnerschaften widmet.',
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
      membershipPage: {
        hero: {
          tag: 'Mitgliedschaft',
          titleNormal: 'Werden Sie ein ',
          titleItalic: 'Mitglied',
          subtitle: 'Schließen Sie sich einer wachsenden Plattform an, die Österreich und die Mongolei durch Kultur, Bildung, Wirtschaft und internationale Zusammenarbeit verbindet.',
          btnIndividual: 'Einzelmitgliedschaft',
          btnInstitutional: 'Institutionelle Mitgliedschaft'
        },
        benefits: {
          tag: 'Wertversprechen',
          titleNormal: 'Werden Sie Mitglied und ',
          titleItalic: 'profitieren Sie',
          titleSuffix: ' von unseren Angeboten',
          desc: 'Nutzen Sie exklusive Möglichkeiten und werden Sie Teil eines erstklassigen bilateralen Netzwerks, das Österreich und die Mongolei verbindet.',
          btnPlans: 'Tarife ansehen',
          feature1: {
            title: 'Netzwerkmöglichkeiten & Veranstaltungen',
            desc: 'Vernetzen Sie sich mit Fachleuten, Diplomaten und Wirtschaftsführern bei unseren exklusiven Foren, Kulturabenden und Netzwerkempfängen.'
          },
          feature2: {
            title: 'Zugang zu umfassenden Informationen',
            desc: 'Bleiben Sie informiert mit detaillierten Einblicken in bilaterale Beziehungen, kulturelle Entwicklungen und wirtschaftliche Möglichkeiten.'
          },
          feature3: {
            title: 'Kontakt zu Botschaft & Entscheidungsträgern',
            desc: 'Direkte Kanäle zur mongolischen Botschaft in Wien und zu hochrangigen politischen Entscheidungsträgern in beiden Ländern.'
          },
          feature4: {
            title: 'Interessensvertretung & Lobbying',
            desc: 'Eine gemeinsame Stimme, die die Interessen der mongolisch-österreichischen Gemeinschaft in Wirtschaft und Kultur vertritt.'
          },
          feature5: {
            title: 'Und vieles mehr...',
            desc: 'Von Mentorenprogrammen bis hin zum bevorzugten Zugang zu gemeinsamen Initiativen und Gemeinschaftsprojekten.'
          }
        },
        process: {
          titleNormal: 'Wie man sich ',
          titleItalic: 'bewirbt',
          desc: 'Der Beitritt zum Mongolischen Zentrum ist ein einfacher Prozess, der sicherstellt, dass unsere Gemeinschaft dynamisch und engagiert bleibt.',
          step1: {
            title: 'Bewerbung einreichen',
            desc: 'Füllen Sie unser Online-Mitgliedschaftsformular mit Ihren Angaben und Ihrem beruflichen Hintergrund aus.'
          },
          step2: {
            title: 'Prüfung durch den Vorstand',
            desc: 'Unser Vorstand prüft die Bewerbungen monatlich, um die Übereinstimmung mit unseren Werten und Zielen sicherzustellen.'
          },
          step3: {
            title: 'Willkommen an Bord!',
            desc: 'Nach der Genehmigung erhalten Sie Ihr Begrüßungspaket und Zugang zu unserem Netzwerk.'
          }
        },
        tiers: {
          titleNormal: 'Mitgliedschafts',
          titleItalic: 'stufen',
          desc: 'Wählen Sie die Stufe des Engagements, die am besten zu Ihren Zielen und Ihrer Organisationsstruktur passt.',
          annual: 'Jährlich',
          free: 'Kostenlos',
          custom: 'Individuell',
          hours: '/ Jahr',
          under25: '/ unter 25',
          recommended: 'Empfohlen',
          student: {
            name: 'Studenten & Jugend',
            desc: 'Völlig kostenlose Jahresmitgliedschaft für Studenten und Jugendliche unter 25 Jahren.',
            cta: 'Kostenlose Mitgliedschaft aktivieren',
            benefits: [
              'Freier Eintritt zu Veranstaltungen (2-mal im Jahr)',
              'Zugang zu Gemeinschaftsveranstaltungen',
              'Netzwerktreffen für Studierende',
              'Newsletter-Updates',
              'Jugendvertretung & Stimmrecht'
            ]
          },
          professional: {
            name: 'Professionell',
            desc: 'Für Fachleute, Unternehmer, Akademiker und Kreative.',
            cta: 'Für Fachleute bewerben',
            benefits: [
              'Vollständiger Zugang zum professionellen Netzwerk',
              'Ermäßigte Eintrittskarten',
              'Exklusive Networking-Dinner',
              'Priorisierte Registrierung für Foren',
              'Eintragung im Mitgliederverzeichnis',
              'Stimmrecht bei der Generalversammlung'
            ]
          },
          institutional: {
            name: 'Institutionell',
            desc: 'Für Unternehmen, Universitäten, Botschaften, NGOs und Organisationen.',
            cta: 'Als Institution bewerben',
            benefits: [
              'Bis zu 5 Delegierten-Mitgliedschaften',
              'Logo-Platzierung als Partner',
              'Co-Hosting-Möglichkeiten',
              'Unterstützung bei B2B/B2G-Matchmaking',
              'Premium-Profil im Verzeichnis'
            ]
          }
        },
        partners: {
          tag: 'Vertraut Von',
          title: 'Unsere Unternehmens- & Institutionspartner',
          desc: 'Schließen Sie sich einem bedeutenden Netzwerk von Organisationen an, das sich für bilaterale Beziehungen, Kulturaustausch und nachhaltiges Wachstum einsetzt.'
        },
        directory: {
          titleNormal: 'Erkunden Sie unsere ',
          titleItalic: 'Gemeinschaft',
          desc: 'Unsere Mitglieder reichen von Studenten über Diplomaten und Künstler bis hin zu Unternehmensleitern. Durchstöbern Sie unser Verzeichnis, um zu sehen, wer bereits aktiv ist.',
          cta: 'Mitgliederverzeichnis ansehen'
        },
        finalCta: {
          titleNormal: 'Treten Sie dem Österreich–Mongolei ',
          titleItalic: 'Netzwerk bei',
          desc: 'Werden Sie Teil einer Plattform für kulturellen Austausch, berufliche Zusammenarbeit und internationale Verbindungen.',
          cta: 'Mitgliedschaft beantragen'
        },
        form: {
          signInRequired: 'Anmeldung erforderlich',
          loginDesc: 'Sie müssen mit Ihrem Google-Konto angemeldet sein, um eine {{tier}}-Mitgliedschaft zu beantragen.',
          signInBtn: 'Mit Google anmelden',
          backBtn: 'Abbrechen & Zurück',
          submittedTitle: 'Formular übermittelt!',
          submittedDesc: 'Vielen Dank für Ihre Bewerbung. Da Mitgliedschaften von unserem Vorstand manuell genehmigt werden müssen, ist Ihr Status nun auf Ausstehende Prüfung gesetzt.',
          submittedStudentTip: 'Wenn Sie sich für die Stufe Studenten & Jugend beworben haben: Nach der Genehmigung und Aktivierung können Sie sich zweimal im Jahr kostenlos für Veranstaltungen anmelden!',
          profileBtn: 'Zum Profil gehen',
          tiersBtn: 'Mitgliedschaftsstufen',
          backToMemberships: 'Zurück zu Mitgliedschaften',
          applyTitle: '{{tier}}-Bewerbung',
          subtitleText: 'Österreich-Mongolei Community-Netzwerk',
          errAge: 'Die Studenten- und Jugendstufe ist ausschließlich Personen unter 25 Jahren vorbehalten. Sie sind derzeit {{age}} Jahre alt. Bitte bewerben Sie sich stattdessen für die Professional-Stufe.',
          errSubmit: 'Bitte beheben Sie die Formularfehler, bevor Sie es absenden.',
          errGeneric: 'Fehler beim Senden der Bewerbung.',
          statusPending: 'Bewerbung ausstehend',
          statusApproved: 'Bewerbung genehmigt',
          statusRejected: 'Bewerbung abgelehnt',
          pendingDesc: 'Wir haben Ihre Bewerbung für die {{tier}}-Mitgliedschaft erhalten. Unsere Administration führt derzeit eine manuelle Prüfung durch. Sie werden benachrichtigt, sobald diese abgeschlossen ist.',
          approvedDesc: 'Ihre Bewerbung für die {{tier}}-Mitgliedschaft wurde genehmigt! Ihr Profil wurde nun erfolgreich im System aktualisiert.',
          rejectedDesc: 'Wir haben Ihre Bewerbung für die {{tier}}-Mitgliedschaft bearbeitet. Leider konnte sie zu diesem Zeitpunkt nicht genehmigt werden. Bitte kontaktieren Sie uns für Unterstützung.',
          appSummary: 'Zusammenfassung der Bewerbung',
          requestedTier: 'Beantragte Stufe',
          submittedOn: 'Eingereicht am',
          applicantName: 'Name des Bewerbers',
          myProfile: 'Zu meinem Profil gehen',
          browseMemberships: 'Mitgliedschaften durchsuchen',
          secContact: '1. Kontaktinformationen',
          labelFirstName: 'Vorname',
          labelLastName: 'Nachname',
          labelEmail: 'Google-E-Mail-Adresse (verknüpft)',
          labelPhone: 'Telefonnummer',
          labelGender: 'Geschlecht',
          labelDob: 'Geburtsdatum',
          labelNationality: 'Staatsangehörigkeit',
          genderMale: 'Männlich',
          genderFemale: 'Weiblich',
          genderOther: 'Andere',
          genderPreferNotToSay: 'Keine Angabe bevorzugt',
          secCredentials: '2. {{tier}}-Referenzen',
          labelSchool: 'Schule / Universität',
          labelStudentId: 'Studentenausweis-Registrierungsnummer',
          labelOrgName: 'Name des Unternehmens / der Organisation',
          labelPosition: 'Aktuelle Berufsbezeichnung / Position',
          labelLinkedin: 'LinkedIn / Professionelle Website-URL',
          labelInstName: 'Name der Institution / des Unternehmens',
          labelWebsite: 'Offizieller Website-Link',
          secMotivation: '3. Motivationsschreiben',
          labelMotivation: 'Erzählen Sie uns von Ihrem Interesse am kulturellen oder geschäftlichen Austausch zwischen Österreich und der Mongolei sowie Ihrer Motivation für den Beitritt',
          placeholderMotivation: 'Bitte erläutern Sie kurz, welchen Mehrwert Sie einbringen möchten und was Sie von der Gemeinschaft erwarten.',
          submitBtn: 'Mitgliedschaftsbewerbung einreichen'
        }
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
        membership: 'Гишүүнчлэл',
        news: 'Мэдээ',
        gallery: 'Галлерей',
        impact: 'Хандив',
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
        title: 'Вена дахь Монгол соёл,',
        titleItalic: 'олон нийтийн төв',
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
        cta: 'Бидэнд хандив өргөх!'
      },
      homeMembership: {
        tag: 'Албан ёсны гишүүнчлэл',
        titleNormal: 'Хамт олондоо ',
        titleItalic: 'Нэгдээрэй',
        desc: 'Австри, Монголыг холбосон энэхүү өргөжин тэлж буй платформд нэгдээрэй. Дээд зэрэглэлийн холбоо сүлжээ, соёлын арга хэмжээ болон хамтын ажиллагааны боломжуудыг аваарай.',
        btnApply: 'Гишүүнээр элсэх',
        btnExplore: 'Боломжуудыг үзэх',
        slides: {
          professional: {
            title: 'Мэргэжлийн хамт олон',
            benefit1: 'Олон улсын холбоо сүлжээ',
            benefit2: 'Тусгай арга хэмжээний урилга',
            benefit3: 'Форумд урьдчилан бүртгүүлэх',
            benefit4: 'Соёл болон мэргэжлийн солилцоо'
          },
          student: {
            title: 'Оюутны гишүүнчлэл',
            benefit1: 'Залуучуудын сүлжээнд нэгдэх',
            benefit2: 'Менторшип боломжууд',
            benefit3: 'Хямдралтай арга хэмжээний тасалбар',
            benefit4: 'Ажил мэргэжлийн хөгжлийн дэмжлэг'
          },
          institutional: {
            title: 'Байгууллагын түншлэл',
            benefit1: 'Брэндийн танигдах байдал',
            benefit2: 'B2B холбоо сүлжээ байгуулах',
            benefit3: 'Хамтран зохион байгуулах боломж',
            benefit4: 'Стратегийн зөвлөгөө мэдээлэл'
          }
        }
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
        hubDesc1: 'Манай байгууллага нь Монголын өв соёлыг Европын инновацтай холбогч гүүр юм. Бид хамтрагч, гишүүдийнхээ холбоо сүлжээг өргөтгөж, хамтарсан төсөл хөтөлбөр, соёлын арга хэмжээг Европын зүрх, Вена хотод зохион байгуулж, өргөжин тэлж байна.',
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
        benefitsSection: {
          tag: 'Зорилго ба Давуу талууд',
          title: 'Яагаад манай сүлжээнд нэгдэх вэ?',
          desc: 'Олон улсын танхимуудын жишгээр Австри дахь Монгол Төв нь холбоо тогтоох, суралцах, хөгжих хосгүй боломжуудыг санал болгодог. Бидний зорилго бол Австри, Монголын хооронд хоёр талын бат бөх харилцааг хөгжүүлэхийн зэрэгцээ манай хамт олонд бодит үр өгөөжийг хүргэх явдал юм.',
          items: {
            networking: {
              title: 'Холбоо сүлжээ ба Түншлэл',
              desc: 'Австри дахь Монгол мэргэжилтнүүд, соёлын элч төлөөлөгчид болон Австрийн түншүүдтэй дээд түвшний сүлжээнд урт хугацааны бат бөх харилцааг бий болгох.'
            },
            events: {
              title: 'Тусгай арга хэмжээнүүд',
              desc: 'Манай соёлын наадам, хаалттай воркшоп, VIP уулзалтууд олон нийтэд зарлагдахаас өмнө урьдчилан оролцох давуу эрхтэй болох.'
            },
            visibility: {
              title: 'Илтгэл ба Сурталчилгаа',
              desc: 'Манай дижитал платформууд болон олон нийтийн арга хэмжээнүүдээр дамжуулан соёлын болон бизнесийн төслүүдээ танилцуулах.'
            },
            insights: {
              title: 'Соёлын Гүн Мэдээлэл',
              desc: 'Монголын түүх, соёл, орчин үеийн хөгжил, бизнесийн харилцааны талаарх мэргэжлийн түвшний гүн гүнзгий мэдээлэл, судалгааг авах.'
            },
            advocacy: {
              title: 'Дуу Хоолой ба Дэмжлэг',
              desc: 'Хилийн чанад дахь Монголчуудыг дэмжих, соёлыг хүндэтгэсэн бодлогыг дэмжихэд өөрийн дуу хоолойгоо нэгтгэх.'
            },
            mentorship: {
              title: 'Менторшип ба Зөвлөгөө',
              desc: 'Төв Европын орнуудад ажил мэргэжлээ хөгжүүлэх, дасан зохицоход туршлагатай мэргэжилтнүүдээс заавар, зөвлөгөө, дэмжлэг авах.'
            }
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
        tag: 'Таны дэмжлэг',
        title: 'Хандив',
        titleItalic: 'Өргөх',
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
      membershipPage: {
        hero: {
          tag: 'Гишүүнчлэл',
          titleNormal: 'Манай холбоонд ',
          titleItalic: 'Нэгдээрэй',
          subtitle: 'Соёл, боловсрол, бизнес болон олон улсын хамтын ажиллагаагаар дамжуулан Австри, Монголын харилцааг хөгжүүлж буй улам өргөжин тэлж буй платформд нэгдээрэй.',
          btnIndividual: 'Хувь хүний гишүүнчлэл',
          btnInstitutional: 'Байгууллагын гишүүнчлэл'
        },
        benefits: {
          tag: 'Нэмэлт боломжууд',
          titleNormal: 'Хамт олондоо гишүүнээр элсэж, ',
          titleItalic: 'боломжуудыг',
          titleSuffix: ' аваарай',
          desc: 'Хоёр орны хамтын ажиллагааны дээд түвшний сүлжээнд нэгдэж, зөвхөн манай гишүүдэд зориулсан давуу талуудыг мэдрээрэй.',
          btnPlans: 'Төлөвлөгөө үзэх',
          feature1: {
            title: 'Холбоо тогтоох боломж ба арга хэмжээ',
            desc: 'Мэргэжлийн бизнес форум, соёлын үдшүүд, олон улсын арга хэмжээнд хамрагдаж салбар бүрийн төлөөлөлтэй танилцан харилцаа тогтоох.'
          },
          feature2: {
            title: 'Нээлттэй мэдээлэл хүлээн авах',
            desc: 'Хоёр талын харилцаа, соёлын хөгжил болон эдийн засгийн боломжуудын талаарх дэлгэрэнгүй мэдээ мэдээллийг цаг алдалгүй хүлээн авах.'
          },
          feature3: {
            title: 'Элчин сайдын яам болон шийдвэр гаргагчидтай холбогдох',
            desc: 'Вена дахь Монгол Улсын Элчин сайдын яам болон хоёр орны төр засаг, олон нийтийн шийдвэр гаргагчидтай шууд харилцаа тогтоох, санал уламжлах.'
          },
          feature4: {
            title: 'Эрх ашгийг хамгаалах & Санал уламжлах',
            desc: 'Соёл ба бизнесийн талбарт монгол-австрийн хамтын нийгэмлэгийн ашиг сонирхлыг төлөөлөн илэрхийлэх нэгдсэн дуу хоолой болох.'
          },
          feature5: {
            title: 'Гэх мэт өөр олон боломжууд...',
            desc: 'Залуучуудад чиглэсэн менторшип хөтөлбөр, хамтарсан төслүүдэд тэргүүн ээлжинд оролцох давуу эрхүүд.'
          }
        },
        process: {
          titleNormal: 'Хэрхэн ',
          titleItalic: 'Бүртгүүлэх вэ',
          desc: 'Монгол Төвийн гишүүн болох үйл явц маш хялбар бөгөөд хамт олныхоо идэвхтэй уур амьсгалыг бэхжүүлэхэд тусалдаг.',
          step1: {
            title: 'Өргөдөл гаргах',
            desc: 'Онлайн өргөдлийн маягтыг бөглөж, өөрийн цахим мэдээлэл болон мэргэжлийн чиглэлээ илгээнэ.'
          },
          step2: {
            title: 'Удирдах зөвлөлийн хяналт',
            desc: 'Монгол Төвийн удирдлагууд өргөдлийг сар бүр хянаж, манай эрхэм зорилго, үнэт зүйлтэй тохирч байгаа эсэхийг баталгаажуулдаг.'
          },
          step3: {
            title: 'Тавтай морил!',
            desc: 'Өргөдөл зөвшөөрөгдсөний дараа гишүүнчлэлийн багц болон хамтран ажиллах сүлжээнд бүрэн нэвтрэх эрх нээгдэнэ.'
          }
        },
        tiers: {
          titleNormal: 'Гишүүнчлэлийн ',
          titleItalic: 'Зэрэглэлүүд',
          desc: 'Өөрийн идэвхтэй хамтын ажиллагааны түвшнээс хамааран танд болон танай байгууллагад хамгийн тохиромжтой зэрэглэлийг сонгоорой.',
          annual: 'Жил бүр',
          free: 'Үнэгүй',
          custom: 'Тохиролцох',
          hours: '/ жил',
          under25: '/ 25-аас доош насны',
          recommended: 'Санал болгох',
          student: {
            name: 'Оюутан & Залуучууд',
            desc: '25 хүртэлх насны залуучууд болон суралцаж буй оюутнуудад зориулсан бүрэн үнэ төлбөргүй жилийн гишүүнчлэл.',
            cta: 'Үнэгүй гишүүнчлэлийг идэвхжүүлэх',
            benefits: [
              'Арга хэмжээнд үнэ төлбөргүй оролцох эрх (жилд 2 удаа)',
              'Олон нийтийн хамтын ажиллагааны арга хэмжээнүүд',
              'Оюутан залуусын нэгдсэн уулзалт, арга хэмжээ',
              'Сүүлийн үеийн мэдээ сэтгүүл хүлээн авах',
              'Залуучуудын төлөөлөл болон хурлын санал өгөх эрх'
            ]
          },
          professional: {
            name: 'Мэргэжилтэн',
            desc: 'Мэргэжилтнүүд, бизнес эрхлэгчид, эрдэмтэн судлаачид болон уран бүтээлч залууст зориулсан.',
            cta: 'Мэргэжлийн гишүүнээр элсэх',
            benefits: [
              'Мэргэжилтнүүдийн сүлжээнд бүрэн нэвтрэх эрх',
              'Нийтийн арга хэмжээний тасалбарыг хөнгөлөлттэй авах',
              'Онцгой сүлжээний оройн хоолонд уригдах',
              'Томоохон бизнес хурал, форумд түрүүлж бүртгүүлэх',
              'Гишүүдийн нэгдсэн сан доторх мэдээллийн хэсэг',
              'Хурлын шийдвэрүүдэд санал өгөх эрх'
            ]
          },
          institutional: {
            name: 'Байгууллагын гишүүнчлэл',
            desc: 'Компаниуд, их дээд сургуулиуд, элчин сайдын яам, олон улсын болон төрийн бус байгууллагуудад зориулсан.',
            cta: 'Байгууллагын гишүүнээр элсэх',
            benefits: [
              'Төлөөлөгчийн 5 хүртэлх гишүүнчлэлийн эрх',
              'Түнш байгууллага болж манайд лого байршуулах эрх',
              'Арга хэмжээг хамтран зохион байгуулах боломжууд',
              'B2B/B2G бизнес уулзалт холболтууд',
              'Сүлжээний сан дахь дээд зэрэглэлийн профайл хуудас'
            ]
          }
        },
        partners: {
          tag: 'Бидэнтэй хамтран ажиллагсад',
          title: 'Корпораци ба байгууллагын түншүүд',
          desc: 'Хоёр орны харилцаа, соёлын солилцоо, тогтвортой өсөлтийг дэмжих зорилготой нэр хүндтэй дотоод, гадаадын байгууллагуудын сүлжээнд нэгдээрэй.'
        },
        directory: {
          titleNormal: 'Манай хамт олонтой ',
          titleItalic: 'танилц',
          desc: 'Бидний эгнээнд оюутан залуус, дипломатууд, уран бүтээлчдээс эхлээд бизнесийн лидерүүд багтдаг. Сүлжээний залуусыг харж танилцаарай.',
          cta: 'Гишүүдийн нэгдсэн санг үзэх'
        },
        finalCta: {
          titleNormal: 'Австри-Монголын хамтын ажиллагааны ',
          titleItalic: 'сүлжээнд нэгдэнэ үү',
          desc: 'Соёлын солилцоо, мэргэжлийн хамтын ажиллагаа, олон улсын бат бэх холбооны нэгэн үнэ цэнтэй хэсэг болоорой.',
          cta: 'Гишүүн болохоор бүртгүүлэх'
        },
        form: {
          signInRequired: 'Тиймээс системд нэвтрэх шаардлагатай',
          loginDesc: 'Та Google хаягаараа системд нэвтэрснээр {{tier}} гишүүнчлэлд бүртгүүлэх боломжтой болно.',
          signInBtn: 'Google хаягаар нэвтрэх',
          backBtn: 'Цуцлаад ухрах',
          submittedTitle: 'Өргөдөл амжилттай илгээгдлэлээ!',
          submittedDesc: 'Өргөдөл гаргасанд баярлалаа. Гишүүнчлэлийн өргөдлийг манай удирдах зөвлөлөөс гар аргаар хянаж баталгаажуулдаг тул одоогоор таны төлөв "Шүүж байна" гэж өөрчлөгдлөө.',
          submittedStudentTip: 'Хэрэв та Оюутан & Залуучуудын гишүүнчлэлээр бүртгүүлсэн бол баталгаажсаны дараа жилд 2 удаа арга хэмжээнүүдэд үнэ төлбөргүй оролцох боломжтой.',
          profileBtn: 'Хувийн хуудас руу очих',
          tiersBtn: 'Гишүүнчлэлийн зэрэглэлүүд',
          backToMemberships: 'Гишүүнчлэл рүү буцах',
          applyTitle: '{{tier}} гишүүнчлэлийн өргөдөл',
          subtitleText: 'Австри-Монголын хамтын ажиллагааны сүлжээ',
          errAge: 'Оюутан & Залуучуудын зэрэглэл нь зөвхөн 25 хүртэлх насны залууст зориулагдсан. Та одоогоор {{age}} настай байна. Тиймээс Мэргэжилтний зэрэглэлээр бүртгүүлнэ үү.',
          errSubmit: 'Өргөдлийг илгээхээс өмнө маягтын алдааг засна уу.',
          errGeneric: 'Өргөдлийг илгээхэд алдаа гарлаа.',
          statusPending: 'Өргөдлийг хянаж байна',
          statusApproved: 'Гишүүнчлэл баталгаажсан',
          statusRejected: 'Өргөдөлөөс татгалзсан',
          pendingDesc: 'Таны {{tier}} гишүүнчлэлийн өргөдлийг хүлээн авлаа. Манай удирдлага одоогоор хяналтын шатанд шалгаж байна. Шүүлт дууссаны дараа танд мэдэгдэнэ.',
          approvedDesc: 'Баяр хүргэе! Таны {{tier}} гишүүнчлэл амжилттай баталгаажлаа! Таны хувийн мэдээлэл системд шинэчлэгдсэн байна.',
          rejectedDesc: 'Таны {{tier}} гишүүнчлэлийн хүсэлтийг хянаж дууслаа. Харамсалтай нь одоогоор батлах боломжгүй байна. Манайхаас дэмжлэг авна уу.',
          appSummary: 'Өргөдлийн хураангуй',
          requestedTier: 'Хүссэн зэрэглэл',
          submittedOn: 'Илгээсэн огноо',
          applicantName: 'Өргөдөл гаргагчийн нэр',
          myProfile: 'Миний профайл хуудас',
          browseMemberships: 'Бусад гишүүнчлэлүүд',
          secContact: '1. Холбоо барих мэдээлэл',
          labelFirstName: 'Өөрийн нэр',
          labelLastName: 'Овог нэр',
          labelEmail: 'Хэрэглэж буй Google Емэйл',
          labelPhone: 'Утасны дугаар',
          labelGender: 'Хүйс',
          labelDob: 'Төрсөн огноо',
          labelNationality: 'Иргэний харьяалал',
          genderMale: 'Эрэгтэй',
          genderFemale: 'Эмэгтэй',
          genderOther: 'Бусад',
          genderPreferNotToSay: 'Мэдээлэхгүй байх',
          secCredentials: '2. {{tier}} гишүүний мэдээлэл',
          labelSchool: 'Суралцаж буй сургууль / Их сургууль',
          labelStudentId: 'Оюутны үнэмлэх / Бүртгэлийн дугаар',
          labelOrgName: 'Байгууллага / Компани, сургуулийн нэр',
          labelPosition: 'Эрхэлж буй ажил, албан тушаал',
          labelLinkedin: 'LinkedIn эсвэл мэргэжлийн вэбсайт',
          labelInstName: 'Байгууллагын бүтэн нэр',
          labelWebsite: 'Албан ёсны вэбсайтын линк',
          secMotivation: '3. Хамтран ажиллах хүсэл, сэдэл',
          labelMotivation: 'Австри-Монголын соёл, бизнесийн хамтын ажиллагаанд та яагаад оролцох хүсэлтэй байгаагаа тайлбарлана уу',
          placeholderMotivation: 'Манай хамт олонд нэгдсэнээр та юу авч, ямар үнэ цэнийг харилцан бүтээх вэ гэдгээ товчхон бичнэ үү.',
          submitBtn: 'Гишүүнчлэлийн өргөдөл илгээх'
        }
      },
      marquee: {
        next: 'Дараагийн удаа болох арга хэмжээ'
      }
    }
  },
  tr: {
    translation: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımızda',
        events: 'Etkinlikler',
        membership: 'Üyelik',
        news: 'Haberler',
        gallery: 'Galeri',
        impact: 'Bağış',
        contact: 'İletişim',
        signIn: 'Giriş Yap',
        signOut: 'Çıkış Yap',
        mongolian: 'Moğol',
        center: 'Merkezi',
        location: 'Viyana • Avusturya',
        admin: 'Yönetici',
        member: 'Üye'
      },
      common: {
        locale: 'tr-TR',
        back: 'Geri',
        loading: 'Yükleniyor...',
        register: 'Şimdi Kaydol',
        or: 'veya',
        error: {
          signIn: 'Giriş yapılamadı. Lütfen açılır pencerelerin engellenip engellenmediğini kontrol edin.',
          server: 'Sunucu hatası: {{status}}',
          checkout: 'Sunucudan ödeme adresi alınamadı',
          unexpected: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.'
        }
      },
      hero: {
        tag: 'Viyana • Avusturya',
        title: 'Viyana\'daki Moğol Kültür &',
        titleItalic: 'Topluluk Merkezi',
        subtitle: 'Viyana\'daki Moğol Merkezi\'nin resmi platformuna hoş geldiniz. Kültürel mirasımızı korumak ve Avusturya\'daki güçlü topluluk bağlarını geliştirmek amacıyla kurulmuş kar amacı gütmeyen bir sivil toplum kuruluşuyuz. Bu web sitesi aracılığıyla girişimlerimizi inceleyebilir, yaklaşan etkinlikler hakkında bilgi edinebilir ve projemizin gelişimini takip edebilirsiniz.',
        ctaEvents: 'Etkinlikleri Keşfet',
        ctaImpact: 'Misyonumuz',
        ctaStory: 'Mirasımız',
        established: 'Kuruluş yılı'
      },
      pillars: {
        title: 'Stratejik Sütunlar',
        community: {
          title: 'Topluluk Katılımı',
          desc: 'Moğol profesyonellerin, öğrencilerin ve yerel Avusturyalı ortakların bağlantı kurup iş birliği yaptığı seçkin bir ağ geliştirmek.'
        },
        arts: {
          title: 'Kültürel Diplomasi',
          desc: 'Avrupa\'daki yüksek profilli, kültürler arası sergiler aracılığıyla hem geleneksel hem de çağdaş Moğol sanatını ön plana çıkarmak.'
        },
        impact: {
          title: 'Sürdürülebilir Etki',
          desc: 'Avusturya ve Moğolistan\'daki hedeflenen hayırseverlik girişimleri aracılığıyla anlamlı bir sosyal değişim ve sivil dayanışma sağlamak.'
        }
      },
      legacy: {
        title: 'İş Birliği',
        titleItalic: 'Çağrısı',
        quote: 'En büyük mirasların birlikte inşa edildiğine inanıyoruz. Avusturya ve Moğolistan arasında dinamik, iş birliğine dayalı bir köprü kurmak için yenilikçileri, kültürel liderleri ve kuruluşları ortak olmaya davet ediyoruz.',
        archery: 'Ortaklık',
        tradition: 'Birlik',
        horsemanship: 'Yenilik',
        freedom: 'Gelecek',
        wrestling: 'Değişim',
        strength: 'Büyüme',
        wisdom: 'Vizyon',
        heritage: 'Etki'
      },
      highlight: {
        tag: 'Öne Çıkan',
        title: 'Kültür Festivali:',
        titleItalic: 'Bozkırın Yankıları',
        desc: 'Moğol müziği, geleneksel dansı ve mutfak lezzetleriyle dolu sürükleyici bir hafta sonu için bize katılın. Moğolistan\'ın zengin mirasını tam olarak burada, Viyana\'da deneyimleyin.',
        date: '15-17 Haziran 2026',
        nextEvent: 'Sıradaki Etkinlik',
        audience: 'Tüm topluluk üyelerine açık',
        cta: 'Tüm Etkinlikleri Görüntüle'
      },
      impactCta: {
        title: 'Küresel Etki Yaratın',
        desc: 'Bu hayati kültürel köprüyü sürdürmek ve ölçülebilir sonuçlar üreten ikili sosyal girişimlere sponsor olmak için bizimle ortak olun.',
        cta: 'Bize Bağış Yapın!'
      },
      homeMembership: {
        tag: 'Resmi Üyelik',
        titleNormal: 'Nasıl ',
        titleItalic: 'Üye Olunur',
        desc: 'Avusturya ve Moğolistan\'ı birbirine bağlayan, büyüyen bir platforma katılın. Seçkin bir ağa, özel kültürel etkinliklere ve üst düzey ikili fırsatlara erişim kazanın.',
        btnApply: 'Üye Ol',
        btnExplore: 'Avantajları Keşfet',
        slides: {
          professional: {
            title: 'Profesyonel Topluluk',
            benefit1: 'Uluslararası ağ erişimi',
            benefit2: 'Özel etkinlik davetiyeleri',
            benefit3: 'Öncelikli forum kaydı',
            benefit4: 'Kültürel ve profesyonel değişim'
          },
          student: {
            title: 'Öğrenci Üyeliği',
            benefit1: 'Gençlik ağına erişim',
            benefit2: 'Mentörlük fırsatları',
            benefit3: 'İndirimli etkinlik biletleri',
            benefit4: 'Kariyer geliştirme desteği'
          },
          institutional: {
            title: 'Kurumsal Ortak',
            benefit1: 'Marka görünürlüğü',
            benefit2: 'Özel B2B tanıştırmaları',
            benefit3: 'Ortak etkinlik düzenleme fırsatları',
            benefit4: 'Stratejik danışmanlık erişimi'
          }
        }
      },
      about: {
        tag: 'Bizim Hikayemiz',
        story: 'Hikayemiz &',
        mission: 'Vizyonumuz',
        bridging: 'Bizim',
        cultures: 'Hikayemiz',
        founded: 'Viyana\'da kurulan Avusturya Moğol Merkezi, ikili kültürel değişim, diplomatik ilişkiler ve sosyoekonomik dayanışma için seçkin bir platform oluşturma stratejik vizyonundan doğmuştur.',
        heritage: 'Stratejimiz',
        hubTitle: 'İkili Mükemmeliyet Merkezi',
        hubDesc1: 'Avrupa\'nın kalbinden faaliyet gösteren STK\'mız, Moğol mirasını Avrupa inovasyonu ile birleştiren dinamik bir bağ görevi görmektedir. Yüksek etkili ağ oluşturma, kültürel gösterimler ve ortak girişimleri kolaylaştırıyoruz.',
        hubDesc2: 'Portföyümüz; Avusturya ile Moğolistan arasında uzun vadeli ortaklıkları teşvik etmek için tasarlanmış yönetici düzeyinde ağ oluşturma sempozyumlarını, çağdaş kültürel diplomasi etkinliklerini ve akademik çalıştayları kapsamaktadır.',
        hubDesc3: 'Kültürü, karşılıklı güvenin nihai temeli olarak görüyoruz. Moğol geleneklerini Avrupa bağlamlarıyla bütünleştirerek, hem kültürel zenginleşme hem de stratejik büyüme sağlayan ittifaklar tasarlıyoruz.',
        vision: {
          title: 'Stratejik Vizyonumuz',
          desc: 'Karşılıklı saygı, kültürel çeşitlilik ve sarsılmaz stratejik ortaklıklar üzerine kurulu bir geleceği ilerleterek Avusturya ve Moğol çıkarlarını birbirine bağlayan nihai köprü olmak.'
        },
        values: {
          tag: 'Temel İlkeler',
          title: 'Değerlerimiz',
          desc: 'Dürüstlük, kültürel diplomasi, kurumsal sorumluluk ve sanatsal mükemmeliyet, yönettiğimiz every stratejik girişimi şekillendirir.'
        },
        impact: {
          title: 'Etkimiz',
          desc: 'Bağış girişimlerimiz aracılığıyla, hem Viyana\'da yerel düzeyde hem de Moğolistan\'ın uçsuz bucaksız coğrafyasında anlamlı amaçları destekliyoruz.'
        },
        team: {
          tag: 'Liderlik',
          title: 'Ekibimiz',
          quote: '"Avrupa\'daki Moğol mirasının korunması ve tanıtılmasına kendini adamış profesyoneller."',
          roles: {
            director: 'Kurucu Ortak',
            manager: 'Kurucu Ortak',
            outreach: 'Topluluk İlişkileri'
          }
        },
        benefitsSection: {
          tag: 'Görevler ve Avantajlar',
          title: 'Neden ağımıza katılmalısınız?',
          desc: 'Küresel odaların çerçevesini takip eden Moğol Merkezi; bağlantı kurmak, öğrenmek ve büyümek için benzersiz fırsatlar sunar. Misyonumuz, topluluğumuza somut faydalar sağlarken Avusturya ve Moğolistan arasında güçlü ikili ilişkiler geliştirmektir.',
          items: {
            networking: {
              title: 'Ağ Oluşturma ve Bağlantılar',
              desc: 'Üst düzey bir ağ oluşturma ortamında Moğol profesyoneller, kültürel elçiler ve Avusturyalı ortaklarla kalıcı ilişkiler kurun.'
            },
            events: {
              title: 'Özel Etkinlikler',
              desc: 'Kültür festivallerimize, kapalı kapılar ardındaki çalıştaylarımıza ve VIP toplantılarımıza halka açıklanmadan önce öncelikli erişim sağlayın.'
            },
            visibility: {
              title: 'Görünürlük ve Tanıtım',
              desc: 'Kültürel mirasla uyumlu projelerinizi veya ticari girişimlerinizi dijital platformlerimiz ve topluluk etkinliklerimiz aracılığıyla sergileyin.'
            },
            insights: {
              title: 'Kültürel Bilgiler',
              desc: 'Moğol tarihi, modern gelişmeler ve ekonomik ilişkiler hakkında derin, uzman düzeyinde bilgiler edinin.'
            },
            advocacy: {
              title: 'Hak Savunuculuğu ve Temsil',
              desc: 'Moğol diasporasını desteklemek ve adil, kültürel açıdan saygılı politikaları teşvik etmek için sesinizi ortak çabamıza katın.'
            },
            mentorship: {
              title: 'Mentörlük',
              desc: 'Orta Avrupa\'da rehberlik, kariyer gelişimi ve entegrasyon desteği için deneyimli profesyonellerle bağlantı kurun.'
            }
          }
        },
        join: {
          tag: 'Ailemize Katılın',
          title: 'Become a',
          titleItalic: 'Member',
          desc: 'Yolculuğumuza katılacak tutkulu ruhlar arıyoruz. Birlikte bir etki yaratalım!',
          form: {
            name: 'Adınız',
            email: 'E-posta Adresiniz',
            reason: 'Bize neden katılmak istiyorsunuz?',
            submit: 'Katılmak İçin Başvur'
          }
        }
      },
      events: {
        tag: 'Takvim',
        title: 'Yaklaşan',
        titleItalic: 'Etkinlikler',
        subtitle: 'Kültür festivallerinden eğitici çalıştaylara kadar, Moğol mirasını kutlamak ve deneyimlemek için bize katılın.',
        register: 'Şimdi Kaydol',
        nextUpcoming: 'Sıradaki Yaklaşan Etkinlik',
        viewDetails: 'Detayları Görüntüle',
        price: 'Ücret',
        date: 'Tarih',
        time: 'Saat',
        location: 'Konum',
        category: 'Kategori',
        tba: 'Açıklanacak',
        vienna: 'Viyana',
        defaultCategory: 'Etkinlik',
        bespoke: {
          title: 'Özel',
          titleItalic: 'Kültürel Deneyimler',
          desc: 'Moğol mirasıyla daha derin bir bağ kurmak isteyen kuruluşlar ve bireyler için özel kültürel danışmanlık ve kişiye özel etkinlik planlaması sunuyoruz.',
          cta: 'Özel Bilgi Alın'
        },
        details: {
          notFound: 'Etkinlik bulunamadı',
          back: 'Etkinliklere Geri Dön',
          category: 'Kültürel Etkinlik',
          date: 'Tarih',
          time: 'Saat',
          location: 'Konum',
          included: 'Neler Dahil',
          fee: 'Kayıt Ücreti',
          cta: 'Yerinizi Ayırtın'
        }
      },
      news: {
        tag: 'Dergi',
        title: 'Görüşler &',
        titleItalic: 'Gelişmeler',
        subtitle: 'Topluluk faaliyetlerimiz, kültürel görüşlerimiz ve kurumsal güncellemelerimiz hakkında bilgi sahibi olun.',
        readMore: 'Devamını Oku',
        readFull: 'Tüm Hikayeyi Oku',
        featured: 'Öne Çıkan',
        update: 'Güncelleme',
        noNews: 'Şu anda dergi yazısı bulunamadı.',
        postedOn: 'Yayınlanma tarihi',
        newsletter: {
          title: 'Bilgi',
          titleItalic: 'Sahibi Olun',
          desc: 'Avusturya ve Moğolistan\'ın kültürel ve ekonomik ortamına dair özel bilgiler için üç aylık dergimize abone olun.',
          placeholder: 'E-posta Adresi',
          cta: 'Abone Ol'
        }
      },
      gallery: {
        tag: 'Sergi',
        title: 'Görsel',
        titleItalic: 'Miras',
        subtitle: 'Moğol sanatı, fotoğrafçılığı ve geleneksel el sanatlarından oluşan küratörlü bir koleksiyonu keşfedin.',
        all: 'Tüm Eserler',
        painting: 'Resim',
        photography: 'Fotoğraf',
        crafts: 'El Sanatları',
        traditional: 'Geleneksel',
        contemporary: 'Çağdaş',
        crossCultural: 'Kültürler Arası',
        viewArtwork: 'Sanat Eserini Görüntüle',
        by: 'Yazar:',
        submission: {
          title: 'Vizyonunuzu',
          titleItalic: 'Sergileyin',
          desc: 'Fiziksel ve dijital sergilerimizde yer alacak yetenekli sanatçılar arıyoruz. Çalışmalarınızı uluslararası topluluğumuzla paylaşın.',
          cta: 'Portföy Gönder'
        },
        artworks: {
          spirit: { title: 'Bozkırın Ruhu', artist: 'Bat-Erdene B.' },
          nomad: { title: 'Göçebenin Yolculuğu', artist: 'Saran G.' },
          vienna: { title: 'Viyana Mavisi', artist: 'Enkhmaa T.' },
          sky: { title: 'Sonsuz Gökyüzü', artist: 'Ochir P.' },
          gobi: { title: 'Altın Gobi', artist: 'Tsolmon D.' },
          urban: { title: 'Kent Göçebesi', artist: 'Zorigoo S.' }
        }
      },
      impact: {
        tag: 'Desteğiniz',
        title: 'Bağış',
        titleItalic: 'Yapın',
        subtitle: 'Temelimizde etki odaklıyız. Bağış girişimlerimiz aracılığıyla dayanışma, kültürel değişim ve sosyal sorumluluk ruhunu teşvik ediyoruz.',
        totalImpact: '2026\'daki Toplam Etki',
        initiatives: {
          tag: 'Temel',
          title: 'Girişimler',
          desc: 'Çalışmalarımız, sürdürülebilir büyümeyi ve kültürel anlayışı teşvik eden üç stratejik sütuna odaklanmaktadır.',
          preservation: 'Kültürel Koruma',
          preservationDesc: 'Avrupa genelinde geleneksel Moğol sanatlarını, müziğini ve dil programlarını desteklemek.',
          bridge: 'Ekonomik Köprü',
          bridgeDesc: 'Avusturya ve Moğol işletmeleri arasındaki ticaret ve yatırım fırsatlarını kolaylaştırmak.',
          exchange: 'Eğitim Değişimi',
          exchangeDesc: 'Akademik iş birliği ve öğrenci değişim programları için yollar oluşturmak.'
        },
        donate: 'Şimdi Bağış Yapın',
        goal: 'Hedef',
        transparency: {
          title: 'Şeffaflık',
          titleItalic: 'Taahhüdü',
          desc: 'Kar amacı gütmeyen bir kuruluş olarak, en yüksek finansal hesap verebilirlik ve etik yönetim standartlarını koruyoruz. Yıllık raporlarımız kamuoyunun incelemesine açıktır.',
          cta: 'Yıllık Raporu İndir'
        },
        report: '2026 Etki Raporunu İndir (PDF)',
        stats: {
          events: 'Kültürel Etkinlikler',
          members: 'Topluluk Üyeleri',
          scholarships: 'Verilen Burslar',
          partnerships: 'İş Ortaklıkları'
        },
        donation: {
          tag: 'Misyonumuzu Destekleyin',
          title1: 'Cömertliğiniz',
          title2: 'Mirasımızı',
          title3: 'Korur',
          title4: '',
          mainDesc: 'Boyutu ne olursa olsun her katkı, Moğol ruhunu Avrupa\'nın kalbinde canlı tutmamıza yardımcı olur. Desteğiniz doğrudan kültürel eğitimi, topluluk etkinliklerini ve kültürel mirasın korunmasını finanse eder.',
          impactNote: 'Bağışınızın %100\'ü doğrudan girişimlerimize gider.',
          taxNote: 'Kayıtlı ve kar amacı gütmeyen bir kuruluşuz.',
          chooseAmount: 'Bir Miktar Seçin',
          oneTime: 'Tek seferlik katkı',
          small: 'Bir çocuk için eğitim materyali sağlar.',
          medium: 'Topluluk için kültürel bir çalıştayı destekler.',
          large: 'Geleneksel eserlerin korunmasını finanse eder.',
          extra: 'Büyük bir kültürel değişim etkinliğine sponsor olur.',
          customPlaceholder: 'Özel miktar girin',
          customCta: 'Özel Miktar Bağışla',
          secure: 'Stripe ile Güvenli Ödeme',
          invalidAmount: 'Lütfen geçerli bir miktar girin.',
          successTitle: 'Desteğiniz İçin Teşekkür Ederiz!',
          successDesc: 'Katkınız gerçek bir fark yaratıyor.'
        }
      },
      membershipPage: {
        hero: {
          tag: 'Üyelik',
          titleNormal: 'Nasıl ',
          titleItalic: 'Üye Olunur',
          subtitle: 'Kültür, eğitim, iş dünyası ve uluslararası iş birliği yoluyla Avusturya ve Moğolistan\'ı birbirine bağlayan büyüyen bir platforma katılın.',
          btnIndividual: 'Bireysel Üyelik',
          btnInstitutional: 'Kurumsal Üyelik'
        },
        benefits: {
          tag: 'Değer Teklifi',
          titleNormal: 'Üye olun ve sunulan ',
          titleItalic: 'avantajlardan',
          titleSuffix: ' yararlanın',
          desc: 'Özel fırsatların kapısını açın ve Avusturya ile Moğolistan\'ı bağlayan seçkin bir ikili ağın parçası olun.',
          btnPlans: 'Planları Görüntüle',
          feature1: {
            title: 'Ağ oluşturma fırsatları ve etkinlikler',
            desc: 'Özel forumlarımız, kültürel gecelerimiz ve ağ oluşturma resepsiyonlarımız aracılığıyla profesyoneller, diplomatlar ve iş liderleriyle bağlantı kurun.'
          },
          feature2: {
            title: 'Kapsamlı bilgilere erişim',
            desc: 'İkili ilişkiler, kültürel gelişmeler ve ekonomik fırsatlar hakkında ayrıntılı bilgilerle güncel kalın.'
          },
          feature3: {
            title: 'Büyükelçiliğe ve karar vericilere erişim',
            desc: 'Viyana\'daki Moğolistan Büyükelçiliği\'ne ve her iki ülkedeki üst düzey siyasi karar vericilere doğrudan kanallar.'
          },
          feature4: {
            title: 'Savunuculuk ve Temsil',
            desc: 'Moğol-Avusturya topluluğunun iş ve kültür alanlarındaki çıkarlarını temsil eden ortak bir ses.'
          },
          feature5: {
            title: 'Ve çok daha fazlası...',
            desc: 'Mentörlük programlarından ortak girişimlere ve topluluk projelerine öncelikli erişime kadar.'
          }
        },
        process: {
          titleNormal: 'Nasıl ',
          titleItalic: 'Başvurulur',
          desc: 'Moğol Merkezi\'ye katılmak, topluluğumuzun canlı ve aktif kalmasını sağlamak için tasarlanmış basit bir süreçtir.',
          step1: {
            title: 'Başvuruyu Gönderin',
            desc: 'Çevrimiçi üyelik başvuru formunu bilgileriniz ve mesleki geçmişinizle doldurun.'
          },
          step2: {
            title: 'Yönetim Kurulu Değerlendirmesi',
            desc: 'Yönetim kurulumuz, değerlerimiz ve hedeflerimizle uyumu sağlamak için başvuruları aylık olarak değerlendirir.'
          },
          step3: {
            title: 'Aramıza hoş geldiniz!',
            desc: 'Onaylandıktan sonra, üyelik karşılama paketinizi alacak ve ağa erişim kazanacaksınız.'
          }
        },
        tiers: {
          titleNormal: 'Üyelik ',
          titleItalic: 'Seviyeleri',
          desc: 'Hedeflerinize ve kurumsal yapınıza en uygun katılım düzeyini seçin.',
          annual: 'Yıllık',
          free: 'Ücretsiz',
          custom: 'Özel',
          hours: '/ yıl',
          under25: '/ 25 yaş altı',
          recommended: 'Önerilen',
          student: {
            name: 'Öğrenci ve Gençlik',
            desc: '25 yaşın altındaki öğrenciler ve gençler için tamamen ücretsiz yıllık üyelik.',
            cta: 'Ücretsiz Üyeliği Etkinleştir',
            benefits: [
              'Ücretsiz etkinlik katılımı (yılda 2 kez)',
              'Topluluk etkinliklerine erişim',
              'Öğrenci ağ oluşturma oturumları',
              'Bülten güncellemeleri',
              'Gençlik temsili ve oy hakkı'
            ]
          },
          professional: {
            name: 'Profesyonel',
            desc: 'Profesyoneller, girişimciler, akademisyenler ve yaratıcılar için.',
            cta: 'Profesyonel Üyelik İçin Başvur',
            benefits: [
              'Profesyonel ağa tam erişim',
              'İndirimli etkinlik biletleri',
              'Özel ağ oluşturma akşam yemekleri',
              'Forumlar için öncelikli kayıt',
              'Dizinde listelenme',
              'Genel kurulda oy kullanma hakları'
            ]
          },
          institutional: {
            name: 'Kurumsal',
            desc: 'Şirketler, üniversiteler, elçilikler, STK\'lar ve kuruluşlar için.',
            cta: 'Kurumsal Üyelik İçin Başvur',
            benefits: [
              'En fazla 5 delege üyeliği',
              'Ortak olarak logo yerleşimi',
              'Ortak etkinlik düzenleme fırsatları',
              'B2B/B2G eşleştirme desteği',
              'Seçkin dizin profili'
            ]
          }
        },
        partners: {
          tag: 'Ortaklarımız',
          title: 'Kurumsal ve Kurumsal Ortaklarımız',
          desc: 'İkili ilişkileri, kültürel değişimi ve sürdürülebilir büyümeyi teşvik etmeyi taahhüt eden seçkin bir kuruluşlar ağına katılın.'
        },
        directory: {
          titleNormal: 'Topluluğumuzu ',
          titleItalic: 'Keşfedin',
          desc: 'Üyelerimiz öğrencilerden diplomatlara, sanatçılardan kurumsal liderlere kadar uzanmaktadır. Avusturya-Moğolistan ağında kimlerin etki yarattığını görmek için dizinimize göz atın.',
          cta: 'Üyeler Dizinini Görüntüle'
        },
        finalCta: {
          titleNormal: 'Avusturya–Moğolistan ',
          titleItalic: 'Ağına Katılın',
          desc: 'Kültürel değişim, mesleki iş birliği ve uluslararası bağlantı platformunun bir parçası olun.',
          cta: 'Üyelik İçin Başvur'
        },
        form: {
          signInRequired: 'Giriş Yapılması Gerekir',
          loginDesc: '{{tier}} üyeliğine başvurmak için Google Hesabınızla giriş yapmış olmanız gerekir.',
          signInBtn: 'Google ile Giriş Yap',
          backBtn: 'İptal Et ve Geri Dön',
          submittedTitle: 'Form Gönderildi!',
          submittedDesc: 'Başvurduğunuz için teşekkür ederiz. Üyeliklerin yönetim kurulumuz tarafından manuel olarak onaylanması gerektiğinden, durumunuz şu anda İnceleme Bekliyor olarak ayarlanmıştır.',
          submittedStudentTip: 'Öğrenci ve Gençlik seviyesine başvurduysanız, onaylanıp aktif hale geldikten sonra yılda iki kez etkinliklere ücretsiz kaydolabilirsiniz!',
          profileBtn: 'Profile Git',
          tiersBtn: 'Üyelik Kademeleri',
          backToMemberships: 'Üyeliklere Geri Dön',
          applyTitle: '{{tier}} Başvurusu',
          subtitleText: 'Avusturya-Moğolistan Topluluk Ağı',
          errAge: 'Öğrenci ve Gençlik kategorisi yalnızca 25 yaşın altındaki bireyler içindir. Şu anda {{age}} yaşındasınız. Lütfen bunun yerine Profesyonel kategorisine başvurun.',
          errSubmit: 'Lütfen göndermeden önce form sorunlarını çözün.',
          errGeneric: 'Başvuru gönderilemedi.',
          statusPending: 'Başvuru beklemede',
          statusApproved: 'Başvuru onaylandı',
          statusRejected: 'Başvuru reddedildi',
          pendingDesc: '{{tier}} üyeliği için başvurunuzu aldık. Yönetimimiz şu anda manuel bir inceleme yürütmektedir. Tamamlandığında bilgilendirileceksiniz.',
          approvedDesc: '{{tier}} üyeliği için başvurunuz onaylandı! Profiliniz sistemde başarıyla güncellendi.',
          rejectedDesc: '{{tier}} üyeliği için başvurunuzu işleme aldık. Maalesef şu anda onaylanamadı. Destek için lütfen bizimle iletişime geçin.',
          appSummary: 'Başvuru Özeti',
          requestedTier: 'Talep Edilen Seviye',
          submittedOn: 'Gönderilme Tarihi',
          applicantName: 'Başvuru Sahibi Adı',
          myProfile: 'Profilime Git',
          browseMemberships: 'Üyeliklere Göz At',
          secContact: '1. İletişim Bilgileri',
          labelFirstName: 'Adı',
          labelLastName: 'Soyadı',
          labelEmail: 'Google E-posta Adresi (Bağlı)',
          labelPhone: 'Telefon Numarası',
          labelGender: 'Cinsiyet',
          labelDob: 'Doğum Tarihi',
          labelNationality: 'Uyruk',
          genderMale: 'Erkek',
          genderFemale: 'Kadın',
          genderOther: 'Diğer',
          genderPreferNotToSay: 'Belirtmek istemiyorum',
          secCredentials: '2. {{tier}} Bilgileri',
          labelSchool: 'Okul / Üniversite',
          labelStudentId: 'Öğrenci Kimlik Numarası',
          labelOrgName: 'Kuruluş / Şirket Adı',
          labelPosition: 'Mevcut Görev Unvanı / Pozisyon',
          labelLinkedin: 'LinkedIn / Profesyonel Web Sitesi Adresi',
          labelInstName: 'Kurum / Kurumsal Varlık Adı',
          labelWebsite: 'Resmi Web Sitesi Bağlantısı',
          secMotivation: '3. Motivasyon Beyanı',
          labelMotivation: 'Bize Avusturya-Moğolistan kültürel veya ticari alışverişine olan ilginiz ve katılma motivasyonunuz hakkında bilgi verin',
          placeholderMotivation: 'Lütfen topluluk ağından ne gibi bir değer getirmek ve elde etmek istediğinizi kısaca açıklayın.',
          submitBtn: 'Üyelik Başvurusunu Gönder'
        }
      },
      footer: {
        desc: 'Avusturya Moğol Merkezi, ikili kültürel diplomasiye, stratejik topluluk katılımına ve yüksek etkili ortaklıklar yoluyla Moğol mirasının korunmasına adanmış sivil toplum kuruluşudur.',
        navTitle: 'Gezinti',
        legalTitle: 'Yasal',
        privacy: 'Gizlilik Politikası',
        terms: 'Kullanım Koşulları',
        imprint: 'Künye',
        governance: 'Yönetim',
        copyright: '© 2026 Avusturya Moğol Merkezi.',
        vienna: 'Viyana',
        ulaanbaatar: 'Ulanbator'
      },
      contact: {
        tag: 'İletişime Geçin',
        title: 'Bizimle Ortak',
        titleItalic: 'Olun',
        subtitle: 'İş birliği yapmak, bir girişime sponsor olmak veya kültürel ve ekonomik fırsatları keşfetmek mi istiyorsunuz? Viyana\'daki yönetim ekibimizle doğrudan iletişime geçin.',
        info: {
          location: 'Genel Merkez',
          vienna: 'Viyana, Avusturya',
          hub: 'Kültürel ve Ticari Merkez',
          email: 'Yönetici İletişim',
          phone: 'Doğrudan Hat',
          hours: 'Pzt-Cum, 10:00 - 18:00',
          quote: '"Anlamlı diyaloglar ve yüksek değerli sürdürülebilir ortaklıklar aracılığıyla pazarları ve kültürleri birbirine bağlıyoruz."'
        },
        form: {
          title: 'Bir Ortaklık Başlatın',
          firstName: 'Adı',
          lastName: 'Soyadı',
          email: 'İş E-postası',
          subject: 'İlgi Alanı',
          message: 'Öneri / Talep',
          send: 'Talep Gönder',
          placeholders: {
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            email: 'ahmet@sirket.com',
            message: 'Karşılıklı etki yaratmak için nasıl ortaklık kurabiliriz?'
          },
          subjects: {
            general: 'Genel Talep',
            investment: 'Yatırım Fırsatları',
            cultural: 'Kültürel Ortaklıklar',
            events: 'Etkinlik İş Birliği'
          }
        },
        success: 'Talebiniz alınmıştır. Ekibimiz en kısa sürede sizinle iletişime geçecektir.',
        error: 'Talep gönderilemedi. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin.'
      },
      cookies: {
        title: 'Gizlilik ve Miras',
        description: 'Kültür merkezimizin dijital deneyimini korumak için çerezler kullanıyoruz. Bazıları sitenin çalışması için temel öneme sahipken, diğerleri topluluğumuzu daha iyi anlamamıza yardımcı olur. Avusturya DSGVO standartlarına uygun olarak verileriniz üzerinde tam kontrole sahipsiniz.',
        policy: 'Gizlilik Politikası',
        settings: 'Ayarlar',
        reject: 'Tümünü Reddet',
        accept: 'Tümünü Kabul Et',
        preferences: 'Veri Tercihleri',
        save: 'Tercihleri Kaydet',
        essential: 'Gerekli',
        essentialDesc: 'Sitenin güvenli bir şekilde çalışması için gereklidir.',
        analytics: 'Analizler',
        analyticsDesc: 'Ziyaretçi kalıplarını anlamamıza yardımcı olur.',
        marketing: 'Pazarlama',
        marketingDesc: 'Kültürel etkinlik tanıtımı için kullanılır.'
      },
      marquee: {
        next: 'Sıradaki Yaklaşan Etkinlik'
      }
    }
  }
};

// Ensure 'mn' is the default for new visitors
if (typeof window !== 'undefined' && !localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'mn');
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'mn',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
