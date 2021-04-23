import PropTypes from 'prop-types';
import React from 'react';
import { cx } from '../../utils';
import { InfoTooltip } from '../../Tooltip';
import { Clickable } from '../../Button';
import { Localization } from '../../Localization';
import { getInputStyles } from '../../Text';
import TRANSLATIONS from '../translations/translations';

export default class SelectInput extends React.Component {
  static propTypes = {
    arrowStyle: PropTypes.string,
    className: PropTypes.string,
    content: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    contentClassName: PropTypes.string,
    label: PropTypes.string,
    onClose: PropTypes.func,
    onShow: PropTypes.func,
    selectedContent: PropTypes.arrayOf(PropTypes.string),
    showContent: PropTypes.bool,
    target: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    tooltipText: PropTypes.string,
    width: PropTypes.number,
  };

  static defaultProps = {
    arrowStyle: '',
    className: '',
    contentClassName: '',
    label: '',
    onClose: () => {},
    onShow: () => {},
    selectedContent: [],
    showContent: false,
    target: null,
    tooltipText: '',
    width: null,
  };

  constructor(props) {
    super();
    this.state = {
      hover: false,
      show: props.showContent || false,
    };
  }

  componentDidMount() {
    document.body.addEventListener('mousedown', this.handleMousedown);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousedown', this.handleMousedown);
  }

  setRef = el => {
    this.el = el;
  };

  setContentRef = el => {
    this.content = el;
  };

  handleMousedown = event => {
    const { show } = this.state;
    if (show && !this.el.contains(event.target)) {
      this.close();
    }
  };

  toggleShow = () => {
    const { show } = this.state;
    if (show) {
      this.close();
    } else {
      this.show();
    }
  };

  show = () => {
    const { onShow } = this.props;
    this.setState({ show: true });
    onShow();
  };

  close = () => {
    const { onClose } = this.props;
    this.setState({ show: false });
    onClose();
  };

  renderTarget = () => {
    const {
      className,
      label,
      selectedContent,
      target,
      tooltipText,
    } = this.props;

    const { hover, show } = this.state;
    const inputStyles = {
      ...getInputStyles({ hover, focus: show }),
      boxShadow: 'none',
    };
    if (target) {
      return (
        <Clickable className="selectInput-target" onClick={this.toggleShow}>
          {target}
        </Clickable>
      );
    }
    return (
      <div>
        <p title={label}>
          <strong>{label}</strong>
        </p>
        {tooltipText ? (
          <InfoTooltip align="left" theme="light">
            {tooltipText}
          </InfoTooltip>
        ) : null}
        <Clickable
          data-testid="select-input-toggle"
          className={cx('tau-select', className)}
          onClick={this.toggleShow}
        >
          <span
            style={inputStyles}
            className="tau-select-trigger selectedContent"
          >
            <div>
              <strong>
                {selectedContent.length === 0 ? (
                  <div>{Localization.translate('filters.all')}</div>
                ) : (
                  <>
                    {selectedContent.map((item, idx) => (
                      <span title={item} key={item}>
                        {idx < selectedContent.length && idx !== 0 ? ', ' : ''}
                        &nbsp;
                        {Localization.translate(item)}
                      </span>
                    ))}
                  </>
                )}
              </strong>
            </div>
          </span>
          <span className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                fill="#dcdcdc"
                d="M69.17 41.273l-18.9 18.9-18.897-18.9c-.78-.78-2.047-.78-2.83 0s-.78 2.047 0 2.828l20.313 20.313c.39.392.903.587 1.415.587.513 0 1.025-.195 1.416-.586l20.312-20.312c.78-.78.78-2.047 0-2.828-.782-.782-2.048-.782-2.83 0z"
              />
            </svg>
          </span>
        </Clickable>
      </div>
    );
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  renderContent = () => {
    const { content, arrowStyle, width, contentClassName } = this.props;
    const { hover, show } = this.state;
    const inputStyles = {
      ...getInputStyles({ hover, focus: show }),
      boxShadow: '2px 2px 5px 1px #e0e0e0',
      width: `${width}px`,
    };
    return (
      <div className={cx(`${arrowStyle}`, contentClassName)}>
        <div
          ref={this.setContentRef}
          className={cx('selectInput-content')}
          style={inputStyles}
        >
          <div className="selectInput-body">{content}</div>
        </div>
      </div>
    );
  };

  render() {
    const { show } = this.state;
    return (
      <div
        aria-expanded={show}
        data-testid="select-input-container"
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        ref={this.setRef}
      >
        <div className="selectInput">{this.renderTarget()}</div>
        {show && this.renderContent()}
      </div>
    );
  }
}
