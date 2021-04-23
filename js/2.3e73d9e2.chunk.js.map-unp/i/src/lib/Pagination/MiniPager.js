import React from 'react';
import PropTypes from 'prop-types';
import { ArrowButton } from '../Button';
import { Localization } from '../Localization';
import TRANSLATIONS from './translations/translations';

export default class MiniPager extends React.Component {
  static propTypes = {
    current: PropTypes.number.isRequired,
    nextAction: PropTypes.func.isRequired,
    prevAction: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  render() {
    const { current, nextAction, prevAction, total } = this.props;

    const prevDisabled = current <= 1;
    const nextDisabled = current >= total;

    return (
      <div className="mini-pager-container">
        <span>
          {current}
          &nbsp;
          {Localization.translate('pagination.of')}
          &nbsp;
          {total}
        </span>
        <ArrowButton
          direction="left"
          disabled={prevDisabled}
          onClick={prevAction}
        />
        <ArrowButton
          direction="right"
          disabled={nextDisabled}
          onClick={nextAction}
        />
      </div>
    );
  }
}
