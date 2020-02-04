import React from 'react'
import StepTitle from './StepTitle'

export default function RequestAccepted(props) {
    return (
        <div className={"text-center mx-auto step-wrapper"}>
            <StepTitle>Request Accepted</StepTitle>

            <div className={"py-4 mx-auto text-xl uppercase text-green-500"} style={{ maxWidth: "520px" }}>
                The appropriate authorities will get in touch with you soon
            </div>
        </div>
    );
}
