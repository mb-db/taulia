/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import validate from 'validate.js';
import { every, map, reduce } from 'lodash';
import { Col, Grid } from '../../Layout';
import {
  Field,
  FieldErrorMap,
  FieldGroup,
  FieldGroupAddon,
  FieldLabel,
} from '..';
import {
  Alert,
  Branding,
  Checkbox,
  Localization,
  Text,
  Translate,
} from '../..';
import { LockIcon } from '../../Icons';

import TRANSLATIONS from '../translations/translations';

validate.validators.match = (value, options, key, attributes) => {
  let { email } = attributes;
  if (!email || email.length === 0 || email.indexOf('@') === -1) {
    email = '';
  }
  email = email.substring(0, email.indexOf('@')).toLowerCase();
  if (
    !value ||
    (value.length === 0 && email.length === 0) ||
    (email.length > 0 && value.toLowerCase().indexOf(email) > -1)
  ) {
    return '^match';
  }
  return null;
};

validate.validators.upper = value => {
  if (value && value.length > 0 && value.match(/[A-Z]+/)) {
    return null;
  }
  return '^upper';
};

validate.validators.lower = value => {
  if (value && value.length > 0 && value.match(/[a-z]+/)) {
    return null;
  }
  return '^lower';
};

validate.validators.number = value => {
  if (value && value.length > 0 && value.match(/[0-9]+/)) {
    return null;
  }
  return '^number';
};

class PasswordValidator extends React.Component {
  static propTypes = {
    password: PropTypes.object,
    email: PropTypes.object,
    handleInputChange: PropTypes.func,
    changePassword: PropTypes.bool,
  };

  static defaultProps = {
    changePassword: false,
    email: { value: '' },
    password: {
      value: '',
      error: null,
      validations: {
        length: false,
        upper: false,
        lower: false,
        number: false,
        match: false,
      },
    },
    handleInputChange: () => null,
  };

  state = {
    password: this.props.password,
    showPassword: false,
  };

  performPasswordValidations(value, email) {
    const errors = validate(
      { email, password: value },
      {
        password: {
          presence: { message: '^length' },
          length: { minimum: 8, maximum: 72, message: '^length' },
          upper: true,
          lower: true,
          number: true,
          match: true,
        },
      }
    );
    const validations = reduce(
      this.state.password.validations,
      (memo, val, validation) => {
        memo[validation] = errors
          ? errors.password && errors.password.indexOf(validation) === -1
          : true;
        return memo;
      },
      {}
    );
    return {
      value,
      error: null,
      validations,
    };
  }

  updateShowPassword = event => {
    this.setState({ showPassword: event.target.checked === true });
  };

  updatePassword = event => {
    const value = event.target.value;
    const updatedPassword = this.performPasswordValidations(
      value,
      this.props.email.value
    );
    this.setState({
      password: { ...updatedPassword },
    });
    this.props.handleInputChange(updatedPassword);
  };

  passwordValidationBlock = () => {
    if (every(this.state.password.validations)) {
      return (
        <Grid gutter={20} spacer={12} className="password-validations">
          <Col sm={100} md={100} lg={100}>
            <Alert theme="success">
              <LockIcon
                className="icon"
                style={{ width: 20, height: 20, position: 'absolute' }}
              />
              <p
                style={{ marginLeft: 25, lineHeight: '14px', marginBottom: 5 }}
              >
                <Translate code={'password.validations.secure'} />
              </p>
            </Alert>
          </Col>
        </Grid>
      );
    }
    return (
      <Grid gutter={20} spacer={12} className="password-validations">
        {map(this.state.password.validations, (value, code) => (
          <Col sm={100} md={50} lg={50} key={code}>
            <p className={`validation${value ? ' disabled' : ''}`}>
              <span
                className="icon"
                style={{
                  backgroundColor: value
                    ? Branding.fetchColor('primary')
                        .clearer(0.5)
                        .rgbaString()
                    : Branding.fetchColor('primary').hexString(),
                }}
              />
              <Translate code={`password.validations.${code}`} />
            </p>
          </Col>
        ))}
      </Grid>
    );
  };

  UNSAFE_componentWillMount() {
    Localization.setTranslations(TRANSLATIONS);
  }

  render() {
    const { password, showPassword } = this.state;
    const { changePassword } = this.props;
    return (
      <Field validationState={password.error ? 'error' : null}>
        <FieldLabel htmlFor="password">
          <Translate
            code={changePassword ? 'password.newLabel' : 'password.label'}
          />
        </FieldLabel>
        <FieldGroup>
          <Text
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            autoComplete="off"
            value={password.value}
            onChange={this.updatePassword}
          />
          <FieldGroupAddon>
            <Checkbox
              id="showPassword"
              name="showPassword"
              checked={showPassword}
              onChange={this.updateShowPassword}
            >
              <Translate code="showPassword" />
            </Checkbox>
          </FieldGroupAddon>
        </FieldGroup>
        <FieldErrorMap code={password.error}>
          <Translate code="password.error.invalid" />
        </FieldErrorMap>
        {this.passwordValidationBlock()}
      </Field>
    );
  }
}

export default PasswordValidator;
