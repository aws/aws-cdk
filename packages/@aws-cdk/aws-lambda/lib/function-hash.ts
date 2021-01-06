import * as crypto from 'crypto';
import { CfnResource, Stack } from '@aws-cdk/core';
import { Function as LambdaFunction } from './function';

export function calculateFunctionHash(fn: LambdaFunction) {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;

  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());
  sortProperties(config);
  const stringifiedConfig = JSON.stringify(config);

  const hash = crypto.createHash('md5');
  hash.update(stringifiedConfig);
  return hash.digest('hex');
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}

function sortProperties(templateObject: any): void {
  // templateObject is of the shape: { Resources: { LogicalId: { Type: 'Function', Properties: { ... } }}}
  const resources = templateObject.Resources;
  const logicalId = Object.keys(resources)[0];
  const properties = resources[logicalId].Properties;
  const ret: any = {};
  // We take all required properties in the order that they were historically,
  // to make sure the hash we calculate is stable.
  // There cannot be more required properties added in the future,
  // as that would be a backwards-incompatible change.
  const requiredProperties = ['Code', 'Handler', 'Role', 'Runtime'];
  for (const requiredProperty of requiredProperties) {
    ret[requiredProperty] = properties[requiredProperty];
  }
  // then, add all of the non-required properties,
  // in the original order
  for (const property of Object.keys(properties)) {
    if (requiredProperties.indexOf(property) === -1) {
      ret[property] = properties[property];
    }
  }
  templateObject.Resources[logicalId].Properties = ret;
}
