import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Clickable, HamburgerButton } from '../Button';
import { Logo } from '../Logo';
import { i18next } from '../utils';

const MobileNav = ({
  helpLink,
  mainMenuItems,
  settingsItems,
  pathname,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  let logOut = { url: '/logout', label: 'Log out' };
  let allMenuItems = mainMenuItems;
  if (settingsItems) {
    const filteredSettingsItems = { ...settingsItems };
    filteredSettingsItems.children = filteredSettingsItems.children?.filter(
      item => !item.name.includes('logout')
    );
    logOut = settingsItems.children.find(item => item.name.includes('logout'));
    allMenuItems = [...mainMenuItems, filteredSettingsItems];
  }

  return (
    <nav className={`mobile-nav ${open ? 'open' : ''}`}>
      <section className="top-nav-header">
        <HamburgerButton onClick={() => setOpen(!open)} open={open} />
        {open ? (
          <span className="user-info">{user}</span>
        ) : (
          <>
            <Logo />
            <a
              href={helpLink.url}
              data-testid="help-link"
              rel="noopener noreferrer"
              target="_blank"
            >
              {i18next.t(helpLink.label)}
            </a>
          </>
        )}
      </section>
      <section className="link-container">
        <ul>
          <li className={pathname === '/home' ? 'selected' : ''}>
            <ReactRouterLink onClick={() => setOpen(false)} to="/home">
              {i18next.t('app.dashboard')}
            </ReactRouterLink>
          </li>
          {allMenuItems.map(menuItem => {
            const isOpen = selectedItem === menuItem.name;
            const className = `${menuItem.isActive ? 'selected' : ''} ${
              isOpen ? 'open' : ''
            }`;
            return (
              <li className={className} key={menuItem.name}>
                <Clickable
                  data-testid={`menu-item-${menuItem.name}`}
                  onClick={() =>
                    setSelectedItem(
                      selectedItem === menuItem.name ? '' : menuItem.name
                    )
                  }
                >
                  {menuItem.label ? i18next.t(menuItem.label) : menuItem.text}
                  <ul className={isOpen ? 'open' : ''}>
                    {menuItem.children &&
                      menuItem.children.map(subNavItem => {
                        const label = subNavItem.label
                          ? i18next.t(subNavItem.label)
                          : subNavItem.text;
                        return (
                          <li
                            data-testid={`menu-item-${subNavItem.name}`}
                            className={subNavItem.isActive ? 'selected' : ''}
                            key={subNavItem.name}
                          >
                            <ReactRouterLink
                              onClick={() => setOpen(false)}
                              to={subNavItem.path}
                            >
                              {label}
                            </ReactRouterLink>
                          </li>
                        );
                      })}
                  </ul>
                </Clickable>
              </li>
            );
          })}
        </ul>
        <ul>
          <li>
            <a
              data-testid="log-out"
              href={logOut.url}
              onClick={() => setOpen(false)}
            >
              {i18next.t(logOut.label)}
            </a>
          </li>
        </ul>
      </section>
    </nav>
  );
};

MobileNav.defaultProps = {
  helpLink: {
    label: 'Help',
    url: 'http://customersupport.taulia.com/',
  },
  pathname: '',
  settingsItems: null,
  user: 'Bill',
};

MobileNav.propTypes = {
  helpLink: PropTypes.shape({
    label: PropTypes.string,
    url: PropTypes.string,
  }),
  mainMenuItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pathname: PropTypes.string,
  settingsItems: PropTypes.shape(),
  user: PropTypes.string,
};

export default MobileNav;
