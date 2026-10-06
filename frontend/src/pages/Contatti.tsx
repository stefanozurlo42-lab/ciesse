import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Phone, Mail, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { SITE } from "@/data/site";
import { PageHero } from "@/components/PageHero";
import { HoursList, MapFrame } from "@/components/HoursAndMap";
import { Reveal, Eyebrow } from "@/components/Motion";
import { apiPost } from "@/lib/api";
import type { ContactCreate, ContactResponse } from "@/lib/types";

const EMPTY: ContactCreate = { nome: "", email: "", telefono: "", messaggio: "" };

const ContactForm = () => {
  const [form, setForm] = useState<ContactCreate>(EMPTY);
  const set = (k: keyof ContactCreate) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const send = useMutation({
    mutationFn: (body: ContactCreate) => apiPost<ContactResponse>("/contact", body),
    onSuccess: () => {
      toast.success("Messaggio inviato. Vi ricontatteremo al più presto.");
      setForm(EMPTY);
    },
    onError: () => toast.error(`Invio non riuscito. Scriveteci a ${SITE.email}`),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send.mutate(form);
  };

  return (
    <form onSubmit={submit} data-testid="contact-form" className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <input required className="field" placeholder="Nome e cognome *" value={form.nome} onChange={set("nome")} data-testid="contact-name-input" />
        <input required type="email" className="field" placeholder="Email *" value={form.email} onChange={set("email")} data-testid="contact-email-input" />
      </div>
      <input className="field" placeholder="Telefono" value={form.telefono} onChange={set("telefono")} data-testid="contact-phone-input" />
      <textarea required rows={4} className="field resize-none" placeholder="Il vostro messaggio *" value={form.messaggio} onChange={set("messaggio")} data-testid="contact-message-input" />
      <button type="submit" disabled={send.isPending} className="btn-dark" data-testid="contact-submit-btn">
        {send.isPending ? "Invio…" : "Invia messaggio"} <ArrowRight size={16} />
      </button>
    </form>
  );
};

const InfoBlock = () => (
  <ul className="space-y-5 text-base">
    {SITE.phones.map((p, i) => (
      <li key={p.tel} className="flex items-center gap-4">
        <Phone size={16} className="text-[#B4532A]" />
        <a href={`tel:${p.tel}`} data-testid={`contact-phone-${i}`} className="link-underline">{p.display}</a>
      </li>
    ))}
    <li className="flex items-center gap-4">
      <Mail size={16} className="text-[#B4532A]" />
      <a href={`mailto:${SITE.email}`} data-testid="contact-email-link" className="link-underline">{SITE.email}</a>
    </li>
    <li className="flex items-start gap-4">
      <MapPin size={16} className="text-[#B4532A] mt-1" />
      <span data-testid="contact-address">{SITE.street}<br />{SITE.cap} {SITE.city} ({SITE.prov})</span>
    </li>
    <li className="text-[14px] text-[#4a443d] pt-2">{SITE.switchboard}<br />{SITE.directions}</li>
  </ul>
);

export default function Contatti() {
  return (
    <div data-testid="contact-page">
      <PageHero testId="contact-hero" eyebrow="Contatti" lines={["Passate a", <em key="t">trovarci.</em>]} intro="Per informazioni tecniche e preventivi contattate il centralino o venite in sede: magazzino e show-room vi aspettano." />
      <section className="container-x pb-24 grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5"><InfoBlock /></Reveal>
        <Reveal delay={0.1} className="lg:col-span-7"><ContactForm /></Reveal>
      </section>
      <section className="container-x pb-24 md:pb-36 grid gap-14 lg:grid-cols-12 items-start">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Orari di apertura</Eyebrow>
          <div className="mt-8"><HoursList /></div>
          <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" data-testid="contact-open-maps" className="btn-dark mt-10">Apri in Google Maps <ArrowUpRight size={16} /></a>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 space-y-4">
          <img src="/img/copertinasito-web1.jpg" alt="Ingresso della sede Ciesse a Sulmona" data-testid="contact-entrance-photo" className="w-full aspect-[16/8] object-cover" />
          <MapFrame className="aspect-[16/10]" />
        </Reveal>
      </section>
    </div>
  );
}
