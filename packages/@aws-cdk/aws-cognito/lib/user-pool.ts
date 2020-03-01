import { IRole, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { CfnUserPool } from './cognito.generated';

/**
 * Standard attributes
 * Specified following the OpenID Connect spec
 * @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export enum UserPoolAttribute {
  /**
   * End-User's preferred postal address.
   */
  ADDRESS = 'address',

  /**
   * End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format.
   * The year MAY be 0000, indicating that it is omitted.
   * To represent only the year, YYYY format is allowed.
   */
  BIRTHDATE = 'birthdate',

  /**
   * End-User's preferred e-mail address.
   * Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax.
   */
  EMAIL = 'email',

  /**
   * Surname(s) or last name(s) of the End-User.
   * Note that in some cultures, people can have multiple family names or no family name;
   * all can be present, with the names being separated by space characters.
   */
  FAMILY_NAME = 'family_name',

  /**
   * End-User's gender.
   */
  GENDER = 'gender',

  /**
   * Given name(s) or first name(s) of the End-User.
   * Note that in some cultures, people can have multiple given names;
   * all can be present, with the names being separated by space characters.
   */
  GIVEN_NAME = 'given_name',

  /**
   * End-User's locale, represented as a BCP47 [RFC5646] language tag.
   * This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase
   * and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash.
   * For example, en-US or fr-CA.
   */
  LOCALE = 'locale',

  /**
   * Middle name(s) of the End-User.
   * Note that in some cultures, people can have multiple middle names;
   * all can be present, with the names being separated by space characters.
   * Also note that in some cultures, middle names are not used.
   */
  MIDDLE_NAME = 'middle_name',

  /**
   * End-User's full name in displayable form including all name parts,
   * possibly including titles and suffixes, ordered according to the End-User's locale and preferences.
   */
  NAME = 'name',

  /**
   * Casual name of the End-User that may or may not be the same as the given_name.
   * For instance, a nickname value of Mike might be returned alongside a given_name value of Michael.
   */
  NICKNAME = 'nickname',

  /**
   * End-User's preferred telephone number.
   * E.164 [E.164] is RECOMMENDED as the format of this Claim, for example, +1 (425) 555-1212 or +56 (2) 687 2400.
   * If the phone number contains an extension, it is RECOMMENDED that the extension be represented using the
   * RFC 3966 [RFC3966] extension syntax, for example, +1 (604) 555-1234;ext=5678.
   */
  PHONE_NUMBER = 'phone_number',

  /**
   * URL of the End-User's profile picture.
   * This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file),
   * rather than to a Web page containing an image.
   * Note that this URL SHOULD specifically reference a profile photo of the End-User
   * suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User
   */
  PICTURE = 'picture',

  /**
   * Shorthand name by which the End-User wishes to be referred to.
   */
  PREFERRED_USERNAME = 'preferred_username',

  /**
   * URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User.
   */
  PROFILE = 'profile',

  /**
   * The End-User's time zone
   */
  TIMEZONE = 'zoneinfo',

  /**
   * Time the End-User's information was last updated.
   * Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z
   * as measured in UTC until the date/time.
   */
  UPDATED_AT = 'updated_at',

  /**
   * URL of the End-User's Web page or blog.
   * This Web page SHOULD contain information published by the End-User or an organization that the End-User is affiliated with.
   */
  WEBSITE = 'website'
}

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
   * Whether a user is allowed to ign in with a secondary username, that can be set and modified after sign up.
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
   * @default - true, if email is turned on for `signIn`. false, otherwise.
   */
  readonly email?: boolean;

  /**
   * Whether the phone number of the user should be auto verified at sign up.
   * @default - true, if phone is turned on for `signIn`. false, otherwise.
   */
  readonly phone?: boolean;
}

export interface UserPoolTriggers {
  /**
   * Creates an authentication challenge.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html
   */
  readonly createAuthChallenge?: lambda.IFunction;

  /**
   * A custom Message AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
   */
  readonly customMessage?: lambda.IFunction;

