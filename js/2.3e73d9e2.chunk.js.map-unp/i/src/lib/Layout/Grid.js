import PropTypes from 'prop-types';
import React from 'react';
import { omit } from 'lodash';
import { cx } from '../utils';
import Col from './Col';
import Breakpoints from './Breakpoints';

class Grid extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    elRef: PropTypes.func,
    gutter: PropTypes.number,
    spacer: PropTypes.number,
    style: PropTypes.shape(),
    trimPadding: PropTypes.bool,
  };

  static defaultProps = {
    children: null,
    className: '',
    elRef: null,
    gutter: 0,
    spacer: 0,
    style: {},
    trimPadding: true,
  };

  state = {
    width: window.innerWidth,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  getColClassName = () => {
    const { width } = this.state;
    const { SM, LG } = Breakpoints.fetchAll();
    if (width < SM) {
      return 'sm';
    }
    if (width >= LG) {
      return 'lg';
    }
    if (width >= SM) {
      return 'md';
    }
    return '';
  };

  getColWidth = ({ sm, md, lg }) => {
    const { width } = this.state;
    const { SM, LG } = Breakpoints.fetchAll();
    if (width < SM) {
      return sm;
    }
    if (width >= LG) {
      return lg;
    }
    if (width >= SM) {
      return md;
    }
    return 0;
  };

  getColOffset = ({ smOffset, mdOffset, lgOffset }) => {
    const { width } = this.state;
    const { SM, LG } = Breakpoints.fetchAll();
    if (width < SM && smOffset) {
      return smOffset;
    }
    if (width >= LG && lgOffset) {
      return lgOffset;
    }
    if (width >= SM && mdOffset) {
      return mdOffset;
    }
    return 0;
  };

  setRef = el => {
    const { elRef } = this.props;
    if (elRef) {
      elRef(el);
    }
  };

  updateWidth = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const {
      children,
      className,
      gutter,
      spacer,
      style,
      trimPadding,
      ...otherProps
    } = this.props;
    const halfGutter = gutter / 2;
    const halfSpacer = spacer / 2;
    const gridStyle = {
      ...style,
      paddingLeft: halfGutter,
      paddingRight: halfGutter,
    };
    const rows = [{ width: 0, elems: [] }];
    React.Children.forEach(children, child => {
      if (child.type === Col) {
        const colWidth = this.getColWidth(child.props);
        const colOffset = this.getColOffset(child.props);
        if (colWidth > 0) {
          const row = rows[rows.length - 1];
          const rowWidth = row.width + colWidth + colOffset;
          const elem = React.cloneElement(child, {
            noGrid: false,
            style: {
              ...child.props.style,
              width: `${colWidth}%`,
              marginLeft: `${colOffset}%`,
            },
          });
          if (rowWidth <= 100) {
            row.width = rowWidth;
            row.elems.push(elem);
          } else {
            rows.push({ width: colWidth + colOffset, elems: [elem] });
          }
        }
      } else {
        throw new Error(
          `A Grid cannot have any immediate children other than a "Col", or another "Grid". Element of type [${child.type.displayName}] was passed instead.`
        );
      }
    });
    const numRows = rows.length - 1;
    return (
      <div
        style={gridStyle}
        className={cx('tau-grid', className, this.getColClassName())}
        ref={this.setRef}
        {...omit(otherProps, 'ref', 'elRef')}
      >
        {rows.map(({ elems }, idx) => {
          const rowKey = `row-${idx}`;
          const rowStyle = {
            marginLeft: -halfGutter,
            marginRight: -halfGutter,
            marginTop: idx === 0 ? null : halfSpacer,
            marginBottom: idx === numRows ? null : halfSpacer,
          };
          const numCols = elems.length - 1;

          return (
            <div key={rowKey} className="tau-row" style={rowStyle}>
              {elems.map((elem, idy) => {
                const elemKey = `elem-${idy}`;
                return React.cloneElement(elem, {
                  key: elemKey,
                  style: {
                    ...elem.props.style,
                    paddingLeft: trimPadding && idy === 0 ? null : halfGutter,
                    paddingRight:
                      trimPadding && idy === numCols ? null : halfGutter,
                  },
                });
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Grid;
