import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Localization } from '../Localization';
import { GearIcon } from '../Icons';
import { Text } from '../Text';

export default class ColumnConfigView extends React.Component {
  static propTypes = {
    onColumnConfigChange: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    columns: [],
  };

  constructor(props) {
    super();
    this.state = {
      columns: props.columns,
      open: false,
      search: '',
    };
    this.node = React.createRef();
  }

  componentDidMount() {
    this.sortColumns();
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  getVisibleColumnNum = columns => {
    return columns
      .filter(column => typeof column.fixedOrder !== 'number')
      .filter(column => this.isColumnVisible(column)).length;
  };

  isColumnVisible = column => {
    return typeof column.visible === 'undefined' ? true : column.visible;
  };

  sortColumns = () => {
    const { columns } = this.state;
    const sortedColumns = columns.slice().sort((column1, column2) => {
      if (this.isColumnVisible(column1) && !this.isColumnVisible(column2))
        return -1;
      if (!this.isColumnVisible(column1) && this.isColumnVisible(column2))
        return 1;
      if (column1.label.toLowerCase() < column2.label.toLowerCase()) return -1;
      if (column1.label.toLowerCase() > column2.label.toLowerCase()) return 1;
      return 0;
    });
    this.setState({ columns: sortedColumns });
    return sortedColumns;
  };

  filterColumns = (searchStr, columns) => {
    return columns.filter(column =>
      column.label.toLowerCase().includes(searchStr.trim().toLowerCase())
    );
  };

  handleCheckChange = e => {
    const { columns } = this.state;
    const { onColumnConfigChange } = this.props;
    const { checked } = e.target;
    const key = e.target.getAttribute('name');
    const selectedColumn = columns.find(column => column.key === key);
    selectedColumn.visible = checked;
    this.setState({ columns });
    onColumnConfigChange(columns);
  };

  handleIconClick = () => {
    const { open } = this.state;
    const columns = this.sortColumns();
    columns.forEach(column => {
      const mutatedColumn = column;
      mutatedColumn.filtered = false;
    });

    this.setState({
      open: !open,
      columns,
    });
  };

  handleSearchChange = e => {
    const { columns } = this.state;
    const search = e.target.value;
    const filtered = this.filterColumns(search, columns);
    columns.forEach(column => {
      const mutatedColumn = column;
      mutatedColumn.filtered = !filtered.find(
        filteredColumn => filteredColumn.key === column.key
      );
    });
    this.setState({ columns, search });
  };

  handleClickOutside = event => {
    const { open } = this.state;
    // Close menu if clicking outside of the component
    if (
      open &&
      (!this.node.current || !this.node.current.contains(event.target))
    ) {
      this.setState({ open: false, search: '' });
      this.sortColumns();
    }
  };

  renderListItem(column) {
    const { columns } = this.state;
    if (column.filtered || typeof column.fixedOrder === 'number') {
      return '';
    }
    const visible = this.isColumnVisible(column);
    const disabled = visible && this.getVisibleColumnNum(columns) < 2;
    return (
      <Checkbox
        checked={visible}
        disabled={disabled}
        data-testid={`checkbox-${column.key}`}
        key={column.key}
        name={column.key}
        onChange={this.handleCheckChange}
      >
        {column.label}
      </Checkbox>
    );
  }

  render() {
    const { columns, open, search } = this.state;
    const editColumnsMsg = Localization.translate('listView.editColumns');
    const searchForField = Localization.translate('listView.searchForField');

    return (
      <div ref={this.node} className="column-config">
        <Button
          data-testid="gear-icon"
          onClick={this.handleIconClick}
          theme="none"
        >
          <GearIcon fill="#8b8b8b" />
        </Button>
        {open && (
          <div className="column-config-dropdown">
            <h5>{editColumnsMsg}</h5>
            <Text
              onChange={this.handleSearchChange}
              type="text"
              placeholder={searchForField}
              value={search}
            />
            <div className="tooltipDropdownOptions">
              {/* Filter out columns with no label (e.g. actions cell) */}
              {columns
                .filter(column => column.label)
                .map(column => this.renderListItem(column))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
