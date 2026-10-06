"""Public endpoints: quote request + contact message. Saved to Mongo FIRST, then emailed to the owner."""

import logging
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Request
from pymongo import ReturnDocument

from lib.db import db
from lib.email import EmailSendError, send_email
from lib.ratelimit import check_rate
from lib.templates import contact_email, quote_email
from models.quote import ContactCreate, ContactMessage, Quote, QuoteCreate, QuoteSubmitResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def owner_email() -> str:
    return os.environ["OWNER_EMAIL"]


async def next_quote_number() -> int:
    doc = await db.counters.find_one_and_update(
        {"_id": "quotes"}, {"$inc": {"seq": 1}}, upsert=True, return_document=ReturnDocument.AFTER
    )
    return int(doc["seq"])


async def deliver_quote_email(q: Quote) -> bool:
    """Try to email the owner; record the outcome on the stored quote. Never raises."""
    subject, html = quote_email(q)
    try:
        await send_email(to=owner_email(), subject=subject, html=html)
        update = {"email_status": "inviata", "email_error": None}
        ok = True
    except (EmailSendError, ValueError) as e:
        update = {"email_status": "fallita", "email_error": str(e)[:300]}
        ok = False
    update["updated_at"] = datetime.now(timezone.utc)
    await db.quotes.update_one({"id": q.id}, {"$set": update})
    return ok


@router.post("/quotes", response_model=QuoteSubmitResponse, status_code=201)
async def create_quote(payload: QuoteCreate, request: Request):
    check_rate(request, "quotes", limit=8, window_s=3600)
    q = Quote(**payload.model_dump(), numero=await next_quote_number())
    await db.quotes.insert_one(q.model_dump())  # persisted before any email attempt: never lost
    sent = await deliver_quote_email(q)
    return QuoteSubmitResponse(id=q.id, numero=q.numero, email_sent=sent)


@router.post("/contact", status_code=201)
async def create_contact(payload: ContactCreate, request: Request):
    check_rate(request, "contact", limit=8, window_s=3600)
    m = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(m.model_dump())
    subject, html = contact_email(m)
    try:
        await send_email(to=owner_email(), subject=subject, html=html)
        status = "inviata"
    except (EmailSendError, ValueError):
        status = "fallita"
    await db.contact_messages.update_one({"id": m.id}, {"$set": {"email_status": status}})
    return {"id": m.id, "email_sent": status == "inviata"}
