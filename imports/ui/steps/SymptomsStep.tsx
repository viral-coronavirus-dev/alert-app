import React from "react";
import StepTitle from "./StepTitle";

export default function SymptomsStep(props) {
  return (
    <div className={"text-center mx-auto"} style={{ maxWidth: "70%" }}>
      <StepTitle>Which symptoms do you have?</StepTitle>

      <div className={"flex flex-wrap"}>
        {Object.entries(props.symptoms).map(([key, value]) => (
          <div key={key} className={"w-1/2 mb-1 lg:w-1/5 lg:mb-0"}>
            <div
              className={"block cursor-pointer"}
              onClick={() => props.onClick(key, value)}
            >
              <div
                className={`
                                        ${
                  value.value
                    ? "bg-green-500 text-white active-icon-wrapper"
                    : "bg-white text-green-500"
                  } 
                                         rounded-full mx-auto hover-icon-wrapper symptom-icon
                                    `}
              >
                <div className={"relative mx-auto"}>
                  <img
                    className={"absolute top-0 left-0 icon"}
                    src={`/icons/${value.icon}.svg`}
                  />
                  <img
                    className={`absolute top-0 left-0 icon-active`}
                    src={`/icons/${value.icon}_active.svg`}
                  />
                </div>
              </div>
              <div className={"font-light lg:text-lg text-sm"}>
                {value.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
