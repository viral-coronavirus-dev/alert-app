import twilio from "twilio";
import { omit } from "lodash/fp";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { Requests } from "../imports/api/requests.ts";
import { AuthenticatedTokens } from "../imports/api/authenticatedTokens.ts";
import twilioCredentials from "../imports/credentials/twilio/credentials.json";
import verificationService from "../imports/credentials/twilio/verification-service.json";

const twilioClient = twilio(
  twilioCredentials.sid,
  twilioCredentials.auth_token
);

const runTwilio = process.env["TWILIO_ENABLED"];

// TODO: npm run start-with-twilio
const checkTwilioToken = async ({ phoneNumber, code }) => {
  // if the env variable TWILIO_ENABLED is false this will run
  if (!runTwilio) {
    return { approved: true };
  }

  const alreadyApproved = AuthenticatedTokens.findOne({
    phoneNumber,
    code,
    isApproved: true
  });

  if (alreadyApproved && alreadyApproved.isApproved) {
    return { approved: true };
  }

  const verificationCheck = await twilioClient.verify
    .services(verificationService.sid)
    .verificationChecks.create({ to: phoneNumber, code });

  const isApproved = verificationCheck.status === "approved";

  if (isApproved) {
    AuthenticatedTokens.insert({
      phoneNumber,
      code,
      isApproved
    });
  }

  return { approved: isApproved };
};

Meteor.methods({
  sendVerificationToken: async to => {
    check(to, String);

    if (!runTwilio) {
      return true;
    }

    await twilioClient.verify
      .services(verificationService.sid)
      .verifications.create({ to, channel: "sms" });
  },
  checkVerificationToken: async data => {
    check(data, {
      phoneNumber: String,
      code: String
    });

    return await checkTwilioToken(data);
  },
  addViralRequest: async data => {
    check(data, {
      symptoms: {
        fever: Boolean,
        cough: Boolean,
        shortness_of_breath: Boolean,
        runny_nose: Boolean,
        sore_throat: Boolean
      },
      fullName: String,
      address: String,
      city: String,
      country: String,
      countryCode: String,
      emailAddress: String,
      twoFactorCode: String,
      phoneNumber: String
    });

    const { phoneNumber, twoFactorCode } = data;

    const result = await checkTwilioToken({ phoneNumber, code: twoFactorCode });

    if (result.approved) {
      if (!Requests.findOne({ phoneNumber })) {
        Requests.insert(omit(["twoFactorCode"])(data));
        AuthenticatedTokens.remove({ phoneNumber, code: twoFactorCode });
      }

      return { approved: result.approved };
    }
  }
});
