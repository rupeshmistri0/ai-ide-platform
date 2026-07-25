import { NextResponse } from 'next/server';
import { mockConversations, mockAIModels } from '@/lib/api-client';

export async function GET() {
  return NextResponse.json({
    conversations: mockConversations,
    models: mockAIModels,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    id: `msg_${Date.now()}`,
    role: 'assistant',
    content: `Processed query with model ${body.modelId || 'gemini-1.5-pro'}.`,
    timestamp: new Date().toISOString(),
  });
}
