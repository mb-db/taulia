/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { noop, omit } from 'lodash';
import { cx } from '../utils';
import { Branding } from '../Branding';

class Link extends React.Component {
  static propTypes = {
    branded: PropTypes.bool,
  };

  static defaultProps = {
    branded: true,
    to: null,
    style: {},
    onBlur: noop,
    onFocus: noop,
    onMouseDown: noop,
    onMouseOut: noop,
    onMouseOver: noop,
    onMouseUp: noop,
  };

  state = {
    hover: false,
    focus: false,
    active: false,
  };

  onBlur = e => {
    e.persist();
    this.setState({ focus: false }, () => this.props.onBlur(e));
  };

  onFocus = e => {
    e.persist();
    this.setState({ focus: true }, () => this.props.onFocus(e));
  };

  onMouseDown = e => {
    e.persist();
    this.setState({ active: true }, () => this.props.onMouseDown(e));
  };

  onMouseOut = e => {
    e.persist();
    this.setState({ hover: false }, () => this.props.onMouseOut(e));
  };

  onMouseOver = e => {
    e.persist();
    this.setState({ hover: true }, () => this.props.onMouseOver(e));
  };

  onMouseUp = e => {
    e.persist();
    this.setState({ active: false }, () => this.props.onMouseUp(e));
  };

  getStyles = () => {
    const { branded, disabled, style } = this.props;
    const { hover, focus, active } = this.state;
    if (disabled || !branded) {
      return style;
    }
    if (active) {
      return {
        ...style,
        color: Branding.fetchColor('primary')
          .darken(0.3)
          .hexString(),
      };
    }
    if (hover || focus) {
      return {
        ...style,
        color: Branding.fetchColor('primary')
          .lighten(0.3)
          .hexString(),
        textDecoration: 'underline',
      };
    }
    return {
      ...style,
      color: Branding.fetchColor('primary').hexString(),
      textDecoration: 'none',
    };
  };

  render() {
    const { className, children, style, ...otherProps } = this.props;
    const props = {
      ...omit(
        otherProps,
        'onBlur',
        'onFocus',
        'onMouseDown',
        'onMouseOut',
        'onMouseOver',
        'onMouseUp',
        'branded'
      ),
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onMouseDown: this.onMouseDown,
      onMouseOut: this.onMouseOut,
      onMouseOver: this.onMouseOver,
      onMouseUp: this.onMouseUp,
      style: { ...this.getStyles(), ...style },
    };

    const cls = cx('tau-link', className);
    const { to } = otherProps;
    const absolute = to && typeof to === 'string' && to.indexOf('http') === 0;

    if (to && typeof to !== 'function' && !absolute) {
      return (
        <ReactRouterLink {...props} className={cls}>
          {children}
        </ReactRouterLink>
      );
    }
    return (
      <a href={to} {...props} className={cls}>
        {children}
      </a>
    );
  }
}

export default Link;
