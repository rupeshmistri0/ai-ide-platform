import logging
import os
import sys
import json
from datetime import datetime
from logging.handlers import RotatingFileHandler
from contextvars import ContextVar
from typing import Any, Dict

from app.core.config import settings

# Thread-safe ContextVar to hold the active request's correlation ID
correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="")

class JSONFormatter(logging.Formatter):
    """
    Structured JSON formatter that formats log records into JSON strings.
    Automatically grabs the request correlation ID if set.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "file": record.filename,
            "line": record.lineno,
            "function": record.funcName,
        }
        
        # Inject correlation ID
        corr_id = correlation_id_var.get()
        if corr_id:
            log_data["correlation_id"] = corr_id
            
        # Capture standard exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        # Capture custom extra fields passed via extra={}
        # Ignore standard LogRecord attributes
        standard_attrs = {
            "name", "msg", "args", "levelname", "levelno", "pathname", "filename",
            "module", "exc_info", "exc_text", "stack_info", "lineno", "funcName",
            "created", "msecs", "relativeCreated", "thread", "threadName",
            "processName", "process"
        }
        extra_fields = {k: v for k, v in record.__dict__.items() if k not in standard_attrs}
        if extra_fields:
            log_data["extra"] = extra_fields

        return json.dumps(log_data)

class ColouredFormatter(logging.Formatter):
    """
    A readable terminal formatter using ANSI colors for development console output.
    """
    GREY = "\x1b[38;20m"
    YELLOW = "\x1b[33;20m"
    RED = "\x1b[31;20m"
    BOLD_RED = "\x1b[31;1m"
    BLUE = "\x1b[34;20m"
    CYAN = "\x1b[36;20m"
    RESET = "\x1b[0m"
    
    COLORS = {
        logging.DEBUG: GREY,
        logging.INFO: CYAN,
        logging.WARNING: YELLOW,
        logging.ERROR: RED,
        logging.CRITICAL: BOLD_RED
    }

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelno, self.RESET)
        time_str = datetime.utcfromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S")
        corr_id = correlation_id_var.get()
        corr_str = f" [{corr_id}]" if corr_id else ""
        
        message = f"[{time_str}]{color} [{record.levelname}]{self.RESET} [{record.name}] [{record.filename}:{record.lineno}]{corr_str} - {record.getMessage()}"
        
        if record.exc_info:
            message += f"\n{self.formatException(record.exc_info)}"
            
        return message

def setup_logging() -> logging.Logger:
    logger = logging.getLogger("enterprise_api")
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    logger.propagate = False  # Avoid duplicates in standard root logs
    
    # Remove any existing handlers to allow clean re-initialization
    if logger.handlers:
        logger.handlers.clear()

    # Ensure logs folder exists
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # 1. Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    if settings.ENVIRONMENT == "development":
        console_handler.setFormatter(ColouredFormatter())
    else:
        console_handler.setFormatter(JSONFormatter())
    logger.addHandler(console_handler)

    # 2. File Handler (Always JSON structured logs for durability/audits)
    file_path = os.path.join(log_dir, "api.log")
    file_handler = RotatingFileHandler(
        file_path,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(JSONFormatter())
    logger.addHandler(file_handler)
        
    return logger

logger = setup_logging()
