const { H } = window

export const platform = new H.service.Platform({
    apikey: 'yXnArMUy4IlPMMMdSc84FxFFd6XGPED0XqrApbEBek8'
})

let map

export const getMap = () => {
    if (!map) throw new Error('Map not setup!')

    return map
}

export const setupMap = mapRef => {
    if (map) return map

    const defaultLayers = platform.createDefaultLayers()

    // FIXME ask browser for current location and automatically center map as done in LocationStep (reuse code in here)
    map = new H.Map(
        mapRef,
        defaultLayers.vector.normal.map,
        {
            zoom: 4,
            center: { lat: 20.20, lng: 100.71 }
        })

    window.addEventListener('resize', function () {
        map.getViewPort().resize()
    })

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
    const ui = H.ui.UI.createDefault(map, defaultLayers)

    return map
}

export const search = (query: string) => {
    const geocoder = platform.getGeocodingService()

    return new Promise((resolve, reject) => {
        geocoder.geocode({ searchText: query, jsonattributes: 1 }, resolve, reject)
    })
}
