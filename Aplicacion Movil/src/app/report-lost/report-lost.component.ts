import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonDatetime } from '@ionic/angular';
import { PetReportService } from '../services/pet-report.service';
import { GeocodingService } from '../services/geocoding.service';
import { AuthService } from '../services/auth.service';
import { PetReportNotificationService } from '../services/pet-report-notification.service';

declare var google: any;

@Component({
  selector: 'app-report-lost',
  templateUrl: './report-lost.component.html',
  styleUrls: ['./report-lost.component.scss'],
})
export class ReportLostComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  reportForm!: FormGroup;
  isSubmitting = false;
  petTypes = [
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
    { value: 'otro', label: 'Otro' },
  ];
  maxDate: string;
  selectedDate: string = '';
  isAddressConfirmed = false;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  map: any;
  marker: any;
  formattedAddress: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private petReportService: PetReportService,
    private router: Router,
    private alertController: AlertController,
    private geocodingService: GeocodingService,
    private ngZone: NgZone,
    private authService: AuthService,
    private petReportNotificationService: PetReportNotificationService
  ) {
    this.maxDate = new Date().toISOString();
    this.initForm();
  }

  private initForm() {
    this.reportForm = this.formBuilder.group({
      tipo_mascota: ['', Validators.required],
      nombre_mascota: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      raza: ['', Validators.required],
      edad: ['', Validators.required],
      color: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaUltimaVista: ['', Validators.required],
      recompensa: [false],
      montoRecompensa: [null],
      ubicacion_lat: [null, Validators.required],
      ubicacion_lng: [null, Validators.required],
      telefonoContacto: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{9,10}$')],
      ],
      emailContacto: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
    });
  }

  ngOnInit() {
    this.setupFormValidation();
    this.initMap();
    this.setUserEmail();
  }

  private async setUserEmail() {
    try {
      const userEmail = await this.authService.getUserEmail();
      this.reportForm.patchValue({
        emailContacto: userEmail,
      });
    } catch (error) {
      console.error('Error al obtener el email del usuario:', error);
      await this.showErrorAlert(
        'No se pudo obtener el email del usuario. Por favor, verifica tu sesión.'
      );
    }
  }

  private initMap() {
    const defaultLocation = { lat: -33.4489, lng: -70.6693 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: defaultLocation,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: defaultLocation,
    });

    this.marker.addListener('dragend', () => {
      const position = this.marker.getPosition();
      this.ngZone.run(() => {
        this.updateFormLocation(position.lat(), position.lng());
        this.getAddressFromCoordinates(position.lat(), position.lng());
      });
    });

    this.map.addListener('click', (event: any) => {
      this.marker.setPosition(event.latLng);
      this.ngZone.run(() => {
        this.updateFormLocation(event.latLng.lat(), event.latLng.lng());
        this.getAddressFromCoordinates(event.latLng.lat(), event.latLng.lng());
      });
    });
  }

  private updateFormLocation(lat: number, lng: number) {
    this.reportForm.patchValue({
      ubicacion_lat: lat,
      ubicacion_lng: lng,
    });
    this.isAddressConfirmed = true;
  }

  private async getAddressFromCoordinates(lat: number, lng: number) {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng },
      });

      if (response.results[0]) {
        this.formattedAddress = response.results[0].formatted_address;
        this.reportForm.patchValue({
          direccion: this.formattedAddress,
        });
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
    }
  }

  async searchAddress() {
    const direccion = this.reportForm.get('direccion')?.value;
    if (direccion) {
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ address: direccion });

        if (response.results && response.results.length > 0) {
          const location = response.results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          this.map.setCenter({ lat, lng });
          this.marker.setPosition({ lat, lng });

          this.formattedAddress = response.results[0].formatted_address;
          this.reportForm.patchValue({
            direccion: this.formattedAddress,
            ubicacion_lat: lat,
            ubicacion_lng: lng,
          });

          this.isAddressConfirmed = true;
        } else {
          await this.showErrorAlert(
            'No se pudo encontrar la dirección. Por favor, intenta con una dirección más específica.'
          );
        }
      } catch (error) {
        console.error('Error al buscar la dirección:', error);
        await this.showErrorAlert(
          'Hubo un problema al buscar la dirección. Por favor, intenta de nuevo.'
        );
      }
    }
  }

  private setupFormValidation() {
    this.reportForm.get('recompensa')?.valueChanges.subscribe((hasReward) => {
      const rewardAmountControl = this.reportForm.get('montoRecompensa');
      if (hasReward) {
        rewardAmountControl?.setValidators([
          Validators.required,
          Validators.min(0),
        ]);
      } else {
        rewardAmountControl?.clearValidators();
      }
      rewardAmountControl?.updateValueAndValidity();
    });
  }

  async onSubmit() {
    if (!this.isFormValid()) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    try {
      this.isSubmitting = true;
      const formData = new FormData();

      const formValue = {
        ...this.reportForm.getRawValue(),
        direccion:
          this.formattedAddress || this.reportForm.get('direccion')?.value,
      };

      Object.keys(formValue).forEach((key) => {
        const value = formValue[key];
        if (value !== null && value !== undefined) {
          if (key === 'recompensa') {
            formData.append(key, value ? 'true' : 'false');
          } else if (key === 'montoRecompensa' && !formValue.recompensa) {
            // No incluir montoRecompensa si recompensa es false
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      if (this.selectedImage) {
        formData.append(
          'urlImagenMascota',
          this.selectedImage,
          this.selectedImage.name
        );
      }

      const response = await this.petReportService
        .createReport(formData)
        .toPromise();

      if (response && response.reporte) {
        // Verificamos reportes cercanos y enviamos notificaciones
        this.petReportService.getAllReports().subscribe(
          (allReports) => {
            this.petReportNotificationService.checkForNearbyReports(
              response.reporte,
              allReports
            );
          },
          (error) => {
            console.error('Error al obtener todos los reportes:', error);
          }
        );

        await this.showSuccessAlert();
        this.router.navigate(['/home']);
      } else {
        throw new Error(
          'La respuesta del servidor no contiene los datos esperados'
        );
      }
    } catch (error: any) {
      console.error('Error al crear el reporte:', error);
      let errorMessage = 'Error desconocido al crear el reporte';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await this.showErrorAlert(errorMessage);
    } finally {
      this.isSubmitting = false;
    }
  }

  isFormValid(): boolean {
    return (
      this.reportForm.valid && this.isAddressConfirmed && !!this.selectedImage
    );
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tu reporte ha sido enviado con éxito.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message:
        message ||
        'Hubo un problema al enviar tu reporte. Por favor, intenta de nuevo.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
