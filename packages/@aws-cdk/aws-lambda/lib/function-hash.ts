import * as crypto from 'crypto';
import { CfnResource, Stack } from '@aws-cdk/core';
import { Function } from './function';
import { sortedStringify } from './private/sort';

export const ENV_SALT = '4b2bff42-e517-41d1-9b5f-92aacf41842b';

/*
 * The list of properties found in CfnFunction (or AWS::Lambda::Function).
 * They are classified as "locked" to a Function Version or not.
 * When a property is locked, any change to that property will not take effect on previously created Versions.
 * Instead, a new Version must be generated for the change to take effect.
 * Similarly, if a property that's not locked to a Version is modified, a new Version
 * must not be generated.
 *
 * Adding a new property to this list - If the property is part of the UpdateFunctionConfiguration
 * API, then it must be classified as true, otherwise false.
 * See https://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html
 */
const VERSION_PROPS_CLASSIFICATION: { [key: string]: boolean } = {
  // locked to the version
  Code: true,
  DeadLetterConfig: true,
  Description: true,
  Environment: true,
  FileSystemConfigs: true,
  FunctionName: true,
  Handler: true,
  KmsKeyArn: true,
  Layers: true,
  MemorySize: true,
  Role: true,
  Runtime: true,
  Timeout: true,
  TracingConfig: true,
  VpcConfig: true,

  // not locked to the version
  CodeSigningConfigArn: false,
  ReservedConcurrentExecutions: false,
  Tags: false,
};

export interface CalculateFunctionHashOptions {
  hashAlgorithm: 'v1' | 'v2';
  function: Function;
  additionalVersionPropsClassification?: { [key: string]: boolean };
}

export function calculateFunctionHash(options: CalculateFunctionHashOptions) {
  const stack = Stack.of(options.function);

  const functionResource = options.function.node.defaultChild as CfnResource;

  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());
  const hash = crypto.createHash('md5');

  if (options.hashAlgorithm === 'v2') {
    hash.update(sortedStringify(usefulKeys(config, options.additionalVersionPropsClassification)));
  } else {
    hash.update(JSON.stringify(config));
  }

  return hash.digest('hex');
}

function usefulKeys(cfnObject: any, additionalClassification?: { [key: string]: boolean }): any {
  const keys = Object.keys(cfnObject.Resources);
  if (keys.length !== 1) {
    throw new Error(`Expected one rendered CloudFormation resource but found ${keys.length}`);
  }
  const props = cfnObject.Resources[keys[0]].Properties;

  const classification = {
    ...VERSION_PROPS_CLASSIFICATION,
    ...additionalClassification,
  };

  const unclassified = Object.keys(props).filter(p => !Object.keys(classification).includes(p));
  if (unclassified.length > 0) {
    throw new Error(`Keys [${unclassified}] are unclassified on whether they are version locked.`
      + 'Use "additionalVersionPropsClassification" property to classify them.');
  }
  const notVersionLocked = Object.entries(classification).filter(e => !e[1]).map(e => e[0]);
  notVersionLocked.forEach(p => delete props[p]);
  return props;
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}