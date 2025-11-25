import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Notification, NotificationType } from '@prisma/client';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

@Injectable()
export class NotificationsService {
  private readonly outboundQueue: Queue;
  private readonly redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL);
    this.outboundQueue = new Queue('notification.outbound', {
      connection: this.redis,
    });
  }

  async createNotification(userId: string, title: string, message: string, type: NotificationType = NotificationType.INFO): Promise<Notification> {
    // Save to database
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    // Add to outbound queue for processing
    await this.outboundQueue.add('send-notification', {
      notificationId: notification.id,
      userId,
      title,
      message,
      type,
    });

    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async sendNotificationToUser(userId: string, title: string, message: string, type: NotificationType = NotificationType.INFO): Promise<Notification> {
    return this.createNotification(userId, title, message, type);
  }
}