import { create } from 'zustand'
import type { Scene, ChatMessage, ViewMode, AITab } from './types'

interface AppState {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  scenes: Scene[]
  activeSceneId: string
  setActiveScene: (id: string) => void

  aiPanelOpen: boolean
  toggleAIPanel: () => void

  aiTab: AITab
  setAITab: (tab: AITab) => void

  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void

  updateLineText: (sceneId: string, lineId: string, text: string) => void
  applyCorrection: (sceneId: string, lineId: string) => void
}

const mockScenes: Scene[] = [
  {
    id: 's1',
    title: 'Opening - Skyline',
    act: 1,
    status: 'done',
    shotType: 'Wide',
    timelineStart: '0:00',
    storyboardFrames: [
      { id: 'f1', label: 'Wide - City skyline', description: 'City at dusk, neon lights', shotType: 'Wide' }
    ],
    lines: [
      { id: 'l1', type: 'scene-heading', text: 'EXT. CITY SKYLINE - DUSK' },
      { id: 'l2', type: 'empty', text: '' },
      { id: 'l3', type: 'action', text: 'The city sprawls beneath a bruised sky. Neon signs flicker to life one by one, painting the wet streets in electric blues and pinks.' },
    ]
  },
  {
    id: 's2',
    title: 'Market - Crowd',
    act: 1,
    status: 'done',
    shotType: 'Medium',
    timelineStart: '0:45',
    storyboardFrames: [
      { id: 'f2', label: 'Medium - Night market', description: 'Mei walks through the crowd', shotType: 'Medium' }
    ],
    lines: [
      { id: 'l4', type: 'scene-heading', text: 'EXT. NIGHT MARKET - CONTINUOUS' },
      { id: 'l5', type: 'empty', text: '' },
      { id: 'l6', type: 'action', text: 'MEI (28) weaves through the crowded market stalls. Steam rises from food carts. Vendors call out in overlapping voices.' },
    ]
  },
  {
    id: 's3',
    title: 'Studio - Canvas',
    act: 1,
    status: 'in-progress',
    shotType: 'Close-up',
    timelineStart: '1:30',
    storyboardFrames: [],
    lines: [
      { id: 'l7', type: 'scene-heading', text: 'INT. ART STUDIO - NIGHT' },
      { id: 'l8', type: 'empty', text: '' },
      { id: 'l9', type: 'action', text: 'A cluttered studio filled with half-finished canvases. Moonlight spills through a skylight, casting long shadows across the paint-stained floor.' },
      { id: 'l10', type: 'empty', text: '' },
      { id: 'l11', type: 'action', text: 'MEI (28) stands before a large canvas, brush in hand, staring at a incompete portrait.', correction: { original: 'incompete', suggested: 'incomplete' } },
      { id: 'l12', type: 'empty', text: '' },
      { id: 'l13', type: 'character', text: 'MEI' },
      { id: 'l14', type: 'parenthetical', text: '(whispering)' },
      { id: 'l15', type: 'dialogue', text: 'I can see the ending, but I can\'t paint it.' },
      { id: 'l16', type: 'empty', text: '' },
      { id: 'l17', type: 'action', text: 'She sets down the brush and walks to the window. The city skyline glitters below.' },
      { id: 'l18', type: 'empty', text: '' },
      { id: 'l19', type: 'character', text: 'MEI' },
      { id: 'l20', type: 'dialogue', text: 'Maybe tomorrow.' },
    ]
  },
  {
    id: 's4',
    title: 'Conflict - Gallery',
    act: 2,
    status: 'pending',
    timelineStart: '2:15',
    storyboardFrames: [],
    lines: [
      { id: 'l21', type: 'scene-heading', text: 'INT. ART GALLERY - DAY' },
      { id: 'l22', type: 'empty', text: '' },
      { id: 'l23', type: 'action', text: 'A pristine white gallery. MEI\'s paintings hang on the walls, but the centerpiece spot is empty.' },
    ]
  },
  {
    id: 's5',
    title: 'Chase - Rooftop',
    act: 2,
    status: 'pending',
    timelineStart: '3:00',
    storyboardFrames: [],
    lines: [
      { id: 'l24', type: 'scene-heading', text: 'EXT. ROOFTOP - NIGHT' },
      { id: 'l25', type: 'empty', text: '' },
      { id: 'l26', type: 'action', text: 'Mei runs across rooftops, leaping between buildings. Rain hammers down.' },
    ]
  },
  {
    id: 's6',
    title: 'Resolution - Studio',
    act: 3,
    status: 'pending',
    timelineStart: '4:00',
    storyboardFrames: [],
    lines: [
      { id: 'l27', type: 'scene-heading', text: 'INT. ART STUDIO - DAWN' },
      { id: 'l28', type: 'empty', text: '' },
      { id: 'l29', type: 'action', text: 'First light seeps through the skylight. Mei stands back. The portrait is complete.' },
    ]
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'Help me improve the atmosphere description in line 3',
  },
  {
    id: 'm2',
    role: 'ai',
    content: 'The description is solid. To add more sensory depth, consider sounds and smells. Here\'s a rewrite:',
    diff: {
      before: 'A cluttered studio filled with half-finished canvases. Moonlight spills through a skylight, casting long shadows across the paint-stained floor.',
      after: 'A cluttered studio thick with the scent of turpentine and linseed oil. Moonlight pours through the skylight onto paint-crusted floorboards, catching dust motes in its pale beam.',
    },
  },
  {
    id: 'm3',
    role: 'user',
    content: 'Generate storyboard frames for this scene',
  },
  {
    id: 'm4',
    role: 'ai',
    content: 'Generated 3 frames for "INT. ART STUDIO - NIGHT":',
    storyboardFrames: [
      { id: 'sf1', label: 'Wide', description: 'Studio interior overview', shotType: 'Wide' },
      { id: 'sf2', label: 'Medium', description: 'Mei at the canvas', shotType: 'Medium' },
      { id: 'sf3', label: 'Close-up', description: 'Mei\'s expression', shotType: 'Close-up' },
    ],
  },
  {
    id: 'm5',
    role: 'ai',
    content: 'Here are some BGM suggestions for this melancholic studio scene:',
    bgmSuggestions: [
      { id: 'b1', name: 'Gymnopédie No.1', artist: 'Erik Satie', tag: 'Melancholic' },
      { id: 'b2', name: "Comptine d'un autre été", artist: 'Yann Tiersen', tag: 'Intimate' },
    ],
  },
]

export const useStore = create<AppState>((set) => ({
  viewMode: 'editor',
  setViewMode: (mode) => set({ viewMode: mode }),

  scenes: mockScenes,
  activeSceneId: 's3',
  setActiveScene: (id) => set({ activeSceneId: id }),

  aiPanelOpen: true,
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),

  aiTab: 'chat',
  setAITab: (tab) => set({ aiTab: tab }),

  chatMessages: mockMessages,
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  updateLineText: (sceneId, lineId, text) =>
    set((s) => ({
      scenes: s.scenes.map((sc) =>
        sc.id === sceneId
          ? { ...sc, lines: sc.lines.map((l) => (l.id === lineId ? { ...l, text } : l)) }
          : sc
      ),
    })),

  applyCorrection: (sceneId, lineId) =>
    set((s) => ({
      scenes: s.scenes.map((sc) =>
        sc.id === sceneId
          ? {
              ...sc,
              lines: sc.lines.map((l) =>
                l.id === lineId && l.correction
                  ? { ...l, text: l.text.replace(l.correction.original, l.correction.suggested), correction: undefined }
                  : l
              ),
            }
          : sc
      ),
    })),
}))
