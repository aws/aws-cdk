import * as cdk from '@aws-cdk/core';
import { mergeStatements } from './merge-statements';

/**
 * A Token postprocesser for policy documents
 *
 * Removes duplicate statements, merges statements, and assign Sids if necessary
 *
 * Because policy documents can contain all kinds of crazy things,
 * we do all the necessary work here after the document has been mostly resolved
 * into a predictable CloudFormation form.
 */
export class PostProcessPolicyDocument implements cdk.IPostProcessor {
  constructor(private readonly autoAssignSids: boolean, private readonly minimize: boolean) {
  }

  public postProcess(input: any, _context: cdk.IResolveContext): any {
    if (!input || !input.Statement) {
      return input;
    }

    if (this.minimize) {
      input.Statement = mergeStatements(input.Statement);
    }

    // Also remove full-on duplicates (this will not be necessary if
    // we minimized, but it might still dedupe statements we didn't
    // minimize like 'Deny' statements, and definitely is still necessary
    // if we didn't minimize)
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
      Statement: statements,
    };
  }
}
