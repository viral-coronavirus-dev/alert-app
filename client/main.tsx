import "core-js";
import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import App from "/imports/ui/App";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

Meteor.startup(() => {
  const options = {
    position: positions.TOP_CENTER,
    timeout: 3000,
    offset: "30px",
    transition: transitions.FADE
  };
  const Root = () => (
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  );

  // render(<App />, document.getElementById("react-target"));
  render(<Root />, document.getElementById("root"));
});
