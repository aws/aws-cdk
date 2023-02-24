import { CfnResource, FeatureFlags, Stack, Token } from '@aws-cdk/core';
import { md5hash } from '@aws-cdk/core/lib/helpers-internal';
import { LAMBDA_RECOGNIZE_LAYER_VERSION, LAMBDA_RECOGNIZE_VERSION_PROPS } from '@aws-cdk/cx-api';
import { Function as LambdaFunction } from './function';
import { ILayerVersion } from './layers';

export function calculateFunctionHash(fn: LambdaFunction, additional: string = '') {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;

  // render the cloudformation resource from this function
  const config = stack.resolve((functionResource as any)._toCloudFormation());
  // config is of the shape: { Resources: { LogicalId: { Type: 'Function', Properties: { ... } }}}
  const resources = config.Resources;
  const resourceKeys = Object.keys(resources);
  if (resourceKeys.length !== 1) {
    throw new Error(`Expected one rendered CloudFormation resource but found ${resourceKeys.length}`);
  }
  const logicalId = resourceKeys[0];
  const properties = resources[logicalId].Properties;

  let stringifiedConfig;
  if (FeatureFlags.of(fn).isEnabled(LAMBDA_RECOGNIZE_VERSION_PROPS)) {
    const updatedProps = sortProperties(filterUsefulKeys(properties));
    stringifiedConfig = JSON.stringify(updatedProps);
  } else {
    const sorted = sortProperties(properties);
    config.Resources[logicalId].Properties = sorted;
    stringifiedConfig = JSON.stringify(config);
  }

  if (FeatureFlags.of(fn).isEnabled(LAMBDA_RECOGNIZE_LAYER_VERSION)) {
    stringifiedConfig = stringifiedConfig + calculateLayersHash(fn._layers);
  }

  return md5hash(stringifiedConfig + additional);
}

export function trimFromStart(s: string, maxLength: number) {
  const desiredLength = Math.min(maxLength, s.length);
  const newStart = s.length - desiredLength;
  return s.substring(newStart);
}

/*
 * The list of properties found in CfnFunction (or AWS::Lambda::Function).
 * They are classified as "locked" to a Function Version or not.
 * When a property is locked, any change to that property will not take effect on previously created Versions.
 * Instead, a new Version must be generated for the change to take effect.
 * Similarly, if a property that's not locked to a Version is modified, a new Version
 * must not be generated.
 *
 * Adding a new property to this list - If the property is part of the UpdateFunctionConfiguration
 * API or UpdateFunctionCode API, then it must be classified as true, otherwise false.
 * See https://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html and
 * https://docs.aws.amazon.com/lambda/latest/dg/API_UpdateFunctionConfiguration.html
 */
export const VERSION_LOCKED: { [key: string]: boolean } = {
  // locked to the version
  Architectures: true,
  Code: true,
  DeadLetterConfig: true,
  Description: true,
  Environment: true,
  EphemeralStorage: true,
  FileSystemConfigs: true,
  FunctionName: true,
  Handler: true,
  ImageConfig: true,
  KmsKeyArn: true,
  Layers: true,
  MemorySize: true,
  PackageType: true,
  Role: true,
  Runtime: true,
  RuntimeManagementConfig: true,
  SnapStart: true,
  Timeout: true,
  TracingConfig: true,
  VpcConfig: true,

  // not locked to the version
  CodeSigningConfigArn: false,
  ReservedConcurrentExecutions: false,
  Tags: false,
};

function filterUsefulKeys(properties: any) {
  const versionProps = { ...VERSION_LOCKED, ...LambdaFunction._VER_PROPS };
  const unclassified = Object.entries(properties)
    .filter(([k, v]) => v != null && !Object.keys(versionProps).includes(k))
    .map(([k, _]) => k);
  if (unclassified.length > 0) {
    throw new Error(`The following properties are not recognized as version properties: [${unclassified}].`
      + ' See the README of the aws-lambda module to learn more about this and to fix it.');
  }
  const notLocked = Object.entries(versionProps).filter(([_, v]) => !v).map(([k, _]) => k);
  notLocked.forEach(p => delete properties[p]);

  const ret: { [key: string]: any } = {};
  Object.entries(properties).filter(([k, _]) => versionProps[k]).forEach(([k, v]) => ret[k] = v);
  return ret;
}

function sortProperties(properties: any) {
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
  return ret;
}

function calculateLayersHash(layers: ILayerVersion[]): string {
  const layerConfig: {[key: string]: any } = {};
  for (const layer of layers) {
    const stack = Stack.of(layer);
    const layerResource = layer.node.defaultChild as CfnResource;
    // if there is no layer resource, then the layer was imported
    // and we will include the layer arn and runtimes in the hash
    if (layerResource === undefined) {
      // ARN may have unresolved parts in it, but we didn't deal with this previously
      // so deal with it now for backwards compatibility.
      if (!Token.isUnresolved(layer.layerVersionArn)) {
        layerConfig[layer.layerVersionArn] = layer.compatibleRuntimes;
      } else {
        layerConfig[layer.node.id] = {
          arn: stack.resolve(layer.layerVersionArn),
          runtimes: layer.compatibleRuntimes?.map(r => r.name),
        };
      }
      continue;
    }
    const config = stack.resolve((layerResource as any)._toCloudFormation());
    const resources = config.Resources;
    const resourceKeys = Object.keys(resources);
    if (resourceKeys.length !== 1) {
      throw new Error(`Expected one rendered CloudFormation resource but found ${resourceKeys.length}`);
    }
    const logicalId = resourceKeys[0];
    const properties = resources[logicalId].Properties;
    // all properties require replacement, so they are all version locked.
    layerConfig[layer.node.id] = properties;
  }

  return md5hash(JSON.stringify(layerConfig));
}
