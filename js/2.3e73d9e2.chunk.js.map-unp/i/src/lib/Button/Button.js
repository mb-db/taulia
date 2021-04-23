/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/default-props-match-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { Progress } from '../Progress';
import { cx } from '../utils';

class Button extends React.Component {
  static propTypes = {
    block: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'sm', 'medium', 'md', 'large', 'lg']),
    spinning: PropTypes.bool,
    theme: PropTypes.oneOf(['light', 'dark', 'none', 'primary', 'text']),
  };

  static defaultProps = {
    block: false,
    disabled: false,
    size: 'large',
    spinning: false,
    theme: 'light',
    type: 'button',
  };

  renderProgress = () => {
    const { spinning } = this.props;
    if (spinning) {
      return <Progress theme="dark" />;
    }
    return null;
  };

  onClick = e => {
    const { onClick } = this.props;
    if (onClick) onClick(e);
    document.activeElement.blur();
  };

  render() {
    const {
      block,
      children,
      className,
      disabled,
      size,
      spinning,
      theme,
      ...otherProps
    } = this.props;
    const classes = cx(
      className,
      theme !== 'none' && theme !== 'text' && `tau-button size-${size}`,
      `theme-${theme}`,
      block && 'block',
      spinning && 'spinning'
    );
    return (
      <button
        className={classes}
        disabled={disabled || spinning}
        {...otherProps}
        onClick={this.onClick}
      >
        {children}
        {this.renderProgress()}
      </button>
    );
  }
}

export default Button;
