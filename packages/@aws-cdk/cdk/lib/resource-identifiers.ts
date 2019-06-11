import { ArnComponents } from './arn';
import { CrossEnvironmentPhysicalArnToken, CrossEnvironmentPhysicalNameToken } from './private/cross-environment-token';
import { IResource } from './resource';
import { Token } from './token';

/**
 * Construction properties for {@link ResourceIdentifiers}.
 */
export interface ResourceIdentifiersProps {
  /**
   * The ARN of the resource when referenced from the same stack.
   */
  readonly arn: string;

  /**
   * The name of the resource when referenced from the same stack.
   */
  readonly name: string;

  /**
   * The recipe for creating an ARN from a name for this resource.
   */
  readonly arnComponents: ArnComponents;
}

/**
 * The identifiers (name and ARN) for a given L2.
 * These should be only used inside the Construct Library implementation.
 */
export class ResourceIdentifiers {
  public readonly arn: string;
  public readonly name: string;

  constructor(resource: IResource, props: ResourceIdentifiersProps) {
    this.arn = Token.asString(new CrossEnvironmentPhysicalArnToken(
      props.arn,
      props.arnComponents,
      resource,
    ), { displayHint: 'Arn' });

    this.name = Token.asString(new CrossEnvironmentPhysicalNameToken(
      props.name,
      resource,
    ), { displayHint: 'Name' });
  }
}
