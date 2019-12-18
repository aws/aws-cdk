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

/**
 * Describing a user-defined property type
 *
 * Even though looks weird, the CloudFormation spec does not make a distinction between properties and
 * property TYPES: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification-format.html
 *
 * That means that a "type" comes with fields such as "Required", "UpdateType Mutable", etc
 * (even though those only make sense for a particular PROPERTY of that type). They only seem to occur
 * on non-Record properties though.
 *
 * In practice, even though aliases for Primitive properties are allowed, only RecordProperties
 * and CollectionProperties seem to actually occur in the spec in the "types" section.
 */
export type PropertyType = RecordProperty | Property;

/**
 * The specifications of a property object type.
 */
export interface RecordProperty extends Documented {
  /**
   * The properties of the Property type.
   */
  Properties: { [name: string]: Property };
}

/**
 * Whether the given type definition is a Record property
 */
export function isRecordType(propertyType: PropertyType): propertyType is RecordProperty {
  return 'Properties' in propertyType;
}
