import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { GiveAdoptionService } from '../services/give-adoption.service';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-give-adoption',
  templateUrl: './give-adoption.component.html',
  styleUrls: ['./give-adoption.component.scss'],
})
export class GiveAdoptionComponent implements OnInit {
  adoptionForm: FormGroup;
  petTypes: string[] = ['Perro', 'Gato', 'Otro'];
  petSizes: string[] = ['Pequeño', 'Mediano', 'Grande'];
  genders: string[] = ['Macho', 'Hembra'];
  userEmail: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private giveAdoptionService: GiveAdoptionService,
    private authService: AuthService
  ) {
    this.adoptionForm = this.formBuilder.group({
      petName: ['', [Validators.required, Validators.minLength(2)]],
      petType: ['', Validators.required],
      breed: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      gender: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      healthStatus: ['', [Validators.required, Validators.minLength(2)]],
      contactName: ['', [Validators.required, Validators.minLength(2)]],
      contactPhone: ['', [Validators.required, Validators.pattern('^[0-9]{9,10}$')]],
      contactEmail: [{value: '', disabled: true}, [Validators.required, Validators.email]],
      imageUrl: [null]
    });
  }

  async ngOnInit() {
    await this.setUserEmail();
  }

  private async setUserEmail() {
    try {
      this.userEmail = await this.authService.getUserEmail();
      this.adoptionForm.patchValue({
        contactEmail: this.userEmail
      });
      console.log('Email del usuario establecido:', this.userEmail);
    } catch (error) {
      console.error('Error al obtener el email del usuario:', error);
      await this.showErrorAlert('No se pudo obtener el email del usuario. Por favor, verifica tu sesión.');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.adoptionForm.patchValue({
      imageUrl: file
    });
    this.adoptionForm.get('imageUrl')?.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.adoptionForm.valid) {
      const formData = new FormData();
      const formValue = this.adoptionForm.getRawValue();
      Object.keys(formValue).forEach(key => {
        if (key === 'imageUrl' && formValue[key] instanceof File) {
          formData.append(key, formValue[key], formValue[key].name);
        } else {
          formData.append(key, formValue[key]);
        }
      });

      // Asegurarse de que el email se incluya en el formData
      formData.append('contactEmail', this.userEmail);

      try {
        const response = await this.giveAdoptionService.createAdoption(formData).toPromise();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Tu mascota ha sido registrada para adopción.',
          buttons: ['OK']
        });
        await alert.present();
        this.adoptionForm.reset();
        await this.setUserEmail(); // Restablecer el email después de resetear el formulario
      } catch (err: unknown) {
        console.error('Error al crear la adopción:', err);
        let errorMessage = 'Hubo un problema al registrar la mascota. Por favor, intenta de nuevo.';

        if (err instanceof HttpErrorResponse) {
          if (err.error && Array.isArray(err.error.detail)) {
            errorMessage = err.error.detail.map((e: any) => e.msg).join('\n');
          } else if (err.error?.detail) {
            errorMessage = err.error.detail;
          }
        }

        await this.showErrorAlert(errorMessage);
      }
    } else {
      await this.showErrorAlert('Por favor, completa todos los campos correctamente.');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.adoptionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