  /**
   * Defines the authentication challenge.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html
   */
  readonly defineAuthChallenge?: lambda.IFunction;

  /**
   * A post-authentication AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
   */
  readonly postAuthentication?: lambda.IFunction;

  /**
   * A post-confirmation AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
   */
  readonly postConfirmation?: lambda.IFunction;

  /**
   * A pre-authentication AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-authentication.html
   */
  readonly preAuthentication?: lambda.IFunction;

  /**
   * A pre-registration AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
   */
  readonly preSignUp?: lambda.IFunction;

  /**
   * A pre-token-generation AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
   */
  readonly preTokenGeneration?: lambda.IFunction;

  /**
   * A user-migration AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html
   */
  readonly userMigration?: lambda.IFunction;

  /**
   * Verifies the authentication challenge response.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
   */
  readonly verifyAuthChallengeResponse?: lambda.IFunction;

  /**
   * Index signature
   */
  [trigger: string]: lambda.IFunction | undefined;
}

/**
 * The email verification style
 */
export enum VerificationEmailStyle {
  /** Verify email via code */
  CODE = 'CONFIRM_WITH_CODE',
  /** Verify email via link */
  LINK = 'CONFIRM_WITH_LINK',
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
   * @default 'Hello {username}, Your verification code is {####}'
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
   * @default 'The verification code to your new account is {####}'
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
   * @default - If `signIn` include email and/or phone, they will be included in `autoVerifiedAttributes` by default.
   * If absent, no attributes will be auto-verified.
   */
  readonly autoVerify?: AutoVerifiedAttrs;

  /**
   * Lambda functions to use for supported Cognito triggers.
   *
   * @default - No Lambda triggers.
   */
  readonly lambdaTriggers?: UserPoolTriggers;
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
}

/**
 * Define a Cognito User Pool
 */
export class UserPool extends Resource implements IUserPool {
  /**
   * Import an existing user pool based on its id.
   */
  public static fromUserPoolId(scope: Construct, id: string, userPoolId: string): IUserPool {
    class Import extends Resource implements IUserPool {
      public readonly userPoolId = userPoolId;
      public readonly userPoolArn = Stack.of(this).formatArn({
        service: 'cognito-idp',
        resource: 'userpool',
        resourceName: userPoolId,
      });
    }
    return new Import(scope, id);
  }

