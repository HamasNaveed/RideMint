const AI_BASE_URL = import.meta.env.VITE_AI_BACKEND_URL || 'http://localhost:8000';

export const aiClient = {
  async chat(message, sessionId, supabaseToken) {
    try {
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

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        throw new Error(`AI Backend Service Offline (${AI_BASE_URL}). Please start the Python backend (uvicorn backend.main:app --port 8000) or check VITE_AI_BACKEND_URL.`);
      }
      throw error;
    }
  }
};

