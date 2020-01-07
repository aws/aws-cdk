import * as cdk from '@aws-cdk/core';
import { dropUndefined } from './object';

/**
 * A Token object that will drop the last element of an array if it is an empty object
 *
 * Necessary to prevent options objects that only contain "region" and "account" keys
 * that evaluate to "undefined" from showing up in the rendered JSON.
 */
export class DropEmptyObjectAtTheEndOfAnArray implements cdk.IResolvable, cdk.IPostProcessor {
  public readonly creationStack: string[];

  constructor(private readonly value: any) {
    this.creationStack = cdk.captureStackTrace();
  }

  public resolve(context: cdk.IResolveContext) {
    context.registerPostProcessor(this);
    return context.resolve(this.value);
  }

  public postProcess(o: any, _context: cdk.IResolveContext): any {
    if (!Array.isArray(o)) { return o; }

    const lastEl = o[o.length - 1];

    if (typeof lastEl === 'object' && lastEl !== null && Object.keys(dropUndefined(lastEl)).length === 0) {
      return o.slice(0, o.length - 1);
    }

    return o;
  }
}
