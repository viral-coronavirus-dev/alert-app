import React from 'react'
import phone from 'phone'
import Steps from 'rc-steps'
import isEmail from 'is-email'
import {Meteor} from 'meteor/meteor'
import {get, mapValues} from 'lodash/fp'
import SymptomsStep from './steps/SymptomsStep'
import PhoneNumberStep from './steps/PhoneNumberStep'
import TwoFactorAuthStep from './steps/TwoFactorAuthStep'
import AddressStep from './steps/AddressStep'
import RequestAccepted from './steps/RequestAccepted'
import Button from './components/Button'

/*
    TODO: create github issues:
     - Restrict MongoDB Access
     - Only allow two factor auth for phone once a day?
     - Better alert on wrong code
     - Better form errors on invalid data
*/

const steps = [
    {
        key: 'symptoms',
        isContinueDisabled: ({symptoms}) => (!Object.values(symptoms)
            .map(s => s.value)
            .some(s => s)),
    },
    {
        key: 'phoneNumber',
        isContinueDisabled: ({phoneNumber}) => !phoneNumber,
    },
    {
        key: 'twoFactorAuth',
        hideContinue: true,
    },
    {
        key: 'addressForm',
        isContinueDisabled: ({address: {fullName, address, city, country, emailAddress}}) => {
            return !(([
                fullName.length >= 3,
                address.length >= 3,
                city.length >= 3,
                country.length > 0,
                isEmail(emailAddress),
            ]).every(s => s))
        },
    },
    {
        key: 'requestAccepted',
        hideContinue: true,
    }
]

export default class AlertWorkflow extends React.Component {
    state = {
        pageIndex: 0,
        symptoms: {
            fever: {icon: 'fever', title: 'Fever', value: false},
            cough: {icon: 'cough', title: 'Cough', value: false},
            shortness_of_breath: {icon: 'lung', title: 'Shortness of breath', value: false},
            runny_nose: {icon: 'nose', title: 'Runny Nose', value: false},
        },
        phoneNumber: '',
        succesfullyAuthenticated: false,
        twoFactorCode: '',
        address: {
            fullName: '',
            address: '',
            city: '',
            country: '',
            emailAddress: '',
        }
    }

    nextPage(isDisabled: boolean) {
        if (!isDisabled) {
            this.setState({
                pageIndex: this.state.pageIndex + 1
            })
        }
    }

    render() {
        const {pageIndex, symptoms, phoneNumber, address, twoFactorCode} = this.state
        const currentStep = steps[pageIndex]
        const {key, isContinueDisabled, hideContinue} = currentStep
        const continueIsDisabled = isContinueDisabled ? isContinueDisabled(this.state) : false

        if (key === 'requestAccepted') {
            Meteor.call('addViralRequest', {
                symptoms: mapValues(get('value'))(symptoms),
                ...address,
                phoneNumber,
                twoFactorCode,
            })
        }

        return (
            <div className={"fixed bottom-0 inset-y-auto text-black w-screen"}>
                <div className={"bg-white mb-10 lg:mb-0 mx-auto p-3 lg:p-5 shadow rounded-lg rounded-b-none lg:rounded-full lg:rounded-b-none"} style={{maxWidth: "70%"}}>
                    <div className="text-center" style={{display: 'none'}}>
                        <Steps current={pageIndex}>
                            <Steps.Step title="first"/>
                            <Steps.Step title="second"/>
                            <Steps.Step title="third"/>
                        </Steps>
                    </div>

                    <div>
                        {key === 'symptoms' ? <SymptomsStep symptoms={symptoms} onClick={(symptomId) => {
                            this.setState(state => {
                                state.symptoms[symptomId].value = !state.symptoms[symptomId].value
                                return state
                            })
                        }}/> : ''}

                        {key === 'phoneNumber' ? <PhoneNumberStep onChange={(phoneNumber) => {
                            this.setState(state => {
                                const [formattedNumber] = phone(phoneNumber)

                                console.log(phoneNumber, formattedNumber)

                                state.phoneNumber = formattedNumber
                                return state
                            })
                        }}/> : ''}

                        {key === 'twoFactorAuth' ? <TwoFactorAuthStep phoneNumber={phoneNumber}
                                                               onAuthenticated={({approved, twoFactorCode}) => {
                                                                   this.setState(state => {
                                                                       state.succesfullyAuthenticated = approved
                                                                       state.twoFactorCode = twoFactorCode

                                                                       return state
                                                                   })

                                                                   if (approved) {
                                                                       this.nextPage()
                                                                   }
                                                               }}/> : ''}

                        {key === 'addressForm' ? <AddressStep address={address} onChange={(field, value) => {
                            this.setState(state => {
                                state.address[field] = value
                                return state
                            })
                        }}/> : ''}

                        {key === 'requestAccepted' ? <RequestAccepted/> : ''}
                    </div>

                    <div className={"mt-3 mb-3 lg:mb-0 text-center"} style={{display: (hideContinue ? 'none' : 'inherit')}}>
                        <Button onClick={() => this.nextPage(continueIsDisabled)}
                                color={continueIsDisabled ? "gray-400" : 'green-500'}
                                disabled={continueIsDisabled}>Continue</Button>
                    </div>
                </div>
            </div>
        )
    }
}
