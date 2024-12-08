import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { catchError, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = 'No se ha seleccionado archivo';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      genero: ['', [Validators.required]],
      rut: ['', [Validators.required, Validators.pattern(/^[0-9]{7,8}$/)]],
      dv: ['', [Validators.required, Validators.pattern(/^[0-9kK]{1}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.registerForm.valueChanges.subscribe(() => {
      console.log('Form valid:', this.registerForm.valid);
      console.log('Form values:', this.registerForm.value);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = null;
      this.selectedFileName = 'No se ha seleccionado archivo';
    }
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  async onSubmit() {
    console.log('onSubmit called');
    console.log('Form valid:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);

    if (this.registerForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando...',
      });
      await loading.present();

      try {
        const formData = new FormData();

        // Log each value as it's added to FormData
        Object.keys(this.registerForm.value).forEach(key => {
          let value = this.registerForm.get(key)?.value;

          if (key === 'genero') {
            value = value.toString();
          } else if (key === 'dv') {
            value = value.toUpperCase();
          }

          formData.append(key, value);
          console.log(`Adding to FormData - ${key}:`, value);
        });

        if (this.selectedFile) {
          formData.append('urlFotoPerfil', this.selectedFile, this.selectedFile.name);
          console.log('Adding file to FormData:', this.selectedFile.name);
        }

        // Log the FormData entries
        formData.forEach((value, key) => {
          console.log(`FormData entry - ${key}:`, value);
        });

        const response = await firstValueFrom(this.authService.register(formData).pipe(
          catchError(error => {
            console.error('Error en la llamada al servicio:', error);
            throw error;
          })
        ));

        console.log('Registration response:', response);

        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Registro exitoso',
          message: 'Tu cuenta ha sido creada. Por favor, inicia sesión.',
          buttons: ['OK']
        });
        await alert.present();

        this.router.navigate(['/login']);
      } catch (error: any) {
        console.error('Error during registration:', error);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error de registro',
          message: error.error?.message || 'Hubo un problema al crear tu cuenta. Por favor, intenta de nuevo.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      console.log('Form is invalid');
      await this.showFormErrors();
    }
  }

  async showFormErrors() {
    let errorMessage = 'Por favor, corrige los siguientes errores:\n';
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          errorMessage += `- El campo ${key} es requerido.\n`;
        }
        if (control.errors?.['email']) {
          errorMessage += `- El correo electrónico no es válido.\n`;
        }
        if (control.errors?.['minlength']) {
          errorMessage += `- El campo ${key} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.\n`;
        }
        if (control.errors?.['pattern']) {
          errorMessage += `- El formato del campo ${key} no es válido.\n`;
        }
      }
    });

    const alert = await this.alertController.create({
      header: 'Errores en el formulario',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
