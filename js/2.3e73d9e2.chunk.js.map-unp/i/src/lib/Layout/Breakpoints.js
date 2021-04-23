import { every, extend, isNumber, isUndefined } from 'lodash';
import invariant from 'invariant';

export const DEFAULT_BREAKPOINTS = {
  SM: 768,
  LG: 1200,
};

const data = Symbol('BREAKPOINTS_DATA');

class Breakpoints {
  constructor() {
    this.reset();
  }

  reset() {
    this[data] = extend({}, DEFAULT_BREAKPOINTS);
  }

  setValues(newValues) {
    invariant(
      every(
        newValues,
        (value, key) =>
          !isUndefined(DEFAULT_BREAKPOINTS[key]) && isNumber(value)
      ),
      'Invalid values passed to Breakpoints.setValues'
    );
    extend(this[data], newValues);
    return this;
  }

  fetchAll() {
    return this[data];
  }
}

export default new Breakpoints();
