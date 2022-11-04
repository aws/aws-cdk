import * as route53 from '@aws-cdk/aws-route53';
import { IPublicHostedZone } from '@aws-cdk/aws-route53';
import { IResource, Lazy, Resource, SecretValue, Stack } from '@aws-cdk/core';
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
  readonly identity: Identity;

  /**
   * The configuration set to associate with the email identity
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
   * @default - Easy DKIM with a key length of 2048-bit
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
 * Identity
 */
export abstract class Identity {
  /**
   * Verify an email address
   *
   * To complete the verification process look for an email from
   * no-reply-aws@amazon.com, open it and click the link.
   */
  public static email(email: string): Identity {
    return { value: email };
  }

  /**
   * Verify a domain name
   *
   * DKIM records will have to be added manually to complete the verification
   * process
   */
  public static domain(domain: string): Identity {
    return { value: domain };
  }

  /**
   * Verify a public hosted zone
   *
   * DKIM and MAIL FROM records will be added automatically to the hosted
   * zone
   */
  public static publicHostedZone(hostedZone: IPublicHostedZone): Identity {
    return {
      value: hostedZone.zoneName,
      hostedZone,
    };
  }

  /**
   * The value of the identity
   */
  public abstract readonly value: string;

  /**
   * The hosted zone associated with this identity
   *
   * @default - no hosted zone is associated and no records are created
   */
  public abstract readonly hostedZone?: IPublicHostedZone;
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
 * Configuration for DKIM identity
 */
export interface DkimIdentityConfig {
  /**
   * A private key that's used to generate a DKIM signature
   *
   * @default - use Easy DKIM
   */
  readonly domainSigningPrivateKey?: string;

  /**
    * A string that's used to identify a public key in the DNS configuration for
    * a domain
    *
    * @default - use Easy DKIM
    */
  readonly domainSigningSelector?: string;

  /**
    * The key length of the future DKIM key pair to be generated. This can be changed
    * at most once per day.
    *
    * @default EasyDkimSigningKeyLength.RSA_2048_BIT
    */
  readonly nextSigningKeyLength?: EasyDkimSigningKeyLength
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
   *
   * @see https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-easy.html
   */
  public static easyDkim(signingKeyLength?: EasyDkimSigningKeyLength): DkimIdentity {
    return new EasyDkim(signingKeyLength);
  }

  /**
   * Bring Your Own DKIM
   *
   * @param options Options for BYO DKIM
   *
   * @see https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-bring-your-own.html
   */
  public static byoDkim(options: ByoDkimOptions): DkimIdentity {
    return new ByoDkim(options);
  }

  /**
   * Binds this DKIM identity to the email identity
   */
  public abstract bind(emailIdentity: EmailIdentity, hostedZone?: route53.IPublicHostedZone): DkimIdentityConfig | undefined;
}

class EasyDkim extends DkimIdentity {
  constructor(private readonly signingKeyLength?: EasyDkimSigningKeyLength) {
    super();
  }

  public bind(emailIdentity: EmailIdentity, hostedZone?: route53.IPublicHostedZone): DkimIdentityConfig | undefined {
    if (hostedZone) {
      // Use CfnRecordSet instead of CnameRecord to avoid current bad handling of
      // tokens in route53.determineFullyQualifiedDomainName() at https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/aws-route53/lib/util.ts
      new route53.CfnRecordSet(emailIdentity, 'DkimDnsToken1', {
        hostedZoneId: hostedZone.hostedZoneId,
        name: Lazy.string({ produce: () => emailIdentity.dkimDnsTokenName1 }),
        type: 'CNAME',
        resourceRecords: [Lazy.string({ produce: () => emailIdentity.dkimDnsTokenValue1 })],
        ttl: '1800',
      });

      new route53.CfnRecordSet(emailIdentity, 'DkimDnsToken2', {
        hostedZoneId: hostedZone.hostedZoneId,
        name: Lazy.string({ produce: () => emailIdentity.dkimDnsTokenName2 }),
        type: 'CNAME',
        resourceRecords: [Lazy.string({ produce: () => emailIdentity.dkimDnsTokenValue2 })],
        ttl: '1800',
      });

      new route53.CfnRecordSet(emailIdentity, 'DkimDnsToken3', {
        hostedZoneId: hostedZone.hostedZoneId,
        name: Lazy.string({ produce: () => emailIdentity.dkimDnsTokenName3 }),
        type: 'CNAME',
        resourceRecords: [Lazy.string({ produce: () => emailIdentity.dkimDnsTokenValue3 })],
        ttl: '1800',
      });
    }

    return this.signingKeyLength
      ? { nextSigningKeyLength: this.signingKeyLength }
      : undefined;
  }
}

/**
 * Options for BYO DKIM
 */
export interface ByoDkimOptions {
  /**
   * The private key that's used to generate a DKIM signature
   */
  readonly privateKey: SecretValue;

