import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toPlaintext from "quill-delta-to-plaintext";
import * as Delta from "quill-delta";

const CustomToolbar = () => (
  <div id="toolbar">
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-blockquote" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-list" value="check" />
    <button className="ql-deleteNote">
      <i
        style={{ paddingLeft: 5 }}
        className="fas fa-trash has-text-danger"
        id="deleteIcon"
      />
    </button>
  </div>
);

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onEditorKeyDown = this.onEditorKeyDown.bind(this);

    this.quillRef = React.createRef();

    this.modules = props.disableToolbar
      ? { toolbar: null }
      : {
          toolbar: {
            container: "#toolbar",
            handlers: {
              deleteNote: () => this.props.onDeleteNoteClicked()
            }
          }
        };

    this.formats = props.plainText
      ? []
      : [
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video"
        ];
  }

  textToDelta(text) {
    return new Delta().insert(text);
  }

  handleTextChange(content, delta, source, editor) {
    const fullDelta = editor.getContents();
    if (this.props.plainText) {
      this.props.onTextChange(toPlaintext(fullDelta));
    } else {
      this.props.onTextChange(fullDelta);
    }
  }

  onEditorKeyDown(e) {
    // detect escape key
    if (e.keyCode === 27) {
      this.quillRef.current.getEditor().blur();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.text !== prevProps.text) {
      const delta = this.props.plainText
        ? this.textToDelta(this.props.text)
        : this.props.text;

      const contents = this.quillRef.current.getEditor().getContents();
      const updateDelta = contents.diff(delta);
      this.quillRef.current.getEditor().updateContents(updateDelta);
    }
  }

  render() {
    return (
      <div>
        {this.props.disableToolbar ? null : <CustomToolbar />}
        <ReactQuill
          defaultValue={this.props.text}
          ref={this.quillRef}
          bounds={"#panel"}
          placeholder="Your note..."
          modules={this.modules}
          formats={this.formats}
          id={this.props.id}
          theme={this.props.plainText ? null : "snow"}
          onChange={this.handleTextChange}
          onKeyDown={this.onEditorKeyDown}
        />
      </div>
    );
  }
}

ClickToEdit.defaultProps = {
  plainText: false,
  disableToolbar: false
};

export default ClickToEdit;
