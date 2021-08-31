import * as crypto from 'crypto';
import { IIdentity } from './identity-base';
import { PolicyStatement } from './policy-statement';
import { AddToPrincipalPolicyResult, IGrantable, IPrincipal, PrincipalPolicyFragment } from './principals';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * An IAM Principal that wraps a different Principal,
 * and groups multiple Policy Statements that share the same 'actions' property together,
 * thus compressing the overall size of the Policy attached the given Principal,
 * and making it less likely it hits the 10240 bytes IAM limit.
 */
export class GroupingByActionsPrincipal extends Construct implements IPrincipal, IGrantable {
  public readonly assumeRoleAction: string;
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly principalAccount?: string | undefined;
  public readonly grantPrincipal: IPrincipal;

  /** The original principal that this class wraps. */
  public readonly wrappedIdentity: IIdentity;
  private readonly statements: { [key: string]: { statement: PolicyStatement, grantResult: AddToPrincipalPolicyResult } };

  constructor(grantPrincipal: IIdentity, id: string) {
    super(grantPrincipal as unknown as Construct, id);

    this.assumeRoleAction = grantPrincipal.assumeRoleAction;
    this.policyFragment = grantPrincipal.policyFragment;
    this.principalAccount = grantPrincipal.principalAccount;
    this.grantPrincipal = this;

    this.wrappedIdentity = grantPrincipal;
    this.statements = {};
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    const key = this.keyFor(statement);
    const statementCache = this.statements[key];
    if (!statementCache) {
      const grantResult = this.wrappedIdentity.addToPrincipalPolicy(statement);
      this.statements[key] = { statement, grantResult };
      return grantResult;
    } else {
      statementCache.statement.addResources(...statement.resources);
      statementCache.statement.addNotResources(...statement.notResources);
      return statementCache.grantResult;
    }
  }

  private keyFor(statement: PolicyStatement): string {
    const hashBuilder = crypto.createHash('sha256');

    const statementJson = statement.toStatementJson();
    // don't include the Resource and NotResource parts in the hash,
    // so that later Statements that share the other parts can be grouped with this one
    delete statementJson.Resource;
    delete statementJson.NotResource;

    hashBuilder.update(JSON.stringify(statementJson));
    return hashBuilder.digest('hex');
  }
}
