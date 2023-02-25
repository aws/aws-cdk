import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';

/**
 * A PolicyDocument adapter that can modify statements flowing through it
 */
export class MutatingPolicyDocumentAdapter extends PolicyDocument {
  constructor(private readonly wrapped: PolicyDocument, private readonly mutator: (s: PolicyStatement) => PolicyStatement) {
    super();
  }

  public addStatements(...statements: PolicyStatement[]): void {
    for (const st of statements) {
      this.wrapped.addStatements(this.mutator(st));
    }
  }
}
