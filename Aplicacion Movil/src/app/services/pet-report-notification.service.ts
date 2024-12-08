import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AuthService } from './auth.service';
import { PetReport } from './pet-report.service';

@Injectable({
  providedIn: 'root'
})
export class PetReportNotificationService {
  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService
  ) {}

  checkForNearbyReports(newReport: PetReport, allReports: PetReport[]) {
    const nearbyReports = allReports.filter(report =>
      report.id !== newReport.id &&
      this.isSameStreet(report.direccion, newReport.direccion)
    );

    if (nearbyReports.length > 0) {
      // Notificar al usuario que acaba de crear el reporte
      this.notificationsService.addNotification(
        `Se ha registrado tu mascota en ${newReport.direccion}. Hay ${nearbyReports.length} reporte(s) similar(es) en la misma zona.`
      );

      // Notificar a los usuarios que tienen reportes en la misma calle
      nearbyReports.forEach(report => {
        this.notifyUser(report.emailContacto,
          `Se ha registrado una nueva mascota ${newReport.tipo_mascota} cerca de tu reporte en ${report.direccion}.`
        );
      });
    }
  }

  private isSameStreet(address1: string, address2: string): boolean {
    const street1 = this.simplifyAddress(address1);
    const street2 = this.simplifyAddress(address2);
    return street1 === street2;
  }

  private simplifyAddress(address: string): string {
    return address
      .toLowerCase()
      .replace(/\d+/g, '')
      .replace(/,.*$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private notifyUser(email: string, message: string) {
    this.authService.getUserEmail().then(currentUserEmail => {
      if (currentUserEmail === email) {
        this.notificationsService.addNotification(message);
      }
    });
  }
}
