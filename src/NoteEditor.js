import React from "react";
import ClickToEdit from "./ClickToEdit";

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onNoteNameChanged = this.onNoteNameChanged.bind(this);
    this.onNoteTextChanged = this.onNoteTextChanged.bind(this);

    this.state = {
      currentNote: this.props.currentNote
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentNote !== prevProps.currentNote) {
      this.setState({ currentNote: this.props.currentNote });
    }
  }

  handleTextChange(e) {
    let text = e.target.value;
    this.props.onTextChange(text);
  }

  onNoteTextChanged(text) {
    this.props.onNoteTextChanged(text);
  }

  onNoteNameChanged(text) {
    this.props.onNoteNameChanged(text);
  }

  render() {
    return (
      <div>
        <ClickToEdit
          text={this.state.currentNote.name}
          rows={1}
          className="note-name"
          markdown={false}
          onTextChange={this.onNoteNameChanged}
        />
        <ClickToEdit
          text={this.state.currentNote.text}
          rows={6}
          className="note-body"
          onTextChange={this.onNoteTextChanged}
        />
      </div>
    );
  }
}

export default NoteEditor;
