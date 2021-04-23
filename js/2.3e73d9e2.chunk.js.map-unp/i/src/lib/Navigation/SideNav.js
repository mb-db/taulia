import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Clickable } from '../Button';
import { cx, i18next } from '../utils';
import { Logo } from '../Logo';

const SideNav = ({
  initialOpenGroup,
  logoText,
  mainMenuItems,
  settingsItems,
  user,
}) => {
  const [openGroup, setOpenGroup] = useState('');

  const logoStyles = { height: 20, width: 110 };

  useEffect(() => {
    setOpenGroup(initialOpenGroup);
  }, [initialOpenGroup]);

  const getLabel = item => (item.label ? i18next.t(item.label) : item.text);

  const navLink = item => {
    const label = getLabel(item);
    return (
      <li
        className={item.isActive ? 'selected' : ''}
        data-testid={`${label}-${item.isActive ? 'selected' : 'unselected'}`}
        key={item.name}
      >
        {item?.path?.indexOf('http') === 0 ? (
          <a href={item.path}>{label}</a>
        ) : (
          <ReactRouterLink
            onClick={() => document.activeElement.blur()}
            to={item.path}
          >
            {label}
          </ReactRouterLink>
        )}
      </li>
    );
  };

  return (
    <nav className="side-nav">
      <section className="logo-container">
        <Logo includeLink={false} style={logoStyles} />
        {logoText && <span>{logoText}</span>}
      </section>
      <ul>
        {mainMenuItems.map(menuItem => {
          const canOpen = menuItem.children?.length;

          /* Menu item without children */
          if (!canOpen) {
            return navLink(menuItem);
          }

          /* Menu item with children */
          const isOpen = openGroup === menuItem.name;
          const className = cx(
            menuItem.isActive && 'selected',
            isOpen && 'open',
            'can-open'
          );
          const menuItemLabel = getLabel(menuItem);

          return (
            <li className={className} key={menuItem.name}>
              <Clickable
                data-testid={`menu-item-${menuItem.name}`}
                onClick={() => setOpenGroup(isOpen ? '' : menuItem.name)}
              >
                {menuItemLabel}
              </Clickable>
              <ul
                data-testid={`${menuItemLabel}-${isOpen ? 'opened' : 'closed'}`}
                className={isOpen ? 'open' : ''}
              >
                {menuItem.children.map(subNavItem => navLink(subNavItem))}
              </ul>
            </li>
          );
        })}
      </ul>
      {/* TODO: add user section to bottom, styling TBD */}
      {settingsItems && <p style={{ marginTop: '20px' }}>{user}</p>}
    </nav>
  );
};

SideNav.defaultProps = {
  logoText: '',
  initialOpenGroup: '',
  settingsItems: null,
  user: '',
};

SideNav.propTypes = {
  logoText: PropTypes.string,
  initialOpenGroup: PropTypes.string,
  mainMenuItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settingsItems: PropTypes.shape(),
  user: PropTypes.string,
};

export default SideNav;
