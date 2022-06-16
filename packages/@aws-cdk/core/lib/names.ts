import { IConstruct, Node } from 'constructs';
import { unresolved } from './private/encoding';
import { makeUniqueResourceName } from './private/unique-resource-name';
import { makeUniqueId } from './private/uniqueid';
import { Stack } from './stack';


/**
 * Options for creating a unique resource name.
*/
export interface UniqueResourceNameOptions {

  /**
   * The maximum length of the unique resource name.
   *
   * @default - 256
   */
  readonly maxLength?: number;

  /**
   * The separator used between the path components.
   *
   * @default - none
   */
  readonly separator?: string;

  /**
   * Non-alphanumeric characters allowed in the unique resource name.
   *
   * @default - none
   */
  readonly allowedSpecialCharacters?: string;
}

/**
 * Functions for devising unique names for constructs. For example, those can be
 * used to allocate unique physical names for resources.
 */
export class Names {
  /**
   * Returns a CloudFormation-compatible unique identifier for a construct based
   * on its path. The identifier includes a human readable portion rendered
   * from the path components and a hash suffix. uniqueId is not unique if multiple
   * copies of the stack are deployed. Prefer using uniqueResourceName().
   *
   * @param construct The construct
   * @returns a unique id based on the construct path
   */
  public static uniqueId(construct: IConstruct): string {
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
  public static nodeUniqueId(node: Node): string {
    const components = node.scopes.slice(1).map(c => Node.of(c).id);
    return components.length > 0 ? makeUniqueId(components) : '';
  }

  /**
   * Returns a CloudFormation-compatible unique identifier for a construct based
   * on its path. This function finds the stackName of the parent stack (non-nested)
   * to the construct, and the ids of the components in the construct path.
   *
   * The user can define allowed special characters, a separator between the elements,
   * and the maximum length of the resource name. The name includes a human readable portion rendered
   * from the path components, with or without user defined separators, and a hash suffix.
   * If the resource name is longer than the maximum length, it is trimmed in the middle.
   *
   * @param construct The construct
   * @param options Options for defining the unique resource name
   * @returns a unique resource name based on the construct path
   */
  public static uniqueResourceName(construct: IConstruct, options: UniqueResourceNameOptions) {
    const node = Node.of(construct);

    const componentsPath = node.scopes.slice(node.scopes.indexOf(node.scopes.reverse()
      .find(component => (Stack.isStack(component) && !unresolved(component.stackName)))!,
    )).map(component => Stack.isStack(component) && !unresolved(component.stackName) ? component.stackName : Node.of(component).id);

    return makeUniqueResourceName(componentsPath, options);
  }

  private constructor() {}
}
