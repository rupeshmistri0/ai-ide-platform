import uuid
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from app.core.logging import correlation_id_var

class CorrelationIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        correlation_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        
        # Set the correlation ID in thread-safe context variable
        token = correlation_id_var.set(correlation_id)
        try:
            response = await call_next(request)
        finally:
            # Reset after the request finishes to avoid context leaks
            correlation_id_var.reset(token)
            
        response.headers["X-Request-ID"] = correlation_id
        return response
