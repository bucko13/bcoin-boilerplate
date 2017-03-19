import React, { PropTypes } from 'react';
import FormInput from '../components/FormInput';

const FormContainer = ({
  title,
  actionName,
  formClass = '',
  formInputs,
}) => (
  <div className="panel panel-primary">
    <div className="panel-heading">
      <h3>{title}</h3>
    </div>
    <div className="panel-body">
      <form className={formClass}>
        {
          formInputs.map(({ label, name, type }) => (
            <FormInput
              label={label}
              name={name}
              type={type}
              key={name}
            />
          ))
        }
        <button className="btn btn-success pull-right" data-action={actionName}>Submit</button>
      </form>
    </div>
  </div>
);

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
