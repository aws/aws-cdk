import * as core from '@aws-cdk/core';
import * as ca from './codeartifact.generated';

export interface IDomain extends
  // all L2 interfaces need to extend IResource
  core.IResource {
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
}

export interface IDomainProps {
  readonly domainName: string;
}


export abstract class DomainBase extends core.Resource implements IDomain {
  readonly domainArn: string = '';
  readonly domainName: string = '';
  protected cfnDomain : ca.CfnDomain;

  constructor(scope: core.Construct, id: string, props: IDomainProps) {
    super(scope, id, {});

    this.cfnDomain = new ca.CfnDomain(scope, id, {
      domainName: props.domainName,
    });

    this.domainArn = this.cfnDomain.attrArn;
    this.domainName = this.cfnDomain.attrName;
  }
}

export class Domain extends DomainBase {
  constructor(scope: core.Construct, id: string, props: IDomainProps) {
    super(scope, id, props);

    // domain = policy.addDomainPolicy(domain, new iam.AccountRootPrincipal(), [...sample.domainActions])
  }
}