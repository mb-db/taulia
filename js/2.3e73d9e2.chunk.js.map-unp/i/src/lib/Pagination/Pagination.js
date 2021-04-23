import PropTypes from 'prop-types';
import React from 'react';
import { range } from 'lodash';
import { cx } from '../utils';
import { Button } from '../Button';
import { Select } from '../Select';
import { Localization } from '../Localization';

import TRANSLATIONS from './translations/translations';

export default class Pagination extends React.Component {
  static propTypes = {
    dataLength: PropTypes.number,
    first: PropTypes.number,
    nextButtonDisabled: PropTypes.bool,
    onPageChange: PropTypes.func, // Event handler for when the page or pageSize occurs
    page: PropTypes.number.isRequired, // The currently selected page
    pageSize: PropTypes.number.isRequired, // The currently selected page size
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number), // Page size options, [10, 25, 50, 100] is default
    showResultsDropdown: PropTypes.bool, // Do you want to display the show results dropdown, most of the time they want is just the Pagination
    totalCount: PropTypes.number.isRequired, // Total results (including all pages)
    totalPaginationPageOptions: PropTypes.number,
  };

  static defaultProps = {
    dataLength: 0,
    first: 0,
    nextButtonDisabled: false,
    onPageChange: () => {},
    pageSizeOptions: [10, 25, 50, 100],
    showResultsDropdown: true,
    totalPaginationPageOptions: 9,
  };

  state = {
    isMobile: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.checkIfMobile);
    this.checkIfMobile();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkIfMobile);
  }

  getPageSizeOptions() {
    const { pageSizeOptions } = this.props;
    return pageSizeOptions.map(option => ({
      label: option.toString(),
      value: option.toString(),
    }));
  }

  getTotalPages() {
    const { pageSize, totalCount } = this.props;
    return Math.ceil(totalCount / pageSize);
  }

  createBreakLink = direction => {
    return (
      <button
        key={`ellipsis-${direction}`}
        type="button"
        className="pagination-number"
        disabled
      >
        ...
      </button>
    );
  };

  checkIfMobile = () => {
    const { isMobile } = this.state;
    const width = window.innerWidth;
    if (isMobile && width > 900) {
      this.setState({ isMobile: false });
    } else if (!isMobile && width < 900) {
      this.setState({ isMobile: true });
    }
  };

  onPageClick = event => {
    const { pageSize, onPageChange } = this.props;
    const page = parseInt(event.currentTarget.getAttribute('value'), 10);

    onPageChange(page, pageSize);
  };

  onPrevButtonClick = () => {
    const { page, pageSize, onPageChange } = this.props;

    onPageChange(page - 1, pageSize);
  };

  onNextButtonClick = () => {
    const { page, pageSize, onPageChange } = this.props;

    onPageChange(page + 1, pageSize);
  };

  createPaginationArray() {
    const { totalPaginationPageOptions, page } = this.props;
    const totalPages = this.getTotalPages();

    let paginationArray;
    if (totalPages > totalPaginationPageOptions) {
      if (page < 5) {
        paginationArray = this.createRightBreakArray();
      } else if (page > totalPages - 4) {
        paginationArray = this.createLeftBreakArray();
      } else {
        paginationArray = this.createLeftRightBreakArray();
      }
    } else {
      paginationArray = this.createNoBreakArray();
    }

    return paginationArray;
  }

  createRightBreakArray() {
    const { totalPaginationPageOptions } = this.props;
    const totalPages = this.getTotalPages();

    const rightBreakArray = [];

    rightBreakArray.push(
      range(0, totalPaginationPageOptions - 2).map(number =>
        this.createPageLink(number)
      )
    );
    rightBreakArray.push(this.createBreakLink('right'));
    rightBreakArray.push(this.createPageLink(totalPages - 1));

    return rightBreakArray;
  }

  createLeftBreakArray() {
    const totalPages = this.getTotalPages();

    const leftBreakArray = [];

    leftBreakArray.push(this.createPageLink(0));
    leftBreakArray.push(this.createBreakLink('left'));
    leftBreakArray.push(
      range(totalPages - 7, totalPages).map(number =>
        this.createPageLink(number)
      )
    );

    return leftBreakArray;
  }

  createLeftRightBreakArray() {
    const { page } = this.props;
    const totalPages = this.getTotalPages();
    const leftRightBreakArray = [];

    leftRightBreakArray.push(this.createPageLink(0));
    leftRightBreakArray.push(this.createBreakLink('left'));
    leftRightBreakArray.push(
      range(page - 3, page + 2).map(number => this.createPageLink(number))
    );
    leftRightBreakArray.push(this.createBreakLink('right'));
    leftRightBreakArray.push(this.createPageLink(totalPages - 1));

    return leftRightBreakArray;
  }

  createNoBreakArray() {
    const totalPages = this.getTotalPages();
    const noBreakArray = [];

    noBreakArray.push(
      range(0, totalPages).map(number => this.createPageLink(number))
    );

    return noBreakArray;
  }

  createPageLink(number) {
    const { page } = this.props;
    const active = page === number;

    // Always create a new key, since there is a noticeable flicker as react moves things around otherwise.
    const key = this.nextLinkKey || 0;
    this.nextLinkKey = key + 1;

    return (
      <Button
        key={key}
        value={number}
        className={cx('pagination-number', { active })}
        onClick={this.onPageClick}
        disabled={active}
        theme="none"
      >
        {number + 1}
      </Button>
    );
  }

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  render() {
    const {
      dataLength,
      first,
      nextButtonDisabled,
      onPageChange,
      page,
      pageSize,
      showResultsDropdown,
    } = this.props;
    const { isMobile } = this.state;
    const totalPages = this.getTotalPages();
    const prevDisabled = totalPages ? page <= 0 : first === 0;
    const nextDisabled =
      nextButtonDisabled || totalPages
        ? page >= totalPages - 1
        : dataLength < pageSize;

    return (
      <div className="pagination-container">
        {showResultsDropdown && !isMobile && (
          <div className="dropdown-container">
            <span>{Localization.translate('pagination.view')}</span>
            <Select
              enableSearch={false}
              multiple={false}
              onChange={num => onPageChange(0, parseInt(num, 10))}
              options={this.getPageSizeOptions()}
              placeholder={Localization.translate('pagination.selectOne')}
              value={pageSize.toString()}
            />
            <span>{Localization.translate('pagination.records')}</span>
          </div>
        )}

        <div className="button-container">
          <Button disabled={prevDisabled} onClick={this.onPrevButtonClick}>
            {Localization.translate('pagination.previousLabel')}
          </Button>
          {totalPages > 1 && !isMobile && this.createPaginationArray()}
          <Button disabled={nextDisabled} onClick={this.onNextButtonClick}>
            {Localization.translate('pagination.nextLabel')}
          </Button>
        </div>
      </div>
    );
  }
}
