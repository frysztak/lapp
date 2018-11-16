import React from "react";
import ReactMarkdown from "react-markdown";

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.onEditorLostFocus = this.onEditorLostFocus.bind(this);
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
        onClick={this.onCheckboxClicked}
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

  onClicked() {
    this.setState({ showEditor: true });
  }

  onCheckboxClicked(e) {
    e.stopPropagation();
    const sourcepos = e.currentTarget.getAttribute("data-sourcepos");
    this.tickCheckbox(sourcepos);
  }

  tickCheckbox(sourcepos) {
    const beginning = sourcepos.split("-")[0];
    let line = beginning.split(":")[0];
    line -= 1; // sourcepos indexing starts with 1

    let lines = this.state.value.split("\n");
    lines[line] = lines[line].replace("[ ]", "[x]");
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
