"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const SibApiV3Sdk = __importStar(require("@getbrevo/brevo"));
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
    }
    async sendPasswordResetEmail(email, resetToken, firstName) {
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
            const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.to = [{ email, name: firstName }];
            sendSmtpEmail.sender = {
                name: process.env.BREVO_SENDER_NAME || 'ROSAgo',
                email: process.env.BREVO_SENDER_EMAIL || 'noreply@rosago.com',
            };
            sendSmtpEmail.subject = 'Reset Your Password';
            sendSmtpEmail.htmlContent = this.getPasswordResetTemplate(firstName, resetLink);
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            this.logger.log(`Password reset email sent to ${email}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${email}`, error);
            return false;
        }
    }
    getPasswordResetTemplate(firstName, resetLink) {
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
    async sendWelcomeEmail(email, firstName) {
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
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}`, error);
            return false;
        }
    }
    getWelcomeTemplate(firstName) {
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map