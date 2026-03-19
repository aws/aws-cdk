import type * as cdk from 'aws-cdk-lib';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type { IComponent } from './component';
import type { IContainerRecipe } from './container-recipe';
import type { IImageRecipe } from './image-recipe';

/**
 * The parameter value for a component parameter
 */
export class ComponentParameterValue {
  /**
   * The value of the parameter as a string
   *
   * @param value The string value of the parameter
   */
  public static fromString(value: string): ComponentParameterValue {
    return new ComponentParameterValue([value]);
  }

  /**
   * The rendered parameter value
   */
  public readonly value: string[];

  protected constructor(value: string[]) {
    this.value = value;
  }
}

/**
 * Configuration details for a component, to include in a recipe
 */
export interface ComponentConfiguration {
  /**
   * The component to execute as part of the image build
   */
  readonly component: IComponent;

  /**
   * The parameters to use when executing the component
   *
   * @default - no parameters. if the component contains parameters, their default values will be used. otherwise, any
   *            required parameters that are not included will result in a build failure
   */
  readonly parameters?: { [name: string]: ComponentParameterValue };
}

/**
 * A base interface for EC2 Image Builder recipes
 */
export interface IRecipeBase extends cdk.IResource {
  /**
   * Grant custom actions to the given grantee for the recipe
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant read permissions to the given grantee for the recipe
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Indicates whether the recipe is a Container Recipe
   *
   * @internal
   */
  _isContainerRecipe(): this is IContainerRecipe;

  /**
   * Indicates whether the recipe is an Image Recipe
   *
   * @internal
   */
  _isImageRecipe(): this is IImageRecipe;
}
