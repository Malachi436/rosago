export declare class EmailService {
    private readonly logger;
    private apiInstance;
    constructor();
    sendPasswordResetEmail(email: string, resetToken: string, firstName: string): Promise<boolean>;
    private getPasswordResetTemplate;
    sendWelcomeEmail(email: string, firstName: string): Promise<boolean>;
    private getWelcomeTemplate;
}
