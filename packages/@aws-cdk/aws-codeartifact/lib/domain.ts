import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ca from './codeartifact.generated';

/**
 * Represents a CodeArtifact domain
 */
export interface IDomain extends IResource {
/**
 * The ARN of domain resource.
 * Equivalent to doing `{ 'Fn::GetAtt': ['LogicalId', 'Arn' ]}`
 * in CloudFormation if the underlying CloudFormation resource
 * surfaces the ARN as a return value -
 * if not, we usually construct the ARN "by hand" in the construct,
 * using the Fn::Join function.
 *
 * It needs to be annotated with '@attribute' if the underlying CloudFormation resource
 * surfaces the ARN as a return value.
 *
 * @attribute
 */
  readonly domainArn: string;

  /**
   * The physical name of the domain resource.
   * Often, equivalent to doing `{ 'Ref': 'LogicalId' }`
   * (but not always - depends on the particular resource modeled)
   * in CloudFormation.
   * Also needs to be annotated with '@attribute'.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The domain owner
   * Often, equivalent to the account id.
   * @attribute
   */
  readonly domainOwner: string;

  /**
   * The KMS encryption key used for the domain resource.
   * @attribute
   */
  readonly domainEncryptionKey: string;
}

/**
 * Properties for a new CodeArtifact domain
 */
export interface DomainProps {
  /**
  * The name of the domain
  */
  readonly domainName: string;
}

/**
 * Either a new or imported Domain
 */
export abstract class DomainBase extends Resource implements IDomain {

  /** @attribute */
  abstract readonly domainArn: string = '';
  /** @attribute */
  abstract readonly domainName: string = '';
  /** @attribute */
  abstract readonly domainOwner: string = '';
  /** @attribute */
  abstract readonly domainEncryptionKey: string = '';

  constructor(scope: Construct, id: string) {
    super(scope, id, {});
  }
}

/**
 * A new CodeArtifacft domain
 */
export class Domain extends DomainBase {
  /**
 * Import an existing domain provided an ARN
 *
 * @param scope The parent creating construct
 * @param id The construct's name
 * @param domainArn Domain ARN (i.e. arn:aws:codeartifact:us-east-2:444455556666:domain/MyDomain)
 */
  public static fromDomainArn(scope: Construct, id: string, domainArn: string): IDomain {
    const parsed = Stack.of(scope).parseArn(domainArn);
    const domainName = parsed.resourceName || '';

    class Import extends Domain {
      public readonly domainName: string = parsed.resourceName || '';
      public readonly domainOwner: string = parsed.account || '';
      public readonly domainEncryptionKey: string = '';
      public readonly domainArn = domainArn;
    }

    return new Import(scope, id, { domainName: domainName });
  }

  public readonly domainArn: string = '';
  public readonly domainName: string = '';
  public readonly domainOwner: string = '';
  public readonly domainEncryptionKey: string = '' ;
  private readonly cfnDomain: ca.CfnDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    this.cfnDomain = new ca.CfnDomain(this, id, {
      domainName: props.domainName,
    });

    this.domainArn = this.cfnDomain.attrArn;
    this.domainName = props.domainName;
    this.domainOwner = this.cfnDomain.attrOwner;
    this.domainEncryptionKey = this.cfnDomain.attrEncryptionKey;

    // domain = policy.addDomainPolicy(domain, new iam.AccountRootPrincipal(), [...sample.domainActions])
  }
}