import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ color, label, showValue, value }) => {
  const colorDictionary = {
    blue: '#053caf',
    gray: '#999999',
    green: '#35af28',
    orange: '#ff7800',
    red: '#e03400',
    yellow: '#fbc123',
  };

  let normalizedValue = value < 0 ? 0 : value;
  normalizedValue = normalizedValue > 100 ? 100 : normalizedValue;

  return (
    <div className="tau-progress-bar">
      {(showValue || label) && (
        <div className="text">
          {showValue && <span>{`${normalizedValue}%`}</span>}
          {label && (
            <span
              style={{
                maxWidth: `${showValue ? '60%' : '100%'}`,
                textAlign: `${showValue ? 'right' : 'left'}`,
              }}
            >
              {label}
            </span>
          )}
        </div>
      )}
      <div className="bar">
        <div
          className="filler"
          style={{
            backgroundColor: colorDictionary[color],
            width: `${normalizedValue}%`,
          }}
        >
          <div />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  color: PropTypes.oneOf(['blue', 'gray', 'green', 'orange', 'red', 'yellow']),
  label: PropTypes.string,
  showValue: PropTypes.bool,
  value: PropTypes.number.isRequired,
};

ProgressBar.defaultProps = {
  color: 'gray',
  label: '',
  showValue: true,
};

export default ProgressBar;
