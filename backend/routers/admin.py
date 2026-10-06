"""Owner admin area: password login (httpOnly JWT cookie) + quote management."""

import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from lib.db import db
from lib.ratelimit import check_rate
from models.quote import AdminLogin, AdminMe, Quote, QuoteStats, QuoteUpdate
from routers.quotes import deliver_quote_email

router = APIRouter()

COOKIE = "ciesse_admin"
TTL_HOURS = 12


def _secret() -> str:
    return os.environ["ADMIN_JWT_SECRET"]


def _is_admin(request: Request) -> bool:
    token = request.cookies.get(COOKIE)
    if not token:
        return False
    try:
        data = jwt.decode(token, _secret(), algorithms=["HS256"])
        return data.get("role") == "admin"
    except jwt.PyJWTError:
        return False


async def require_admin(request: Request) -> None:
    if not _is_admin(request):
        raise HTTPException(status_code=401, detail="Non autorizzato")


def _norm(doc: dict) -> Quote:
    doc.pop("_id", None)
    for k in ("created_at", "updated_at"):
        if isinstance(doc.get(k), datetime) and doc[k].tzinfo is None:
            doc[k] = doc[k].replace(tzinfo=timezone.utc)
    return Quote(**doc)


# ---- auth ----
@router.post("/auth/login", response_model=AdminMe)
async def login(payload: AdminLogin, request: Request, response: Response):
    check_rate(request, "login", limit=10, window_s=900)
    if not hmac.compare_digest(payload.password.encode(), os.environ["ADMIN_PASSWORD"].encode()):
        raise HTTPException(status_code=401, detail="Password non corretta")
    exp = datetime.now(timezone.utc) + timedelta(hours=TTL_HOURS)
    token = jwt.encode({"role": "admin", "exp": exp}, _secret(), algorithm="HS256")
    response.set_cookie(COOKIE, token, httponly=True, secure=True, samesite="lax",
                        max_age=TTL_HOURS * 3600, path="/")
    return AdminMe(authenticated=True)


@router.post("/auth/logout", response_model=AdminMe)
async def logout(response: Response):
    response.delete_cookie(COOKIE, path="/")
    return AdminMe(authenticated=False)


@router.get("/auth/me", response_model=AdminMe)
async def me(request: Request):
    return AdminMe(authenticated=_is_admin(request))


# ---- quotes ----
@router.get("/admin/quotes", response_model=list[Quote], dependencies=[Depends(require_admin)])
async def list_quotes(status: Optional[str] = None):
    query = {"status": status} if status else {}
    docs = await db.quotes.find(query, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return [_norm(d) for d in docs]


@router.get("/admin/stats", response_model=QuoteStats, dependencies=[Depends(require_admin)])
async def stats():
    counts = {s: 0 for s in ("nuova", "in_lavorazione", "preventivo_inviato", "chiusa")}
    async for row in db.quotes.aggregate([{"$group": {"_id": "$status", "n": {"$sum": 1}}}]):
        if row["_id"] in counts:
            counts[row["_id"]] = row["n"]
    failed = await db.quotes.count_documents({"email_status": "fallita"})
    return QuoteStats(totale=sum(counts.values()), email_fallite=failed, **counts)


@router.get("/admin/quotes/{id}", response_model=Quote, dependencies=[Depends(require_admin)])
async def get_quote(id: str):
    doc = await db.quotes.find_one({"id": id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    return _norm(doc)


@router.patch("/admin/quotes/{id}", response_model=Quote, dependencies=[Depends(require_admin)])
async def update_quote(id: str, payload: QuoteUpdate):
    changes = payload.model_dump(exclude_none=True)
    if changes:
        changes["updated_at"] = datetime.now(timezone.utc)
        res = await db.quotes.update_one({"id": id}, {"$set": changes})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Richiesta non trovata")
    return await get_quote(id)


@router.post("/admin/quotes/{id}/resend-email", response_model=Quote, dependencies=[Depends(require_admin)])
async def resend_email(id: str):
    q = await get_quote(id)
    await deliver_quote_email(q)
    return await get_quote(id)
