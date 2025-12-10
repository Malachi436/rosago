import { Injectable, Logger } from '@nestjs/common';
import * as SibApiV3Sdk from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY || '',
    );
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string,
  ): Promise<boolean> {
    try {
      // Build reset URL - use frontend URL from env or default
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email, name: firstName }];
      sendSmtpEmail.sender = {
        name: process.env.BREVO_SENDER_NAME || 'ROSAgo',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@rosago.com',
      };
      sendSmtpEmail.subject = 'Reset Your Password';
      sendSmtpEmail.htmlContent = this.getPasswordResetTemplate(
        firstName,
        resetLink,
      );

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      return false;
    }
  }

  private getPasswordResetTemplate(firstName: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚌 ROSAgo</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">School Bus Tracking System</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${firstName},</h2>
          
          <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #3B82F6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">This link will expire in <strong>1 hour</strong> for security reasons.</p>
          
          <p style="color: #6b7280; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #3B82F6; word-break: break-all;">${resetLink}</a>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ROSAgo. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(
    email: string,
    firstName: string,
  ): Promise<boolean> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email, name: firstName }];
      sendSmtpEmail.sender = {
        name: process.env.BREVO_SENDER_NAME || 'ROSAgo',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@rosago.com',
      };
      sendSmtpEmail.subject = 'Welcome to ROSAgo!';
      sendSmtpEmail.htmlContent = this.getWelcomeTemplate(firstName);

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
      return false;
    }
  }

  private getWelcomeTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ROSAgo</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚌 Welcome to ROSAgo!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hi ${firstName}! 👋</h2>
          
          <p style="color: #4b5563;">Thank you for joining ROSAgo - your trusted school bus tracking system.</p>
          
          <p style="color: #4b5563;">With ROSAgo, you can:</p>
          <ul style="color: #4b5563;">
            <li>📍 Track your child's bus in real-time</li>
            <li>🔔 Receive instant notifications for pickups and dropoffs</li>
            <li>📞 Contact the driver directly if needed</li>
            <li>📊 View trip history and attendance</li>
          </ul>
          
          <p style="color: #4b5563;">Download the app and login with your credentials to get started!</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Need help? Contact our support team.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ROSAgo. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}
