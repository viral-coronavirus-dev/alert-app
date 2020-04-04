import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import Steps from "rc-steps";
import isEmail from "is-email";
import getCountryISO2 from "country-iso-3-to-2";
import { Meteor } from "meteor/meteor";
import { flow, get, getOr, mapValues, isEqual } from "lodash/fp";
import LocationStep from "./steps/LocationStep";
import HomeStep from "./steps/HomeStep";
import PhoneNumberStep from "./steps/PhoneNumberStep";
import TwoFactorAuthStep from "./steps/TwoFactorAuthStep";
import VolunteerRegisterStep from "./steps/VolunteerRegisterStep";
import RequestAccepted from "./steps/RequestAccepted";
import Button from "./components/Button";

const steps = [
  {
    key: "home",
    hideContinue: true
  },
  {
    key: "location",
    hideContinue: true
  },
  {
    key: "phoneNumber",
    isContinueDisabled: ({ phoneNumber }) => !isValidPhoneNumber(phoneNumber)
  },
  {
    key: "twoFactorAuth",
    hideContinue: true
  },
  {
    key: "volunteerForm",
    isContinueDisabled: ({
      volunteerRegister: { fullName, address, emailAddress, phoneNumber, profession }
    }) => {
      return ![
        fullName.length >= 3,
        address.length >= 3,
        isEmail(emailAddress),
        isValidPhoneNumber(phoneNumber),
        profession.length >= 3,

      ].every(s => s);
    }
  },
  {
    key: "requestAccepted",
    hideContinue: true
  }
];


export default class AlertWorkflow extends React.Component {
  state = {
    pageIndex: 0,
    location: {
      country: ""
    },
    home: {
      join: { icon: "team", title: "Join the team in Tech, Marketing or FundingRequest Services", value: false },
      provide: { icon: "sport_team", title: "Provide services to you community", value: false }
    },
    phoneNumber: "",
    succesfullyAuthenticated: false,
    twoFactorCode: "",
    volunteerRegister: {
      fullName: "",
      address: "",
      emailAddress: "",
      phoneNumber: "",
      profession: ""
    },
    isActive: true
  };

  nextPage(isDisabled: boolean) {
    if (!isDisabled) {
      this.setState({
        pageIndex: this.state.pageIndex + 1
      });
    }
  }

  render() {
    const {
      pageIndex,
      home,
      phoneNumber,
      volunteerRegister,
      twoFactorCode,
      isActive
    } = this.state;
    const currentStep = steps[pageIndex];
    const { key, isContinueDisabled, hideContinue } = currentStep;
    const continueIsDisabled = isContinueDisabled
      ? isContinueDisabled(this.state)
      : false;

    if (key === "requestAccepted") {
      Meteor.call("addVolunteerRequest", {
        home: mapValues(get("value"))(home),
        ...volunteerRegister,
        phoneNumber,
        twoFactorCode
      });
    }

    return (

      <div className={`fixed bottom-0 inset-y-auto text-black w-screen ${isActive ? "" : "hidden"}`}>
        <div
          className={
            "bg-white mb-10 lg:mb-0 mx-auto p-3 lg:p-5 shadow rounded-lg rounded-b-none lg:rounded-full lg:rounded-b-none"
          }
          style={{ maxWidth: "70%" }}
        >
          <div className="text-center" style={{ display: "none" }}>
            <Steps current={pageIndex}>
              <Steps.Step title="first" />
              <Steps.Step title="second" />
              <Steps.Step title="third" />
            </Steps>
          </div>

          <div>
            {key === "home" ? (
              <HomeStep
                home={home}
                onClick={homeId => {
                  this.setState(state => {
                    state.home[homeId].value = !state.home[homeId].value;
                    return state;
                  });
                  this.nextPage();
                }}
              />
            ) : (
                ""
              )}

            {key === "location" ? (
              <LocationStep
                location={
                  window.currentLocation ? window.currentLocation : null
                }
                onLocation={loc => {
                  this.setState(state => {
                    let countryCode = getCountryISO2(loc.country);
                    const countryData = loc.additionalData.filter(
                      flow(get("key"), isEqual("CountryName"))
                    );

                    state.location.country = countryCode;

                    state.volunteerRegister.address = `${getOr(
                      "",
                      "street"
                    )(loc)} ${getOr("", "houseNumber")(loc)}`.trim();
                    return state;
                  });
                }}
                nextPage={() => {
                  this.nextPage();
                }}
              />
            ) : (
                null
              )}

            {key === "phoneNumber" ? (
              <PhoneNumberStep
                country={this.state.location.country}
                onChange={phoneNumber => {
                  this.setState(state => {
                    state.phoneNumber = phoneNumber;
                    return state;
                  });
                }}
              />
            ) : (
                ""
              )}

            {key === "twoFactorAuth" ? (
              <TwoFactorAuthStep
                phoneNumber={phoneNumber}
                onAuthenticated={({ approved, twoFactorCode }) => {
                  this.setState(state => {
                    state.succesfullyAuthenticated = approved;
                    state.twoFactorCode = twoFactorCode;
                    return state;
                  });
                  if (approved) {
                    this.nextPage();
                  }
                }}
              />
            ) : (
                ""
              )}

            {key === "volunteerForm" ? (
              <VolunteerRegisterStep
                volunteerRegister={volunteerRegister}
                onChange={(field, value) => {
                  this.setState(state => {
                    state.volunteerRegister[field] = value;
                    return state;
                  });
                }}
              />
            ) : (
                ""
              )}

            {key === "requestAccepted" ? <RequestAccepted /> : ""}
          </div>

          <div
            className={"mt-3 mb-3 lg:mb-0 text-center"}
            style={{ display: hideContinue ? "none" : "inherit" }}
          >
            <Button
              onClick={() => this.nextPage(continueIsDisabled)}
              color={continueIsDisabled ? "gray-400" : "green-500"}
              disabled={continueIsDisabled}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
