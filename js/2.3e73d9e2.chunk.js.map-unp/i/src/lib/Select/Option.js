/* eslint-disable react/prop-types */
import React from 'react';
import { isEmpty } from 'lodash';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';
import { Button } from '../Button';

class Option extends React.Component {
  onClick = event => {
    const { onClick, value } = this.props;
    event.stopPropagation();
    onClick(value);
  };

  onClickCheckbox = event => {
    const { isChecked, onCheckboxOptionClick, value } = this.props;
    event.stopPropagation();
    onCheckboxOptionClick(value, !isChecked);
  };

  onClickRadio = () => {
    const { onRadioOptionClick, value } = this.props;
    onRadioOptionClick(value);
  };

  renderLabel = () => {
    const { label, search } = this.props;
    if (isEmpty(search)) {
      return label;
    }
    const idx = label.toLowerCase().indexOf(search.toLowerCase());
    return (
      <span>
        {label.substr(0, idx)}
        <strong>{label.substr(idx, search.length)}</strong>
        {label.substr(idx + search.length)}
      </span>
    );
  };

  render() {
    const {
      enableCheckboxSelect,
      enableRadioSelect,
      isChecked,
      radioValue,
      value,
    } = this.props;
    if (enableRadioSelect) {
      return (
        <Radio checked={radioValue === value} onChange={this.onClickRadio}>
          {this.renderLabel()}
        </Radio>
      );
    }
    if (enableCheckboxSelect) {
      return (
        <Checkbox
          className="option"
          onClick={this.onClickCheckbox}
          checked={isChecked}
        >
          {this.renderLabel()}
        </Checkbox>
      );
    }
    return (
      <Button
        className="option available"
        data-testid={`option-${value}`}
        onClick={this.onClick}
        theme="none"
      >
        {this.renderLabel()}
      </Button>
    );
  }
}

export default Option;
