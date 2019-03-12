import cdk = require('@aws-cdk/cdk');
import { Default, RegionInfo } from '@aws-cdk/region-info';

export class PolicyDocument extends cdk.Token {
  private statements = new Array<PolicyStatement>();

  /**
   * Creates a new IAM policy document.
   * @param defaultDocument An IAM policy document to use as an initial
   * policy. All statements of this document will be copied in.
   */
  constructor(private readonly baseDocument?: any) {
    super();
  }

  public resolve(_context: cdk.ResolveContext): any {
    if (this.isEmpty) {
      return undefined;
    }

    const doc = this.baseDocument || { };
    doc.Statement = doc.Statement || [ ];
    doc.Version = doc.Version || '2012-10-17';
    doc.Statement = doc.Statement.concat(this.statements);
    return doc;
  }

  get isEmpty(): boolean {
    return this.statements.length === 0;
  }

  /**
   * The number of statements already added to this policy.
   * Can be used, for example, to generate uniuqe "sid"s within the policy.
   */
  get statementCount(): number {
    return this.statements.length;
  }

  public addStatement(statement: PolicyStatement): PolicyDocument {
    this.statements.push(statement);
    return this;
  }
}

/**
 * Represents an IAM principal.
 */
export abstract class PolicyPrincipal {
  /**
   * When this Principal is used in an AssumeRole policy, the action to use.
   */
  public assumeRoleAction: string = 'sts:AssumeRole';

  /**
   * Return the policy fragment that identifies this principal in a Policy.
   */
  public abstract policyFragment(): PrincipalPolicyFragment;
}

/**
 * A collection of the fields in a PolicyStatement that can be used to identify a principal.
 *
 * This consists of the JSON used in the "Principal" field, and optionally a
 * set of "Condition"s that need to be applied to the policy.
 */
export class PrincipalPolicyFragment {
  constructor(
    public readonly principalJson: { [key: string]: string[] },
    public readonly conditions: { [key: string]: any } = { }) {
  }
}

export class ArnPrincipal extends PolicyPrincipal {
  constructor(public readonly arn: string) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ AWS: [ this.arn ] });
  }
}

export class AccountPrincipal extends ArnPrincipal {
  constructor(public readonly accountId: any) {
    super(new StackDependentToken(stack => `arn:${stack.partition}:iam::${accountId}:root`).toString());
  }
}

/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
export class ServicePrincipal extends PolicyPrincipal {
  constructor(public readonly service: string, private readonly opts: ServicePrincipalOpts = {}) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({
      Service: [
        new ServicePrincipalToken(this.service, this.opts).toString()
      ]
    });
  }
}

/**
 * A policy prinicipal for canonicalUserIds - useful for S3 bucket policies that use
 * Origin Access identities.
 *
 * See https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html
 *
 * and
 *
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
 *
 * for more details.
 *
 */
export class CanonicalUserPrincipal extends PolicyPrincipal {
  constructor(public readonly canonicalUserId: string) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ CanonicalUser: [ this.canonicalUserId ] });
  }
}

export class FederatedPrincipal extends PolicyPrincipal {
  constructor(
    public readonly federated: string,
    public readonly conditions: {[key: string]: any},
    public assumeRoleAction: string = 'sts:AssumeRole') {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: [ this.federated ] }, this.conditions);
  }
}

export class AccountRootPrincipal extends AccountPrincipal {
  constructor() {
    super(new StackDependentToken(stack => stack.accountId).toString());
  }
}

/**
 * A principal representing all identities in all accounts
 */
export class AnyPrincipal extends ArnPrincipal {
  constructor() {
    super('*');
  }
}

/**
 * A principal representing all identities in all accounts
 * @deprecated use `AnyPrincipal`
 */
export class Anyone extends AnyPrincipal { }

export class CompositePrincipal extends PolicyPrincipal {
  private readonly principals = new Array<PolicyPrincipal>();

  constructor(principal: PolicyPrincipal, ...additionalPrincipals: PolicyPrincipal[]) {
    super();
    this.assumeRoleAction = principal.assumeRoleAction;
    this.addPrincipals(principal);
    this.addPrincipals(...additionalPrincipals);
  }

