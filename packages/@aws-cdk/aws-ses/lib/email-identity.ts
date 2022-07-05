import { IResource, Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IConfigurationSet } from './configuration-set';
import { undefinedIfNoKeys } from './private/utils';
import { CfnEmailIdentity } from './ses.generated';

/**
 * An email identity
 */
export interface IEmailIdentity extends IResource {
  /**
   * The name of the email identity
   *
   * @attribute
   */
  readonly emailIdentityName: string;
}

/**
 * Properties for an email identity
 */
export interface EmailIdentityProps {
  /**
   * The email address or domain to verify.
   */
  readonly identity: string;

  /**
   * The configuration set to associate with an email identity
   *
   * @default - do not use a specific configuration set
   */
  readonly configurationSet?: IConfigurationSet;

  /**
   * Whether the messages that are sent from the identity are signed using DKIM
   *
   * @default true
   */
  readonly dkimSigning?: boolean;

  /**
   * The type of DKIM identity to use
   *
   * @default - use Easy DKIM with a key length of 1024-bit
   */
  readonly dkimIdentity?: DkimIdentity;

  /**
   * Whether to receive email notifications when bounce or complaint events occur.
   * These notifications are sent to the address that you specified in the `Return-Path`
   * header of the original email.
   *
   * You're required to have a method of tracking bounces and complaints. If you haven't set
   * up another mechanism for receiving bounce or complaint notifications (for example, by
   * setting up an event destination), you receive an email notification when these events
   * occur (even if this setting is disabled).
   *
   * @default true
   */
  readonly feedbackForwarding?: boolean;

  /**
   * The custom MAIL FROM domain that you want the verified identity to use. The MAIL FROM domain
   * must meet the following criteria:
   *   - It has to be a subdomain of the verified identity
   *   - It can't be used to receive email
   *   - It can't be used in a "From" address if the MAIL FROM domain is a destination for feedback
   *     forwarding emails
   *
   * @default - use amazonses.com
   */
  readonly mailFromDomain?: string;

  /**
   * The action to take if the required MX record for the MAIL FROM domain isn't
   * found when you send an email
   *
   * @default MailFromBehaviorOnMxFailure.USE_DEFAULT_VALUE
   */
  readonly mailFromBehaviorOnMxFailure?: MailFromBehaviorOnMxFailure;
}

/**
 * The action to take if the required MX record for the MAIL FROM domain isn't
 * found
 */
export enum MailFromBehaviorOnMxFailure {
  /**
   * The mail is sent using amazonses.com as the MAIL FROM domain
   */
  USE_DEFAULT_VALUE = 'USE_DEFAULT_VALUE',

  /**
   * The Amazon SES API v2 returns a `MailFromDomainNotVerified` error and doesn't
   * attempt to deliver the email
   */
  REJECT_MESSAGE = 'REJECT_MESSAGE',
}

/**
 * The identity to use for DKIM
 */
export abstract class DkimIdentity {
  /**
   * Easy DKIM
   *
   * @param signingKeyLength The length of the signing key. This can be changed at
   *   most once per day.
   */
  public static easyDkim(signingKeyLength?: EasyDkimSigningKeyLength): DkimIdentity {
    return {
      nextSigningKeyLength: signingKeyLength,
    };
  }

  /**
   * Bring Your Own DKIM
   *
   * @param privateKey A private key that's used to generate a DKIM signature. The
   *   private key must use 1024 or 2048-bit RSA encryption, and must be encoded using
   *   base64 encoding
   * @param selector A string that's used to identify a public key in the DNS configuration
   *   for a domain
   */
  public static byodDkim(privateKey: SecretValue, selector: string): DkimIdentity {
    return {
      domainSigningPrivateKey: privateKey.unsafeUnwrap(),
      domainSigningSelector: selector,
    };
  }

  /**
   * A private key that's used to generate a DKIM signature
   */
  public abstract readonly domainSigningPrivateKey?: string;

  /**
   * A string that's used to identify a public key in the DNS configuration for
   * a domain
   */
  public abstract readonly domainSigningSelector?: string;

  /**
   * The key length of the future DKIM key pair to be generated. This can be changed
   * at most once per day.
   */
  public abstract readonly nextSigningKeyLength?: EasyDkimSigningKeyLength
}

/**
 * The signing key length for Easy DKIM
 */
export enum EasyDkimSigningKeyLength {
  /**
   * RSA 1024-bit
   */
  RSA_1024_BIT = 'RSA_1024_BIT',

  /**
   * RSA 2048-bit
   */
  RSA_2048_BIT = 'RSA_2048_BIT'
}

/**
 * An email identity
 */
export class EmailIdentity extends Resource implements IEmailIdentity {
  /**
   * Use an existing email identity
   */
  public static fromEmailIdentityName(scope: Construct, id: string, emailIdentityName: string): IEmailIdentity {
    class Import extends Resource implements IEmailIdentity {
      public readonly emailIdentityName = emailIdentityName;
    }
    return new Import(scope, id);
  }

  public readonly emailIdentityName: string;

  /**
   * The host name for the first token that you have to add to the
   * DNS configurationfor your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenName1: string;

  /**
   * The host name for the second token that you have to add to the
   * DNS configuration for your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenName2: string;

  /**
   * The host name for the third token that you have to add to the
   * DNS configuration for your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenName3: string;

  /**
   * The record value for the first token that you have to add to the
   * DNS configuration for your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenValue1: string;

  /**
   * The record value for the second token that you have to add to the
   * DNS configuration for your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenValue2: string;

  /**
   * The record value for the third token that you have to add to the
   * DNS configuration for your domain
   *
   * @attribute
   */
  public readonly dkimDnsTokenValue3: string;

  constructor(scope: Construct, id: string, props: EmailIdentityProps) {
    super(scope, id);

    const identity = new CfnEmailIdentity(this, 'Resource', {
      emailIdentity: props.identity,
      configurationSetAttributes: undefinedIfNoKeys({
        configurationSetName: props.configurationSet?.configurationSetName,
      }),
      dkimAttributes: undefinedIfNoKeys({
        signingEnabled: props.dkimSigning,
      }),
      dkimSigningAttributes: undefinedIfNoKeys({
        domainSigningPrivateKey: props.dkimIdentity?.domainSigningPrivateKey,
        domainSigningSelector: props.dkimIdentity?.domainSigningSelector,
        nextSigningKeyLength: props.dkimIdentity?.nextSigningKeyLength,
      }),
      feedbackAttributes: undefinedIfNoKeys({
        emailForwardingEnabled: props.feedbackForwarding,
      }),
      mailFromAttributes: undefinedIfNoKeys({
        mailFromDomain: props.mailFromDomain,
        behaviorOnMxFailure: props.mailFromBehaviorOnMxFailure,
      }),
    });

    this.emailIdentityName = identity.ref;
    this.dkimDnsTokenName1 = identity.attrDkimDnsTokenName1;
    this.dkimDnsTokenName2 = identity.attrDkimDnsTokenName2;
    this.dkimDnsTokenName3 = identity.attrDkimDnsTokenName3;
    this.dkimDnsTokenValue1 = identity.attrDkimDnsTokenValue1;
    this.dkimDnsTokenValue2 = identity.attrDkimDnsTokenValue2;
    this.dkimDnsTokenValue3 = identity.attrDkimDnsTokenValue3;
  }
}
