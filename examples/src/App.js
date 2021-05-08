import React, { useState, createRef } from "react";
import { RichUtils, getDefaultKeyBinding, convertToRaw } from "draft-js";
import EdisonEditor, { EdisonUtil } from "edison-editor";
import { FormattingMenu, EditorActionMap } from "./Controls";
import "./App.css";

function App() {
  const _draftEditorRef = createRef();
  const [editorState, setEditorState] = useState(EdisonUtil.stateFromHTML(``));
  const [placeholder] = useState("请编辑此处");

  const onTab = (shiftKey) => {
    if (shiftKey) {
      setEditorState(EdisonUtil.indentDecrease(editorState));
    } else {
      setEditorState(EdisonUtil.indentIncrease(editorState));
    }
    return true;
  };

  const onBackSpace = () => {
    if (EdisonUtil.isInIndentBlockBeginning(editorState)) {
      setEditorState(EdisonUtil.indentDecrease(editorState));
      return true;
    }
    return onNormalCommand("backspace");
  };

  const onNormalCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return true;
    }
    return false;
  };

  const handleKeyCommand = (command, editorState) => {
    if (!command) {
      return false;
    }
    if (command === "tab") {
      return onTab();
    }
    if (command === "tab-shift") {
      return onTab(true);
    }
    if (command === "backspace") {
      return onBackSpace();
    }

    return onNormalCommand(command);
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9) {
      e.stopPropagation();
      e.preventDefault();
      return e.shiftKey ? "tab-shift" : "tab";
    }
    return getDefaultKeyBinding(e);
  };

  const onDraftBaseAction = (option) => {
    if (!_draftEditorRef.current) {
      return;
    }
    const action = EditorActionMap[option];
    if (!action || !action.key) {
      return;
    }
    if (action.key === "CLEAR") {
      setEditorState(EdisonUtil.clearAllInlineStyle(editorState));
      return;
    }
    if (action.key === "indent-increase") {
      setEditorState(EdisonUtil.indentIncrease(editorState));
      return;
    }
    if (action.key === "indent-decrease") {
      setEditorState(EdisonUtil.indentDecrease(editorState));
      return;
    }
    if (action.isBlockType) {
      setEditorState(RichUtils.toggleBlockType(editorState, action.key));
    } else {
      setEditorState(RichUtils.toggleInlineStyle(editorState, action.key));
    }
  };

  const handlePastedText = (text, html) => {
    if (!html) {
      const urlReg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
      if (urlReg.test(text)) {
        const newState = EdisonUtil.onAddLink(
          { url: text, text: text },
          editorState
        );
        setEditorState(newState);
        return "handled";
      } else {
        return "not-handled";
      }
    }
    const imgReg = /<img[^>]+src\s*=['"\s]?(?<url>[^>]+?)['"]?\s+[^>]*>/gi;
    const paths = [];
    let res = imgReg.exec(html);
    while (res) {
      const localFilePath = res.groups.url;
      if (localFilePath && localFilePath.startsWith("http")) {
        paths.push(localFilePath);
      }
      res = imgReg.exec(html);
    }
    if (paths.length) {
      console.log("pasted local files:", paths);
    }
    return "not-handled";
  };

  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log(EdisonUtil.stateToHTML(editorState));
  console.log(convertToRaw(editorState.getCurrentContent()));
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

  return (
    <>
      <div className="App">
        <h3>EdisonEditor Test</h3>
        <div className="edisonEditorContainer">
          <FormattingMenu
            onPress={(style) => onDraftBaseAction(style)}
            activeFormats={editorState.getCurrentInlineStyle().toArray()}
          />
          <EdisonEditor
            ref={_draftEditorRef}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            handlePastedText={handlePastedText}
            keyBindingFn={mapKeyToEditorCommand}
            placeholder={placeholder}
          />
        </div>
      </div>
    </>
  );
}

export default App;
