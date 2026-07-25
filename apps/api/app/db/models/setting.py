import uuid
from datetime import datetime
from typing import Dict, Any
from sqlalchemy import String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, GUID, utc_now

class UserSetting(Base):
    __tablename__ = "user_settings"

    id: Mapped[uuid.UUID] = mapped_column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    theme: Mapped[str] = mapped_column(String(20), default="dark")
    editor_settings: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "font_size": 14,
            "tab_size": 2,
            "format_on_save": True,
            "vim_mode": False,
            "word_wrap": "on"
        }
    )
    ai_settings: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "default_model": "gemini-1.5-pro",
            "temperature": 0.7,
            "top_p": 0.95,
            "stream_responses": True,
            "system_prompt": "You are an expert AI IDE coding assistant."
        }
    )
    notification_settings: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=lambda: {
            "email_alerts": True,
            "security_alerts": True
        }
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user: Mapped["User"] = relationship("User", back_populates="settings")
