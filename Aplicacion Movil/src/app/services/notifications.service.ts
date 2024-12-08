import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);

  constructor() {
    this.loadNotifications();
    // Agregar notificaciones de prueba
    this.addTestNotifications();
  }

  private loadNotifications() {
    const stored = localStorage.getItem('pawfinder_notifications');
    if (stored) {
      this.notifications = JSON.parse(stored);
      this.notificationsSubject.next(this.notifications);
    }
  }

  private saveNotifications() {
    localStorage.setItem('pawfinder_notifications', JSON.stringify(this.notifications));
    this.notificationsSubject.next(this.notifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  addNotification(message: string) {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
      read: false
    };
    this.notifications.unshift(newNotification);
    this.saveNotifications();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  getUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getNotifications().subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }

  // Método para agregar notificaciones de prueba
  private addTestNotifications() {
    this.addNotification('Bienvenido a PawFinder!');
    this.addNotification('Nueva mascota perdida reportada en tu área');
    this.addNotification('Actualización sobre tu reporte de mascota perdida');
  }

  // Método para limpiar todas las notificaciones (útil para pruebas)
  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
  }
}
