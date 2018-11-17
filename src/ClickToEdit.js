import React from "react";
import ReactMarkdown from "react-markdown";

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.onEditorLostFocus = this.onEditorLostFocus.bind(this);
    this.onEditorKeyDown = this.onEditorKeyDown.bind(this);
    this.onCheckboxClicked = this.onCheckboxClicked.bind(this);

    this.state = {
      value: props.text,
      showEditor: false
    };

    this.renderers = {
      listItem: this.listItemRenderer.bind(this)
    };
  }

  listItemRenderer(props) {
    let checkbox = null;
    if (props.checked !== null) {
      checkbox = (
        <input type="checkbox" checked={props.checked} readOnly={true} />
      );
    }

    return (
      <li
        onClick={checkbox ? this.onCheckboxClicked : () => {}}
        data-sourcepos={props["data-sourcepos"]}
      >
        {checkbox}
        {props.children}
      </li>
    );
  }

  handleTextChange(text) {
    this.props.onTextChange(text);
    this.setState({ value: text });
  }

  onEditorLostFocus() {
    this.setState({ showEditor: false });
  }

  onEditorKeyDown(e) {
    // detect escape key
    if (e.keyCode === 27) {
      this.onEditorLostFocus();
    }
  }

  onClicked() {
    this.setState({ showEditor: true });
  }

  onCheckboxClicked(e) {
    e.stopPropagation();
    const sourcepos = e.currentTarget.getAttribute("data-sourcepos");
    this.tickCheckbox(sourcepos);
  }

  tickCheckbox(sourcepos) {
    let splits = sourcepos.split("-");
    if (splits.length < 1) return;
    const beginning = splits[0];

    splits = beginning.split(":");
    if (splits.length < 1) return;
    const lineIdx = splits[0] - 1; // indexing starts with 1

    let lines = this.state.value.split("\n");
    if (lines.length <= lineIdx) return;
    lines[lineIdx] = lines[lineIdx].replace("[ ]", "[x]");
    this.handleTextChange(lines.join("\n"));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.text !== prevProps.text) {
      this.setState({ value: this.props.text });
    }
  }

  render() {
    return (
      <div onClick={this.onClicked}>
        {this.state.showEditor ? (
          <textarea
            ref="editor"
            className={this.props.className}
            rows={this.props.rows}
            cols="50"
            autoFocus={true}
            onBlur={this.onEditorLostFocus}
            onKeyDown={this.onEditorKeyDown}
            onChange={e => this.handleTextChange(e.target.value)}
            value={this.state.value}
          />
        ) : (
          <ReactMarkdown
            source={this.state.value}
            renderers={this.renderers}
            sourcePos={true}
          />
        )}
      </div>
    );
  }
}

export default ClickToEdit;
