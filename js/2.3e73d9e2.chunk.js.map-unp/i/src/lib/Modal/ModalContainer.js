import React from 'react';
import { find } from 'lodash';
import Modal from './Modal';
import ModalProxy from './ModalProxy';
import { cx } from '../utils';

class ModalContainer extends React.Component {
  state = {
    fullSize: false,
    modals: {},
  };

  componentDidMount() {
    this.currentModal = null;
    this.currentModalEl = React.createRef();
    document.body.addEventListener('keydown', this.onKeydown);
    Modal.setContainer(this);
  }

  componentWillUnmount() {
    this.unregisterAll();
    document.body.removeEventListener('keydown', this.onKeydown);
  }

  onMouseDown = event => {
    const modal = this.currentModal;
    const content = this.currentModalEl;
    if (
      modal?.props.fadeClose &&
      (!content.current || !content.current.contains(event.target))
    ) {
      modal.props.onRequestClose();
    }
  };

  onKeydown = event => {
    const modal = this.currentModal;
    if (modal?.props.escClose === true && event.keyCode === 27) {
      event.stopPropagation();
      modal.props.onRequestClose();
    }
  };

  setCurrentModal = el => {
    this.currentModal = el;
  };

  register = component => {
    const { modals } = this.state;
    const newModals = modals;
    newModals[component.id] = component;
    this.setState({
      modals: newModals,
    });
  };

  unregister = component => {
    const { modals } = this.state;
    const newModals = modals;
    delete newModals[component.id];
    this.setState({
      modals: newModals,
    });
  };

  unregisterAll = () => {
    this.setState({
      modals: {},
    });
  };

  render() {
    const { fullSize, modals } = this.state;
    const modal = find(modals, item => item.props.open === true);
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div
        className={cx('tau-modal', {
          'is-active': modal,
          'full-size': fullSize,
        })}
        onMouseDown={this.onMouseDown}
        role="button"
        tabIndex="0"
      >
        <div
          className="tau-model-content"
          style={
            modal
              ? {
                  width: fullSize ? '100%' : modal.props.width,
                  padding: modal.props.padding,
                }
              : null
          }
        >
          {modal ? (
            <ModalProxy
              ref={this.setCurrentModal}
              elRef={this.currentModalEl}
              {...modal.props}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ModalContainer;
