import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../Button';

function Actions({ actions, selection, onActionComplete }) {
  /* If no items selected, only show "allowEmptySelection" and "preventSelectedSelction" actions.
  If 1+ item selected, show everything but "preventSelectedSelction" actions.
  */
  const shownActions = selection.selectedCount
    ? actions.filter(action => !action.preventSelectedSelection)
    : actions.filter(
        action => action.preventSelectedSelection || action.allowEmptySelection
      );

  return (
    <div style={{ margin: '10px 0' }}>
      {shownActions.map(action => (
        <Button
          key={action.label}
          onClick={() => action.onClick(selection, onActionComplete)}
          theme={action.allowEmptySelection ? 'primary' : 'light'}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

Actions.defaultProps = {
  actions: [],
  selection: { all: false, ids: [], selectedCount: 0 },
  onActionComplete: () => {
    // Do nothing
  },
};

Actions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      allowEmptySelection: PropTypes.bool,
      label: PropTypes.string,
      onClick: PropTypes.func,
      preventSelectedSelection: PropTypes.bool,
    })
  ),
  selection: PropTypes.shape({
    all: PropTypes.bool,
    ids: PropTypes.arrayOf(PropTypes.string),
    selectedCount: PropTypes.number,
  }),
  onActionComplete: PropTypes.func,
};

export default Actions;
