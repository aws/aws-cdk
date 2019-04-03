import cdk = require('@aws-cdk/cdk');
import { PolicyStatement, PrincipalPolicyFragment } from './policy-document';
import { IPrincipal } from './principals';

/**
 * Properties for an ImportedResourcePrincipal
 */
export interface ImportedResourcePrincipalProps {
  /**
   * The resource the role proxy is for
   */
  readonly resource: cdk.IConstruct;
}

/**
 * A principal associated with an imported resource
 *
 * Some resources have roles associated with them which they assume, such as
 * Lambda Functions, CodeBuild projects, StepFunctions machines, etc.
 *
 * When those resources are imported, their actual roles are not always
 * imported with them. When that happens, we use an instance of this class
 * instead, which will add user warnings when statements are attempted to be
 * added to it.
 */
export class ImportedResourcePrincipal implements IPrincipal {
  public readonly assumeRoleAction: string = 'sts:AssumeRole';
  public readonly grantPrincipal: IPrincipal;
  private readonly resource: cdk.IConstruct;

  constructor(props: ImportedResourcePrincipalProps) {
    this.resource = props.resource;
    this.grantPrincipal = this;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    throw new Error(`Cannot get policy fragment of ${this.resource.node.path}, resource imported without a role`);
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    const repr = JSON.stringify(this.resource.node.resolve(statement));
    this.resource.node.addWarning(`Add statement to this resource's role: ${repr}`);
    return true; // Pretend we did the work. The human will do it for us, eventually.
  }
}