/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';

class FieldError extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  };

  static defaultProps = {
    className: null,
    children: null,
  };

  render() {
    const { className, children } = this.props;
    return <div className={cx('tau-field-error', className)}>{children}</div>;
  }
}

export default FieldError;
