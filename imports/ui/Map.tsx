import React from "react";
import { setupMap } from "./map/hereMap";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      window.currentLocation = position;
      setupMap(this.mapRef.current, position);
    });
  }

  render() {
    return <div ref={this.mapRef} className={"w-screen h-screen"}></div>;
  }
}
