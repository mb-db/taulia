import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Button } from '../Button';

const MultiFileUpload = ({
  buttonText,
  files,
  onAdd,
  onClick,
  onDelete,
  pText,
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior so file opener only opens on button click
    noClick: true,
    noKeyboard: true,
    onDrop: selectedFiles => {
      if (onAdd) onAdd(selectedFiles);
    },
  });

  const clipName = name => {
    const maxLength = 20;
    if (name.length > maxLength) {
      return `${name.slice(0, maxLength)}...`;
    }
    return name;
  };

  return (
    <div className="multi-file-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>
          {pText}
          <Button theme="text" onClick={open}>
            {buttonText}
          </Button>
        </p>
      </div>
      <ul>
        {files.map(file => {
          const name = file.name || file.fileName;
          const key = `${name} ${file.dateUpdated || file.attachmentId}`;
          return (
            <li key={key}>
              <Button onClick={() => onClick && onClick(file)} theme="none">
                {clipName(name)}
              </Button>
              <Button onClick={() => onDelete && onDelete(file)} theme="none">
                X
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

MultiFileUpload.defaultProps = {
  buttonText: 'select a file',
  files: [],
  onAdd: null,
  onClick: null,
  onDelete: null,
  pText: 'Drag and drop attachments here or ',
};

MultiFileUpload.propTypes = {
  buttonText: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape),
  onAdd: PropTypes.func,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  pText: PropTypes.string,
};

export default MultiFileUpload;
