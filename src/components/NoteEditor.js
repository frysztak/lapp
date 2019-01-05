import React from "react";
import PropTypes from "prop-types";
import ClickToEdit from "./ClickToEdit";
import ReactModal from "react-modal";
import { connect } from "react-redux";
import {
  updateNote,
  toggleNoteDeletionModal,
  deleteCurrentNote,
  setNewestNoteAsCurrent
} from "../redux/actions";
import Note from "../Note";

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onNoteNameChanged = this.onNoteNameChanged.bind(this);
    this.onNoteTextChanged = this.onNoteTextChanged.bind(this);

    this.nameEditorRef = React.createRef();
    this.bodyEditorRef = React.createRef();
  }

  onNoteTextChanged(text) {
    const updatedNote = Note.updateText(
      this.props.currentNote,
      text,
      new Date()
    );
    this.props.onNoteChanged(updatedNote);
  }

  onNoteNameChanged(text) {
    const updatedNote = Note.updateName(
      this.props.currentNote,
      text.trim(),
      new Date()
    );
    this.props.onNoteChanged(updatedNote);
  }

  overwriteNote(newNote) {
    this.nameEditorRef.current.overwriteText(newNote.name);
    this.bodyEditorRef.current.overwriteText(newNote.text);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.currentNote) return;

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
          onDeleteNoteClicked={this.props.toggleNoteDeletionModal}
        />

        <ReactModal
          isOpen={this.props.showDeletionModal}
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
            onClick={this.props.toggleNoteDeletionModal}
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
              onClick={this.props.toggleNoteDeletionModal}
            >
              No
            </button>

            <button
              className="is-size-5 button is-primary"
              onClick={this.props.deleteNote}
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
    ),
    showDeletionModal: state.editor.showNoteDeletionModal
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNoteChanged: note => dispatch(updateNote(note)),
    toggleNoteDeletionModal: () => dispatch(toggleNoteDeletionModal()),
    deleteNote: () => {
      dispatch(toggleNoteDeletionModal());
      dispatch(deleteCurrentNote());
      dispatch(setNewestNoteAsCurrent());
    }
  };
};

NoteEditor.PropTypes = {
  currentNote: PropTypes.object.isRequired,
  onNoteChanged: PropTypes.func.isRequired,
  showDeletionModal: PropTypes.bool.isRequired,
  toggleNoteDeletionModal: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteEditor);
