import React from 'react';
import PropTypes from 'prop-types';
import { Localization } from '../../Localization';

const MoneyCell = ({ value, column }) => {
  const currency = (column && column.currency) || 'USD';
  const locale = Localization.getLocale();
  const formatted = value
    ? Number(value).toLocaleString(locale, {
        style: 'currency',
        currency,
      })
    : '—';
  return <span title={formatted}>{formatted}</span>;
};

MoneyCell.propTypes = {
  column: PropTypes.shape(),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MoneyCell.defaultProps = {
  column: { currency: 'USD' },
  value: null,
};

export default MoneyCell;
