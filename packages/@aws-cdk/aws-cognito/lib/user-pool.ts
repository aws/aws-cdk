import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { CfnUserPool } from './cognito.generated';

/**
 * Standard attributes
 */
export enum Attribute {
  ADDRESS = 'address',
  BIRTHDATE = 'birthdate',
  EMAIL = 'email',
  FAMILY_NAME = 'family_name',
  GENDER = 'gender',
  GIVEN_NAME = 'given_name',
  LOCALE = 'locale',
  MIDDLE_NAME = 'middle_name',
  NAME = 'name',
  NICKNAME = 'nickname',
  PHONE_NUMBER = 'phone_number',
  PICTURE = 'picture',
  PREFERRED_USERNAME = 'preferred_username',
  PROFILE = 'profile',
  TIMEZONE = 'timezone',
  UPDATED_AT = 'updated_at',
  WEBSITE = 'website'
}

export enum SignInType {
  USERNAME,
  EMAIL,
  PHONE,
  EMAIL_OR_PHONE
}

export interface UserPoolTriggers {
  /**
   * Creates an authentication challenge.
   */
  createAuthChallenge?: lambda.IFunction;

  /**
   * A custom Message AWS Lambda trigger.
   */
  customMessage?: lambda.IFunction;

  /**
   * Defines the authentication challenge.
   */
  defineAuthChallenge?: lambda.IFunction;

  /**
   * A post-authentication AWS Lambda trigger.
   */
  postAuthentication?: lambda.IFunction;

  /**
   * A post-confirmation AWS Lambda trigger.
   */
  postConfirmation?: lambda.IFunction;

  /**
   * A pre-authentication AWS Lambda trigger.
   */
  preAuthentication?: lambda.IFunction;

  /**
   * A pre-registration AWS Lambda trigger.
   */
  preSignUp?: lambda.IFunction;

  /**
   * Verifies the authentication challenge response.
   */
  verifyAuthChallengeResponse?: lambda.IFunction;
}

export interface UserPoolProps {
  /**
   * Name of the user pool
   * @default unique ID
   */
  poolName?: string;

  /**
   * Method used for user registration & sign in.
   * Allows either username with aliases OR sign in with email, phone, or both.
   * @default SignInType.USERNAME
   */
  signInType?: SignInType;

  /**
   * Attributes to allow as username alias.
   * Only valid if signInType is USERNAME
   * @default no alias
   */
  usernameAliasAttributes?: Attribute[];

  /**
   * Attributes which Cognito will automatically send a verification message to.
   * Must be either EMAIL, PHONE, or both.
   * @default no auto verification
   */
  autoVerifiedAttributes?: Attribute[];

  /**
   * Lambda functions to use for supported Cognito triggers.
   */
  lambdaTriggers?: UserPoolTriggers;
}

/**
 * Define a Cognito User Pool
 */
export class UserPool extends cdk.Construct {
  /**
   * The physical ID of the created user pool resource
   */
  public readonly poolId: string;

  constructor(scope: cdk.Construct, id: string, props: UserPoolProps) {
    super(scope, id);

    const triggers = props.lambdaTriggers || { };

    let aliasAttributes: Attribute[] | undefined;
    let usernameAttributes: Attribute[] | undefined;

    if (props.usernameAliasAttributes != null && props.signInType !== SignInType.USERNAME) {
      throw new Error(`'usernameAliasAttributes' can only be set with a signInType of 'USERNAME'`);
    }

    if (props.usernameAliasAttributes
      && !props.usernameAliasAttributes.every(a => {
        return a === Attribute.EMAIL || a === Attribute.PHONE_NUMBER || a === Attribute.PREFERRED_USERNAME;
      })) {
      throw new Error(`'usernameAliasAttributes' can only include EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME`);
    }

    if (props.autoVerifiedAttributes
      && !props.autoVerifiedAttributes.every(a => a === Attribute.EMAIL || a === Attribute.PHONE_NUMBER)) {
      throw new Error(`'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER`);
    }

    switch (props.signInType) {
      case SignInType.USERNAME:
        aliasAttributes = props.usernameAliasAttributes;
        break;

      case SignInType.EMAIL:
        usernameAttributes = [Attribute.EMAIL];
        break;

      case SignInType.PHONE:
        usernameAttributes = [Attribute.PHONE_NUMBER];
        break;

      case SignInType.EMAIL_OR_PHONE:
        usernameAttributes = [Attribute.EMAIL, Attribute.PHONE_NUMBER];
        break;

      default:
        aliasAttributes = props.usernameAliasAttributes;
        break;
    }

    const userPool = new CfnUserPool(this, 'UserPool', {
      userPoolName: props.poolName || this.node.uniqueId,
      usernameAttributes,
      aliasAttributes,
      autoVerifiedAttributes: props.autoVerifiedAttributes,
      lambdaConfig: {
        createAuthChallenge: triggers.createAuthChallenge && triggers.createAuthChallenge.functionArn,
        customMessage: triggers.customMessage && triggers.customMessage.functionArn,
        defineAuthChallenge: triggers.defineAuthChallenge && triggers.defineAuthChallenge.functionArn,
        postAuthentication: triggers.postAuthentication && triggers.postAuthentication.functionArn,
        postConfirmation: triggers.postConfirmation && triggers.postConfirmation.functionArn,
        preAuthentication: triggers.preAuthentication && triggers.preAuthentication.functionArn,
        preSignUp: triggers.preSignUp && triggers.preSignUp.functionArn,
        verifyAuthChallengeResponse: triggers.verifyAuthChallengeResponse && triggers.verifyAuthChallengeResponse.functionArn
      }
    });
    this.poolId = userPool.userPoolId;
  }
}
