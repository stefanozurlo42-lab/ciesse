import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, LogOut, Mail, Phone, RefreshCw, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError, apiGet, apiPatch, apiPost } from "@/lib/api";
import { beginSession, endSession } from "@/lib/session";
import {
  CONTACT_LABELS, STATUS_LABELS,
  type AdminMe, type Quote, type QuoteStats, type QuoteStatus, type QuoteUpdate,
} from "@/lib/types";

const STATUSES = Object.keys(STATUS_LABELS) as QuoteStatus[];
const STATUS_DOT: Record<QuoteStatus, string> = {
  nuova: "bg-[#B4532A]",
  in_lavorazione: "bg-[#c99a2e]",
  preventivo_inviato: "bg-[#3f6b52]",
  chiusa: "bg-[#8a8278]",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const StatusBadge = ({ s, testId }: { s: QuoteStatus; testId?: string }) => (
  <span data-testid={testId} className="inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[#0b0b0b] whitespace-nowrap">
    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{STATUS_LABELS[s]}
  </span>
);

const EmailBadge = ({ q }: { q: Quote }) => (
  <span
    data-testid={`quote-email-status-${q.numero}`}
    className={`text-[11px] tracking-[0.12em] uppercase ${q.email_status === "inviata" ? "text-[#3f6b52]" : q.email_status === "fallita" ? "text-[#9a3412]" : "text-[#6b645b]"}`}
  >
    {q.email_status === "inviata" ? "Email inviata" : q.email_status === "fallita" ? "Email non inviata" : "Email in attesa"}
  </span>
);

/* ---------------- login ---------------- */
const Login = () => {
  const [password, setPassword] = useState("");
  const login = useMutation({
    mutationFn: (pw: string) => apiPost<AdminMe>("/auth/login", { password: pw }),
    onSuccess: () => {
      // Wipe any cached data from a previous session, then reload so every query starts fresh.
      beginSession();
      window.location.assign("/admin");
    },
  });
  const submit = (e: FormEvent) => { e.preventDefault(); login.mutate(password); };
  const errText = login.error instanceof ApiError && login.error.status === 429
    ? "Troppi tentativi. Riprova tra qualche minuto."
    : "Password non corretta.";

  return (
    <div className="min-h-[100svh] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-[#0b0b0b] text-[#f4f0ea] p-14">
        <div className="flex items-center gap-2.5"><LogoMark className="w-8 h-8" /><span className="font-display text-3xl">Ciesse</span></div>
        <h1 className="font-display text-7xl leading-[0.95] tracking-tight">Area<br /><em>riservata.</em></h1>
        <p className="text-[13px] text-[#a39b90]">Gestione richieste di preventivo dal sito.</p>
      </div>
      <div className="flex items-center container-x lg:px-16">
        <form onSubmit={submit} className="w-full max-w-md" data-testid="admin-login-form">
          <p className="eyebrow text-[#6b645b]"><span className="inline-block w-6 h-px align-middle mr-3 bg-current" />Accesso proprietario</p>
          <h2 className="mt-6 font-display text-5xl leading-none">Accedi</h2>
          <input
            type="password"
            autoFocus
            className={`field mt-10 ${login.isError ? "is-invalid" : ""}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="admin-password-input"
          />
          {login.isError && <p data-testid="admin-login-error" className="mt-3 text-sm text-[#9a3412]">{errText}</p>}
          <button type="submit" disabled={!password || login.isPending} className="btn-dark mt-10" data-testid="admin-login-submit">
            {login.isPending ? "Accesso…" : "Entra"} <ArrowRight size={16} />
          </button>
          <Link to="/" className="block mt-10 text-[12px] tracking-[0.2em] uppercase text-[#6b645b] link-underline w-fit" data-testid="admin-back-to-site">← Torna al sito</Link>
        </form>
      </div>
    </div>
  );
};

/* ---------------- detail ---------------- */
const Field = ({ label, children, testId }: { label: string; children: React.ReactNode; testId?: string }) => (
  <div className="py-3 border-b border-[#0b0b0b]/10 grid grid-cols-[130px_1fr] gap-4">
    <span className="text-[11px] tracking-[0.16em] uppercase text-[#6b645b] pt-0.5">{label}</span>
    <span className="text-[15px] break-words whitespace-pre-line" data-testid={testId}>{children || "—"}</span>
  </div>
);

const QuoteDetail = ({ q, onUpdate, onResend, busy }: {
  q: Quote; onUpdate: (u: QuoteUpdate) => void; onResend: () => void; busy: boolean;
}) => {
  const [note, setNote] = useState(q.note_interne);
  return (
    <div className="px-6 pb-10 overflow-y-auto" data-testid="quote-detail">
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <Select value={q.status} onValueChange={(v: string) => onUpdate({ status: v as QuoteStatus })}>
          <SelectTrigger className="w-56 rounded-none border-[#0b0b0b]/25 bg-transparent" data-testid="quote-status-select">
            <SelectValue>{(v) => STATUS_LABELS[v as QuoteStatus]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} data-testid={`quote-status-option-${s}`}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <EmailBadge q={q} />
      </div>
      {q.email_status !== "inviata" && (
        <div className="mt-4 border-l-2 border-[#9a3412] bg-[#9a3412]/5 px-4 py-3 text-sm">
          <p className="text-[#9a3412]">L'email di notifica non è stata consegnata{q.email_error ? ` (${q.email_error})` : ""}. La richiesta è comunque salvata.</p>
          <button type="button" onClick={onResend} disabled={busy} data-testid="quote-resend-email-btn" className="mt-2 inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase disabled:opacity-40">
            <RefreshCw size={14} /> Reinvia email
          </button>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Preventivo Ciesse n. ${q.numero}`)}`} className="btn-dark !py-3 !px-5" data-testid="quote-reply-email">
          <Mail size={14} /> Rispondi
        </a>
        {q.telefono && (
          <a href={`tel:${q.telefono.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 border border-[#0b0b0b]/25 px-5 py-3 text-[12px] tracking-[0.22em] uppercase transition-colors duration-300 hover:border-[#0b0b0b]" data-testid="quote-call-phone">
            <Phone size={14} /> Chiama
          </a>
        )}
      </div>
      <p className="mt-8 footer-title !text-[#B4532A] !mb-1">Cliente</p>
      <Field label="Nome" testId="detail-nome">{q.nome}</Field>
      <Field label="Cognome" testId="detail-cognome">{q.cognome}</Field>
      <Field label="Email" testId="detail-email">{q.email}</Field>
      <Field label="Telefono" testId="detail-telefono">{q.telefono}</Field>
      <Field label="Comune" testId="detail-comune">{q.comune}</Field>
      <Field label="Contatto" testId="detail-preferenza">{CONTACT_LABELS[q.preferenza_contatto]}</Field>
      <p className="mt-8 footer-title !text-[#B4532A] !mb-1">Richiesta</p>
      <Field label="Intervento" testId="detail-tipologia">{q.tipologia}</Field>
      <Field label="Categorie" testId="detail-categorie">{q.categorie.join(", ")}</Field>
      <Field label="Quantità" testId="detail-quantita">{q.quantita}</Field>
      <Field label="Tempistiche" testId="detail-tempistiche">{q.tempistiche}</Field>
      <Field label="Descrizione" testId="detail-descrizione">{q.descrizione}</Field>
      <Field label="Privacy" testId="detail-privacy">{q.privacy ? "Consenso accettato" : "No"}</Field>
      <Field label="Ricevuta" testId="detail-created">{fmtDate(q.created_at)}</Field>
      <p className="mt-8 footer-title !text-[#B4532A] !mb-1">Note interne</p>
      <textarea
        rows={4}
        className="field resize-none"
        placeholder="Appunti visibili solo in quest'area…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        data-testid="quote-notes-input"
      />
      <button type="button" disabled={busy || note === q.note_interne} onClick={() => onUpdate({ note_interne: note })} className="btn-dark mt-4 !py-3 !px-5" data-testid="quote-notes-save">
        Salva note
      </button>
    </div>
  );
};

