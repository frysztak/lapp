import React, { Component } from "react";
import PropTypes from "prop-types";
import "./App.css";
import Slideout from "slideout";
import NoteEditor from "./components/NoteEditor";
import ReactModal from "react-modal";
import Cookies from "js-cookie";
import { env as Env } from "./Env";
import Sidebar from "./components/Sidebar";

import { connect } from "react-redux";
import { hideFilterPopup, hideSortPopup } from "./redux/actions";

ReactModal.setAppElement("#root");

class App extends Component {
  constructor(props) {
    super(props);

    //if (this.isDropboxIntegrationEnabled()) {
    //  this.noteManager.setDropboxAccessToken(
    //    Cookies.get(Env.DropboxAccessTokenCookieName)
    //  );
    //}
  }

  isDropboxIntegrationEnabled() {
    return Cookies.get(Env.DropboxAccessTokenCookieName) || false;
  }

  async componentDidMount() {
    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();

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

        this.noteManager.setDropboxAccessToken(
          Cookies.get(Env.DropboxAccessTokenCookieName)
        );

        this.setState({
          dropboxIntegrationEnabled: this.isDropboxIntegrationEnabled()
        });
      }
    }
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
