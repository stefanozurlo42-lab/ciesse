import { useEffect, useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { CATEGORIES, SITE } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { EASE } from "@/components/Motion";
import { ApiError, apiPost } from "@/lib/api";
import type { ContactPref, QuoteCreate, QuoteSubmitResponse } from "@/lib/types";

const TYPES = ["Nuova costruzione", "Ristrutturazione", "Finiture d'interni", "Fornitura materiali", "Noleggio mezzi / calcestruzzo"];
const TIMINGS = ["Il prima possibile", "Entro 1 mese", "Entro 3 mesi", "Oltre 3 mesi", "Da definire"];
const PREFS: { v: ContactPref; label: string }[] = [
  { v: "email", label: "Email" },
  { v: "telefono", label: "Telefono" },
  { v: "indifferente", label: "Indifferente" },
];
const STEPS = ["Intervento", "Prodotti", "Contatti"];
const DRAFT_KEY = "ciesse-quote-draft";
const EMPTY: QuoteCreate = {
  tipologia: "", categorie: [], descrizione: "", quantita: "", tempistiche: "",
  nome: "", cognome: "", email: "", telefono: "", comune: "", preferenza_contatto: "indifferente", privacy: false,
};

type FormProps = { form: QuoteCreate; setForm: (f: QuoteCreate) => void };

const loadDraft = (): QuoteCreate => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<QuoteCreate>) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

const StepTypes = ({ form, setForm }: FormProps) => (
  <div className="grid sm:grid-cols-2 gap-3">
    {TYPES.map((t, i) => (
      <button type="button" key={t} data-testid={`quote-type-${i}`} onClick={() => setForm({ ...form, tipologia: t })} className={`chip ${form.tipologia === t ? "is-on" : ""}`}>{t}</button>
    ))}
  </div>
);

