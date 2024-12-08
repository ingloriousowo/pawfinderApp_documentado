describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/auth/login');
  });

  it('page start correctly', () => {
    cy.contains('Iniciar Sesión');
  });

  it('login with incorrect data', () => {
    cy.get('input:first').type('prueba@prueba.cl');
    cy.get('input:last').type('prueba4');
    cy.get('button[class=login-button]').click();
    cy.wait(1000);
    cy.contains('Error de inicio de sesión');
  });

  it('login with correct data', () => {
    cy.get('input:first').type('prueba@prueba.cl');
    cy.get('input:last').type('prueba');
    cy.get('button[class=login-button]').click();
    cy.wait(1000);
    cy.contains('Historias Destacadas');
  });
});

describe('Register', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8100/auth/login');
  });

  it('go to register page', () => {
    cy.get('[data-test-id="registerButton"]').click();
    cy.wait(1500);
    cy.contains('¡Únete a nuestra comunidad!');
  });

  it('register with incorrect data', () => {
    cy.get('[data-test-id="registerButton"]').click();
    cy.get('ion-input[formControlName="nombre"]').type('usuarioDeTest');
    cy.get('ion-input[formControlName="apellido"]').type(
      'usuarioDeTestApellido'
    );
    cy.get('ion-input[formControlName="correo"]').type('usuarioDeTest@test.cl');
    cy.get('ion-input[formControlName="rut"]').type('12345754');
    cy.get('ion-input[formControlName="dv"]').type('k');

    cy.on('fail', (err) => {
      expect(err.message).to.include('failed because this element is');
      return false;
    });

    cy.get('[data-test-id="registerBtn"]').click();
  });

  it('register with correct data', () => {
    cy.get('[data-test-id="registerButton"]').click();
    cy.get('ion-input[formControlName="nombre"]').type('usuarioDeTest');
    cy.get('ion-input[formControlName="apellido"]').type(
      'usuarioDeTestApellido'
    );
    cy.get('ion-input[formControlName="telefono"]').type('123456789');
    cy.get('ion-input[formControlName="correo"]').type('testemail@email.cl');
    cy.get('ion-select[formControlName="genero"]').click();
    cy.get('button[id="alert-input-1-0"]').click();
    cy.get(
      'button[class="alert-button ion-focusable ion-activatable sc-ion-alert-md"]'
    ).click();

    cy.wait(1000);
    cy.get('ion-input[formControlName="rut"]').type('12345754');
    cy.get('ion-input[formControlName="dv"]').type('1');
    cy.get('ion-input[formControlName="password"]').type('Contra_101010');
    cy.wait(500);
    cy.get('[data-test-id="registerBtn"]').click();
    cy.wait(2000);
    cy.contains('Registro exitoso');
  });
});
