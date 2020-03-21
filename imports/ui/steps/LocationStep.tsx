import { getOr } from "lodash/fp";
import React, { useState } from "react";
import StepTitle from "./StepTitle";
import Input from "../components/Input";
import Button from "../components/Button";
import { search, getMap } from "/imports/ui/map/hereMap";

const getLatLong = getOr(
  {},
  "response.view.0.result.0.location.displayPosition"
);
const getAddress = getOr({}, "response.view.0.result.0.location.address");

export default function LocationStep(props) {
  const [query, setQuery] = useState("");
  const [hasFoundLocation, setHasFoundLocation] = useState(false);

  return (
    <div className={"text-center mx-auto"} style={{ maxWidth: "70%" }}>
      <StepTitle>Where are you located?</StepTitle>

      <div className={""}>
        <Input
          type={"text"}
          placeholder={"Search for location"}
          onChange={e => setQuery(e.target.value.toString())}
        />

        <div className={"mt-3 flex mx-auto"} style={{ maxWidth: "180px" }}>
          <div className={"w-1/2"}>
            <Button
              color={!hasFoundLocation ? "green-500" : "gray-400"}
              onClick={() => {
                search(query)
                  .then(res => {
                    const { latitude: lat, longitude: lng } = getLatLong(res);

                    console.log(lat, lng);
                    console.log(res);
                    if (lat && lng) {
                      const map = getMap();

                      map.setCenter({ lat, lng });
                      map.setZoom(12);

                      setHasFoundLocation(true);
                      props.onLocation(getAddress(res));
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
              color={hasFoundLocation ? "green-500" : "gray-400"}
              onClick={() => props.nextPage()}
            >
              {hasFoundLocation ? "Continue" : "Skip"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
