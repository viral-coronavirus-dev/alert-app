import React from 'react'

export default function StepTitle(props) {
    return (
        <div className={"mt-2 mb-3 text-center font-bold text-2xl uppercase"}>
            {props.children}
        </div>
    )
}
