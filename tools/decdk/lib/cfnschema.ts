import jsiiReflect = require('jsii-reflect');
import { toSchema } from './jsii2schema';

export interface ConstructAndProps {
  constructClass: jsiiReflect.ClassType;
  propsTypeRef: jsiiReflect.TypeReference;
}

export function resourceName(constructClass: jsiiReflect.ClassType) {
  return constructClass.fqn;
}

export function parseResourceName(cfnName: string): ClassName | undefined {
  if (cfnName.includes('::')) { return undefined; }

  const [ module, ...className ] = cfnName.split('.');

  return {
    module,
    className: className.join('.')
  };
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