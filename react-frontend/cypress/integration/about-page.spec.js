describe("About page", () => {
    it("has the three headings", () => {
      cy.viewport(1600, 900);
      cy.visit("localhost:3000/about");
      
      cy.get(".team");
      cy.get(".choices");
      cy.get(".project");
    });
  });
  