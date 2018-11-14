import React, { Component } from "react";
import "./App.css";
import Slideout from "slideout";
import Editor from "./Editor";

const File = (name, clickHandler) => {
  return (
    <li className="menu-file-list" key={name} onClick={clickHandler}>
      {name}
    </li>
  );
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      availableFiles: [],
      currentFile: ""
    };

    this.fileClicked = this.fileClicked.bind(this);
    this.handleNoteTextChange = this.handleNoteTextChange.bind(this);
  }

  componentDidMount() {
    this.loadAvailableFiles();

    this.slideout = new Slideout({
      panel: document.getElementById("panel"),
      menu: document.getElementById("menu"),
      padding: 256,
      tolerance: 70
    });
    this.slideout.open();
  }

  loadAvailableFiles() {
    if (localStorage.length === 0) {
      localStorage.setItem(
        "new note",
        JSON.stringify({
          content: ""
        })
      );
    }
    let files = Object.keys(localStorage);
    this.setState({ availableFiles: files });
    this.updateCurrentFile(files[0]);
  }

  updateCurrentFile(filename) {
    let file = JSON.parse(localStorage.getItem(filename));
    this.setState({
      currentFile: {
        name: filename,
        content: file.content
      }
    });
  }

  fileClicked(e) {
    const filename = e.target.innerHTML
    this.updateCurrentFile(filename)
  }

  handleNoteTextChange(text) {
    let newItem = JSON.stringify({content: text})
    localStorage.setItem(this.state.currentFile.name, newItem)
  }

  render() {
    const files = this.state.availableFiles.map(file =>
      File(file, this.fileClicked)
    );

    return (
      <div>
        <nav id="menu">
          <header>
            <div className="menu-header">Files</div>
          </header>
          <ul>{files}</ul>
        </nav>

        <main id="panel">
          <div>
            <p>{this.state.currentFile.name}</p>
            <Editor
              onTextChange={this.handleNoteTextChange}
              currentFile={this.state.currentFile}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
