import PropTypes from 'prop-types';
import React from 'react';
import { Branding, DEFAULT_LOGO_IMAGE } from '../Branding';
import { cx } from '../utils';

const Logo = ({
  className,
  includeLink,
  showDefault,
  style,
  ...otherProps
}) => {
  const logo = showDefault
    ? Branding.parseImage('logo', DEFAULT_LOGO_IMAGE)
    : Branding.fetchImage('logo');
  const backgroundStyle = {
    backgroundImage: `url(${logo})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
  };
  const styles = {
    display: 'block',
    width: 171,
    height: 60,
    ...style,
  };
  return (
    <div className={cx('tau-logo', className)} style={styles} {...otherProps}>
      {includeLink ? (
        <a href="/" alt="Home">
          <div style={{ width: '100%', height: '100%', ...backgroundStyle }} />
        </a>
      ) : (
        <div style={{ width: '100%', height: '100%', ...backgroundStyle }} />
      )}
    </div>
  );
};

Logo.propTypes = {
  className: PropTypes.string,
  includeLink: PropTypes.bool,
  showDefault: PropTypes.bool,
  style: PropTypes.shape(),
};

Logo.defaultProps = {
  className: '',
  includeLink: true,
  showDefault: false,
  style: {},
};

export default Logo;
