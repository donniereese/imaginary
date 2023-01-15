import { createContext, useContext, useState } from 'react'

export const EditorContext = createContext()

export const useEditor = () => useContext(editorContext)

const EDITOR_TYPES = [
  'response',
  'payload',
]

export const EditorProvider = ({ children }) => {
  const [editordata, setEditorData] = useState({})

  const editortype = (t) => {
    if (!t) return editorData.type;
    if (!EDITOR_TYPES.includes(t)) return false;

    setEditorData({ ...editorData, type: t })
    return true;
  }

  const editorTarget = (t) => {
    if (!t) return editorData.target;
    setEditorData({ ...editorData, target: t })
    return true;
  }

  const ctx = { endpoints, editorType, editorTarget }

  return (
    <EditorContext.Provider>
      {children}
    </EditorContext.Provider>
  )
}
