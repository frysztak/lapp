import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./NoteEditor";
import NoteManager from "./NoteManager";
import ReactModal from "react-modal";
import NoteList from "./NoteList";

ReactModal.setAppElement("#root");

class SortType {
  constructor(id, parameter, modifier) {
    this.id = id;
    this.parameter = parameter;
    this.modifier = modifier;
  }
}

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
    this.onFilterNotesClicked = this.onFilterNotesClicked.bind(this);
    this.onFilterChanged = this.onFilterChanged.bind(this);

    this.noteManager = new NoteManager();
    if (this.noteManager.notes.length === 0) {
      this.noteManager.addNewNote();
    }

    this.sortTypes = [
      new SortType(0, "Name", "asc"),
      new SortType(1, "Name", "desc"),
      new SortType(2, "Last edited", "asc"),
      new SortType(3, "Last edited", "desc")
    ];

    this.noteEditorRef = React.createRef();

    this.state = {
      currentNote: this.noteManager.getNewestNote(),
      showSortPopup: false,
      sortOrder: this.sortTypes[0],
      showFilterPopup: false,
      filter: ""
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
  }

  deleteNote(note) {
    this.noteManager.deleteNote(note);
    this.setState({ currentNote: this.noteManager.getNewestNote() });
  }

  onSortNotesClicked(e) {
    this.setState({ showSortPopup: !this.state.showSortPopup });
  }

  onSortOrderClicked(order) {
    this.setState({ sortOrder: order });
  }

  onFilterNotesClicked() {
    this.setState({ showFilterPopup: !this.state.showFilterPopup });
  }

  onFilterChanged(e) {
    const filter = e.target.value;
    this.setState({ filter: filter });
  }

  render() {
    const sortListItem = sortType => {
      return (
        <button
          key={sortType.id}
          className={
            sortType === this.state.sortOrder
              ? "button is-white dropdown-item is-active"
              : "button is-white dropdown-item"
          }
          onClick={() => this.onSortOrderClicked(sortType)}
        >
          <span>
            {sortType.parameter}
            <i
              className={
                sortType.modifier === "asc"
                  ? "fas fa-arrow-up"
                  : "fas fa-arrow-down"
              }
              style={{ marginLeft: "5px" }}
            />
          </span>
        </button>
      );
    };

    const Popup = ({ showPopup, child, menu, centerPopup, equalPadding }) => {
      let mainDivClass = "dropdown ";
      if (showPopup) mainDivClass += "is-active ";
      if (!centerPopup) mainDivClass += "is-right";

      return (
        <div className={mainDivClass}>
          <div
            className="dropdown-trigger"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            {child}
          </div>

          <div
            className={
              centerPopup ? "dropdown-menu is-center" : "dropdown-menu"
            }
            id="dropdown-menu"
            role="menu"
          >
            <div
              className={
                equalPadding
                  ? "dropdown-content equal-padding"
                  : "dropdown-content"
              }
            >
              {menu}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        onClick={() => {
          if (this.state.showSortPopup) this.setState({ showSortPopup: false });
          if (this.state.showFilterPopup)
            this.setState({ showFilterPopup: false });
        }}
      >
        <nav id="menu">
          <div className="menu-header has-text-centered is-size-2">Lapp</div>
          <div className="menu-divider is-divider" />

          <div className="columns is-size-3">
            <div className="column icon-container has-text-centered">
              <i
                onClick={this.addNewNote}
                className="fas fa-plus-square has-hover-shadow clickable"
              />
            </div>

            <div className="column icon-container has-text-centered">
              <Popup
                showPopup={this.state.showFilterPopup}
                centerPopup={true}
                equalPadding={true}
                child={
                  <i
                    className="fas fa-search has-hover-shadow clickable"
                    onClick={this.onFilterNotesClicked}
                  />
                }
                menu={
                  <div className="field" onClick={e => e.stopPropagation()}>
                    <p className="control has-icons-left">
                      <input
                        className="input is-medium"
                        type="text"
                        placeholder="Note name..."
                        autoFocus={true}
                        value={this.state.filter}
                        onChange={this.onFilterChanged}
                      />
                      <span className="icon is-small is-left">
                        <i className="fas fa-search" />
                      </span>
                    </p>
                  </div>
                }
              />
            </div>

            <div className="column icon-container has-text-centered">
              <Popup
                showPopup={this.state.showSortPopup}
                child={
                  <i
                    className="fas fa-sort has-hover-shadow clickable"
                    onClick={this.onSortNotesClicked}
                  />
                }
                menu={this.sortTypes.map(sortType => {
                  return sortListItem(sortType);
                })}
              />
            </div>
          </div>

          <div className="menu-divider is-divider" />

          <NoteList
            currentNote={this.state.currentNote}
            notes={this.noteManager.notes}
            onNoteClicked={this.handleNoteClicked}
            sortOrder={this.state.sortOrder}
            filter={this.state.filter}
          />
        </nav>

        <main id="panel">
          <div>
            <NoteEditor
              ref={this.noteEditorRef}
              currentNote={this.state.currentNote}
              onNoteNameChanged={this.handleNoteNameChange}
              onNoteTextChanged={this.handleNoteTextChange}
              onDeleteNote={this.deleteNote}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
