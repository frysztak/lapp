import React from "react";
import ClickToEdit from "./ClickToEdit";
import ReactModal from "react-modal";

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onNoteNameChanged = this.onNoteNameChanged.bind(this);
    this.onNoteTextChanged = this.onNoteTextChanged.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this.state = {
      showDeletionModal: false
    };
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

  handleCloseModal() {
    this.setState({ showDeletionModal: false });
  }

  deleteNote() {
    this.props.onDeleteNote(this.state.currentNote);
    this.setState({ showDeletionModal: false });
  }

  render() {
    const currentNote = this.props.currentNote;
    return (
      <div>
        <div className="note-header">
          <ClickToEdit
            text={currentNote.name}
            id="note-name"
            plainText={true}
            disableToolbar={true}
            onTextChange={this.onNoteNameChanged}
          />
          <i
            style={{ paddingLeft: 5 }}
            onClick={_ => this.setState({ showDeletionModal: true })}
            className="fas fa-trash has-text-danger"
            id="deleteIcon"
          />
        </div>
        <ClickToEdit
          text={currentNote.text}
          id="note-body"
          plainText={false}
          onTextChange={this.onNoteTextChanged}
        />

        <ReactModal
          isOpen={this.state.showDeletionModal}
          contentLabel="Minimal Modal Example"
          style={{
            overlay: {
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            },
            content: {
              border: "0",
              borderRadius: "4px",
              bottom: "auto",
              minHeight: "10rem",
              left: "50%",
              padding: "2rem",
              position: "fixed",
              right: "auto",
              top: "50%",
              transform: "translate(-50%,-50%)",
              minWidth: "20rem",
              width: "80%",
              maxWidth: "60rem"
            }
          }}
        >
          <p>Are you sure you want to delete this note?</p>
          <button onClick={this.handleCloseModal}>No</button>
          <button className="button is-primary" onClick={this.deleteNote}>
            Yes
          </button>
        </ReactModal>
      </div>
    );
  }
}

export default NoteEditor;
