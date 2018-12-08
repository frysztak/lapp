import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toPlaintext from "quill-delta-to-plaintext";
import * as Delta from "quill-delta";

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onEditorKeyDown = this.onEditorKeyDown.bind(this);

    this.state = {
      content: this.props.plainText ? this.textToDelta(props.text) : props.text
    };

    this.quillRef = React.createRef();

    this.modules = props.disableToolbar
      ? { toolbar: null }
      : {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" }
            ],
            ["link", "image", "video"],
            ["clean"]
          ]
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
    this.setState({ content: fullDelta });
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

      this.setState({ content: delta });
      //this.quillRef.current.getEditor().setContents(delta);

      const contents = this.quillRef.current.getEditor().getContents();

      const updateDelta = contents.diff(delta);
      console.log(updateDelta);
      this.quillRef.current.getEditor().updateContents(updateDelta);
    }
  }

  render() {
    return (
      <ReactQuill
        defaultValue={this.state.content}
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
    );
  }
}

ClickToEdit.defaultProps = {
  plainText: false,
  disableToolbar: false
};

export default ClickToEdit;
