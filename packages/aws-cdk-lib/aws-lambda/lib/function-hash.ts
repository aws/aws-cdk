import { Function as LambdaFunction } from './function';
import { ILayerVersion } from './layers';
import { CfnResource, FeatureFlags, Stack, Token } from '../../core';
import { md5hash } from '../../core/lib/helpers-internal';
import { LAMBDA_RECOGNIZE_LAYER_VERSION, LAMBDA_RECOGNIZE_VERSION_PROPS } from '../../cx-api';

export function calculateFunctionHash(fn: LambdaFunction, additional: string = '') {
  const stack = Stack.of(fn);

  const functionResource = fn.node.defaultChild as CfnResource;
  const { properties, template, logicalId } = resolveSingleResourceProperties(stack, functionResource);

  let stringifiedConfig;
  if (FeatureFlags.of(fn).isEnabled(LAMBDA_RECOGNIZE_VERSION_PROPS)) {
    const updatedProps = sortFunctionProperties(filterUsefulKeys(properties));
    stringifiedConfig = JSON.stringify(updatedProps);
  } else {
    const sorted = sortFunctionProperties(properties);
    template.Resources[logicalId].Properties = sorted;
    stringifiedConfig = JSON.stringify(template);
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
  LoggingConfig: true,

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

    const { properties } = resolveSingleResourceProperties(stack, layerResource);

    // all properties require replacement, so they are all version locked.
    layerConfig[layer.node.id] = sortLayerVersionProperties(properties);
  }

  return md5hash(JSON.stringify(layerConfig));
}

/**
 * Sort properties in an object according to a sort order of known keys
 *
 * Any additional keys are added at the end, but also sorted.
 *
 * We only sort one level deep, because we rely on the fact that everything
 * that needs to be sorted happens to be sorted by the codegen already, and
 * we explicitly rely on some objects NOT being sorted.
 */
class PropertySort {
  constructor(private readonly knownKeysOrder: string[]) {
  }

  public sortObject(properties: any): any {
    const ret: any = {};

    // Scratch-off set for keys we don't know about yet
    const unusedKeys = new Set(Object.keys(properties));
    for (const prop of this.knownKeysOrder) {
      ret[prop] = properties[prop];
      unusedKeys.delete(prop);
    }

    for (const prop of Array.from(unusedKeys).sort()) {
      ret[prop] = properties[prop];
    }

    return ret;
  }
}

/**
 * Sort properties in a stable order, even as we switch to new codegen
 *
 * <=2.87.0, we used to generate properties in the order that they occurred in
 * the CloudFormation spec. >= 2.88.0, we switched to a new spec source, which
 * sorts the properties lexicographically. The order change changed the hash,
 * even though the properties themselves have not changed.
 *
 * We now have a set of properties with the sort order <=2.87.0, and add any
 * additional properties later on, but also sort them.
 *
 * We should be making sure that the orderings for all subobjects
 * between 2.87.0 and 2.88.0 are the same, but fortunately all the subobjects
 * were already in lexicographic order in <=2.87.0 so we only need to sort some
 * top-level properties on the resource.
 *
 * We also can't deep-sort everything, because for backwards compatibility
 * reasons we have a test that ensures that environment variables are not
 * lexicographically sorted, but emitted in the order they are added in source
 * code, so for now we rely on the codegen being lexicographically sorted.
 */
function sortFunctionProperties(properties: any) {
  return new PropertySort([
    // <= 2.87 explicitly fixed order
    'Code', 'Handler', 'Role', 'Runtime',
    // <= 2.87 implicitly fixed order
    'Architectures', 'CodeSigningConfigArn', 'DeadLetterConfig', 'Description', 'Environment',
    'EphemeralStorage', 'FileSystemConfigs', 'FunctionName', 'ImageConfig', 'KmsKeyArn', 'Layers',
    'MemorySize', 'PackageType', 'ReservedConcurrentExecutions', 'RuntimeManagementConfig', 'SnapStart',
    'Tags', 'Timeout', 'TracingConfig', 'VpcConfig',
  ]).sortObject(properties);
}

function sortLayerVersionProperties(properties: any) {
  return new PropertySort([
    // <=2.87.0 implicit sort order
    'Content', 'CompatibleArchitectures', 'CompatibleRuntimes', 'Description',
    'LayerName', 'LicenseInfo',
  ]).sortObject(properties);
}

function resolveSingleResourceProperties(stack: Stack, res: CfnResource): any {
  const template = stack.resolve(res._toCloudFormation());
  const resources = template.Resources;
  const resourceKeys = Object.keys(resources);
  if (resourceKeys.length !== 1) {
    throw new Error(`Expected one rendered CloudFormation resource but found ${resourceKeys.length}`);
  }
  const logicalId = resourceKeys[0];
  return { properties: resources[logicalId].Properties, template, logicalId };
}
