import { Component, OnInit } from '@angular/core';
import { UserReportsService, LostPetReport } from '../../services/user-reports.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-lost-pets-reports',
  templateUrl: './lost-pets-reports.component.html',
  styleUrls: ['./lost-pets-reports.component.scss']
})
export class LostPetsReportsComponent implements OnInit {
  lostPets: LostPetReport[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private userReportsService: UserReportsService,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadLostPets();
  }

  async loadLostPets() {
    try {
      const userEmail = await this.authService.getUserEmail();
      this.userReportsService.getLostPetReports(userEmail).subscribe({
        next: (pets: LostPetReport[]) => {
          this.lostPets = pets;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los reportes de mascotas perdidas.';
          this.loading = false;
          console.error('Error al cargar reportes:', err);
        }
      });
    } catch (error) {
      this.error = 'No se pudo obtener el correo del usuario.';
      this.loading = false;
      console.error('Error al obtener el correo del usuario:', error);
    }
  }

  async deletePet(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este reporte?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.userReportsService.deleteLostPetReport(id).subscribe({
              next: () => {
                this.lostPets = this.lostPets.filter(pet => pet.id !== id);
              },
              error: (err) => {
                console.error('Error al eliminar el reporte:', err);
                this.showErrorAlert('No se pudo eliminar el reporte. Por favor, intenta de nuevo.');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  editPet(id: string) {
    this.navCtrl.navigateForward(`/edit-lost-pet/${id}`);
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
