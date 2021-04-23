import React from 'react';
import PropTypes from 'prop-types';

const TextCell = ({ value }) => (
  <span title={value && String(value)}>{value ? String(value) : '—'}</span>
);

TextCell.propTypes = {
  value: PropTypes.string,
};

TextCell.defaultProps = {
  value: '',
};

export default TextCell;
