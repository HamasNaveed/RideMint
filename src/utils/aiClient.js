const AI_BASE_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:8000';

export const aiClient = {
  async chat(message, sessionId, supabaseToken) {
    const response = await fetch(`${AI_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseToken}`,
      },
      body: JSON.stringify({ message, session_id: sessionId, stream: false }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `API error: ${response.status}`);
    }

    return response.json();
  }
};
