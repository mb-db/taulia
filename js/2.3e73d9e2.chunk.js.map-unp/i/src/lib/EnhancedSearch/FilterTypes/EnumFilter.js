import PropTypes from 'prop-types';
import React from 'react';
import TypeaheadFilter from './TypeaheadFilter';

export default class EnumFilter extends React.Component {
  static propTypes = {
    field: PropTypes.shape().isRequired,
    filter: PropTypes.shape().isRequired,
    maxOptions: PropTypes.number,
  };

  static defaultProps = {
    maxOptions: 100,
  };

  constructor(props) {
    super(props);

    const { enumOptions } = props.field;
    const options = this.createOptions(enumOptions);
    const optionMatcher =
      props.field.optionMatcher || this.defaultOptionMatcher;

    this.state = {
      options,
      optionMatcher,
    };
  }

  createOptions = enumOptions => {
    // Remove any options that don't have a label, and add an `order` field to each option so it maintains enum
    // order (e.g. 'New', 'In Progress', 'Complete').
    return enumOptions
      .filter(it => it.label)
      .map(({ value, label }, order) => ({ value, label, order }));
  };

  filterOptions = ({ values, search }) => {
    const { options, optionMatcher } = this.state;

    if (values) {
      return options.filter(option => values.includes(option.value));
    }

    return options.filter(option =>
      optionMatcher(option, search, this.defaultOptionMatcher)
    );
  };

  defaultOptionMatcher = (option, search = '') => {
    return option.label.toLowerCase().includes(search.trim().toLowerCase());
  };

  optionsGetter = ({ maxOptions, ...args }) => {
    const options = this.filterOptions(args);
    if (maxOptions && options.length > maxOptions) {
      options.splice(maxOptions);
    }
    return Promise.resolve(options);
  };

  render() {
    return (
      <TypeaheadFilter optionsGetter={this.optionsGetter} {...this.props} />
    );
  }
}
