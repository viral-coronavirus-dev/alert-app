import React from 'react'
import {setupMap} from './map/hereMap'

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.mapRef = React.createRef()
    }

    componentDidMount() {
        setupMap(this.mapRef.current)
    }

    render() {
        return (
            <div ref={this.mapRef} className={"w-screen h-screen"}>
            </div>
        )
    }
}
