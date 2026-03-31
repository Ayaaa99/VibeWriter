import { useState } from 'react'
import { useStore } from '../store'
import { Play, SkipBack, SkipForward, Film, Plus, Download, FileText } from 'lucide-react'

export default function OverviewPage() {
  const { scenes, activeSceneId, setActiveScene, setViewMode } = useStore()
  const [isPlaying, setIsPlaying] = useState(false)

  const acts = [1, 2, 3]

  const statusClass = (s: string) => {
    if (s === 'done') return 'done'
    if (s === 'in-progress') return 'in-progress'
    return 'pending'
  }

  const statusLabel = (s: string) => {
    if (s === 'done') return 'Done'
    if (s === 'in-progress') return 'In progress'
    return 'Pending'
  }

  const handleCardClick = (id: string) => {
    setActiveScene(id)
    setViewMode('editor')
  }

  return (
    <div className="overview-page">
      <div className="ov-header">
        <div className="ov-title">Moonlight studio</div>
        <div className="ov-actions">
          <button className="ov-btn"><FileText size={12} style={{ marginRight: 4 }} />Export PDF</button>
          <button className="ov-btn"><Download size={12} style={{ marginRight: 4 }} />Guideline</button>
          <button className="ov-btn primary" onClick={() => setIsPlaying(!isPlaying)}>
            <Play size={12} style={{ marginRight: 4 }} fill="currentColor" />
            Play all
          </button>
        </div>
      </div>

      {acts.map((act) => {
        const actScenes = scenes.filter((s) => s.act === act)
        if (actScenes.length === 0) return null
        return (
          <div key={act}>
            <div className="act-label">Act {act}</div>
            <div className="board-grid">
              {actScenes.map((scene) => (
                <div
                  key={scene.id}
                  className={`board-card ${scene.id === activeSceneId ? 'active' : ''}`}
                  onClick={() => handleCardClick(scene.id)}
                >
                  <div className="board-thumb">
                    {scene.status === 'pending' ? (
                      <Plus size={20} />
                    ) : (
                      <Film size={20} />
                    )}
                    {scene.shotType && (
                      <span className="shot-badge">{scene.shotType}</span>
                    )}
                  </div>
                  <div className="board-card-info">
                    <div className="board-card-title">{scene.title}</div>
                    <div className="board-card-desc">
                      {scene.lines.find(l => l.type === 'action')?.text.slice(0, 40)}...
                    </div>
                    <div className="board-card-meta">
                      <span className={`status-badge ${statusClass(scene.status)}`}>
                        {statusLabel(scene.status)}
                      </span>
                      <span className="board-time">{scene.timelineStart || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Timeline */}
      <div className="timeline-section">
        <div className="tl-header">
          <div className="tl-title">Timeline</div>
          <div className="tl-controls">
            <button className="tl-ctrl-btn"><SkipBack size={12} /></button>
            <button
              className={`tl-ctrl-btn ${isPlaying ? 'play' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play size={12} fill="currentColor" />
            </button>
            <button className="tl-ctrl-btn"><SkipForward size={12} /></button>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 4 }}>
              1:30 / 5:00
            </span>
          </div>
        </div>

        <div className="timeline-bar">
          {scenes.map((scene) => (
            <div
              key={scene.id}
              className={`tl-seg ${statusClass(scene.status)}`}
              style={{ flex: scene.act === 2 ? 2.5 : 2 }}
              onClick={() => handleCardClick(scene.id)}
            >
              {scene.title.split(' - ')[1] || scene.title}
            </div>
          ))}
        </div>
        <div className="tl-timestamps">
          <span>0:00</span>
          <span>1:00</span>
          <span>2:00</span>
          <span>3:00</span>
          <span>4:00</span>
          <span>5:00</span>
        </div>
      </div>

      {/* Guideline */}
      <div className="guideline-card">
        <div className="guideline-title">Shot guideline summary</div>
        <div className="gl-row">
          <span className="gl-label">Tone</span>
          <span className="gl-value">Melancholic, intimate</span>
        </div>
        <div className="gl-row">
          <span className="gl-label">Color palette</span>
          <span className="gl-value">Cool blues, warm amber highlights</span>
        </div>
        <div className="gl-row">
          <span className="gl-label">Camera</span>
          <span className="gl-value">Handheld close-ups, static wide establishing</span>
        </div>
        <div className="gl-row">
          <span className="gl-label">Lighting</span>
          <span className="gl-value">Natural moonlight, practical neon sources</span>
        </div>
        <div className="gl-row">
          <span className="gl-label">References</span>
          <span className="gl-value">In the Mood for Love, Chungking Express, Shirley</span>
        </div>
      </div>
    </div>
  )
}
