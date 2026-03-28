// BaFitD Bilingual Translations — English & Setswana
// NOTE: Setswana translations are placeholders and should be reviewed by a native speaker before launch.

export type BaFitDLang = 'en' | 'tn';

const t = {
  // ===== Page Header & Hero =====
  pageTitle: { en: 'BaFitD — Batswana and Friends in the Diaspora', tn: 'BaFitD — Batswana le Ditsala mo Diasporeng' },
  tagline: { en: 'Botswana gave me so much, now it is time for me to give back', tn: 'O rutilwe ke batho ba Botswana. Jaanong ke nako ya go busa.' },
  registerCta: { en: 'Register to Join', tn: 'Ikwadise go Tsena' },
  registerNow: { en: 'Register Now', tn: 'Ikwadise Jaanong' },

  heroDescription: { en: 'An online platform for Batswana professionals and Friends of Botswana to grow their individual wealth, give back to the country and secure prosperity for future generations', tn: 'Setsha sa inthanete sa baitseanape ba Batswana le Ditsala tsa Botswana go godisa khumo ya bone, go busa mo nageng le go netefatsa katlego ya ditshika tse di tlang' },

  // ===== "Who Is This For?" Bullets =====
  bullet1: { en: 'I am a business person looking for investment opportunities that will benefit Botswana or Batswana.', tn: 'Ke mohwebi yo o batlang ditšhono tsa peeletso tse di tla thusang Botswana kgotsa Batswana.' },
  bullet2: { en: 'I am a professional looking to connect with others to profitably gain from opportunities in Botswana.', tn: 'Ke moitseanape yo o batlang go golagana le ba bangwe go ungwa ke ditšhono mo Botswana.' },
  bullet3: { en: 'I work for a company with internship opportunities for undergraduate Batswana students.', tn: 'Ke bereka mo khamphaning e e nang le ditšhono tsa go ithuta tiro tsa baithuti ba Batswana.' },
  bullet4: { en: 'I have specific idea(s) I want to confidentially share with others.', tn: 'Ke na le kakanyo/dikakanyo tse ke batlang go di abelana le ba bangwe ka sephiri.' },
  bullet5: { en: 'I just want to give back to Botswana.', tn: 'Ke batla fela go busa mo Botswana.' },
  bullet6: { en: 'I have a product/service I want to promote.', tn: 'Ke na le sesupo/tirelo e ke batlang go e phasalatsa.' },

  // ===== Intent card CTA prompts =====
  heroBulletCta: { en: 'This is me — Register', tn: 'Ke nna — Ikwadise' },
  heroJoinPrompt: { en: 'What brings you to BaFitD?', tn: 'Go go tlisang kwa BaFitD?' },
  heroJoinPromptSub: { en: 'Select the option that best describes you, or register directly below.', tn: 'Tlhopha kgetsi e e go tlhalosetsa sentle, kgotsa ikwadise go lebisa.' },

  // ===== Intent-specific context in registration forms =====
  intentNote: { en: 'You\'re registering as:', tn: 'O ikwadisa jaaka:' },
  intentLabelBusiness: { en: 'A business person seeking investment opportunities', tn: 'Mohwebi yo o batlang ditšhono tsa peeletso' },
  intentLabelProfessional: { en: 'A professional seeking network opportunities', tn: 'Moitseanape yo o batlang ditšhono tsa kgolagano' },
  intentLabelInternship: { en: 'An employer with internship opportunities', tn: 'Mohiri yo o nang le ditšhono tsa go ithuta tiro' },
  intentLabelIdea: { en: 'Someone with ideas to share confidentially', tn: 'Motho yo o nang le dikakanyo tsa sephiri' },
  intentLabelGiveback: { en: 'Someone who wants to give back to Botswana', tn: 'Motho yo o batlang go busa mo Botswana' },
  intentLabelProduct: { en: 'Someone with a product or service to promote', tn: 'Motho yo o phasalatsa sesupo kgotsa tirelo' },

  intentSubtitleBusiness: { en: 'Tell us about your business background and the investment opportunities in Botswana you\'d like to explore. Include your sector, experience, and what you\'re looking for.', tn: 'Re bolelele ka kgwebo ya gago le ditšhono tsa peeletso mo Botswana tse o batlang go di lebelela. Tshwarelela sekthoro, maitemogelo le seo o se batlang.' },
  intentSubtitleProfessional: { en: 'Tell us about your profession and the opportunities in Botswana you\'d like to connect with others to pursue. Include your skills, where you\'re based, and what you\'re hoping to find.', tn: 'Re bolelele ka tiro ya gago le ditšhono mo Botswana tse o batlang go di phetoha le ba bangwe. Tshwarelela bokgoni jwa gago, o nna kae, le seo o se solofetsang go se bona.' },
  intentSubtitleInternship: { en: 'Tell us about your company, your sector, and the internship opportunities available for undergraduate Batswana students — including location, duration, and any requirements.', tn: 'Re bolelele ka khamphani ya gago, sekthoro le ditšhono tsa go ithuta tiro tse di teng tsa baithuti ba Batswana — go akaretsa lefelo, paka le ditlhokego.' },
  intentSubtitleIdea: { en: 'Your submission is kept strictly confidential. Share your idea(s) — describe what you\'d like to propose or explore with our network. Be as specific or as broad as you like.', tn: 'Kitsiso ya gago e tsholelwa ka bosephiri. Abelana le dikakanyo tsa gago — tlhalosa seo o batlang go se tlhagisa kgotsa go se lebelela le dikgolagano tsa rona.' },
  intentSubtitleGiveback: { en: 'Tell us who you are, where you live, what skills or experience you have, and how you would like to give back to Botswana. Every contribution counts.', tn: 'Re bolelele gore o mang, o nna kae, bokgoni le maitemogelo a gago, le gore o batla go busa mo Botswana jang. Mmarô mongwe le mongwe o batlega.' },
  intentSubtitleProduct: { en: 'Tell us about your product or service — what it is, what problem it solves, and how it could benefit Batswana or Botswana. We\'ll help you get it in front of the right people.', tn: 'Re bolelele ka sesupo kgotsa tirelo ya gago — ke eng, go rarabolola bothata jang, le gore e ka thusa jang Batswana kgotsa Botswana. Re tla go thusa go e bontsha batho ba maleba.' },

  // ===== Input Mode Chooser =====
  chooseInputMode: { en: 'How would you like to register?', tn: 'O batla go ikwadisa jang?' },
  chooseInputModeSubtitle: { en: 'Pick whichever feels most comfortable for you.', tn: 'Tlhopha tsela e o ikutlwang o le monate ka yone.' },
  modeEssayTitle: { en: 'Tell Us About Yourself', tn: 'Re Bolelele ka Ga Gago' },
  modeEssayDesc: { en: 'Write freely in your own words — like a short letter about who you are, what you do, and how you want to help.', tn: 'Kwala ka mantlha a gago — jaaka lekwalo le le khutshwane ka ga wena, se o se dirang, le gore o batla go thusa jang.' },
  modeFormTitle: { en: 'Step-by-Step Form', tn: 'Foromo ya Dikgato' },
  modeFormDesc: { en: 'Answer guided questions one step at a time — we will walk you through it.', tn: 'Araba dipotso kgato ka kgato — re tla go tsamaisa.' },

  // ===== Freeform Essay =====
  freeformTitle: { en: 'Tell Us About Yourself', tn: 'Re Bolelele ka Ga Gago' },
  freeformSubtitle: { en: 'Write as much or as little as you like. Tell us your name, where you live, what you studied, what skills you have, and how you would like to give back to Botswana.', tn: 'Kwala ka bontsi kgotsa ka bonnye jo o bo batlang. Re bolelele leina la gago, o nna kae, o ithutile eng, bokgoni jo o nang le jone, le gore o batla go thusa Botswana jang.' },
  freeformPlaceholder: { en: 'For example:\n\nMy name is Mpho Kgosidintsi. I am a retired nurse living in Francistown. I trained at the University of Botswana on a government bursary and worked at Princess Marina Hospital for 25 years.\n\nI would love to volunteer my time to train young nurses in rural clinics, especially in the Central District where I grew up.\n\nYou can reach me on WhatsApp at +267 71 234 567.', tn: 'Sekai:\n\nLeina la me ke Mpho Kgosidintsi. Ke mooki yo o retirileng ke nna mo Francistown. Ke ithutile kwa Yunibesithing ya Botswana ka thuso ya Puso mme ke berekile kwa Princess Marina Hospital dingwaga di le 25.\n\nKe ka itumelela go ithaopa go katisa baoki ba basha mo diklinikeng tsa magae, bogolo thata mo Kgaolong ya Central kwa ke goletseng teng.\n\nO ka ntsaya ka WhatsApp mo +267 71 234 567.' },
  freeformNameLabel: { en: 'Your Full Name', tn: 'Leina la Gago le le Feletseng' },
  freeformPhoneLabel: { en: 'Phone Number', tn: 'Nomoro ya Mogala' },
  freeformEmailLabel: { en: 'Email (optional)', tn: 'Imeile (ga e pateletsege)' },
  freeformEssayLabel: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. business opportunities)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. ditšhono tsa kgwebo)' },
  freeformEssayLabelBusiness: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. investment opportunities in Botswana)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. ditšhono tsa go tshenya madi mo Botswana)' },
  freeformEssayLabelProfessional: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. professional networks and opportunities in Botswana)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. mekgatlho ya baporofešenale le ditšhono mo Botswana)' },
  freeformEssayLabelInternship: { en: 'Tell us your story and briefly describe what you can offer? (e.g. internship placements for Batswana students)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o ka se neelang? (sk. ditšhono tsa go ithuta mo tirong mo baithuting ba Batswana)' },
  freeformEssayLabelIdea: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. confidential idea sharing with the network)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. go abelana dikgopolo ka sephiri le lephata)' },
  freeformEssayLabelGiveback: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. ways to give back and uplift Botswana)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. mekgwa ya go busetsa le go gola Botswana)' },
  freeformEssayLabelProduct: { en: 'Tell us your story and briefly describe what you are looking for? (e.g. promoting your product or service across Botswana networks)', tn: 'Re bolelele ga gago le tlhalosa ka khutshwane seo o se batlang? (sk. go gopotsa setlhwatlhwa kgotsa tirelo ya gago mo mekgatlhong ya Botswana)' },
  freeformSubmit: { en: 'Submit My Registration', tn: 'Romela Kwadiso ya Me' },
  freeformSwitchToForm: { en: 'I prefer the step-by-step form instead', tn: 'Ke batla foromo ya dikgato' },

  // ===== Stats =====
  totalVolunteers: { en: 'Volunteers Registered', tn: 'Ba ba Ikwadisitseng' },
  skillCategories: { en: 'Skill Categories', tn: 'Mefuta ya Bokgoni' },
  citiesReached: { en: 'Cities & Towns', tn: 'Ditoropo le Metse' },
  readyNow: { en: 'Ready Now', tn: 'Ba ba Setseng ba Ipaakantse' },

  // ===== Intro Section =====
  introPronunciation: { en: 'Pronounced "Ba Fiti" — they are Fit!', tn: 'E bidiwa "Ba Fiti" — ba Fiti!' },
  introP1: { en: 'Batswana and Friends in the Diaspora (BaFitD) is an ever improving online platform designed to connect professionals and businesspersons passionate about the upliftment of Botswana.', tn: 'Batswana le Ditsala mo Diasporeng (BaFitD) ke setsha sa inthanete se se ntseng se tokafadiwa se se diretsweng go golaganya baitseanape le bahwebi ba ba ratang go tlhabolola Botswana.' },
  introP2: { en: 'It is for citizens of Botswana living in the country as well as those who are resident abroad. Non-Batswana who have previously lived in, or interacted with the country, and who are passionate about making a difference to the lives of Batswana are also welcome to join.', tn: 'Ke ya baagi ba Botswana ba ba nnang mo nageng le ba ba nnang kwa ntle ga naga. Ba e seng Batswana ba ba kileng ba nna mo Botswana, kgotsa ba ba nang le kamano le naga, mme ba rata go dira pharologanyo mo matshelong a Batswana le bone ba a amogetswe.' },
  introP3: { en: 'If you are a Motswana, we will ask you questions such as "Which primary school did you attend?" and "Which village are you from?" Why? Because we hope that through this online platform we can put together networks to help uplift your former school or home village.', tn: 'Fa o le Motswana, re tla go botsa dipotso tse di jaaka "O ne o tsena sekolo sefe sa poraemari?" le "O tswa mo motseng ofe?" Goreng? Ka gonne re solofela gore ka setsha seno re ka kgona go bopa dikgolagano go thusa go tlhabolola sekolo sa gago sa bogologolo kgotsa motse wa gaeno.' },
  introP4: { en: 'If you have a business or a product you have developed — we want to know about it. Why? Because we want to help you promote the business and/or products across our various networks.', tn: 'Fa o na le kgwebo kgotsa sesupo se o se dirileng — re batla go itse ka sone. Goreng? Ka gonne re batla go go thusa go phasalatsa kgwebo le/kgotsa disupo tsa gago mo dikgolaganong tsa rona tse di farologaneng.' },
  introP5: { en: 'If you work for an employer who takes on interns — we want to know. Why? Because maybe you can help the child of a Motswana seeking an internship opportunity secure one. One day it might be your child who is assisted.', tn: 'Fa o bereka mo go mohiri yo o tsayang ba ba ithutang tiro — re batla go itse. Goreng? Ka gonne gongwe o ka thusa ngwana wa Motswana yo o batlang tšhono ya go ithuta tiro go e bona. Ka letsatsi lengwe e ka nna ngwana wa gago yo o thusiwang.' },
  introP6: { en: 'As we receive feedback, we will endeavour to improve the platform. It is not intended to be a panacea to all the challenges facing the country — but instead to be a platform where people can talk and share with purpose.', tn: 'Fa re amogela dikakgelo, re tla leka go tokafatsa setsha. Ga se maikaelelo go nna tharabololo ya dikgwetlho tsotlhe tse naga e lebaganeng le tsone — mme ke go nna setsha se batho ba ka buang le go abelana ka maikaelelo.' },
  introClosing: { en: 'A re neng fiti beng betsho!', tn: 'A re neng fiti beng betsho!' },

  // ===== Initiative Cards =====
  whatIsTitle: { en: 'What is BaFitD?', tn: 'BaFitD ke Eng?' },
  whatIsDesc: { en: 'A registry of skilled Batswana pledging pro bono services to their communities — at least one day every two weeks.', tn: 'Rejistara ya Batswana ba ba nang le bokgoni ba ba solofetsang go thusa sechaba sa bone mahala — bonyane letsatsi le le lengwe ka dibeke tse pedi.' },
  whoIsForTitle: { en: 'Who is it for?', tn: 'Ke ya Mang?' },
  whoIsForDesc: { en: 'Anyone educated in Botswana — especially those whose education was funded by the Government. Professionals, tradespeople, and experts of all kinds.', tn: 'Mongwe le mongwe yo o rutilweng mo Botswana — bogolo thata ba ba rutilweng ke Puso. Baitseanape, badiri ba diatla, le baitseanape ba mefuta yotlhe.' },
  howWorksTitle: { en: 'How does it work?', tn: 'E Bereka Jang?' },
  howWorksDesc: { en: 'Register your skills and availability. Over time, we use AI to group and deploy skillsets for maximum impact.', tn: 'Kwadisa bokgoni jwa gago le nako ya gago. Ka nako, re dirisa AI go rulaganya le go romela bokgoni gore bo thuse thata.' },
  diasporaTitle: { en: 'Diaspora Welcome', tn: 'Diaspora e a Amogetswe' },
  diasporaDesc: { en: 'Batswana abroad can contribute through virtual services and occasional visits. Your skills know no borders.', tn: 'Batswana ba ba kwa ntle ba ka thusa ka ditirelo tsa inthanete le diketelo tsa ka nako. Bokgoni jwa gago ga bo na molelwane.' },

  // ===== Wizard Progress =====
  stepOf: { en: 'Step {current} of {total}', tn: 'Kgato ya {current} mo go {total}' },

  // ===== Step 1: Tell Us About Yourself =====
  step1Title: { en: 'Tell Us About Yourself', tn: 'Re Bolelele ka Ga Gago' },
  step1Subtitle: { en: 'Your personal details, background and skills', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni' },
  step1SubtitleBusiness: { en: 'Your personal details, background and skills — e.g. investment opportunities', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. ditšhono tsa go tshenya madi' },
  step1SubtitleProfessional: { en: 'Your personal details, background and skills — e.g. professional networks and opportunities', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. mekgatlho ya baporofešenale le ditšhono' },
  step1SubtitleInternship: { en: 'Your personal details, background and skills — e.g. internship placements you can offer Batswana students', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. ditšhono tsa go ithuta mo tirong tse o ka di neelang baithuti ba Batswana' },
  step1SubtitleIdea: { en: 'Your personal details, background and skills — e.g. confidential idea sharing', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. go abelana dikgopolo ka sephiri' },
  step1SubtitleGiveback: { en: 'Your personal details, background and skills — e.g. ways to give back to Botswana', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. mekgwa ya go busetsa mo Botswana' },
  step1SubtitleProduct: { en: 'Your personal details, background and skills — e.g. promoting your product or service', tn: 'Tshedimosetso ya gago ya botho, maitemogelo le bokgoni — sk. go gopotsa setlhwatlhwa kgotsa tirelo ya gago' },
  step1SectionPersonal: { en: 'Personal Details', tn: 'Tshedimosetso ya Botho' },
  step1SectionBackground: { en: 'Your Background', tn: 'Maitemogelo a Gago' },
  step1SectionSkills: { en: 'Your Skills', tn: 'Bokgoni jwa Gago' },
  fullName: { en: 'Your full name', tn: 'Leina la gago ka botlalo' },
  fullNamePlaceholder: { en: 'e.g. Mpho Kgosana', tn: 'sk. Mpho Kgosana' },
  phone: { en: 'Phone number', tn: 'Nomoro ya mogala' },
  phonePlaceholder: { en: '+267 7X XXX XXX', tn: '+267 7X XXX XXX' },
  email: { en: 'An email that will always be yours', tn: 'Imeile e e tlang go nna ya gago ka metlha' },
  emailPlaceholder: { en: 'name@personalemail.com', tn: 'leina@imeileyagago.com' },
  gender: { en: 'Gender', tn: 'Bong' },
  genderMale: { en: 'Male', tn: 'Monna' },
  genderFemale: { en: 'Female', tn: 'Mosadi' },
  genderPreferNot: { en: 'Prefer not to say', tn: 'Ga ke batle go bua' },
  ageRange: { en: 'Your age range', tn: 'Dingwaga tsa gago' },

  // ===== Step 2: Location =====
  step2Title: { en: 'Which area of Botswana would you like to serve in?', tn: 'Kgaolo efe ya Botswana o ka rata go direla mo go yona?' },
  step2Subtitle: { en: 'Tell us where you are based and where you\'d like to help', tn: 'Re bolelele gore o nna kae le gore o ka rata go thusa kae' },
  qualificationLevel: { en: 'Highest qualification level', tn: 'Maemo a thuto a a kwa godimo' },
  certificate: { en: 'Certificate', tn: 'Setifikeiti' },
  diploma: { en: 'Diploma', tn: 'Diploma' },
  degree: { en: 'Degree', tn: 'Digiri' },
  masters: { en: 'Masters', tn: 'Masetase' },
  doctorate: { en: 'Doctorate', tn: 'Bongaka' },
  otherQual: { en: 'Other', tn: 'Tse Dingwe' },
  qualificationName: { en: 'Name of your qualification', tn: 'Leina la thuto ya gago' },
  qualificationNamePlaceholder: { en: 'e.g. Bachelor of Medicine', tn: 'sk. Digiri ya Bongaka' },
  institution: { en: 'Institution where highest qualification was attained', tn: 'Sekolo se o beileng thuto ya godimo teng' },
  institutionPlaceholder: { en: 'e.g. University of Cape Town', tn: 'sk. Yunibesithi ya Botswana' },
  graduationYear: { en: 'Year of graduation (optional)', tn: 'Ngwaga o o feditseng (ga go pateletsege)' },

  yes: { en: 'Yes', tn: 'Ee' },
  no: { en: 'No', tn: 'Nnyaa' },
  nationality: { en: 'Nationality', tn: 'Bosetšhaba' },
  nationalityPlaceholder: { en: 'Select your nationality', tn: 'Tlhopha bosetšhaba jwa gago' },
  omangNumber: { en: 'Omang (National ID) number', tn: 'Nomoro ya Omang' },
  omangOptional: { en: 'Optional — for future verification, you can skip this', tn: 'Ga go pateletsege — ke ya tiiso ya isago, o ka e feta' },
  relationshipToBotswana: { en: 'What is your relationship to Botswana?', tn: 'Kamano ya gago le Botswana ke eng?' },
  relationshipToBotswanaPlaceholder: { en: 'Select your relationship', tn: 'Tlhopha kamano ya gago' },
  relStudied: { en: 'Studied there', tn: 'Ke rutilwe teng' },
  relWorked: { en: 'Worked there', tn: 'Ke berekile teng' },
  relFamily: { en: 'Have family there', tn: 'Ke na le ba lelwapa teng' },
  relFriends: { en: 'Have friends there', tn: 'Ke na le ditsala teng' },
  relBorn: { en: 'Born there', tn: 'Ke tsetswe teng' },
  relVisited: { en: 'Visited before', tn: 'Ke ne ka etela' },
  relBusiness: { en: 'Business ties', tn: 'Kgolagano ya tsa kgwebo' },
  relHeardOfIt: { en: 'Just heard of it', tn: 'Ke utlwile ka yone fela' },
  relOther: { en: 'Other', tn: 'Tse dingwe' },
  relOtherPlaceholder: { en: 'Tell us about your connection to Botswana...', tn: 'Re bolelele ka kgolagano ya gago le Botswana...' },
  passportNumber: { en: 'Passport number', tn: 'Nomoro ya Phasepoto' },
  passportOptional: { en: 'Optional — for future verification, you can skip this', tn: 'Ga go pateletsege — ke ya tiiso ya isago, o ka e feta' },

  // ===== Step 3: Skills =====
  step3Title: { en: 'When can you start?', tn: 'O ka simolola leng?' },
  step3Subtitle: { en: 'Select when you would be ready to begin volunteering', tn: 'Tlhopha fa o ne o ka ithaopa go simolola' },
  skillCategory: { en: 'Your main skill area', tn: 'Lefelo la bokgoni jwa gago' },
  healthcare: { en: 'Healthcare', tn: 'Boitekanelo' },
  engineering: { en: 'Engineering', tn: 'Boenjineri' },
  education: { en: 'Education', tn: 'Thuto' },
  legal: { en: 'Legal', tn: 'Molao' },
  agriculture: { en: 'Agriculture', tn: 'Temo' },
  it: { en: 'Information Technology', tn: 'Thekenoloji ya Tshedimosetso' },
  finance: { en: 'Finance & Accounting', tn: 'Ditšhelete le Akhaonto' },
  trades: { en: 'Trades & Craftsmanship', tn: 'Mešomo ya Diatla' },
  socialWork: { en: 'Social Work', tn: 'Bodiredi jwa Loago' },
  otherSkill: { en: 'Other', tn: 'Tse Dingwe' },
  specialty: { en: 'Your specialty', tn: 'Se o itseng ka sone' },
  specialtyPlaceholder: { en: 'e.g. Dentistry, Civil Engineering', tn: 'sk. Bongaka jwa Meno, Boenjineri jwa Dikago' },
  specificServices: { en: 'What specific services can you offer?', tn: 'O ka fana ka ditirelo dife tse di rileng?' },
  specificServicesPlaceholder: { en: 'e.g. I can do dental checkups and extractions at my private clinic', tn: 'sk. Nka tlhatlhoba le go ntsha meno kwa kliniking ya me' },
  yearsExperience: { en: 'Years of experience in current profession', tn: 'Dingwaga tsa maitemogelo mo tirong ya jaanong' },
  currentEmployer: { en: 'Current employer (optional)', tn: 'Mohiri wa ga jaana (ga go pateletsege)' },
  currentEmployerPlaceholder: { en: 'e.g. Princess Marina Hospital', tn: 'sk. Sepetlele sa Princess Marina' },
  professionalLicense: { en: 'Professional license number (if applicable)', tn: 'Nomoro ya laesense ya porofešenale (fa e le teng)' },
  professionalLicensePlaceholder: { en: 'e.g. BHPC-12345', tn: 'sk. BHPC-12345' },

  // ===== Step 4: Where & When =====
  step4Title: { en: 'Has your employer agreed to support this?', tn: 'A mmooki wa gago o dumetse go tshegetsa se?' },
  step4Subtitle: { en: 'Let us know your employer situation so we can plan the best way to involve you', tn: 'Re bolelele ka maemo a gago a mong wa tiro gore re kgone go rulaganya tsela e e molemo ya go go akareletsa' },
  liveInBotswana: { en: 'I live in Botswana', tn: 'Ke nna mo Botswana' },
  liveAbroad: { en: 'I live abroad (Diaspora)', tn: 'Ke nna kwa ntle (Diaspora)' },
  cityTownVillage: { en: 'City / Town / Village', tn: 'Toropo / Motse' },
  cityPlaceholder: { en: 'e.g. Gaborone', tn: 'sk. Gaborone' },
  district: { en: 'District', tn: 'Kgaolo' },
  selectDistrict: { en: 'Select your district', tn: 'Tlhopha kgaolo ya gago' },
  countryOfResidence: { en: 'Country you live in', tn: 'Naga e o nnang mo go yone' },
  willingToTravel: { en: 'Are you willing to travel back to Botswana for in-person service?', tn: 'A o ka kgona go boela Botswana go thusa ka namana?' },
  preferredServiceDistrict: { en: 'Which area of Botswana would you like to serve in?', tn: 'O ka rata go thusa mo kgaolong efe ya Botswana?' },
  selectServiceDistrict: { en: 'Select preferred area (optional)', tn: 'Tlhopha kgaolo e o e ratang (ga go pateletsege)' },
  whenStart: { en: 'When can you start?', tn: 'O ka simolola leng?' },
  immediately: { en: 'Immediately', tn: 'Ka bonako' },
  within1Month: { en: 'Within 1 month', tn: 'Mo kgweding e le nngwe' },
  within3Months: { en: 'Within 3 months', tn: 'Mo dikgweding di le 3' },
  notSure: { en: 'Not sure yet', tn: 'Ga ke itse ga jaana' },
  employerSupport: { en: 'Has your employer agreed to support this?', tn: 'A mohiri wa gago o dumetse go tshegetsa se?' },
  employerYes: { en: 'Yes', tn: 'Ee' },
  employerNotYet: { en: 'Not yet', tn: 'Ga e ise' },
  employerSelf: { en: 'Self-employed', tn: 'Ke a ipereka' },
  employerRetired: { en: 'Retired', tn: 'Ke retiretse' },
  employerNA: { en: 'Not applicable', tn: 'Ga go amane' },

  // ===== Step 5: Availability =====
  step5Title: { en: 'Your Availability', tn: 'Nako ya Gago' },
  step5Subtitle: { en: 'When are you available and how can we best reach you?', tn: 'O gona neng mme re ka go fitlhelela jang?' },
  frequency: { en: 'How often can you volunteer?', tn: 'O ka ithaopa ga kae?' },
  weekly: { en: 'Every week', tn: 'Beke le beke' },
  biweekly: { en: 'Every 2 weeks', tn: 'Dibeke di le 2' },
  monthly: { en: 'Once a month', tn: 'Gangwe ka kgwedi' },
  flexible: { en: 'Flexible', tn: 'Ke a fetofetoga' },
  preferredDays: { en: 'Which days work best for you?', tn: 'Ke malatsi afe a a go siametseng?' },
  monday: { en: 'Mon', tn: 'Mos' },
  tuesday: { en: 'Tue', tn: 'Lab' },
  wednesday: { en: 'Wed', tn: 'Lor' },
  thursday: { en: 'Thu', tn: 'Lam' },
  friday: { en: 'Fri', tn: 'Lab' },
  saturday: { en: 'Sat', tn: 'Mat' },
  sunday: { en: 'Sun', tn: 'Tsh' },
  serviceMode: { en: 'How would you like to serve?', tn: 'O ka rata go thusa jang?' },
  inPerson: { en: 'In Person', tn: 'Ka Namana' },
  virtual: { en: 'Virtual', tn: 'Ka Inthanete' },
  both: { en: 'Both', tn: 'Ka Bobedi' },
  preferredContact: { en: 'How should we contact you?', tn: 'Re go ikgolaganye jang?' },
  whatsapp: { en: 'WhatsApp', tn: 'WhatsApp' },
  sms: { en: 'SMS', tn: 'SMS' },
  phoneCall: { en: 'Phone Call', tn: 'Mogala' },
  emailContact: { en: 'Email', tn: 'Imeile' },
  languagesSpoken: { en: 'Which languages do you speak?', tn: 'O bua dipuo dife?' },
  english: { en: 'English', tn: 'Sekgoa' },
  setswana: { en: 'Setswana', tn: 'Setswana' },
  kalanga: { en: 'Kalanga', tn: 'Sekalanga' },
  sekgalagadi: { en: 'Sekgalagadi', tn: 'Sekgalagadi' },
  herero: { en: 'Herero', tn: 'Seherero' },
  sebirwa: { en: 'Sebirwa', tn: 'Sebirwa' },
  otherLang: { en: 'Other', tn: 'Tse Dingwe' },

  // ===== Step 6: Review & Pledge =====
  step6Title: { en: 'How often and how would you like to volunteer?', tn: 'O ka thusa ga kae le jang?' },
  step6Subtitle: { en: 'Help us plan your involvement', tn: 'Re thuse go rulaganya go akaretsa ga gago' },
  step7Title: { en: 'Review & Pledge', tn: 'Tshekatsheko le Maitlamo' },
  step7Subtitle: { en: 'Check your details and make your pledge', tn: 'Tlhomamisa tshedimosetso ya gago o bo o dire maitlamo' },
  editSection: { en: 'Edit', tn: 'Fetola' },
  referralSource: { en: 'How did you hear about BaFitD?', tn: 'O utlwile ka BaFitD jang?' },
  socialMedia: { en: 'Social Media', tn: 'Media ya Loago' },
  friend: { en: 'A Friend', tn: 'Tsala' },
  news: { en: 'News', tn: 'Dikgang' },
  employer: { en: 'My Employer', tn: 'Mohiri wa Me' },
  otherSource: { en: 'Other', tn: 'Tse Dingwe' },
  pledgeStatement: { en: 'Your personal pledge (optional)', tn: 'Maitlamo a gago (ga go pateletsege)' },
  pledgePlaceholder: { en: 'Why do you want to give back? Share your motivation...', tn: 'Ke goreng o batla go thusa? Arogana lebaka la gago...' },
  submitPledge: { en: 'I Pledge to Give Back', tn: 'Ke Solofetsa go Thusa' },

  // ===== Success Screen =====
  thankYou: { en: 'Thank you, {name}!', tn: 'Ke a leboga, {name}!' },
  volunteerNumber: { en: 'You are volunteer #{number} in the BaFitD Registry', tn: 'O moithaopi wa #{number} mo Rejistara ya BaFitD' },
  shareMessage: { en: 'Tell a friend to register too!', tn: 'Bolelela tsala go ikwadisa le yone!' },
  shareWhatsApp: { en: 'Share on WhatsApp', tn: 'Arogana ka WhatsApp' },
  shareFacebook: { en: 'Share on Facebook', tn: 'Arogana ka Facebook' },
  shareInstagram: { en: 'Share on Instagram', tn: 'Arogana ka Instagram' },
  backToHome: { en: 'Back to Home', tn: 'Boela Gae' },

  // ===== Navigation =====
  next: { en: 'Next', tn: 'E e latelang' },
  back: { en: 'Back', tn: 'Morago' },
  nextStep2: { en: 'Next: Where to serve', tn: 'E e latelang: Go thusa kae' },
  nextStep3: { en: 'Next: When to start', tn: 'E e latelang: Go simolola leng' },
  nextStep4: { en: 'Next: Employer support', tn: 'E e latelang: Tshegetso ya mong wa tiro' },
  nextStep5: { en: 'Next: Your availability', tn: 'E e latelang: Nako ya gago' },
  nextStep6: { en: 'Next: How you\'ll volunteer', tn: 'E e latelang: Jang o tla ithaopa' },
  nextStep7: { en: 'Next: Review & Pledge', tn: 'E e latelang: Tshekatsheko le Maitlamo' },

  // ===== Errors =====
  errorRequired: { en: 'Please fill in this field', tn: 'Tswee-tswee tlatsa moo' },
  errorName: { en: 'Please tell us your name so we can register you', tn: 'Re bolelele leina la gago gore re go kwadise' },
  errorPhone: { en: 'Please provide a phone number so we can reach you', tn: 'Re fe nomoro ya mogala gore re go fitlhelele' },
  errorCity: { en: 'Please tell us which city or town you live in', tn: 'Re bolelele o nna mo toropong efe' },
  errorInstitution: { en: 'Please tell us where you studied', tn: 'Re bolelele o ne o ithuta kae' },
  errorQualification: { en: 'Please tell us about your qualification', tn: 'Re bolelele ka thuto ya gago' },
  errorSkillCategory: { en: 'Please select your main skill area', tn: 'Tlhopha lefelo la bokgoni jwa gago' },
  errorSpecialty: { en: 'Please tell us your specialty', tn: 'Re bolelele se o itseng ka sone' },
  errorSubmit: { en: 'Something went wrong. Please try again.', tn: 'Go na le bothata. Tswee-tswee leka gape.' },
  errorDuplicate: { en: 'This phone number is already registered. If you need to update your details, please contact us.', tn: 'Nomoro eno e setse e kwadisitswe. Fa o batla go fetola tshedimosetso ya gago, ikgolaganye le rona.' },

  // ===== FAQ =====
  faqTitle: { en: 'Frequently Asked Questions', tn: 'Dipotso tse di Botswang Gantsi' },
  faq1Q: { en: 'Do I need to be a Botswana citizen to register?', tn: 'A ke tshwanetse ke nne moagi wa Botswana go ikwadisa?' },
  faq1A: { en: 'No! BaFitD welcomes anyone who was educated in Botswana or has skills they want to contribute. Friends of Botswana from any nationality are welcome.', tn: 'Nnyaa! BaFitD e amogela mongwe le mongwe yo o rutilweng mo Botswana kgotsa a na le bokgoni jo a batlang go bo aba. Ditsala tsa Botswana go tswa bosetšhabeng bongwe le bongwe di a amogetswe.' },
  faq2Q: { en: 'Is my personal information safe?', tn: 'A tshedimosetso ya me e babalesegile?' },
  faq2A: { en: 'Absolutely. Your data is secured by Uhuru Knox — our enterprise-grade security layer that encrypts and protects every piece of information you share.\n\nYour details are never shown publicly. Only aggregate statistics (total counts) appear on this page. We take your privacy seriously because trust is the foundation of this initiative.', tn: 'Ka tlhomamo. Tshedimosetso ya gago e sireletswa ke Uhuru Knox — letlapa la rona la tshireletso e e maatla e e encrypting le go sireletsa tshedimosetso yotlhe e o e abang.\n\nTshedimosetso ya gago ga e bontshiwe mo bathong; ke dipalo fela tse di bontshiwang mo tsebeng eno. Re tsaya sephiri sa gago ka botlhokwa ka gonne tshepo ke motheo wa maiteko ano.' },
  faq3Q: { en: 'What happens after I register?', tn: 'Go diragalang fa ke ikwadisa?' },
  faq3A: { en: 'You\'ll receive a confirmation. As the registry grows, we\'ll use AI to match skills with community needs and coordinate volunteer deployments.', tn: 'O tla amogela tlhomamiso. Fa rejistara e gola, re tla dirisa AI go tshwantshetsa bokgoni le ditlhoko tsa sechaba le go rulaganya baithaopi.' },
  faq4Q: { en: 'Can I update my details later?', tn: 'A nka fetola tshedimosetso ya me moragonyana?' },
  faq4A: { en: 'Yes, contact us and we\'ll update your registration. We\'re working on a self-service update feature.', tn: 'Ee, ikgolaganye le rona re tla fetola kwadiso ya gago. Re bereka mo go tsela ya go ifetoletsa.' },

  // ===== Language Toggle =====
  languageToggle: { en: 'Setswana', tn: 'English' },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, lang: BaFitDLang, replacements?: Record<string, string | number>): string {
  const val = t[key]?.[lang] ?? t[key]?.['en'] ?? key;
  if (!replacements) return val;
  return Object.entries(replacements).reduce<string>(
    (str, [k, v]) => str.replace(`{${k}}`, String(v)),
    val as string
  );
}

export default t;