  /**
   * A string that's used to identify a public key in the DNS configuration for
   * a domain
   */
  readonly selector: string;

  /**
   * The public key. If specified, a TXT record with the public key is created.
   *
   * @default - the validation TXT record with the public key is not created
   */
  readonly publicKey?: string;
}

class ByoDkim extends DkimIdentity {
  constructor(private readonly options: ByoDkimOptions) {
    super();
  }

  public bind(emailIdentity: EmailIdentity, hostedZone?: route53.IPublicHostedZone): DkimIdentityConfig | undefined {
    if (hostedZone && this.options.publicKey) {
      new route53.TxtRecord(emailIdentity, 'DkimTxt', {
        zone: hostedZone,
        recordName: `${this.options.selector}._domainkey`,
        values: [`p=${this.options.publicKey}`],
      });
    }

    return {
      domainSigningPrivateKey: this.options.privateKey.unsafeUnwrap(), // safe usage
      domainSigningSelector: this.options.selector,
    };
  }
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

  /**
   * DKIM records for this identity
   */
  public readonly dkimRecords: DkimRecord[];

  constructor(scope: Construct, id: string, props: EmailIdentityProps) {
    super(scope, id);

    const dkimIdentity = props.dkimIdentity ?? DkimIdentity.easyDkim();

    const identity = new CfnEmailIdentity(this, 'Resource', {
      emailIdentity: props.identity.value,
      configurationSetAttributes: undefinedIfNoKeys({
        configurationSetName: props.configurationSet?.configurationSetName,
      }),
      dkimAttributes: undefinedIfNoKeys({
        signingEnabled: props.dkimSigning,
      }),
      dkimSigningAttributes: dkimIdentity.bind(this, props.identity.hostedZone),
      feedbackAttributes: undefinedIfNoKeys({
        emailForwardingEnabled: props.feedbackForwarding,
      }),
      mailFromAttributes: undefinedIfNoKeys({
        mailFromDomain: props.mailFromDomain,
        behaviorOnMxFailure: props.mailFromBehaviorOnMxFailure,
      }),
    });

    if (props.mailFromDomain && props.identity.hostedZone) {
      new route53.MxRecord(this, 'MailFromMxRecord', {
        zone: props.identity.hostedZone,
        recordName: props.mailFromDomain,
        values: [{
          priority: 10,
          hostName: `feedback-smtp.${Stack.of(this).region}.amazonses.com`,
        }],
      });

      new route53.TxtRecord(this, 'MailFromTxtRecord', {
        zone: props.identity.hostedZone,
        recordName: props.mailFromDomain,
        values: ['v=spf1 include:amazonses.com ~all'],
      });
    }

    this.emailIdentityName = identity.ref;

    this.dkimDnsTokenName1 = identity.attrDkimDnsTokenName1;
    this.dkimDnsTokenName2 = identity.attrDkimDnsTokenName2;
    this.dkimDnsTokenName3 = identity.attrDkimDnsTokenName3;
    this.dkimDnsTokenValue1 = identity.attrDkimDnsTokenValue1;
    this.dkimDnsTokenValue2 = identity.attrDkimDnsTokenValue2;
    this.dkimDnsTokenValue3 = identity.attrDkimDnsTokenValue3;

    this.dkimRecords = [
      { name: this.dkimDnsTokenName1, value: this.dkimDnsTokenValue1 },
      { name: this.dkimDnsTokenName2, value: this.dkimDnsTokenValue2 },
      { name: this.dkimDnsTokenName3, value: this.dkimDnsTokenValue3 },
    ];
  }
}

/**
 * A DKIM record
 */
export interface DkimRecord {
  /**
   * The name of the record
   */
  readonly name: string;

  /**
   * The value of the record
   */
  readonly value: string;
}
