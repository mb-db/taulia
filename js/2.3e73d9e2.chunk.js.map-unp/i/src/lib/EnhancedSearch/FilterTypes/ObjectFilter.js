import PropTypes from 'prop-types';
import React from 'react';
import TypeaheadFilter from './TypeaheadFilter';

const ObjectFilter = ({ field, request, ...otherProps }) => {
  const optionsGetter = ({ values, search, maxOptions }) => {
    return request('GET', `/field/${field.name}/references`)
      .query({ id: values, query: search, limit: maxOptions })
      .then(response =>
        response.body
          .filter(reference => reference.label)
          .map(({ id, label }) => ({ value: id, label }))
      );
  };

  return (
    <TypeaheadFilter
      optionsGetter={optionsGetter}
      field={field}
      {...otherProps}
    />
  );
};

ObjectFilter.propTypes = {
  field: PropTypes.shape({ label: PropTypes.string, name: PropTypes.string })
    .isRequired,
  filter: PropTypes.shape({}).isRequired,
  request: PropTypes.func.isRequired,
  maxOptions: PropTypes.number,
};

ObjectFilter.defaultProps = {
  maxOptions: 50,
};

export default ObjectFilter;
