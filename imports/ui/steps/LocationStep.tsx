import { getOr } from "lodash/fp";
import React, { useState, useEffect } from "react";
import StepTitle from "./StepTitle";
import Input from "../components/Input";
import Button from "../components/Button";
import { search, getMap, revSearch } from "/imports/ui/map/hereMap";
const { H } = window;


const getLatLong = getOr(
  {},
  "response.view.0.result.0.location.displayPosition"
);
const getAddress = getOr({}, "response.view.0.result.0.location.address");

export default class LocationStep extends React.PureComponent {
  state = {
    hereLocation: null,
    inputDisturbed: true
  };

  componentDidMount() {
    this.fetchLocation(this.props.location).then(loc => {
      this.setState(state => {
       
        return {
          ...state,
          hereLocation: getAddress(loc).label,
          inputDisturbed: false
        };
      });

      this.props.onLocation(getAddress(loc));
    }).catch(error => {
      return {
        ...state,
        hereLocation: "",
        inputDisturbed: false
      };
    })
  }
  // componentDidUpdate(prevProps, prevState) {

  //   if (prevProps.location !== this.props.location) {
  //     const

  //     // this.setState(state => {
  //     //   return {
  //     //     ...state,
  //     //     loadingLocation: true
  //     //   };
  //     // });
  //   }

  //   // if(prevProps.loadingLocation === false && this.props.loadingLocation === true) {
  //   //   this.fetchLocation();
  //   // }

  //   // if(here)
  // }

  fetchLocation = location => {
    return revSearch({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });
    // .then(res => {
    //   // this.setState(state => {
    //   //   return {
    //   //     ...state
    //   //   };
    //   // });
    //   setHasFoundLocation(getAddress(res).Label);
    //   //   props.onLocation(getAddress(res))
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  };
  //   const [query, setQuery] = useState("");
  //   // const [hasFoundLocation, setHasFoundLocation] = useState("");
  //   const { location } = props;

  // //   let addLabel = null;
  //     // useEffect(() => {
  //     //     if (location) {

  //     // }, location)

  // }

  render() {
    return (
      <div className={"text-center mx-auto"} style={{ maxWidth: "70%" }}>
        <StepTitle>Where are you located?</StepTitle>

        <div className={""}>
          {this.state.hereLocation === null ? (
            <p style={{ textAlign: 'left' }}>Loading...</p>
          ) : (
              <Input
                value={
                  this.state.hereLocation === null ? "" : this.state.hereLocation
                }
                type={"text"}
                placeholder={"Search for location"}
                onChange={e => {
                  e.persist();
                  this.setState(state => {
                    return {
                      ...state,
                      hereLocation: e.target.value.toString(),
                      inputDisturbed: true
                    };
                  });
                }}
              />
            )}

          <div className={"mt-3 flex mx-auto"} style={{ maxWidth: "180px" }}>
            <div className={"w-1/2"}>
              <Button
                color={this.state.inputDisturbed ? "green-500" : "gray-400"}
                onClick={() => {
                  search(this.state.hereLocation)
                    .then(res => {
                      const { latitude: lat, longitude: lng } = getLatLong(res);
                      if (lat && lng) {
                        const map = getMap();
                        map.setCenter({ lat, lng });
                        map.setZoom(12);
                        // var locationMarker = new H.map.Marker({
                        //   lat,
                        //   lng
                        // });

                        this.props.onLocation(getAddress(res));

                        this.setState(state => {
                          return {
                            ...state,
                            inputDisturbed: false,
                            hereLocation: getAddress(res).label
                          };
                        });
                        // FIXME ask browser for current location and automatically center map as done in LocationStep (reuse code in here)
                        // map = new H.Map(map, defaultLayers.vector.normal.map, {
                        //   zoom: 10,
                        //   //center: { lat: 20.2, lng: 100.71 }
                        //   center: { lat: position.coords.latitude, lng: position.coords.longitude }
                        // });
                        // map.addObject(locationMarker);
                        window.locationMarker.setGeometry({
                          lat,
                          lng
                        });
                        //  setHasFoundLocation(getAddress(res).Label)
                      } else {
                        alert("Could not find the location!");
                      }
                    })
                    .catch(console.error);
                }}
              >
                Search
              </Button>
            </div>
            <div className={"w-1/2"}>
              <Button
                color={!this.state.inputDisturbed ? "green-500" : "gray-400"}
                onClick={() => this.props.nextPage()}
              >
                {this.state.hereLocation ? "Continue" : "Skip"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
