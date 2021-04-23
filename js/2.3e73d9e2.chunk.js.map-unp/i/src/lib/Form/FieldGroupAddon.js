/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/prop-types */
import React from 'react';
import { cx } from '../utils';

class FieldGroupAddon extends React.Component {
  static defaultProps = {
    validationState: null,
  };

  render() {
    const { className, children, validationState, style } = this.props;
    return (
      <div
        className={cx(
          'tau-field-group-addon',
          className,
          validationState ? `has-${validationState}` : null
        )}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default FieldGroupAddon;
