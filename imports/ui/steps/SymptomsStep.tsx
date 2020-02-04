import React from 'react'
import StepTitle from './StepTitle'

export default function SymptomsStep(props) {
    return (
        <div className={"text-center mx-auto"} style={{ maxWidth: "70%"}}>
            <StepTitle>What symptoms do you have?</StepTitle>

            <div className={"flex"}>
                {Object.entries(props.symptoms).map(([key, value]) => (
                    <div key={key} className={"w-1/2 lg-w-1/4"}>
                        <div className={"block cursor-pointer"} onClick={() => props.onClick(key, value)}>
                            <div className={`
                                        ${value.value ? 'bg-green-500 text-white active-icon-wrapper' : 'bg-white text-green-500'} 
                                        hover:bg-green-500 hover:text-white rounded-full mr-3 mx-auto hover-icon-wrapper
                                    `}
                                 style={{ width: "150px", height: "150px", fontSize: "82px", paddingTop: "14px" }}>
                                <div className={"relative"} style={{ maxWidth: "90px", margin: "0 auto", top: "16px"}}>
                                    <img className={"absolute top-0 left-0 icon"} src={`/icons/${value.icon}.svg`} />
                                    <img className={`absolute top-0 left-0 icon-active`}
                                         src={`/icons/${value.icon}_active.svg`} />
                                </div>
                            </div>
                            <div className={"font-light text-lg"}>
                                {value.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
