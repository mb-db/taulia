/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '../Button';

class ModalProxy extends React.Component {
  static defaultProps = {
    elRef: null,
    fullSize: false,
    padding: 20,
    fadeClose: true,
    escClose: true,
    width: 'auto',
    onRequestClose: null,
    children: null,
  };

  render() {
    const { elRef, children, onRequestClose, xButton } = this.props;
    return (
      <div ref={elRef}>
        {xButton ? (
          <Button theme="none" className="esc" onClick={onRequestClose} />
        ) : null}
        {children}
      </div>
    );
  }
}

export default ModalProxy;
