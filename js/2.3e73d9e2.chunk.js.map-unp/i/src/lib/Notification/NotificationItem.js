import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import dompurify from 'dompurify';
import { Alert } from '../Alert';
import { Button } from '../Button';
import { Localization } from '../Localization';
import TRANSLATIONS from './translations/translations';
import stringContainsJS from '../utils/stringContainsJS';

Localization.setTranslations(TRANSLATIONS);

const NotificationItem = ({ id, message, theme }) => {
  const [isActive, setIsActive] = useState(true);
  const localStorageId = localStorage.getItem(`notificationItem-${id}`);
  const isShowNotification =
    isActive && !localStorageId && !stringContainsJS(message);
  const handleOnClick = e => {
    e.stopPropagation();
    setIsActive(false);
    if (id) {
      localStorage.setItem(`notificationItem-${id}`, id);
    }
  };
  return (
    <div
      className="tau-notification-item"
      data-testid={`notification-item-${id}`}
    >
      {isShowNotification ? (
        <Fragment>
          <Alert theme={theme}>
            <Button
              className="esc"
              onClick={handleOnClick}
              size="sm"
              theme="none"
            >
              X
            </Button>
            <div
              className="tau-notification-content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: dompurify.sanitize(message),
              }}
            />
            <div className="button-container">
              <Button
                className="confirm"
                onClick={handleOnClick}
                size="md"
                theme="primary"
              >
                {Localization.translate('ok')}
              </Button>
            </div>
          </Alert>
        </Fragment>
      ) : null}
    </div>
  );
};

NotificationItem.defaultProps = { id: '', theme: 'info' };

NotificationItem.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string.isRequired,
  theme: PropTypes.string,
};

export default NotificationItem;
