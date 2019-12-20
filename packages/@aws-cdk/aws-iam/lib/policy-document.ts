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
  public readonly creationStack: string[];
  private readonly statements = new Array<PolicyStatement>();
  private readonly autoAssignSids: boolean;

  constructor(props: PolicyDocumentProps = {}) {
    this.creationStack = cdk.captureStackTrace();
    this.autoAssignSids = !!props.assignSids;

    this.addStatements(...props.statements || []);
  }

  public resolve(context: cdk.IResolveContext): any {
    context.registerPostProcessor(new RemoveDuplicateStatements(this.autoAssignSids));
    return this.render();
  }

  public get isEmpty(): boolean {
    return this.statements.length === 0;
  }

  /**
   * The number of statements already added to this policy.
   * Can be used, for example, to generate uniuqe "sid"s within the policy.
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
      displayHint: 'PolicyDocument'
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

  private render(): any {
    if (this.isEmpty) {
      return undefined;
    }

    const doc = {
      Statement: this.statements.map(s => s.toStatementJson()),
      Version: '2012-10-17'
    };

    return doc;
  }
}

/**
 * Removes duplicate statements and assign Sids if necessary
 */
class RemoveDuplicateStatements implements cdk.IPostProcessor {
  constructor(private readonly autoAssignSids: boolean) {
  }

  public postProcess(input: any, _context: cdk.IResolveContext): any {
    if (!input || !input.Statement) {
      return input;
    }

    const jsonStatements = new Set<string>();
    const uniqueStatements: any[] = [];

    for (const statement of input.Statement) {
      const jsonStatement = JSON.stringify(statement);
      if (!jsonStatements.has(jsonStatement)) {
        uniqueStatements.push(statement);
        jsonStatements.add(jsonStatement);
      }
    }

    // assign unique SIDs (the statement index) if `autoAssignSids` is enabled
    const statements = uniqueStatements.map((s, i) => {
      if (this.autoAssignSids && !s.Sid) {
        s.Sid = i.toString();
      }

      return s;
    });

    return {
      ...input,
      Statement: statements
    };
  }
}
