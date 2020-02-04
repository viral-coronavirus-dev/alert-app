import { Meteor } from 'meteor/meteor'
import { Requests } from '../imports/api/requests.ts'

Meteor.methods({
    addViralRequest (data) {
        // TODO: Check data
        console.log(data)
    }
})

Meteor.startup(() => {
  // Do something awesome
})
