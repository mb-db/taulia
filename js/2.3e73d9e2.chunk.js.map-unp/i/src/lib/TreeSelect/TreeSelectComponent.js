import PropTypes from 'prop-types';
import React from 'react';
import DropdownTreeSelect from 'react-dropdown-tree-select';
import treeSelectOptions from './constants';
import { Localization } from '../Localization';
import TRANSLATIONS from './translations/translations';
import assignExpandedTrue from './treeSelectUtils';

Localization.setTranslations(TRANSLATIONS);

const TreeSelectComponent = ({ data, isExpanded, onSelectionChange }) => {
  const filterData = () => {
    const displayDataFormat =
      data?.length === 1 && data[0].children ? data[0].children : data;
    if (isExpanded) {
      assignExpandedTrue(displayDataFormat);
    }
    return displayDataFormat;
  };
  const filteredData = filterData();
  const dispatchSelectedNodes = (currentNode, selectedNodes) =>
    onSelectionChange(selectedNodes);

  return (
    <DropdownTreeSelect
      data={filteredData}
      onChange={dispatchSelectedNodes}
      texts={{
        placeholder: ' ',
        inlineSearchPlaceholder: Localization.translate('searchPlaceholder'),
        noMatches: Localization.translate('noSearchResultsLabel'),
      }}
      {...treeSelectOptions}
    />
  );
};

TreeSelectComponent.defaultProps = {
  isExpanded: false,
  onSelectionChange: () => {},
};

TreeSelectComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.shape()),
    })
  ).isRequired,
  isExpanded: PropTypes.bool,
  onSelectionChange: PropTypes.func,
};

export default TreeSelectComponent;
