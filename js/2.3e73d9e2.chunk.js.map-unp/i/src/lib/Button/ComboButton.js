import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowButton from './ArrowButton';
import Button from './Button';
import { cx } from '../utils';

function ComboButton({ buttonLabel, items, mainAction }) {
  const [open, setOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState();

  const node = useRef();

  const selectItem = item => {
    item.action();
    setCurrentSelection(null);
  };

  const handleClick = e => {
    // Close menu if clicking outside of the component
    if (!node.current || !node.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Enter' && currentSelection) {
        selectItem(currentSelection);
      } else if (open && (e.keyCode === 40 || e.keyCode === 38)) {
        // Up and down arrows listener to navigate list
        if (!currentSelection) {
          setCurrentSelection(items[0]);
          return;
        }
        const up = e.keyCode === 38;
        let index = items.findIndex(
          item => item.label === currentSelection.label
        );
        index = up ? index - 1 : index + 1;
        if (index === items.length) {
          index = 0;
        }
        if (index === -1) {
          index = items.length - 1;
        }
        setCurrentSelection(items[index]);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentSelection, items]);

  return (
    <div data-testid="combo-button" aria-expanded={open} ref={node}>
      <div className="combo-button-container">
        <Button onClick={() => mainAction()}>{buttonLabel}</Button>
        <ArrowButton
          data-testid="combo-button-dropdown"
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && items.length && (
        <ul>
          {items.map(item => {
            const selected =
              currentSelection && item.label === currentSelection.label;
            return (
              <li
                aria-selected={selected}
                className={cx(selected && 'selected')}
                key={item.label}
                role="option"
              >
                <Button
                  theme="none"
                  onMouseEnter={() => setCurrentSelection(item)}
                  onClick={() => {
                    selectItem(item);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

ComboButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    })
  ),
  mainAction: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string.isRequired,
};

ComboButton.defaultProps = {
  items: [],
};

export default ComboButton;
