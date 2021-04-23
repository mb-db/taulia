import React from 'react';
import PropTypes from 'prop-types';

const EnumCell = ({ value, column }) => {
  let enumValue = '—';
  if (value) {
    // Translate the enum value into an enum label.
    const { enumOptions } = column;
    const option = enumOptions.find(it => it.value === value);
    enumValue = option?.label || value;
  }

  return <span title={enumValue}>{enumValue}</span>;
};

EnumCell.propTypes = {
  column: PropTypes.shape({
    enumOptions: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string })
    ),
  }),
  value: PropTypes.string,
};

EnumCell.defaultProps = {
  column: { enumOptions: [] },
  value: null,
};

export default EnumCell;
