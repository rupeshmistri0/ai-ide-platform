'use client';

import React from 'react';
import { Button } from '@ai-ide/ui';
import { AgentEngine } from '@ai-ide/core';

export default function Page() {
  const runAgent = async () => {
    const engine = new AgentEngine('/api');
    const result = await engine.executeTask({
      id: 'task-1',
      instruction: 'Verify layout styling',
      status: 'pending'
    });
    alert(`Agent Task Status: ${result.status}`);
  };

  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <h1>AI IDE Platform Web Console</h1>
      <p>Manage agent sandboxes, remote runtimes, and local configurations.</p>
      <Button variant="primary" onClick={runAgent}>Trigger Agent Engine</Button>
    </main>
  );
}
