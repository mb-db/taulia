import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../Modal';
import { Localization } from '../Localization';
import { Button } from '../Button';

const ExportModal = ({
  configuration,
  csvExportLimit,
  documentExportData,
  eso,
  fields,
  listViewSelection,
  onRequestClose,
  prepareQuery,
  query,
  request,
  showModal,
}) => {
  const [isAllColumnsLoading, setIsAllColumnsLoading] = useState(false);
  const [isVisibleColumnsLoading, setIsVisibleColumnsLoading] = useState(false);
  const maxLimit = documentExportData ? 100000 : csvExportLimit;
  const selectedCountExceedsLimit = listViewSelection.selectedCount > maxLimit;
  const selectedCount = selectedCountExceedsLimit
    ? maxLimit
    : listViewSelection.selectedCount;
  const limitStr =
    selectedCountExceedsLimit &&
    maxLimit.toLocaleString(Localization.getLocale());

  const exportToCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;

      //  Add to the page, click it, and remove from the dom
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const exportColumns = allColumns => {
    let columns;
    if (allColumns) {
      columns = configuration.fields.map(field => field.name);
      setIsAllColumnsLoading(true);
    } else {
      columns = query.select;
      setIsVisibleColumnsLoading(true);
    }

    const ids = selectedCountExceedsLimit
      ? listViewSelection.ids.slice(0, maxLimit)
      : listViewSelection.ids;

    // NOTE: CSV exporter does not accept MONEY type
    const modifiedFields = fields.map(field => {
      if (field.type === 'MONEY') {
        return { ...field, type: 'NUMBER' };
      }
      return field;
    });

    const exportRequest = {
      ids,
      select: columns,
      query: listViewSelection?.ids?.length ? null : prepareQuery(query),
      metadata: {
        locale: Localization.getLocale(),
        fields: modifiedFields,
      },
    };

    const setLoadingFalse = () => {
      setIsAllColumnsLoading(false);
      setIsVisibleColumnsLoading(false);
    };

    if (documentExportData) {
      const {
        buyerId,
        errorCallback,
        successCallback,
        userId,
      } = documentExportData;
      request('POST', '/api/document/export/eso')
        .send({
          buyerId,
          fileType: 'CSV',
          recordType: 'SUPPLIER',
          request: exportRequest,
          userId,
        })
        .then(res => {
          onRequestClose();
          successCallback(res);
          setLoadingFalse();
        })
        .catch(() => {
          errorCallback();
          setLoadingFalse();
        });
    } else {
      const esoName = eso || configuration.name.toLowerCase();
      const fileName = eso ? `${esoName}Data.csv` : 'exportData.csv';
      request('POST', '/export/csv')
        .send(exportRequest)
        .then(response => {
          exportToCSV(response.text, fileName);
          setLoadingFalse();
        })
        .catch(err => {
          console.error(err); // eslint-disable-line no-console
          setLoadingFalse();
        });
    }
  };

  return (
    <Modal
      open={showModal}
      width={600}
      padding={0}
      onRequestClose={onRequestClose}
    >
      <div className="modal-export">
        <p>
          {Localization.translate(
            'enhancedSearch.actions.exportSubOptionLabel',
            { count: selectedCount, selectedCount }
          )}
        </p>
        <hr className="hr-actions-subMenu" />
        <div className="div-actionSubOption">
          <div className="div-subOptionLabel">
            {Localization.translate(
              'enhancedSearch.actions.exportSubOptionDescription',
              { count: selectedCount, selectedCount }
            )}
          </div>
          {selectedCountExceedsLimit && (
            <p>
              <em>
                {Localization.translate(
                  'enhancedSearch.actions.exportLimitExceeded',
                  { limit: limitStr }
                )}
              </em>
            </p>
          )}
          <div className="div-subOptionLinks">
            <Button
              disabled={isVisibleColumnsLoading}
              spinning={isAllColumnsLoading}
              onClick={() => exportColumns(true)}
              theme="primary"
            >
              {Localization.translate(
                'enhancedSearch.actions.exportSubOptionAllColumns'
              )}
            </Button>
            <Button
              disabled={isAllColumnsLoading}
              spinning={isVisibleColumnsLoading}
              onClick={() => exportColumns(false)}
              theme="primary"
            >
              {Localization.translate(
                'enhancedSearch.actions.exportSubOptionVisibleColumns'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

ExportModal.defaultProps = {
  configuration: {},
  csvExportLimit: 10000,
  documentExportData: null,
  eso: '',
  listViewSelection: {},
  request: null,
  showModal: false,
};

ExportModal.propTypes = {
  configuration: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({})),
    name: PropTypes.string,
  }),
  csvExportLimit: PropTypes.number,
  documentExportData: PropTypes.shape({
    buyerId: PropTypes.string,
    errorCallback: PropTypes.func,
    successCallback: PropTypes.func,
    userId: PropTypes.string,
  }),
  eso: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  listViewSelection: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({})),
    ids: PropTypes.arrayOf(PropTypes.string),
    selectedCount: PropTypes.number,
  }),
  onRequestClose: PropTypes.func.isRequired,
  prepareQuery: PropTypes.func.isRequired,
  query: PropTypes.shape({ select: PropTypes.arrayOf(PropTypes.string) })
    .isRequired,
  request: PropTypes.func,
  showModal: PropTypes.bool,
};

export default ExportModal;
