import React from 'react'
import phone from 'phone'
import Steps from 'rc-steps'
import {Meteor} from 'meteor/meteor'
import {get, mapValues} from 'lodash/fp'
import SymptomsStep from './steps/SymptomsStep'
import PhoneNumberStep from './steps/PhoneNumberStep'
import TwoFactorAuthStep from './steps/TwoFactorAuthStep'
import AddressStep from './steps/AddressStep'
import RequestAccepted from './steps/RequestAccepted'
import Button from './components/Button'

const isContinueButtonDisabled = [
    // Symptoms
    ({symptoms}) => (!Object.values(symptoms)
        .map(s => s.value)
        .some(s => s)),
    // Phone Number
    ({phoneNumber}) => !phoneNumber,
    // Two Factor Auth
    ({succesfullyAuthenticated}) => !succesfullyAuthenticated,
    // Address Form
    ({address: {fullName, address, city, country, emailAddress}}) => {
        return !(([
            fullName.length > 0,
            address.length > 0,
            city.length > 0,
            country.length > 0,
            emailAddress.length > 0
        ]).every(s => s))
    },
    // Request Accepted
    () => false,
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

        const continueIsDisabled = isContinueButtonDisabled[pageIndex](this.state)

        if (pageIndex === 4) {
            Meteor.call('addViralRequest', {
                symptoms: mapValues(get('value'))(symptoms),
                ...address,
                phoneNumber,
                twoFactorCode,
            })
        }

        return (
            <div className={"fixed bottom-0 inset-y-auto text-black w-screen"}>
                <div className={"bg-white mx-auto p-5 rounded-full rounded-b-none"} style={{maxWidth: "70%"}}>
                    <div className="text-center" style={{display: 'none'}}>
                        <Steps current={pageIndex}>
                            <Steps.Step title="first"/>
                            <Steps.Step title="second"/>
                            <Steps.Step title="third"/>
                        </Steps>
                    </div>

                    <div>
                        {pageIndex === 0 ? (<SymptomsStep symptoms={symptoms} onClick={(symptomId) => {
                            this.setState(state => {
                                state.symptoms[symptomId].value = !state.symptoms[symptomId].value
                                return state
                            })
                        }}/>) : ''}

                        {pageIndex === 1 ? (<PhoneNumberStep onChange={(phoneNumber) => {
                            this.setState(state => {
                                const [formattedNumber] = phone(phoneNumber)

                                state.phoneNumber = formattedNumber
                                return state
                            })
                        }}/>) : ''}

                        {pageIndex === 2 ? (<TwoFactorAuthStep phoneNumber={phoneNumber}
                                                               onAuthenticated={({approved, twoFactorCode}) => {
                                                                   this.setState(state => {
                                                                       state.succesfullyAuthenticated = approved
                                                                       state.twoFactorCode = twoFactorCode

                                                                       return state
                                                                   })

                                                                   if (approved) {
                                                                       this.nextPage()
                                                                   }
                                                               }}/>) : ''}

                        {pageIndex === 3 ? (<AddressStep address={address} onChange={(field, value) => {
                            this.setState(state => {
                                state.address[field] = value
                                return state
                            })
                        }}/>) : ''}

                        {pageIndex === 4 ? (<RequestAccepted/>) : ''}
                    </div>

                    <div className={"mt-4 text-center"} style={{display: ([2,4].includes(pageIndex) ? 'none' : 'inherit')}}>
                        <Button onClick={() => this.nextPage(continueIsDisabled)}
                                color={continueIsDisabled ? "gray-400" : 'green-500'}
                                disabled={continueIsDisabled}>Continue</Button>
                    </div>
                </div>
            </div>
        )
    }
}
