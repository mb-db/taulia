/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';
import { omit, some } from 'lodash';
import { cx } from '../utils';

const elm = document.createElement('div');
let animation = elm.style.animationName !== undefined;
if (animation === false) {
  animation = some(
    'Webkit Moz O ms Khtml'.split(' '),
    prefix => elm.style[`${prefix}AnimationName`] !== undefined
  );
}
if (animation === true) {
  animation = <span className="animate" />;
} else {
  animation = (
    <span className="animate text">
      <span>Loading...</span>
    </span>
  );
}

class Progress extends React.Component {
  static propTypes = {
    showSpinner: PropTypes.bool,
    position: PropTypes.oneOf([
      'relative',
      'fixed',
      'absolute',
      'relative-centered',
    ]),
    theme: PropTypes.oneOf(['light', 'dark']),
    delay: PropTypes.number,
    centerin: PropTypes.string,
  };

  static defaultProps = {
    showSpinner: true,
    position: 'absolute',
    theme: 'light',
    delay: 0,
    centerin: null,
  };

  state = {
    spinning: this.props.delay === 0,
    height: 0,
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.delay > 0) {
      this.timeout = setTimeout(
        () => this.setState({ spinning: true }),
        this.props.delay
      );
    }
    if (this.props.position === 'relative-centered') {
      this.setState({ height: this.getParentHeight(this.containerRef) });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  getParentHeight(ref) {
    let parentHeight = 0;
    const { centerin } = this.props;
    while (ref && ref.parentNode && !parentHeight) {
      if (centerin) {
        if (ref.parentNode.matches(centerin)) {
          parentHeight = ref.parentNode.offsetHeight;
        }
      } else if (ref.parentNode.offsetHeight) {
        parentHeight = ref.parentNode.offsetHeight;
      }
      ref = ref.parentNode;
    }
    return parentHeight;
  }

  render() {
    const { position, showSpinner, theme, ...otherProps } = this.props;
    const { height } = this.state;
    return (
      <div
        className={cx('tau-progress', `is-${position}`, `theme-${theme}`)}
        {...omit(otherProps, 'delay')}
        ref={ref => {
          this.containerRef = ref;
        }}
        style={height ? { height } : null}
      >
        {showSpinner && this.state.spinning ? animation : null}
      </div>
    );
  }
}

export default Progress;
