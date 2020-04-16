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
  });
});
