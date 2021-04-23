/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { isArray } from 'lodash';
import { cx } from '../utils';

class FieldErrorMap extends React.Component {
  static propTypes = {
    code: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    children: PropTypes.any,
  };

  static defaultProps = {
    className: null,
    code: null,
    children: null,
  };

  findContent = code => {
    if (isArray(code)) {
      code = code[0];
    }
    let content = null;
    React.Children.forEach(this.props.children, child => {
      if (!child.key) {
        if (code === null) {
          content = child;
        }
        return false;
      }
      const key = child.key.replace('.$', '');
      if (code === key) {
        content = child;
        return false;
      }
      return true;
    });
    return content;
  };

  renderContent = () => {
    const { code } = this.props;
    const content = this.findContent(code);
    if (content) {
      return content;
    }
    const defaultContent = this.findContent(null);
    if (defaultContent) {
      return defaultContent;
    }
    throw new Error(
      "No default error message found. Please specify one without the 'key' prop to act as the catch-all message."
    );
  };

  render() {
    const { className } = this.props;
    return (
      <div className={cx('tau-field-error', className)}>
        {this.renderContent()}
      </div>
    );
  }
}

export default FieldErrorMap;
