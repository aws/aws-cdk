import { Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { toASCII as punycodeEncode } from 'punycode/';

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
  readonly sesVerifiedDomain?: string
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
export abstract class UserPoolEmail {
  /**
   * Send email using Cognito
   */
  public static withCognito(replyTo?: string): UserPoolEmail {
    return new CognitoEmail(replyTo);
  }

  /**
   * Send email using SES
   */
  public static withSES(options: UserPoolSESOptions): UserPoolEmail {
    return new SESEmail(options);
  }


  /**
   * Returns the email configuration for a Cognito UserPool
   * that controls how Cognito will send emails
   * @internal
   */
  public abstract _bind(scope: Construct): UserPoolEmailConfig;

}

class CognitoEmail extends UserPoolEmail {
  constructor(private readonly replyTo?: string) {
    super();
  }

  public _bind(_scope: Construct): UserPoolEmailConfig {
    return {
      replyToEmailAddress: encodeAndTest(this.replyTo),
      emailSendingAccount: 'COGNITO_DEFAULT',
    };

  }
}

class SESEmail extends UserPoolEmail {
  constructor(private readonly options: UserPoolSESOptions) {
    super();
  }

  public _bind(scope: Construct): UserPoolEmailConfig {
    const region = Stack.of(scope).region;

    if (Token.isUnresolved(region) && !this.options.sesRegion) {
      throw new Error('Your stack region cannot be determined so "sesRegion" is required in SESOptions');
    }

    let from = encodeAndTest(this.options.fromEmail);
    if (this.options.fromName) {
      const fromName = formatFromName(this.options.fromName);
      from = `${fromName} <${from}>`;
    }

    if (this.options.sesVerifiedDomain) {
      const domainFromEmail = this.options.fromEmail.split('@').pop();
      if (domainFromEmail !== this.options.sesVerifiedDomain) {
        throw new Error('"fromEmail" contains a different domain than the "sesVerifiedDomain"');
      }
    }

    return {
      from,
      replyToEmailAddress: encodeAndTest(this.options.replyTo),
      configurationSet: this.options.configurationSetName,
      emailSendingAccount: 'DEVELOPER',
      sourceArn: Stack.of(scope).formatArn({
        service: 'ses',
        resource: 'identity',
        resourceName: encodeAndTest(this.options.sesVerifiedDomain ?? this.options.fromEmail),
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

/**
 * Formats `fromName` to comply RFC 5322
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.4
 */
function formatFromName(fromName: string): string {
  // mime encode for non US-ASCII characters
  // see RFC 2047 for details https://www.rfc-editor.org/rfc/rfc2047
  if (!isAscii(fromName)) {
    const base64Name = Buffer.from(fromName, 'utf-8').toString('base64');
    return `=?UTF-8?B?${base64Name}?=`;
  }

  // makes a quoted-string unless fromName is a phrase (only atext and space)
  // or a quoted-string already
  if (!(isSimplePhrase(fromName) || isQuotedString(fromName))) {
    // in quoted-string, `\` and `"` should be escaped by `\`
    // e.g. `"foo \"bar\" \\baz"`
    const quotedName = fromName.replace(/[\\"]/g, (ch) => `\\${ch}`);
    return `"${quotedName}"`;
  }

  // otherwise, returns as is
  return fromName;
}

/**
 * Returns whether the input is a printable US-ASCII string
 */
function isAscii(input: string): boolean {
  // U+0020 (space) - U+007E (`~`)
  return /^[\u0020-\u007E]+$/u.test(input);
}

/**
 * Returns whether the input is a phrase excluding quoted-string
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.2
 */
function isSimplePhrase(input: string): boolean {
  return /^[\w !#$%&'*+-\/=?^_`{|}~]+$/.test(input);
}

/**
 * Returns whether the input is already a quoted-string
 *
 * @see https://www.rfc-editor.org/rfc/rfc5322#section-3.2.4
 */
function isQuotedString(input: string): boolean {
  // in quoted-string, `\` and `"` should be esacaped by `\`
  //
  // match: `"foo.bar"` / `"foo \"bar\""` / `"foo \\ bar"`
  // not match: `"bare " dquote"` / `"unclosed escape \"` / `"unclosed dquote`
  return /^"(?:[^\\"]|\\.)*"$/.test(input);
}
