import { Component, OnInit } from '@angular/core';
import { UserReportsService, AdoptionListing } from '../../services/user-reports.service';
import { AuthService } from '../../services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-adoption-reports',
  templateUrl: './adoption-reports.component.html',
  styleUrls: ['./adoption-reports.component.scss']
})
export class AdoptionReportsComponent implements OnInit {
  adoptions: AdoptionListing[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private userReportsService: UserReportsService,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadAdoptions();
  }

  async loadAdoptions() {
    try {
      const userEmail = await this.authService.getUserEmail();
      this.userReportsService.getAdoptionListings(userEmail).subscribe({
        next: (adoptions: AdoptionListing[]) => {
          this.adoptions = adoptions;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los registros de adopción.';
          this.loading = false;
          console.error('Error al cargar registros de adopción:', err);
        }
      });
    } catch (error) {
      this.error = 'No se pudo obtener el correo del usuario.';
      this.loading = false;
      console.error('Error al obtener el correo del usuario:', error);
    }
  }

  async deleteAdoption(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este registro de adopción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.userReportsService.deleteAdoptionListing(id).subscribe({
              next: () => {
                this.adoptions = this.adoptions.filter(adoption => adoption.id !== id);
              },
              error: (err) => {
                console.error('Error al eliminar el registro de adopción:', err);
                this.showErrorAlert('No se pudo eliminar el registro de adopción. Por favor, intenta de nuevo.');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  editAdoption(id: string) {
    this.navCtrl.navigateForward(`/edit-adoption/${id}`);
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
