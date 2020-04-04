import React from 'react'
import Button from './components/Button'

export default class VolunteerButton extends React.Component {
    render() {
        return (
            <div className={"fixed top-0 right-0 mt-5 mr-40"}>
                <Button onClick={this.props.clickCallback} color={"green-500"}
                >
                    Volunteer
                </Button>
            </div>
        )
    }
}
