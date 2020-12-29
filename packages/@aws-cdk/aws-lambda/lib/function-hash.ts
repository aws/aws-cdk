import * as crypto from 'crypto';
import { CfnResource, Stack } from '@aws-cdk/core';
import { Function as LambdaFunction } from './function';

export function calculateFunctionHash(fn: LambdaFunction) {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;

  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());
  // config is of the shape: { Resources: { LogicalId: { Type: 'Function', Properties: { ... } }}}
  const resources = config.Resources;
  const logicalId = Object.keys(resources)[0];
  const resourceAttributes = resources[logicalId];
  // sort the keys, so that the order in the string returned from JSON.stringify() is stable
  // as new properties are added to the CfnFunction class
  const stringifiedConfig = JSON.stringify(config, [
    'Resources', logicalId,
    // 'Type' and 'Properties' are before 'DependsOn' today, so leave it that way
    'Type', 'Properties',
    // sort the resource attributes
    // 'Environment' winds up at the end today, so preserve that
    ...allKeysRecursively(resourceAttributes, ['Environment']).sort(),
    'Environment',
    // for legacy reasons, we do _not_ sort the env variable keys
    ...allKeysRecursively(resourceAttributes?.Properties?.Environment),
  ]);

  const hash = crypto.createHash('md5');
  hash.update(stringifiedConfig);
  return hash.digest('hex');
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}

function allKeysRecursively(input: any, blacklist: string[] = []): string[] {
  if (typeof(input) !== 'object') {
    return [];
  }
  const ret = new Array<string>();
  for (const [key, val] of Object.entries(input)) {
    if (val != null && blacklist.indexOf(key) === -1) {
      ret.push(key);
      ret.push(...allKeysRecursively(val, blacklist));
    }
  }
  return ret;
}
