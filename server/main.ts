import twilio from 'twilio'
import {omit} from 'lodash/fp'
import {check} from 'meteor/check'
import {Meteor} from 'meteor/meteor'
import {Requests} from '../imports/api/requests.ts'
import twilioCredentials from '../imports/credentials/twilio/credentials.json'
import verificationService from '../imports/credentials/twilio/verification-service.json'

const twilioClient = twilio(twilioCredentials.sid, twilioCredentials.auth_token)

function checkTwilioToken({phoneNumber, code}) {
    return new Promise((resolve, reject) => {
        twilioClient.verify.services(verificationService.sid)
            .verificationChecks
            .create({to: phoneNumber, code})
            .then((verificationCheck) => {
                resolve({approved: verificationCheck.status === 'approved'})
            })
            .catch(reject)
    })
}

Meteor.methods({
    sendVerificationToken(to) {
        check(to, String)

        return new Promise(res => res(true))

        return new Promise((resolve, reject) => {
            twilioClient.verify.services(verificationService.sid)
                .verifications
                .create({to, channel: 'sms'})
                .then(() => resolve())
                .catch(reject)
        })
    },
    checkVerificationToken(data) {
        check(data, {
            phoneNumber: String,
            code: String,
        })

        return checkTwilioToken(data)
    },
    addViralRequest(data) {
        check(data, {
            symptoms: {
                fever: Boolean,
                cough: Boolean,
                shortness_of_breath: Boolean,
                runny_nose: Boolean,
            },
            fullName: String,
            address: String,
            city: String,
            country: String,
            emailAddress: String,
            twoFactorCode: String,
            phoneNumber: String,
        })

        const {phoneNumber, twoFactorCode} = data

        return new Promise((resolve, reject) => {
            checkTwilioToken({ phoneNumber, code: twoFactorCode })
                .then((verificationCheck) => {
                    if (verificationCheck.approved) {
                        Requests.insert(omit(['twoFactorCode'])(data))
                        resolve({ approved: true })
                    }
                })
                .catch(reject)
        })
    }
})
