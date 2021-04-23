/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */

// DEPRECATION NOTICE - this is not used anywhere and does not seem to work as designed
import React from 'react';
import { isEmpty } from 'lodash';
import { Option } from '.';
import { Tooltip } from '../Tooltip';
import { Button } from '../Button';

class TooltipSelect extends React.Component {
  static defaultProps = {
    searchPlaceholder: 'Search...',
  };

  state = {
    search: '',
    showTooltip: false,
  };

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeydown);
  }

  onCheckboxOptionClick = (val, isChecked) => {
    const { onCheckboxChange } = this.props;
    onCheckboxChange(val, isChecked);
  };

  onSearchKeyDown = event => {
    if (this.state.showTooltip && event.keyCode === 9) {
      // TAB key
      this.close();
    }
  };

  onSearchChange = event => {
    this.setState({ search: event.target.value });
  };

  getOptions = () => {
    const onCheckboxOptionClick = this.onCheckboxOptionClick;
    const search = this.state.search;
    let allOptions = this.props.options;
    if (!isEmpty(search)) {
      allOptions = this.props.options.filter(
        option => option.label.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    }
    // eslint-disable-next-line prefer-arrow-callback
    const renderedOptions = allOptions.map((item, idx) => {
      return (
        <Option
          key={idx}
          enableCheckboxSelect
          onCheckboxOptionClick={onCheckboxOptionClick}
          label={item.label}
          value={item.value}
          checked={item.checked}
        />
      );
    });
    return renderedOptions;
  };

  setSearchRef = el => {
    this.search = el;
  };

  handleKeydown = event => {
    if (this.state.showTooltip && event.keyCode === 27) {
      // ESC key
      this.close();
    }
  };

  toggleTooltip = () => {
    this.setState({ showTooltip: !this.state.showTooltip });
  };

  closeTooltip = () => {
    this.setState({ showTooltip: false, search: '' });
  };

  renderCheckboxContent = () => {
    const { searchPlaceholder } = this.props;
    const { search } = this.state;
    return (
      <div className="tooltipSelectDropDown">
        <input
          ref={this.setSearchRef}
          placeholder={searchPlaceholder}
          value={search}
          onChange={this.onSearchChange}
          onKeyDown={this.onSearchKeyDown}
        />
        <div className="tooltipDropdownOptions">{this.getOptions()}</div>
      </div>
    );
  };

  renderLabel = () => {
    return (
      <div>
        <Button
          theme="text"
          className="tooltipSelectLink"
          onClick={this.toggleTooltip}
        >
          {this.props.label}
        </Button>
      </div>
    );
  };

  render() {
    return (
      <Tooltip
        className="tooltipSelect"
        align="left"
        trigger="manual"
        theme="select"
        open={this.state.showTooltip}
        onRequestClose={this.closeTooltip}
      >
        {this.renderLabel()}
        {this.renderCheckboxContent()}
      </Tooltip>
    );
  }
}

export default TooltipSelect;
