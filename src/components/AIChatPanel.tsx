import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store'
import { ChevronRight, Send, Play, Film, ImageIcon, AlertCircle, Check } from 'lucide-react'
import type { ChatMessage } from '../types'

function InlineCorrections() {
  const { scenes, activeSceneId, applyCorrection } = useStore()
  const scene = scenes.find((s) => s.id === activeSceneId)
  if (!scene) return null

  const corrections = scene.lines.filter((l) => l.correction)
  if (corrections.length === 0) return null

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{
        fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)',
        textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6,
      }}>
        Issues found
      </div>
      {corrections.map((line) => (
        <div key={line.id} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', background: 'var(--bg-editor)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
          fontSize: 12, marginBottom: 4,
        }}>
          <AlertCircle size={12} style={{ color: 'var(--text-error)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-error)', textDecoration: 'line-through' }}>
            {line.correction!.original}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>&rarr;</span>
          <span style={{ color: 'var(--text-success)', fontWeight: 500 }}>
            {line.correction!.suggested}
          </span>
          <button
            onClick={() => applyCorrection(scene.id, line.id)}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
              padding: '2px 8px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-bg)', border: '1px solid var(--border-accent)',
              color: 'var(--text-accent)', fontSize: 11, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <Check size={10} /> Fix
          </button>
        </div>
      ))}
      <div style={{
        height: 1, background: 'var(--border)', margin: '10px 0',
      }} />
    </div>
  )
}

function DiffBlock({ before, after }: { before: string; after: string }) {
  return (
    <div className="diff-block">
      <div className="diff-del">{before}</div>
      <div style={{ height: 6 }} />
      <div className="diff-add">{after}</div>
    </div>
  )
}

function StoryboardFrames({ frames }: { frames: ChatMessage['storyboardFrames'] }) {
  if (!frames?.length) return null
  return (
    <div className="sb-frames">
      {frames.map((f) => (
        <div className="sb-frame" key={f.id}>
          <div className="sb-frame-thumb">
            <Film size={16} />
            <span className="shot-badge">{f.shotType}</span>
          </div>
          <div className="sb-frame-label">{f.description}</div>
        </div>
      ))}
    </div>
  )
}

