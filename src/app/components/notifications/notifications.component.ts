import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { INotification } from '@/app/models/inotification';
import { NotificationService } from '@/app/services/notification.service';

// Simple notification interface for component use
interface SimpleNotification {
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: SimpleNotification[] = [];
  readNotifications: Set<number> = new Set(); // Track read notifications locally

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  // Simple method to load notifications from API
  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.notifications = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  // Simple getter for unread count
  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead && !this.isNotificationRead(n.userId)).length;
  }

  // Simple method to format time
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  // Simple method to mark as read
  markAsRead(userId: number) {
    this.readNotifications.add(userId);
    const notification = this.notifications.find(n => n.userId === userId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Simple method to check if notification is read
  isNotificationRead(userId: number): boolean {
    return this.readNotifications.has(userId);
  }

  // Simple method to mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => {
      this.readNotifications.add(n.userId);
      n.isRead = true;
    });
  }
}
