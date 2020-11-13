import * as cdk from '@aws-cdk/core';
import * as sfn from '../../lib';

/**
 * Renders a state machine definition
 *
 * @param stack stack for the state machine
 * @param definition state machine definition
 */
export function render(stack: cdk.Stack, definition: sfn.IChainable) {
  return stack.resolve(new sfn.StateGraph(definition.startState, 'Test Graph').toGraphJson());
}