/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react';
import { omit } from 'lodash';
import { cx } from '../utils';
import { getInputStyles } from '../Text';
import inputWrapper from '../inputWrapper';

class Dropdown extends React.Component {
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
    const style = this.props.style;
    return (
      <select
        className={cx(
          className,
          validationState ? `has-${validationState}` : null,
          { inline, disabled, multiple: otherProps.multiple }
        )}
        style={style || getInputStyles({ disabled, ...this.state })}
        {...omit(otherProps, 'onBlur', 'onFocus', 'onMouseOut', 'onMouseOver')}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
      />
    );
  }
}

export default inputWrapper(Dropdown);
