import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
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
export declare class PolicyDocument implements cdk.IResolvable {
    /**
     * Creates a new PolicyDocument based on the object provided.
     * This will accept an object created from the `.toJSON()` call
     * @param obj the PolicyDocument in object form.
     */
    static fromJson(obj: any): PolicyDocument;
    readonly creationStack: string[];
    private readonly statements;
    private readonly autoAssignSids;
    private readonly minimize?;
    constructor(props?: PolicyDocumentProps);
    resolve(context: cdk.IResolveContext): any;
    /**
     * Whether the policy document contains any statements.
     */
    get isEmpty(): boolean;
    /**
     * The number of statements already added to this policy.
     * Can be used, for example, to generate unique "sid"s within the policy.
     */
    get statementCount(): number;
    /**
     * Adds a statement to the policy document.
     *
     * @param statement the statement to add.
     */
    addStatements(...statement: PolicyStatement[]): void;
    /**
     * Encode the policy document as a string
     */
    toString(): string;
    /**
     * JSON-ify the document
     *
     * Used when JSON.stringify() is called
     */
    toJSON(): any;
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for any policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForAnyPolicy(): string[];
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for a resource-based policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForResourcePolicy(): string[];
    /**
     * Validate that all policy statements in the policy document satisfies the
     * requirements for an identity-based policy.
     *
     * @see https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html#access_policies-json
     *
     * @returns An array of validation error messages, or an empty array if the document is valid.
     */
    validateForIdentityPolicy(): string[];
    /**
     * Perform statement merging (if enabled and not done yet)
     *
     * @internal
     */
    _maybeMergeStatements(scope: IConstruct): void;
    /**
     * Split the statements of the PolicyDocument into multiple groups, limited by their size
     *
     * We do a round of size-limited merging first (making sure to not produce statements too
     * large to fit into standalone policies), so that we can most accurately estimate total
     * policy size. Another final round of minimization will be done just before rendering to
     * end up with minimal policies that look nice to humans.
     *
     * Return a map of the final set of policy documents, mapped to the ORIGINAL (pre-merge)
     * PolicyStatements that ended up in the given PolicyDocument.
     *
     * @internal
     */
    _splitDocument(scope: IConstruct, selfMaximumSize: number, splitMaximumSize: number): Map<PolicyDocument, PolicyStatement[]>;
    private render;
    private shouldMerge;
    /**
     * Freeze all statements
     */
    private freezeStatements;
}
