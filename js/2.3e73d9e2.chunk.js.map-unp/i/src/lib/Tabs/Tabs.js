import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { cx } from '../utils';

const Tabs = ({ data }) => {
  return (
    <div className="tab-container">
      {data.map(tab => {
        const { active, callback, label } = tab;
        return (
          <Button
            className={cx('tab', { active })}
            key={label}
            onClick={callback}
            theme="text"
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

Tabs.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool,
      callback: PropTypes.func,
      label: PropTypes.string,
    })
  ).isRequired,
};

export default Tabs;
