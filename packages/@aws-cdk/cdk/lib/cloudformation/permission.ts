import { Token } from '../core/tokens';
import { AwsAccountId, AwsPartition } from './pseudo';

export class PolicyDocument extends Token {
  private statements = new Array<PolicyStatement>();

  /**
   * Creates a new IAM policy document.
   * @param defaultDocument An IAM policy document to use as an initial
   * policy. All statements of this document will be copied in.
   */
  constructor(private readonly baseDocument?: any) {
    super();
  }

  public resolve(): any {
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
  public readonly assumeRoleAction: string = 'sts:AssumeRole';

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
    public readonly principalJson: any,
    public readonly conditions: {[key: string]: any} = {}) {
  }
}

export class ArnPrincipal extends PolicyPrincipal {
  constructor(public readonly arn: string) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ AWS: this.arn });
  }
}

export class AccountPrincipal extends ArnPrincipal {
  constructor(public readonly accountId: any) {
    super(`arn:${new AwsPartition()}:iam::${accountId}:root`);
  }
}

/**
 * An IAM principal that represents an AWS service (i.e. sqs.amazonaws.com).
 */
export class ServicePrincipal extends PolicyPrincipal {
  constructor(public readonly service: string) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Service: this.service });
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
  constructor(public readonly canonicalUserId: any) {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ CanonicalUser: this.canonicalUserId });
  }
}

export class FederatedPrincipal extends PolicyPrincipal {
  constructor(
    public readonly federated: any,
    public readonly conditions: {[key: string]: any},
    public readonly assumeRoleAction: string = 'sts:AssumeRole') {
    super();
  }

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment({ Federated: this.federated }, this.conditions);
  }
}

export class AccountRootPrincipal extends AccountPrincipal {
  constructor() {
    super(new AwsAccountId());
  }
}

/**
 * A principal representing all identities in all accounts
 */
export class Anyone extends PolicyPrincipal {
  /**
   * Interface compatibility with AccountPrincipal for the purposes of the Lambda library
   *
   * The Lambda's addPermission() call works differently from regular
   * statements, and will use the value of this property directly if present
   * (which leads to the correct statement ultimately).
   */
  public readonly accountId = '*';

  public policyFragment(): PrincipalPolicyFragment {
    return new PrincipalPolicyFragment('*');
  }
}

/**
 * Represents a statement in an IAM policy document.
 */
export class PolicyStatement extends Token {
  private action = new Array<any>();
  private principal = new Array<any>();
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
    return this.principal && this.principal.length > 0;
  }

  public addPrincipal(principal: PolicyPrincipal): PolicyStatement {
    const fragment = principal.policyFragment();
    this.principal.push(fragment.principalJson);
    this.addConditions(fragment.conditions);
    return this;
  }

  public addAwsPrincipal(arn: string): PolicyStatement {
    return this.addPrincipal(new ArnPrincipal(arn));
  }

  public addAwsAccountPrincipal(accountId: string): PolicyStatement {
    return this.addPrincipal(new AccountPrincipal(accountId));
  }

  public addServicePrincipal(service: string): PolicyStatement {
    return this.addPrincipal(new ServicePrincipal(service));
  }

  public addFederatedPrincipal(federated: any, conditions: {[key: string]: any}): PolicyStatement {
    return this.addPrincipal(new FederatedPrincipal(federated, conditions));
  }

  public addAccountRootPrincipal(): PolicyStatement {
    return this.addPrincipal(new AccountRootPrincipal());
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
   * Sets the permission effect to deny access to resources.
   */
  public allow(): PolicyStatement {
    this.effect = PolicyStatementEffect.Allow;
    return this;
  }

  /**
   * Sets the permission effect to allow access to resources.
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
    return this.addCondition('StringEquals', new Token(() => {
      return { 'sts:ExternalId': accountId };
    }));
  }

  //
  // Serialization
  //

  public resolve(): any {
    return this.toJson();
  }

  public toJson(): any {
    return {
      Action: _norm(this.action),
      Condition: _norm(this.condition),
      Effect: _norm(this.effect),
      Principal: _norm(this.principal),
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
  }
}

export enum PolicyStatementEffect {
  Allow = 'Allow',
  Deny = 'Deny',
}
