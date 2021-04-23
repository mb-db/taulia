import React from 'react';
import PropTypes from 'prop-types';
import TextCell from './TextCell';
import { Link } from '../../Link';

const LinkCell = props => {
  const { column, value } = props;
  const { linkTarget, linkUrlGetter, onLinkClick } = column;

  // If there is a click handler, wrap it to avoid the default event behavior.
  const onClick = onLinkClick
    ? event => {
        onLinkClick(props);
        event.preventDefault();
      }
    : null;

  // If we have a link getter, call it to find the URL for this object.
  const url = linkUrlGetter ? linkUrlGetter(props) : null;

  // If there is a url, or an onClick handler then render it as a link.
  if (url || onClick) {
    return (
      <Link title={value} to={url} onClick={onClick} target={linkTarget}>
        {value ?? <span>—</span>}
      </Link>
    );
  }

  // Otherwise just render the content as plain text.
  return <TextCell {...props} />;
};

LinkCell.propTypes = {
  column: PropTypes.shape({
    linkTarget: PropTypes.string,
    linkUrlGetter: PropTypes.func,
    onLinkClick: PropTypes.func,
  }),
  value: PropTypes.string,
};

LinkCell.defaultProps = {
  column: { linkTarget: '', linkUrlGetter: null, onLinkClick: null },
  value: null,
};

export default LinkCell;
