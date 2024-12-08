import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  profileImageUrl: SafeUrl | string = 'assets/default-avatar.png';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserData().subscribe({
      next: (user) => {
        this.user = user;
        if (user && user.urlFotoPerfil) {
          //this.loadProfileImage(user.urlFotoPerfil);
          this.profileImageUrl = user.urlFotoPerfil;
        }
        this.loading = false;
        console.log('Datos del usuario cargados:', user);
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información del usuario.';
        this.loading = false;
        console.error('Error al cargar datos del usuario:', err);
      },
    });
  }

  loadProfileImage(imageUrl: string) {
    this.authService.getProfileImage(imageUrl).subscribe({
      next: (blob: Blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error('Error al cargar la imagen de perfil:', err);
        this.profileImageUrl = 'assets/default-avatar.png';
      },
    });
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/auth/login');
  }

  onImageError() {
    console.error(
      'Error al cargar la imagen de perfil. Usando imagen por defecto.'
    );
    this.profileImageUrl = 'assets/default-avatar.png';
  }

  getGenero(genero: string): string {
    return genero === '1' ? 'Masculino' : genero === '2' ? 'Femenino' : 'Otro';
  }


  viewLostPetsReports() {
    this.router.navigate(['/lost-pet-reports']);
  }

  viewAdoptionReports() {
    this.router.navigate(['/adoption-reports']);
  }

}
