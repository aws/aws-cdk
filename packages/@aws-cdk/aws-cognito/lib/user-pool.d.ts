import { Grant, IGrantable, IRole } from '@aws-cdk/aws-iam';
import { IKey } from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, IResource, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICustomAttribute, StandardAttributes } from './user-pool-attr';
import { UserPoolClient, UserPoolClientOptions } from './user-pool-client';
import { UserPoolDomain, UserPoolDomainOptions } from './user-pool-domain';
import { UserPoolEmail } from './user-pool-email';
import { IUserPoolIdentityProvider } from './user-pool-idp';
import { UserPoolResourceServer, UserPoolResourceServerOptions } from './user-pool-resource-server';
/**
 * The different ways in which users of this pool can sign up or sign in.
 */
export interface SignInAliases {
    /**
     * Whether user is allowed to sign up or sign in with a username
     * @default true
     */
    readonly username?: boolean;
    /**
     * Whether a user is allowed to sign up or sign in with an email address
     * @default false
     */
    readonly email?: boolean;
    /**
     * Whether a user is allowed to sign up or sign in with a phone number
     * @default false
     */
    readonly phone?: boolean;
    /**
     * Whether a user is allowed to sign in with a secondary username, that can be set and modified after sign up.
     * Can only be used in conjunction with `USERNAME`.
     * @default false
     */
    readonly preferredUsername?: boolean;
}
/**
 * Attributes that can be automatically verified for users in a user pool.
 */
export interface AutoVerifiedAttrs {
    /**
     * Whether the email address of the user should be auto verified at sign up.
     *
     * Note: If both `email` and `phone` is set, Cognito only verifies the phone number. To also verify email, see here -
     * https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html
     *
     * @default - true, if email is turned on for `signIn`. false, otherwise.
     */
    readonly email?: boolean;
    /**
     * Whether the phone number of the user should be auto verified at sign up.
     * @default - true, if phone is turned on for `signIn`. false, otherwise.
     */
    readonly phone?: boolean;
}
/**
 * Attributes that will be kept until the user verifies the changed attribute.
 */
export interface KeepOriginalAttrs {
    /**
     * Whether the email address of the user should remain the original value until the new email address is verified.
     *
     * @default - false
     */
    readonly email?: boolean;
    /**
     * Whether the phone number of the user should remain the original value until the new phone number is verified.
     *
     * @default - false
     */
    readonly phone?: boolean;
}
/**
 * Triggers for a user pool
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html
 */
export interface UserPoolTriggers {
    /**
     * Creates an authentication challenge.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html
     * @default - no trigger configured
     */
    readonly createAuthChallenge?: lambda.IFunction;
    /**
     * A custom Message AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
     * @default - no trigger configured
     */
    readonly customMessage?: lambda.IFunction;
    /**
     * Defines the authentication challenge.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html
     * @default - no trigger configured
     */
    readonly defineAuthChallenge?: lambda.IFunction;
    /**
     * A post-authentication AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
     * @default - no trigger configured
     */
    readonly postAuthentication?: lambda.IFunction;
    /**
     * A post-confirmation AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
     * @default - no trigger configured
     */
    readonly postConfirmation?: lambda.IFunction;
    /**
     * A pre-authentication AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-authentication.html
     * @default - no trigger configured
     */
    readonly preAuthentication?: lambda.IFunction;
    /**
     * A pre-registration AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
     * @default - no trigger configured
     */
    readonly preSignUp?: lambda.IFunction;
    /**
     * A pre-token-generation AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
     * @default - no trigger configured
     */
    readonly preTokenGeneration?: lambda.IFunction;
    /**
     * A user-migration AWS Lambda trigger.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html
     * @default - no trigger configured
     */
    readonly userMigration?: lambda.IFunction;
    /**
     * Verifies the authentication challenge response.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
     * @default - no trigger configured
     */
    readonly verifyAuthChallengeResponse?: lambda.IFunction;
    /**
     * Amazon Cognito invokes this trigger to send email notifications to users.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-email-sender.html
     * @default - no trigger configured
     */
    readonly customEmailSender?: lambda.IFunction;
    /**
     * Amazon Cognito invokes this trigger to send SMS notifications to users.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-sms-sender.html
     * @default - no trigger configured
     */
    readonly customSmsSender?: lambda.IFunction;
    /**
     * Index signature
     */
    [trigger: string]: lambda.IFunction | undefined;
}
/**
 * User pool operations to which lambda triggers can be attached.
 */
