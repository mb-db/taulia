/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';
import { cx } from '../utils';

const PopupPropTypes = {
  position: [
    'auto',
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
  ],
};

export default class Popup extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    position: PropTypes.oneOf(PopupPropTypes.position),
    arrow: PropTypes.bool,
    padded: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    position: 'auto',
    arrow: false,
    padded: true,
    closeOnOutsideClick: true,
    onOpen: () => {},
    onClose: () => {},
  };

  state = {
    popupStyle: null,
    arrowStyle: null,
    placement: null,
    isOpened: false,
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
    this.removeActivator();
  }

  setActivator = activator => {
    if (this.activator) {
      this.removeActivator();
    }

    if (activator.isReactComponent) {
      // eslint-disable-next-line react/no-find-dom-node
      activator = ReactDOM.findDOMNode(activator);
    }

    this.activator = activator;
    activator.addEventListener('click', this.toggle);
    this.destroyPopper();

    if (this.state.isOpened) {
      this.createPopper();
    }
  };

  setDomNode = node => {
    this.domNode = node;
    this.destroyPopper();
  };

  createPopper = () => {
    if (!this.activator || !this.domNode) {
      return false;
    }

    if (this.popper) {
      return true;
    }

    const modifiers = {
      applyStyle: { enabled: false },
      keepTogether: {
        enabled: !!this.props.arrow,
        order: 801,
      },
      arrow: {
        enabled: !!this.props.arrow,
        order: 802,
        element: this.arrow,
      },
      applyReactStyle: {
        enabled: true,
        order: 803,
      },
    };

    this.popper = new Popper(this.activator, this.domNode, {
      modifiers,
      placement: this.props.position,
      onCreate: this.updatePosition,
      onUpdate: this.updatePosition,
    });

    return true;
  };

  destroyPopper = () => {
    if (!this.popper) {
      return;
    }
    this.popper.destroy();
    this.popper = null;
  };

  updatePopper = () => {
    if (this.popper) {
      this.popper.update();
    }
  };

  updatePosition = data => {
    this.setState({
      popupStyle: data.styles,
      arrowStyle: data.offsets.arrow,
      placement: data.placement,
    });

    return data;
  };

  open = () => {
    if (this.state.isOpened) {
      return;
    }
    this.props.onOpen();
    this.setState({ isOpened: true });

    if (this.props.closeOnOutsideClick) {
      document.addEventListener('click', this.handleClickOutside, true);
    }

    this.createPopper();
  };

  close = () => {
    if (!this.state.isOpened) {
      return;
    }
    this.props.onClose();
    this.setState({ isOpened: false });
  };

  toggle = () => {
    if (this.state.isOpened) {
      this.close();
    } else {
      this.open();
    }
  };

  removeActivator = () => {
    if (!this.activator) {
      return;
    }
    this.activator.removeEventListener('click', this.toggle);
    this.activator = null;

    this.destroyPopper();
  };

  handleClickOutside = e => {
    if (!this.props.closeOnOutsideClick || !this.state.isOpened) {
      return;
    }

    const isClickedOnPopup = !!(
      this.domNode && this.domNode.contains(e.target)
    );
    const isClickedOnActivator = !!(
      this.activator && this.activator.contains(e.target)
    );

    if (!isClickedOnPopup && !isClickedOnActivator) {
      this.close();
    }
  };

  render() {
    if (!this.state.isOpened) {
      return null;
    }
    const { className, arrow, position, padded, children } = this.props;
    const classNames = [
      'popup',
      className,
      padded ? 'padded' : null,
      arrow ? 'with-arrow' : null,
      position ? `positioned placement-${this.state.placement}` : null,
    ];

    return (
      <div
        className={cx(classNames)}
        ref={this.setDomNode}
        style={this.state.popupStyle}
      >
        {arrow ? (
          <div
            className="popup-arrow"
            ref={node => {
              this.arrow = node;
            }}
            style={this.state.arrowStyle}
          />
        ) : null}
        <div className="popup-content-wrapper">
          <div className="popup-content">{children}</div>
        </div>
      </div>
    );
  }
}
