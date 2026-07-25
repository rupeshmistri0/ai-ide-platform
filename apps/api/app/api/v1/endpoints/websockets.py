from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import ws_manager
from app.core.logging import logger

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await ws_manager.connect(client_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            logger.info(f"Received WebSocket message from {client_id}: {data}")
            # Echo back or broadcast message
            await ws_manager.send_personal_message(
                {"event": "ack", "client_id": client_id, "data": data}, client_id
            )
    except WebSocketDisconnect:
        ws_manager.disconnect(client_id)
        await ws_manager.broadcast({"event": "client_disconnected", "client_id": client_id})
