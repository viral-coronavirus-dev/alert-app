import React from 'react'
import Steps from 'rc-steps'
import SymptomsStep from './steps/SymptomsStep'
import Button from './components/Button'

const isContinueButtonDisabled = [
    // Symptoms
    ({symptoms}) => (!Object.values(symptoms)
        .map(s => s.value)
        .some(s => s)),
    () => true,
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
    }

    nextPage() {
        this.setState({
            pageIndex: this.state.pageIndex + 1
        })
    }

    render() {
        const {pageIndex} = this.state

        const continueIsDisabled = isContinueButtonDisabled[pageIndex](this.state)

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
                        {pageIndex === 0 ? (<SymptomsStep symptoms={this.state.symptoms} onClick={(symptomId) => {
                            this.setState(state => {
                                state.symptoms[symptomId].value = !state.symptoms[symptomId].value
                                return state
                            })
                        }}/>) : ''}
                    </div>

                    <div className={"mt-4 text-center"}>
                        <Button onClick={() => this.nextPage()}
                                color={continueIsDisabled ? "gray-400" : 'green-500'}
                                disabled={continueIsDisabled}>Continue</Button>
                    </div>
                </div>
            </div>
        )
    }
}
