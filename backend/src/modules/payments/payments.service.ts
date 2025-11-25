import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentIntent } from '@prisma/client';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly webhookQueue: Queue;
  private readonly redis: Redis;

  constructor(private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL);
    this.webhookQueue = new Queue('payment.process_webhook', {
      connection: this.redis,
    });
  }

  async createPaymentIntent(parentId: string, amount: number, currency: string = 'UGX'): Promise<PaymentIntent> {
    // Mock Hubtle API call
    const hubtleRef = `hubtle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create payment intent in database
    const paymentIntent = await this.prisma.paymentIntent.create({
      data: {
        parentId,
        amount,
        currency,
        status: 'pending',
        hubtleRef,
      },
    });

    return paymentIntent;
  }

  async processWebhook(signature: string, payload: any): Promise<void> {
    // Validate webhook signature
    if (!this.isValidWebhookSignature(signature, payload)) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Add to queue for processing
    await this.webhookQueue.add('process-webhook', {
      payload,
    });
  }

  private isValidWebhookSignature(signature: string, payload: any): boolean {
    // Mock signature validation - in real implementation, you would validate against Hubtle's signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.HUBTLE_WEBHOOK_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return signature === expectedSignature;
  }

  async getPaymentHistory(parentId: string): Promise<PaymentIntent[]> {
    return this.prisma.paymentIntent.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentById(id: string): Promise<PaymentIntent | null> {
    return this.prisma.paymentIntent.findUnique({
      where: { id },
    });
  }
}