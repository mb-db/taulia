import React from 'react';
import PropTypes from 'prop-types';

const StatusIndicator = ({ children, color }) => {
  const dotHex = {
    blue: '#4c8ff6',
    green: '#35af28',
    red: '#e03400',
    yellow: '#fbc123',
    gray: '#dcdedf',
  };

  const circleStyle = {
    backgroundColor: dotHex[color],
    borderRadius: '50%',
    display: 'inline-block',
    height: '10px',
    marginRight: '5px',
    width: '10px',
  };

  return (
    <>
      <div style={circleStyle} />
      {children}
    </>
  );
};

StatusIndicator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.oneOf(['blue', 'gray', 'green', 'red', 'yellow']),
};

StatusIndicator.defaultProps = {
  children: null,
  color: 'gray',
};

export default StatusIndicator;
