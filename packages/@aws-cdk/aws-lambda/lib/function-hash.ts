import * as crypto from 'crypto';
import { CfnResource, Stack } from '@aws-cdk/core';
import { Function as LambdaFunction } from './function';
import { sortedStringify } from './private/sort';

export function calculateFunctionHash(fn: LambdaFunction) {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;

  // render the cloudformation resource from this function
  const cfn = stack.resolve((functionResource as any)._toCloudFormation());
  const config = usefulKeys(cfn);

  const hash = crypto.createHash('md5');
  hash.update(sortedStringify(config));

  return hash.digest('hex');
}

function usefulKeys(cfnObject: any): any {
  const keysToRemove = ['ReservedConcurrentExecutions', 'Tags'];
  const keys = Object.keys(cfnObject.Resources);
  if (keys.length !== 1) {
    throw new Error(`Expected one rendered CloudFormation resource but found ${keys.length}`);
  }
  const props = cfnObject.Resources[keys[0]].Properties;
  keysToRemove.forEach(k => delete props[k]);
  return props;
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}