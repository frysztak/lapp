import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./components/NoteEditor";
import ReactModal from "react-modal";
import { env as Env } from "./Env";
import Sidebar from "./components/Sidebar";

import { connect } from "react-redux";
import { setDropboxSyncEnabled, hideAllPopups } from "./redux/actions";

ReactModal.setAppElement("#root");

class App extends Component {
  async checkForDropboxAuthCode() {
    const currentURL = new URL(window.location.href);
    if (currentURL.pathname === `/${Env.DropboxRedirectPath}`) {
      if (currentURL.searchParams.has("code")) {
        const authorizationCode = currentURL.searchParams.get("code");

        // hide authorization code in url
        if (window.history.pushState) {
          window.history.pushState({}, null, window.location.origin);
        }

        const accessTokenUrl = `${
          Env.DropboxAccessTokenUrl
        }${authorizationCode}`;

        const response = await fetch(accessTokenUrl, Env.FetchOptions);

        if (response.status !== 200) {
          console.log(`Status code: ${response.status}`);
          return;
        }

        this.props.setDropboxSyncEnabled(true);
      }
    }
  }

  async componentDidMount() {
    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();

    await this.checkForDropboxAuthCode();
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
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    hidePopups: () => dispatch(hideAllPopups()),
    setDropboxSyncEnabled: enabled => dispatch(setDropboxSyncEnabled(enabled))
  };
};

App.propTypes = {
  hidePopups: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
