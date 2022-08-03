import React from "react";
import Select, {createFilter} from "react-select";

import MenuList from "./MenuList";
import Option from "./Option";

import "../CreateMedicationPage/CreateMedicationPage.css";

// Code from https://codesandbox.io/s/react-select-large-list-ug2f2?file=/src/App.js:41-92

const ReactSelect = ({
  options,
  value,
  onChange,
  placeholder
}) => {
  return (
    <Select
      options={options}
      value={value && [value]}
      onChange={onChange}
      isClearable={true}
      closeMenuOnSelect={true}
      classNamePrefix="react-select"
      placeholder={placeholder}
      filterOption={createFilter({ ignoreAccents: false })}
      components={{
        MenuList,
        Option
      }}
    />
  );
};

export default ReactSelect;
