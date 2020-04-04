import React from "react";
import StepTitle from "./StepTitle";
import Input from "../components/Input";

export default function VolunteerRegisterStep(props) {
    const {
        fullName,
        address,
        emailAddress,
        phoneNumber,
        profession
    } = props.volunteerRegister;

    return (
        <div className={"text-center mx-auto step-wrapper"}>
            <StepTitle>Register</StepTitle>

            <div className={"flex"}>
                <form
                    className={"w-full"}
                    onSubmit={e => {
                        e.preventDefault();
                    }}
                >
                    <div className="w-full ">
                        <Input
                            placeholder={"Full Name"}
                            type={"text"}
                            value={fullName}
                            onChange={e => props.onChange("fullName", e.target.value)}
                        />
                    </div>
                    <div className="lg:flex mt-3">
                        <div className="w-full lg:w-1/2 pr-0 lg:pr-1">
                            <Input
                                placeholder={"Address"}
                                type={"text"}
                                value={address}
                                onChange={e => props.onChange("address", e.target.value)}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 pr-0 lg:pr-1">
                            <Input
                                placeholder={"Email Address"}
                                type={"text"}
                                value={emailAddress}
                                onChange={e => props.onChange("emailAddress", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="lg:flex mt-3">
                        <div className="w-full lg:w-1/2 pr-0 lg:pr-1">
                            <Input
                                placeholder={"Phone"}
                                type={"number"}
                                value={phoneNumber}
                                onChange={e => props.onChange("phoneNumber", e.target.value)}
                            />
                        </div>
                        <div className="w-full lg:w-1/2 pr-0 lg:pr-1">
                            <Input
                                placeholder={"Profession"}
                                type={"text"}
                                value={profession}
                                onChange={e => props.onChange("profession", e.target.value)}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
