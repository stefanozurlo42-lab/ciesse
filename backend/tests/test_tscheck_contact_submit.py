"""Criterion: POST /api/contact (Contatti form) returns 201 and is persisted."""

import uuid

import httpx


def test_contact_submit_returns_201(client: httpx.Client):
    unique = uuid.uuid4().hex[:8]
    body = {
        "nome": f"Tscheck Contact {unique} (TEST)",
        "email": f"tscheck.contact.{unique}@example.com",
        "telefono": "",
        "messaggio": f"tscheck-contact-message-{unique}",
    }
    r = client.post("/contact", json=body)
    assert r.status_code == 201, f"POST /api/contact -> {r.status_code} {r.text}"
    data = r.json()
    assert "id" in data
    assert "email_sent" in data and isinstance(data["email_sent"], bool)
