/* eslint-disable jsx-a11y/role-supports-aria-props */

import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import { cx } from '../utils';
import Button from '../Button/Button';

function ButtonMenu({ options, children, className, ...otherProps }) {
  const [open, setOpen] = useState(false);
  const node = useRef();

  const handleClick = e => {
    // Close menu if clicking outside of the component
    if (!node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={node}
      className={cx('buttonMenu', className, open && 'open')}
      {...otherProps}
    >
      <Button
        theme="none"
        data-testid="button-menu-opener"
        onClick={() => setOpen(!open)}
        className="button"
      >
        {children}
      </Button>
      <ul
        data-testid="button-menu-dropdown"
        aria-expanded={open}
        className="options"
      >
        {options.map(option => (
          <li key={option.label}>
            <Button
              onClick={() => {
                setOpen(false);
                option.onClick();
              }}
              theme="none"
            >
              {option.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

ButtonMenu.defaultProps = {
  children: null,
  className: '',
};

ButtonMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ButtonMenu;
