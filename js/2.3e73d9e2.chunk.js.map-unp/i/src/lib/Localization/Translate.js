/* eslint-disable no-param-reassign */
/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import React from 'react';
import { reduce } from 'lodash';
import Localization from './Localization';

export const TEXT_ONLY_COMPONENTS = ['title', 'option', 'optgroup', 'textarea'];

class Translate extends React.Component {
  static propTypes = {
    code: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    component: PropTypes.any,
    componentProps: PropTypes.object,
    count: PropTypes.number,
    fallback: PropTypes.string,
    locale: PropTypes.string,
  };

  static defaultProps = {
    code: null,
    component: 'span',
    componentProps: null,
    count: null,
    fallback: null,
    locale: null,
  };

  render() {
    const {
      code,
      component,
      componentProps,
      count,
      fallback,
      locale,
      ...args
    } = this.props;
    if (!code) {
      return null;
    }
    let hasReactElement = false;
    const parsedArgs = reduce(
      args,
      (memo, value, key) => {
        if (React.isValidElement(value)) {
          hasReactElement = true;
          memo[key] = `%(${key})s`;
        } else {
          memo[key] = value;
        }
        return memo;
      },
      {}
    );
    let value = Localization.translate(code, {
      ...parsedArgs,
      locale,
      count: parseInt(count, 10),
      fallback,
    });
    if (TEXT_ONLY_COMPONENTS.indexOf(component) > -1) {
      return React.createElement(component, componentProps, value);
    }
    if (hasReactElement) {
      value = reduce(
        value.split(/%\((.+?)\)s/),
        (memo, text, key) => {
          if (args[text]) {
            memo.push(React.cloneElement(args[text], { key }));
          } else {
            memo.push(<span key={key}>{text}</span>);
          }
          return memo;
        },
        []
      );
    }
    return React.createElement(component, componentProps, value);
  }
}

export default Translate;
