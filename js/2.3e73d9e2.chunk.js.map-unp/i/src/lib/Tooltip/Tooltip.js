/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/default-props-match-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import Tether from 'react-tether';
import { isFunction } from 'lodash';
import { Branding } from '../Branding';

export const TRIGGER_HOVER = 'hover';
export const TRIGGER_MANUAL = 'manual';

export const ALIGN_LEFT = 'left';
export const ALIGN_CENTER = 'center';
export const ALIGN_RIGHT = 'right';

export const THEME_PRIMARY = 'primary';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const THEME_DANGER = 'danger';
export const THEME_WARN = 'warn';
export const THEME_SUCCESS = 'success';
export const THEME_INFO = 'info';
export const THEME_SELECT = 'select';

class Tooltip extends React.Component {
  static propTypes = {
    trigger: PropTypes.oneOf([TRIGGER_HOVER, TRIGGER_MANUAL]),
    align: PropTypes.oneOf([ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT]),
    theme: PropTypes.oneOf([
      THEME_PRIMARY,
      THEME_DARK,
      THEME_LIGHT,
      THEME_DANGER,
      THEME_WARN,
      THEME_SUCCESS,
      THEME_INFO,
      THEME_SELECT,
    ]),
    hoverOpenDelay: PropTypes.number,
    hoverCloseDelay: PropTypes.number,
    open: PropTypes.bool,
    fadeClose: PropTypes.bool,
    escClose: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onRequestClose: props => {
      if (
        props.trigger === TRIGGER_MANUAL &&
        (props.fadeClose || props.escClose)
      ) {
        if (!isFunction(props.onRequestClose)) {
          return new Error(
            "The 'onRequestClose' prop is required when the trigger is set as 'manual', and either 'fadeClose' or 'escClose' are enabled"
          );
        }
      }
      return null;
    },
  };

  static defaultProps = {
    trigger: TRIGGER_HOVER,
    align: ALIGN_LEFT,
    theme: THEME_DARK,
    children: null,
    open: false,
    hoverOpenDelay: 100,
    hoverCloseDelay: 400,
    fadeClose: false,
    escClose: false,
    onAfterOpen: null,
    onRequestClose: null,
  };

  state = {
    show: false,
  };

  componentDidMount() {
    this.hoverOpenTimeout = null;
    this.hoverCloseTimeout = null;
    if (this.props.trigger === TRIGGER_MANUAL) {
      document.body.addEventListener('keydown', this.onBodyKeyDown);
      document.body.addEventListener('click', this.onBodyClick);
    }
  }

  componentWillUnmount() {
    if (this.props.trigger === TRIGGER_MANUAL) {
      document.body.removeEventListener('keydown', this.onBodyKeyDown);
      document.body.removeEventListener('click', this.onBodyClick);
    }
    this.clearTimeouts();
  }

  onBodyClick = event => {
    if (!this.showContent()) {
      return;
    }
    let node = event.target;
    while (node && node.parentNode) {
      if (node === this.contentEl) {
        return;
      }
      node = node.parentNode;
    }
    if (this.props.fadeClose === true) {
      this.close();
    }
  };

  onBodyKeyDown = event => {
    if (
      this.props.trigger === TRIGGER_MANUAL &&
      this.props.escClose === true &&
      event.keyCode === 27
    ) {
      this.close();
    }
  };

  onMouseEnter = () => {
    if (this.props.trigger === TRIGGER_HOVER) {
      this.hoverOpenTimeout = setTimeout(this.open, this.props.hoverOpenDelay);
    }
  };

  onMouseLeave = () => {
    if (this.props.trigger === TRIGGER_HOVER) {
      if (this.hoverOpenTimeout === null) {
        this.hoverCloseTimeout = setTimeout(
          this.close,
          this.props.hoverCloseDelay
        );
      } else {
        clearTimeout(this.hoverOpenTimeout);
        this.hoverOpenTimeout = null;
      }
    }
  };

