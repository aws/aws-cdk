import * as cdk from '@aws-cdk/core';
/**
 * A Token postprocesser for policy documents
 *
 * Removes duplicate statements, and assign Sids if necessary
 *
 * Because policy documents can contain all kinds of crazy things,
 * we do all the necessary work here after the document has been mostly resolved
 * into a predictable CloudFormation form.
 */
export declare class PostProcessPolicyDocument implements cdk.IPostProcessor {
    private readonly autoAssignSids;
    private readonly sort;
    constructor(autoAssignSids: boolean, sort: boolean);
    postProcess(input: any, _context: cdk.IResolveContext): any;
}
export declare type IamValue = string | Record<string, any> | Array<string | Record<string, any>>;
export interface StatementSchema {
    Sid?: string;
    Effect?: string;
    Principal?: string | string[] | Record<string, IamValue>;
    NotPrincipal?: string | string[] | Record<string, IamValue>;
    Resource?: IamValue;
    NotResource?: IamValue;
    Action?: IamValue;
    NotAction?: IamValue;
    Condition?: unknown;
}
export declare function normalizeStatement(s: StatementSchema): any;
