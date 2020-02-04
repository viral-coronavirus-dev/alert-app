import React from 'react'
import StepTitle from './StepTitle'
import Input from '../components/Input'
import CountrySelect from '../components/CountrySelect'

export default function AddressStep(props) {
    return (
        <div className={"text-center mx-auto step-wrapper"}>
            <StepTitle>Your Address</StepTitle>

            <div className={"flex"}>
                <form className={"w-full"} onSubmit={e => {
                    e.preventDefault()
                }}>
                    <div className="w-full ">
                        <Input
                            placeholder={"Full Name"}
                            type={"text"}
                            onChange={(e) => props.onChange('fullName', e.target.value)}
                        />
                    </div>

                    <div className="w-full mt-3">
                        <Input
                            placeholder={"Address"}
                            type={"text"}
                            onChange={(e) => props.onChange('address', e.target.value)}
                        />
                    </div>

                    <div className="lg:flex mt-3">
                        <div className="w-full lg:w-1/2 pr-0 lg:pr-1">
                            <Input
                                placeholder={"City / Province"}
                                type={"text"}
                                onChange={(e) => props.onChange('city', e.target.value)}
                            />
                        </div>

                        <div className="w-full mt-3 lg:mt-0 lg:w-1/2 pl-0 lg:pl-1 country-select">
                            <CountrySelect onChange={({ value }) => props.onChange('country', value)} />
                        </div>
                    </div>

                    <div className="w-full mt-3">
                        <Input
                            placeholder={"Email Address"}
                            type={"email"}
                            onChange={(e) => props.onChange('emailAddress', e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
