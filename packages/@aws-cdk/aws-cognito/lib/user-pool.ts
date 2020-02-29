import { IRole, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { CfnUserPool } from './cognito.generated';
import { ICustomAttribute, StandardAttribute } from './user-pool-attr';

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
   * The set of attributes that are required for every user in the user pool.
   * Read more on attributes here - https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
   *
   * @default - No attributes are required.
   */
  readonly requiredAttributes?: StandardAttribute[];

  /**
   * Define a set of custom attributes that can be configured for each user in the user pool.
   *
   * @default - No custom attributes.
   */
  readonly customAttributes?: { [key: string]: ICustomAttribute };

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
      schema: this.schemaConfiguration(props),
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
      if (signIn.email) { aliasAttrs.push(StandardAttribute.EMAIL); }
      if (signIn.phone) { aliasAttrs.push(StandardAttribute.PHONE_NUMBER); }
      if (signIn.preferredUsername) { aliasAttrs.push(StandardAttribute.PREFERRED_USERNAME); }
      if (aliasAttrs.length === 0) { aliasAttrs = undefined; }
    } else {
      usernameAttrs = [];
      if (signIn.email) { usernameAttrs.push(StandardAttribute.EMAIL); }
      if (signIn.phone) { usernameAttrs.push(StandardAttribute.PHONE_NUMBER); }
    }

    if (props.autoVerify) {
      autoVerifyAttrs = [];
      if (props.autoVerify.email) { autoVerifyAttrs.push(StandardAttribute.EMAIL); }
      if (props.autoVerify.phone) { autoVerifyAttrs.push(StandardAttribute.PHONE_NUMBER); }
    } else if (signIn.email || signIn.phone) {
      autoVerifyAttrs = [];
      if (signIn.email) { autoVerifyAttrs.push(StandardAttribute.EMAIL); }
      if (signIn.phone) { autoVerifyAttrs.push(StandardAttribute.PHONE_NUMBER); }
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

  private schemaConfiguration(props: UserPoolProps): CfnUserPool.SchemaAttributeProperty[] | undefined {
    const schema: CfnUserPool.SchemaAttributeProperty[] = [];

    if (props.requiredAttributes) {
      schema.push(...props.requiredAttributes.map((attr) => {
        return { name: attr, required: true };
      }));
    }

    if (props.customAttributes) {
      const customAttrs = Object.keys(props.customAttributes).map((attrName) => {
        const attrConfig = props.customAttributes![attrName].bind();
        return {
          name: attrName,
          attributeDataType: attrConfig.dataType,
          ...attrConfig.constraints,
        };
      });
      schema.push(...customAttrs);
    }

    if (schema.length === 0) {
      return undefined;
    }
    return schema;
  }
}