import { NextResponse } from 'next/server';
import { mockWorkspaces, mockProjects, mockTasks } from '@/lib/api-client';

export async function GET() {
  return NextResponse.json({
    workspaces: mockWorkspaces,
    projects: mockProjects,
    tasks: mockTasks,
  });
}
