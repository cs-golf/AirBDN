describe("Home page", () => {
  it("clicks sensor and navigates to /charts", () => {
    cy.viewport(1600, 900);
    cy.visit("localhost:3000");
    cy.get(".leaflet-interactive").first().click({ force: true });
    cy.url().should("contain", "/charts");
  });

  it("renders a chart", () => {
    cy.get("#chart")  
  });
});
