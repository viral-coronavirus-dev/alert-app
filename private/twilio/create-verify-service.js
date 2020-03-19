const credentials = require('../../imports/credentials/twilio/credentials.js')
const accountSid = credentials.sid
const authToken = credentials.auth_token

const client = require('twilio')(accountSid, authToken)

client.verify.services.create({ friendlyName: 'Viral Corona Virus App' })
  .then(service => console.log(JSON.stringify(service)))
