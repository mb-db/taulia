/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import { merge, isEmpty } from 'lodash';
import qs from 'qs';
import FilterContainer from './FilterContainer';
import { Localization } from '../Localization';
import { ListView } from '../ListView';
import { Progress } from '../Progress';
import { Button } from '../Button';
import { i18next } from '../utils';
import ExportModal from './ExportModal';

import TRANSLATIONS from './translations/translations';

const DEFAULT_LIMIT = 10;

class EnhancedSearch extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        allowEmptySelection: PropTypes.bool,
        label: PropTypes.string,
        onClick: PropTypes.func,
        preventSelectedSelection: PropTypes.bool,
      })
    ),
    csvExportLimit: PropTypes.number,
    defaultQuery: PropTypes.shape(),
    documentExportData: PropTypes.shape({
      buyerId: PropTypes.string,
      errorCallback: PropTypes.func,
      successCallback: PropTypes.func,
      userId: PropTypes.string,
    }),
    eso: PropTypes.string,
    excludedFields: PropTypes.arrayOf(PropTypes.string),
    extraColumns: PropTypes.arrayOf(PropTypes.shape()),
    fieldOverrides: PropTypes.shape(),
    isResizable: PropTypes.bool,
    listViewProps: PropTypes.shape(),
    location: PropTypes.shape(),
    noResultsText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    onDataChange: PropTypes.func,
    onQueryChange: PropTypes.func,
    request: PropTypes.func,
    showColumnConfig: PropTypes.bool,
    tooltips: PropTypes.arrayOf(PropTypes.string),
    uri: PropTypes.string,
  };

  static defaultProps = {
    actions: [],
    csvExportLimit: 10000,
    defaultQuery: {},
    documentExportData: null,
    eso: '',
    excludedFields: [],
    extraColumns: [],
    fieldOverrides: {},
    isResizable: true,
    listViewProps: {},
    location: {},
    noResultsText: null,
    onDataChange: null,
    onQueryChange: () => {},
    request: null,
    showColumnConfig: true,
    tooltips: [],
    uri: null,
  };

  state = {
    configuration: null,
    error: null,
    fields: null,
    listViewSelection: { ids: [], selectedCount: null },
    pageLoading: true,
    query: null,
    searchableFields: null,
    searchLoading: false,
    searchResult: null,
    uiPrefs: null,
  };

  componentDidMount() {
    const { defaultQuery, location } = this.props;
    Localization.setTranslations(TRANSLATIONS);
    this.loadSessionUiPrefs();
    this.loadConfiguration();
    this.updateQuery(
      location.search ? this.parseParams(location.search) : defaultQuery
    );
  }

  componentDidUpdate(prevProps) {
    const { defaultQuery, location } = this.props;
    if (prevProps.location.search !== location.search) {
      const query = this.parseParams(location.search);
      this.updateQuery(Object.entries(query).length ? query : defaultQuery);
    }
  }

  parseParams = params => {
    // qs returns booleans as strings (true vs 'true'); add custom decoder to get around this
    // https://github.com/ljharb/qs/issues/91#issuecomment-437926409
    const decoder = (str, decoderFunction, charset) => {
      const strWithoutPlus = str.replace(/\+/g, ' ');
      if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }

      const keywords = {
        true: true,
        false: false,
        null: null,
        undefined,
      };
      if (str in keywords) {
        return keywords[str];
      }

      // utf-8
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    // arrayLimit tells qs what is the max amount in the array (eg. filters array)
    // default is 21 https://github.com/ljharb/qs#parsing-arrays
    return qs.parse(params.slice(1), { decoder, arrayLimit: 50 });
  };

  onFiltersChange = filters => {
    const { query } = this.state;

    const pagination = { ...query.pagination, first: 0 };
    this.updateQuery({ ...query, pagination, filters });
  };

  onPageChange = (page, pageSize) => {
    const { query } = this.state;

    const pagination = {
      ...query.pagination,
      first: page * pageSize,
      limit: pageSize,
    };
    this.updateQuery({ ...query, pagination });
  };

  onSortChange = sorts => {
    const { query } = this.state;
    const pagination = { ...query.pagination, first: 0 };
    this.updateQuery({ ...query, pagination, sorts });
  };

  onColumnConfigChange = columns => {
    const { query } = this.state;
    const select = columns
      .filter(column => column.visible)
      .map(column => column.key);

    this.updateQuery({ ...query, select });
  };

  onUiPrefsChange = uiPrefs => {
    this.saveSessionUiPrefs(uiPrefs);
  };

  onActionComplete = () => {
    this.performSearch();
  };

  getDefaultExportToCSVAction = () => {
    return [
      {
        label: Localization.translate('enhancedSearch.actions.exportLabel'),
        description: Localization.translate(
          'enhancedSearch.actions.exportDescription'
        ),
        onClick: this.showModal,
        allowEmptySelection: true,
      },
    ];
  };

  getActions = () => {
    const { actions } = this.props;

    return isEmpty(actions)
      ? this.getDefaultExportToCSVAction()
      : this.getDefaultExportToCSVAction().concat(actions);
  };

  getSavedColumnPref = key => {
    const { uiPrefs } = this.state;
    if (uiPrefs) {
      return uiPrefs.columns.find(column => {
        return column.key === key;
      });
    }
    return null;
  };

  handleError = error => {
    this.setState({ pageLoading: false, searchLoading: false, error });
  };

  loadConfiguration = () => {
    this.request('GET', '/configuration')
      .then(response => this.handleConfiguration(response.body))
      .catch(this.handleError);
  };

  handleConfiguration = configuration => {
    const eso = configuration.name || '';

    // Filter out any excluded fields.
    const { excludedFields, fieldOverrides } = this.props;
    configuration.fields = configuration.fields.filter(
      field => !excludedFields.includes(field.name)
    );

    // Merge any field overrides.
    configuration.fields = configuration.fields.map(field =>
      merge(field, fieldOverrides[field.name])
    );

    configuration.fields.forEach(field => {
      // Make sure each field has a label.
      field.label =
        (field.label != null && field.label) ||
        this.tryTranslate(`fields.${eso.toLowerCase()}.${field.name}.label`) ||
        this.tryTranslate(`fields.${eso.toLowerCase()}.${field.name}`) ||
        this.tryTranslate(`fields.${field.name}.label`) ||
        this.tryTranslate(`fields.${field.name}`) ||
        field.name;

      // For boolean fields, make sure we have a trueLabel and falseLabel.
      if (field.type === 'BOOLEAN') {
        if (field.trueLabel == null)
          field.trueLabel = this.tryTranslate('filters.trueLabel');
        if (field.falseLabel == null)
          field.falseLabel = this.tryTranslate('filters.falseLabel');
      }

      // For enum fields, make sure we have a list of options, each with a value and label.
      if (field.enumValues && !field.enumOptions) {
        field.enumOptions = field.enumValues.map(value => ({
          value,
          label:
            this.tryTranslate(
              `fields.${eso.toLowerCase()}.${field.name}.enumValues.${value}`
            ) ||
            this.tryTranslate(`fields.${field.name}.enumValues.${value}`) ||
            value,
        }));
      }
    });

    const { fields } = configuration;
    const searchableFields = fields.filter(field => field.searchable);

    this.setState(
      { configuration, fields, searchableFields },
      this.performSearch
    );
  };

  tryTranslate = key => {
    const translation = i18next.t(key);
    if (translation && translation.includes('fields.')) {
      return null;
    }
    return translation;
  };

  loadSessionUiPrefs = () => {
    this.request('GET', '/sessionUiPrefs')
      .then(response => {
        this.updateUiPrefs(response.body);
      })
      .catch(this.handleError);
  };

  updateQuery = query => {
    const { onQueryChange } = this.props;
    onQueryChange(query);
    this.setState(
      { query, shouldPerformSearch: true },
      this.queuePerformSearch
    );
  };

  updateUiPrefs = uiPrefs => {
    this.setState({ uiPrefs });
  };

  performSearch = () => {
    const { query, configuration } = this.state;
    const { onDataChange } = this.props;

    if (!query || !configuration) {
      return;
    }

    // Get the query ready for the back end.
    const preparedQuery = this.prepareQuery(query);

    this.lastQuery = preparedQuery;
    this.setState({ searchLoading: true });

    this.request('POST', '/search')
      .send(preparedQuery)
      .then(response => {
        if (this.lastQuery === preparedQuery) {
          const searchResult = response.body;
          const defaultState = {
            error: null,
            nextButtonDisabled: false,
            pageLoading: false,
            searchLoading: false,
          };
          if (onDataChange) onDataChange(searchResult.results);
          // If total count is disabled, check if at end of list.
          // Disable the next button in <Pagination> and don't update the query
          if (
            !preparedQuery.pagination.includeTotalCount &&
            searchResult.pagination.first &&
            !searchResult.results.length
          ) {
            this.setState({
              ...defaultState,
              nextButtonDisabled: true,
            });
          } else {
            // Update the search results.
            this.setState({
              ...defaultState,
              searchResult,
            });

            // Remember the query for the rest of this session.
            this.saveSessionSearchQuery(query);
          }
        }
      })
      .catch(this.handleError);
  };

  queuePerformSearch = () => {
    setTimeout(() => {
      const { shouldPerformSearch } = this.state;
      if (shouldPerformSearch) {
        this.setState({ shouldPerformSearch: false });
        this.performSearch();
      }
    }, 1);
  };

  prepareQuery = query => {
    const { configuration } = this.state;

    // Normalize the query to make sure it has all expected parts.
    if (!query.filters) query.filters = [];
    if (!query.select) query.select = [];
    if (!query.pagination) query.pagination = {};
    if (!query.sorts) query.sorts = [];

    // Remove any filters from the query that don't have valid arguments.
    const unaryOperators = ['IS_NULL', 'NOT_NULL'];
    const ternaryOperators = ['BETWEEN', 'NOT_BETWEEN'];

    const filters = query.filters.filter(filter => {
      const values = filter.values
        ? filter.values.filter(it => it || typeof it === 'boolean')
        : [];
      const operator = filter.operator || 'EQUAL';

      if (unaryOperators.includes(operator)) {
        return true;
      }
      if (ternaryOperators.includes(operator)) {
        return values.length === 2;
      }
      return values.length > 0;
    });

    // Always select the 'id' field.
    const select = query.select.includes(configuration.idField)
      ? query.select
      : [...query.select, configuration.idField];

    // Create pagination properties.
    const paginationCapabilities = configuration.capabilities.pagination;
    const pagination = { ...query.pagination };
    if (pagination.limit == null) {
      pagination.limit = DEFAULT_LIMIT;
    }
    if (pagination.includeTotalCount == null) {
      pagination.includeTotalCount = paginationCapabilities.supportsTotalCount;
    }

    return { ...query, filters, select, pagination };
  };

  saveSessionSearchQuery = query => {
    this.request('POST', '/sessionSearchQuery')
      .send(query)
      .catch(() => {
        console.error('Error saving session data'); // eslint-disable-line no-console
      });
  };

  saveSessionUiPrefs = uiPrefs => {
    this.request('POST', '/sessionUiPrefs')
      .send(uiPrefs)
      .catch(this.handleError);
  };

  request = (method, path) => {
    const { uri } = this.props;
    return superagent[method.toLowerCase()](`${uri}${path}`);
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      listViewSelection: { ids: [], selectedCount: null },
    });
  };

  showModal = selection => {
    this.setState({
      showModal: true,
      listViewSelection: selection,
    });
  };

  configureFieldColumns() {
    const { query, fields } = this.state;
    // query.select is an array of fields to be shown on initial load
    // Sort the fields according to the config passed to EnhancedSearch
    const fieldsColumns = fields
      .slice()
      .sort(
        (a, b) => query.select.indexOf(a.name) - query.select.indexOf(b.name)
      );
    return fieldsColumns.map(field => {
      return merge(
        {
          key: field.name,
          type: field.type,
          sortable: field.sortable,
          visible: !!query.select.find(it => it === field.name),
          label: field.label,
          trueLabel: field.trueLabel,
          falseLabel: field.falseLabel,
          enumValues: field.enumValues,
          enumOptions: field.enumOptions,
          fixedOrder: field.fixedOrder,
          width: this.getSavedColumnPref(field.name)
            ? this.getSavedColumnPref(field.name).width
            : field.width,
        },
        field.column
      );
    });
  }

  renderFilterContainer = () => {
    const { query, searchableFields } = this.state;
    const { excludedFields, tooltips } = this.props;

    // Filter out any excluded filters
    const searchableFilters = query.filters.filter(
      filter => !excludedFields.includes(filter.field)
    );

    return (
      <div>
        <FilterContainer
          onFiltersChange={this.onFiltersChange}
          fields={searchableFields}
          filters={searchableFilters}
          request={this.request}
          tooltips={tooltips}
        />
      </div>
    );
  };

  renderListView = () => {
    const {
      extraColumns,
      isResizable,
      listViewProps,
      noResultsText,
      showColumnConfig,
    } = this.props;
    const {
      configuration,
      nextButtonDisabled,
      query,
      searchLoading,
      searchResult,
    } = this.state;
    const { idField } = configuration;
    const fieldColumns = this.configureFieldColumns();
    const columns = [...fieldColumns, ...extraColumns];

    // Pagination properties
    const paginationEnabled =
      configuration.capabilities.pagination.supportsPagination;
    const paginationProps = { paginationEnabled, showCount: true };
    if (paginationEnabled) {
      const { pagination } = searchResult;
      paginationProps.pageSize = pagination.limit || DEFAULT_LIMIT;
      paginationProps.page = Math.floor(
        (pagination.first || 0) / paginationProps.pageSize
      );
      paginationProps.totalCount = pagination.totalCount;
      paginationProps.onPageChange = this.onPageChange;
      paginationProps.first = pagination.first;
      paginationProps.nextButtonDisabled = nextButtonDisabled;
    }

    // Sort properties
    const { sorts } = query;
    const sortProps = {
      sortEnabled: true,
      sorts,
      onSortChange: this.onSortChange,
    };

    return (
      <ListView
        data={searchResult.results}
        columns={columns}
        idField={idField}
        isResizable={isResizable}
        loading={searchLoading}
        noResultsText={noResultsText}
        {...paginationProps}
        {...sortProps}
        {...listViewProps}
        showColumnConfig={showColumnConfig}
        selectionEnabled
        actions={this.getActions()}
        actionsEnabled
        onActionComplete={this.onActionComplete}
        onColumnConfigChange={this.onColumnConfigChange}
        onUiPrefsChange={this.onUiPrefsChange}
      />
    );
  };

  render() {
    const {
      configuration,
      error,
      fields,
      listViewSelection,
      pageLoading,
      query,
      showModal,
    } = this.state;
    const { eso, csvExportLimit, documentExportData, request } = this.props;

    if (error) {
      const details = `${error.message}\n\n${error.stack}`;
      return (
        <div>
          <p>
            {Localization.translate('enhancedSearch.error')}
            &nbsp;&#58;&#40;
          </p>
          <Button
            onClick={event => {
              event.target.innerText = details;
            }}
          >
            &#40;
            {Localization.translate('enhancedSearch.clickForDetails')}
            &#41;
          </Button>
        </div>
      );
    }

    if (pageLoading) {
      return (
        <div style={{ height: '250px' }}>
          <Progress position="relative-centered" />
        </div>
      );
    }

    return (
      <div>
        {this.renderFilterContainer()}
        {this.renderListView()}
        <ExportModal
          configuration={configuration}
          csvExportLimit={csvExportLimit}
          documentExportData={documentExportData}
          eso={eso}
          fields={fields}
          listViewSelection={listViewSelection}
          onRequestClose={this.closeModal}
          prepareQuery={this.prepareQuery}
          query={query}
          request={request || this.request}
          showModal={showModal}
        />
      </div>
    );
  }
}

export default EnhancedSearch;
