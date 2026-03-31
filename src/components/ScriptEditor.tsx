import { useRef, useEffect, useCallback, useMemo } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { useStore } from '../store'
import { X } from 'lucide-react'
import {
  registerScreenplayLanguage,
  defineScreenplayTheme,
  getEditorOptions,
  SCREENPLAY_LANG_ID,
} from '../monacoConfig'

function scenesToText(lines: { type: string; text: string }[]): string {
  return lines.map((l) => l.text).join('\n')
}

export default function ScriptEditor() {
  const { scenes, activeSceneId, setActiveScene, applyCorrection } = useStore()
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])

  const activeScene = scenes.find((s) => s.id === activeSceneId)

  const openTabs = useMemo(() => {
    const active = scenes.find((s) => s.id === activeSceneId)
    const prev = scenes.find((s) => s.status === 'done')
    return [active, prev]
      .filter(Boolean)
      .filter((s, i, arr) => arr.findIndex((x) => x!.id === s!.id) === i) as typeof scenes
  }, [scenes, activeSceneId])

  const editorContent = useMemo(() => {
    if (!activeScene) return ''
    return scenesToText(activeScene.lines)
  }, [activeScene])

  const updateDecorations = useCallback(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco || !activeScene) return

    const model = editor.getModel()
    if (!model) return

    const newDecorations: Monaco.editor.IModelDeltaDecoration[] = []

    activeScene.lines.forEach((line, idx) => {
      if (line.correction) {
        const lineNumber = idx + 1
        const lineContent = model.getLineContent(lineNumber)
        const startCol = lineContent.indexOf(line.correction.original)
        if (startCol === -1) return

        newDecorations.push({
          range: new monaco.Range(
            lineNumber,
            startCol + 1,
            lineNumber,
            startCol + 1 + line.correction.original.length
          ),
          options: {
            inlineClassName: 'squiggly-error',
            hoverMessage: {
              value: `**Spelling:** \`${line.correction.original}\` → \`${line.correction.suggested}\`\n\n_Press Ctrl+. to fix_`,
            },
          },
        })
      }
    })

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations)
  }, [activeScene])

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco

    registerScreenplayLanguage(monaco)
    defineScreenplayTheme(monaco)

    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, SCREENPLAY_LANG_ID)
    }
    editor.updateOptions(getEditorOptions())

    const styleEl = document.createElement('style')
    styleEl.textContent = `
      .squiggly-error {
        text-decoration: wavy underline !important;
        text-decoration-color: #f09595 !important;
        text-underline-offset: 3px;
        cursor: pointer !important;
      }
    `
    document.head.appendChild(styleEl)

    editor.addAction({
      id: 'fix-correction',
      label: 'Fix Spelling',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period],
      run: () => {
        const store = useStore.getState()
        const scene = store.scenes.find(s => s.id === store.activeSceneId)
        if (!scene) return
        const position = editor.getPosition()
        if (!position) return
        const lineIdx = position.lineNumber - 1
        const line = scene.lines[lineIdx]
        if (line?.correction) {
          store.applyCorrection(scene.id, line.id)
        }
      },
    })

    setTimeout(updateDecorations, 100)
  }

  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco || !activeScene) return

    const model = editor.getModel()
    if (model) {
      const currentValue = model.getValue()
      const newValue = scenesToText(activeScene.lines)
      if (currentValue !== newValue) {
        model.setValue(newValue)
      }
      monaco.editor.setModelLanguage(model, SCREENPLAY_LANG_ID)
    }

    setTimeout(updateDecorations, 50)
  }, [activeScene, updateDecorations])

  if (!activeScene) return <div className="editor-area" />

  return (
    <div className="editor-area">
      <div className="editor-tabs">
        {openTabs.map((scene) => (
          <div
            key={scene.id}
            className={`editor-tab ${scene.id === activeSceneId ? 'active' : ''}`}
            onClick={() => setActiveScene(scene.id)}
          >
            {scene.title}
            <span className="close">
              <X size={12} />
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          defaultValue={editorContent}
          defaultLanguage={SCREENPLAY_LANG_ID}
          theme="vibe-dark"
          onMount={handleEditorMount}
          options={getEditorOptions()}
          loading={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: '#1a1b20',
              color: '#55575e',
              fontSize: 13,
              fontFamily: 'var(--font-ui)',
            }}>
              Loading editor...
            </div>
          }
        />
      </div>

      <div className="statusbar">
        <span>
          Act {activeScene.act}, {activeScene.title} &middot; {activeScene.lines.length} lines
          {activeScene.lines.some(l => l.correction) && (
            <span style={{ color: 'var(--text-warn)', marginLeft: 12 }}>
              ● 1 issue — Ctrl+. to fix
            </span>
          )}
        </span>
        <span className="statusbar-right">
          <span>Screenplay</span>
          <span>
            <span className="status-dot" />
            Auto-saved
          </span>
        </span>
      </div>
    </div>
  )
}
