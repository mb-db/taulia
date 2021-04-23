// NOTE: This component is deprecated
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import MenuItem from './MenuItem';
import { Popup } from '../Popup';

class MenuPopup extends React.Component {
  static defaultProps = {
    // Callback when menu item is selected
    onActive: () => {},
    onClose: () => {},
    onOpen: () => {},
    items: [],
    className: null,
    branded: false,
    // Reset to initial state on when closed.
    resetOnClose: true,
    // Close menu when item is selected.
    closeOnActive: true,
    maxWidth: null,
    maxHeight: null,
    arrow: true,
    padded: false,
  };

  constructor(props) {
    super(props);
    const levels = [];

    levels.push({
      items: props.items,
      activeItem: props.items.find(item => item.isActive),
    });

    this.state = {
      levels,
    };
  }

  onActive = activeItemName => {
    let nextLevel;
    const currentLevel = this.getLevel();
    const activeItem = this.getActiveItemByName(
      currentLevel.items,
      activeItemName
    );
    const haveChildren = activeItem.children && activeItem.children.length;

    currentLevel.activeItem = activeItem;

    if (haveChildren) {
      nextLevel = {
        items: activeItem.children,
        activeItem: this.getActiveItem(activeItem.children),
      };

      this.state.levels.push(nextLevel);
    } else if (this.props.closeOnActive) {
      this.popup.close();
    }

    this.setState({
      levels: this.state.levels,
    });

    this.props.onActive(activeItemName);

    this.popup.updatePopper();
  };

  onClose = () => {
    if (this.props.resetOnClose) {
      this.goToLevel(1);
    }

    this.props.onClose();
  };

  onOpen = () => {
    this.props.onOpen();
  };

  getActiveItem = items => {
    return items.find(item => item.isActive);
  };

  getActiveItemByName = (items, name) => {
    return items.find(item => item.name === name);
  };

  getLevel = start => {
    let end;
    const levelsCount = this.state.levels.length;

    // Last/current level.
    if (start === undefined) {
      start = -1;
      // Return level from beginning, zero based.
    } else if (start > -1) {
      end = start + 1;
      // Return level from the end.
    }

    if (end === undefined) {
      end = levelsCount + start + 1;
    }

    if (
      (start > 0 && start > levelsCount) ||
      (start < 0 && end > levelsCount)
    ) {
      return null;
    }

    return this.state.levels.slice(start, end)[0];
  };

  setActivator = (...args) => {
    this.popup.setActivator(...args);
  };

  goBack = () => {
    this.goToLevel(-1);
  };

  /*
   * Positive index to count levels from start of array.
   * Negative index to count levels from end of array.
   * To go one level back index is `-1`.
   * To go to beginning index is `1`.
   * */
  goToLevel = index => {
    this.state.levels.splice(index);

    const currentLevel = this.getLevel();

    currentLevel.activeItem = null;

    this.setState({ levels: this.state.levels });

    this.popup.updatePopper();
  };

  renderItems = () => {
    const currentLevel = this.getLevel();
    const parentLevel = this.getLevel(-2);
    const menuWrapperProps = {};
    let backLink;
    let backItem;

    if (parentLevel) {
      backItem = {
        name: `go-back-to-${parentLevel.activeItem.name}`,
        label: 'navigation.popup.back',
        key: 'go-back',
        onActive: this.goBack,
      };
      backLink = (
        <ul className="menu-wrapper back-link-wrapper">
          <MenuItem {...backItem} />
        </ul>
      );
    }

    if (this.props.maxHeight || this.props.maxWidth) {
      menuWrapperProps.style = {
        maxWidth: this.props.maxWidth,
        maxHeight: this.props.maxHeight,
      };
    }

    return (
      <nav className="navigation">
        {backLink}
        <ul className="menu-wrapper" {...menuWrapperProps}>
          {currentLevel.items.map(item => {
            const isActiveItem =
              currentLevel.activeItem &&
              currentLevel.activeItem.name === item.name;
            return (
              <MenuItem
                {...item}
                key={item.name}
                isActive={isActiveItem}
                onActive={this.onActive}
                branded={this.props.branded}
              />
            );
          })}
        </ul>
      </nav>
    );
  };

  render() {
    const className = [
      this.props.className,
      this.props.branded ? 'branded' : undefined,
      'navigation-menu-popup',
    ].join(' ');

    return (
      <Popup
        ref={popup => {
          this.popup = popup;
        }}
        {...this.props}
        className={className}
      >
        {this.renderItems(this.state.items)}
      </Popup>
    );
  }
}

export default MenuPopup;
