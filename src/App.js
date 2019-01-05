import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./components/NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";
import Sidebar from "./components/Sidebar";

import store from "./redux/store";
import { connect } from "react-redux";
import { hideFilterPopup, hideSortPopup } from "./redux/actions";

ReactModal.setAppElement("#root");

class App extends Component {
  constructor(props) {
    super(props);

    this.handleNoteClicked = this.handleNoteClicked.bind(this);
    this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
    this.handleNoteNameChange = this.handleNoteNameChange.bind(this);
    this.addNewNote = this.addNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.onSortNotesClicked = this.onSortNotesClicked.bind(this);
    this.onSortOrderClicked = this.onSortOrderClicked.bind(this);

    this.noteManager = new NoteManager(store);
    //if (this.noteManager.notes.length === 0) {
    //  this.noteManager.addNewNote();
    //}

    this.noteEditorRef = React.createRef();

    this.state = {
      showSortPopup: false
      //sortOrder: this.sortTypes[0]
    };
  }

  componentDidMount() {
    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();
  }

  handleNoteClicked(noteID) {
    const note = this.noteManager.findNote(noteID);
    this.setState({ currentNote: note });

    this.noteEditorRef.current.overwriteNote(note);
  }

  handleNoteTextChange(text) {
    const note = this.noteManager.updateNoteText(
      this.state.currentNote.id,
      text
    );
    this.setState({ currentNote: note });
  }

  handleNoteNameChange(name) {
    const note = this.noteManager.updateNoteName(
      this.state.currentNote.id,
      name
    );
    this.setState({ currentNote: note });
  }

  addNewNote() {
    const note = this.noteManager.addNewNote();
    this.setState({ currentNote: note });
    this.noteEditorRef.current.overwriteNote(note);
  }

  deleteNote(note) {
    this.noteManager.deleteNote(note);
    const newestNote = this.noteManager.getNewestNote();
    this.setState({ currentNote: newestNote });

    this.noteEditorRef.current.overwriteNote(newestNote);
  }

  onSortNotesClicked() {
    this.setState({ showSortPopup: !this.state.showSortPopup });
  }

  onSortOrderClicked(order) {
    this.setState({ sortOrder: order });
  }

  render() {
    return (
      <div onClick={this.props.hidePopups}>
        <nav id="menu">
          <Sidebar
            //addNewNote={this.addNewNote}
            showSortPopup={this.state.showSortPopup}
            sortTypes={this.sortTypes}
            sortOrder={this.state.sortOrder}
            onSortNotesClicked={this.onSortNotesClicked}
            onSortOrderClicked={this.onSortOrderClicked}
            //currentNote={this.state.currentNote}
            //notes={this.noteManager.notes}
            //showFilterPopup={this.state.showFilterPopup}
            //filter={this.state.filter}
            //onFilterNotesClicked={this.onFilterNotesClicked}
            //onFilterChanged={this.onFilterChanged}
            //onNoteClicked={this.handleNoteClicked}
          />
        </nav>

        <main id="panel">
          <div>
            <NoteEditor />
            {/*
              ref={this.noteEditorRef}
              currentNote={this.state.currentNote}
              onNoteNameChanged={this.handleNoteNameChange}
              onNoteTextChanged={this.handleNoteTextChange}
              onDeleteNote={this.deleteNote}
              onOpenSidebar={() => this.slideout.open()}
            />
            */}
          </div>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hidePopups: () => {
      dispatch(hideFilterPopup());
      dispatch(hideSortPopup());
    }
  };
};

App.PropTypes = {
  hidePopups: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(App);
