import React from "react";

class ClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.onRegularTextClicked = this.onRegularTextClicked.bind(this);
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

  onRegularTextClicked() {
    this.setState({ showEditor: true });
  }

  onEditorLostFocus() {
    this.setState({ showEditor: false });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.text !== prevProps.text) {
      this.setState({ value: this.props.text });
    }
  }

  render() {
    return (
      <div>
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
          <pre
            ref="regular"
            className={this.props.className}
            onClick={this.onRegularTextClicked}
          >
            {this.state.value}
          </pre>
        )}
      </div>
    );
  }
}

export default ClickToEdit;