export declare class UserPoolOperation {
    /**
     * Creates a challenge in a custom auth flow
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html
     */
    static readonly CREATE_AUTH_CHALLENGE: UserPoolOperation;
    /**
     * Advanced customization and localization of messages
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
     */
    static readonly CUSTOM_MESSAGE: UserPoolOperation;
    /**
     * Determines the next challenge in a custom auth flow
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html
     */
    static readonly DEFINE_AUTH_CHALLENGE: UserPoolOperation;
    /**
     * Event logging for custom analytics
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
     */
    static readonly POST_AUTHENTICATION: UserPoolOperation;
    /**
     * Custom welcome messages or event logging for custom analytics
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
     */
    static readonly POST_CONFIRMATION: UserPoolOperation;
    /**
     * Custom validation to accept or deny the sign-in request
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-authentication.html
     */
    static readonly PRE_AUTHENTICATION: UserPoolOperation;
    /**
     * Custom validation to accept or deny the sign-up request
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
     */
    static readonly PRE_SIGN_UP: UserPoolOperation;
    /**
     * Add or remove attributes in Id tokens
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
     */
    static readonly PRE_TOKEN_GENERATION: UserPoolOperation;
    /**
     * Migrate a user from an existing user directory to user pools
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html
     */
    static readonly USER_MIGRATION: UserPoolOperation;
    /**
     * Determines if a response is correct in a custom auth flow
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
     */
    static readonly VERIFY_AUTH_CHALLENGE_RESPONSE: UserPoolOperation;
    /**
     * Amazon Cognito invokes this trigger to send email notifications to users.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-email-sender.html
     */
    static readonly CUSTOM_EMAIL_SENDER: UserPoolOperation;
    /**
     * Amazon Cognito invokes this trigger to send email notifications to users.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-sms-sender.html
     */
    static readonly CUSTOM_SMS_SENDER: UserPoolOperation;
    /** A custom user pool operation */
    static of(name: string): UserPoolOperation;
    /** The key to use in `CfnUserPool.LambdaConfigProperty` */
    readonly operationName: string;
    private constructor();
}
/**
 * The email verification style
 */
export declare enum VerificationEmailStyle {
    /** Verify email via code */
    CODE = "CONFIRM_WITH_CODE",
    /** Verify email via link */
    LINK = "CONFIRM_WITH_LINK"
}
/**
 * User pool configuration for user self sign up.
 */
export interface UserVerificationConfig {
    /**
     * The email subject template for the verification email sent to the user upon sign up.
     * See https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-templates.html to
     * learn more about message templates.
     * @default 'Verify your new account'
     */
    readonly emailSubject?: string;
    /**
     * The email body template for the verification email sent to the user upon sign up.
     * See https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-templates.html to
     * learn more about message templates.
     *
     * @default - 'The verification code to your new account is {####}' if VerificationEmailStyle.CODE is chosen,
     * 'Verify your account by clicking on {##Verify Email##}' if VerificationEmailStyle.LINK is chosen.
     */
    readonly emailBody?: string;
    /**
     * Emails can be verified either using a code or a link.
     * Learn more at https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-email-verification-message-customization.html
     * @default VerificationEmailStyle.CODE
     */
    readonly emailStyle?: VerificationEmailStyle;
    /**
     * The message template for the verification SMS sent to the user upon sign up.
     * See https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-message-templates.html to
     * learn more about message templates.
     *
     * @default - 'The verification code to your new account is {####}' if VerificationEmailStyle.CODE is chosen,
     * not configured if VerificationEmailStyle.LINK is chosen
     */
    readonly smsMessage?: string;
}
/**
 * User pool configuration when administrators sign users up.
 */
export interface UserInvitationConfig {
    /**
     * The template to the email subject that is sent to the user when an administrator signs them up to the user pool.
     * @default 'Your temporary password'
     */
    readonly emailSubject?: string;
    /**
     * The template to the email body that is sent to the user when an administrator signs them up to the user pool.
     * @default 'Your username is {username} and temporary password is {####}.'
     */
    readonly emailBody?: string;
    /**
     * The template to the SMS message that is sent to the user when an administrator signs them up to the user pool.
     * @default 'Your username is {username} and temporary password is {####}'
     */
    readonly smsMessage?: string;
}
/**
 * The different ways in which a user pool's MFA enforcement can be configured.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html
 */
