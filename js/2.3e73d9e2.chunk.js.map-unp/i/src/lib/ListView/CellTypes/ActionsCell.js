import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../Button';

const ActionsCell = ({ items }) => {
  const [open, setOpen] = useState(false);
  const node = useRef();

  const handleClick = e => {
    // Close menu if clicking outside of the component
    if (!node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, items]);

  return items.length ? (
    <div
      aria-expanded={open}
      data-testid="actions-cell"
      ref={node}
      style={{ float: 'right' }}
    >
      <Button
        className="actions-button"
        data-testid="actions-cell-button"
        onClick={() => setOpen(!open)}
        theme="none"
      >
        <div className="vertical-dot" />
        <div className="vertical-dot" />
        <div className="vertical-dot" />
      </Button>
      {open && (
        <ul className="button-list">
          {items.map(item => {
            return (
              <li key={item.label}>
                <Button
                  disabled={item.disabled}
                  onClick={() => {
                    setOpen(false);
                    item.action();
                  }}
                  theme="none"
                >
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ) : (
    ''
  );
};

ActionsCell.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
    })
  ),
};

ActionsCell.defaultProps = {
  items: [],
};

export default ActionsCell;
