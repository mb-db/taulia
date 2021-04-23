import React from 'react';
import PropTypes from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Branding } from '../Branding';
import { i18next } from '../utils';

function MenuItem({
  branded,
  children,
  isActive,
  isLocal,
  label,
  name,
  onActive,
  path,
  text,
  url,
}) {
  const createLink = () => {
    let content;
    const itemLabel = label ? i18next.t(label) : text;

    const props = {
      onClick: () => {
        onActive(name);
        document.activeElement.blur();
      },
      className: 'content',
    };

    // Create local link for the app.
    if (isLocal) {
      content = (
        <ReactRouterLink to={path} {...props}>
          {itemLabel}
        </ReactRouterLink>
      );

      // Create external link.
    } else if (url) {
      content = (
        <a href={url} {...props}>
          {itemLabel}
        </a>
      );

      // Will call callback `onActive` when clicked.
    } else {
      content = <a {...props}>{itemLabel}</a>;
    }
    return content;
  };

  const itemClassName = [
    'menu-item',
    isActive ? 'active' : null,
    children && children.length ? 'parent' : null,
  ].join(' ');

  const itemStyle = !(isActive && branded)
    ? null
    : {
        color: Branding.fetchColor('primary').hexString(),
        borderColor: Branding.fetchColor('primary').hexString(),
      };

  return (
    <li className={itemClassName} id={`menu-item-${name}`} style={itemStyle}>
      <span className="content-wrapper">{createLink()}</span>
    </li>
  );
}

MenuItem.defaultProps = {
  branded: false,
  children: {},
  isActive: false,
  isLocal: false,
  label: '',
  name: '',
  onActive: () => null,
  path: '',
  text: '',
  url: '',
};

MenuItem.propTypes = {
  branded: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isActive: PropTypes.bool,
  isLocal: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onActive: PropTypes.func,
  path: PropTypes.string,
  text: PropTypes.string,
  url: PropTypes.string,
};

export default MenuItem;
