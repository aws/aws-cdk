import { Construct } from 'constructs';
/**
 * Configuration for Cognito sending emails via Amazon SES
 */
export interface UserPoolSESOptions {
    /**
     * The verified Amazon SES email address that Cognito should
     * use to send emails.
     *
     * The email address used must be a verified email address
     * in Amazon SES and must be configured to allow Cognito to
     * send emails.
     *
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html
     */
    readonly fromEmail: string;
    /**
     * An optional name that should be used as the sender's name
     * along with the email.
     *
     * @default - no name
     */
    readonly fromName?: string;
    /**
     * The destination to which the receiver of the email should reploy to.
     *
     * @default - same as the fromEmail
     */
    readonly replyTo?: string;
    /**
     * The name of a configuration set in Amazon SES that should
     * be applied to emails sent via Cognito.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-configurationset
     *
     * @default - no configuration set
     */
    readonly configurationSetName?: string;
    /**
     * Required if the UserPool region is different than the SES region.
     *
     * If sending emails with a Amazon SES verified email address,
     * and the region that SES is configured is different than the
     * region in which the UserPool is deployed, you must specify that
     * region here.
     *
     * @default - The same region as the Cognito UserPool
     */
    readonly sesRegion?: string;
    /**
     * SES Verified custom domain to be used to verify the identity
     *
     * @default - no domain
     */
    readonly sesVerifiedDomain?: string;
}
/**
 * Result of binding email settings with a user pool
 */
interface UserPoolEmailConfig {
    /**
     * The name of the configuration set in SES.
     *
     * @default - none
     */
    readonly configurationSet?: string;
    /**
     * Specifies whether to use Cognito's built in email functionality
     * or SES.
     *
     * @default - Cognito built in email functionality
     */
    readonly emailSendingAccount?: string;
    /**
     * Identifies either the sender's email address or the sender's
     * name with their email address.
     *
     * If emailSendingAccount is DEVELOPER then this cannot be specified.
     *
     * @default 'no-reply@verificationemail.com'
     */
    readonly from?: string;
    /**
     * The destination to which the receiver of the email should reply to.
     *
     * @default - same as `from`
     */
    readonly replyToEmailAddress?: string;
    /**
     * The ARN of a verified email address in Amazon SES.
     *
     * required if emailSendingAccount is DEVELOPER or if
     * 'from' is provided.
     *
     * @default - none
     */
    readonly sourceArn?: string;
}
/**
 * Configure how Cognito sends emails
 */
export declare abstract class UserPoolEmail {
    /**
     * Send email using Cognito
     */
    static withCognito(replyTo?: string): UserPoolEmail;
    /**
     * Send email using SES
     */
    static withSES(options: UserPoolSESOptions): UserPoolEmail;
    /**
     * Returns the email configuration for a Cognito UserPool
     * that controls how Cognito will send emails
     * @internal
     */
    abstract _bind(scope: Construct): UserPoolEmailConfig;
}
export {};
