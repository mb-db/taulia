/* eslint-disable react/prop-types */
import React from 'react';
import { cx } from '../utils';
import { INPUT_WRAPPER_COMPONENT_SECRET } from '../inputWrapper';
import FieldGroupAddon from './FieldGroupAddon';

class FieldGroup extends React.Component {
  static defaultProps = {
    inline: false,
    validationState: null,
  };

  render() {
    const {
      className,
      children,
      validationState,
      inline,
      ...otherProps
    } = this.props;
    return (
      <div
        className={cx(
          'tau-field-group',
          className,
          validationState ? `has-${validationState}` : null,
          { inline }
        )}
        {...otherProps}
      >
        {React.Children.map(children, child => {
          if (!child) {
            return null;
          }
          if (
            child.type === FieldGroupAddon ||
            (child.type.displayName.indexOf('InputWrapper') > -1 &&
              child.type.secret === INPUT_WRAPPER_COMPONENT_SECRET)
          ) {
            return React.cloneElement(child, {
              validationState,
            });
          }
          return child;
        })}
      </div>
    );
  }
}

export default FieldGroup;
