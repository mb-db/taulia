/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import { omit } from 'lodash';
import { cx } from '../utils';
import { getInputStyles } from '../Text';
import inputWrapper from '../inputWrapper';

class Textarea extends React.Component {
  static propTypes = {
    inline: PropTypes.bool,
    validationState: PropTypes.oneOf(['success', 'error']),
  };

  static defaultProps = {
    inline: false,
    validationState: null,
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
    const { className, inline, validationState, ...otherProps } = this.props;
    const disabled = this.props.disabled;
    return (
      <textarea
        className={cx(
          className,
          validationState ? `has-${validationState}` : null,
          { inline, disabled }
        )}
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

export default inputWrapper(Textarea);