  /**
   * Import an existing user pool based on its ARN.
   */
  public static fromUserPoolArn(scope: Construct, id: string, userPoolArn: string): IUserPool {
    class Import extends Resource implements IUserPool {
      public readonly userPoolArn = userPoolArn;
      public readonly userPoolId = Stack.of(this).parseArn(userPoolArn).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * The physical ID of this user pool resource
   */
  public readonly userPoolId: string;

  /**
   * The ARN of the user pool
   */
  public readonly userPoolArn: string;

  /**
   * User pool provider name
   * @attribute
   */
  public readonly userPoolProviderName: string;

  /**
   * User pool provider URL
   * @attribute
   */
  public readonly userPoolProviderUrl: string;

  private triggers: CfnUserPool.LambdaConfigProperty = { };

  constructor(scope: Construct, id: string, props: UserPoolProps = {}) {
    super(scope, id);

    const signIn = this.signInConfiguration(props);

    if (props.lambdaTriggers) {
      for (const t of Object.keys(props.lambdaTriggers)) {
        const trigger = props.lambdaTriggers[t];
        if (trigger !== undefined) {
          this.addLambdaPermission(trigger as lambda.IFunction, t);
          (this.triggers as any)[t] = (trigger as lambda.IFunction).functionArn;
        }
      }
    }

    const emailVerificationSubject = props.userVerification?.emailSubject ?? 'Verify your new account';
    const emailVerificationMessage = props.userVerification?.emailBody ?? 'Hello {username}, Your verification code is {####}';
    const smsVerificationMessage = props.userVerification?.smsMessage ?? 'The verification code to your new account is {####}';

    const defaultEmailOption = props.userVerification?.emailStyle ?? VerificationEmailStyle.CODE;
    const verificationMessageTemplate: CfnUserPool.VerificationMessageTemplateProperty =
      (defaultEmailOption === VerificationEmailStyle.CODE) ? {
        defaultEmailOption,
        emailMessage: emailVerificationMessage,
        emailSubject: emailVerificationSubject,
        smsMessage: smsVerificationMessage,
      } : {
        defaultEmailOption,
        emailMessageByLink: emailVerificationMessage,
        emailSubjectByLink: emailVerificationSubject,
        smsMessage: smsVerificationMessage
      };

    const inviteMessageTemplate: CfnUserPool.InviteMessageTemplateProperty = {
      emailMessage: props.userInvitation?.emailBody,
      emailSubject: props.userInvitation?.emailSubject,
      smsMessage: props.userInvitation?.smsMessage,
    };
    const selfSignUpEnabled = props.selfSignUpEnabled !== undefined ? props.selfSignUpEnabled : false;
    const adminCreateUserConfig: CfnUserPool.AdminCreateUserConfigProperty = {
      allowAdminCreateUserOnly: !selfSignUpEnabled,
      inviteMessageTemplate: props.userInvitation !== undefined ? inviteMessageTemplate : undefined,
    };

    const userPool = new CfnUserPool(this, 'Resource', {
      userPoolName: props.userPoolName,
      usernameAttributes: signIn.usernameAttrs,
      aliasAttributes: signIn.aliasAttrs,
      autoVerifiedAttributes: signIn.autoVerifyAttrs,
      lambdaConfig: Lazy.anyValue({ produce: () => this.triggers }),
      smsConfiguration: this.smsConfiguration(props),
      adminCreateUserConfig,
      emailVerificationMessage,
      emailVerificationSubject,
      smsVerificationMessage,
      verificationMessageTemplate,
    });

    this.userPoolId = userPool.ref;
    this.userPoolArn = userPool.attrArn;

    this.userPoolProviderName = userPool.attrProviderName;
    this.userPoolProviderUrl = userPool.attrProviderUrl;
  }

  /**
   * Attach 'Create Auth Challenge' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html
   * @param fn the lambda function to attach
   */
  public addCreateAuthChallengeTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'CreateAuthChallenge');
    this.triggers = { ...this.triggers, createAuthChallenge: fn.functionArn };
  }

