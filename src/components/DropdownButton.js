import React from 'react';
import Select from 'react-select';

const DropdownButton = ({ selectedType, handleDropdownChange }) => {
  const options = [
    { value: "pro", label: "Pro", color: "#2a5599" },
    { value: "basic", label: "Basic", color: "#ffcc00" },
    { value: "student", label: "Student", color: "#4caf50" },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "200px",
      fontSize: "20px",
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      onChange={handleDropdownChange}
      value={options.find(option => option.value === selectedType)}
    />
  );
};

export default DropdownButton;
