import cdk = require('@aws-cdk/core');
import { AccountPrincipal, AccountRootPrincipal, Anyone, ArnPrincipal, CanonicalUserPrincipal,
  FederatedPrincipal, IPrincipal, ServicePrincipal, ServicePrincipalOpts } from './principals';
import { mergePrincipal } from './util';

/**
 * Represents a statement in an IAM policy document.
 */
export class PolicyStatement {
  /**
   * Statement ID for this statement
   */
  public sid?: string;
  public effect: Effect;

  private action = new Array<any>();
  private principal: { [key: string]: any[] } = {};
  private resource = new Array<any>();
  private condition: { [key: string]: any } = { };

  constructor(props: PolicyStatementProps = {}) {
    this.effect = props.effect || Effect.ALLOW;

    this.addActions(...props.actions || []);
    this.addPrincipals(...props.principals || []);
    this.addResources(...props.resources || []);
    if (props.conditions !== undefined) {
      this.addConditions(props.conditions);
    }
  }

  //
  // Actions
  //

  public addActions(...actions: string[]) {
    this.action.push(...actions);
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

  public addPrincipals(...principals: IPrincipal[]) {
    for (const principal of principals) {
      const fragment = principal.policyFragment;
      mergePrincipal(this.principal, fragment.principalJson);
      this.addConditions(fragment.conditions);
    }
  }

  public addAwsAccountPrincipal(accountId: string) {
    this.addPrincipals(new AccountPrincipal(accountId));
  }

  public addArnPrincipal(arn: string) {
    this.addPrincipals(new ArnPrincipal(arn));
  }

  /**
   * Adds a service principal to this policy statement.
   *
   * @param service the service name for which a service principal is requested (e.g: `s3.amazonaws.com`).
   * @param opts    options for adding the service principal (such as specifying a principal in a different region)
   */
  public addServicePrincipal(service: string, opts?: ServicePrincipalOpts) {
    this.addPrincipals(new ServicePrincipal(service, opts));
  }

  public addFederatedPrincipal(federated: any, conditions: {[key: string]: any}) {
    this.addPrincipals(new FederatedPrincipal(federated, conditions));
  }

  public addAccountRootPrincipal() {
    this.addPrincipals(new AccountRootPrincipal());
  }

  public addCanonicalUserPrincipal(canonicalUserId: string) {
    this.addPrincipals(new CanonicalUserPrincipal(canonicalUserId));
  }

  public addAnyPrincipal() {
    this.addPrincipals(new Anyone());
  }

  //
  // Resources
  //

  public addResources(...arns: string[]) {
    this.resource.push(...arns);
  }

  /**
   * Adds a ``"*"`` resource to this statement.
   */
  public addAllResources() {
    this.addResources('*');
  }

  /**
   * Indicates if this permission as at least one resource associated with it.
   */
  public get hasResource() {
    return this.resource && this.resource.length > 0;
  }

  //
  // Condition
  //

  /**
   * Add a condition to the Policy
   */
  public addCondition(key: string, value: any) {
    this.condition[key] = value;
  }

  /**
   * Add multiple conditions to the Policy
   */
  public addConditions(conditions: {[key: string]: any}) {
    Object.keys(conditions).map(key => {
      this.addCondition(key, conditions[key]);
    });
  }

  /**
   * Add a condition that limits to a given account
   */
  public addAccountCondition(accountId: string) {
    this.addCondition('StringEquals', { 'sts:ExternalId': accountId });
  }

  public toStatementJson(): any {
    return noUndef({
      Action: _norm(this.action),
      Condition: _norm(this.condition),
      Effect: _norm(this.effect),
      Principal: _normPrincipal(this.principal),
      Resource: _norm(this.resource),
      Sid: _norm(this.sid),
    });

    function _norm(values: any) {

      if (typeof(values) === 'undefined') {
        return undefined;
      }

      if (cdk.Token.isUnresolved(values)) {
        return values;
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

  public toString() {
    return cdk.Token.asString(this, {
      displayHint: 'PolicyStatement'
    });
  }

  /**
   * JSON-ify the statement
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    return this.toStatementJson();
  }
}

export enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

/**
 * Interface for creating a policy statement
 */
export interface PolicyStatementProps {
  /**
   * List of actions to add to the statement
   *
   * @default - no actions
   */
  readonly actions?: string[];

  /**
   * List of principals to add to the statement
   *
   * @default - no principals
   */
  readonly principals?: IPrincipal[];

  /**
   * Resource ARNs to add to the statement
   *
   * @default - no principals
   */
  readonly resources?: string[];

  /**
   * Conditions to add to the statement
   *
   * @default - no condition
   */
  readonly conditions?: {[key: string]: any};

  /**
   * Whether to allow or deny the actions in this statement
   *
   * @default - allow
   */
  readonly effect?: Effect;
}

function noUndef(x: any): any {
  const ret: any = {};
  for (const [key, value] of Object.entries(x)) {
    if (value !== undefined) {
      ret[key] = value;
    }
  }
  return ret;
}