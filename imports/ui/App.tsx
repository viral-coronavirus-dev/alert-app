import React, { useState } from 'react'
import Map from './Map'
import ViralLogo from './ViralLogo'
import WhiteTransparentFade from './WhiteTransparentFade'
import AlertWorkflow from './AlertWorkflow'
import VolunteerWorkflow from './VolunteerWorkflow'
import DonateTodayButton from './DonateTodayButton'
import VolunteerButton from './VolunteerButton'

export default () => {

  const [flow, setFlow] = useState('alert')

  return (
    <div>
      <Map />
      <WhiteTransparentFade />
      <ViralLogo clickCallback={() => {
        setFlow('alert');
      }}/>
      <VolunteerButton clickCallback={() => {
        setFlow('vol');
      }} />
      <DonateTodayButton />
      {flow === 'alert' ? <AlertWorkflow /> : <div>volunteer flow</div>}

      <VolunteerWorkflow />
    </div>
  )
}
