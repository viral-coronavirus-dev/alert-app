import React from 'react'
import StepTitle from './StepTitle'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function PhoneNumberStep(props) {
  return (
    <div className={"text-center mx-auto step-wrapper"}>
      <StepTitle>Please enter your phone number</StepTitle>

      <div className={"flex"}>
        <form
          className={"w-full"}
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <PhoneInput
            type={"text"}
            defaultCountry={props.country}
            className={"w-full px-3 py-2 lg:p-3 text-sm lg:text-base placeholder-uppercase rounded border-solid border border-black"}
            placeholder={"Phone number"}
            onChange={phone => {
              props.onChange(phone);
            }}
          />
        </form>
      </div>
    </div>
  );
}
