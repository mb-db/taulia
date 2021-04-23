import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Localization } from '../Localization';
import { cx } from '../utils';
import TRANSLATIONS from './translations/translations';

Localization.setTranslations(TRANSLATIONS);

const FileUpload = ({
  acceptedFileTypes,
  disabled,
  file,
  onChange,
  uploadText,
}) => {
  const [fileName, setFileName] = useState(file?.name);

  const onUpload = e => {
    const newFile = e.target?.files[0];
    setFileName(newFile?.name);
    onChange(newFile);
  };

  // Format the list file according to locale
  const acceptableTypeText = Localization.translate('acceptableTypes', {
    fileTypes: Intl?.ListFormat
      ? new Intl.ListFormat(Localization.getLocale(), {
          style: 'long',
          type: 'conjunction',
        }).format(acceptedFileTypes)
      : acceptedFileTypes.join(', '),
  });

  useEffect(() => {
    if (file) {
      setFileName(file?.name);
    }
  }, [file]);

  return (
    <>
      <div className="tau-file-upload">
        <input
          accept={acceptedFileTypes.join(',')}
          disabled={disabled}
          id="file-upload"
          type="file"
          onChange={onUpload}
        />
        <label htmlFor="file-upload" className={cx('input', { disabled })}>
          {fileName}
          <div className="label">
            <span className="text">
              <span className="icon">
                <svg
                  fill={disabled ? '#999999' : undefined}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 612 792"
                >
                  <path
                    strokeWidth="3"
                    strokeMiterlimit="10"
                    d="M471.1 601c-47.2 0-85.6-38.4-85.6-85.6 0-47.2 38.4-85.6 85.6-85.6s85.6 38.4 85.6 85.6c0 47.2-38.4 85.6-85.6 85.6zm0-156.3c-39 0-70.7 31.7-70.7 70.7s31.7 70.7 70.7 70.7 70.7-31.7 70.7-70.7-31.7-70.7-70.7-70.7z"
                  />
                  <circle cx="436.6" cy="515.4" r="11.2" />
                  <circle cx="471.1" cy="515.4" r="11.2" />
                  <circle cx="505.7" cy="515.4" r="11.2" />
                  <path
                    strokeWidth="6"
                    strokeMiterlimit="10"
                    d="M164.1 543.4H160c-16.9 0-30.6-13.7-30.6-30.6v-237c0-16.9 13.7-30.6 30.6-30.6h75.5c15.4 0 33.5 7.7 41.4 17.6 5.5 6.9 20.3 13 31.8 13H409c17.2 0 30.6 9.5 30.6 21.6v15.5c0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1v-15.5c0-4.3-8-9.4-18.4-9.4H308.6c-15.4 0-33.6-7.7-41.4-17.6-5.5-6.9-20.3-13-31.8-13h-75.5c-10.1 0-18.4 8.2-18.4 18.4v237c0 10.1 8.2 18.4 18.4 18.4h4.1c10.1 0 18.4-8.2 18.4-18.4V358.9c0-16.9 13.7-30.6 30.6-30.6h249c16.9 0 30.6 13.7 30.6 30.6v51.9c0 3.4-2.7 6.1-6.1 6.1s-6.1-2.7-6.1-6.1v-51.9c0-10.1-8.2-18.4-18.4-18.4H213.1c-10.1 0-18.4 8.2-18.4 18.4v153.9c0 16.9-13.7 30.6-30.6 30.6zm203.4 0H207.1c-2.9 0-5.2-2.7-5.2-6.1 0-3.4 2.3-6.1 5.2-6.1h160.4c2.9 0 5.2 2.7 5.2 6.1 0 3.4-2.4 6.1-5.2 6.1z"
                  />
                </svg>
              </span>
              <span className="uploadText">
                {uploadText || Localization.translate('browse')}
              </span>
            </span>
          </div>
        </label>
        {acceptedFileTypes.length ? <p>{acceptableTypeText}</p> : ''}
      </div>
    </>
  );
};

FileUpload.propTypes = {
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  file: PropTypes.shape({ name: PropTypes.string }),
  onChange: PropTypes.func,
  uploadText: PropTypes.string,
};

FileUpload.defaultProps = {
  acceptedFileTypes: [],
  disabled: false,
  file: null,
  onChange: null,
  uploadText: Localization.translate('browse'),
};

export default FileUpload;
