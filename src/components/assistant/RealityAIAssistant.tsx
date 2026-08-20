'use client';

import { useState, useEffect } from 'react';
import { Sparkles, X, Send, Shield, AlertTriangle, Plus, MessageSquare, Trash2, Search, Edit2, Check, Info } from 'lucide-react';
import { RealityLogo } from '@/components/brand/RealityLogo';

interface DBMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  contextUsed?: string;
  timestamp: string;
}

interface DBConversation {
  id: string;
  title: string;
  domain?: string;
  updatedAt: string;
  messages?: DBMessage[];
}

export function RealityAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<DBConversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [showHistoryList, setShowHistoryList] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');

  const thinkingStages = [
    'Checking current evidence...',
    'Comparing your personal history...',
    'Evaluating risk factors...',
    'Preparing recommendation...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep((prev) => (prev < thinkingStages.length - 1 ? prev + 1 : prev));
      }, 350);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const loadConversationDetails = async (id: string) => {
    setCurrentConvId(id);
    setShowHistoryList(false);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setMessages(data.data.messages || []);
      }
    } catch {
      // Keep current
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.success && data.data) {
        setConversations(data.data);
        if (data.data.length > 0 && !currentConvId) {
          loadConversationDetails(data.data[0].id);
        }
      }
    } catch {
      // Fallback
    }
  };

  const createNewConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Intelligence Conversation' }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setConversations([data.data, ...conversations]);
        setCurrentConvId(data.data.id);
        setMessages(data.data.messages || []);
        setShowHistoryList(false);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim() || loading || !currentConvId) return;

    setInput('');
    const randomId = Math.random().toString(36).substring(2, 9);
    const tempUserMsg: DBMessage = {
      id: `temp-${randomId}`,
      role: 'USER',
      content: promptText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/conversations/${currentConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMsg.id),
          data.data.userMessage,
          data.data.assistantMessage,
        ]);
        fetchConversations();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'ASSISTANT',
            content: 'Sorry, I encountered an error retrieving structured forecast evidence.',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'ASSISTANT',
          content: 'Network connection issue. Please verify telemetry connection.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (currentConvId === id && updated.length > 0) {
        loadConversationDetails(updated[0].id);
      }
    } catch {
      // Fallback
    }
  };

  const handleRenameConversation = async (id: string) => {
    if (!newTitleInput.trim()) return;
    try {
      await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitleInput }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newTitleInput } : c))
      );
      setEditingTitleId(null);
    } catch {
      // Fallback
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === currentConvId);
  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'ASSISTANT');

  return (
    <>
      {/* Animated Floating Reality AI Orb Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          borderRadius: '9999px',
          padding: '0.65rem 1.15rem',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--accent-primary)',
          color: '#ffffff',
        }}
      >
        <div
          className={loading ? 'ai-orb-thinking' : 'ai-orb-idle'}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={12} color="var(--accent-primary)" />
        </div>
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Reality AI</span>
      </button>

      {/* Slide-over Assistant Drawer (Desktop Right Drawer, Mobile Full Sheet) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: '420px',
              maxWidth: '100vw',
              height: '100%',
              backgroundColor: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '0.85rem 1.15rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <RealityLogo size={22} subtitle="Evidence-Aware Assistant" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => setShowHistoryList(!showHistoryList)}
                  className="btn btn-secondary btn-sm"
                  title="Conversation History"
                >
                  <MessageSquare size={14} />
                  <span>History ({conversations.length})</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.3rem' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation History Panel Overlay */}
            {showHistoryList ? (
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Conversation History</h3>
                  <button onClick={createNewConversation} className="btn btn-primary btn-sm">
                    <Plus size={14} />
                    <span>New Chat</span>
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Search past conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ paddingLeft: '2rem', height: '34px', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversationDetails(conv.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        background: conv.id === currentConvId ? 'var(--accent-glow)' : 'var(--bg-muted)',
                        border: conv.id === currentConvId ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                        {editingTitleId === conv.id ? (
                          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={newTitleInput}
                              onChange={(e) => setNewTitleInput(e.target.value)}
                              className="input"
                              style={{ height: '28px', fontSize: '0.775rem' }}
                            />
                            <button onClick={() => handleRenameConversation(conv.id)} className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.4rem' }}>
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {conv.title}
                            </div>
                            <div style={{ fontSize: '0.675rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingTitleId(conv.id);
                            setNewTitleInput(conv.title);
                          }}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.2rem' }}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteConversation(conv.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.2rem', color: 'var(--danger)' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Context Panel Banner */}
                <div
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'var(--bg-muted)',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.725rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      💬 {activeConv?.title || 'Intelligence Conversation'}
                    </span>
                    <button onClick={createNewConversation} className="btn btn-ghost btn-sm" style={{ padding: '0.1rem 0.4rem', fontSize: '0.675rem' }}>
                      + New
                    </button>
                  </div>
                  {lastAssistantMsg?.contextUsed && (
                    <div style={{ color: 'var(--accent-primary)', fontSize: '0.675rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Info size={11} />
                      <span>Context: {lastAssistantMsg.contextUsed}</span>
                    </div>
                  )}
                </div>

                {/* Chat Message Stream */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.role === 'USER' ? 'flex-end' : 'flex-start',
                        maxWidth: '88%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: m.role === 'USER' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                        color: m.role === 'USER' ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '0.825rem',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-line',
                        border: m.role === 'ASSISTANT' ? '1px solid var(--border-color)' : 'none',
                      }}
                    >
                      {m.content}
                    </div>
                  ))}

                  {/* Animated Thinking State Stream */}
                  {loading && (
                    <div
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.775rem',
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <div className="ai-orb-thinking" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                      <span>{thinkingStages[thinkingStep]}</span>
                    </div>
                  )}
                </div>

                {/* Quick Prompt Suggestions */}
                <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)' }}>
                  {[
                    'Why is my score low?',
                    'Which risks to handle first?',
                    'What if I leave earlier?',
                    'What evidence is used?',
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      disabled={loading}
                      className="badge badge-neutral"
                      style={{ cursor: 'pointer', fontSize: '0.7rem', border: '1px solid var(--border-color)' }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Prompt Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Reality AI about your plan..."
                    className="input"
                    style={{ flex: 1, fontSize: '0.825rem' }}
                    disabled={loading}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
                    <Send size={15} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
