"""Server-side email templates (inline CSS, table layout). All interpolation is escaped."""

import os
from html import escape

from models.quote import ContactMessage, Quote

INK, CREAM, CLAY, MUTED = "#0b0b0b", "#f4f0ea", "#b4532a", "#6b645b"
CONTACT_LABELS = {"email": "Email", "telefono": "Telefono", "indifferente": "Indifferente"}


def _site_url() -> str:
    return os.environ.get("PUBLIC_SITE_URL", "").rstrip("/")


def _row(label: str, value_html: str) -> str:
    return (
        f'<tr><td style="padding:10px 14px;border-bottom:1px solid #e7e1d8;width:190px;'
        f'font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:{MUTED};vertical-align:top">'
        f'{escape(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #e7e1d8;'
        f'font-size:15px;color:{INK};vertical-align:top">{value_html or "&mdash;"}</td></tr>'
    )


def _section(title: str, rows: str) -> str:
    return (
        f'<tr><td style="padding:26px 32px 8px"><p style="margin:0 0 10px;font-size:12px;letter-spacing:3px;'
        f'text-transform:uppercase;color:{CLAY};font-weight:bold">{escape(title)}</p>'
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="border-collapse:collapse;background:#ffffff;border:1px solid #e7e1d8">{rows}</table></td></tr>'
    )


def _wrap(title: str, intro: str, body: str, footer_note: str) -> str:
    site = _site_url()
    admin_link = (
        f'<tr><td style="padding:24px 32px 8px"><a href="{escape(site)}/admin" '
        f'style="display:inline-block;background:{INK};color:{CREAM};text-decoration:none;padding:14px 26px;'
        f'font-size:12px;letter-spacing:2px;text-transform:uppercase">Apri l\'area amministrativa</a></td></tr>'
        if site.startswith("https://") else ""
    )
    return (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{CREAM};'
        f'font-family:Arial,Helvetica,sans-serif"><tr><td align="center" style="padding:24px 12px">'
        f'<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;'
        f'width:100%;background:{CREAM}">'
        f'<tr><td style="background:{INK};padding:26px 32px"><p style="margin:0;font-family:Georgia,serif;'
        f'font-size:26px;color:{CREAM}">Ciesse <span style="font-size:11px;letter-spacing:3px;'
        f'color:#c9c1b5;font-family:Arial,sans-serif">INTERMEDIAZIONI</span></p></td></tr>'
        f'<tr><td style="padding:30px 32px 0"><h1 style="margin:0;font-family:Georgia,serif;font-weight:normal;'
        f'font-size:32px;line-height:1.15;color:{INK}">{escape(title)}</h1>'
        f'<p style="margin:12px 0 0;font-size:15px;color:#4a443d;line-height:1.5">{intro}</p></td></tr>'
        f'{body}{admin_link}'
        f'<tr><td style="padding:28px 32px;font-size:12px;color:{MUTED};line-height:1.6">{footer_note}<br>'
        f'Email automatica inviata dal sito di {escape("CIESSE Intermediazioni sas")} &mdash; Sulmona (AQ).</td></tr>'
        f'</table></td></tr></table>'
    )


def _fmt_dt(q_dt) -> str:
    return q_dt.strftime("%d/%m/%Y %H:%M") + " UTC"


def quote_email(q: Quote) -> tuple[str, str]:
    full_name = f"{q.nome} {q.cognome}".strip()
    subject = f"Nuova richiesta di preventivo n. {q.numero} — {full_name}"
    email_html = f'<a href="mailto:{escape(q.email)}" style="color:{CLAY}">{escape(q.email)}</a>'
    tel_html = (
        f'<a href="tel:{escape(q.telefono.replace(" ", ""))}" style="color:{CLAY}">{escape(q.telefono)}</a>'
        if q.telefono else ""
    )
    cliente = "".join([
        _row("Nome", escape(q.nome)),
        _row("Cognome", escape(q.cognome)),
        _row("Email", email_html),
        _row("Telefono", tel_html),
        _row("Comune del cantiere", escape(q.comune)),
        _row("Preferenza di contatto", escape(CONTACT_LABELS.get(q.preferenza_contatto, q.preferenza_contatto))),
    ])
    desc_html = escape(q.descrizione).replace("\n", "<br>")
    intervento = "".join([
        _row("Tipo di intervento", f"<strong>{escape(q.tipologia)}</strong>"),
        _row("Categorie prodotti", escape(", ".join(q.categorie))),
        _row("Quantità / metrature", escape(q.quantita)),
        _row("Tempistiche", escape(q.tempistiche)),
        _row("Descrizione", desc_html),
    ])
    meta = "".join([
        _row("N. richiesta", str(q.numero)),
        _row("Ricevuta il", escape(_fmt_dt(q.created_at))),
        _row("Consenso privacy", "Accettato" if q.privacy else "No"),
    ])
    body = _section("Dati del cliente", cliente) + _section("Dettagli della richiesta", intervento) + _section("Riepilogo", meta)
    intro = f"Hai ricevuto una nuova richiesta di preventivo dal sito da <strong>{escape(full_name)}</strong>."
    note = "Per rispondere al cliente scrivi all'indirizzo email indicato sopra. La richiesta è salvata anche nell'area amministrativa."
    return subject, _wrap("Nuova richiesta di preventivo", intro, body, note)


def contact_email(m: ContactMessage) -> tuple[str, str]:
    subject = f"Nuovo messaggio dal sito — {m.nome}"
    rows = "".join([
        _row("Nome e cognome", escape(m.nome)),
        _row("Email", f'<a href="mailto:{escape(m.email)}" style="color:{CLAY}">{escape(m.email)}</a>'),
        _row("Telefono", escape(m.telefono)),
        _row("Messaggio", escape(m.messaggio).replace("\n", "<br>")),
        _row("Ricevuto il", escape(_fmt_dt(m.created_at))),
    ])
    intro = f"Hai ricevuto un nuovo messaggio dal modulo contatti da <strong>{escape(m.nome)}</strong>."
    return subject, _wrap("Nuovo messaggio dal sito", intro, _section("Dati del messaggio", rows),
                          "Per rispondere scrivi all'indirizzo email indicato sopra.")
