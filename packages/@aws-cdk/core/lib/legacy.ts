import { Construct, Node } from 'constructs';
import { ConstructNode } from './construct-compat';
import { makeUniqueId } from './private/uniqueid';

/**
 * Legacy functions required to maintain backwards compatibility.
 */
export class Legacy {
  /**
   * THIS IS A DEPRECATED METHOD. USE `node.addr` INSTEAD.
   *
   * Implements the legacy `uniqueId`algorithm used to calculate a unique ID for
   * constructs in the tree before `node.addr` was introduced. This cannot be
   * fully deprecated since it will cause breaking changes.
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
   * THIS IS A DEPRECATED METHOD. USE `node.addr` INSTEAD.
   *
   * Implements the legacy `uniqueId`algorithm used to calculate a unique ID for
   * constructs in the tree before `node.addr` was introduced. This cannot be
   * fully deprecated since it will cause breaking changes.
   *
   * TODO (v2): replace with API to use `constructs.Node`.
   *
   * @param construct The construct
   * @returns a unique id based on the construct path
   */
  public static nodeUniqueId(node: ConstructNode): string {
    const components = node.scopes.slice(1).map(c => c.node.id);
    return components.length > 0 ? makeUniqueId(components) : '';
  }

  private constructor() {};
}
