import React from "react";
import NoteList from "./NoteList";
import { connect } from "react-redux";
import { setCurrentNoteId } from "../redux/actions";

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
        className={centerPopup ? "dropdown-menu is-center" : "dropdown-menu"}
        id="dropdown-menu"
        role="menu"
      >
        <div
          className={
            equalPadding ? "dropdown-content equal-padding" : "dropdown-content"
          }
        >
          {menu}
        </div>
      </div>
    </div>
  );
};

const SortListItem = props => {
  const sortType = props.sortType;

  return (
    <button
      key={sortType.id}
      className={
        sortType === props.currentSortOrder
          ? "button is-white dropdown-item is-size-6 is-active"
          : "button is-white dropdown-item is-size-6"
      }
      onClick={() => props.onSortOrderClicked(sortType)}
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

const Sidebar = props => {
  return (
    <div>
      <div className="menu-header has-text-centered is-size-2">Lapp</div>
      <div className="menu-divider is-divider" />

      <div className="columns is-mobile is-size-3">
        <div className="column icon-container has-text-centered">
          <i
            onClick={props.addNewNote}
            className="fas fa-plus-circle has-hover-shadow clickable"
          />
        </div>

        <div className="column icon-container has-text-centered">
          <Popup
            showPopup={props.showFilterPopup}
            centerPopup={true}
            equalPadding={true}
            child={
              <i
                className="fas fa-search has-hover-shadow clickable"
                onClick={props.onFilterNotesClicked}
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
                    value={props.filter}
                    onChange={props.onFilterChanged}
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
            showPopup={props.showSortPopup}
            child={
              <i
                className="fas fa-sort has-hover-shadow clickable"
                onClick={props.onSortNotesClicked}
              />
            }
            menu={props.sortTypes.map(sortType => (
              <SortListItem
                sortType={sortType}
                currentSortOrder={props.sortOrder}
                onSortOrderClicked={props.onSortOrderClicked}
                key={sortType.id}
              />
            ))}
          />
        </div>
      </div>

      <div className="menu-divider is-divider" />

      <NoteList
        //currentNote={props.currentNote}
        //notes={props.notes}
        onNoteClicked={props.onNoteClicked}
        sortOrder={props.sortOrder}
        filter={props.filter}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    notes: state.notes.all,
    currentNote: state.notes.all[state.notes.currentNoteId]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNoteClicked: noteId => dispatch(setCurrentNoteId(noteId))
  };
};

export default Sidebar;

//export default connect(
//  mapStateToProps,
//  mapDispatchToProps
//)(Sidebar);
