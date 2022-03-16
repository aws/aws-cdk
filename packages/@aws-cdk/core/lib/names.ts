import { Construct, Node } from 'constructs';
import { ConstructNode } from './construct-compat';
import { unresolved } from './private/encoding';
import { makeUniqueId } from './private/uniqueid';
import { Stack } from './stack';

/**
 * Functions for devising unique names for constructs. For example, those can be
 * used to allocate unique physical names for resources.
 */
export class Names {
  /**
   * Returns a CloudFormation-compatible unique identifier for a construct based
   * on its path. The identifier includes a human readable portion rendered
   * from the path components and a hash suffix.
   *
   * @param construct The construct
   * @returns a unique id based on the construct path
   */
  public static uniqueId(construct: Construct): string {
    const node = Node.of(construct);
    const components = node.scopes.slice(1).map(c => Node.of(c).id);
    return components.length > 0 ? makeUniqueId(components) : '';
  }

  /**
   * Returns a CloudFormation-compatible unique identifier for a construct based
   * on its path. The identifier includes a human readable portion rendered
   * from the path components and a hash suffix.
   *
   * TODO (v2): replace with API to use `constructs.Node`.
   *
   * @param node The construct node
   * @returns a unique id based on the construct path
   */
  public static nodeUniqueId(node: ConstructNode): string {
    const components = node.scopes.slice(1).map(c => c.node.id);
    return components.length > 0 ? makeUniqueId(components) : '';
  }

  /**
   * Returns a CloudFormation-compatible unique identifier for a construct based
   * on its path. If the node is a Stack, the stack name is used for that path component instead.
   * The identifier includes a human readable portion rendered from the path components and a hash suffix.
   * @param construct The construct
   * @param maxUniqueIdLength The maximum length of the unique id
   * @returns a unique id based on the construct path
   */
  public static uniqueIdWithStackName(construct: Construct, maxUniqueIdLength: number = 256): string {
    const node = Node.of(construct);
    const components = node.scopes.slice(1).map(component => {
      if (Stack.isStack(component) && !unresolved(component.stackName)) {
        return component.stackName;
      }
      return Node.of(component).id;
    });
    const uniqueId = components.length > 0 ? makeUniqueId(components) : '';
    const startIndex = Math.max(0, uniqueId.length - (maxUniqueIdLength));
    return uniqueId.substring(startIndex);
  }

  private constructor() {}
}
