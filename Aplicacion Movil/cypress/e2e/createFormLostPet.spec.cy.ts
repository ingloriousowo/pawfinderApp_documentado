describe('Create', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/auth/login');
    cy.get('input:first').type('prueba@prueba.cl');
    cy.get('input:last').type('prueba');
    cy.get('button[class=login-button]').click();
    cy.wait(1000);
  });

  it('got to create page', () => {
    cy.visit('http://localhost:8100/report-lost');
  });
});
