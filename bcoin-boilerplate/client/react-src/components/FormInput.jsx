import React, { PropTypes } from 'react';

const FormInput = ({
  label,
  name,
  type,
  min,
  step,
}) => {
  let input;
  if (type === 'textarea') {
    input = <textarea name={name} className={`form-control ${name}`} />;
  } else {
    input =
    (<input
      type={type}
      name={name}
      className={`form-control ${name}`}
      min={min}
      step={step}
    />);
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {input}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default FormInput;
