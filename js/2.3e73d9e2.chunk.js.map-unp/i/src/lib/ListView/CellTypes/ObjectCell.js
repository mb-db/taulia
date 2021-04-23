import React from 'react';
import PropTypes from 'prop-types';
import LinkCell from './LinkCell';

const renderObject = (object, properties, index) => {
  // Use a LinkCell to render each object.  We need to replace any row-object properties with the values from this
  // specific reference.  Any other properties get passed through as is.
  const { id, label } = object;
  const { column } = properties;
  const key = `${column?.key || ''}:${index}:${id}`;

  const objectProps = { ...properties, object, id, value: label, key };

  return <LinkCell {...objectProps} />;
};

const ObjectCell = ({ value, ...props }) => {
  const objects = Array.isArray(value) ? value : [value];

  const renderedObjects =
    objects.length > 0
      ? objects
          .filter(object => object)
          .map((object, index) => renderObject(object, props, index))
          .reduce(
            (list, item) => (list === null ? [item] : [...list, ', ', item]),
            null
          )
      : '—';

  return <span>{renderedObjects}</span>;
};

ObjectCell.propTypes = {
  value: PropTypes.arrayOf({ label: PropTypes.string }),
};

ObjectCell.defaultProps = {
  value: [],
};

export default ObjectCell;
