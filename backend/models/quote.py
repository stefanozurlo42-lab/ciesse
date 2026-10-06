import uuid
from datetime import datetime, timezone
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

QuoteStatus = Literal["nuova", "in_lavorazione", "preventivo_inviato", "chiusa"]
EmailStatus = Literal["inviata", "fallita", "in_attesa"]
ContactPref = Literal["email", "telefono", "indifferente"]


class QuoteCreate(BaseModel):
    tipologia: str = Field(min_length=1, max_length=120)
    categorie: list[str] = Field(default_factory=list, max_length=20)
    descrizione: str = Field(default="", max_length=5000)
    quantita: str = Field(default="", max_length=500)
    tempistiche: str = Field(default="", max_length=120)
    nome: str = Field(min_length=1, max_length=120)
    cognome: str = Field(min_length=1, max_length=120)
    email: EmailStr
    telefono: str = Field(default="", max_length=40)
    comune: str = Field(default="", max_length=120)
    preferenza_contatto: ContactPref = "indifferente"
    privacy: bool

    @field_validator("nome", "cognome", "tipologia")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("campo obbligatorio")
        return v

    @field_validator("privacy")
    @classmethod
    def must_accept(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Il consenso privacy è obbligatorio")
        return v


class Quote(QuoteCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    numero: int = 0
    status: QuoteStatus = "nuova"
    email_status: EmailStatus = "in_attesa"
    email_error: Optional[str] = None
    note_interne: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class QuoteSubmitResponse(BaseModel):
    id: str
    numero: int
    email_sent: bool


class QuoteUpdate(BaseModel):
    status: Optional[QuoteStatus] = None
    note_interne: Optional[str] = Field(default=None, max_length=5000)


class QuoteStats(BaseModel):
    totale: int
    nuova: int
    in_lavorazione: int
    preventivo_inviato: int
    chiusa: int
    email_fallite: int


class ContactCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=160)
    email: EmailStr
    telefono: str = Field(default="", max_length=40)
    messaggio: str = Field(min_length=1, max_length=5000)


class ContactMessage(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email_status: EmailStatus = "in_attesa"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AdminLogin(BaseModel):
    password: str = Field(min_length=1, max_length=200)


class AdminMe(BaseModel):
    authenticated: bool
