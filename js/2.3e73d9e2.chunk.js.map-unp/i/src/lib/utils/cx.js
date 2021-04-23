import { compact, flatten, isArray, isString, map } from 'lodash';

export default function cx(...args) {
  const arr = map(args, arg => {
    if (isString(arg) || isArray(arg)) {
      return arg;
    }
    return map(arg, (condition, name) => (condition ? name : null));
  });
  return compact(flatten(arr)).join(' ');
}
