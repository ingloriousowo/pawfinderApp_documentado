import { Component, OnInit } from '@angular/core';
import { NotificationsService, Notification } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationsService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
  }

  markAsRead(id: string) {
    this.notificationsService.markAsRead(id);
    this.loadNotifications();
  }

  clearAllNotifications() {
    this.notificationsService.clearAllNotifications();
    this.loadNotifications();
  }
}

