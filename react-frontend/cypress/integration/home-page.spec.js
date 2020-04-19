<<<<<<< HEAD
describe("Home page", () => {
  it("renders a leaflet map", () => {
    cy.viewport(1600, 900);
    cy.visit("localhost:3000");
    cy.contains("Leaflet");
  });

  it("renders correct scale for PM 10", () => {
    cy.get(".sidebar").contains("PM 10 (AQI)").click();
    cy.get(".aqiScale").should("be.visible");
  });

  it("renders correct scale for PM 2.5", () => {
    cy.get(".sidebar").contains("PM 2.5 (AQI)").click();
    cy.get(".aqiScale").should("be.visible");
  });

  it("renders correct scale for Temperature", () => {
    cy.get(".sidebar").contains("Temperature").click();
    cy.get(".tempScale").should("be.visible");
  });

  it("renders correct scale for Pressure", () => {
    cy.get(".sidebar").contains("Pressure").click();
    cy.get(".paScale").should("be.visible");
  });

  it("renders correct scale for Humidity", () => {
    cy.get(".sidebar").contains("Humidity").click();
    cy.get(".humScale").should("be.visible");
  });

  it("timeline appears on click", () => {
    cy.get(".toggle").click();
    cy.get(".scrub").should("be.visible");
    
    cy.get(".toggle").click();
  });

  it("renders an info icon", () => {
    cy.get(".infoImage").should("be.visible");
  });

  it("renders a blurb", () => {
    cy.get(".infoImage").click();
    cy.get(".blurbContainer").should("be.visible");
=======
describe("landscape sidebar", () => {
  beforeEach(() => {
    cy.viewport(1600, 900);
    cy.visit("localhost:3000");
  });

  it("has a sidebar with a nav", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".sidebar").contains("Home");
    cy.get(".sidebar").contains("About us");
    cy.get(".sidebar").contains("How you can help");
  });

  it("navigates to /about", () => {
    cy.get(".sidebar")
      .contains("About us")
      .children()
      .should("be.visible");
    cy.get(".sidebar")
      .contains("About us")
      .children()
      .click();
    cy.url().should("include", "/about");
  });

  it("navigates to /help", () => {
    cy.get(".sidebar")
      .contains("How you can help")
      .children()
      .should("be.visible");
    cy.get(".sidebar")
      .contains("How you can help")
      .children()
      .click();
    cy.url().should("include", "/help");
  });
});

describe("portrait sidebar", () => {
  beforeEach(() => {
    cy.viewport(900, 1600);
    cy.visit("localhost:3000");
    cy.get("#menu").click();
  });

  it("has a sidebar with a nav", () => {
    cy.get(".sidebar").should("be.visible");
    cy.get(".sidebar").contains("Home");
    cy.get(".sidebar").contains("About us");
    cy.get(".sidebar").contains("How you can help");
  });

  it("navigates to /about", () => {
    cy.get(".sidebar")
      .contains("About us")
      .children()
      .should("be.visible");
    cy.get(".sidebar")
      .contains("About us")
      .children()
      .click();
    cy.url().should("include", "/about");
  });

  it("navigates to /help", () => {
    cy.get(".sidebar")
      .contains("How you can help")
      .children()
      .should("be.visible");
    cy.get(".sidebar")
      .contains("How you can help")
      .children()
      .click();
    cy.url().should("include", "/help");
  });
});

describe("Home page", () => {
  beforeEach(() => {
    cy.viewport(1600, 900);
    // cy.viewport(900, 1600);
    cy.visit("localhost:3000");
  });

  it("renders a leaflet map", () => {
    cy.contains("Leaflet");
>>>>>>> 04b0315337a027f09e7f9662a53591c3eab37053
  });
});
