import { Documented, PrimitiveType } from './base-types';
import { isTagProperty, isTagPropertyAutoScalingGroup, isTagPropertyJson,
  isTagPropertyName, isTagPropertyStandard, isTagPropertyStringMap, Property,
  TagProperty, TagPropertyAutoScalingGroup, TagPropertyJson, TagPropertyStandard,
  TagPropertyStringMap } from './property';

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

  /**
   * During a stack update, what kind of additional scrutiny changes to this resource should be subjected to
   *
   * @default None
   */
  ScrutinyType?: ResourceScrutinyType;
}

export interface TaggableResource extends ResourceType {
  Properties: {
    Tags: TagProperty;
    UserPoolTags: TagProperty;
    [name: string]: Property;
  }
}

export interface TaggableResourceStandard extends TaggableResource {
  Properties: {
    Tags: TagPropertyStandard;
    UserPoolTags: TagPropertyStandard;
    [name: string]: Property;
  }
}

export interface TaggableResourceAutoScalingGroup extends TaggableResource {
  Properties: {
    Tags: TagPropertyAutoScalingGroup;
    UserPoolTags: TagPropertyAutoScalingGroup;
    [name: string]: Property;
  }
}

export interface TaggableResourceJson extends TaggableResource {
  Properties: {
    Tags: TagPropertyJson;
    UserPoolTags: TagPropertyJson;
    [name: string]: Property;
  }
}

export interface TaggableResourceStringMap extends TaggableResource {
  Properties: {
    Tags: TagPropertyStringMap;
    UserPoolTags: TagPropertyStringMap;
    [name: string]: Property;
  }
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

/**
 * Determine if the resource supports tags
 *
 * This function combined with isTagProperty determines if the `cdk.TagManager`
 * and `cdk.TaggableResource` can process these tags. If not, standard code
 * generation of properties will be used.
 */
export function isTaggableResource(spec: ResourceType): spec is TaggableResource {
  if (spec.Properties === undefined) {
    return false;
  }
  for (const key of Object.keys(spec.Properties)) {
    if (isTagPropertyName(key) && isTagProperty(spec.Properties[key])) {
      return true;
    }
  }
  return false;
}

export function isTaggableResourceStandard(resource: TaggableResource): resource is TaggableResourceStandard {
  return isTagPropertyStandard(tagProperty(resource));
}

export function isTaggableResourceAutoScalingGroup(resource: TaggableResource): resource is TaggableResourceAutoScalingGroup {
  return isTagPropertyAutoScalingGroup(tagProperty(resource));
}

export function isTaggableResourceJson(resource: TaggableResource): resource is TaggableResourceJson {
  return isTagPropertyJson(tagProperty(resource));
}

export function isTaggableResourceStringMap(resource: TaggableResource): resource is TaggableResourceStringMap {
  return isTagPropertyStringMap(tagProperty(resource));
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

export enum ResourceScrutinyType {
  /**
   * No additional scrutiny
   */
  None = 'None',

  /**
   * An externally attached policy document to a resource
   *
   * (Common for SQS, SNS, S3, ...)
   */
  ResourcePolicyResource = 'ResourcePolicyResource',

  /**
   * This is an IAM policy on an identity resource
   *
   * (Basically saying: this is AWS::IAM::Policy)
   */
  IdentityPolicyResource = 'IdentityPolicyResource',

  /**
   * This is a Lambda Permission policy
   */
  LambdaPermission = 'LambdaPermission',

  /**
   * An ingress rule object
   */
  IngressRuleResource = 'IngressRuleResource',

  /**
   * A set of egress rules
   */
  EgressRuleResource = 'EgressRuleResource',
}

export function isResourceScrutinyType(str: string): str is ResourceScrutinyType {
  return (ResourceScrutinyType as any)[str] !== undefined;
}

function tagProperty(spec: TaggableResource): Property {
  return spec.Properties.Tags || spec.Properties.UserPoolTags;
}
