import React from 'react'
import Map from './Map'
import ViralLogo from './ViralLogo'
import WhiteTransparentFade from './WhiteTransparentFade'
import AlertWorkflow from './AlertWorkflow'
import VolunteerWorkflow from './VolunteerWorkflow'
import DonateTodayButton from './DonateTodayButton'
import VolunteerButton from './VolunteerButton'

export default () => (
  <div>
    <Map />
    <WhiteTransparentFade />
    <ViralLogo />
    <VolunteerButton />
    <DonateTodayButton />
    <AlertWorkflow />
    <VolunteerWorkflow />
  </div>
)
