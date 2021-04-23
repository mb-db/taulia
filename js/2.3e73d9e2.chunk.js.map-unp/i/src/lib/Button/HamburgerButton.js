import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';
import Button from './Button';

function HamburgerButton({ onClick, open }) {
  return (
    <Button
      className={cx('hamburger-button', open && 'open')}
      data-testid="hamburger-button"
      onClick={onClick}
      theme="none"
    >
      <span />
      <span />
      <span />
      <span />
    </Button>
  );
}

HamburgerButton.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
};

HamburgerButton.defaultProps = {
  onClick: () => null,
  open: false,
};

export default HamburgerButton;
