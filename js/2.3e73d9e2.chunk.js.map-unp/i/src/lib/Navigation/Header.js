// NOTE: Soon to be deprecated
import React from 'react';
import PropTypes from 'prop-types';
import { i18next } from '../utils';
import { Logo } from '../Logo';
import Menu from './Menu';
import UserSettingsMenu from './UserSettingsMenu';
import MobileNav from './MobileNav';

class Header extends React.Component {
  static propTypes = {
    directions: PropTypes.arrayOf(PropTypes.shape()),
    onActiveMainMenu: PropTypes.func,
    onActiveSubMenu: PropTypes.func,
    onActiveSettingsMenu: PropTypes.func,
    user: PropTypes.shape({ name: PropTypes.string }),
  };

  static defaultProps = {
    directions: [],
    onActiveMainMenu: () => {},
    onActiveSubMenu: () => {},
    onActiveSettingsMenu: () => {},
    user: { name: '' },
  };

  constructor(props) {
    super(props);
    const mainMenuItems = this.getMainMenuItems(props.directions);
    const activeMainMenuItem = this.getActiveMenuItem(mainMenuItems);

    this.state = {
      mainMenuItems,
      activeMainMenuItem,
      isMobile: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkIfMobile);
    this.checkIfMobile();
  }

  componentDidUpdate() {
    const { directions } = this.props;
    const { activeMainMenuItem } = this.state;
    const newActiveMainMenuItem = this.getActiveMenuItem(
      this.getMainMenuItems(directions)
    );

    if (
      (newActiveMainMenuItem && newActiveMainMenuItem.name) !==
      (activeMainMenuItem && activeMainMenuItem.name)
    ) {
      this.setState({ activeMainMenuItem: newActiveMainMenuItem }); // eslint-disable-line react/no-did-update-set-state
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  onActiveMainMenu = activeItemName => {
    const { onActiveMainMenu } = this.props;
    this.setState({
      activeMainMenuItem: this.getMainMenuItemByName(activeItemName),
    });
    onActiveMainMenu(activeItemName);
  };

  onActiveSubMenu = activeItemName => {
    const { onActiveSubMenu } = this.props;
    onActiveSubMenu(activeItemName);
  };

  onActiveSettingsMenu = activeItemName => {
    const { onActiveSettingsMenu } = this.props;
    onActiveSettingsMenu(activeItemName);
  };

  getMainMenuItems = directions => {
    return directions.find(item => item.name === 'main-menu').children;
  };

  getMenuItemByName = (items, itemName) => {
    return items.find(item => item.name === itemName);
  };

  getActiveMenuItem = items => {
    if (!items || !items.length) {
      return null;
    }
    return items.find(item => item.isActive);
  };

  getMainMenuItemByName = itemName => {
    const { mainMenuItems } = this.state;
    return this.getMenuItemByName(mainMenuItems, itemName);
  };

  getSubMenuItemByName = itemName => {
    const { activeMainMenuItem } = this.state;
    return this.getMenuItemByName(activeMainMenuItem.children, itemName);
  };

  checkIfMobile = () => {
    const { isMobile } = this.state;
    const width = window.innerWidth;
    if (isMobile && width > 900) {
      this.setState({ isMobile: false });
    } else if (!isMobile && width < 900) {
      this.setState({ isMobile: true });
    }
  };

  renderTitleAndSubMenu = () => {
    const { activeMainMenuItem } = this.state;
    let subMenu;

    if (!activeMainMenuItem || !activeMainMenuItem.isActive) {
      return null;
    }

    const title = (
      <h1 id="header-title">
        {activeMainMenuItem.label
          ? i18next.t(activeMainMenuItem.label)
          : activeMainMenuItem.text}
      </h1>
    );

    if (activeMainMenuItem.children && activeMainMenuItem.children.length) {
      subMenu = (
        <Menu
          className="sub"
          items={activeMainMenuItem.children}
          branded
          onActive={this.onActiveSubMenu}
        />
      );
    }

    return (
      <div id="header-bottom">
        {title}
        {subMenu}
      </div>
    );
  };

  renderDesktopHeader = () => {
    const { directions, user } = this.props;
    const { mainMenuItems } = this.state;
    const helpLink = directions.find(item => item.name === 'help');
    return (
      <header id="header">
        <div id="header-top">
          <div>
            <div>
              <div id="header-logo">
                <Logo style={{ height: 34 }} />
              </div>
              <div id="header-main-menu">
                <Menu items={mainMenuItems} onActive={this.onActiveMainMenu} />
              </div>
              <UserSettingsMenu
                items={
                  directions.find(item => item.name === 'settings').children
                }
                user={user.name}
              />
              <div>
                <a
                  id="header-help-link"
                  href={helpLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {i18next.t(helpLink.label)}
                </a>
              </div>
            </div>
          </div>
        </div>
        {this.renderTitleAndSubMenu()}
      </header>
    );
  };

  render() {
    const { isMobile } = this.state;
    const { user, directions } = this.props;
    return isMobile ? (
      <MobileNav
        helpLink={directions[2]}
        mainMenuItems={directions[0].children}
        settingsItems={directions[1]}
        user={user.name}
      />
    ) : (
      this.renderDesktopHeader()
    );
  }
}

export default Header;