export declare enum Mfa {
    /** Users are not required to use MFA for sign in, and cannot configure one. */
    OFF = "OFF",
    /** Users are not required to use MFA for sign in, but can configure one if they so choose to. */
    OPTIONAL = "OPTIONAL",
    /** Users are required to configure an MFA, and have to use it to sign in. */
    REQUIRED = "ON"
}
/**
 * The different ways in which a user pool can obtain their MFA token for sign in.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html
 */
export interface MfaSecondFactor {
    /**
     * The MFA token is sent to the user via SMS to their verified phone numbers
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa-sms-text-message.html
     * @default true
     */
    readonly sms: boolean;
    /**
     * The MFA token is a time-based one time password that is generated by a hardware or software token
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa-totp.html
     * @default false
     */
    readonly otp: boolean;
}
/**
 * Password policy for User Pools.
 */
export interface PasswordPolicy {
    /**
     * The length of time the temporary password generated by an admin is valid.
     * This must be provided as whole days, like Duration.days(3) or Duration.hours(48).
     * Fractional days, such as Duration.hours(20), will generate an error.
     * @default Duration.days(7)
     */
    readonly tempPasswordValidity?: Duration;
    /**
     * Minimum length required for a user's password.
     * @default 8
     */
    readonly minLength?: number;
    /**
     * Whether the user is required to have lowercase characters in their password.
     * @default true
     */
    readonly requireLowercase?: boolean;
    /**
     * Whether the user is required to have uppercase characters in their password.
     * @default true
     */
    readonly requireUppercase?: boolean;
    /**
     * Whether the user is required to have digits in their password.
     * @default true
     */
    readonly requireDigits?: boolean;
    /**
     * Whether the user is required to have symbols in their password.
     * @default true
     */
    readonly requireSymbols?: boolean;
}
/**
 * Email settings for the user pool.
 */
export interface EmailSettings {
    /**
     * The 'from' address on the emails received by the user.
     * @default noreply@verificationemail.com
     */
    readonly from?: string;
    /**
     * The 'replyTo' address on the emails received by the user as defined by IETF RFC-5322.
     * When set, most email clients recognize to change 'to' line to this address when a reply is drafted.
     * @default - Not set.
     */
    readonly replyTo?: string;
}
/**
 * How will a user be able to recover their account?
 *
 * When a user forgets their password, they can have a code sent to their verified email or verified phone to recover their account.
 * You can choose the preferred way to send codes below.
 * We recommend not allowing phone to be used for both password resets and multi-factor authentication (MFA).
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-recover-a-user-account.html
 */
export declare enum AccountRecovery {
    /**
     * Email if available, otherwise phone, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    EMAIL_AND_PHONE_WITHOUT_MFA = 0,
    /**
     * Phone if available, otherwise email, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    PHONE_WITHOUT_MFA_AND_EMAIL = 1,
    /**
     * Email only
     */
    EMAIL_ONLY = 2,
    /**
     * Phone only, but don’t allow a user to reset their password via phone if they are also using it for MFA
     */
    PHONE_ONLY_WITHOUT_MFA = 3,
    /**
     * (Not Recommended) Phone if available, otherwise email, and do allow a user to reset their password via phone if they are also using it for MFA.
     */
    PHONE_AND_EMAIL = 4,
    /**
     * None – users will have to contact an administrator to reset their passwords
     */
    NONE = 5
}
/**
 * Device tracking settings
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-device-tracking.html
 */
export interface DeviceTracking {
    /**
     * Indicates whether a challenge is required on a new device. Only applicable to a new device.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-device-tracking.html
     * @default false
     */
    readonly challengeRequiredOnNewDevice: boolean;
    /**
     * If true, a device is only remembered on user prompt.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-device-tracking.html
     * @default false
     */
    readonly deviceOnlyRememberedOnUserPrompt: boolean;
}
/**
 * The different ways in which a user pool's Advanced Security Mode can be configured.
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-userpooladdons.html#cfn-cognito-userpool-userpooladdons-advancedsecuritymode
 */
export declare enum AdvancedSecurityMode {
    /** Enable advanced security mode */
    ENFORCED = "ENFORCED",
    /** gather metrics on detected risks without taking action. Metrics are published to Amazon CloudWatch */
    AUDIT = "AUDIT",
    /** Advanced security mode is disabled */
    OFF = "OFF"
}
/**
 * Props for the UserPool construct
 */
