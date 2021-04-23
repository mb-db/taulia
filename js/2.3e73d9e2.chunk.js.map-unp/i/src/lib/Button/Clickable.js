import React from 'react';
import PropTypes from 'prop-types';

function Clickable({ className, children, onClick, ...otherProps }) {
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      onClick();
    }
  };
  return (
    <div
      className={`clickable ${className}`}
      onClick={() => {
        document.activeElement.blur();
        onClick();
      }}
      onKeyPress={onKeyPress}
      role="button"
      tabIndex="0"
      {...otherProps}
    >
      {children}
    </div>
  );
}

Clickable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Clickable.defaultProps = {
  children: [],
  className: '',
};

export default Clickable;
