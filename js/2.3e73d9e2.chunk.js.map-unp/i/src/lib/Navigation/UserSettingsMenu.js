/* eslint-disable jsx-a11y/role-supports-aria-props */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';
import { Clickable } from '../Button';
import { cx } from '../utils';
import UserIcon from '../../icons/UserIcon';

function UserSettingsMenu({ items, user }) {
  const [open, setOpen] = useState(false);
  const node = useRef();

  const handleClick = e => {
    // Close menu if clicking outside of the component
    if (!node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={node} className={cx(open && 'open')}>
      <Clickable
        data-testid="user-settings-menu-button"
        className="user-settings-menu-button"
        onClick={() => setOpen(!open)}
      >
        <UserIcon className="user-settings-menu-button-icon" />
        <span className="user-settings-menu-button-name">{user}</span>
      </Clickable>
      <ul
        aria-expanded={open}
        className="user-settings-dropdown"
        data-testid="user-settings-dropdown"
      >
        {items.map(item => {
          return (
            <MenuItem
              {...item}
              key={item.name}
              onActive={() => setOpen(false)}
            />
          );
        })}
      </ul>
    </div>
  );
}

UserSettingsMenu.defaultProps = {
  items: [],
  user: '',
};

UserSettingsMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape()),
  user: PropTypes.string,
};

export default UserSettingsMenu;
