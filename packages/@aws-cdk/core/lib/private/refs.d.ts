import { IConstruct } from 'constructs';
import { Reference } from '../reference';
import { Stack } from '../stack';
/**
 * This is called from the App level to resolve all references defined. Each
 * reference is resolved based on it's consumption context.
 */
export declare function resolveReferences(scope: IConstruct): void;
export declare function getExportable(stack: Stack, reference: Reference): Reference;
/**
 * Translate a Reference into a nested stack into a value in the parent stack
 *
 * Will create Outputs along the chain of Nested Stacks, and return the final `{ Fn::GetAtt }`.
 */
export declare function referenceNestedStackValueInParent(reference: Reference, targetStack: Stack): Reference;
