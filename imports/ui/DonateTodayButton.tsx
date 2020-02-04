import React from 'react'
import Button from './components/Button'

export default class DonateTodayButton extends React.Component {
    render() {
        return (
            <div className={"fixed top-0 right-0 mt-5 mr-3"}>
                <Button color={"green-500"}
                        target={"_blank"}
                        href={"https://www.gofundme.com/f/support-app-for-coronavirus"}>
                    donate today
                </Button>
            </div>
        )
    }
}
