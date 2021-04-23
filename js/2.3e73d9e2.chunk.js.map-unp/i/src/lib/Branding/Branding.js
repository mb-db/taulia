import { isUndefined } from 'lodash';
import Color from 'color';
import { EventEmitter } from 'events';

const DEFAULT_DISPLAY_NAME = 'Taulia';
const DEFAULT_COLOR_FORMAT = 'hex';
const DEFAULT_PRIMARY_COLOR = '#053caf';
const DEFAULT_SECONDARY_COLOR = '#ff7800';
const DEFAULT_LOGO_IMAGE = {
  content:
    'https://storage.googleapis.com/brandings/taulia-styles/tau-logo.png',
  mimeType: 'image/png',
  contentEncoding: 'gzip',
};
const DEFAULT_FAVICON_IMAGE = {
  content:
    'https://storage.googleapis.com/brandings/taulia-styles/tau-favicon.ico',
  mimeType: 'image/x-icon',
  contentEncoding: 'gzip',
};

const dataKey = Symbol('BRANDING_DATA_KEY');

class Branding extends EventEmitter {
  constructor() {
    super();
    this[dataKey] = {
      usingDefault: true,
      displayName: null,
      primaryColor: null,
      secondaryColor: null,
      logoImage: null,
      faviconImage: null,
    };
    this.reset();
  }

  reset() {
    this.setValues({
      displayName: DEFAULT_DISPLAY_NAME,
      colorFormat: DEFAULT_COLOR_FORMAT,
      primaryColor: DEFAULT_PRIMARY_COLOR,
      secondaryColor: DEFAULT_SECONDARY_COLOR,
      logoImage: DEFAULT_LOGO_IMAGE,
      faviconImage: DEFAULT_FAVICON_IMAGE,
    });
    this[dataKey].usingDefault = true;
  }

  setValues(data) {
    if (data.displayName) {
      this.setDisplayName(data.displayName);
    }
    if (data.primaryColor) {
      this.setColor('primary', data.primaryColor, data.colorFormat || null);
    }
    if (data.secondaryColor) {
      this.setColor('secondary', data.secondaryColor, data.colorFormat || null);
    }
    if (data.logoImage) {
      this.setImage('logo', data.logoImage);
    }
    if (data.faviconImage) {
      this.setImage('faviconImage', data.faviconImage);
    }
  }

  setDisplayName(value) {
    if (value) {
      this[dataKey].displayName = value;
      this[dataKey].usingDefault = false;
      this.emit('update', 'displayName', value);
    }
  }

  setColor(name, value, colorFormat = DEFAULT_COLOR_FORMAT) {
    const nameKey = `${name}Color`.replace('ColorColor', 'Color');
    const val = this.parseColor(name, value, colorFormat);
    if (val) {
      this[dataKey][nameKey] = val;
      this[dataKey].usingDefault = false;
      this.emit('update', nameKey, val);
    }
  }

  parseColor(name, value, colorFormat = DEFAULT_COLOR_FORMAT) {
    const nameKey = `${name}Color`.replace('ColorColor', 'Color');
    if (isUndefined(this[dataKey][nameKey])) {
      throw new Error(`Unknown Branding color key [${name}]`);
    }
    let val = null;
    try {
      val = Color(value, colorFormat);
    } catch (e) {
      val = null;
    }
    return val;
  }

  setImage(name, { content, mimeType, contentEncoding }) {
    const nameKey = `${name}Image`.replace('ImageImage', 'Image');
    const val = this.parseImage(name, { content, mimeType, contentEncoding });
    if (val) {
      this[dataKey][nameKey] = val;
      this[dataKey].usingDefault = false;
      this.emit('update', name, val);
    }
  }

  parseImage(name, { content, mimeType, contentEncoding }) {
    const nameKey = `${name}Image`.replace('ImageImage', 'Image');
    if (isUndefined(this[dataKey][nameKey])) {
      throw new Error(`Unknown Branding image key [${name}]`);
    }
    let val = null;
    if (contentEncoding === 'base64') {
      val = `data:${mimeType};base64,${content}`;
    } else {
      val = content;
    }
    return val;
  }

  isUsingDefault() {
    return this[dataKey].usingDefault === true;
  }

  fetchDisplayName() {
    return this[dataKey].displayName;
  }

  fetchColor(name) {
    const nameKey = `${name}Color`.replace('ColorColor', 'Color');
    if (this[dataKey][nameKey] && this[dataKey][nameKey] instanceof Color) {
      return this[dataKey][nameKey].clone();
    }
    return null;
  }

  fetchImage(name) {
    const nameKey = `${name}Image`.replace('ImageImage', 'Image');
    if (this[dataKey][nameKey]) {
      return this[dataKey][nameKey];
    }
    return null;
  }
}

const instance = new Branding();

if (process.env.NODE_ENV !== 'production') {
  window.Branding = Branding;
}

export {
  instance as Branding,
  DEFAULT_DISPLAY_NAME,
  DEFAULT_COLOR_FORMAT,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  DEFAULT_LOGO_IMAGE,
  DEFAULT_FAVICON_IMAGE,
};
