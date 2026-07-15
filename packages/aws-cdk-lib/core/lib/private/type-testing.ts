/**
 * Type testing routines for constructs. In a separate function because otherwise they will lead to circular (runtime) dependencies between core files.
 *
 * Circular `import type` is fine, circular regular `import` is not.
 */
import type { NestedStack } from '../nested-stack';
import type { Stack } from '../stack';
import type { Stage } from '../stage';

const STACK_SYMBOL = Symbol.for('@aws-cdk/core.Stack');
const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');
const NESTED_STACK_SYMBOL = Symbol.for('@aws-cdk/core.NestedStack');

export function isMarkedAsStack(construct: any): construct is Stack {
  return STACK_SYMBOL in construct;
}

export function markAsStack(stack: Stack) {
  Object.defineProperty(stack, STACK_SYMBOL, { value: true });
}

export function isMarkedAsStage(construct: any): construct is Stage {
  return STAGE_SYMBOL in construct;
}

export function markAsStage(stage: Stage) {
  Object.defineProperty(stage, STAGE_SYMBOL, { value: true });
}

export function isMarkedAsNestedStack(construct: any): construct is NestedStack {
  return NESTED_STACK_SYMBOL in construct;
}

export function markAsNestedStack(stack: NestedStack) {
  Object.defineProperty(stack, NESTED_STACK_SYMBOL, { value: true });
}
