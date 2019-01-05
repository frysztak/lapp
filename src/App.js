import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./components/NoteEditor";
import ReactModal from "react-modal";
import Sidebar from "./components/Sidebar";

import { connect } from "react-redux";
import { hideFilterPopup, hideSortPopup } from "./redux/actions";

ReactModal.setAppElement("#root");

class App extends Component {
  componentDidMount() {
    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.showSidebar !== this.props.showSidebar) {
      this.slideout.toggle();
    }
  }

  render() {
    return (
      <div onClick={this.props.hidePopups}>
        <nav id="menu">
          <Sidebar />
        </nav>

        <main id="panel">
          <div>
            <NoteEditor />
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    showSidebar: state.editor.showSidebar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopups: () => {
      dispatch(hideFilterPopup());
      dispatch(hideSortPopup());
    }
  };
};

App.PropTypes = {
  showSidebar: PropTypes.bool.isRequired,
  hidePopups: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