function BGMSuggestions({ tracks }: { tracks: ChatMessage['bgmSuggestions'] }) {
  if (!tracks?.length) return null
  return (
    <>
      {tracks.map((t) => (
        <div className="bgm-card" key={t.id}>
          <button className="bgm-play-btn">
            <Play size={12} fill="currentColor" />
          </button>
          <div className="bgm-info">
            <div className="bgm-name">
              {t.name}
              <span className="bgm-tag">{t.tag}</span>
            </div>
            <div className="bgm-artist">{t.artist}</div>
          </div>
          <button className="action-btn">Use</button>
        </div>
      ))}
    </>
  )
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const [accepted, setAccepted] = useState(false)

  return (
    <div className={`chat-bubble ${msg.role}`}>
      <div>{msg.content}</div>
      {msg.diff && <DiffBlock before={msg.diff.before} after={msg.diff.after} />}
      {msg.diff && !accepted && (
        <div className="action-row">
          <button className="action-btn primary" onClick={() => setAccepted(true)}>Accept</button>
          <button className="action-btn">Reject</button>
          <button className="action-btn">Edit</button>
          <button className="action-btn">Retry</button>
        </div>
      )}
      {msg.diff && accepted && (
        <div style={{
          marginTop: 8, fontSize: 11, color: 'var(--text-success)',
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <Check size={12} /> Applied to editor
        </div>
      )}
      {msg.storyboardFrames && <StoryboardFrames frames={msg.storyboardFrames} />}
      {msg.storyboardFrames && (
        <div className="action-row">
          <button className="action-btn primary">Add to timeline</button>
          <button className="action-btn">Regenerate</button>
        </div>
      )}
      {msg.bgmSuggestions && <BGMSuggestions tracks={msg.bgmSuggestions} />}
    </div>
  )
}

const MOCK_AI_RESPONSES: Record<string, Partial<ChatMessage>> = {
  grammar: {
    content: 'I found 1 spelling issue in the current scene. Use the "Fix" button above or press Ctrl+. in the editor.',
  },
  storyboard: {
    content: 'Here are 3 storyboard frames for this scene:',
    storyboardFrames: [
      { id: 'sf1', label: 'Wide', description: 'Studio interior overview', shotType: 'Wide' },
      { id: 'sf2', label: 'Medium', description: 'Mei at the canvas', shotType: 'Medium' },
      { id: 'sf3', label: 'Close-up', description: "Mei's expression", shotType: 'Close-up' },
    ],
  },
  films: {
    content: 'Based on the scene\'s mood (melancholic, intimate, artistic isolation), here are visual references:',
    references: [
      { id: 'r1', title: 'In the Mood for Love — studio scene', source: 'Wong Kar-wai' },
      { id: 'r2', title: 'Shirley — artist isolation', source: 'Gustav Deutsch' },
    ],
  },
  bgm: {
    content: 'Here are background music suggestions matching the intimate, melancholic tone:',
    bgmSuggestions: [
      { id: 'b1', name: 'Gymnopédie No.1', artist: 'Erik Satie', tag: 'Melancholic' },
      { id: 'b2', name: "Comptine d'un autre été", artist: 'Yann Tiersen', tag: 'Intimate' },
    ],
  },
  default: {
    content: "I'll analyze the current scene context. In production, this connects to the AI backend for real screenplay assistance — rewriting, expanding scenes, suggesting camera angles, and more.",
  },
}

function getAIResponse(input: string): Partial<ChatMessage> {
  const lower = input.toLowerCase()
  if (lower.includes('grammar') || lower.includes('spell') || lower.includes('check')) return MOCK_AI_RESPONSES.grammar
  if (lower.includes('storyboard') || lower.includes('frame') || lower.includes('generate')) return MOCK_AI_RESPONSES.storyboard
  if (lower.includes('film') || lower.includes('reference') || lower.includes('similar')) return MOCK_AI_RESPONSES.films
  if (lower.includes('bgm') || lower.includes('music') || lower.includes('suggest bgm')) return MOCK_AI_RESPONSES.bgm
  return MOCK_AI_RESPONSES.default
}

export default function AIChatPanel() {
  const { aiPanelOpen, toggleAIPanel, chatMessages, addChatMessage, aiTab, setAITab } = useStore()
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSend = (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    addChatMessage({ id: `m${Date.now()}`, role: 'user', content: msg })
    setInput('')

    setTimeout(() => {
      const response = getAIResponse(msg)
      addChatMessage({
        id: `m${Date.now() + 1}`,
        role: 'ai',
        content: response.content || '',
        diff: response.diff,
        storyboardFrames: response.storyboardFrames,
        references: response.references,
        bgmSuggestions: response.bgmSuggestions,
      } as ChatMessage)
    }, 600)
  }

  const tabs: { key: typeof aiTab; label: string }[] = [
    { key: 'chat', label: 'Chat' },
    { key: 'storyboard', label: 'Storyboard' },
    { key: 'references', label: 'Refs' },
    { key: 'bgm', label: 'BGM' },
  ]

  return (
    <div className={`ai-panel ${aiPanelOpen ? '' : 'collapsed'}`}>
      <div className="ai-header">
        <div className="ai-title">
          <span className="pulse" />
          AI assistant
        </div>
        <button className="icon-btn" onClick={toggleAIPanel}>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="ai-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`ai-tab ${aiTab === t.key ? 'active' : ''}`}
            onClick={() => setAITab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ai-body" ref={bodyRef}>
        {aiTab === 'chat' && (
          <>
            <InlineCorrections />
            {chatMessages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            <div className="suggestion-chips">
              <button className="chip" onClick={() => handleSend('Check grammar')}>Check grammar</button>
              <button className="chip" onClick={() => handleSend('Generate storyboard')}>Generate storyboard</button>
              <button className="chip" onClick={() => handleSend('Find similar films')}>Find similar films</button>
              <button className="chip" onClick={() => handleSend('Suggest BGM')}>Suggest BGM</button>
            </div>
          </>
        )}
        {aiTab === 'storyboard' && (
          <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
            <Film size={24} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
            <div>No storyboard frames yet.</div>
            <div style={{ marginTop: 4, marginBottom: 12 }}>Generate frames from the Chat tab.</div>
            <button className="action-btn primary" onClick={() => { setAITab('chat'); handleSend('Generate storyboard'); }}>
              Generate now
            </button>
          </div>
        )}
        {aiTab === 'references' && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Visual references for the current scene:
            </div>
            <div className="ref-grid">
              {[
                { t: 'In the Mood for Love', d: 'Studio scene' },
                { t: 'Shirley', d: 'Artist isolation' },
                { t: 'Amelie', d: 'Warm interior' },
                { t: 'Chungking Express', d: 'Night mood' },
              ].map((r, i) => (
                <div className="ref-item" key={i}>
                  <div className="ref-thumb"><ImageIcon size={16} /></div>
                  <div className="ref-text">{r.t} — {r.d}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {aiTab === 'bgm' && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Suggested background music:
            </div>
            {[
              { n: 'Gymnopédie No.1', a: 'Erik Satie', t: 'Melancholic' },
              { n: "Comptine d'un autre été", a: 'Yann Tiersen', t: 'Intimate' },
              { n: 'Clair de Lune', a: 'Debussy', t: 'Dreamy' },
              { n: 'Nuvole Bianche', a: 'Ludovico Einaudi', t: 'Emotional' },
            ].map((track, i) => (
              <div className="bgm-card" key={i}>
                <button className="bgm-play-btn"><Play size={12} fill="currentColor" /></button>
                <div className="bgm-info">
                  <div className="bgm-name">{track.n} <span className="bgm-tag">{track.t}</span></div>
                  <div className="bgm-artist">{track.a}</div>
                </div>
                <button className="action-btn">Use</button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="ai-input-wrap">
        <div className="ai-input-row">
          <input
            type="text"
            placeholder="Ask AI about this scene..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={() => handleSend()}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
