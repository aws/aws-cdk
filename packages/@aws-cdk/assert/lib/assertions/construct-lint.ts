import { IConstruct, Resource } from '@aws-cdk/core';
import { Assertion } from '../assertion';
import { StackInspector } from '../inspector';

/**
 * Assert if a stack contains constructs that don't match the linter.
 * @see `ConstructLintStackInspector` to see the various rule checks.
 */
export function haveNoConstructLints(): Assertion<StackInspector> {
  return new ConstructLintStackInspector();
}

/**
 * A StackInspector that checks if there are constructs don't meet expectations.
 * The list of expectations are
 * - No {@link Resource} construct has a truthy {@link ConstructNode.defaultChild | defaultChild} value.
 */
export class ConstructLintStackInspector extends Assertion<StackInspector> {

  public get description(): string {
    return 'inspect if constructs in a stack meet expectations';
  }

  public assertOrThrow(inspector: StackInspector) {
    if (!this.assertUsing(inspector)) {
      throw new Error('linter found constructs with issues');
    }
  }

  public assertUsing(inspector: StackInspector): boolean {
    if (!inspector.cdkStack) {
      throw new Error('Cannot run this assertion without the original CDK stack');
    }
    const stack = inspector.cdkStack;

    const ret = stack.node.findAll().reduce((agg, construct) => {
      const defaultChild = this.assertDefaultChild(construct);
      if (!defaultChild) {
        process.stdout.write(`defaultChild is not set correctly for ${construct}`);
      }
      // Keep agg as second operand so it doesn't short circuit checks.
      return defaultChild && agg;
    }, true);
    return ret;
  }

  private assertDefaultChild(construct: IConstruct): boolean {
    if (construct instanceof Resource) {
      try {
        return (construct.node.defaultChild !== undefined && construct.node.defaultChild !== null);
      } catch (e) {
        return false;
      }
    } else {
      // if it's not a Resource, don't check and don't fail.
      return true;
    }
  }
}