import { Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { toASCII as punycodeEncode } from 'punycode/';

/**
  * The valid Amazon SES configuration regions
  */
const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1'];

/**
 * Configuration for Cognito sending emails via Amazon SES
 */
export interface SESOptions {
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
   *  @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-emailconfiguration.html#cfn-cognito-userpool-emailconfiguration-configurationset
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
   * Must be 'us-east-1', 'us-west-2', or 'eu-west-1'
   *
   * @default - The same region as the Cognito UserPool
   */
  readonly sesRegion?: string;
}

/**
 * Configuration settings for Cognito default email
 */
export interface CognitoEmailOptions {
  /**
   * The verified email address in Amazon SES that
   * Cognito will use to send emails. You must have already
   * configured Amazon SES to allow Cognito to send Emails
   * through this address.
   *
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-email.html
   *
   * @default - Cognito default email address will be used
   * 'no-reply@verificationemail.com'
   */
  readonly fromEmail?: string;

  /**
   * The destination to which the receiver of the email should reploy to.
   *
   * @default - same as the fromEmail
   */
  readonly replyTo?: string;

  /**
   * Required if the UserPool region is different than the SES region.
   *
   * If sending emails with a Amazon SES verified email address,
   * and the region that SES is configured is different than the
   * region in which the UserPool is deployed, you must specify that
   * region here.
   *
   * Must be 'us-east-1', 'us-west-2', or 'eu-west-1'
   *
   * @default - The same region as the Cognito UserPool
   */
  readonly sesRegion?: string;
}

/**
 * Configuration for Cognito email settings
 */
export interface EmailConfiguration {
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
   * @default - COGNITO_DEFAULT
   */
  readonly emailSendingAccount?: string;

  /**
   * Identifies either the sender's email address or the sender's
   * name with their email address.
   *
   * If emailSendingAccount is DEVELOPER then this cannot be specified.
   *
   * @default - no-reply@verificationemail.com
   */
  readonly from?: string;

  /**
   * The destination to which the receiver of the email should reply to.
   *
   * @default - none
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
export abstract class Email {
  /**
   * Send email using Cognito
   */
  public static withCognito(options?: CognitoEmailOptions): Email {
    return new CognitoEmail(options);
  }

  /**
   * Send email using SES
   */
  public static withSES(options: SESOptions): Email {
    return new SESEmail(options);
  }


  /**
   * Returns the email configuration for a Cognito UserPool
   * that controls how Cognito will send emails
   */
  public abstract bind(scope: Construct): EmailConfiguration;

}

class CognitoEmail extends Email {
  constructor(private readonly options?: CognitoEmailOptions) {
    super();
  }

  public bind(scope: Construct): EmailConfiguration {
    const region = Stack.of(scope).region;

    // if a custom email is provided that means that cognito is going to use an SES email
    // and we need to provide the sourceArn which requires a valid region
    let sourceArn: string | undefined = undefined;
    if (this.options?.fromEmail) {
      if (this.options.fromEmail !== 'no-reply@verificationemail.com') {
        if (Token.isUnresolved(region) && !this.options.sesRegion) {
          throw new Error('Your stack region cannot be determined so "sesRegion" is required in CognitoEmailOptions');
        }
        if (this.options?.sesRegion && !REGIONS.includes(this.options.sesRegion)) {
          throw new Error(`sesRegion must be one of 'us-east-1', 'us-west-2', 'eu-west-1'. received ${this.options.sesRegion}`);
        } else if (!this.options?.sesRegion && !REGIONS.includes(region)) {
          throw new Error(`Your stack is in ${region}, which is not a SES Region. Please provide a valid value for 'sesRegion'`);
        }
        sourceArn = Stack.of(scope).formatArn({
          service: 'ses',
          resource: 'identity',
          resourceName: encodeAndTest(this.options.fromEmail),
          region: this.options.sesRegion ?? region,
        });
      }
    }


    return {
      replyToEmailAddress: encodeAndTest(this.options?.replyTo),
      emailSendingAccount: 'COGNITO_DEFAULT',
      sourceArn,
    };

  }
}

class SESEmail extends Email {
  constructor(private readonly options: SESOptions) {
    super();
  }

  public bind(scope: Construct): EmailConfiguration {
    const region = Stack.of(scope).region;

    if (Token.isUnresolved(region) && !this.options.sesRegion) {
      throw new Error('Your stack region cannot be determined so "sesRegion" is required in SESOptions');
    }

    if (this.options.sesRegion && !REGIONS.includes(this.options.sesRegion)) {
      throw new Error(`sesRegion must be one of 'us-east-1', 'us-west-2', 'eu-west-1'. received ${this.options.sesRegion}`);
    } else if (!this.options.sesRegion && !REGIONS.includes(region)) {
      throw new Error(`Your stack is in ${region}, which is not a SES Region. Please provide a valid value for 'sesRegion'`);
    }

    let from = this.options.fromEmail;
    if (this.options.fromName) {
      from = `${this.options.fromName} <${this.options.fromEmail}>`;
    }

    return {
      from: encodeAndTest(from),
      replyToEmailAddress: encodeAndTest(this.options.replyTo),
      configurationSet: this.options.configurationSetName,
      emailSendingAccount: 'DEVELOPER',
      sourceArn: Stack.of(scope).formatArn({
        service: 'ses',
        resource: 'identity',
        resourceName: encodeAndTest(this.options.fromEmail),
        region: this.options.sesRegion ?? region,
      }),
    };
  }
}

function encodeAndTest(input: string | undefined): string | undefined {
  if (input) {
    const local = input.split('@')[0];
    if (!/[\p{ASCII}]+/u.test(local)) {
      throw new Error('the local part of the email address must use ASCII characters only');
    }
    return punycodeEncode(input);
  } else {
    return undefined;
  }
}
