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