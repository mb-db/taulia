// NOTE: caution fixing these linting rules - this can cause bugs adding/removing columns and adjusting browser size
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
import React from 'react';
import PropTypes from 'prop-types';
import { isPlainObject } from 'lodash';
import { Button } from '../Button';
import { ButtonMenu } from '../ButtonMenu';
import { Checkbox } from '../Checkbox';
import { cx } from '../utils/index';
import { Localization } from '../Localization';
import { Pagination } from '../Pagination';
import { Progress } from '../Progress';
import Actions from './Actions';
import ColumnConfigView from './ColumnConfigView';
import EmptyCell from './CellTypes/EmptyCell';
import { createDefaultCellForType } from './listViewUtils';
import TRANSLATIONS from './translations/translations';

Localization.setTranslations(TRANSLATIONS);

const isEmpty = obj =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

class ListView extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        allowEmptySelection: PropTypes.bool,
        label: PropTypes.string,
        onClick: PropTypes.func,
        preventSelectedSelection: PropTypes.bool,
      })
    ),
    actionsEnabled: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    defaultColumnWidth: PropTypes.number,
    data: PropTypes.arrayOf(
      PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
    ).isRequired,
    first: PropTypes.number,
    idField: PropTypes.string,
    isResizable: PropTypes.bool,
    loading: PropTypes.bool,
    nextButtonDisabled: PropTypes.bool,
    noResultsText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    onActionComplete: PropTypes.func,
    onColumnConfigChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onUiPrefsChange: PropTypes.func,
    rowHeight: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    paginationEnabled: PropTypes.bool,
    selection: PropTypes.shape({
      all: PropTypes.bool,
      ids: PropTypes.arrayOf(PropTypes.string),
    }),
    selectionEnabled: PropTypes.bool,
    showColumnConfig: PropTypes.bool,
    showCount: PropTypes.bool,
    sortEnabled: PropTypes.bool,
    sorts: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        type: PropTypes.string,
      })
    ),
    totalCount: PropTypes.number,
  };

  static defaultProps = {
    actions: [],
    actionsEnabled: false,
    defaultColumnWidth: 150,
    first: 0,
    idField: 'id',
    isResizable: true,
    loading: false,
    nextButtonDisabled: false,
    noResultsText: null,
    onActionComplete: () => {},
    onColumnConfigChange: () => {},
    onPageChange: () => {},
    onSelectionChange: () => {},
    onSortChange: () => {},
    onUiPrefsChange: () => {},
    page: null,
    pageSize: null,
    paginationEnabled: false,
    rowHeight: null,
    selection: { all: false, ids: [] },
    selectionEnabled: false,
    showColumnConfig: true,
    showCount: false,
    sortEnabled: false,
    sorts: [],
    totalCount: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      resizeChange: 0,
      resizeStartX: 0,
      selection: props.selection,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.setDimensions);
    this.setDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimensions);
  }

  onSortChange = column => {
    const { sorts, onSortChange } = this.props;
    // Find the existing sort, if there is one, and toggle it.
    const sort = sorts.find(s => s.field === column.key);
    const sortType = sort && sort.type === 'ASC' ? 'DESC' : 'ASC';
    onSortChange([{ field: column.key, type: sortType }]);
  };

  onSelectCheckboxChange = event => {
    const { data, idField } = this.props;
    const { selection } = this.state;
    const id = event.target.value;
    const selected = event.target.checked;

    const existing = selection.all
      ? data.map(object => object[idField])
      : selection.ids || [];

    const ids = selected ? [...existing, id] : existing.filter(it => it !== id);

    this.setState({ selection: { all: false, ids } }, this.fireSelectionChange);
  };

  onSelectAllClick = () => {
    const selection = { all: true, ids: null };
    this.setState({ selection }, this.fireSelectionChange);
  };

  onSelectVisibleClick = () => {
    const { data, idField } = this.props;
    const selection = { all: false, ids: data.map(object => object[idField]) };
    this.setState({ selection }, this.fireSelectionChange);
  };

  onDeselectAllClick = () => {
    const selection = { all: false, ids: [] };
    this.setState({ selection }, this.fireSelectionChange);
  };

  onColumnConfigChange = columns => {
    const { onColumnConfigChange } = this.props;
    this.setState({ columns });
    onColumnConfigChange(columns);
  };

  onUiPrefsChange = () => {
    const { columns, defaultColumnWidth, onUiPrefsChange } = this.props;
    const uiPrefs = { columns: [] };
    columns.forEach(it => {
      uiPrefs.columns.push({
        key: it.key,
        width: it.width ? it.width : defaultColumnWidth,
      });
    });
    onUiPrefsChange(uiPrefs);
  };

  onMouseMove = event => {
    const { resizeStartX } = this.state;
    this.setState({ resizeChange: event.clientX - resizeStartX });
  };

  setDimensions = () => {
    // This function is not actually used, but removing it causes bugs
    const widthOffset = window.innerWidth > 1350 ? 260 : 70;
    const width = window.innerWidth - widthOffset;
    this.setState({ width });
  };

  calculateWidthOfColumns = columns => {
    let width = 0;
    columns.forEach(column => {
      width += column.width;
    });
    return width;
  };

  startResizing = (column, startX) => {
    this.setState({
      resizing: true,
      resizeColumn: column,
      resizeColumnInitialWidth: column.width,
      resizeStartX: startX,
      resizeChange: 0,
    });
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopResizing);
  };

  stopResizing = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopResizing);
    this.setState({ resizing: false });
    this.onUiPrefsChange();
  };

  fireSelectionChange = () => {
    const { onSelectionChange } = this.props;
    const { selection } = this.state;
    onSelectionChange(selection);
  };

  createSelectColumn = () => {
    const { data, idField, paginationEnabled } = this.props;
    const { selection } = this.state;

    const options = [
      {
        label: Localization.translate('listView.selectAll'),
        onClick: this.onSelectAllClick,
      },
      {
        label: Localization.translate('listView.deselectAll'),
        onClick: this.onDeselectAllClick,
      },
    ];
    if (paginationEnabled) {
      options.push({
        label: Localization.translate('listView.selectVisible'),
        onClick: this.onSelectVisibleClick,
      });
    }

    const header = (
      <ButtonMenu options={options}>
        <div>&#x25BE;</div>
      </ButtonMenu>
    );

    const ids = selection.ids || [];

    const cell = ({ rowIndex }) => {
      const id = data[rowIndex][idField];
      const selected = selection.all || ids.includes(id);

      return (
        <Checkbox
          checked={selected}
          data-testid={`row-${id}-checkbox`}
          onChange={this.onSelectCheckboxChange}
          value={id}
        />
      );
    };

    return {
      cell,
      className: 'select',
      fixedOrder: -1,
      header,
      key: 'select',
      style: { width: '34px' },
      width: 34,
    };
  };

  normalizeColumns = () => {
    const { columns, selectionEnabled } = this.props;
    const visibleColumns = columns.filter(column =>
      this.isColumnVisible(column)
    );

    const normalized = visibleColumns.map(column =>
      this.normalizeColumn(column)
    );

    if (selectionEnabled) {
      normalized.unshift(this.createSelectColumn());
    }

    normalized.sort((a, b) => {
      if (typeof a.fixedOrder !== 'number' && typeof b.fixedOrder === 'number')
        return 1;
      if (typeof a.fixedOrder === 'number' && typeof b.fixedOrder === 'number')
        return a.fixedOrder - b.fixedOrder;
      if (typeof a.fixedOrder === 'number' && typeof b.fixedOrder !== 'number')
        return -1;
      return 0;
    });

    let xPos = 1;
    normalized.forEach((it, idx, arr) => {
      if (it.fixedOrder !== undefined) {
        it.style = { ...it.style, left: xPos };
        it.className = this.appendClass(it.className, 'fixed');
        if (idx + 1 < arr.length && arr[idx + 1].fixedOrder === undefined) {
          it.className = this.appendClass(it.className, 'fixed-last');
        }
        xPos += it.width;
      }
    });

    return normalized;
  };

  normalizeColumn = column => {
    const { defaultColumnWidth } = this.props;
    const { resizeColumn, resizeColumnInitialWidth, resizeChange } = this.state;
    let style = { ...(column.style || {}) };

    if (!column.width || typeof column.width !== 'number') {
      column.width = defaultColumnWidth;
    }

    if (resizeColumn && resizeColumn.key === column.key) {
      const resizeValue = resizeColumnInitialWidth + resizeChange;
      column.width = resizeValue > 50 ? resizeValue : 50;
    }
    style = { width: `${column.width}px` };

    if (column.align) {
      style.textAlign = column.align;
    }
    column.resizable = column.fixedOrder === undefined;
    return { ...column, style };
  };

  isColumnVisible = column => {
    return typeof column.visible === 'undefined' ? true : column.visible;
  };

  hasContent = value => {
    if (
      Array.isArray(value) ||
      typeof value === 'string' ||
      isPlainObject(value)
    ) {
      return !isEmpty(value);
    }
    return value !== null;
  };

  appendClass = (classes, className) => {
    return classes ? `${classes} ${className}` : className;
  };

  renderCount = () => {
    const { data, page, pageSize, paginationEnabled, totalCount } = this.props;

    // Showing count message
    let totalMessage = '';
    if (paginationEnabled && pageSize && page != null && data.length) {
      const first = page * pageSize + 1;
      const last = page * pageSize + data.length;

      if (totalCount) {
        totalMessage = Localization.translate(
          'listView.showingPaginationWithCount',
          { first, last, totalCount }
        );
      } else {
        totalMessage = Localization.translate('listView.showingPagination', {
          first,
          last,
        });
      }
    } else if (data.length) {
      totalMessage = Localization.translate('listView.showingCount', {
        totalCount: data.length,
      });
    }

    return <span>{totalMessage}</span>;
  };

  renderTable = () => {
    const { columns, data, showColumnConfig } = this.props;
    const { resizing } = this.state;
    const emptyColumns = [{ key: 'emptyResultsText', label: '' }];
    // If no data, show empty columns / table
    const normalizedColumns = data.length
      ? this.normalizeColumns()
      : emptyColumns;
    const columnsWidth = this.calculateWidthOfColumns(normalizedColumns);
    const wrapperWidth = this.wrapper ? this.wrapper.clientWidth : 0;
    const tableWidth =
      columnsWidth > wrapperWidth ? columnsWidth : wrapperWidth - 2;
    if (columnsWidth < wrapperWidth) {
      const lastColumn = normalizedColumns[normalizedColumns.length - 1];
      const delta = wrapperWidth - columnsWidth - 2;
      lastColumn.style.width = `${lastColumn.width + delta}px`;
    }
    let hasActionsCell = false;

    if (
      columns &&
      columns[columns.length - 1].key === 'actions' &&
      columns[columns.length - 1].label === ''
    ) {
      hasActionsCell = true;
    }
    return (
      <div>
        {showColumnConfig && !!data.length && (
          <div className="columnConfigContainer">
            <ColumnConfigView
              columns={columns}
              onColumnConfigChange={this.onColumnConfigChange}
            />
          </div>
        )}
        <div
          className={cx('tableWrapper', {
            'firefox-overflow-visible': hasActionsCell,
          })}
        >
          <table
            className={resizing ? 'resizing' : null}
            style={{ width: `${tableWidth}px` }}
          >
            {this.renderTableHeader(normalizedColumns)}
            {data.length
              ? this.renderTableData(normalizedColumns)
              : this.renderNoResults()}
          </table>
        </div>
      </div>
    );
  };

  renderTableHeader = columns => {
    return (
      <thead>
        <tr>{columns.map(column => this.renderColumnHeader(column))}</tr>
      </thead>
    );
  };

  renderColumnHeader = column => {
    const { resizing, resizeColumn } = this.state;
    const { isResizable } = this.props;
    const header = column.header || this.renderDefaultColumnHeader(column);
    const { key, style } = column;
    let { className } = column;

    if (resizing && resizeColumn.key === key) {
      className = this.appendClass(className, 'resizing');
    }

    return (
      <th key={key} className={className} style={style}>
        {header}
        {column.resizable && isResizable && (
          <div
            className="resizeHandle"
            data-testid={`resize-handler-${key}`}
            role="presentation"
            onMouseDown={event => {
              this.startResizing(column, event.clientX);
            }}
          />
        )}
      </th>
    );
  };

  renderDefaultColumnHeader = column => {
    const { sorts, sortEnabled } = this.props;
    const sortable = sortEnabled && column.sortable;
    const sort = sorts.find(s => s.field === column.key);

    const label = column.label != null ? column.label : column.key;

    return (
      <div>
        {sortable ? (
          <>
            <Button
              className="sortable"
              data-testid={`sortable-${column.key}`}
              onClick={() => this.onSortChange(column)}
              theme="none"
              title={label}
            >
              {label}
            </Button>
            {sort && (
              <span className="sortArrow">
                &nbsp;
                {sort.type === 'ASC' ? (
                  <span>&uarr;</span>
                ) : (
                  <span>&darr;</span>
                )}
              </span>
            )}
          </>
        ) : (
          <span>{label}</span>
        )}
      </div>
    );
  };

  renderTableData = columns => {
    const { data, rowHeight } = this.props;
    const style = rowHeight ? { lineHeight: `${rowHeight}px` } : null;

    return (
      <tbody style={style}>
        {data.map((object, rowIndex) =>
          this.renderRow(object, rowIndex, columns)
        )}
      </tbody>
    );
  };

  renderRow = (object, rowIndex, columns) => {
    return (
      <tr key={rowIndex}>
        {columns.map(column => this.renderCell(object, rowIndex, column))}
      </tr>
    );
  };

  renderCell = (object, rowIndex, column) => {
    const { data, idField } = this.props;
    const { resizing, resizeColumn } = this.state;
    const { key, style } = column;
    let { className } = column;
    const id = object[idField];
    const value = object[key];
    const cell =
      column.cell ||
      (this.hasContent(value)
        ? createDefaultCellForType(column.type)
        : EmptyCell);

    const cellProps = {
      column,
      data,
      id,
      key,
      object,
      rowIndex,
      value,
    };

    const content = cell(cellProps);

    if (resizing && resizeColumn.key === key) {
      className = this.appendClass(className, 'resizing');
    }

    return (
      <td key={key} className={className} style={style}>
        {content}
      </td>
    );
  };

  renderNoResults = () => {
    const { noResultsText } = this.props;
    return (
      <tbody>
        <tr>
          <td
            style={{ padding: '20px', textAlign: 'center', overflow: 'hidden' }}
          >
            {noResultsText || (
              <>
                <div className="magnifyingGlass">&#9906;</div>
                <h2>{Localization.translate('listView.noResults')}</h2>
                <p>{Localization.translate('listView.refineFilters')}</p>
              </>
            )}
          </td>
        </tr>
      </tbody>
    );
  };

  renderPagination = () => {
    const {
      data,
      first,
      nextButtonDisabled,
      onPageChange,
      page,
      pageSize,
      paginationEnabled,
      totalCount,
    } = this.props;

    return (
      data.length > 0 &&
      paginationEnabled && (
        <Pagination
          dataLength={data.length}
          first={first}
          nextButtonDisabled={nextButtonDisabled}
          onPageChange={onPageChange}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )
    );
  };

  renderActions = () => {
    const { selection } = this.state;
    const { actions, totalCount, data, onActionComplete } = this.props;

    let selectedCount = 0;
    if (!isEmpty(selection.ids)) {
      selectedCount = selection.ids.length;
    } else if (selection.all) {
      selectedCount = totalCount || data.length;
    }

    const updatedSelection = { ...selection, selectedCount, data };

    return (
      <Actions
        actions={actions}
        onActionComplete={onActionComplete}
        selection={updatedSelection}
      />
    );
  };

  render() {
    const {
      actions,
      actionsEnabled,
      loading,
      paginationEnabled,
      showCount,
    } = this.props;

    return (
      <div
        ref={wrapper => {
          this.wrapper = wrapper;
        }}
      >
        <div className="listView">
          <div className="space-between-row">
            {actionsEnabled && !isEmpty(actions) && this.renderActions()}
            {showCount && this.renderCount()}
          </div>
          {this.renderTable()}
          {paginationEnabled && this.renderPagination()}
          {loading && <Progress />}
        </div>
      </div>
    );
  }
}

export default ListView;
