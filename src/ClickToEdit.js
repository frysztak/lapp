import React from "react";
import ReactMarkdown from "react-markdown";

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.onEditorLostFocus = this.onEditorLostFocus.bind(this);

    this.state = {
      value: props.text,
      showEditor: false
    };
  }

  handleTextChange(e) {
    const text = e.target.value;
    this.props.onTextChange(text);
    this.setState({ value: text });
  }

  onEditorLostFocus() {
    this.setState({ showEditor: false });
  }

  onClicked() {
    this.setState({ showEditor: true });
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
            onChange={this.handleTextChange}
            value={this.state.value}
          />
        ) : (
          <ReactMarkdown source={this.state.value} />
        )}
      </div>
    );
  }
}

export default ClickToEdit;
