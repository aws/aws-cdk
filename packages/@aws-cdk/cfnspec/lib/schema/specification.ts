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
  PropertyTypes: { [name: string]: PropertyBag | Property };
  /**
   * The list of resources and information about each resource's properties, such as it's property names, which
   * properties are required, and their update behavior.
   */
  ResourceTypes: { [name: string]: ResourceType };
}

/**
 * The specifications of a property object type.
 */
export interface PropertyBag extends Documented {
  /**
   * The properties of the Property type.
   */
  Properties: { [name: string]: Property };
}

export function isPropertyBag(propertyType: PropertyBag | Property): propertyType is PropertyBag {
  return 'Properties' in propertyType;
}
