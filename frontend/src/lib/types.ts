// Hand-written mirrors of backend/models/quote.py — keep in sync.
export type QuoteStatus = "nuova" | "in_lavorazione" | "preventivo_inviato" | "chiusa";
export type EmailStatus = "inviata" | "fallita" | "in_attesa";
export type ContactPref = "email" | "telefono" | "indifferente";

export interface QuoteCreate {
  tipologia: string;
  categorie: string[];
  descrizione: string;
  quantita: string;
  tempistiche: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  comune: string;
  preferenza_contatto: ContactPref;
  privacy: boolean;
}

export interface Quote extends QuoteCreate {
  id: string;
  numero: number;
  status: QuoteStatus;
  email_status: EmailStatus;
  email_error: string | null;
  note_interne: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteSubmitResponse {
  id: string;
  numero: number;
  email_sent: boolean;
}

export interface QuoteUpdate {
  status?: QuoteStatus;
  note_interne?: string;
}

export interface QuoteStats {
  totale: number;
  nuova: number;
  in_lavorazione: number;
  preventivo_inviato: number;
  chiusa: number;
  email_fallite: number;
}

export interface ContactCreate {
  nome: string;
  email: string;
  telefono: string;
  messaggio: string;
}

export interface ContactResponse {
  id: string;
  email_sent: boolean;
}

export interface AdminMe {
  authenticated: boolean;
}

export const STATUS_LABELS: Record<QuoteStatus, string> = {
  nuova: "Nuova",
  in_lavorazione: "In lavorazione",
  preventivo_inviato: "Preventivo inviato",
  chiusa: "Chiusa",
};

export const CONTACT_LABELS: Record<ContactPref, string> = {
  email: "Email",
  telefono: "Telefono",
  indifferente: "Indifferente",
};
