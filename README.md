# Vibe Writer

A VS Code-style screenplay editor with AI-powered writing assistance, storyboard generation, and visual reference lookup.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Project structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root layout (editor vs overview routing)
├── App.css                     # Global styles (dark theme, all components)
├── types.ts                    # TypeScript interfaces
├── store.ts                    # Zustand state management + mock data
├── monacoConfig.ts             # Monaco Editor screenplay language + theme
└── components/
    ├── TopBar.tsx               # Top navigation bar + view toggle
    ├── SceneSidebar.tsx         # Left panel: scene tree by Act
    ├── ScriptEditor.tsx         # Center: Monaco Editor with screenplay syntax
    ├── AIChatPanel.tsx          # Right panel: AI chat + storyboard/refs/BGM tabs
    └── OverviewPage.tsx         # Storyboard grid + timeline + guideline
```

## Features implemented

- **Monaco Editor** with custom screenplay syntax highlighting (scene headings, character names, dialogue, parentheticals, transitions)
- **Inline spelling corrections** with wavy underlines, hover tooltips, and Ctrl+. quick fix
- **AI chat panel** with mock responses for grammar check, storyboard generation, film references, and BGM suggestions
- **Diff view** for AI-suggested edits with Accept/Reject/Edit/Retry actions
- **Storyboard frames** display with shot type badges
- **BGM suggestions** with play button and tag labels
- **Overview page** with storyboard card grid, timeline player bar, and shot guideline summary
- **Scene navigation** via sidebar with act grouping and completion status
- **View switching** between Editor and Overview modes

## Tech stack

- React 18 + TypeScript
- Vite
- Zustand (state management)
- Monaco Editor (@monaco-editor/react)
- Lucide React (icons)

## Next steps

- [ ] Connect to AI backend (OpenAI / Claude API) for real screenplay assistance
- [ ] Add real image generation for storyboard frames (Stable Diffusion / DALL-E)
- [ ] File upload/download (PDF, FDX, Fountain format support)
- [ ] User authentication and project management
- [ ] Timeline playback with generated storyboard images
- [ ] BGM preview with audio player integration
- [ ] Collaborative editing (WebSocket + OT/CRDT)
