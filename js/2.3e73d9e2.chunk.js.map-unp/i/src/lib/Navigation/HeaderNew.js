import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MobileNav from './MobileNav';
import SideNav from './SideNav';
import { useMediaQuery } from '../utils';

const Header = ({ pathname, mainMenuItems, ...props }) => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const [openGroup, setOpenGroup] = useState('');
  const [filteredNavItems, setFilteredNavItems] = useState([]);

  useEffect(() => {
    // Only check 2 levels deep on the url e.g. /suppliers/search/1 would match /suppliers/search
    const truncatedPath = pathname
      .split('/')
      .slice(0, 3)
      .join('/');

    // Compare the path against the children of the main menu items to see what to highlight (`isActive`) and what section to open
    const mainMenuItemsCopy = [...mainMenuItems];
    for (let i = 0; i < mainMenuItemsCopy.length; i += 1) {
      const parentItem = mainMenuItemsCopy[i];
      if (parentItem.children.length) {
        for (let j = 0; j < parentItem.children.length; j += 1) {
          if (parentItem.children[j].path === truncatedPath) {
            parentItem.children[j].isActive = true;
            parentItem.isActive = true;
            setOpenGroup(parentItem.name);
            break;
          }
        }
        // Check if flat main menu items (no children) match url
      } else if (parentItem.path === truncatedPath) {
        parentItem.isActive = true;
        break;
      }
    }
    setFilteredNavItems(mainMenuItemsCopy);
  }, [pathname]);

  return isMobile ? (
    <MobileNav mainMenuItems={filteredNavItems} {...props} />
  ) : (
    <SideNav
      mainMenuItems={filteredNavItems}
      initialOpenGroup={openGroup}
      {...props}
    />
  );
};

Header.defaultProps = {
  pathname: '',
};

Header.propTypes = {
  mainMenuItems: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  pathname: PropTypes.string,
};

export default Header;
