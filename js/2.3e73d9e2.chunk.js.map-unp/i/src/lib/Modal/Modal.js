/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

let container = null;
let ids = 0;

class Modal extends React.Component {
  static propTypes = {
    xButton: PropTypes.bool,
    open: PropTypes.bool,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fadeClose: PropTypes.bool,
    escClose: PropTypes.bool,
    onRequestClose: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  };

  static setContainer(element) {
    container = element;
  }

  static defaultProps = {
    xButton: true,
    open: false,
    padding: 20,
    fadeClose: true,
    escClose: true,
    width: 'auto',
    onRequestClose: null,
  };

  componentDidMount() {
    ids += 1;
    this.id = ids;
    if (container) {
      container.register(this);
    }
  }

  componentDidUpdate() {
    if (container) {
      container.register(this);
    }
  }

  render() {
    return null;
  }
}

export default Modal;
