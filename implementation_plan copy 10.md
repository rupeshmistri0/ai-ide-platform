# FastAPI Health Endpoint Implementation Plan

This plan details how to create/enhance the health endpoint `/health` (or `/api/v1/health`) in FastAPI to check critical dependency systems (Database and Ollama) and return runtime metadata (version, uptime).

---

## Technical Specifications

- **Database Connection Check**: Executes a query (`SELECT 1`) using SQLAlchemy's async engine to verify connection status.
- **Ollama Availability Check**: Performs a non-blocking HTTP request (using Python's `urllib` wrapped in `asyncio.to_thread` to avoid event loop blockages) to `OLLAMA_BASE_URL` with a 2-second timeout.
- **Runtime Stats**:
  - **Uptime**: Calculated using a startup timestamp set when the FastAPI app initializes.
  - **Version**: Read from `settings.VERSION`.

---

## Proposed Changes

### Configuration & Environment

#### [MODIFY] [.env.example](file:///d:/mysoft/ai-ide-platform/.env.example)
- Add `OLLAMA_BASE_URL="http://localhost:11434"` configuration default.

#### [MODIFY] [.env.development](file:///d:/mysoft/ai-ide-platform/.env.development)
- Add `OLLAMA_BASE_URL="http://localhost:11434"` configuration default.

#### [MODIFY] [config.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/core/config.py)
- Expose `OLLAMA_BASE_URL: str = "http://localhost:11434"` in Pydantic `Settings`.

### API Backend Files

#### [NEW] [health.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/api/v1/endpoints/health.py)
- Create a new router endpoint `/health` that performs checks on Database connection and Ollama availability.
- Computes and returns uptime.

#### [MODIFY] [api.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/api/v1/api.py)
- Include the new `/health` router in the v1 router endpoints.

#### [MODIFY] [main.py](file:///d:/mysoft/ai-ide-platform/apps/api/app/main.py)
- Record the startup timestamp in FastAPI application state or `app.state` to enable calculating uptime.
- Redirect/enhance the root-level `/health` endpoint to call or return the v1 health check logic.

---

## Verification Plan

### Automated Tests
- Run Python syntax checks on new files: `python -m py_compile app/api/v1/endpoints/health.py`
- Run dynamic endpoint validation: Start uvicorn and request `/api/v1/health`.

### Manual Verification
- Test with Ollama running/not running to ensure the health check gracefully reports `'unavailable'` without throwing unhandled exceptions.
