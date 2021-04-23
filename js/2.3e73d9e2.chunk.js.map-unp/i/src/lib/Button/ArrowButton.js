import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

function ArrowButton({ className, children, direction, style, ...otherProps }) {
  const directionMap = {
    left: 180,
    down: 90,
    right: 0,
    up: -90,
  };
  const rotateStyle = {
    ...style,
    transform: `rotate(${directionMap[direction]}deg)`,
  };
  return (
    <Button
      className={`arrow ${className}`}
      data-testid={`${direction}-arrow-button`}
      style={rotateStyle}
      {...otherProps}
    >
      {children}
    </Button>
  );
}

ArrowButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  direction: PropTypes.string,
  style: PropTypes.shape(),
};

ArrowButton.defaultProps = {
  children: [],
  direction: 'down',
  className: '',
  style: {},
};

export default ArrowButton;
