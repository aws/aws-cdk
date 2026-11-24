import type { Construct } from 'constructs';
import type { DomainReference, IDomainRef } from './cloudwatch.generated';
import { CfnDomain } from './cloudwatch.generated';
import type { IdentityCenterInstance, IdentityProvider } from './identity-provider';
import * as cdk from '../../core';
import { lit } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * A CloudWatch Omni domain.
 */
export interface IDomain extends cdk.IResource, IDomainRef {
  /**
   * The ID of the domain, for example `d-abc456`.
   *
   * @attribute
   */
  readonly domainId: string;

  /**
   * The ARN of the domain.
   *
   * Throws for a domain referenced by ID alone, whose ARN is not known.
   *
   * @attribute
   */
  readonly domainArn: string;

  /**
   * The URL of the domain, based on its ID, for example `https://d-abc456.cloudwatch-omni.global.app.aws`.
   *
   * Undefined for a referenced domain.
   *
   * @attribute
   */
  readonly domainEndpointUrl?: string;
}

/**
 * Properties for a CloudWatch Omni domain.
 */
export interface DomainProps {
  /**
   * The name of the domain, 3 to 63 lowercase letters, digits and single hyphens.
   *
   * Users can also reach the domain at `https://<domain-name>.cloudwatch-omni.global.app.aws`.
   * Updatable in place.
   */
  readonly domainName: string;

  /**
   * How users sign in to the domain. One or two providers.
   */
  readonly identityProviders: IdentityProvider[];

  /**
   * The IAM Identity Center instance users sign in through.
   *
   * Required when `identityProviders` includes `IdentityProvider.IDC`.
   *
   * @default - no Identity Center instance
   */
  readonly identityCenterInstance?: IdentityCenterInstance;

  /**
   * What happens to the domain when it is removed from the stack or replaced.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: cdk.RemovalPolicy;

  /**
   * Tags for the domain. Updatable in place.
   *
   * @default - no tags
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A CloudWatch Omni domain.
 *
 * A domain is the root of CloudWatch Omni in an account and configures how users sign in.
 * An account has at most one domain across all Regions.
 *
 * @resource AWS::CloudWatch::Domain
 */
@propertyInjectable
export class Domain extends cdk.Resource implements IDomain {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.Domain';

  /**
   * Reference an existing domain by its ID.
   *
   * The ARN of a domain referenced this way is not known, so `domainArn` throws.
   * Use `fromDomainArn` when the ARN is needed.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param domainId The ID of the domain, for example `d-abc456`
   */
  public static fromDomainId(scope: Construct, id: string, domainId: string): IDomain {
    class Import extends cdk.Resource implements IDomain {
      public readonly domainId = domainId;

      public get domainArn(): string {
        throw new cdk.ValidationError(
          lit`DomainArnUnknown`,
          `the ARN of domain ${JSON.stringify(domainId)} is not known; reference it with Domain.fromDomainArn() instead`,
          this,
        );
      }

      public get domainRef(): DomainReference {
        return { domainArn: this.domainArn };
      }
    }
    return new Import(scope, id);
  }

  /**
   * Reference an existing domain by its ARN.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param domainArn The ARN of the domain
   */
  public static fromDomainArn(scope: Construct, id: string, domainArn: string): IDomain {
    const domainId = parseDomainId(scope, domainArn);
    class Import extends cdk.Resource implements IDomain {
      public readonly domainArn = domainArn;
      public readonly domainId = domainId;
      public readonly domainRef = { domainArn };
    }
    return new Import(scope, id, { environmentFromArn: domainArn });
  }

  /**
   * The ID of the domain.
   *
   * @attribute
   */
  public readonly domainId: string;

  /**
   * The ARN of the domain.
   *
   * @attribute
   */
  public readonly domainArn: string;

  /**
   * The URL of the domain, based on its ID, for example `https://d-abc456.cloudwatch-omni.global.app.aws`.
   *
   * Always set on a domain defined in the app.
   *
   * @attribute
   */
  public readonly domainEndpointUrl?: string;

  private readonly resource: CfnDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, { physicalName: props.domainName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnDomain(this, 'Resource', {
      name: props.domainName,
      identityProviders: props.identityProviders.map((provider) => provider.value),
      identityProviderConfiguration: props.identityCenterInstance
        ? { identityCenterConfiguration: { identityCenterInstanceArn: props.identityCenterInstance.instanceArn } }
        : undefined,
      tags: props.tags ? Object.entries(props.tags).map(([key, value]) => ({ key, value })) : undefined,
    });
    this.resource.applyRemovalPolicy(props.removalPolicy ?? cdk.RemovalPolicy.RETAIN);

    this.domainId = this.resource.attrDomainId;
    this.domainArn = this.resource.attrArn;
    this.domainEndpointUrl = this.resource.attrDomainEndpointUrl;
  }

  public get domainRef(): DomainReference {
    return { domainArn: this.domainArn };
  }
}

function parseDomainId(scope: Construct, domainArn: string): string {
  const arn = cdk.Arn.split(domainArn, cdk.ArnFormat.SLASH_RESOURCE_NAME);
  if (cdk.Token.isUnresolved(domainArn)) {
    return arn.resourceName!;
  }
  if (arn.service !== 'cloudwatch' || arn.resource !== 'domain' || !arn.resourceName) {
    throw new cdk.ValidationError(
      lit`InvalidDomainArn`,
      `expected a domain ARN in the format "arn:<partition>:cloudwatch:<region>:<account>:domain/<domain-id>", got ${JSON.stringify(domainArn)}`,
      scope,
    );
  }
  return arn.resourceName;
}
