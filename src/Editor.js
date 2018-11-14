import React from "react";

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    let text = e.target.value;
    this.props.onTextChange(text);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentFile !== prevProps.currentFile) {
      this.refs.editorWindow.value = this.props.currentFile.content
    }
  }

  render() {
    return (
      <textarea
        ref="editorWindow"
        rows="4"
        cols="50"
        onChange={this.handleTextChange}
      />
    );
  }
}

export default Editor;
