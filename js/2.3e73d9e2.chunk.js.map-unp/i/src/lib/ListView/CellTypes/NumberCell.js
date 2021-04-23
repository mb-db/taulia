import React from 'react';
import PropTypes from 'prop-types';
import { Localization } from '../../Localization';

const NumberCell = ({ value }) => {
  if (value === null || value === undefined) return <span>—</span>;
  const locale = Localization.getLocale();
  const formatted = Number(value).toLocaleString(locale);
  return <span title={formatted}>{formatted}</span>;
};

NumberCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NumberCell.defaultProps = {
  value: null,
};

export default NumberCell;
