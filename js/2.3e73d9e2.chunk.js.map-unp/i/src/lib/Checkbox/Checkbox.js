/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { omit } from 'lodash';
import { cx } from '../utils';
import { Branding } from '../Branding';
import inputWrapper from '../inputWrapper';

function getInputStyles({ disabled, hover, focus, active, checked }) {
  if (disabled) {
    return null;
  }
  const primary = Branding.fetchColor('primary').hexString();
  const primaryLighter = Branding.fetchColor('primary')
    .lighten(0.3)
    .clearer(0.5)
    .rgbaString();
  if (active) {
    return {
      borderColor: primary,
      backgroundColor: primaryLighter,
    };
  }
  if (checked) {
    return {
      borderColor: primary,
      backgroundColor: primary,
    };
  }
  if (hover || focus) {
    return {
      borderColor: primary,
      backgroundColor: '#ffffff',
    };
  }
  return null;
}

class Checkbox extends React.Component {
  static defaultProps = {
    inline: false,
  };

  constructor() {
    super();
    this.ref = React.createRef();
    this.state = {
      hover: false,
      focus: false,
      active: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    const { onChange } = this.props;
    if (this.ref.current.contains(e.target) && e.keyCode === 13 && onChange) {
      onChange(e);
    }
  };

  onBlur = e => {
    const { onBlur } = this.props;
    e.persist();
    this.setState({ focus: false }, () => onBlur(e));
  };

  onFocus = e => {
    const { onFocus } = this.props;
    e.persist();
    this.setState({ focus: true }, () => onFocus(e));
  };

  onMouseDown = e => {
    const { onMouseDown } = this.props;
    e.persist();
    this.setState({ active: true }, () => onMouseDown(e));
  };

  onMouseOut = e => {
    const { onMouseOut } = this.props;
    e.persist();
    this.setState({ hover: false }, () => onMouseOut(e));
  };

  onMouseOver = e => {
    const { onMouseOver } = this.props;
    e.persist();
    this.setState({ hover: true }, () => onMouseOver(e));
  };

  onMouseUp = e => {
    const { onMouseUp } = this.props;
    e.persist();
    this.setState({ active: false }, () => onMouseUp(e));
  };

  onChange = e => {
    const { disabled, onChange } = this.props;
    if (disabled) return;
    e.persist();
    onChange(e);
  };

  getIconStyles = ({ disabled, active }) => {
    if (disabled) {
      return null;
    }
    if (active) {
      return {
        color: 'transparent',
      };
    }
    return null;
  };

  render() {
    const {
      checked,
      children,
      className,
      defaultChecked,
      disabled,
      inline,
      validationState,
      ...otherProps
    } = this.props;
    const isChecked = checked || defaultChecked;
    return (
      <label
        className={cx(
          'tau-checkbox',
          className,
          validationState ? `has-${validationState}` : null,
          { inline, checked: isChecked, disabled }
        )}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onMouseDown={this.onMouseDown}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        onMouseUp={this.onMouseUp}
        ref={this.ref}
      >
        <input
          type="checkbox"
          checked={checked}
          data-testid="checkbox"
          defaultChecked={defaultChecked}
          {...omit(
            otherProps,
            'onBlur',
            'onChange',
            'onFocus',
            'onMouseDown',
            'onMouseOut',
            'onMouseOver',
            'onMouseUp'
          )}
          onChange={this.onChange}
        />
        <span
          className="input"
          style={getInputStyles({
            disabled: disabled || validationState !== null,
            ...this.state,
            checked: isChecked,
          })}
        >
          <span
            className="icon"
            style={this.getIconStyles({
              disabled: disabled || validationState !== null,
              ...this.state,
              checked: isChecked,
            })}
          >
            ✓
          </span>
        </span>
        <span className="text">{children}</span>
      </label>
    );
  }
}

const wrapper = inputWrapper(Checkbox);

export { wrapper as Checkbox, getInputStyles };
