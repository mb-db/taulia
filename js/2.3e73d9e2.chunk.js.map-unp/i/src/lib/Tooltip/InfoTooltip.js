/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Tooltip } from '.';

const InfoTooltip = props => {
  return (
    <div className="tooltip" id={props.id}>
      <Tooltip {...props}>
        <svg
          fill="#666"
          style={{ height: '16px', width: '16px' }}
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
        >
          <g transform="translate(0,-952.36218)">
            <path
              d="M 50 5 C 25.182716 5 5 25.18272 5 50 C 5 74.8173 25.182716 95 50 95 C 74.817284 95 95 74.8173 95 50 C 95 25.18272 74.817284 5 50 5 z M 50 11 C 71.574644 11 89 28.42536 89 50 C 89 71.5746 71.574644 89 50 89 C 28.425356 89 11 71.5746 11 50 C 11 28.42536 28.425356 11 50 11 z M 50 25 C 41.751258 25 35 31.75127 35 40 A 3.0003 3.0003 0 1 0 41 40 C 41 34.99391 44.993902 31 50 31 C 55.006098 31 59 34.99391 59 40 C 59 43.11324 57.744892 45.23848 55.6875 47.40625 C 53.630108 49.574 50.775527 51.53585 48.125 53.65625 A 3.0003 3.0003 0 0 0 47 56 L 47 60 A 3.0003 3.0003 0 1 0 53 60 L 53 57.46875 C 55.185751 55.80025 57.752652 53.96505 60.0625 51.53125 C 62.755108 48.69425 65 44.86747 65 40 C 65 31.75127 58.248742 25 50 25 z M 50 67 C 47.79086 67 46 68.7908 46 71 C 46 73.2091 47.79086 75 50 75 C 52.20914 75 54 73.2091 54 71 C 54 68.7908 52.20914 67 50 67 z "
              transform="translate(0,952.36218)"
            />
          </g>
        </svg>
        {props.children}
      </Tooltip>
    </div>
  );
};

export default InfoTooltip;
