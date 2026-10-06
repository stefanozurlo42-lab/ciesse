"""Criterion: Admin area is protected — 401 without cookie, wrong password rejected,
correct password returns an auth cookie and unlocks /api/admin/* endpoints.
"""

import os

import httpx

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Ciesse-Admin-2026!")


def test_admin_quotes_requires_auth(client: httpx.Client):
    r = client.get("/admin/quotes")
    assert r.status_code == 401, f"GET /api/admin/quotes (no cookie) -> {r.status_code} {r.text}"

    r2 = client.get("/admin/stats")
    assert r2.status_code == 401, f"GET /api/admin/stats (no cookie) -> {r2.status_code} {r2.text}"


def test_admin_login_wrong_then_correct_password(client: httpx.Client):
    bad = client.post("/auth/login", json={"password": "definitely-wrong-password"})
    assert bad.status_code == 401, f"POST /api/auth/login (wrong pw) -> {bad.status_code} {bad.text}"

    good = client.post("/auth/login", json={"password": ADMIN_PASSWORD})
    assert good.status_code == 200, f"POST /api/auth/login (correct pw) -> {good.status_code} {good.text}"
    assert good.json()["authenticated"] is True
    assert "ciesse_admin" in good.cookies
    cookie = dict(good.cookies)  # httpx's Cookies object mismatches "localhost" domain; use a plain dict

    # Cookie now unlocks protected endpoints.
    r = client.get("/admin/quotes", cookies=cookie)
    assert r.status_code == 200, f"GET /api/admin/quotes (with cookie) -> {r.status_code} {r.text}"
    assert isinstance(r.json(), list)

    stats = client.get("/admin/stats", cookies=cookie)
    assert stats.status_code == 200, f"GET /api/admin/stats (with cookie) -> {stats.status_code} {stats.text}"
    body = stats.json()
    assert "totale" in body and "email_fallite" in body
