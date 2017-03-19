import React, { PropTypes } from 'react';

const FormItem = ({
  label,
  name,
  type,
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input type={type} name={name} className={`form-control ${name}`} />
  </div>
);

FormItem.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default FormItem;
