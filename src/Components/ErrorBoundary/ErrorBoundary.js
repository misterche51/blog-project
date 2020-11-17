import React from 'react';
import Message from '../Message/Message';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {

      return <Message
      type='error'
      text='Sorry... Something goes wrong !:('
      address='/'
      label='Home page'/> ;
    }

    return this.props.children;
  }
}