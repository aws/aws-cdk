import { CfnCondition } from './cfn-condition';
import { CfnElement } from './cfn-element';
import { CfnResource } from './cfn-resource';

/**
 * An interface that represents callbacks into a CloudFormation template.
 * Used by the fromCloudFormation methods in the generated L1 classes.
 *
 * @experimental
 */
export interface ICfnFinder {
  /**
   * Return the Condition with the given name from the template.
   * If there is no Condition with that name in the template,
   * returns undefined.
   */
  findCondition(conditionName: string): CfnCondition | undefined;

  /**
   * Returns the element referenced using a Ref expression with the given name.
   * If there is no element with this name in the template,
   * return undefined.
   */
  findRefTarget(elementName: string): CfnElement | undefined;

  /**
   * Returns the resource with the given logical ID in the template.
   * If a resource with that logical ID was not found in the template,
   * returns undefined.
   */
  findResource(logicalId: string): CfnResource | undefined;
}

/**
 * The interface used as the last argument to the fromCloudFormation
 * static method of the generated L1 classes.
 *
 * @experimental
 */
export interface FromCloudFormationOptions {
  /**
   * The finder interface used to resolve references across the template.
   */
  readonly finder: ICfnFinder;
}
