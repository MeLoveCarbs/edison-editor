import React, { useState, createRef } from "react";
import { EditorState, RichUtils, getDefaultKeyBinding } from "draft-js";
import EdisonEditor from "edison-editor";
import './App.css';

function App() {
  const _draftEditorRef = createRef();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [placeholder] = useState("请编辑此处");

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const mapKeyToEditorCommand = (e) => {
    switch (e.keyCode) {
      case 9: // TAB
        const newEditorState = RichUtils.onTab(
          e,
          editorState,
          4 /* maxDepth */
        );
        if (newEditorState !== editorState) {
          setEditorState(newEditorState);
        }
        return;
      default:
        return getDefaultKeyBinding(e);
    }
  };

  return (
    <>
    <div className="App">
      <h3>EdisonEditor Test</h3>
      <EdisonEditor
        ref={_draftEditorRef}
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={mapKeyToEditorCommand}
        placeholder={placeholder}
      />
    </div>
    </>
  );
}

export default App;
