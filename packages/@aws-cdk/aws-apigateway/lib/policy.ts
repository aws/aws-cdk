import iam = require('@aws-cdk/aws-iam');
import { Fn } from '@aws-cdk/core';

/**
 * A policy statement for a Rest API policy document
 */
export class RestApiPolicyStatement extends iam.PolicyStatement {
  constructor(props: iam.PolicyStatementProps = {}) {
    super({
      ...props,
      resources: [Fn.join('', ['execute-api:/', '*'])]
    });
  }
}

/**
 * Properties for a RestApiPolicyDocument
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
  readonly statements?: RestApiPolicyStatement[];
}

/**
 * A policy document for a Rest API policy
 */
export class RestApiPolicyDocument extends iam.PolicyDocument {
  constructor(props: iam.PolicyDocumentProps = {}) {
    super(props);
  }

  public addStatements(...statement: RestApiPolicyStatement[]) {
    this.statements.push(...statement);
  }
}
