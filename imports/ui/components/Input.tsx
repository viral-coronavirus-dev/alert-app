import React from "react";

export default function Input(props) {
  return (
    <input
      type={props.type ? props.type : "text"}
      value={props.value}
      className={
        "w-full px-3 py-2 lg:p-3 text-sm lg:text-base placeholder-uppercase rounded border-solid border border-black"
      }
      placeholder={props.placeholder}
      maxLength={props.maxlength}
      onChange={props.onChange}
    />
  );
}
