import { Construct } from 'constructs';
import { CfnElement } from './cfn-element';

/**
 * Construction properties for `CfnInclude`.
 *
 * @deprecated use the CfnInclude class from the cloudformation-include module instead
 */
export interface CfnIncludeProps {
  /**
   * The CloudFormation template to include in the stack (as is).
   */
  readonly template: object;
}

/**
 * Includes a CloudFormation template into a stack. All elements of the template will be merged into
 * the current stack, together with any elements created programmatically.
 *
 * @deprecated use the CfnInclude class from the cloudformation-include module instead
 */
export class CfnInclude extends CfnElement {
  /**
   * The included template.
   */
  public readonly template: object;

  /**
   * Creates an adopted template construct. The template will be incorporated into the stack as-is with no changes at all.
   * This means that logical IDs of entities within this template may conflict with logical IDs of entities that are part of the
   * stack.
   * @param scope The parent construct of this template
   * @param id The ID of this construct
   * @param props Initialization properties.
   */
  constructor(scope: Construct, id: string, props: CfnIncludeProps) {
    super(scope, id);
    this.template = props.template;
  }

  /**
   * @internal
   */
  public _toCloudFormation() {
    return this.template;
  }
}