export interface UserPoolProps {
    /**
     * Name of the user pool
     *
     * @default - automatically generated name by CloudFormation at deploy time
     */
    readonly userPoolName?: string;
    /**
     * Whether self sign up should be enabled. This can be further configured via the `selfSignUp` property.
     * @default false
     */
    readonly selfSignUpEnabled?: boolean;
    /**
     * Configuration around users signing themselves up to the user pool.
     * Enable or disable self sign-up via the `selfSignUpEnabled` property.
     * @default - see defaults in UserVerificationConfig
     */
    readonly userVerification?: UserVerificationConfig;
    /**
     * Configuration around admins signing up users into a user pool.
     * @default - see defaults in UserInvitationConfig
     */
    readonly userInvitation?: UserInvitationConfig;
    /**
     * The IAM role that Cognito will assume while sending SMS messages.
     * @default - a new IAM role is created
     */
    readonly smsRole?: IRole;
    /**
     * The 'ExternalId' that Cognito service must using when assuming the `smsRole`, if the role is restricted with an 'sts:ExternalId' conditional.
     * Learn more about ExternalId here - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html
     *
     * This property will be ignored if `smsRole` is not specified.
     * @default - No external id will be configured
     */
    readonly smsRoleExternalId?: string;
    /**
     * The region to integrate with SNS to send SMS messages
     *
     * This property will do nothing if SMS configuration is not configured
     * @default - The same region as the user pool, with a few exceptions - https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-sms-settings.html#user-pool-sms-settings-first-time
     */
    readonly snsRegion?: string;
    /**
     * Setting this would explicitly enable or disable SMS role creation.
     * When left unspecified, CDK will determine based on other properties if a role is needed or not.
     * @default - CDK will determine based on other properties of the user pool if an SMS role should be created or not.
     */
    readonly enableSmsRole?: boolean;
    /**
     * Methods in which a user registers or signs in to a user pool.
     * Allows either username with aliases OR sign in with email, phone, or both.
     *
     * Read the sections on usernames and aliases to learn more -
     * https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
     *
     * To match with 'Option 1' in the above link, with a verified email, this property should be set to
     * `{ username: true, email: true }`. To match with 'Option 2' in the above link with both a verified email and phone
     * number, this property should be set to `{ email: true, phone: true }`.
     *
     * @default { username: true }
     */
    readonly signInAliases?: SignInAliases;
    /**
     * Attributes which Cognito will look to verify automatically upon user sign up.
     * EMAIL and PHONE are the only available options.
     *
     * @default - If `signInAlias` includes email and/or phone, they will be included in `autoVerifiedAttributes` by default.
     * If absent, no attributes will be auto-verified.
     */
    readonly autoVerify?: AutoVerifiedAttrs;
    /**
     * Attributes which Cognito will look to handle changes to the value of your users' email address and phone number attributes.
     * EMAIL and PHONE are the only available options.
     *
     * @default - Nothing is kept.
     */
    readonly keepOriginal?: KeepOriginalAttrs;
    /**
     * The set of attributes that are required for every user in the user pool.
     * Read more on attributes here - https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
     *
     * @default - All standard attributes are optional and mutable.
     */
    readonly standardAttributes?: StandardAttributes;
    /**
     * Define a set of custom attributes that can be configured for each user in the user pool.
     *
     * @default - No custom attributes.
     */
    readonly customAttributes?: {
        [key: string]: ICustomAttribute;
    };
    /**
     * Configure whether users of this user pool can or are required use MFA to sign in.
     *
     * @default Mfa.OFF
     */
    readonly mfa?: Mfa;
    /**
     * The SMS message template sent during MFA verification.
     * Use '{####}' in the template where Cognito should insert the verification code.
     * @default 'Your authentication code is {####}.'
     */
    readonly mfaMessage?: string;
    /**
     * Configure the MFA types that users can use in this user pool. Ignored if `mfa` is set to `OFF`.
     *
     * @default - { sms: true, otp: false }, if `mfa` is set to `OPTIONAL` or `REQUIRED`.
     * { sms: false, otp: false }, otherwise
     */
    readonly mfaSecondFactor?: MfaSecondFactor;
    /**
     * Password policy for this user pool.
     * @default - see defaults on each property of PasswordPolicy.
     */
    readonly passwordPolicy?: PasswordPolicy;
    /**
     * Email settings for a user pool.
     *
     * @default - see defaults on each property of EmailSettings.
     * @deprecated Use 'email' instead.
     */
    readonly emailSettings?: EmailSettings;
    /**
     * Email settings for a user pool.
     * @default - cognito will use the default email configuration
     */
    readonly email?: UserPoolEmail;
    /**
     * Lambda functions to use for supported Cognito triggers.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html
     * @default - No Lambda triggers.
     */
    readonly lambdaTriggers?: UserPoolTriggers;
    /**
     * Whether sign-in aliases should be evaluated with case sensitivity.
     * For example, when this option is set to false, users will be able to sign in using either `MyUsername` or `myusername`.
     * @default true
     */
    readonly signInCaseSensitive?: boolean;
    /**
     * How will a user be able to recover their account?
     *
     * @default AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL
     */
    readonly accountRecovery?: AccountRecovery;
    /**
     * Policy to apply when the user pool is removed from the stack
     *
     * @default RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Indicates whether the user pool should have deletion protection enabled.
     *
     * @default false
     */
    readonly deletionProtection?: boolean;
    /**
     * Device tracking settings
     * @default - see defaults on each property of DeviceTracking.
     */
    readonly deviceTracking?: DeviceTracking;
    /**
     * This key will be used to encrypt temporary passwords and authorization codes that Amazon Cognito generates.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-sender-triggers.html
     * @default - no key ID configured
     */
    readonly customSenderKmsKey?: IKey;
    /**
     * The user pool's Advanced Security Mode
     * @default - no value
     */
    readonly advancedSecurityMode?: AdvancedSecurityMode;
}
/**
 * Represents a Cognito UserPool
 */
