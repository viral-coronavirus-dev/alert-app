import twilio from 'twilio'
import {omit} from 'lodash/fp'
import {check} from 'meteor/check'
import {Meteor} from 'meteor/meteor'
import {Requests} from '../imports/api/requests.ts'
import twilioCredentials from '../imports/credentials/twilio/credentials.json'
import verificationService from '../imports/credentials/twilio/verification-service.json'

const twilioClient = twilio(twilioCredentials.sid, twilioCredentials.auth_token)

// TODO: Create a cache collection called AuthenticatedTokens for checking the token twice.
function checkTwilioToken({phoneNumber, code}) {
    //return new Promise(res => res({approved: true}))

    return new Promise((resolve, reject) => {
        twilioClient.verify.services(verificationService.sid)
            .verificationChecks
            .create({to: phoneNumber, code})
            .then((verificationCheck) => {
                console.log('in here or smth')
                console.log(verificationCheck)
                resolve({approved: verificationCheck.status === 'approved'})
            })
            .catch((...errs) => {
                console.log(errs)
                reject(JSON.stringify(errs))
            })
    })
}

Meteor.methods({
    sendVerificationToken(to) {
        check(to, String)

        //return new Promise(res => res(true))

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

        // FIXME Checking a working token doesn't work twice for logical reason
        return new Promise((resolve, reject) => {
            checkTwilioToken({ phoneNumber, code: twoFactorCode })
                .then((verificationCheck) => {
                    console.log(verificationCheck)
                    if (verificationCheck.approved) {
                        console.log('checking phone number')

                        console.log(Requests.findOne({ phoneNumber }))
                        if (!Requests.findOne({ phoneNumber })) {
                            console.log('insert request')
                            Requests.insert(omit(['twoFactorCode'])(data))
                        }

                        console.log('resolve')
                        resolve({ approved: verificationCheck.approved })
                    }
                })
                .catch(reject)
        })
    }
})
