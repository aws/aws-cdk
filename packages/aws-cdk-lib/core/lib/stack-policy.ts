import { StackPolicyStatement } from './stack-policy-statement';

/**
 * Represents a Stack Policy
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html#stack-policy-reference
 */
export interface StackPolicyProps {
  /**
   * Initial set of permissions to add to this policy document.
   * You can also use `addStatements(...statement)` to add permissions later.
   *
   * @default - No statements.
   */
  readonly statements?: StackPolicyStatement[];
}

/**
 * Represents a Stack Policy
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html#stack-policy-reference
 */
export interface IStackPolicy {
  /**
   * name
   */
  toJSON(): any;
}

/**
 * Description
 */
export class StackPolicy {

  /**
   * Represents a Stack Policy
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/protect-stack-resources.html#stack-policy-reference
   */
  private readonly statements = new Array<StackPolicyStatement>();


  constructor(props: StackPolicyProps = {}) {
    this.addStatements(...props.statements || []);
  }

  /**
   * Adds a statement to the policy document.
   *
   * @param statement the statement to add.
   */
  public addStatements(...statement: StackPolicyStatement[]) {
    this.statements.push(...statement);
  }

  /**
   * Whether the policy document contains any statements.
   */
  public get isEmpty(): boolean {
    return this.statements.length === 0;
  }

  private render(): any {
    if (this.isEmpty) {
      return undefined;
    }

    const doc = {
      Statement: this.statements.map(s => s.toStatementJson()),
    };

    return doc;
  }

  /**
   * JSON-ify the document
   *
   * Used when JSON.stringify() is called
   */
  public toJSON() {
    return this.render();
  }
}