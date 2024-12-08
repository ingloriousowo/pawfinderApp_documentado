import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from '../services/notifications.service';

interface HighlightStory {
  id: number;
  type: 'found' | 'adopted' | 'lost';
  title: string;
  image: string;
  date: string;
  location: string;
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  highlights: HighlightStory[] = [
    {
      id: 1,
      type: 'found',
      title: '¡Max volvió a casa!',
      image: 'https://fastly.picsum.photos/id/169/2500/1662.jpg?hmac=3DBeyQbiPxO88hBdhIuFPbvy2ff7cm9vmnq8lPIL9Ug',
      date: '2 horas atrás',
      location: 'Santiago Centro'
    },
    {
      id: 2,
      type: 'adopted',
      title: 'Luna encontró familia',
      image: 'https://fastly.picsum.photos/id/237/3500/2095.jpg?hmac=y2n_cflHFKpQwLOL1SSCtVDqL8NmOnBzEW7LYKZ-z_o',
      date: '5 horas atrás',
      location: 'Providencia'
    },
    {
      id: 3,
      type: 'lost',
      title: 'Ayuda a encontrar a Toby',
      image: 'https://fastly.picsum.photos/id/837/5000/3333.jpg?hmac=5bLH7a-_tQBbqyL8QkbIPszjnaPuea93jw34cf_gRRg',
      date: '1 hora atrás',
      location: 'Las Condes'
    }
  ];

  quickActions: QuickAction[] = [
    {
      id: 1,
      title: 'Reportar Mascota Perdida',
      description: '¿Perdiste tu mascota? Repórtala y te ayudaremos a encontrarla',
      icon: 'alert-circle',
      color: '#ff6b00',
      route: '/report-lost',
      badge: 'Urgente'
    },
    {
      id: 2,
      title: 'Encontrar Mascota Perdida',
      description: 'Ayuda a una mascota a volver a casa reportando su ubicación',
      icon: 'search',
      color: '#ff6b00',
      route: '/find-lost-pet',
      badge: 'Nuevo'
    },
    {
      id: 3,
      title: 'Dar en Adopción',
      description: 'Registra una mascota para darla en adopción responsable',
      icon: 'heart',
      color: '#ff6b00',
      route: '/give-adoption'
    },
    {
      id: 4,
      title: 'Adoptar Mascota',
      description: 'Encuentra tu compañero perfecto entre nuestras mascotas disponibles',
      icon: 'home',
      color: '#ff6b00',
      route: '/adopt-pet'
    },
    {
      id: 5,
      title: 'Realizar Donación',
      description: 'Ayúdanos a seguir conectando mascotas con sus familias',
      icon: 'gift',
      color: '#ff6b00',
      route: '/donations',
      badge: '♥'
    },
    {
      id: 6,
      title: 'Más sobre PawFinder',
      description: 'Descubre nuestra misión y cómo ayudamos a las mascotas',
      icon: 'information-circle',
      color: '#ff6b00',
      route: '/about-pawfinder',
      badge: 'Info'
    }
  ];

  unreadNotificationsCount: number = 0;

  constructor(
    private router: Router,
    private notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.notificationsService.getUnreadCount().subscribe(
      count => this.unreadNotificationsCount = count
    );
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }
}
