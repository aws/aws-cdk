import * as cdk from '@aws-cdk/core';
import * as sfn from '../../lib';
/**
 * Renders a state machine definition
 *
 * @param stack stack for the state machine
 * @param definition state machine definition
 */
export declare function render(stack: cdk.Stack, definition: sfn.IChainable): any;
export declare function renderGraph(definition: sfn.IChainable): any;
