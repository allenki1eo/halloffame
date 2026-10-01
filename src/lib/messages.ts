import type { CategorySlug, Medal, SocialKind } from "@/lib/types";

export const locales = ["en", "sw"] as const;

export type Locale = (typeof locales)[number];

export type Messages = {
  skip: string;
  livingTribute: string;
  home: string;
  categories: string;
  suggestSomeone: string;
  openMenu: string;
  menu: string;
  workingTitle: string;
  language: string;
  siteDescription: string;
  metaTitle: string;
  footerLine: string;
  footerFictional: string;
  footerEditors: string;
  editorialDesk: string;
  karibu: string;
  headline: string;
  dek: string;
  openingPage: string;
  readTheWork: string;
  theRecord: string;
  pages: string;
  page: string;
  fourWays: string;
  privateNote: string;
  sideBySide: string;
  onTheRecord: string;
  recordDek: string;
  browse: string;
  howArrives: string;
  arriveEditorsTitle: string;
  arriveEditors: string;
  arriveSuggestTitle: string;
  arriveSuggest: string;
  arriveShareTitle: string;
  arriveShare: string;
  emptyRecord: string;
  emptyOpening: string;
  emptyOpeningBody: string;
  fourRooms: string;
  categoriesDek: string;
  categoryLabel: string;
  theirWork: string;
  readFull: string;
  emptyCategory: string;
  suggestLink: string;
  portfolio: string;
  workIntro: string;
  whatChanged: string;
  openLetter: string;
  journey: string;
  forTheCountry: string;
  whyHeading: string;
  passOn: string;
  sharePublished: string;
  shareDraft: string;
  portraitNote: string;
  reachThem: string;
  opensNewTab: string;
  image: string;
  video: string;
  link: string;
  openVideo: string;
  openLink: string;
  previewPublic: string;
  previewDraft: string;
  suggestKicker: string;
  suggestDek: string;
  suggestRequired: string;
  theirName: string;
  required: string;
  chooseCategory: string;
  whereTheyWork: string;
  workToSee: string;
  whySuggest: string;
  yourName: string;
  howToReach: string;
  sending: string;
  sendEditors: string;
  received: string;
  thankYou: string;
  receivedBody: string;
  storedFile: string;
  storedMemory: string;
  notOnRecord: string;
  notOnRecordBody: string;
  browseCategories: string;
  privateTip: string;
  honor: string;
  workMedal: string;
  social: Record<SocialKind, string>;
  medals: Record<Medal, string>;
  category: Record<CategorySlug, { name: string; blurb: string }>;
  shareIntro: string;
  shareDevice: string;
  shareCopy: string;
  shareWhatsapp: string;
  shareEmail: string;
  shareDeviceMissing: string;
  shareCopied: string;
  shareCopyFailed: string;
  shareSheetFailed: string;
  deskIntro: string;
  newPage: string;
  lockDesk: string;
  traffic: string;
  today: string;
  week: string;
  month: string;
  pageViews: string;
  pageView: string;
  clicks: string;
  click: string;
  topPages: string;
  whereFrom: string;
  nothingYet: string;
  onTheSite: string;
  deskDraft: string;
  preview: string;
  publicPage: string;
  publish: string;
  unpublish: string;
  suggestions: string;
  noSuggestions: string;
  kiswahili: string;
  kiswahiliHint: string;
  addLink: string;
  removeLink: string;
  linkKind: string;
  linkUrl: string;
  editorPin: string;
  openDesk: string;
  pin: string;
  optional: string;
  checkSuggestion: string;
  workHint: string;
  whyHint: string;
  contactHint: string;
  socialHint: string;
  listedPage: string;
  listedPages: string;
  read: string;
  edit: string;
  checking: string;
  deskLine: string;
  overview: string;
  publishedPages: string;
  drafts: string;
  workItems: string;
  mediaItems: string;
  viewsToday: string;
  viewsWeek: string;
  viewsMonth: string;
  clicksToday: string;
  clicksWeek: string;
  clicksMonth: string;
  emptyDesk: string;
  storageReady: string;
  storageNoBlob: string;
  storageMissing: string;
  storageLocal: string;
  trafficNoteTurso: string;
  trafficNoteFile: string;
  trafficNoteUnavailable: string;
  devicesLine: string;
  recentOn: string;
};

