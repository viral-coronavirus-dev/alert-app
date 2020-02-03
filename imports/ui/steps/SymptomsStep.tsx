import React from 'react'

export default function SymptomsStep(props) {
    return (
        <div className={"text-center font-bold text-3xl uppercase mx-auto"} style={{ maxWidth: "70%"}}>
            {/* TODO: Create StepTitle.tsx */}
            <div className={"my-2 text-center font-bold text-2xl uppercase"}>
                What symptoms do you have?
            </div>

            <div className={"flex"}>
                {Object.entries(props.symptoms).map(([key, value]) => (
                    <div key={key} className={"inline-block w-1/4"}>
                        <div className={"block cursor-pointer"} onClick={() => props.onClick(key, value)}>
                            <div className={`
                                        ${value.value ? 'bg-green-500 text-white' : 'bg-white text-green-500'} 
                                        hover:bg-green-500 hover:text-white rounded-full mr-3 mx-auto
                                    `}
                                 style={{ width: "150px", height: "150px", fontSize: "82px", paddingTop: "14px" }}>
                                <i className={"fas fa-thermometer"}></i>
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
