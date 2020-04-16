import React from "react";
import Form from "./Form";
import "./HelpPage.css";

export default () => {
  return (
    <div className="helpPage">
      <div className="fund">
        <h2> ‣ Fund a sensor</h2>
        On the way to the goal that we set, we have to pay for all the different
        parts of a sensor, for all the sensors. If you would like to contribute
        to the cause, you are free to do it, and we encourage you to do it too!
        Whatever donation you do, will be much appreciated. You set your limits,
        and we appreciate you giving! The sensors we are placing around the city
        are economical and add up to £30. As said before, if you can fund a
        whole sensor, we would encourage you to do it, but if you prefer to fund
        a part by doing a donation, we will be very thankful for your help in
        the development of this project.
      </div>
      <div className="build">
        <h2> ‣ Build a sensor</h2>
        All of the sensors were built by volunteers in CodeTheCities' building
        events. At these events, you will be able to build your own sensor, or
        one of ours! But do not worry, as we will personally walk you through
        all the steps, so it is all correctly done! With no prior knowledge
        needed! And it should not more than two hours to fully build a sensor
        and have it ready to be installed and connected! <br />
        <a href="https://www.airaberdeen.org/events/">
          Click here for more information
        </a>
      </div>
      <div className="host">
        <h2> ‣ Host a sensor</h2>
        If on the other hand, you are interested in having a sensor in your
        home, it only needs electricity and Wi-Fi. If this is you case, fill in
        the details from the form below, and we will contact you in order to
        arrange everything. This also means, that you will have an idea of what
        the air quality is like around the space where you install the sensor!
        <Form />
      </div>
      <div className="info">
        Here at AirBDN we are working together towards the same goal, better
        information about Aberdeen’s air quality. To do so, we are on the way to
        deploy 100 sensors all around the Granite City, and for this, we need
        your help! There are several ways you can help out if you want to!
        Remember, the more sensors there are deployed, the vaster the net of
        sensors is meaning that more parts of the city will know what air
        quality they have. We highly motivate you to help us out, together we
        will inform Aberdeen about their air quality.
      </div>
    </div>
  );
};
