import jsiiReflect = require('jsii-reflect');
import { toSchema } from './jsii2schema';

export interface ConstructAndProps {
  constructClass: jsiiReflect.ClassType;
  propsTypeRef: jsiiReflect.TypeReference;
}

export function resourceName(constructClass: jsiiReflect.ClassType) {
  const [, packageName] = constructClass.assembly.name.split('/'); // @aws-cdk/aws-ecs
  const [, serviceName] = packageName.split('-');

  return `CDK::${serviceName}::${constructClass.name}`;
}

export function parseResourceName(cfnName: string): ClassName | undefined {
  if (!cfnName.startsWith('CDK::')) { return undefined; }
  const parts = cfnName.split('::');

  return {
    module: `@aws-cdk/aws-${parts[1]}`,
    className: parts[2]
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