import React from 'react'

export default class AlertWorkflow extends React.Component {
    state = {
        pageIndex: 0,
    }

    nextPage() {
        this.setState({
            pageIndex: this.state.pageIndex + 1
        })
    }

    render() {
        return (
            <div className={"fixed bottom-0 inset-y-auto text-black w-screen"}>
                <div className={"bg-white w-1/2 mx-auto p-5 rounded-full rounded-b-none"}>
                    <div className={"text-center font-bold text-3xl uppercase"}>
                        What symptoms do you have?
                    </div>
                </div>
            </div>
        )
    }
}
