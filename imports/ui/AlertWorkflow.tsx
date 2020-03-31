import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import Steps from "rc-steps";
import isEmail from "is-email";
import getCountryISO2 from "country-iso-3-to-2";
import { Meteor } from "meteor/meteor";
import { flow, get, getOr, mapValues, isEqual } from "lodash/fp";
import LocationStep from "./steps/LocationStep";
import HomeStep from "./steps/HomeStep";
import SymptomsStep from "./steps/SymptomsStep";
import ServicesStep from "./steps/ServicesStep";
import PhoneNumberStep from "./steps/PhoneNumberStep";
import TwoFactorAuthStep from "./steps/TwoFactorAuthStep";
import AddressStep from "./steps/AddressStep";
import RequestAccepted from "./steps/RequestAccepted";
import Button from "./components/Button";

const steps = [
  {
    key: "home",
    hideContinue: true
  },
  {
    key: "symptoms",
    isContinueDisabled: ({ symptoms }) =>
      !Object.values(symptoms)
        .map(s => s.value)
        .some(s => s)
  },
  {
    key: "services",
    isContinueDisabled: ({ services }) =>
      !Object.values(services)
        .map(s => s.value)
        .some(s => s)
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
    key: "addressForm",
    isContinueDisabled: ({
      address: { fullName, address, city, country, emailAddress }
    }) => {
      return ![
        fullName.length >= 3,
        address.length >= 3,
        city.length >= 3,
        country.length > 0,
        isEmail(emailAddress)
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
      report: { icon: "cough", title: "Report Symptoms", value: false },
      request: { icon: "team", title: "Request Services", value: false }
    },
    symptoms: {
      fever: { icon: "fever", title: "Fever", value: false },
      cough: { icon: "cough", title: "Cough", value: false },
      shortness_of_breath: {
        icon: "lung",
        title: "Shortness of Breath",
        value: false
      },
      runny_nose: { icon: "nose", title: "Runny Nose", value: false },
      sore_throat: { icon: "sore_throat", title: "Sore Throat", value: false }
    },
    services: {
      buying_groceries: {
        icon: "supermarket",
        title: "Buying Groceries",
        value: false
      },
      need_medicines: {
        icon: "drug",
        title: "Need Medicines",
        value: false
      },
      talk_to_someone: {
        icon: "phone",
        title: "Talk to Someone",
        value: false
      },
      child_care: { icon: "care", title: "Child Care", value: false },
      drive: { icon: "drive", title: "Drive", value: false }
    },
    phoneNumber: "",
    succesfullyAuthenticated: false,
    twoFactorCode: "",
    address: {
      fullName: "",
      address: "",
      city: "",
      country: "",
      countryCode: "",
      emailAddress: ""
    }
  };

  nextPage(isDisabled: boolean) {
    //TO DO    
    if (!isDisabled) {
      if (this.state.pageIndex === 1) {
        this.setState({
          pageIndex: this.state.pageIndex + 2
        });
      } else {
        this.setState({
          pageIndex: this.state.pageIndex + 1
        });
      }

    }
  }
  servicesPage() {
    this.setState({
      pageIndex: this.state.pageIndex + 2
    });
  }
  render() {
    const {
      pageIndex,
      home,
      symptoms,
      services,
      phoneNumber,
      address,
      twoFactorCode
    } = this.state;
    const currentStep = steps[pageIndex];
    const { key, isContinueDisabled, hideContinue } = currentStep;
    const continueIsDisabled = isContinueDisabled
      ? isContinueDisabled(this.state)
      : false;

    if (key === "requestAccepted") {
      Meteor.call("addViralRequest", {
        home: mapValues(get("value"))(home),
        symptoms: mapValues(get("value"))(symptoms),
        services: mapValues(get("value"))(services),
        ...address,
        phoneNumber,
        twoFactorCode
      });
    }

    return (

      <div className={"fixed bottom-0 inset-y-auto text-black w-screen"}>
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
                  if (homeId === "report") {
                    this.nextPage();
                  } else {
                    this.servicesPage();
                  }
                }}
              />
            ) : (
                ""
              )}

            {key === "symptoms" ? (
              <SymptomsStep
                symptoms={symptoms}
                onClick={symptomId => {
                  this.setState(state => {
                    state.symptoms[symptomId].value = !state.symptoms[symptomId]
                      .value;
                    return state;
                  });
                }}
              />
            ) : (
                null
              )}
            {key === "services" ? (
              <ServicesStep
                services={services}
                onClick={serviceId => {
                  this.setState(state => {
                    state.services[serviceId].value = !state.services[serviceId]
                      .value;
                    return state;
                  });
                }}
              />
            ) : (
                null
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

                    state.address.address = `${getOr(
                      "",
                      "street"
                    )(loc)} ${getOr("", "houseNumber")(loc)}`.trim();
                    state.address.city = getOr("", "city")(loc);
                    state.address.country = getOr(
                      loc.country,
                      "0.value"
                    )(countryData);
                    state.address.countryCode = countryCode;
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

            {key === "addressForm" ? (
              <AddressStep
                address={address}
                onChange={(field, value) => {
                  this.setState(state => {
                    state.address[field] = value;
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
