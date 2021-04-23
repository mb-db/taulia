import React from 'react';
import PropTypes from 'prop-types';
import { Localization } from '../../Localization';

const DateCell = ({ value }) => {
  const locale = Localization.getLocale();
  const formattedDate = value
    ? new Date(value).toLocaleDateString(locale)
    : '—';

  return <span title={formattedDate}>{formattedDate}</span>;
};

DateCell.propTypes = {
  value: PropTypes.string,
};

DateCell.defaultProps = {
  value: null,
};

export default DateCell;
