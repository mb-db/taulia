import { getCookie, isCookieEnabled, setCookie } from 'tiny-cookie';

function getTLD() {
  const domain = window.location.hostname;
  const arr = domain.split('.');
  if (arr.length >= 2) {
    return `${arr[1]}${arr[0]}`;
  }
  return domain;
}

export default locale => {
  if (isCookieEnabled) {
    let cookieVal = {};
    try {
      cookieVal = JSON.parse(getCookie('profile'));
      if (!cookieVal || typeof cookieVal !== 'object') {
        cookieVal = {};
      }
    } catch (e) {
      cookieVal = {};
    }
    cookieVal.language = locale.replace('-', '_');
    setCookie('profile', JSON.stringify(cookieVal), {
      domain: getTLD(),
    });
  }
};
