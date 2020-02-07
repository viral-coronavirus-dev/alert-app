import {Meteor} from 'meteor/meteor'
import React, {useState} from 'react'
import StepTitle from './StepTitle'
import Input from '../components/Input'
import Button from '../components/Button'
import { useAlert } from 'react-alert'

let hasSentAlready = false

const hasValidCode = (code: string) => code.length === 6

const sendAuthenticationTokenOnce = (phoneNumber) => {
    if (hasSentAlready) return null

    Meteor.call('sendVerificationToken', phoneNumber, (err) => {
        if (err) return null
        hasSentAlready = true
    })
}

export default function TwoFactorAuthStep(props) {
    const [code, setCode] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const isValidCode = hasValidCode(code)

    const {phoneNumber} = props

    sendAuthenticationTokenOnce(phoneNumber)

    const alert = useAlert()
    
    return (
        <div className={"text-center mx-auto step-wrapper"}>
            <StepTitle>A 6-Digit Code has been sent to your phone</StepTitle>

            <div className={"flex"}>
                <form className={"w-full"} onSubmit={e => {
                    e.preventDefault()
                }}>
                    <Input type={"number"} placeholder={"6-Digit-Code"} onChange={e => setCode(e.target.value.toString())}/>

                    {!isAuthenticated && (<div className={"my-3"}>
                        <Button color={isValidCode ? "green-500" : "gray-400"}
                                onClick={() => {
                                    if (isValidCode) {                                       
                                        Meteor.call('checkVerificationToken', {phoneNumber, code}, (err, result) => {
                                            if (err || !result.approved) { 
                                                alert.error('Invalid Auth Code!')
                                                return null
                                            }

                                            setIsAuthenticated(result.approved)
                                            props.onAuthenticated({ approved: result.approved, twoFactorCode: code })
                                        })
                                    }
                                }}
                                disabled={!isValidCode}>Check Code</Button>
                    </div>)}
                </form>
            </div>
        </div>
    );
}
