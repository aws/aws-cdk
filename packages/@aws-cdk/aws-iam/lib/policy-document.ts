import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { PolicyStatement } from './policy-statement';
import { PostProcessPolicyDocument } from './private/postprocess-policy-document';

/**
 * Properties for a new PolicyDocument
 */
export interface PolicyDocumentProps {
  /**
   * Automatically assign Statement Ids to all statements
   *
   * @default false
   */
  readonly assignSids?: boolean;

  /**
   * Initial statements to add to the policy document
   *
   * @default - No statements
   */
  readonly statements?: PolicyStatement[];

  /**
   * Try to minimize the policy by merging statements
   *
   * To avoid overrunning the maximum policy size, combine statements if they produce
   * the same result. Merging happens according to the following rules:
   *
   * - The Effect of both statements is the same
   * - Neither of the statements have a 'Sid'
   * - Combine Principals if the rest of the statement is exactly the same.
   * - Combine Resources if the rest of the statement is exactly the same.
   * - Combine Actions if the rest of the statement is exactly the same.
   * - We will never combine NotPrincipals, NotResources or NotActions, because doing
   *   so would change the meaning of the policy document.
   *
   * @default - false, unless the feature flag `@aws-cdk/aws-iam:minimizePolicies` is set
   */
  readonly minimize?: boolean;
}

/**
 * A PolicyDocument is a collection of statements
 */
export class PolicyDocument implements cdk.IResolvable {

  /**
   * Creates a new PolicyDocument based on the object provided.
   * This will accept an object created from the `.toJSON()` call
   * @param obj the PolicyDocument in object form.
   */
  public static fromJson(obj: any): PolicyDocument {
    const newPolicyDocument = new PolicyDocument();
    const statement = obj.Statement ?? [];
    if (statement && !Array.isArray(statement)) {
      throw new Error('Statement must be an array');
    }
    newPolicyDocument.addStatements(...obj.Statement.map((s: any) => PolicyStatement.fromJson(s)));
    return newPolicyDocument;
  }

  public readonly creationStack: string[];
  private readonly statements = new Array<PolicyStatement>();
  private readonly autoAssignSids: boolean;
  private readonly minimize?: boolean;

  constructor(props: PolicyDocumentProps = {}) {
    this.creationStack = cdk.captureStackTrace();
    this.autoAssignSids = !!props.assignSids;
    this.minimize = props.minimize;

    this.addStatements(...props.statements || []);
  }

  public resolve(context: cdk.IResolveContext): any {
    context.registerPostProcessor(new PostProcessPolicyDocument(
      this.autoAssignSids,
      this.minimize ?? cdk.FeatureFlags.of(context.scope).isEnabled(cxapi.IAM_MINIMIZE_POLICIES) ?? false,
    ));
    return this.render();
  }

  /**
   * Whether the policy document contains any statements.
   */
  public get isEmpty(): boolean {
    return this.statements.length === 0;
  }

  /**
   * The number of statements already added to this policy.
   * Can be used, for example, to generate unique "sid"s within the policy.
   */
  public get statementCount(): number {
    return this.statements.length;
  }

  /**
   * Adds a statement to the policy document.
   *
   * @param statement the statement to add.
   */
  public addStatements(...statement: PolicyStatement[]) {
    this.statements.push(...statement);
  }

  /**
   * Encode the policy document as a string
   */
  public toString() {
    return cdk.Token.asString(this, {
      displayHint: 'PolicyDocument',
    });
  }

  /**
   * JSON-ify the document
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    return this.render();
  }

  /**
   * Validate that all policy statements in the policy document satisfies the
   * requirements for any policy.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
   *
   * @returns An array of validation error messages, or an empty array if the document is valid.
   */
  public validateForAnyPolicy(): string[] {
    const errors = new Array<string>();
    for (const statement of this.statements) {
      errors.push(...statement.validateForAnyPolicy());
    }
    return errors;
  }

  /**
   * Validate that all policy statements in the policy document satisfies the
   * requirements for a resource-based policy.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
   *
   * @returns An array of validation error messages, or an empty array if the document is valid.
   */
  public validateForResourcePolicy(): string[] {
    const errors = new Array<string>();
    for (const statement of this.statements) {
      errors.push(...statement.validateForResourcePolicy());
    }
    return errors;
  }

  /**
   * Validate that all policy statements in the policy document satisfies the
   * requirements for an identity-based policy.
   *
   * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
   *
   * @returns An array of validation error messages, or an empty array if the document is valid.
   */
  public validateForIdentityPolicy(): string[] {
    const errors = new Array<string>();
    for (const statement of this.statements) {
      errors.push(...statement.validateForIdentityPolicy());
    }
    return errors;
  }

  private render(): any {
    if (this.isEmpty) {
      return undefined;
    }

    const doc = {
      Statement: this.statements.map(s => s.toStatementJson()),
      Version: '2012-10-17',
    };

    return doc;
  }
}
