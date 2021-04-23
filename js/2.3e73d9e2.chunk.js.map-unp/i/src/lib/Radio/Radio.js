/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import { getInputStyles } from '../Checkbox';
import inputWrapper from '../inputWrapper';
import { cx } from '../utils';

class Radio extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    disabled: PropTypes.bool,
    inline: PropTypes.bool,
    onChange: PropTypes.func,
    validationState: PropTypes.oneOf(['error', 'success']),
  };

  static defaultProps = {
    checked: false,
    children: null,
    disabled: false,
    inline: false,
    onChange: null,
    validationState: null,
  };

  state = {
    hover: false,
    focus: false,
    active: false,
  };

  onBlur = () => this.setState({ focus: false });

  onFocus = () => this.setState({ focus: true });

  onMouseDown = () => this.setState({ active: true });

  onMouseOut = () => this.setState({ hover: false });

  onMouseOver = () => this.setState({ hover: true });

  onMouseUp = () => this.setState({ active: false });

  render() {
    const { checked, children, disabled, inline, validationState } = this.props;
    const style = getInputStyles({
      disabled: disabled || validationState !== null,
      ...this.state,
      checked,
    });
    return (
      <label
        className={cx(
          'tau-radio',
          'tau-input',
          validationState ? `has-${validationState}` : null,
          { inline, checked, disabled }
        )}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onMouseDown={this.onMouseDown}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        onMouseUp={this.onMouseUp}
      >
        <input
          type="radio"
          {...omit(
            this.props,
            'children',
            'inline',
            'onBlur',
            'onFocus',
            'onMouseDown',
            'onMouseOut',
            'onMouseOver',
            'onMouseUp',
            'validationState'
          )}
        />
        <span
          className="input"
          style={
            style && style.borderColor
              ? { borderColor: style.borderColor }
              : null
          }
        >
          <span className="icon" style={style} />
        </span>
        <span className="text">{children}</span>
      </label>
    );
  }
}

export default inputWrapper(Radio);
