"""Criterion: POST /api/quotes persists quote, returns {id, numero, email_sent}, and stores email_status.

This performs ONE real quote submission (counts toward the "max 3 real submissions" budget
noted in the briefing) using a name clearly marked (TEST) so it is identifiable in the owner inbox / DB.
"""

import uuid

import httpx


def test_quote_submit_persists_and_sets_email_status(client: httpx.Client):
    unique = uuid.uuid4().hex[:8]
    body = {
        "tipologia": "Ristrutturazione",
        "categorie": ["Materiali edili"],
        "descrizione": f"tscheck-quote-persist-{unique}",
        "quantita": "10 mq",
        "tempistiche": "Entro 1 mese",
        "nome": f"Tscheck{unique}",
        "cognome": "Persistence (TEST)",
        "email": f"tscheck.{unique}@example.com",
        "telefono": "",
        "comune": "Sulmona",
        "preferenza_contatto": "email",
        "privacy": True,
    }
    r = client.post("/quotes", json=body)
    assert r.status_code == 201, f"POST /api/quotes -> {r.status_code} {r.text}"
    data = r.json()
    assert "id" in data and "numero" in data and "email_sent" in data
    assert isinstance(data["numero"], int) and data["numero"] > 0
    assert isinstance(data["email_sent"], bool)

    # Verify it is actually stored, and check the recorded email_status via admin API.
    login = client.post("/auth/login", json={"password": _admin_password()})
    assert login.status_code == 200, f"admin login -> {login.status_code} {login.text}"
    cookie = dict(login.cookies)  # httpx's Cookies object mismatches "localhost" domain; use a plain dict
    r2 = client.get(f"/admin/quotes/{data['id']}", cookies=cookie)
    assert r2.status_code == 200, f"GET /api/admin/quotes/{{id}} -> {r2.status_code} {r2.text}"
    stored = r2.json()
    assert stored["nome"] == body["nome"]
    assert stored["email_status"] in ("inviata", "fallita")
    # email_sent flag in the POST response must match the stored status.
    assert data["email_sent"] == (stored["email_status"] == "inviata")


def _admin_password() -> str:
    import os
    # Loaded from backend/.env via supervisor env; fall back to documented test credential.
    return os.environ.get("ADMIN_PASSWORD", "Ciesse-Admin-2026!")
