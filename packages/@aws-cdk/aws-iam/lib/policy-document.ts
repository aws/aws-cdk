import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';
import { PolicyStatement } from './policy-statement';
import { mergeStatements } from './private/merge-statements';
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
  private _minimized = false;

  constructor(props: PolicyDocumentProps = {}) {
    this.creationStack = cdk.captureStackTrace();
    this.autoAssignSids = !!props.assignSids;
    this.minimize = props.minimize;

    this.addStatements(...props.statements || []);
  }

  public resolve(context: cdk.IResolveContext): any {
    this._maybeMergeStatements(context.scope);
    context.registerPostProcessor(new PostProcessPolicyDocument(this.autoAssignSids));
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
   */
  public validateForIdentityPolicy(): string[] {
    const errors = new Array<string>();
    for (const statement of this.statements) {
      errors.push(...statement.validateForIdentityPolicy());
    }
    return errors;
  }

  /**
   * Perform statement merging (if enabled and not done yet)
   *
   * Returns a mapping of merged statements to original statements on the first invocation,
   * `undefined` on subsequent invocations.
   *
   * @internal
   */
  public _maybeMergeStatements(scope: IConstruct): Map<PolicyStatement, PolicyStatement[]> | undefined {
    const minimize = this.minimize ?? cdk.FeatureFlags.of(scope).isEnabled(cxapi.IAM_MINIMIZE_POLICIES) ?? false;
    if (minimize) {
      if (this._minimized) {
        return undefined;
      }
      const result = mergeStatements(this.statements);
      this.statements.splice(0, this.statements.length, ...result.mergedStatements);
      this._minimized = true;
      return result.originsMap;
    }
    return new Map(this.statements.map(s => [s, [s]]));
  }

  /**
   * Split the statements of the PolicyDocument into multiple groups, limited by their size
   *
   * Returns the policy documents created to hold statements that were split off.
   *
   * @internal
   */
  public _splitDocument(selfMaximumSize: number, splitMaximumSize: number): PolicyDocument[] {
    const self = this;
    const newDocs: PolicyDocument[] = [];

    // Cache statement sizes to avoid recomputing them based on the fields
    const statementSizes = new Map<PolicyStatement, number>(this.statements.map(s => [s, s._estimateSize()]));

    // Keep some size counters so we can avoid recomputing them based on the statements in each
    let selfSize = 0;
    const polSizes = new Map<PolicyDocument, number>();
    // Getter with a default to save some syntactic noise
    const polSize = (x: PolicyDocument) => polSizes.get(x) ?? 0;

    let i = 0;
    while (i < this.statements.length) {
      const statement = this.statements[i];

      const statementSize = statementSizes.get(statement) ?? 0;
      if (selfSize + statementSize < selfMaximumSize) {
        // Fits in self
        selfSize += statementSize;
        i++;
        continue;
      }

      // Split off to new PolicyDocument. Find the PolicyDocument we can add this to,
      // or add a fresh one.
      const addToDoc = findDocWithSpace(statementSize);
      addToDoc.addStatements(statement);
      polSizes.set(addToDoc, polSize(addToDoc) + statementSize);
      this.statements.splice(i, 1);
    }

    return newDocs;

    function findDocWithSpace(size: number) {
      let j = 0;
      while (j < newDocs.length && polSize(newDocs[j]) + size > splitMaximumSize) {
        j++;
      }
      if (j < newDocs.length) {
        return newDocs[j];
      }

      const newDoc = new PolicyDocument({
        assignSids: self.autoAssignSids,
        // Minimizing has already been done
        minimize: false,
      });
      newDocs.push(newDoc);
      return newDoc;
    }
  }

  /**
   * The statements in this doc
   *
   * @internal
   */
  public _statements() {
    return [...this.statements];
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
