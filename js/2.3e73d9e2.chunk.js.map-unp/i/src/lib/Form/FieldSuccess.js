/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { cx } from '../utils';

class FieldSuccess extends React.Component {
  static defaultProps = {};

  render() {
    const { className, children } = this.props;
    return <div className={cx('tau-field-success', className)}>{children}</div>;
  }
}

export default FieldSuccess;
