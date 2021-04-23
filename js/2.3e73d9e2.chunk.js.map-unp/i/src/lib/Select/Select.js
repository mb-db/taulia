import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';
import { getInputStyles } from '../Text';
import { Button, Clickable } from '../Button';
import { Option } from '.';

export class Select extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    enableSearch: PropTypes.bool,
    maxHeight: PropTypes.number,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onTextSearchChange: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string,
    searchPlaceholder: ({ enableSearch, searchPlaceholder }) => {
      if (
        enableSearch &&
        (typeof searchPlaceholder !== 'string' || !searchPlaceholder.length)
      ) {
        return new Error(
          "When 'enableSearch' is true, 'searchPlaceholder' must be a string."
        );
      }
      return null;
    },
    noSearchResultsLabel: ({ enableSearch, noSearchResultsLabel }) => {
      if (
        enableSearch &&
        (typeof noSearchResultsLabel !== 'string' ||
          !noSearchResultsLabel.length)
      ) {
        return new Error(
          "When 'enableSearch' is true, 'noSearchResultsLabel' must be a string."
        );
      }
      return null;
    },
    value: ({ multiple, value }) => {
      if (multiple) {
        if (!Array.isArray(value)) {
          return new Error("When 'multiple' is true, 'value' must be array");
        }
        return null;
      }
      if (typeof value !== 'string') {
        return new Error("'value' must be a string");
      }
      return null;
    },
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
  };

  static defaultProps = {
    className: '',
    disabled: false,
    enableSearch: true,
    maxHeight: null,
    multiple: true,
    name: '',
    noSearchResultsLabel: null,
    onChange: () => null,
    onTextSearchChange: () => null,
    options: [],
    placeholder: null,
    searchPlaceholder: null,
    searchValue: '',
    value: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      open: false,
      search: props.searchValue || '',
    };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleClick);
    document.body.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleClick);
    document.body.removeEventListener('keydown', this.handleKeydown);
  }

  onSearchChange = event => {
    const { onTextSearchChange } = this.props;

    this.setState({ search: event.target.value });
    if (onTextSearchChange) {
      onTextSearchChange(event.target.value);
    }
  };

  onSearchKeyDown = e => {
    const { open } = this.state;
    // TAB key
    if (open && e.keyCode === 9) {
      e.preventDefault();
      this.close();
    }
  };

  onSelectedItemClick = (item, event) => {
    event.stopPropagation();
    const { value, multiple, onChange } = this.props;
    if (multiple) {
      // Make copy of "value", remove selected item from value copy and pass to callback function
      const valueCopy = [...value];
      const idx = valueCopy.indexOf(item.value);
      valueCopy.splice(idx, 1);
      onChange(valueCopy);
    } else {
      this.open();
    }
  };

  onOptionClick = val => {
    const { onChange, multiple, value } = this.props;
    if (val.length) {
      if (this.search) {
        this.search.focus();
      }
      if (multiple) {
        const options = this.getOptions();
        if (options.length === 1) {
          this.setState({ search: '', open: false }, () => {
            onChange(value.concat([val]));
          });
        } else {
          onChange(value.concat([val]));
        }
      } else {
        this.setState({ open: false }, () => onChange(val));
      }
    }
  };

  getOptions = () => {
    const { multiple, options, value } = this.props;
    const { search } = this.state;
    let result = options.slice(0);
    if (multiple) {
      result = result.filter(option => value.indexOf(option.value) === -1);
    }
    if (search.length) {
      return result.filter(
        ({ label }) => label.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    }
    return result;
  };

  getOptionsClassName = () => {
    const { open } = this.state;
    const { enableSearch } = this.props;
    return cx('tau-select-options', {
      open,
      padded: !enableSearch,
    });
  };

  setRef = el => {
    this.el = el;
  };

  setOptionsRef = el => {
    this.options = el;
  };

  setSearchRef = el => {
    this.search = el;
  };

  handleClick = event => {
    const { open } = this.state;
    if (open && !this.el.contains(event.target)) {
      this.close();
    }
  };

  handleKeydown = event => {
    const { open } = this.state;
    if (open && event.keyCode === 27) {
      // ESC key
      this.close();
    }
  };

  open = () => {
    const { disabled, searchValue } = this.props;
    if (!disabled) {
      const options = this.getOptions();
      if (options.length > 0) {
        this.setState({ open: true, search: searchValue || '' }, () => {
          if (this.search) {
            this.search.focus();
          }
        });
      }
    }
  };

  close = () => {
    this.setState({ open: false, search: '' });
  };

  render() {
    const {
      className,
      disabled,
      enableSearch,
      maxHeight,
      multiple,
      name,
      noSearchResultsLabel,
      options,
      placeholder,
      searchPlaceholder,
      value,
    } = this.props;
    const { hover, open, search } = this.state;
    let items = [];
    if (multiple) {
      items = value.reduce((memo, v) => {
        const match = options.find(option => option.value === v);
        if (match) {
          memo.push(match);
        }
        return memo;
      }, []);
    } else {
      const match = options.find(option => option.value === value);
      if (match) {
        items.push(match);
      }
    }
    const filteredOptions = this.getOptions();
    const boxShadow = '4px 8px 4px rgba(0, 0, 0, 0.05)';
    const inputStyles = {
      ...getInputStyles({ disabled, hover, focus: open }),
      boxShadow,
    };
    const placeholderStyle = open
      ? { ...inputStyles }
      : { ...inputStyles, boxShadow: 'none' };
    const getParentMaxHeight = num => {
      if (num) {
        return num >= 120 ? num : 120;
      }
      return undefined;
    };
    const getChildMaxHeight = num => {
      if (num) {
        return num - 65 > 0 ? num - 65 : 55;
      }
      return undefined;
    };

    return (
      <div
        id={name}
        className={cx('tau-select', 'tau-input', className, {
          open,
          disabled,
          searchable: enableSearch,
        })}
        ref={this.setRef}
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        {filteredOptions.length > 0 && (
          <Button
            theme="none"
            className="icon"
            onClick={open ? this.close : this.open}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                fill="#dcdcdc"
                d="M69.17 41.273l-18.9 18.9-18.897-18.9c-.78-.78-2.047-.78-2.83 0s-.78 2.047 0 2.828l20.313 20.313c.39.392.903.587 1.415.587.513 0 1.025-.195 1.416-.586l20.312-20.312c.78-.78.78-2.047 0-2.828-.782-.782-2.048-.782-2.83 0z"
              />
            </svg>
          </Button>
        )}
        <Clickable
          className={cx('tau-select-trigger', {
            'has-value': items.length > 0,
            'has-options': filteredOptions.length > 0,
            multiple,
          })}
          data-testid="select-trigger"
          onClick={open ? this.close : this.open}
          style={placeholderStyle}
        >
          <div className="placeholder">
            {items.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              items.map(item => (
                /* Selected items on top of input */
                <Button
                  className="item"
                  data-testid={`selected-item-${item.value}`}
                  data-value={item.value}
                  key={item.value}
                  onClick={e => this.onSelectedItemClick(item, e)}
                  theme="none"
                >
                  {item.label}
                  {multiple && ' x'}
                </Button>
              ))
            )}
          </div>
          {enableSearch && (
            <div className="search">
              <input
                data-testid="select-search"
                onChange={this.onSearchChange}
                onClick={e => e.stopPropagation()}
                onKeyDown={this.onSearchKeyDown}
                placeholder={searchPlaceholder}
                ref={this.setSearchRef}
                type="text"
                value={search}
              />
            </div>
          )}
        </Clickable>
        <div
          aria-expanded={open}
          data-testid="options-container"
          className={this.getOptionsClassName()}
          ref={this.setOptionsRef}
          style={{
            ...inputStyles,
            maxHeight: getParentMaxHeight(maxHeight),
          }}
        >
          <div
            className="container"
            style={{ maxHeight: getChildMaxHeight(maxHeight) }}
          >
            {filteredOptions.length === 0 ? (
              <div className="option">{noSearchResultsLabel}</div>
            ) : (
              filteredOptions.map(item => (
                <Option
                  key={item.label}
                  label={item.label}
                  onClick={this.onOptionClick}
                  search={search}
                  value={item.value}
                />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Select;
