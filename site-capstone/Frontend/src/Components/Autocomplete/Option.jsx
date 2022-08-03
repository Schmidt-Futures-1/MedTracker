import React from "react";
import cx from "classnames";

// Code from https://codesandbox.io/s/react-select-large-list-ug2f2?file=/src/App.js:41-92

const Option = ({ children, isSelected, innerProps }) => (
  <div
    className={cx("react-select__option", {
      "react-select__option_selected": isSelected
    })}
    id={innerProps.id}
    tabIndex={innerProps.tabIndex}
    onClick={innerProps.onClick}
  >
    {children}
  </div>
);

export default Option;
