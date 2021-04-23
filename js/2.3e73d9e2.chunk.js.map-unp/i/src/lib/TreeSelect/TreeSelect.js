import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import TreeSelectComponent from './TreeSelectComponent';

export default class TreeSelect extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.shape()),
      })
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { data: props.data };
  }

  componentWillReceiveProps = nextProps => {
    const { data } = this.state;
    if (!isEqual(nextProps.data, data)) {
      this.setState({ data: nextProps.data });
    }
  };

  shouldComponentUpdate = nextProps => {
    const { data } = this.state;
    return !isEqual(nextProps.data, data);
  };

  render() {
    const { ...rest } = this.props;
    const { data } = this.state;
    return <TreeSelectComponent data={data} {...rest} />;
  }
}
