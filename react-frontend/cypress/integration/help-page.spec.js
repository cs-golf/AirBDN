describe("Help page", () => {
  it("has the three headings", () => {
    cy.viewport(1600, 900);
    cy.visit("localhost:3000/help");
    cy.get(".build");
    cy.get(".fund");
    cy.get(".host");
  });

  it("submits form", () => {
    const stub = cy.stub();

    cy.on("window:alert", stub);

    cy.get(".textBox").click().type("test@test.test");
    cy.get(".submitButton")
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("Thanks for your help!");
      });
  });
});
