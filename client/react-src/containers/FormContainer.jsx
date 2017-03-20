import React, { Component, PropTypes } from 'react';
import { ajax } from 'jquery';
import FormInput from '../components/FormInput';
import { reqProps, checkInputs } from '../../utils/utils';

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.nodeEndpoint = '/node';
    this.state = {
      serverMessage: null,
    };
  }

  submitForm(event) {
    event.preventDefault();
    event.stopPropagation();

    const { actionName } = this.props;
    if (!checkInputs(actionName, this.form)) return;

    // eslint-disable-next-line prefer-const
    let { type, url, data } = reqProps(this.form)[actionName];
    url = this.nodeEndpoint.concat(url);
    data = data ? JSON.stringify(data) : '';

    ajax({
      type,
      url,
      data,
      processData: false,
      contentType: 'application/json',
      // TODO: clean this up
      // removed beforeSend authorization function that's in default build
      // auth is being done by default on the nodeRouter.
    })
    .done(response => this.setState({ serverMessage: response }));
  }

  render() {
    const {
      title,
      actionName,
      formClass = '',
      formInputs,
    } = this.props;

    const composeInput = ({ label, name, type, min, step }) => (
      <FormInput
        label={label}
        name={name}
        type={type}
        min={min}
        step={step}
        key={name}
      />
    );

    return (
      <div className="panel panel-primary" ref={(form) => { this.form = form; }}>
        <div className="panel-heading">
          <h3>{title}</h3>
        </div>
        <div className="panel-body">
          <form className={formClass}>
            {formInputs.map(composeInput)}
            <button
              className="btn btn-success pull-right"
              data-action={actionName}
              onClick={event => this.submitForm(event)}
            >
              Submit
            </button>
          </form>
        </div>
        {!!this.state.serverMessage &&
          <div className="well server-message">
            <h4>Response from Server:</h4>
            <pre>{JSON.stringify(this.state.serverMessage, null, '\t')}</pre>
          </div>
        }
      </div>
    );
  }
}

FormContainer.propTypes = {
  title: PropTypes.string.isRequired,
  actionName: PropTypes.string.isRequired,
  formClass: PropTypes.string,
  formInputs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default FormContainer;