const socialEn: Record<SocialKind, string> = {
  x: "X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
  website: "Website",
  email: "Email",
};

export const messages: Record<Locale, Messages> = {
  en: {
    skip: "Skip to content",
    livingTribute: "Living tribute",
    home: "Home",
    categories: "Categories",
    suggestSomeone: "Suggest someone",
    openMenu: "Open menu",
    menu: "Menu",
    workingTitle: "A living tribute. Working title.",
    language: "Language",
    siteDescription:
      "A living tribute to Tanzanians and the work they are making. Editors publish each page. Visitors read, share, and may suggest someone for the desk.",
    metaTitle: "A living tribute",
    footerLine: "A living tribute. Working title. Shukran is a word of thanks.",
    footerFictional:
      "The people in this preview are fictional, written so the form of a page can be read before real stories are published with consent.",
    footerEditors:
      "Editors prepare each page. A suggestion is a private note for the desk. Pages sit side by side, in the order of the record.",
    editorialDesk: "Editorial desk",
    karibu: "Karibu · Tanzania",
    headline: "The work is the tribute.",
    dek: "A living tribute to Tanzanians, well known and still unsung. Begin with the opening page, then walk the record.",
    openingPage: "Opening page",
    readTheWork: "Read the work",
    theRecord: "The record",
    pages: "pages",
    page: "page",
    fourWays: "Four ways in",
    privateNote: "A private note",
    sideBySide: "Side by side",
    onTheRecord: "On the record",
    recordDek: "Editors publish each page. The order is the order of the record.",
    browse: "Browse",
    howArrives: "How a page arrives",
    arriveEditorsTitle: "Editors publish",
    arriveEditors: "A page is prepared with the work first, then the journey, then why it matters for Tanzania.",
    arriveSuggestTitle: "Anyone may suggest",
    arriveSuggest: "If you know someone the record should hold, send a private note. It stays with the editors.",
    arriveShareTitle: "Readers share",
    arriveShare: "Pass a page to a classroom, a newsroom, or a cousin abroad. The link is the introduction.",
    emptyRecord: "The public record is empty. Editors publish pages from the desk.",
    emptyOpening: "The record is open.",
    emptyOpeningBody: "No page is public yet. Editors publish from the desk, and a suggestion can wait with them.",
    fourRooms: "Four rooms, one record.",
    categoriesDek: "Choose a category and read the work. Pages are published by editors and offered side by side.",
    categoryLabel: "Category",
    theirWork: "Their work",
    readFull: "Read the full record",
    emptyCategory: "No public page in this category yet. Editors publish from the desk, and anyone may",
    suggestLink: "suggest someone",
    portfolio: "Portfolio",
    workIntro: "The record starts here: projects, what they asked of people, and what changed. Each piece carries an editor’s honor.",
    whatChanged: "What changed",
    openLetter: "Open letter",
    journey: "The journey",
    forTheCountry: "For the country",
    whyHeading: "Why this matters for Tanzania",
    passOn: "Pass this page on",
    sharePublished: "Share the work with a classroom, a newsroom, or someone far from home.",
    shareDraft: "Sharing opens once editors publish this page.",
    portraitNote: "Portrait for this tribute page.",
    reachThem: "Reach them",
    opensNewTab: "Opens in a new tab",
    image: "Image",
    video: "Video",
    link: "Link",
    openVideo: "Open the video",
    openLink: "Open the link",
    previewPublic: "Desk preview. This page is on the public site.",
    previewDraft: "Desk preview. Editors have not published this page yet.",
    suggestKicker: "A private tip",
    suggestDek:
      "Tell the editors about a person and the work they have done. The note is for the desk. It stays with the editors.",
    suggestRequired: "Required fields are marked. Your name and contact are optional, and they stay with the editors.",
    theirName: "Their name",
    required: "required",
    chooseCategory: "Choose a category",
    whereTheyWork: "Where they work",
    workToSee: "The work editors should see",
    whySuggest: "Why you are suggesting them",
    yourName: "Your name",
    howToReach: "How editors can reach you",
    sending: "Sending…",
    sendEditors: "Send to the editors",
    received: "Received",
    thankYou: "Thank you.",
    receivedBody: "Editors have this suggestion. It stays on the desk as a private note.",
    storedFile: "This preview stores the note in a file on the server.",
    storedMemory: "This server could not write the note to disk, so it is held in memory for this process only.",
    notOnRecord: "This page is not on the record.",
    notOnRecordBody: "It may still be on the editors’ desk, or the address may have changed.",
    browseCategories: "Browse categories",
    privateTip: "A private tip",
    honor: "Honor",
    workMedal: "Work medal",
    social: socialEn,
    medals: { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum", diamond: "Diamond" },
    category: {
      tech: {
        name: "Tech & innovation",
        blurb:
          "Tools and workshops shaped for Tanzanian conditions: power that drops, distances that matter, and language people already speak.",
      },
      science: {
        name: "Science & health",
        blurb:
          "Care and evidence practiced close to the people who use them — in wards, at the lakeshore, and in the notes a colleague can actually read.",
      },
      arts: {
        name: "Arts & culture",
        blurb: "Cloth, poems, and hours of listening. Culture kept as a record of work, made by people a town can name.",
      },
      community: {
        name: "Community & service",
        blurb:
          "Apprenticeships, school gardens, and other structures that let a neighbourhood keep its own skill and feed its own day.",
      },
    },
    shareIntro: "Share {name} with someone who should read the work. The link opens this tribute.",
    shareDevice: "Share from this device",
    shareCopy: "Copy link",
    shareWhatsapp: "WhatsApp",
    shareEmail: "Email",
    shareDeviceMissing: "Use one of the options below.",
    shareCopied: "Link copied.",
    shareCopyFailed: "Copy the address from the browser bar.",
    shareSheetFailed: "The device share sheet did not open. Use one of the options below.",
    deskIntro: "Publish a page onto the public site, or return it to the desk. Suggestions stay here.",
    newPage: "New page",
    lockDesk: "Lock the desk",
    traffic: "Traffic",
    today: "Today",
    week: "7 days",
    month: "30 days",
    pageViews: "page views",
    pageView: "page view",
    clicks: "clicks",
    click: "click",
    topPages: "Top pages",
    whereFrom: "Where visits start",
    nothingYet: "Nothing in the last 30 days.",
    onTheSite: "On the public site",
    deskDraft: "Desk draft",
    preview: "Preview",
    publicPage: "Public page",
    publish: "Publish",
    unpublish: "Unpublish",
    suggestions: "Suggestions",
    noSuggestions: "No suggestions yet.",
    kiswahili: "Kiswahili",
    kiswahiliHint: "Optional. Empty fields fall back to the English on the public page.",
    addLink: "Add a link",
    removeLink: "Remove",
    linkKind: "Kind",
    linkUrl: "Address",
    editorPin: "Editor pin",
    openDesk: "Open the desk",
    pin: "Pin",
    optional: "optional",
    checkSuggestion: "Check the suggestion",
    workHint: "Name a project, a practice, or a change you can point to. A few sentences is enough.",
    whyHint: "What would a reader in Tanzania understand after spending time with this work?",
    contactHint: "Phone or email. Optional.",
    socialHint: "Optional. An empty list stays off the public page.",
    listedPage: "public page",
    listedPages: "public pages",
    read: "Read",
    edit: "Edit",
    checking: "Checking…",
    deskLine: "Published pages, drafts, and who has been reading.",
    overview: "Overview",
    publishedPages: "Published pages",
    drafts: "Drafts",
    workItems: "Work items",
    mediaItems: "Media",
    viewsToday: "Views today",
    viewsWeek: "Views, 7 days",
    viewsMonth: "Views, 30 days",
    clicksToday: "Clicks today",
    clicksWeek: "Clicks, 7 days",
    clicksMonth: "Clicks, 30 days",
    emptyDesk: "No pages on the desk yet. The first one starts here.",
    storageReady: "Turso and Blob are connected.",
    storageNoBlob: "Turso is connected. File uploads need the Blob token. A pasted link still works.",
    storageMissing: "Turso is not connected. The counters stay at zero until the database is set.",
    storageLocal: "Local preview. These counts include the fictional pages. Production does not.",
    trafficNoteTurso: "Stored in Turso. No cookies. The desk itself is not counted.",
    trafficNoteFile: "Turso is unset, so this preview reads data/traffic.json. A missed write is dropped.",
    trafficNoteUnavailable: "Turso is connected, and traffic could not be read just now. The public pages keep working.",
    devicesLine: "Last 7 days: {mobile} mobile, {desktop} desktop. Times use Africa/Dar es Salaam.",
    recentOn: "on",
  },
  sw: {
    skip: "Ruka hadi maudhui",
    livingTribute: "Heshima hai",
    home: "Mwanzo",
    categories: "Makundi",
    suggestSomeone: "Pendekeza mtu",
    openMenu: "Fungua menyu",
    menu: "Menyu",
    workingTitle: "Heshima hai. Jina la kazi.",
    language: "Lugha",
    siteDescription:
      "Heshima hai kwa Watanzania na kazi wanazoifanya. Wahariri huchapisha kila ukurasa. Msomaji husoma, hushiriki, na anaweza kupendekeza mtu kwa wahariri.",
    metaTitle: "Heshima hai",
    footerLine: "Heshima hai. Jina la kazi. Shukran ni neno la shukrani.",
    footerFictional:
      "Watu katika onyesho hili ni wa kubuni, ili umbo la ukurasa lisomwe kabla hadithi halisi hazijachapishwa kwa ridhaa.",
    footerEditors:
      "Wahariri huandaa kila ukurasa. Pendekezo ni dokezo binafsi la mezani. Kurasa hukaa bega kwa bega, kwa mpangilio wa kumbukumbu.",
    editorialDesk: "Meza ya wahariri",
    karibu: "Karibu · Tanzania",
    headline: "Kazi ndiyo heshima.",
    dek: "Heshima hai kwa Watanzania, wanaojulikana na wale ambao kazi yao bado haijasikika. Anza na ukurasa wa ufunguzi, kisha pitia kumbukumbu.",
    openingPage: "Ukurasa wa ufunguzi",
    readTheWork: "Soma kazi",
    theRecord: "Kumbukumbu",
    pages: "kurasa",
    page: "ukurasa",
    fourWays: "Njia nne",
    privateNote: "Dokezo binafsi",
    sideBySide: "Bega kwa bega",
    onTheRecord: "Katika kumbukumbu",
    recordDek: "Wahariri huchapisha kila ukurasa. Mpangilio ni mpangilio wa kumbukumbu.",
    browse: "Vinjari",
    howArrives: "Ukurasa hufikaje",
    arriveEditorsTitle: "Wahariri huchapisha",
    arriveEditors: "Ukurasa huandaliwa kuanzia kazi, kisha safari, kisha kwa nini una maana kwa Tanzania.",
    arriveSuggestTitle: "Yeyote anaweza kupendekeza",
    arriveSuggest: "Ukimjua mtu anayestahili kuwa katika kumbukumbu, tuma dokezo binafsi. Linabaki kwa wahariri.",
    arriveShareTitle: "Wasomaji hushiriki",
    arriveShare: "Peleka ukurasa darasani, chumbani mwa habari, au kwa ndugu aliye mbali. Kiungo ndicho utambulisho.",
    emptyRecord: "Kumbukumbu ya hadhara bado tupu. Wahariri huchapisha kurasa kutoka mezani.",
    emptyOpening: "Kumbukumbu iko wazi.",
    emptyOpeningBody: "Bado hakuna ukurasa wa hadhara. Wahariri huchapisha kutoka mezani, na pendekezo linaweza kusubiri kwao.",
    fourRooms: "Vyumba vinne, kumbukumbu moja.",
    categoriesDek: "Chagua kundi na usome kazi. Wahariri huchapisha kurasa na kuziacha bega kwa bega.",
    categoryLabel: "Kundi",
    theirWork: "Kazi yao",
    readFull: "Soma kumbukumbu yote",
    emptyCategory: "Bado hakuna ukurasa wa hadhara katika kundi hili. Wahariri huchapisha kutoka mezani, na yeyote anaweza",
    suggestLink: "kupendekeza mtu",
    portfolio: "Kazi",
    workIntro: "Kumbukumbu huanza hapa: miradi, walichowaomba watu, na kilichobadilika. Kila kazi hubeba heshima ya mhariri.",
    whatChanged: "Kilichobadilika",
    openLetter: "Barua wazi",
    journey: "Safari",
    forTheCountry: "Kwa nchi",
    whyHeading: "Kwa nini hii ina maana kwa Tanzania",
    passOn: "Peleka ukurasa huu",
    sharePublished: "Shiriki kazi na darasa, chumba cha habari, au mtu aliye mbali na nyumbani.",
    shareDraft: "Kushiriki hufunguka wahariri watakapochapisha ukurasa huu.",
    portraitNote: "Picha ya ukurasa huu wa heshima.",
    reachThem: "Wafikie",
    opensNewTab: "Hufunguka kwenye kichupo kipya",
    image: "Picha",
    video: "Video",
    link: "Kiungo",
    openVideo: "Fungua video",
    openLink: "Fungua kiungo",
    previewPublic: "Onyesho la mezani. Ukurasa huu uko kwenye tovuti ya hadhara.",
    previewDraft: "Onyesho la mezani. Wahariri bado hawajachapisha ukurasa huu.",
    suggestKicker: "Dokezo binafsi",
    suggestDek:
      "Waambie wahariri kuhusu mtu na kazi aliyoifanya. Dokezo ni la mezani. Linabaki kwa wahariri.",
    suggestRequired: "Sehemu zinazohitajika zimewekwa alama. Jina na mawasiliano yako si lazima, na yanabaki kwa wahariri.",
    theirName: "Jina lake",
    required: "inahitajika",
    chooseCategory: "Chagua kundi",
    whereTheyWork: "Anakofanyia kazi",
    workToSee: "Kazi ambayo wahariri waione",
    whySuggest: "Kwa nini unampendekeza",
    yourName: "Jina lako",
    howToReach: "Wahariri wanawezaje kukufikia",
    sending: "Inatumwa…",
    sendEditors: "Tuma kwa wahariri",
    received: "Imepokelewa",
    thankYou: "Asante.",
    receivedBody: "Wahariri wamelipokea pendekezo hili. Linabaki mezani kama dokezo binafsi.",
    storedFile: "Onyesho hili huhifadhi dokezo kwenye faili ya seva.",
    storedMemory: "Seva haikuweza kuandika dokezo kwenye diski, kwa hiyo linabaki kwenye kumbukumbu ya mchakato huu tu.",
    notOnRecord: "Ukurasa huu haupo kwenye kumbukumbu.",
    notOnRecordBody: "Huenda bado uko mezani mwa wahariri, au anwani imebadilika.",
    browseCategories: "Vinjari makundi",
    privateTip: "Dokezo binafsi",
    honor: "Heshima",
    workMedal: "Heshima ya kazi",
    social: {
      x: "X",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      facebook: "Facebook",
      youtube: "YouTube",
      whatsapp: "WhatsApp",
      website: "Tovuti",
      email: "Barua pepe",
    },
    medals: { bronze: "Shaba", silver: "Fedha", gold: "Dhahabu", platinum: "Platini", diamond: "Almasi" },
    category: {
      tech: {
        name: "Teknolojia na uvumbuzi",
        blurb:
          "Zana na warsha zilizoundwa kwa mazingira ya Tanzania: umeme unaokatika, umbali unaohesabika, na lugha ambayo watu tayari wanaitumia.",
      },
      science: {
        name: "Sayansi na afya",
        blurb:
          "Huduma na ushahidi vinavyofanyika karibu na watu wanaovitumia — wodi, ufukweni, na kwenye maelezo ambayo mwenzako anaweza kuyasoma.",
      },
      arts: {
        name: "Sanaa na utamaduni",
        blurb: "Nguo, mashairi, na masaa ya kusikiliza. Utamaduni ukiwa kumbukumbu ya kazi, uliofanywa na watu mji unaoweza kuwataja.",
      },
      community: {
        name: "Jamii na huduma",
        blurb:
          "Mafunzo ya ufundi, bustani za shule, na miundo mingine inayoruhusu mtaa kubaki na ustadi wake na kulisha siku yake.",
      },
    },
    shareIntro: "Mshirikishe {name} mtu anayepaswa kusoma kazi hii. Kiungo hufungua heshima hii.",
    shareDevice: "Shiriki kutoka kifaa hiki",
    shareCopy: "Nakili kiungo",
    shareWhatsapp: "WhatsApp",
    shareEmail: "Barua pepe",
    shareDeviceMissing: "Tumia moja ya chaguo hapa chini.",
    shareCopied: "Kiungo kimenakiliwa.",
    shareCopyFailed: "Nakili anwani kutoka kwenye upau wa kivinjari.",
    shareSheetFailed: "Karatasi ya kushiriki haikufunguka. Tumia moja ya chaguo hapa chini.",
    deskIntro: "Chapisha ukurasa kwenye tovuti ya hadhara, au urudishe mezani. Mapendekezo yanabaki hapa.",
    newPage: "Ukurasa mpya",
    lockDesk: "Funga meza",
    traffic: "Wageni",
    today: "Leo",
    week: "Siku 7",
    month: "Siku 30",
    pageViews: "mwonekano wa kurasa",
    pageView: "mwonekano wa ukurasa",
    clicks: "mibofyo",
    click: "bofyo",
    topPages: "Kurasa zinazoongoza",
    whereFrom: "Wageni wanatoka wapi",
    nothingYet: "Hakuna kitu katika siku 30 zilizopita.",
    onTheSite: "Kwenye tovuti ya hadhara",
    deskDraft: "Rasimu ya mezani",
    preview: "Onyesho",
    publicPage: "Ukurasa wa hadhara",
    publish: "Chapisha",
    unpublish: "Ondoa hadharani",
    suggestions: "Mapendekezo",
    noSuggestions: "Bado hakuna mapendekezo.",
    kiswahili: "Kiswahili",
    kiswahiliHint: "Si lazima. Sehemu tupu hurudi kwenye Kiingereza kwenye ukurasa wa hadhara.",
    addLink: "Ongeza kiungo",
    removeLink: "Ondoa",
    linkKind: "Aina",
    linkUrl: "Anwani",
    editorPin: "Nenosiri la mhariri",
    openDesk: "Fungua meza",
    pin: "Nenosiri",
    optional: "si lazima",
    checkSuggestion: "Kagua pendekezo",
    workHint: "Taja mradi, mazoea, au badiliko unaloweza kulionyesha. Sentensi chache zinatosha.",
    whyHint: "Msomaji Tanzania angeelewa nini baada ya kukaa na kazi hii?",
    contactHint: "Simu au barua pepe. Si lazima.",
    socialHint: "Si lazima. Orodha tupu haionekani kwenye ukurasa wa hadhara.",
    listedPage: "ukurasa wa hadhara",
    listedPages: "kurasa za hadhara",
    read: "Soma",
    edit: "Hariri",
    checking: "Inakaguliwa…",
    deskLine: "Kurasa zilizochapishwa, rasimu, na nani amekuwa akisoma.",
    overview: "Muhtasari",
    publishedPages: "Kurasa zilizochapishwa",
    drafts: "Rasimu",
    workItems: "Kazi",
    mediaItems: "Media",
    viewsToday: "Mwonekano leo",
    viewsWeek: "Mwonekano, siku 7",
    viewsMonth: "Mwonekano, siku 30",
    clicksToday: "Mibofyo leo",
    clicksWeek: "Mibofyo, siku 7",
    clicksMonth: "Mibofyo, siku 30",
    emptyDesk: "Bado hakuna kurasa mezani. Ya kwanza huanza hapa.",
    storageReady: "Turso na Blob vimeunganishwa.",
    storageNoBlob: "Turso imeunganishwa. Upakiaji wa faili unahitaji tokeni ya Blob. Kiungo kilichobandikwa bado kinafanya kazi.",
    storageMissing: "Turso haijaunganishwa. Vihesabuji vinabaki sufuri hadi hifadhidata iwekwe.",
    storageLocal: "Onyesho la hapa. Hesabu hii inajumuisha kurasa za kubuni. Tovuti ya uzalishaji haizionyeshi.",
    trafficNoteTurso: "Imehifadhiwa Turso. Hakuna vidakuzi. Meza yenyewe haihesabiwi.",
    trafficNoteFile: "Turso haijawekwa, kwa hiyo onyesho hili linasoma data/traffic.json. Andiko lililoshindwa linaachwa.",
    trafficNoteUnavailable: "Turso imeunganishwa, na wageni hawakuweza kusomwa sasa hivi. Kurasa za hadhara zinaendelea kufanya kazi.",
    devicesLine: "Siku 7 zilizopita: {mobile} simu, {desktop} kompyuta. Muda ni wa Afrika/Dar es Salaam.",
    recentOn: "kwenye",
  },
};
