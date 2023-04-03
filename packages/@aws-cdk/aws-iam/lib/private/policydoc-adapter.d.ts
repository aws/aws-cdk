import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';
/**
 * A PolicyDocument adapter that can modify statements flowing through it
 */
export declare class MutatingPolicyDocumentAdapter extends PolicyDocument {
    private readonly wrapped;
    private readonly mutator;
    constructor(wrapped: PolicyDocument, mutator: (s: PolicyStatement) => PolicyStatement);
    addStatements(...statements: PolicyStatement[]): void;
}
