/* eslint-disable react/prop-types */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/prefer-stateless-function */
import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'lodash';
import { cx } from './utils';

export const INPUT_WRAPPER_COMPONENT_SECRET = Symbol('INPUT_WRAPPER_SECRET');

const inputWrapper = Child =>
  class extends React.Component {
    static displayName = `${Child.displayName}InputWrapper`;

    static propTypes = {
      disabled: PropTypes.bool,
      inline: PropTypes.bool,
      onChange: PropTypes.func,
      validationState: PropTypes.oneOf(['error', 'success']),
    };

    static defaultProps = {
      disabled: false,
      inline: false,
      onChange: null,
      onBlur: noop,
      onFocus: noop,
      onMouseDown: noop,
      onMouseOut: noop,
      onMouseOver: noop,
      onMouseUp: noop,
      validationState: null,
    };

    render() {
      const { className, ...otherProps } = this.props;
      return (
        <Child
          className={cx('tau-input', className, {
            disabled: otherProps.disabled,
          })}
          {...otherProps}
        />
      );
    }
  };

export default inputWrapper;
