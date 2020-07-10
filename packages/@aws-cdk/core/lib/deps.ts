import { CfnResource } from './cfn-resource';
import { Stack } from './stack';
import { Stage } from './stage';
import { findLastCommonElement, pathToTopLevelStack as pathToRoot } from './util';

type Element = CfnResource | Stack;

/**
 * Adds a dependency between two resources or stacks, across stack and nested
 * stack boundaries.
 *
 * The algorithm consists of:
 * - Try to find the deepest common stack between the two elements
 * - If there isn't a common stack, it means the elements belong to two
 *   disjoined stack-trees and therefore we apply the dependency at the
 *   assembly/app level between the two topl-level stacks.
 * - If we did find a common stack, we apply the dependency as a CloudFormation
 *   "DependsOn" between the resources that "represent" our source and target
 *   either directly or through the AWS::CloudFormation::Stack resources that
 *   "lead" to them.
 *
 * @param source The source resource/stack (the depedent)
 * @param target The target resource/stack (the dependency)
 * @param reason Optional resource to associate with the dependency for
 * diagnostics
 */
export function addDependency<T extends Element>(source: T, target: T, reason?: string) {
  if (source === target) {
    return;
  }

  const sourceStack = Stack.of(source);
  const targetStack = Stack.of(target);

  const sourceStage = Stage.of(sourceStack);
  const targetStage = Stage.of(targetStack);
  if (sourceStage !== targetStage) {
    // eslint-disable-next-line max-len
    throw new Error(`You cannot add a dependency from '${source.node.path}' (in ${describeStage(sourceStage)}) to '${target.node.path}' (in ${describeStage(targetStage)}): dependency cannot cross stage boundaries`);
  }

  // find the deepest common stack between the two elements
  const sourcePath = pathToRoot(sourceStack);
  const targetPath = pathToRoot(targetStack);
  const commonStack = findLastCommonElement(sourcePath, targetPath);

  // if there is no common stack, then define a assembly-level dependency
  // between the two top-level stacks
  if (!commonStack) {
    const topLevelSource = sourcePath[0]; // first path element is the top-level stack
    const topLevelTarget = targetPath[0];
    topLevelSource._addAssemblyDependency(topLevelTarget, reason);
    return;
  }

  // assertion: at this point if source and target are stacks, both are nested stacks.
  // since we have a common stack, it is impossible that both are top-level
  // stacks, so let's examine the two cases where one of them is top-level and
  // the other is nested.

  // case 1 - source is top-level and target is nested: this implies that
  // `target` is a direct or indirect nested stack of `source`, and an explicit
  // dependency is not required because nested stacks will always be deployed
  // before their parents.
  if (commonStack === source) {
    return;
  }

  // case 2 - source is nested and target is top-level: this implies that
  // `source` is a direct or indirect nested stack of `target`, and this is not
  // possible (nested stacks cannot depend on their parents).
  if (commonStack === target) {
    throw new Error(`Nested stack '${sourceStack.node.path}' cannot depend on a parent stack '${targetStack.node.path}': ${reason}`);
  }

  // we have a common stack from which we can reach both `source` and `target`
  // now we need to find two resources which are defined directly in this stack
  // and which can "lead us" to the source/target.
  const sourceResource = resourceInCommonStackFor(source);
  const targetResource = resourceInCommonStackFor(target);
  sourceResource._addResourceDependency(targetResource);

  function resourceInCommonStackFor(element: CfnResource | Stack): CfnResource {
    const resource = Stack.isStack(element) ? element.nestedStackResource : element;
    if (!resource) {
      throw new Error('assertion failure'); // see "assertion" above
    }

    const resourceStack = Stack.of(resource);

    // we reached a resource defined in the common stack
    if (commonStack === resourceStack) {
      return resource;
    }

    return resourceInCommonStackFor(resourceStack);
  }
}

/**
 * Return a string representation of the given assembler, for use in error messages
 */
function describeStage(assembly: Stage | undefined): string {
  if (!assembly) { return 'an unrooted construct tree'; }
  if (!assembly.parentStage) { return 'the App'; }
  return `Stage '${assembly.node.path}'`;
}
