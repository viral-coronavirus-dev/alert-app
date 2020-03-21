import React from "react";
import StepTitle from "./StepTitle";

export default function RequestAccepted(props) {
  return (
    <div className={"text-center mx-auto step-wrapper"}>
      <StepTitle>REQUEST ACCEPTED</StepTitle>

      <div
        className={"py-4 mx-auto text-xl uppercase text-green-500"}
        style={{ maxWidth: "520px" }}
      >
        THANK YOU FOR REPORTING YOUR SYMPTOMS. THE VOLUNTEERS AROUND YOU HAVE
        BEEN NOTIFIED.
      </div>
    </div>
  );
}
