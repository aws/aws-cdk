import * as cdk from '@aws-cdk/core';
/**
 * A Token object that will drop the last element of an array if it is an empty object
 *
 * Necessary to prevent options objects that only contain "region" and "account" keys
 * that evaluate to "undefined" from showing up in the rendered JSON.
 */
export declare class DropEmptyObjectAtTheEndOfAnArray implements cdk.IResolvable, cdk.IPostProcessor {
    private readonly value;
    readonly creationStack: string[];
    constructor(value: any);
    resolve(context: cdk.IResolveContext): any;
    postProcess(o: any, _context: cdk.IResolveContext): any;
}
