import React from 'react'
import StepTitle from './StepTitle'
import Input from '../components/Input'

export default function TwoFactorAuthStep(props) {
    return (
        <div className={"text-center mx-auto"} style={{ maxWidth: "70%"}}>
            <StepTitle>A 6-Digit Code has been sent to your phone</StepTitle>

            <div className={"flex"}>
                <form className={"w-full"} onSubmit={e => {
                    e.preventDefault()
                }}>
                    <Input type={"phone"} placeholder={"6-Digit-Code"} onChange={e => props.onAuthenticated(true)} />
                </form>
            </div>
        </div>
    );
}
