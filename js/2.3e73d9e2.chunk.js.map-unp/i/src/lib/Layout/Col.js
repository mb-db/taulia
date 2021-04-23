import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../utils';

class Col extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    elRef: PropTypes.func,
    noGrid: PropTypes.bool,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    className: '',
    elRef: null,
    noGrid: true,
    style: {},
  };

  setRef = el => {
    const { elRef } = this.props;
    if (elRef) {
      elRef(el);
    }
  };

  render() {
    const { noGrid, children, className, style } = this.props;
    if (noGrid) {
      throw new Error(
        'Col elements need to be a direct descendant of a parent Grid element.'
      );
    }
    return (
      <div className={cx('tau-col', className)} style={style} ref={this.setRef}>
        {children}
      </div>
    );
  }
}

export default Col;
