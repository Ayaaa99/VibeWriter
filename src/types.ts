export interface Scene {
  id: string
  title: string
  act: number
  status: 'done' | 'in-progress' | 'pending'
  lines: ScriptLine[]
  storyboardFrames: StoryboardFrame[]
  bgm?: BGMTrack
  shotType?: string
  timelineStart?: string
}

export interface ScriptLine {
  id: string
  type: 'scene-heading' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'empty'
  text: string
  correction?: { original: string; suggested: string }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  diff?: { before: string; after: string }
  storyboardFrames?: StoryboardFrame[]
  references?: VisualRef[]
  bgmSuggestions?: BGMTrack[]
}

export interface StoryboardFrame {
  id: string
  label: string
  description: string
  shotType: string
}

export interface VisualRef {
  id: string
  title: string
  source: string
}

export interface BGMTrack {
  id: string
  name: string
  artist: string
  tag: string
}

export type ViewMode = 'editor' | 'overview'
export type AITab = 'chat' | 'storyboard' | 'references' | 'bgm'