const StepProducts = ({ form, setForm }: FormProps) => {
  const toggle = (t: string) =>
    setForm({ ...form, categorie: form.categorie.includes(t) ? form.categorie.filter((x) => x !== t) : [...form.categorie, t] });
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-3">
        {CATEGORIES.map((c, i) => (
          <button type="button" key={c.title} data-testid={`quote-category-${i}`} onClick={() => toggle(c.title)} className={`chip ${form.categorie.includes(c.title) ? "is-on" : ""}`}>{c.title}</button>
        ))}
      </div>
      <textarea rows={4} className="field resize-none" placeholder="Descrivete brevemente l'intervento (metrature, tempi, note)" value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} data-testid="quote-description-input" />
      <input className="field" placeholder="Quantità / metrature indicative (es. 120 mq, 30 sacchi)" value={form.quantita} onChange={(e) => setForm({ ...form, quantita: e.target.value })} data-testid="quote-quantity-input" />
      <div>
        <p className="text-[12px] tracking-[0.2em] uppercase text-[#6b645b] mb-4">Tempistiche</p>
        <div className="flex flex-wrap gap-3">
          {TIMINGS.map((t, i) => (
            <button type="button" key={t} data-testid={`quote-timing-${i}`} onClick={() => setForm({ ...form, tempistiche: form.tempistiche === t ? "" : t })} className={`chip ${form.tempistiche === t ? "is-on" : ""}`}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepContact = ({ form, setForm }: FormProps) => {
  const set = (k: "nome" | "cognome" | "email" | "telefono" | "comune") => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <input className="field" placeholder="Nome *" value={form.nome} onChange={set("nome")} data-testid="quote-name-input" />
        <input className="field" placeholder="Cognome *" value={form.cognome} onChange={set("cognome")} data-testid="quote-surname-input" />
        <input type="email" className="field" placeholder="Email *" value={form.email} onChange={set("email")} data-testid="quote-email-input" />
        <input type="tel" className="field" placeholder={form.preferenza_contatto === "telefono" ? "Telefono *" : "Telefono"} value={form.telefono} onChange={set("telefono")} data-testid="quote-phone-input" />
        <input className="field sm:col-span-2" placeholder="Comune del cantiere" value={form.comune} onChange={set("comune")} data-testid="quote-city-input" />
      </div>
      <div>
        <p className="text-[12px] tracking-[0.2em] uppercase text-[#6b645b] mb-4">Come preferite essere ricontattati?</p>
        <div className="flex flex-wrap gap-3">
          {PREFS.map((p) => (
            <button type="button" key={p.v} data-testid={`quote-pref-${p.v}`} onClick={() => setForm({ ...form, preferenza_contatto: p.v })} className={`chip ${form.preferenza_contatto === p.v ? "is-on" : ""}`}>{p.label}</button>
          ))}
        </div>
      </div>
      <label className="flex items-start gap-3 text-[14px] text-[#4a443d] cursor-pointer" data-testid="quote-privacy-label">
        <input
          type="checkbox"
          checked={form.privacy}
          onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
          data-testid="quote-privacy-checkbox"
          className="mt-1 h-4 w-4 accent-[#B4532A] shrink-0"
        />
        <span>
          Ho letto l'<a href={SITE.privacyUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4" data-testid="quote-privacy-link">informativa privacy</a> e acconsento al trattamento dei miei dati per ricevere il preventivo. *
        </span>
      </label>
    </div>
  );
};

const Done = ({ reset, numero }: { reset: () => void; numero: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} data-testid="quote-success" className="py-10">
    <span className="w-14 h-14 rounded-full bg-[#B4532A] text-[#f4f0ea] grid place-items-center"><Check /></span>
    <h2 className="mt-8 font-display text-4xl md:text-6xl leading-none">Richiesta <em>inviata.</em></h2>
    <p className="mt-6 max-w-md text-[#0b0b0b]" data-testid="quote-success-message">
      Richiesta di preventivo inviata con successo. Ti contatteremo al più presto.
    </p>
    <p className="mt-3 max-w-md text-[14px] text-[#4a443d]" data-testid="quote-success-number">
      Numero richiesta: <strong>{numero}</strong>. Per urgenze chiamate il centralino al {SITE.phones[0].display}.
    </p>
    <button onClick={reset} data-testid="quote-new-btn" className="btn-dark mt-10">Nuova richiesta <ArrowRight size={16} /></button>
  </motion.div>
);

const validEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());

const errorMessage = (err: unknown): string => {
  if (err instanceof ApiError) {
    if (err.status === 429) return "Troppe richieste inviate in poco tempo. Riprovate tra qualche minuto.";
    if (err.status === 422) return "Alcuni dati non sono validi: controllate i campi obbligatori e l'indirizzo email.";
  }
  return "Invio non riuscito per un problema di connessione o del server.";
};

export default function Preventivo() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<QuoteCreate>(loadDraft);

  // Keep a local draft so the customer never loses what they typed (e.g. if the send fails).
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const send = useMutation({
    mutationFn: (body: QuoteCreate) => apiPost<QuoteSubmitResponse>("/quotes", body),
    onSuccess: () => localStorage.removeItem(DRAFT_KEY),
  });

  const contactOk =
    form.nome.trim() !== "" && form.cognome.trim() !== "" && validEmail(form.email) && form.privacy &&
    (form.preferenza_contatto !== "telefono" || form.telefono.trim() !== "");
  const canNext = [form.tipologia !== "", true, contactOk][step];

  const submit = () => send.mutate(form);
  const reset = () => { setForm(EMPTY); setStep(0); send.reset(); };

  return (
    <div data-testid="quote-page">
      <PageHero testId="quote-hero" eyebrow="Preventivo" lines={["Un preventivo", <em key="m">su misura.</em>]} intro="Tre passaggi per raccontarci l'intervento: i nostri consulenti vi risponderanno con una stima dedicata." />
      <section className="container-x pb-28 md:pb-40">
        <div className="max-w-3xl">
          {send.isSuccess ? <Done reset={reset} numero={send.data.numero} /> : (
            <>
              <div className="flex gap-6 mb-12" data-testid="quote-steps">
                {STEPS.map((s, i) => (
                  <div key={s} className="flex-1">
                    <div className="h-px bg-[#0b0b0b]/15 relative overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 bg-[#B4532A]" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.7, ease: EASE }} />
                    </div>
                    <p className={`mt-3 text-[12px] tracking-[0.2em] uppercase ${i === step ? "text-[#0b0b0b]" : "text-[#6b645b]"}`}>{String(i + 1).padStart(2, "0")} · {s}</p>
                  </div>
                ))}
              </div>
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                {step === 0 && <StepTypes form={form} setForm={setForm} />}
                {step === 1 && <StepProducts form={form} setForm={setForm} />}
                {step === 2 && <StepContact form={form} setForm={setForm} />}
              </motion.div>
              {send.isError && (
                <div data-testid="quote-error" role="alert" className="mt-8 border-l-2 border-[#9a3412] bg-[#9a3412]/5 px-5 py-4 text-sm text-[#9a3412]">
                  <p className="font-medium">{errorMessage(send.error)}</p>
                  <p className="mt-1 text-[#4a443d]">
                    I dati inseriti sono stati conservati: potete riprovare ora oppure scriverci a{" "}
                    <a href={`mailto:${SITE.email}`} className="underline underline-offset-4">{SITE.email}</a> o chiamare il {SITE.phones[0].display}.
                  </p>
                  <button type="button" onClick={submit} data-testid="quote-retry-btn" className="mt-3 inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-[#0b0b0b]">
                    <RotateCcw size={14} /> Riprova l'invio
                  </button>
                </div>
              )}
              <div className="mt-12 flex items-center justify-between">
                <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0} data-testid="quote-back-btn" className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase disabled:opacity-0">
                  <ArrowLeft size={16} /> Indietro
                </button>
                {step < 2 ? (
                  <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext} data-testid="quote-next-btn" className="btn-dark">Avanti <ArrowRight size={16} /></button>
                ) : (
                  <button type="button" onClick={submit} disabled={!canNext || send.isPending} data-testid="quote-submit-btn" className="btn-dark">
                    {send.isPending ? "Invio…" : "Invia richiesta"} <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