  /**
   * Attach 'Custom Message' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
   * @param fn the lambda function to attach
   */
  public addCustomMessageTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'CustomMessage');
    this.triggers = { ...this.triggers, customMessage: fn.functionArn };
  }

  /**
   * Attach 'Define Auth Challenge' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html
   * @param fn the lambda function to attach
   */
  public addDefineAuthChallengeTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'DefineAuthChallenge');
    this.triggers = { ...this.triggers, defineAuthChallenge: fn.functionArn };
  }

  /**
   * Attach 'Post Authentication' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-authentication.html
   * @param fn the lambda function to attach
   */
  public addPostAuthenticationTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'PostAuthentication');
    this.triggers = { ...this.triggers, postAuthentication: fn.functionArn };
  }

  /**
   * Attach 'Post Confirmation' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
   * @param fn the lambda function to attach
   */
  public addPostConfirmationTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'PostConfirmation');
    this.triggers = { ...this.triggers, postConfirmation: fn.functionArn };
  }

  /**
   * Attach 'Pre Authentication' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-authentication.html
   * @param fn the lambda function to attach
   */
  public addPreAuthenticationTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'PreAuthentication');
    this.triggers = { ...this.triggers, preAuthentication: fn.functionArn };
  }

  /**
   * Attach 'Pre Sign Up' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
   * @param fn the lambda function to attach
   */
  public addPreSignUpTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'PreSignUp');
    this.triggers = { ...this.triggers, preSignUp: fn.functionArn };
  }

  /**
   * Attach 'Pre Token Generation' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
   * @param fn the lambda function to attach
   */
  public addPreTokenGenerationTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'PreTokenGeneration');
    this.triggers = { ...this.triggers, preTokenGeneration: fn.functionArn };
  }

  /**
   * Attach 'User Migration' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-migrate-user.html
   * @param fn the lambda function to attach
   */
  public addUserMigrationTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'UserMigration');
    this.triggers = { ...this.triggers, userMigration: fn.functionArn };
  }

  /**
   * Attach 'Verify Auth Challenge Response' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
   * @param fn the lambda function to attach
   */
  public addVerifyAuthChallengeResponseTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'VerifyAuthChallengeResponse');
    this.triggers = { ...this.triggers, verifyAuthChallengeResponse: fn.functionArn };
  }

  private addLambdaPermission(fn: lambda.IFunction, name: string): void {
    const normalize = name.charAt(0).toUpperCase() + name.slice(1);
    fn.addPermission(`${normalize}Cognito`, {
      principal: new ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: this.userPoolArn
    });
  }

  private signInConfiguration(props: UserPoolProps) {
    let aliasAttrs: string[] | undefined;
    let usernameAttrs: string[] | undefined;
    let autoVerifyAttrs: string[] | undefined;

    const signIn: SignInAliases = props.signInAliases ?? { username: true };

    if (signIn.preferredUsername && !signIn.username) {
      throw new Error('username signIn must be enabled if preferredUsername is enabled');
    }

    if (signIn.username) {
      aliasAttrs = [];
      if (signIn.email) { aliasAttrs.push(UserPoolAttribute.EMAIL); }
      if (signIn.phone) { aliasAttrs.push(UserPoolAttribute.PHONE_NUMBER); }
      if (signIn.preferredUsername) { aliasAttrs.push(UserPoolAttribute.PREFERRED_USERNAME); }
      if (aliasAttrs.length === 0) { aliasAttrs = undefined; }
    } else {
      usernameAttrs = [];
      if (signIn.email) { usernameAttrs.push(UserPoolAttribute.EMAIL); }
      if (signIn.phone) { usernameAttrs.push(UserPoolAttribute.PHONE_NUMBER); }
    }

    if (props.autoVerify) {
      autoVerifyAttrs = [];
      if (props.autoVerify.email) { autoVerifyAttrs.push(UserPoolAttribute.EMAIL); }
      if (props.autoVerify.phone) { autoVerifyAttrs.push(UserPoolAttribute.PHONE_NUMBER); }
    } else if (signIn.email || signIn.phone) {
      autoVerifyAttrs = [];
      if (signIn.email) { autoVerifyAttrs.push(UserPoolAttribute.EMAIL); }
      if (signIn.phone) { autoVerifyAttrs.push(UserPoolAttribute.PHONE_NUMBER); }
    }

    return { usernameAttrs, aliasAttrs, autoVerifyAttrs };
  }

  private smsConfiguration(props: UserPoolProps): CfnUserPool.SmsConfigurationProperty {
    if (props.smsRole) {
      return {
        snsCallerArn: props.smsRole.roleArn,
        externalId: props.smsRoleExternalId
      };
    } else {
      const smsRoleExternalId = this.node.uniqueId.substr(0, 1223); // sts:ExternalId max length of 1224
      const smsRole = props.smsRole ?? new Role(this, 'smsRole', {
        assumedBy: new ServicePrincipal('cognito-idp.amazonaws.com', {
          conditions: {
            StringEquals: { 'sts:ExternalId': smsRoleExternalId }
          }
        }),
        inlinePolicies: {
          /*
           * The UserPool is very particular that it must contain an 'sns:Publish' action as an inline policy.
           * Ideally, a conditional that restricts this action to 'sms' protocol needs to be attached, but the UserPool deployment fails validation.
           * Seems like a case of being excessively strict.
           */
          'sns-publish': new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: [ 'sns:Publish' ],
                resources: [ '*' ],
              })
            ]
          })
        }
      });
      return {
        externalId: smsRoleExternalId,
        snsCallerArn: smsRole.roleArn
      };
    }
  }
}