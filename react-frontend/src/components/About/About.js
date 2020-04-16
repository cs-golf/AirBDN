import React from "react";
import "./About.css";

const About = () => (
  <main className="aboutPage">
    <div className="project">
      <h2> ‣ The project</h2>
      <p>
        The main purpose of this site is to keep interested residents of
        Aberdeen informed about the quality of the air they breathe. It can be
        of great benefit for the prevention of health problems to know what you
        are breathing when about in the city or even inside your home. The
        sensors measure the levels of PM 10 (Partic) and particulate matter 2.5,
        the diameter of these particles is smaller than a human hairs diameter.
        The World Health Organisation, WHO, state that globally 2.1 million
        deaths are caused fine particulate matter, this makes the need for
        information about air quality a major subject. Even though Aberdeen
        particulate matter levels are normally below the maximum permitted
        level, it may exceed these levels from time to time and for some users,
        it is crucial to be informed about it.
      </p>
    </div>
    <div className="choices">
      <h2> ‣ Our choices</h2>
      <p>
        After CTC's partners studied the possible options on which device to use
        to gather readings, Luftdaten was found, a popular project with more
        than 5000 devices deployed all over Europe. It also brought several
        advantages apart from popularity. It would read four different values
        with two chips, with chip SDS011 it reads PM2.5 and PM10 levels, and
        with the chip DHT22 it would read humidity and temperature levels, all
        of this, in just a small box and for a very reasonable price! But the
        price did not mean less accuracy, as, after different tests, Luftdaten
        devices showed enough precision in the readings for our cause. Due to
        the size of the city, the choice of smaller, more affordable sensors
        became more attractive, as to use higher-end sensors would need a much
        bigger investment, which was not viable. By using these sensors, a
        bigger net can be developed which eventually looks to cover the whole
        radius of the granite city. Also, the data gathered by the six official
        sensors is not open for reuse, as well as it only gives hourly readings
        while AirBDN offers live data. As CTC motivates developers to start up
        new projects offering hack weekends where they can seek help, all the
        projects are open source and open data, this one is also open source and
        open data, so people can expand from this project and have the ability
        to create their own more advanced applications. This is also why
        Luftdaten was chosen, a company that has open-source code for their
        devices as well as offering all the data produced as open data.
      </p>
    </div>
    <div className="team">
      <h2> ‣ The team</h2>
      <p>
        AirBDN is a web app developed by a group of University of Aberdeen
        Computing Science students teamed up with CodeTheCity (CTC). The latter
        is a charity from Aberdeen that since 2014 has been resolving problems
        around the city with the use of technology and data. Their technique to
        develop projects and connect citizens with other developers is
        organizing hack weekends and other workshops to design these ideas and
        make them a reality. All the projects, including this one, are fully
        open source, APIs and data can be found and used to develop further
        apps. The best way to solve the biggest possible number of problems
        around Aberdeen is by working together!
      </p>
    </div>
    {/* <DataDownload className="dl" /> */}
  </main>
);

export default About;
