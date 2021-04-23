/* eslint-disable prefer-destructuring */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import { omit } from 'lodash';
import { cx } from '../utils';
import { Branding } from '../Branding';
import inputWrapper from '../inputWrapper';

function getInputStyles({ disabled, hover, focus }) {
  if (disabled) {
    return null;
  }
  const primary = Branding.fetchColor('primary').hexString();
  if (focus) {
    return {
      borderColor: primary,
      backgroundColor: '#ffffff',
      color: '#333333',
      boxShadow: `0 0 3px ${Branding.fetchColor('primary')
        .darken(0.3)
        .clearer(0.5)
        .rgbaString()} inset`,
    };
  }
  if (hover) {
    return {
      borderColor: primary,
      backgroundColor: '#ffffff',
      color: '#333333',
    };
  }
  return null;
}

class Text extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['number', 'text', 'password']),
    inline: PropTypes.bool,
    validationState: PropTypes.oneOf(['success', 'error']),
  };

  static defaultProps = {
    type: 'text',
    inline: false,
    validationState: null,
    value: '',
  };

  state = {
    hover: false,
    focus: false,
  };

  onBlur = e => {
    e.persist();
    this.setState({ focus: false }, () => this.props.onBlur(e));
  };

  onFocus = e => {
    e.persist();
    this.setState({ focus: true }, () => this.props.onFocus(e));
  };

  onMouseOut = e => {
    e.persist();
    this.setState({ hover: false }, () => this.props.onMouseOut(e));
  };

  onMouseOver = e => {
    e.persist();
    this.setState({ hover: true }, () => this.props.onMouseOver(e));
  };

  render() {
    const {
      value,
      name,
      type,
      className,
      inline,
      validationState,
      ...otherProps
    } = this.props;
    const disabled = this.props.disabled;
    return (
      <input
        value={value}
        name={name}
        className={cx(
          className,
          validationState ? `has-${validationState}` : null,
          { inline, disabled }
        )}
        type={type}
        style={getInputStyles({ disabled, ...this.state })}
        {...omit(otherProps, 'onBlur', 'onFocus', 'onMouseOut', 'onMouseOver')}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
      />
    );
  }
}

const wrapper = inputWrapper(Text);

export { getInputStyles, wrapper as Text };
