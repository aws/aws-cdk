import { Documented } from './base-types';
import { Property } from './property';
import { ResourceType } from './resource-type';

/**
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification-format.html
 */
export interface Specification {
  /**
   * A fingerprint of the template, that can be used to determine whether the template has changed.
   */
  Fingerprint: string;
  /**
   * For resources that have properties within a property (also known as subproperties), a list of subproperty
   * specifications, such as which properties are required, the type of allowed value for each property, and their
   * update behavior.
   */
  PropertyTypes: { [name: string]: PropertyType };
  /**
   * The list of resources and information about each resource's properties, such as it's property names, which
   * properties are required, and their update behavior.
   */
  ResourceTypes: { [name: string]: ResourceType };
}

export interface PropertyType extends Documented {
  /** A list of property specifications for the subproperty type */
  Properties: { [name: string]: Property };
}
