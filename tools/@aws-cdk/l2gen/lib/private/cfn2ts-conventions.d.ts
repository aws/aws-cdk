import { schema } from '@aws-cdk/cfnspec';
import { IType } from '../type';
export declare function l1ClassName(cloudFormationResourceType: string): string;
export declare function l1PropertyName(specPropertyName: string): string;
export declare function isTagsProperty(prop: [string, schema.Property]): boolean;
export declare function genTypeForProperty(typeName: string, ...propertyPath: string[]): IType;
export declare function l1ResourceType(cloudFormationResourceType: string): IType;
export declare function l1PropertyType(cloudFormationResourceType: string, propTypeName: string): IType;
export declare function resourceProperties(typeName: string): Generator<readonly [string, schema.Property], void, unknown>;
