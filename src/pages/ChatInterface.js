import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage, clearChat } from '../store/chatSlice';

const SUGGESTIONS = [
  "I met Dr. Ravi Kumar today at Apollo Hospital. We discussed insulin therapy. He requested clinical trial data. Schedule follow-up next Tuesday.",
  "Search for cardiologist at Fortis Hospital",
  "Generate visit summary for interaction ID 1",
  "Update interaction 1 - add notes about patient feedback on Metformin",
];

export default function ChatInterface() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(s => s.chat);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = () => {
    if (!input.trim() || loading) return;
    dispatch(sendChatMessage(input.trim()));
    setInput('');
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 108px)', maxWidth: 820, margin: '0 auto' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>AI Chat Interface</h2>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
          Describe your HCP visit in natural language — LangGraph + Groq will extract, log and confirm automatically
        </p>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: '#fff', borderRadius: 14,
        padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: 12
      }}>
        {/* Empty state */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 30 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
            <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
              LangGraph AI Agent Ready
            </p>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 24 }}>
              Powered by Groq gemma2-9b-it. Try a suggestion below:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => setInput(s)} style={{
                  background: '#f5f3ff', border: '1px solid #ede9fe',
                  borderRadius: 20, padding: '9px 18px',
                  fontSize: 13, color: '#5b21b6', cursor: 'pointer',
                  maxWidth: 560, textAlign: 'left', lineHeight: 1.5,
                  transition: 'background 0.15s'
                }}>💬 {s}</button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: 16,
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 10,
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : 'linear-gradient(135deg,#10b981,#34d399)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              color: '#fff', fontSize: msg.role === 'user' ? 13 : 17, fontWeight: 700
            }}>
              {msg.role === 'user' ? 'U' : '🤖'}
            </div>

            <div style={{ maxWidth: '76%' }}>
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg,#6366f1,#818cf8)' : '#f9fafb',
                color: msg.role === 'user' ? '#fff' : '#1a1a2e',
                padding: '11px 15px',
                borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                fontSize: 14, lineHeight: 1.6,
                border: msg.role === 'ai' ? '1px solid #e5e7eb' : 'none',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>

              {msg.action_taken && (
                <div style={{
                  marginTop: 5, fontSize: 11, color: '#10b981',
                  display: 'flex', alignItems: 'center', gap: 4
                }}>
                  ✅ Tool: <strong>{msg.action_taken}</strong>
                  {msg.extracted_data?.interaction_id && (
                    <span style={{ color: '#6366f1' }}> • Interaction #{msg.extracted_data.interaction_id} saved</span>
                  )}
                </div>
              )}

              <div style={{ fontSize: 10, color: '#d1d5db', marginTop: 3 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 17 }}>🤖</div>
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px 16px', borderRadius: '14px 14px 14px 2px', fontSize: 13, color: '#9ca3af' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          placeholder="Describe your HCP visit... (Press Enter to send, Shift+Enter for new line)"
          rows={2}
          style={{
            flex: 1, padding: '11px 15px',
            borderRadius: 10,
            border: '1.5px solid #e5e7eb',
            fontSize: 14, resize: 'none',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            transition: 'border-color 0.15s'
          }}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              background: 'linear-gradient(135deg,#6366f1,#818cf8)',
              color: '#fff', border: 'none',
              borderRadius: 8, padding: '11px 22px',
              fontWeight: 700, fontSize: 14,
              opacity: (loading || !input.trim()) ? 0.5 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)'
            }}
          >Send ➤</button>
          <button
            onClick={() => dispatch(clearChat())}
            style={{
              background: '#f3f4f6', color: '#9ca3af',
              border: 'none', borderRadius: 8,
              padding: '7px 10px', fontSize: 12
            }}
          >Clear</button>
        </div>
      </div>
    </div>
  );
}
