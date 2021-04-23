import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';

function FieldLabel({
  className,
  children,
  htmlFor,
  required,
  validationState,
  ...otherProps
}) {
  const cls = cx(
    'tau-field-label',
    className,
    validationState ? `has-${validationState}` : null,
    { required }
  );
  return (
    <label htmlFor={htmlFor} className={cls} {...otherProps}>
      {children}
    </label>
  );
}

FieldLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  htmlFor: PropTypes.string.isRequired,
  required: PropTypes.bool,
  validationState: PropTypes.oneOf(['error', 'success']),
};

FieldLabel.defaultProps = {
  children: null,
  className: null,
  required: true,
  validationState: null,
};

export default FieldLabel;
