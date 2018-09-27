import { Construct } from '../core/construct';
import { StackElement } from './stack';

export interface IncludeProps {
  /**
   * The CloudFormation template to include in the stack (as is).
   */
  template: object;
}

/**
 * Includes a CloudFormation template into a stack. All elements of the template will be merged into
 * the current stack, together with any elements created programmatically.
 */
export class Include extends StackElement {
  /**
   * The included template.
   */
  public readonly template: object;

  /**
   * Creates an adopted template construct. The template will be incorporated into the stack as-is with no changes at all.
   * This means that logical IDs of entities within this template may conflict with logical IDs of entities that are part of the
   * stack.
   * @param parent The parent construct of this template
   * @param id The ID of this construct
   * @param template The template to adopt.
   */
  constructor(parent: Construct, name: string, props: IncludeProps) {
    super(parent, name);
    this.template = props.template;
  }

  public toCloudFormation() {
    return this.template;
  }
}
