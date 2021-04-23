/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';
import { Branding } from '../Branding';

export const THEMES = ['danger', 'warn', 'success', 'info', 'primary'];

class Alert extends React.Component {
  static propTypes = {
    theme: PropTypes.oneOf(THEMES),
    inline: PropTypes.bool,
  };

  static defaultProps = {
    theme: 'primary',
    inline: false,
  };

  getStyles = () => {
    const { theme, style } = this.props;
    if (theme === 'primary') {
      const primary = Branding.fetchColor('primary').hexString();
      return {
        ...style,
        backgroundColor: primary,
        borderColor: primary,
        color: '#ffffff',
      };
    }
    return style;
  };

  render() {
    const { className, children, theme, inline, ...otherProps } = this.props;
    return (
      <div
        className={cx('tau-alert', `theme-${theme}`, className, { inline })}
        style={this.getStyles()}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
}

export default Alert;
