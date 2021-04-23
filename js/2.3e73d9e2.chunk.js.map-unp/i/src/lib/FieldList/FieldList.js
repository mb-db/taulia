import React from 'react';
import PropTypes from 'prop-types';
import { Col, Grid } from '../index';

const FieldList = ({
  colOneData,
  colTwoData,
  colGapWidth,
  colOneWidth,
  colTwoWidth,
  header,
}) => {
  return (
    <div className="field-list">
      {header ? <h4>{header}</h4> : null}
      <Grid gutter={colGapWidth}>
        <Col sm={100} md={50} lg={50}>
          <dl style={{ minWidth: `${colOneWidth}px` }}>
            {colOneData.map(({ dataTestId, label, value }) => (
              <div key={label}>
                <dt style={{ width: `${colOneWidth}px` }}>{label}</dt>
                <dd
                  data-testid={dataTestId || label}
                  style={{ width: `calc(100% - ${colOneWidth}px)` }}
                >
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </Col>
        <Col sm={100} md={50} lg={50}>
          <dl style={{ minWidth: `${colTwoWidth}px` }}>
            {colTwoData.map(({ dataTestId, label, value }) => (
              <div key={label}>
                <dt style={{ width: `${colTwoWidth}px` }}>{label}</dt>
                <dd
                  data-testid={dataTestId || label}
                  style={{ width: `calc(100% - ${colTwoWidth}px)` }}
                >
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>
        </Col>
      </Grid>
    </div>
  );
};

export default FieldList;

FieldList.propTypes = {
  colGapWidth: PropTypes.number,
  colOneData: PropTypes.arrayOf(
    PropTypes.shape({
      dataTestId: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
  colOneWidth: PropTypes.number,
  colTwoData: PropTypes.arrayOf(
    PropTypes.shape({
      dataTestId: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ),
  colTwoWidth: PropTypes.number,
  header: PropTypes.string,
};

FieldList.defaultProps = {
  colGapWidth: 20,
  colOneWidth: 200,
  colTwoData: [],
  colTwoWidth: 200,
  header: null,
};