  public addPrincipals(...principals: PolicyPrincipal[]): this {
    for (const p of principals) {
      if (p.assumeRoleAction !== this.assumeRoleAction) {
        throw new Error(
          `Cannot add multiple principals with different "assumeRoleAction". ` +
          `Expecting "${this.assumeRoleAction}", got "${p.assumeRoleAction}"`);
      }

      const fragment = p.policyFragment();
      if (fragment.conditions && Object.keys(fragment.conditions).length > 0) {
        throw new Error(
          `Components of a CompositePrincipal must not have conditions. ` +
          `Tried to add the following fragment: ${JSON.stringify(fragment)}`);
      }

      this.principals.push(p);
    }

    return this;
  }

  public policyFragment(): PrincipalPolicyFragment {
    const principalJson: { [key: string]: string[] } = { };

    for (const p of this.principals) {
      mergePrincipal(principalJson, p.policyFragment().principalJson);
    }

    return new PrincipalPolicyFragment(principalJson);
  }
}

/**
 * Represents a statement in an IAM policy document.
 */
export class PolicyStatement extends cdk.Token {
  private action = new Array<any>();
  private principal: { [key: string]: any[] } = {};
  private resource = new Array<any>();
  private condition: { [key: string]: any } = { };
  private effect?: PolicyStatementEffect;
  private sid?: any;

  constructor(effect: PolicyStatementEffect = PolicyStatementEffect.Allow) {
    super();
    this.effect = effect;
  }

  //
  // Actions
  //

  public addAction(action: string): PolicyStatement {
    this.action.push(action);
    return this;
  }

  public addActions(...actions: string[]): PolicyStatement {
    actions.forEach(action => this.addAction(action));
    return this;
  }

  //
  // Principal
  //

  /**
   * Indicates if this permission has a "Principal" section.
   */
  public get hasPrincipal() {
    return Object.keys(this.principal).length > 0;
  }

  public addPrincipal(principal: PolicyPrincipal): this {
    const fragment = principal.policyFragment();
    mergePrincipal(this.principal, fragment.principalJson);
    this.addConditions(fragment.conditions);
    return this;
  }

  public addAwsPrincipal(arn: string): this {
    return this.addPrincipal(new ArnPrincipal(arn));
  }

  public addAwsAccountPrincipal(accountId: string): this {
    return this.addPrincipal(new AccountPrincipal(accountId));
  }

  public addArnPrincipal(arn: string): this {
    return this.addAwsPrincipal(arn);
  }

  /**
   * Adds a service principal to this policy statement.
   *
   * @param service the service name for which a service principal is requested (e.g: `s3.amazonaws.com`).
   * @param region  the region in which the service principal lives (defaults to the current stack's region).
   */
  public addServicePrincipal(service: string, opts?: ServicePrincipalOpts): this {
    return this.addPrincipal(new ServicePrincipal(service, opts));
  }

  public addFederatedPrincipal(federated: any, conditions: {[key: string]: any}): this {
    return this.addPrincipal(new FederatedPrincipal(federated, conditions));
  }

  public addAccountRootPrincipal(): this {
    return this.addPrincipal(new AccountRootPrincipal());
  }

  public addCanonicalUserPrincipal(canonicalUserId: string): this {
    return this.addPrincipal(new CanonicalUserPrincipal(canonicalUserId));
  }

  public addAnyPrincipal(): this {
    return this.addPrincipal(new Anyone());
  }

  //
  // Resources
  //

  public addResource(arn: string): PolicyStatement {
    this.resource.push(arn);
    return this;
  }

  /**
   * Adds a ``"*"`` resource to this statement.
   */
  public addAllResources(): PolicyStatement {
    return this.addResource('*');
  }

  public addResources(...arns: string[]): PolicyStatement {
    arns.forEach(r => this.addResource(r));
    return this;
  }

  /**
   * Indicates if this permission as at least one resource associated with it.
   */
  public get hasResource() {
    return this.resource && this.resource.length > 0;
  }