/* ---------------- dashboard ---------------- */
const Dashboard = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<QuoteStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const quotesQ = useQuery({
    queryKey: ["admin-quotes", filter],
    queryFn: () => apiGet<Quote[]>(filter === "all" ? "/admin/quotes" : `/admin/quotes?status=${filter}`),
  });
  const statsQ = useQuery({ queryKey: ["admin-stats"], queryFn: () => apiGet<QuoteStats>("/admin/stats") });
  const detailQ = useQuery({
    queryKey: ["admin-quote", openId],
    queryFn: () => apiGet<Quote>(`/admin/quotes/${openId}`),
    enabled: openId !== null,
  });

  const refreshAll = (q: Quote) => {
    qc.setQueryData(["admin-quote", q.id], q);
    qc.invalidateQueries({ queryKey: ["admin-quotes"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: QuoteUpdate }) => apiPatch<Quote>(`/admin/quotes/${id}`, body),
    onSuccess: (q) => { refreshAll(q); toast.success("Richiesta aggiornata"); },
    onError: () => toast.error("Aggiornamento non riuscito"),
  });
  const resend = useMutation({
    mutationFn: (id: string) => apiPost<Quote>(`/admin/quotes/${id}/resend-email`),
    onSuccess: (q) => {
      refreshAll(q);
      if (q.email_status === "inviata") toast.success("Email reinviata con successo");
      else toast.error("Invio email non riuscito, riprova più tardi");
    },
    onError: () => toast.error("Invio email non riuscito"),
  });

  const stats = statsQ.isError ? undefined : statsQ.data;
  const quotes = quotesQ.isError ? [] : (quotesQ.data ?? []);
  const tabs: { k: QuoteStatus | "all"; label: string; n?: number }[] = [
    { k: "all", label: "Tutte", n: stats?.totale },
    ...STATUSES.map((s) => ({ k: s, label: STATUS_LABELS[s], n: stats?.[s] })),
  ];
  const detail = detailQ.data;

  return (
    <div className="min-h-[100svh]">
      <header className="border-b border-[#0b0b0b]/10 bg-[#f4f0ea]/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="container-x h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" data-testid="admin-brand-link">
            <LogoMark /><span className="font-display text-[26px] leading-none">Ciesse</span>
            <span className="hidden sm:inline text-[10px] tracking-[0.32em] uppercase mt-1.5 text-[#6b645b]">Area riservata</span>
          </Link>
          <button onClick={() => endSession("/admin")} data-testid="admin-logout-btn" className="flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase nav-link">
            <LogOut size={15} /> Esci
          </button>
        </div>
      </header>

      <div className="container-x pt-14 pb-24">
        <p className="eyebrow text-[#6b645b]"><span className="inline-block w-6 h-px align-middle mr-3 bg-current" />Richieste dal sito</p>
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">Preventivi <em>ricevuti.</em></h1>
          {stats && stats.email_fallite > 0 && (
            <p data-testid="admin-failed-emails" className="text-sm text-[#9a3412]">{stats.email_fallite} richieste con email non consegnata — aprile per reinviare.</p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 border-t border-l border-[#0b0b0b]/10" data-testid="admin-status-tabs">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              data-testid={`admin-filter-${t.k}`}
              className={`text-left border-r border-b border-[#0b0b0b]/10 px-5 py-5 transition-colors duration-300 ${filter === t.k ? "bg-[#0b0b0b] text-[#f4f0ea]" : "hover:bg-[#e7e1d8]"}`}
            >
              <p className="font-display text-4xl leading-none" data-testid={`admin-count-${t.k}`}>{t.n ?? "–"}</p>
              <p className={`mt-2 text-[11px] tracking-[0.16em] uppercase ${filter === t.k ? "text-[#c9c1b5]" : "text-[#6b645b]"}`}>{t.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-10" data-testid="admin-quotes-list">
          {quotesQ.isLoading && <p className="py-10 text-[#6b645b]">Caricamento…</p>}
          {quotesQ.isError && <p className="py-10 text-[#9a3412]" data-testid="admin-list-error">Impossibile caricare le richieste. Riprova più tardi.</p>}
          {!quotesQ.isLoading && !quotesQ.isError && quotes.length === 0 && (
            <p className="py-16 font-display text-3xl text-[#6b645b]" data-testid="admin-empty">Nessuna richiesta {filter !== "all" ? `in “${STATUS_LABELS[filter]}”` : "ancora"}.</p>
          )}
          {quotes.map((q) => (
            <button
              key={q.id}
              onClick={() => setOpenId(q.id)}
              data-testid={`admin-quote-row-${q.numero}`}
              className="group w-full text-left grid gap-3 md:grid-cols-12 items-center py-6 border-t border-[#0b0b0b]/10 transition-colors duration-300 hover:bg-[#e7e1d8]/60 md:px-3"
            >
              <span className="md:col-span-1 text-[12px] tracking-[0.2em] text-[#6b645b]">N. {q.numero}</span>
              <span className="md:col-span-3">
                <span className="block font-display text-2xl leading-tight">{q.nome} {q.cognome}</span>
                <span className="block text-[13px] text-[#4a443d]">{q.email}</span>
              </span>
              <span className="md:col-span-3 text-[14px]">
                {q.tipologia}
                {q.comune && <span className="block text-[13px] text-[#6b645b]">{q.comune}</span>}
              </span>
              <span className="md:col-span-2 text-[13px] text-[#4a443d]">{fmtDate(q.created_at)}</span>
              <span className="md:col-span-2 flex flex-col gap-1">
                <StatusBadge s={q.status} testId={`admin-quote-status-${q.numero}`} />
                <EmailBadge q={q} />
              </span>
              <span className="md:col-span-1 hidden md:flex justify-end">
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Sheet open={openId !== null} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-xl bg-[#f4f0ea] p-0 gap-0" data-testid="quote-detail-sheet">
          <SheetHeader className="px-6 pt-8 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SheetDescription className="text-[12px] tracking-[0.2em] uppercase text-[#6b645b]">
                  Richiesta n. {detail?.numero ?? "…"}
                </SheetDescription>
                <SheetTitle className="font-display text-4xl font-normal leading-tight mt-1" data-testid="quote-detail-title">
                  {detail ? `${detail.nome} ${detail.cognome}` : "Caricamento…"}
                </SheetTitle>
              </div>
              <button onClick={() => setOpenId(null)} aria-label="Chiudi" data-testid="quote-detail-close" className="p-2 -mr-2"><X size={20} /></button>
            </div>
          </SheetHeader>
          {detail && (
            <QuoteDetail
              key={detail.id + detail.updated_at}
              q={detail}
              busy={update.isPending || resend.isPending}
              onUpdate={(body) => update.mutate({ id: detail.id, body })}
              onResend={() => resend.mutate(detail.id)}
            />
          )}
          {detailQ.isError && <p className="px-6 text-[#9a3412]">Impossibile caricare la richiesta.</p>}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default function Admin() {
  const me = useQuery({ queryKey: ["auth-me"], queryFn: () => apiGet<AdminMe>("/auth/me"), retry: false });
  if (me.isLoading) return <div className="min-h-[100svh] grid place-items-center text-[#6b645b]" data-testid="admin-loading">Caricamento…</div>;
  return me.data?.authenticated && !me.isError ? <Dashboard /> : <Login />;
}
