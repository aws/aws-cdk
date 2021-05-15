import * as cdk from '@aws-cdk/core';
import { PolicyStatement } from './policy-statement';

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

  constructor(props: PolicyDocumentProps = {}) {
    this.creationStack = cdk.captureStackTrace();
    this.autoAssignSids = !!props.assignSids;

    this.addStatements(...props.statements || []);
  }

  public resolve(context: cdk.IResolveContext): any {
    context.registerPostProcessor(new OptimizeStatements(this.autoAssignSids));
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

/**
 * Optimizes, removes duplicate statements and assigns Sids if necessary
 */
class OptimizeStatements implements cdk.IPostProcessor {
  constructor(private readonly autoAssignSids: boolean) {}

  /**
   * Consolidates multiple statements with the same actions but different resources into
   * just the same statement with the same actions and an array or resources
   */
  private consolidateStatements(
    statements: Array<{
      Action?: string | string[];
      NotAction?: string | string[];
      Resource?: string | string[];
      NotResource?: string | string[];
    }>,
  ) {
    const uniqueActions = new Map<string, typeof statements[number]>();

    function concatResources(
      previous: string | string[] | undefined,
      current: string | string[] | undefined,
    ) {
      const result = new Set<string>();

      for (let array of [previous, current]) {
        if (array && Array.isArray(array)) {
          array.forEach((p) => result.add(p));
        } else if (array) {
          result.add(array);
        }
      }

      if (result.size === 0) return undefined;

      return result.size === 1 ? [...result][0] : [...result];
    }

    for (const statement of statements) {
      const { Action, NotAction, Resource, NotResource, ...rest } = statement;

      const jsonAction = JSON.stringify({ Action, NotAction, ...rest });
      const existing = uniqueActions.get(jsonAction);

      const consolidatedResources = concatResources(existing?.Resource, Resource);
      const consolidatedNotResources = concatResources(existing?.NotResource, NotResource);

      uniqueActions.set(jsonAction, {
        ...(Action && { Action }),
        ...(NotAction && { NotAction }),
        ...(consolidatedResources && { Resource: consolidatedResources }),
        ...(consolidatedNotResources && { NotResource: consolidatedNotResources }),
        ...rest,
      });
    }

    return [...uniqueActions.values()];
  }

  private removeDuplicates(statements: any[]) {
    const jsonStatements = new Set<string>();
    const uniqueStatements: any[] = [];

    for (const statement of statements) {
      const jsonStatement = JSON.stringify(statement);
      if (!jsonStatements.has(jsonStatement)) {
        uniqueStatements.push(statement);
        jsonStatements.add(jsonStatement);
      }
    }

    // assign unique SIDs (the statement index) if `autoAssignSids` is enabled
    const result = uniqueStatements.map((s, i) => {
      if (this.autoAssignSids && !s.Sid) {
        s.Sid = i.toString();
      }

      return s;
    });
    return result;
  }

  public postProcess(input: any, _context: cdk.IResolveContext): any {
    if (!input || !input.Statement) {
      return input;
    }

    const statements = this.removeDuplicates(
      this.consolidateStatements(input.Statement),
    );

    return {
      ...input,
      Statement: statements,
    };
  }
}
