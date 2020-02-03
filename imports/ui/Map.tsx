import React from 'react'
const { H } = window

export default class Map extends React.Component {
    constructor(props) {
        super(props)
        this.mapRef = React.createRef()
    }

    componentDidMount() {
        const platform = new H.service.Platform({
            'apikey': 'yXnArMUy4IlPMMMdSc84FxFFd6XGPED0XqrApbEBek8'
        })

        const defaultLayers = platform.createDefaultLayers()

        const map = new H.Map(
            this.mapRef.current,
            defaultLayers.vector.normal.map,
            {
                zoom: 4,
                center: { lat:34.26, lng:100.71 }
            })

        window.addEventListener('resize', function () {
            map.getViewPort().resize()
        })

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
        const ui = H.ui.UI.createDefault(map, defaultLayers)
    }

    render() {
        return (
            <div ref={this.mapRef} className={"w-screen h-screen"}>
            </div>
        )
    }
}