  getStyles = () => {
    const { theme } = this.props;
    let bgColor = null;
    let textColor = null;
    let borderColor = null;
    switch (theme) {
      case THEME_PRIMARY:
        bgColor = Branding.fetchColor('primary').hexString();
        textColor = '#FFFFFF';
        borderColor = Branding.fetchColor('primary').hexString();
        break;
      case THEME_DANGER:
        bgColor = '#de262b';
        textColor = '#ffffff';
        borderColor = '#de262b';
        break;
      case THEME_SUCCESS:
        bgColor = '#d6e9c0';
        textColor = '#3c763d';
        borderColor = '#d6e9c0';
        break;
      case THEME_WARN:
        bgColor = '#faebcc';
        textColor = '#8a6d3b';
        borderColor = '#faebcc';
        break;
      case THEME_INFO:
        bgColor = '#bce8f1';
        textColor = '#31708f';
        borderColor = '#bce8f1';
        break;
      case THEME_LIGHT:
        bgColor = '#d0d0d0';
        textColor = '#000000';
        borderColor = '#d0d0d0';
        break;
      case THEME_SELECT:
        bgColor = '#ffffff';
        textColor = '#444444';
        borderColor = Branding.fetchColor('primary').hexString();
        break;
      case THEME_DARK:
      default:
        bgColor = '#444444';
        textColor = '#ffffff';
        break;
    }
    return {
      contentStyle: {
        backgroundColor: bgColor,
        color: textColor,
        border: `1px ${borderColor} solid`,
      },
      arrowStyle: {
        borderTopColor: borderColor,
        borderBottomColor: borderColor,
      },
    };
  };

  getTetherOptions = () => {
    const { align } = this.props;
    return {
      attachment: `top ${align}`,
      targetAttachment: `bottom ${align}`,
      constraints: [{ to: 'window', attachment: 'together', pin: false }],
    };
  };

  setContentRef = el => {
    this.contentEl = el;
  };

  open = () => {
    this.setState({ show: true }, () => {
      this.clearTimeouts();
      if (this.props.onAfterOpen) {
        this.props.onAfterOpen();
      }
    });
  };

  close = () => {
    this.setState({ show: false }, this.props.onRequestClose);
  };

  clearTimeouts = () => {
    if (this.hoverOpenTimeout !== null) {
      clearTimeout(this.hoverOpenTimeout);
      this.hoverOpenTimeout = null;
    }
    if (this.hoverCloseTimeout !== null) {
      clearTimeout(this.hoverCloseTimeout);
      this.hoverCloseTimeout = null;
    }
  };

  showContent = () => {
    const { trigger, open } = this.props;
    const { show } = this.state;
    switch (trigger) {
      case TRIGGER_HOVER:
        return show === true;
      case TRIGGER_MANUAL:
      default:
        return open === true;
    }
  };

  renderTarget = () => {
    const { children, trigger } = this.props;
    const target = React.Children.toArray(children)[0];
    if (target) {
      if (trigger === TRIGGER_HOVER) {
        return React.cloneElement(target, {
          onMouseEnter: this.onMouseEnter,
          onMouseLeave: this.onMouseLeave,
        });
      }
      return target;
    }
    return null;
  };

  renderContent = () => {
    const { children, trigger, theme } = this.props;
    const content = React.Children.toArray(children)[1];
    if (content) {
      const { contentStyle, arrowStyle } = this.getStyles();
      return (
        <div
          className={`tooltip-content theme-${theme}`}
          style={contentStyle}
          ref={this.setContentRef}
          onMouseEnter={trigger === TRIGGER_HOVER ? this.onMouseEnter : null}
          onMouseLeave={trigger === TRIGGER_HOVER ? this.onMouseLeave : null}
        >
          <span className="tooltip-arrow" style={arrowStyle} />
          <div>{content}</div>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <Tether {...this.getTetherOptions()} classPrefix="tooltip">
        {this.renderTarget()}
        {this.showContent() && this.renderContent()}
      </Tether>
    );
  }
}

export default Tooltip;
