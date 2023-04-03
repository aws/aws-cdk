import { CfnResource } from './cfn-resource';
import { Stack } from './stack';
export type Element = CfnResource | Stack;
/**
 * Adds a dependency between two resources or stacks, across stack and nested
 * stack boundaries.
 *
 * The algorithm consists of:
 * - Try to find the deepest common stack between the two elements
 * - If there isn't a common stack, it means the elements belong to two
 *   disjoined stack-trees and therefore we apply the dependency at the
 *   assembly/app level between the two top-level stacks.
 * - If we did find a common stack, we apply the dependency as a CloudFormation
 *   "DependsOn" between the resources that "represent" our source and target
 *   either directly or through the AWS::CloudFormation::Stack resources that
 *   "lead" to them.
 *
 * @param source The source resource/stack (the dependent)
 * @param target The target resource/stack (the dependency)
 */
export declare function addDependency(source: Element, target: Element, reason?: string): void;
/**
 * Removes a dependency between two resources or stacks, across stack and nested
 * stack boundaries.
 *
 * The algorithm consists of:
 * - Try to find the deepest common stack between the two elements
 * - If there isn't a common stack, it means the elements belong to two
 *   disjoined stack-trees and therefore we applied the dependency at the
 *   assembly/app level between the two top-level stacks; remove it there.
 * - If we did find a common stack, we applied the dependency as a CloudFormation
 *   "DependsOn" between the resources that "represent" our source and target
 *   either directly or through the AWS::CloudFormation::Stack resources that
 *   "lead" to them and must remove it there.
 *
 * @param source The source resource/stack (the dependent)
 * @param target The target resource/stack (the dependency)
 * @param reason Optional description to associate with the dependency for
 * diagnostics
 */
export declare function removeDependency(source: Element, target: Element): void;
/**
 * Get a list of all resource-to-resource dependencies assembled from this Element, Stack or assembly-dependencies
 * @param source The source resource/stack (the dependent)
 */
export declare function obtainDependencies(source: Element): Element[];