export interface IUserPool extends IResource {
    /**
     * The physical ID of this user pool resource
     * @attribute
     */
    readonly userPoolId: string;
    /**
     * The ARN of this user pool resource
     * @attribute
     */
    readonly userPoolArn: string;
    /**
     * Get all identity providers registered with this user pool.
     */
    readonly identityProviders: IUserPoolIdentityProvider[];
    /**
     * Add a new app client to this user pool.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html
     */
    addClient(id: string, options?: UserPoolClientOptions): UserPoolClient;
    /**
     * Associate a domain to this user pool.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain.html
     */
    addDomain(id: string, options: UserPoolDomainOptions): UserPoolDomain;
    /**
     * Add a new resource server to this user pool.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-resource-servers.html
     */
    addResourceServer(id: string, options: UserPoolResourceServerOptions): UserPoolResourceServer;
    /**
     * Register an identity provider with this user pool.
     */
    registerIdentityProvider(provider: IUserPoolIdentityProvider): void;
    /**
     * Adds an IAM policy statement associated with this user pool to an
     * IAM principal's policy.
     */
    grant(grantee: IGrantable, ...actions: string[]): Grant;
}
declare abstract class UserPoolBase extends Resource implements IUserPool {
    abstract readonly userPoolId: string;
    abstract readonly userPoolArn: string;
    readonly identityProviders: IUserPoolIdentityProvider[];
    addClient(id: string, options?: UserPoolClientOptions): UserPoolClient;
    addDomain(id: string, options: UserPoolDomainOptions): UserPoolDomain;
    addResourceServer(id: string, options: UserPoolResourceServerOptions): UserPoolResourceServer;
    registerIdentityProvider(provider: IUserPoolIdentityProvider): void;
    grant(grantee: IGrantable, ...actions: string[]): Grant;
}
/**
 * Define a Cognito User Pool
 */
export declare class UserPool extends UserPoolBase {
    /**
     * Import an existing user pool based on its id.
     */
    static fromUserPoolId(scope: Construct, id: string, userPoolId: string): IUserPool;
    /**
     * Import an existing user pool based on its ARN.
     */
    static fromUserPoolArn(scope: Construct, id: string, userPoolArn: string): IUserPool;
    /**
     * The physical ID of this user pool resource
     */
    readonly userPoolId: string;
    /**
     * The ARN of the user pool
     */
    readonly userPoolArn: string;
    /**
     * User pool provider name
     * @attribute
     */
    readonly userPoolProviderName: string;
    /**
     * User pool provider URL
     * @attribute
     */
    readonly userPoolProviderUrl: string;
    private triggers;
    constructor(scope: Construct, id: string, props?: UserPoolProps);
    /**
     * Add a lambda trigger to a user pool operation
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html
     */
    addTrigger(operation: UserPoolOperation, fn: lambda.IFunction): void;
    private addLambdaPermission;
    private mfaMessage;
    private verificationMessageConfiguration;
    private signInConfiguration;
    private smsConfiguration;
    private mfaConfiguration;
    private configurePasswordPolicy;
    private schemaConfiguration;
    private accountRecovery;
    private configureUserAttributeChanges;
}
export {};
