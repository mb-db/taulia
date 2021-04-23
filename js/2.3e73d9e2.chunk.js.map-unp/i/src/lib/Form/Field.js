/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';
import { INPUT_WRAPPER_COMPONENT_SECRET } from '../inputWrapper';
import FieldLabel from './FieldLabel';
import FieldError from './FieldError';
import FieldErrorMap from './FieldErrorMap';
import FieldSuccess from './FieldSuccess';
import FieldGroup from './FieldGroup';

class Field extends React.Component {
  static propTypes = {
    validationState: PropTypes.oneOf(['error', 'success']),
  };

  static defaultProps = {
    validationState: null,
  };

  checkChild = child => {
    return (
      child &&
      child.type &&
      child.type.displayName &&
      (child.type === FieldLabel ||
        child.type === FieldGroup ||
        (child.type.displayName.indexOf('InputWrapper') > -1 &&
          child.type.secret === INPUT_WRAPPER_COMPONENT_SECRET))
    );
  };

  renderChildren = children => {
    const { validationState } = this.props;
    return React.Children.map(children, child => {
      if (!child) {
        return null;
      }
      if (this.checkChild(child)) {
        return React.cloneElement(child, {
          validationState,
        });
      }
      if (child.type === FieldError || child.type === FieldErrorMap) {
        if (validationState === 'error') {
          return child;
        }
        return null;
      }
      if (child.type === FieldSuccess) {
        if (validationState === 'success') {
          return child;
        }
        return null;
      }
      if (child.props && child.props.children) {
        return React.cloneElement(child, {
          children: this.renderChildren(child.props.children),
        });
      }
      return child;
    });
  };

  render() {
    const { className, children, validationState, ...otherProps } = this.props;
    return (
      <div
        className={cx(
          'tau-field',
          className,
          validationState ? `has-${validationState}` : null
        )}
        {...otherProps}
      >
        {this.renderChildren(children)}
      </div>
    );
  }
}

export default Field;
