/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import PropTypes from 'prop-types';
import React from 'react';
import { Branding } from '../Branding';

class Heading extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  };

  static defaultProps = {
    type: 'h1',
  };

  render() {
    const { className, type, children, style, ...otherProps } = this.props;
    const styles = {
      ...style,
      color: Branding.fetchColor('primary').hexString(),
    };
    return React.createElement(
      type,
      { className, style: styles, ...otherProps },
      children
    );
  }
}

export default Heading;
