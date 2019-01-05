import React from "react";
import ClickToEdit from "./ClickToEdit";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import { updateNote } from "../redux/actions";

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onNoteNameChanged = this.onNoteNameChanged.bind(this);
    this.onNoteTextChanged = this.onNoteTextChanged.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this.nameEditorRef = React.createRef();
    this.bodyEditorRef = React.createRef();

    this.state = {
      showDeletionModal: false
    };
  }

  handleTextChange(e) {
    let text = e.target.value;
    this.props.onTextChange(text);
  }

  onNoteTextChanged(text) {
    const updatedNote = this.props.currentNote.updateText(text, new Date());
    this.props.onNoteChanged(updatedNote);
  }

  onNoteNameChanged(text) {
    const updatedNote = this.props.currentNote.updateName(
      text.trim(),
      new Date()
    );
    this.props.onNoteChanged(updatedNote);
  }

  deleteNote() {
    this.props.onDeleteNote(this.props.currentNote);
    this.setState({ showDeletionModal: false });
  }

  overwriteNote(newNote) {
    this.nameEditorRef.current.overwriteText(newNote.name);
    this.bodyEditorRef.current.overwriteText(newNote.text);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !prevProps.currentNote ||
      prevProps.currentNote.id !== this.props.currentNote.id
    ) {
      this.overwriteNote(this.props.currentNote);
    }
  }

  render() {
    const currentNote = this.props.currentNote;

    return (
      <div>
        <div className="columns is-mobile is-gapless is-marginless is-centered is-vcentered">
          <div className="column is-narrow is-size-4 slideout-trigger is-hidden-desktop">
            <i
              onClick={this.props.onOpenSidebar}
              className="fas fa-ellipsis-v has-hover-shadow clickable"
            />
          </div>

          <div className="column">
            <ClickToEdit
              ref={this.nameEditorRef}
              text={currentNote ? currentNote.name : ""}
              id="note-name"
              tabIndex={1}
              disableTab={true}
              plainText={true}
              disableToolbar={true}
              onTextChange={this.onNoteNameChanged}
            />
          </div>
        </div>

        <ClickToEdit
          ref={this.bodyEditorRef}
          text={currentNote ? currentNote.text : ""}
          id="note-body"
          tabIndex={2}
          plainText={false}
          onTextChange={this.onNoteTextChanged}
          onDeleteNoteClicked={() => this.setState({ showDeletionModal: true })}
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
              width: "50%",
              maxWidth: "60rem"
            }
          }}
        >
          <i
            style={{ margin: "-20px" }}
            className="fas fa-times is-pulled-right is-size-5"
            onClick={() => this.setState({ showDeletionModal: false })}
            id="deleteIcon"
          />

          <p className="has-text-centered is-size-4">
            Are you sure you want to delete this note? This action cannot be
            reverted.
          </p>

          <div
            className="level is-mobile"
            style={{ justifyContent: "flex-end" }}
          >
            <button
              className="is-size-5 button is-secondary"
              style={{ marginRight: "8px" }}
              onClick={() => this.setState({ showDeletionModal: false })}
            >
              No
            </button>

            <button
              className="is-size-5 button is-primary"
              onClick={this.deleteNote}
            >
              Yes
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentNote: state.notes.all.find(
      note => note.id === state.notes.currentNoteId
    )
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNoteChanged: note => dispatch(updateNote(note))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteEditor);
