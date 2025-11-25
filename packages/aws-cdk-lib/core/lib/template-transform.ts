import { IConstruct } from 'constructs';
import { Stack } from './stack';

const TEMPLATE_TRANSFORMS_SYMBOL = Symbol.for('@aws-cdk/core.TemplateTransforms');

/**
 * Represents a template transform that can inspect or modify
 * the final CloudFormation template during synthesis.
 *
 * Implement this interface as a class with a `transformTemplate` method:
 *
 * @example
 * class MyTransform implements ITemplateTransform {
 *   public transformTemplate(stack: Stack, template: any) {
 *     // Inspect or modify template here
 *     template.Metadata = { CustomKey: 'CustomValue' };
 *   }
 * }
 * app.addTemplateTransform(new MyTransform());
 */
export interface ITemplateTransform {
  /**
   * Called for each stack during synthesis, after the CloudFormation
   * template has been fully resolved.
   *
   * The transform may mutate the template in place, or return a new
   * template object. If the transform returns `undefined` or `void`,
   * the original (possibly mutated) template is used.
   *
   * If the transform throws an error, synthesis will fail.
   *
   * @param stack The stack being synthesized. Use `stack.nested` to
   *              check if this is a nested stack.
   * @param template The fully resolved CloudFormation template object.
   * @returns A new template object, or `undefined`/`void` to use the
   *          original (possibly mutated) template.
   */
  transformTemplate(stack: Stack, template: any): any | void;
}

/**
 * Manages template transforms registered on an App.
 *
 * Template transforms are invoked during synthesis after token resolution,
 * allowing inspection or modification of the final CloudFormation template
 * before it is written to disk.
 */
export class TemplateTransforms {
  /**
   * Returns true if any template transforms have been registered on the
   * given scope's root construct.
   *
   * This method does not create the TemplateTransforms singleton if it
   * doesn't exist, making it suitable for checking before invoking transforms.
   *
   * @param scope The scope to check for transforms.
   * @returns true if transforms have been registered, false otherwise.
   */
  public static hasAny(scope: IConstruct): boolean {
    const root = scope.node.root;
    const transforms = (root as any)[TEMPLATE_TRANSFORMS_SYMBOL] as TemplateTransforms | undefined;
    return transforms !== undefined && transforms._transforms.length > 0;
  }

  /**
   * Returns the `TemplateTransforms` object associated with a construct scope.
   *
   * Template transforms are typically registered on the App, and apply to
   * all stacks (including nested stacks) within that App.
   *
   * @param scope The scope to get transforms for. Transforms are looked up
   *              from the root of the construct tree.
   */
  public static of(scope: IConstruct): TemplateTransforms {
    const root = scope.node.root;
    let transforms = (root as any)[TEMPLATE_TRANSFORMS_SYMBOL];
    if (!transforms) {
      transforms = new TemplateTransforms();

      Object.defineProperty(root, TEMPLATE_TRANSFORMS_SYMBOL, {
        value: transforms,
        configurable: false,
        enumerable: false,
      });
    }
    return transforms;
  }

  private readonly _transforms: ITemplateTransform[] = [];

  private constructor() {}

  /**
   * Adds a template transform.
   *
   * Transforms are invoked in the order they were added (first-added, first-run).
   *
   * @param transform The transform to add.
   */
  public add(transform: ITemplateTransform): void {
    this._transforms.push(transform);
  }

  /**
   * The list of registered template transforms, in registration order.
   */
  public get all(): ITemplateTransform[] {
    return [...this._transforms];
  }
}
