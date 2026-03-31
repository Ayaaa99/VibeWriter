import { useStore } from '../store'
import { PanelRight, Settings, Grid2x2 } from 'lucide-react'

export default function TopBar() {
  const { viewMode, setViewMode, toggleAIPanel, aiPanelOpen } = useStore()

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <span className="dot" />
          Vibe Writer
        </div>
        <div className="topbar-menu">
          <button>File</button>
          <button>Edit</button>
          <button>View</button>
          <button>Tools</button>
        </div>
      </div>
      <div className="topbar-right">
        <div className="view-toggle">
          <button
            className={viewMode === 'editor' ? 'active' : ''}
            onClick={() => setViewMode('editor')}
          >
            Editor
          </button>
          <button
            className={viewMode === 'overview' ? 'active' : ''}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </button>
        </div>
        {viewMode === 'editor' && (
          <button className="icon-btn" onClick={toggleAIPanel} title="Toggle AI panel">
            <PanelRight size={16} style={{ opacity: aiPanelOpen ? 1 : 0.5 }} />
          </button>
        )}
        <button className="icon-btn" title="Overview">
          <Grid2x2 size={16} />
        </button>
        <button className="icon-btn" title="Settings">
          <Settings size={16} />
        </button>
        <div className="avatar">C</div>
      </div>
    </div>
  )
}
