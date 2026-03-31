import type * as Monaco from 'monaco-editor'

export const SCREENPLAY_LANG_ID = 'screenplay'

export function registerScreenplayLanguage(monaco: typeof Monaco) {
  monaco.languages.register({ id: SCREENPLAY_LANG_ID })

  monaco.languages.setMonarchTokensProvider(SCREENPLAY_LANG_ID, {
    tokenizer: {
      root: [
        // Scene headings: INT. / EXT. lines
        [/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.).*$/m, 'scene-heading'],

        // Character names: ALL CAPS lines (at least 2 uppercase chars, standalone line)
        [/^[ \t]*[A-Z][A-Z\s.'()-]{1,}$/m, 'character-name'],

        // Parentheticals: (text)
        [/^\s*\(.*\)\s*$/m, 'parenthetical'],

        // Transition: FADE IN, CUT TO, etc.
        [/^(FADE IN:|FADE OUT\.|CUT TO:|DISSOLVE TO:|SMASH CUT TO:|MATCH CUT TO:).*$/m, 'transition'],

        // Action/description (default)
        [/./, 'action'],
      ],
    },
  })

  monaco.languages.setLanguageConfiguration(SCREENPLAY_LANG_ID, {
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    brackets: [['(', ')']],
    comments: {},
  })
}

export function defineScreenplayTheme(monaco: typeof Monaco) {
  monaco.editor.defineTheme('vibe-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'scene-heading', foreground: '85B7EB', fontStyle: 'bold' },
      { token: 'character-name', foreground: 'EF9F27', fontStyle: 'bold' },
      { token: 'parenthetical', foreground: '8B8D94', fontStyle: 'italic' },
      { token: 'transition', foreground: 'AFA9EC', fontStyle: 'bold' },
      { token: 'action', foreground: 'D4D4D8' },
    ],
    colors: {
      'editor.background': '#1a1b20',
      'editor.foreground': '#d4d4d8',
      'editor.lineHighlightBackground': '#ffffff08',
      'editor.selectionBackground': '#63992240',
      'editorLineNumber.foreground': '#55575e',
      'editorLineNumber.activeForeground': '#8b8d94',
      'editorCursor.foreground': '#97c459',
      'editor.selectionHighlightBackground': '#63992220',
      'editorIndentGuide.background': '#27292f',
      'editorWidget.background': '#151619',
      'editorWidget.border': '#27292f',
      'editorSuggestWidget.background': '#151619',
      'editorSuggestWidget.border': '#27292f',
      'editorSuggestWidget.selectedBackground': '#23252b',
      'scrollbarSlider.background': '#27292f80',
      'scrollbarSlider.hoverBackground': '#3a3d44',
      'scrollbarSlider.activeBackground': '#3a3d44',
      'editorOverviewRuler.border': '#00000000',
      'minimap.background': '#1a1b20',
    },
  })
}

export function getEditorOptions(): Monaco.editor.IStandaloneEditorConstructionOptions {
  return {
    theme: 'vibe-dark',
    language: SCREENPLAY_LANG_ID,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 13,
    lineHeight: 24,
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: true,
    wordWrap: 'on',
    wrappingIndent: 'same',
    padding: { top: 20, bottom: 40 },
    lineNumbers: 'on',
    renderLineHighlight: 'line',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    bracketPairColorization: { enabled: false },
    automaticLayout: true,
    scrollbar: {
      verticalScrollbarSize: 6,
      horizontalScrollbarSize: 6,
      useShadows: false,
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    renderWhitespace: 'none',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 8,
    contextmenu: true,
    suggest: {
      showWords: false,
    },
  }
}
