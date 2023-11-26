import { Metric, Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import { ClassType, TypeDeclaration } from '@cdklabs/typewriter';
import * as camelcase from 'camelcase';

/**
 * Convert a CloudFormation name to a nice TypeScript name
 *
 * We use a library to camelcase, and fix up some things that translate incorrectly.
 *
 * For example, the library breaks when pluralizing an abbreviation, such as "ProviderARNs" -> "providerArNs".
 *
 * We currently recognize "ARNs", "MBs" and "AZs".
 */
export function propertyNameFromCloudFormation(name: string): string {
  if (name === 'VPCs') {
    return 'vpcs';
  }

  // Lightsail contains a property called "GetObject", which isn't a jsii-compliant name
  // as it conflicts with generated getters in other languages (e.g., Java, C#).
  // For now, hard-coding a replacement property name to something that's frankly better anyway.
  if (name === 'GetObject') {
    name = 'objectAccess';
  }

  // GuardDuty contains a property named "Equals", which isn't a jsii-compliant name as it
  // conflicts with standard Java/C# object methods.
  if (name === 'Equals') {
    name = 'equalTo';
  }

  let ret = camelcase(name);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const suffixes: { [key: string]: string } = { ARNs: 'Arns', MBs: 'MBs', AZs: 'AZs' };

  for (const suffix of Object.keys(suffixes)) {
    if (name.endsWith(suffix)) {
      return ret.slice(0, -suffix.length) + suffixes[suffix];
    }
  }

  return ret;
}

export function structNameFromTypeDefinition(def: TypeDefinition) {
  return `${def.name}Property`;
}

export function classNameFromResource(res: Resource, suffix?: string) {
  return `Cfn${res.name}${suffix ?? ''}`;
}

export function propStructNameFromResource(res: Resource, suffix?: string) {
  return `${classNameFromResource(res, suffix)}Props`;
}

export function cfnProducerNameFromType(struct: TypeDeclaration) {
  return `convert${qualifiedName(struct)}ToCloudFormation`;
}

export function cfnParserNameFromType(struct: TypeDeclaration) {
  return `${qualifiedName(struct)}FromCloudFormation`;
}

export function cfnPropsValidatorNameFromType(struct: TypeDeclaration) {
  return `${qualifiedName(struct)}Validator`;
}

export function metricsClassNameFromService(namespace: string) {
  return `${namespace.replace(/^AWS\//, '').replace('/', '')}Metrics`;
}

export function metricFunctionName(metric: Metric) {
  return makeIdentifier(camelcase(`${metric.name}${metric.statistic}`));
}

export function staticResourceTypeName() {
  return 'CFN_RESOURCE_TYPE_NAME';
}

export function staticRequiredTransform() {
  return 'REQUIRED_TRANSFORM';
}

export function attributePropertyName(attrName: string) {
  return propertyNameFromCloudFormation(`attr${attrName.replace(/[^a-zA-Z0-9]/g, '')}`);
}

/**
 * Generate a name for the given declaration so that we can generate helper symbols for it that won't class
 *
 * We assume that the helpers get generated at module level, so we add in the names of the
 * containing type if found.
 *
 * (Doesn't handle all cases generically, just the ones we care about right now).
 */
function qualifiedName(type: TypeDeclaration) {
  return [type.scope instanceof ClassType ? type.scope.name : '', type.name].join('');
}

/**
 * Not all characters are allowed in identifiers.
 * E.g. if it doesn't start with an allowed character, prefix with a '_'
 */
function makeIdentifier(s: string) {
  // Strip invalid characters from identifier
  s = s.replace(/([^a-zA-Z0-9_])/g, '');
  // If it doesn't start with an alpha char, prefix with _
  s = s.replace(/^([^a-zA-Z_])/, '_$1');
  return s;
}
