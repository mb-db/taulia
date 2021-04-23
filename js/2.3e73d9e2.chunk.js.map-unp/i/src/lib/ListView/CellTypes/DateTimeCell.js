import PropTypes from 'prop-types';
import React from 'react';
import { Localization } from '../../Localization';

const DateTimeCell = ({ value }) => {
  const locale = Localization.getLocale();
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const formattedDate = value
    ? new Date(value).toLocaleDateString(locale, timeOptions)
    : '—';

  return <span title={formattedDate}>{formattedDate}</span>;
};

DateTimeCell.propTypes = {
  value: PropTypes.string,
};

DateTimeCell.defaultProps = {
  value: null,
};

export default DateTimeCell;
