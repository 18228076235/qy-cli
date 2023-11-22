import React, { Component } from 'react';
const initState = {
  hasError: false,
  errorMsg: ''
};
type TState = Readonly<typeof initState>;
export default class QUErrorBoundary extends Component<{}, TState> {
  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorMsg: error + '' };
  }
  state: TState = initState;
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>页面错误了~</h1>
          <p>{this.state.errorMsg}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
