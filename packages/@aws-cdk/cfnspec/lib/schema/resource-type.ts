import { Documented, PrimitiveType } from './base-types';
import { Property } from './property';

export interface ResourceType extends Documented {
  /**
   * The attributes exposed by the resource type, if any.
   */
  Attributes?: { [name: string]: Attribute };
  /**
   * The properties accepted by the resource type, if any.
   */
  Properties?: { [name: string]: Property };
  /**
   * The ``Transform`` required by the resource type, if any.
   */
  RequiredTransform?: string;

  /**
   * What kind of value the 'Ref' operator refers to, if any.
   */
  RefKind?: string;
}

export type Attribute = PrimitiveAttribute | ListAttribute;

export interface PrimitiveAttribute {
  PrimitiveType: PrimitiveType;
}

export type ListAttribute = PrimitiveListAttribute | ComplexListAttribute;

export interface PrimitiveListAttribute {
  Type: 'List';
  PrimitiveItemType: PrimitiveType;
}

export interface ComplexListAttribute {
  Type: 'List';
  ItemType: string;
}

export function isPrimitiveAttribute(spec: Attribute): spec is PrimitiveAttribute {
  return !!(spec as PrimitiveAttribute).PrimitiveType;
}

export function isListAttribute(spec: Attribute): spec is ListAttribute {
  return (spec as ListAttribute).Type === 'List';
}

export function isPrimitiveListAttribute(spec: Attribute): spec is PrimitiveListAttribute {
  return isListAttribute(spec) && !!(spec as PrimitiveListAttribute).PrimitiveItemType;
}

export function isComplexListAttribute(spec: Attribute): spec is ComplexListAttribute {
  return isListAttribute(spec) && !!(spec as ComplexListAttribute).ItemType;
}

/**
 * Type declaration for special values of the "Ref" attribute represents.
 *
 * The attribute can take on more values than these, but these are treated specially.
 */
export enum SpecialRefKind {
  /**
   * No '.ref' member is generated for this type, because it doesn't have a meaningful value.
   */
  None = 'None',

  /**
   * The generated class will inherit from the built-in 'Arn' type.
   */
  Arn = 'Arn'
}
