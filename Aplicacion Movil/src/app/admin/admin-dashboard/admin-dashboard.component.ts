import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminService, User, LostPet, AdoptionPet } from '../../services/admin.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Interfaz para las estadísticas del dashboard
interface DashboardStats {
  totalUsers: number;
  totalLostPets: number;
  totalAdoptions: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  // Propiedades del componente
  adminName: string = '';
  stats: DashboardStats = {
    totalUsers: 0,
    totalLostPets: 0,
    totalAdoptions: 0
  };
  activeSection: 'overview' | 'users' | 'lostPets' | 'adoptions' = 'overview';
  users: User[] = [];
  lostPets: LostPet[] = [];
  adoptionPets: AdoptionPet[] = [];

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadAdminInfo();
    this.loadAllData();
  }

  // Carga la información del administrador
  loadAdminInfo() {
    this.authService.getUserData().subscribe({
      next: (user) => {
        if (user && user.correo === 'admin@admin.cl') {
          this.adminName = `${user.nombre} ${user.apellido}`;
        } else {
          console.error('Usuario no autorizado');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Error al cargar la información del administrador:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  // Carga todos los datos necesarios para el dashboard
  loadAllData() {
    this.loadUsers();
    this.loadLostPets();
    this.loadAdoptionPets();
  }

  // Carga la lista de usuarios
  loadUsers() {
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.updateStats();
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  // Carga la lista de mascotas perdidas
  loadLostPets() {
    this.adminService.getLostPets().subscribe({
      next: (pets) => {
        this.lostPets = pets;
        this.updateStats();
      },
      error: (error) => console.error('Error al cargar mascotas perdidas:', error)
    });
  }

  // Carga la lista de mascotas en adopción
  loadAdoptionPets() {
    this.adminService.getAdoptionPets().subscribe({
      next: (pets) => {
        this.adoptionPets = pets;
        this.updateStats();
      },
      error: (error) => console.error('Error al cargar mascotas en adopción:', error)
    });
  }

  // Actualiza las estadísticas del dashboard
  updateStats() {
    this.stats = {
      totalUsers: this.users.length,
      totalLostPets: this.lostPets.length,
      totalAdoptions: this.adoptionPets.length
    };
  }

  // Elimina un usuario
  async deleteUser(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.adminService.deleteUser(id).subscribe({
              next: () => {
                this.users = this.users.filter(user => user.id !== id);
                this.updateStats();
              },
              error: (error) => console.error('Error al eliminar usuario:', error)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Elimina una mascota perdida
  async deleteLostPet(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta mascota perdida?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.adminService.deleteLostPet(id).subscribe({
              next: () => {
                this.lostPets = this.lostPets.filter(pet => pet.id !== id);
                this.updateStats();
              },
              error: (error) => console.error('Error al eliminar mascota perdida:', error)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Elimina una mascota en adopción
  async deleteAdoptionPet(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar esta mascota en adopción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.adminService.deleteAdoptionPet(id).subscribe({
              next: () => {
                this.adoptionPets = this.adoptionPets.filter(pet => pet.id !== id);
                this.updateStats();
              },
              error: (error) => console.error('Error al eliminar mascota en adopción:', error)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Cambia la sección activa del dashboard
  setActiveSection(event: CustomEvent) {
    const selectedValue = event.detail.value;
    if (selectedValue === 'overview' || selectedValue === 'users' || selectedValue === 'lostPets' || selectedValue === 'adoptions') {
      this.activeSection = selectedValue;
    } else {
      console.error('Valor de sección no válido:', selectedValue);
    }
  }

  // Cierra la sesión del administrador
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error durante el cierre de sesión:', error);
      }
    });
  }
}
