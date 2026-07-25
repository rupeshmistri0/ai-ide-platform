import { NextResponse } from 'next/server';
import { mockUser } from '@/lib/api-client';

export async function GET() {
  return NextResponse.json({ user: mockUser });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    user: { ...mockUser, email: body.email || mockUser.email },
    token: 'jwt_token_mock_12345',
  });
}
