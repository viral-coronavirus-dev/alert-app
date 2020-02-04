import React from 'react'

export default function StepTitle(props) {
    return (
        <div className={"mb-2 lg:mt-2 lg:mb-3 text-center font-bold text-base lg:text-2xl uppercase"}>
            {props.children}
        </div>
    )
}
