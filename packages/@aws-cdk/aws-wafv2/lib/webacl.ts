import { Construct } from 'constructs';
import { scopeToCloudFormation } from './gen/private/scopetocloudformation.generated';
import { WebAclGen, WebAclGenPropsBase } from './gen/private/webaclgen.generated';
import { ProtectedResource } from './gen/protectedresource.generated';
import { Scope } from './gen/scope.generated';
import { CfnWebACLAssociation } from './wafv2.generated';

export interface WebAclProps extends WebAclGenPropsBase {
  /**
   * Specifies whether this is for an Amazon CloudFront distribution or for a regional application.
   *
   * A regional application can be an Application Load Balancer (ALB), an
   * Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon
   * Cognito user pool.
   *
   * @default - Automatically derived from 'protectedResources'
   */
  readonly scope?: Scope;
}

export class WebAcl extends WebAclGen {
  private _scope: Scope | undefined;

  constructor(scope: Construct, id: string, props: WebAclProps) {
    super(scope, id, {
      ...props,
      scopeProducer: () => {
        if (!this._scope) {
          throw new Error('Pass either \'scope\' as a property, or add at least one protected resource');
        }
        return scopeToCloudFormation(this._scope);
      },
    });

    this._scope = props.scope;

    for (const res of props.protectedResources ?? []) {
      this.addProtectedResource(res);
    }
  }

  public addProtectedResource(resource: ProtectedResource) {
    const result = resource.bind(this);
    if (this._scope && result.scope !== this._scope) {
      throw new Error(`All protected resources must have the same scope, ACL has ${this._scope} but ${result.id} requires ${result.scope}`);
    }
    this._scope = result.scope;

    if (result.resourceArn) {
      new CfnWebACLAssociation(this, result.id, {
        resourceArn: result.resourceArn,
        webAclArn: this.webAclArn,
      });
    }
  }
}