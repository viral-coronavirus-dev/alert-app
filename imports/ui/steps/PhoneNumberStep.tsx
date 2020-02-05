import React from 'react'
import StepTitle from './StepTitle'
import Input from '../components/Input'

export default function PhoneNumberStep(props) {
    return (
        <div className={"text-center mx-auto step-wrapper"}>
            <StepTitle>Please enter your phone number</StepTitle>

            <div className={"flex"}>
                <form className={"w-full"} onSubmit={e => {
                    e.preventDefault()
                }}>
                    <Input type={"text"} placeholder={"Phone number"} onChange={(e) => props.onChange(e.target.value)} />
                </form>
            </div>
        </div>
    );
}