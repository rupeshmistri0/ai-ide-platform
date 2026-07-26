import json
import httpx
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.core.config import settings
from app.core.logging import logger

router = APIRouter()

class ChatMessageSchema(BaseModel):
    role: str
    content: str

class ChatRequestSchema(BaseModel):
    model: str
    messages: List[ChatMessageSchema]

async def stream_ollama_chat(model: str, messages: List[Dict[str, str]]):
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"
    payload = {
        "model": model,
        "messages": messages,
        "stream": True
    }
    
    logger.info(f"Initiating streaming request to Ollama: model={model}, URL={url}")
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            async with client.stream("POST", url, json=payload) as response:
                if response.status_code != 200:
                    error_msg = f"Ollama service returned status code {response.status_code}"
                    logger.error(error_msg)
                    yield f"data: {json.dumps({'error': error_msg})}\n\n"
                    return
                
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        token = data.get("message", {}).get("content", "")
                        done = data.get("done", False)
                        
                        # Send token as standard Server-Sent Event data block
                        yield f"data: {json.dumps({'token': token, 'done': done})}\n\n"
                        
                        if done:
                            break
                    except json.JSONDecodeError:
                        continue
                        
    except Exception as e:
        error_msg = f"Failed to connect to local Ollama service: {str(e)}"
        logger.error(error_msg)
        yield f"data: {json.dumps({'error': error_msg})}\n\n"

@router.post("")
async def chat_endpoint(request: ChatRequestSchema):
    # Format messages to list of dicts for Ollama API
    formatted_messages = [msg.model_dump() for msg in request.messages]
    
    return StreamingResponse(
        stream_ollama_chat(request.model, formatted_messages),
        media_type="text/event-stream"
    )
