import React from 'react';
import PropTypes from 'prop-types';

const BooleanCell = ({ value, column }) => {
  const { falseLabel = String(false), trueLabel = String(true) } = column;
  let bool = '—';

  if (value != null) {
    bool = value ? trueLabel : falseLabel;
  }

  return <span title={bool}>{bool}</span>;
};

BooleanCell.propTypes = {
  column: PropTypes.shape({
    trueLabel: PropTypes.string,
    falseLabel: PropTypes.string,
  }),
  value: PropTypes.bool,
};

BooleanCell.defaultProps = {
  column: {
    trueLabel: String(true),
    falseLabel: String(false),
  },
  value: null,
};

export default BooleanCell;
