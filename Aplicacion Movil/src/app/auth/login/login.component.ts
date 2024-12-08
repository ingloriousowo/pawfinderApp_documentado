import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Definición de la interfaz para la respuesta del login
interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
    genero: string;
    rut: string;
    dv: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    // Inicialización del formulario de login con validaciones
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Método que se ejecuta al enviar el formulario
  async onSubmit() {
    if (this.loginForm.valid) {
      console.log('LoginComponent: Datos de inicio de sesión:', this.loginForm.value);
      try {
        // Intento de inicio de sesión
        const response = await this.authService.login(this.loginForm.value).toPromise() as LoginResponse;
        console.log('LoginComponent: Respuesta del servidor:', response);

        if (response && response.access_token) {
          console.log('LoginComponent: Login exitoso');
          // Verificar si el usuario es administrador
          const isAdmin = await this.authService.isAdmin().toPromise();
          if (isAdmin) {
            console.log('LoginComponent: Usuario es administrador, navegando al dashboard');
            this.router.navigate(['/admin']);
          } else {
            console.log('LoginComponent: Usuario normal, navegando al home');
            this.router.navigate(['/home']);
          }
        } else {
          throw new Error('No se recibió un token válido');
        }
      } catch (error: any) {
        console.error('LoginComponent: Error de inicio de sesión:', error);
        let errorMessage = 'Ocurrió un error durante el inicio de sesión. Por favor, intenta de nuevo.';

        // Manejo de errores específicos
        if (error.status === 422) {
          errorMessage = error.message || 'Los datos proporcionados no son válidos. Por favor, verifica tus credenciales.';
        }

        // Mostrar alerta de error
        const alert = await this.alertController.create({
          header: 'Error de inicio de sesión',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      console.log('LoginComponent: Formulario inválido:', this.loginForm.errors);
    }
  }

  // Nuevo método para navegar a la página de registro
  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  // Nuevo método para navegar a la página de recuperación de contraseña
  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }
}
