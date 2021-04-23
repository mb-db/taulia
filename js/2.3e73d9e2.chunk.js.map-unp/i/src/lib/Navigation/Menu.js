import PropTypes from 'prop-types';
import React from 'react';
import MenuItem from './MenuItem';

const Menu = ({ branded, className, items, onActive }) => {
  const navClassName = [
    'navigation-menu',
    className,
    branded ? 'branded' : undefined,
  ].join(' ');

  return (
    <nav className={navClassName}>
      <ul className="menu-wrapper">
        {items.map(item => {
          return (
            <MenuItem
              {...item}
              branded={branded}
              isActive={item.isActive}
              key={item.name}
              onActive={onActive}
            />
          );
        })}
      </ul>
    </nav>
  );
};

Menu.propTypes = {
  branded: PropTypes.bool,
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape()),
  onActive: PropTypes.func,
};

Menu.defaultProps = {
  branded: false,
  className: null,
  items: [],
  onActive: () => {},
};

export default Menu;
