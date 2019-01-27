import jsiiReflect = require('jsii-reflect');
import { toSchema } from './jsii2schema';

export interface ConstructAndProps {
  constructClass: jsiiReflect.ClassType;
  propsTypeRef: jsiiReflect.TypeReference;
}

export function resourceName(constructClass: jsiiReflect.ClassType) {
  return constructClass.fqn;
}

export function isCfnResource(resourceType: string) {
  return resourceType.includes('::');
}

export interface ClassName {
  module: string;
  className: string;
}

export function resourceSchema(construct: ConstructAndProps) {
  return {
    additionalProperties: false,
    properties: {
      Properties: toSchema(construct.propsTypeRef),
      Type: {
        enum: [ resourceName(construct.constructClass) ],
        type: "string"
      }
    }
  };
}
