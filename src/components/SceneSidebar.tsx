import { useStore } from '../store'
import { Music, Image, Download } from 'lucide-react'

export default function SceneSidebar() {
  const { scenes, activeSceneId, setActiveScene } = useStore()

  const acts = [1, 2, 3]

  return (
    <div className="sidebar">
      {acts.map((act) => {
        const actScenes = scenes.filter((s) => s.act === act)
        if (actScenes.length === 0) return null
        return (
          <div key={act}>
            <div className="side-section-label">Act {act}</div>
            {actScenes.map((scene) => (
              <div
                key={scene.id}
                className={`scene-item ${scene.id === activeSceneId ? 'active' : ''} ${scene.status === 'done' ? 'done' : ''}`}
                onClick={() => setActiveScene(scene.id)}
              >
                <span className="scene-dot" />
                {scene.title}
              </div>
            ))}
          </div>
        )
      })}

      <div className="side-divider" />

      <div className="side-section-label">Tools</div>
      <div className="tool-item">
        <Music size={12} />
        Find BGM
      </div>
      <div className="tool-item">
        <Image size={12} />
        Visual refs
      </div>
      <div className="tool-item">
        <Download size={12} />
        Export
      </div>
    </div>
  )
}