  public describe(sid: string): PolicyStatement {
    this.sid = sid;
    return this;
  }

  //
  // Effect
  //

  /**
   * Sets the permission effect to allow access to resources.
   */
  public allow(): PolicyStatement {
    this.effect = PolicyStatementEffect.Allow;
    return this;
  }

  /**
   * Sets the permission effect to deny access to resources.
   */
  public deny(): PolicyStatement {
    this.effect = PolicyStatementEffect.Deny;
    return this;
  }

  //
  // Condition
  //

  /**
   * Add a condition to the Policy
   */
  public addCondition(key: string, value: any): PolicyStatement {
    this.condition[key] = value;
    return this;
  }

  /**
   * Add multiple conditions to the Policy
   */
  public addConditions(conditions: {[key: string]: any}): PolicyStatement {
    Object.keys(conditions).map(key => {
      this.addCondition(key, conditions[key]);
    });
    return this;
  }

  /**
   * Add a condition to the Policy.
   *
   * @deprecated For backwards compatibility. Use addCondition() instead.
   */
  public setCondition(key: string, value: any): PolicyStatement {
    return this.addCondition(key, value);
  }

  public limitToAccount(accountId: string): PolicyStatement {
    return this.addCondition('StringEquals', new cdk.Token(() => {
      return { 'sts:ExternalId': accountId };
    }));
  }

  //
  // Serialization
  //
  public resolve(_context: cdk.ResolveContext): any {
    return this.toJson();
  }

  public toJson(): any {
    return {
      Action: _norm(this.action),
      Condition: _norm(this.condition),
      Effect: _norm(this.effect),
      Principal: _normPrincipal(this.principal),
      Resource: _norm(this.resource),
      Sid: _norm(this.sid),
    };

    function _norm(values: any) {

      if (typeof(values) === 'undefined') {
        return undefined;
      }

      if (Array.isArray(values)) {
        if (!values || values.length === 0) {
          return undefined;
        }

        if (values.length === 1) {
          return values[0];
        }

        return values;
      }

      if (typeof(values) === 'object') {
        if (Object.keys(values).length === 0) {
          return undefined;
        }
      }

      return values;
    }

    function _normPrincipal(principal: { [key: string]: any[] }) {
      const keys = Object.keys(principal);
      if (keys.length === 0) { return undefined; }
      const result: any = {};
      for (const key of keys) {
        const normVal = _norm(principal[key]);
        if (normVal) {
          result[key] = normVal;
        }
      }
      if (Object.keys(result).length === 1 && result.AWS === '*') {
        return '*';
      }
      return result;
    }
  }
}

export enum PolicyStatementEffect {
  Allow = 'Allow',
  Deny = 'Deny',
}

function mergePrincipal(target: { [key: string]: string[] }, source: { [key: string]: string[] }) {
  for (const key of Object.keys(source)) {
    target[key] = target[key] || [];

    const value = source[key];
    if (!Array.isArray(value)) {
      throw new Error(`Principal value must be an array (it will be normalized later): ${value}`);
    }

    target[key].push(...value);
  }

  return target;
}

/**
 * A lazy token that requires an instance of Stack to evaluate
 */
class StackDependentToken extends cdk.Token {
  constructor(private readonly fn: (stack: cdk.Stack) => any) {
    super();
  }

  public resolve(context: cdk.ResolveContext) {
    return this.fn(context.scope.node.stack);
  }
}

class ServicePrincipalToken extends cdk.Token {
  constructor(private readonly service: string,
              private readonly opts: ServicePrincipalOpts) {
    super();
  }

  public resolve(ctx: cdk.ResolveContext) {
    const region = this.opts.region || ctx.scope.node.stack.region;
    const fact = RegionInfo.get(region).servicePrincipal(this.service);
    return fact || Default.servicePrincipal(this.service, region, ctx.scope.node.stack.urlSuffix);
  }
}

/**
 * Options for a service principal.
 */
export interface ServicePrincipalOpts {
  /**
   * The region in which the service is operating.
   *
   * @default the current Stack's region.
   */
  region?: string;
}
