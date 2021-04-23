import React from 'react';
import PropTypes from 'prop-types';
import NotificationItem from './NotificationItem';

const Notification = ({ notificationData, theme, ...otherProps }) => (
  <div
    className="tau-notification"
    data-testid="notification-alert-container"
    {...otherProps}
  >
    {notificationData.map(({ id, message }, idx) => (
      <NotificationItem
        key={`notification-key-${id || idx}`}
        data-testid={`notification-item-${id}`}
        id={id}
        message={message}
        theme={theme}
      />
    ))}
  </div>
);

Notification.defaultProps = { notificationData: [], theme: 'info' };

Notification.propTypes = {
  notificationData: PropTypes.arrayOf(PropTypes.shape()),
  theme: PropTypes.string,
};

export default Notification;
