import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
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
  TIMEZONE = 'timezone',

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
 * Methods of user sign-in
 */
export enum SignInType {
  /**
   * End-user will sign in with a username, with optional aliases
   */
  USERNAME,

  /**
   * End-user will sign in using an email address
   */
  EMAIL,

  /**
   * End-user will sign in using a phone number
   */
  PHONE,

  /**
   * End-user will sign in using either an email address or phone number
   */
  EMAIL_OR_PHONE
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
   * Verifies the authentication challenge response.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
   */
  readonly verifyAuthChallengeResponse?: lambda.IFunction;

  /**
   * A pre-token-generation AWS Lambda trigger.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-token-generation.html
   */
  readonly preTokenGeneration?: lambda.IFunction;

  /**
   * Index signature
   */
  [trigger: string]: lambda.IFunction | undefined;
}

export interface UserPoolProps {
  /**
   * Name of the user pool
   *
   * @default - automatically generated name by CloudFormation at deploy time
   */
  readonly userPoolName?: string;

  /**
   * Method used for user registration & sign in.
   * Allows either username with aliases OR sign in with email, phone, or both.
   *
   * @default SignInType.Username
   */
  readonly signInType?: SignInType;

  /**
   * Attributes to allow as username alias.
   * Only valid if signInType is USERNAME
   *
   * @default - No alias.
   */
  readonly usernameAliasAttributes?: UserPoolAttribute[];

  /**
   * Attributes which Cognito will automatically send a verification message to.
   * Must be either EMAIL, PHONE, or both.
   *
   * @default - No auto verification.
   */
  readonly autoVerifiedAttributes?: UserPoolAttribute[];

  /**
   * Lambda functions to use for supported Cognito triggers.
   *
   * @default - No Lambda triggers.
   */
  readonly lambdaTriggers?: UserPoolTriggers;
}

export interface UserPoolAttributes {
  /**
   * The ID of an existing user pool
   */
  readonly userPoolId: string;

  /**
   * The ARN of the imported user pool
   */
  readonly userPoolArn: string;

  /**
   * The provider name of the imported user pool
   */
  readonly userPoolProviderName: string;

  /**
   * The URL of the imported user pool
   */
  readonly userPoolProviderUrl: string;
}

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
   * The provider name of this user pool resource
   * @attribute
   */
  readonly userPoolProviderName: string;

  /**
   * The provider URL of this user pool resource
   * @attribute
   */
  readonly userPoolProviderUrl: string;
}

/**
 * Define a Cognito User Pool
 */
export class UserPool extends Resource implements IUserPool {
  /**
   * Import an existing user pool resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param attrs Imported user pool properties
   */
  public static fromUserPoolAttributes(scope: Construct, id: string, attrs: UserPoolAttributes): IUserPool {
    /**
     * Define a user pool which has been declared in another stack
     */
    class Import extends Resource implements IUserPool {
      public readonly userPoolId = attrs.userPoolId;
      public readonly userPoolArn = attrs.userPoolArn;
      public readonly userPoolProviderName = attrs.userPoolProviderName;
      public readonly userPoolProviderUrl = attrs.userPoolProviderUrl;
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
   */
  public readonly userPoolProviderName: string;

  /**
   * User pool provider URL
   */
  public readonly userPoolProviderUrl: string;

  private triggers: CfnUserPool.LambdaConfigProperty = { };

  constructor(scope: Construct, id: string, props: UserPoolProps = {}) {
    super(scope, id, {
      physicalName: props.userPoolName,
    });

    let aliasAttributes: UserPoolAttribute[] | undefined;
    let usernameAttributes: UserPoolAttribute[] | undefined;

    if (props.usernameAliasAttributes != null && props.signInType !== SignInType.USERNAME) {
      throw new Error(`'usernameAliasAttributes' can only be set with a signInType of 'USERNAME'`);
    }

    if (props.usernameAliasAttributes
      && !props.usernameAliasAttributes.every(a => {
        return a === UserPoolAttribute.EMAIL || a === UserPoolAttribute.PHONE_NUMBER || a === UserPoolAttribute.PREFERRED_USERNAME;
      })) {
      throw new Error(`'usernameAliasAttributes' can only include EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME`);
    }

    if (props.autoVerifiedAttributes
      && !props.autoVerifiedAttributes.every(a => a === UserPoolAttribute.EMAIL || a === UserPoolAttribute.PHONE_NUMBER)) {
      throw new Error(`'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER`);
    }

    switch (props.signInType) {
      case SignInType.USERNAME:
        aliasAttributes = props.usernameAliasAttributes;
        break;

      case SignInType.EMAIL:
        usernameAttributes = [UserPoolAttribute.EMAIL];
        break;

      case SignInType.PHONE:
        usernameAttributes = [UserPoolAttribute.PHONE_NUMBER];
        break;

      case SignInType.EMAIL_OR_PHONE:
        usernameAttributes = [UserPoolAttribute.EMAIL, UserPoolAttribute.PHONE_NUMBER];
        break;

      default:
        aliasAttributes = props.usernameAliasAttributes;
        break;
    }

    if (props.lambdaTriggers) {
      for (const t of Object.keys(props.lambdaTriggers)) {
        const trigger = props.lambdaTriggers[t];
        if (trigger !== undefined) {
          this.addLambdaPermission(trigger as lambda.IFunction, t);
          (this.triggers as any)[t] = (trigger as lambda.IFunction).functionArn;
        }
      }
    }

    const userPool = new CfnUserPool(this, 'Resource', {
      userPoolName: this.physicalName,
      usernameAttributes,
      aliasAttributes,
      autoVerifiedAttributes: props.autoVerifiedAttributes,
      lambdaConfig: Lazy.anyValue({ produce: () => this.triggers })
    });

    this.userPoolId = this.getResourceNameAttribute(userPool.ref);
    this.userPoolArn = this.getResourceArnAttribute(userPool.attrArn, {
      service: 'cognito',
      resource: 'userpool',
      resourceName: this.physicalName,
    });

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
   * Attach 'Verify Auth Challenge Response' trigger
   * Grants access from cognito-idp.amazonaws.com to the lambda
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-verify-auth-challenge-response.html
   * @param fn the lambda function to attach
   */
  public addVerifyAuthChallengeResponseTrigger(fn: lambda.IFunction): void {
    this.addLambdaPermission(fn, 'VerifyAuthChallengeResponse');
    this.triggers = { ...this.triggers, verifyAuthChallengeResponse: fn.functionArn };
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

  private addLambdaPermission(fn: lambda.IFunction, name: string): void {
    const normalize = name.charAt(0).toUpperCase() + name.slice(1);
    fn.addPermission(`${normalize}Cognito`, {
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: this.userPoolArn
    });
  }
}
