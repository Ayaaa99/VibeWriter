import { useStore } from './store'
import TopBar from './components/TopBar'
import SceneSidebar from './components/SceneSidebar'
import ScriptEditor from './components/ScriptEditor'
import AIChatPanel from './components/AIChatPanel'
import OverviewPage from './components/OverviewPage'

export default function App() {
  const { viewMode } = useStore()

  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-body">
        {viewMode === 'editor' ? (
          <>
            <SceneSidebar />
            <ScriptEditor />
            <AIChatPanel />
          </>
        ) : (
          <OverviewPage />
        )}
      </div>
    </div>
  )
}
