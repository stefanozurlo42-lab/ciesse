export const SITE = {
  name: "Ciesse",
  legal: "CIESSE Intermediazioni sas",
  vat: "01289850669",
  founded: 1992,
  street: "Via Alcide De Gasperi, 21",
  cap: "67039",
  city: "Sulmona",
  prov: "AQ",
  email: "info@ciesse.net",
  phones: [
    { display: "+39 0864 34648", tel: "+39086434648" },
    { display: "+39 0864 54048", tel: "+39086454048" },
    { display: "+39 0864 52785", tel: "+39086452785" },
  ],
  mapsUrl: "https://maps.app.goo.gl/SrwB5hVTBWNHsE3W9?g_st=ic",
  mapsEmbed:
    "https://www.google.com/maps?q=Ciesse+Intermediazioni,+Via+Alcide+De+Gasperi,+21,+67039+Sulmona+AQ&output=embed",
  directions: "Magazzini e uffici raggiungibili dalla SS 17 dir. Roccaraso.",
  switchboard: "Centralino attivo lun – ven 7:30 – 19:00, sabato 7:30 – 13:00.",
  facebook: "https://www.facebook.com/ciesseintermediazionisas/",
  instagram: "https://www.instagram.com/ciesseintermediazioni_sulmona/",
  privacyUrl: "https://www.iubenda.com/privacy-policy/65925452",
  hours: [
    {
      title: "Magazzino",
      rows: [
        ["Lunedì – Venerdì", "7:30 – 18:00", "orario no stop"],
        ["Sabato", "7:30 – 13:00"],
      ],
    },
    {
      title: "Show-room e Amministrazione",
      rows: [
        ["Lunedì – Venerdì", "8:30 – 13:00 · 15:00 – 19:00"],
        ["Sabato", "8:30 – 13:00"],
      ],
    },
  ] as { title: string; rows: string[][] }[],
};

const U = (id: string) => `https://images.unsplash.com/${id}?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400`;

export const HERO_SLIDES = [
  U("photo-1687180498602-5a1046defaa4"),
  U("photo-1661107259637-4e1c55462428"),
  U("photo-1556020685-ae41abfc9365"),
];

// pos = CSS object-position keeping the subject in frame. Several photos on one category cross-fade.
export interface Photo { src: string; alt: string; pos?: string }
// wide = optional alternative used by the wide Collezioni frames (e.g. two portrait photos joined side by side).
export interface Category { n: string; title: string; text: string; photos: Photo[]; wide?: Photo[] }

const P = (name: string) => `/img/categorie/${name}.webp`;

export const CATEGORIES: Category[] = [
  { n: "01", title: "Materiali edili", text: "Laterizi, coperture, cementi, ferro, isolanti, impermeabilizzanti, malte, prodotti per la posa, legnami, travi lamellari", photos: [
    { src: P("01-laterizi"), alt: "Bancali di laterizi nel piazzale Ciesse a Sulmona", pos: "center 62%" },
    { src: P("01-weber"), alt: "Bancali di sacchi Weber nel magazzino Ciesse", pos: "center 55%" },
  ] },
  { n: "02", title: "Ferramenta, elettricità, attrezzature, sicurezza", text: "Utensileria, attrezzature da cantiere, abbigliamento da lavoro", photos: [
    { src: P("02-upower-bosch"), alt: "Reparto abbigliamento e calzature da lavoro U-Power e parete utensili elettrici Bosch", pos: "center 10%" },
  ] },
  { n: "03", title: "Calcestruzzo e lavorazione ferro", text: "Attività certificate Abicert 7399 - CLS-099 e UNI PDR 88\nCentro di Trasformazione N. 494/10", photos: [
    { src: P("03-ferro"), alt: "Impianto di lavorazione del ferro per cemento armato Ciesse", pos: "20% 60%" },
    { src: P("03-magazzino"), alt: "Interno del magazzino Ciesse con bancali di materiali", pos: "center 55%" },
  ] },
  { n: "04", title: "Vernici e colori", text: "Vernici, smalti, pitture e accessori per interni ed esterni.", photos: [
    { src: P("04-tintometro"), alt: "Tintometro per la preparazione dei colori Ciesse", pos: "center 25%" },
    { src: P("04-pitture"), alt: "Scaffale di pitture murali IVC e Muratti", pos: "center 45%" },
  ], wide: [
    { src: P("04-tintometro-pitture"), alt: "Tintometro e scaffale di pitture murali IVC e Muratti" },
  ] },
  { n: "05", title: "Termoidraulica e condizionamento", text: "Impianti idraulici, caldaie, termoarredi, pompe di calore, condizionatori, stufe, camini, forni, barbecue e pellet", photos: [{ src: U("photo-1629079447777-1e605162dc8d"), alt: "Termoidraulica e condizionamento" }] },
  { n: "06", title: "Show-room", text: "Pavimenti, rivestimenti, parquet, mosaici, ceramiche, arredo bagno, sanitari, rubinetteria, docce, idromassaggi", photos: [{ src: U("photo-1687180498602-5a1046defaa4"), alt: "Show-room" }] },
];

export interface Service { title: string; text: string }

export const SERVICES: Service[] = [
  { title: "Consegne a domicilio", text: "La merce viene consegnata direttamente a casa o in cantiere." },
  { title: "Pronta consegna", text: "Visita il nostro magazzino: ordini, carichi e riparti in tempi brevi." },
  { title: "Detrazioni fiscali", text: "Approfitta degli incentivi economici sull'acquisto dei nostri prodotti." },
  { title: "Finanziamenti", text: "Finanziamenti a tasso zero su una vasta gamma di prodotti." },
];

export const CERTIFICATIONS = [
  { k: "UNI EN ISO 9001:2015", v: "Tutte le attività certificate, anche secondo D.M. 14/01/08." },
  { k: "Calcestruzzo", v: "Prodotto presso i nostri impianti — Certificato N° 7399 – CLS-099." },
  { k: "Ferro per costruzioni", v: "Centro di lavorazione — Centro di Trasformazione N° 494/10." },
];

export const STATS: { k: string; k2?: string; v: string }[] = [
  { k: "1992", v: "Anno di fondazione" },
  { k: "25.000", v: "Mq di magazzino" },
  { k: "30+", v: "Anni di esperienza" },
  { k: "ISO 9001", k2: "ISO 45001", v: "Attività certificate" },
];

export const MARQUEE = ["Materiali edili", "Ferramenta", "Utensileria", "Vernici e colori", "Termoidraulica", "Show-room", "Calcestruzzo", "Movimento terra"];

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/collezioni", label: "Collezioni" },
  { to: "/servizi", label: "Servizi" },
  { to: "/preventivo", label: "Preventivo" },
  { to: "/contatti", label: "Contatti" },
];
