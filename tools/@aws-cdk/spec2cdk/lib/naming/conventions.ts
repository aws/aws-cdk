import type { Metric, Resource, TypeDefinition } from '@aws-cdk/service-spec-types';
import type { TypeDeclaration } from '@cdklabs/typewriter';
import { ClassType } from '@cdklabs/typewriter';
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

export function camelcasedResourceName(res: Resource, suffix?: string) {
  return `${camelcase(res.name)}${suffix ?? ''}`;
}

export function classNameFromResource(res: Resource, suffix?: string) {
  return `Cfn${res.name}${suffix ?? ''}`;
}

export function propStructNameFromResource(res: Resource, suffix?: string) {
  return `${classNameFromResource(res, suffix)}Props`;
}

export function interfaceNameFromResource(res: Resource, suffix?: string) {
  return `I${classNameFromResource(res, suffix)}`;
}

/**
 * resource to alias for interface imports
 * `AWS::S3::Bucket` -> `s3Refs`
 */
export function interfaceModuleImportName(res: Resource) {
  return camelcase(`${modulePartsFromResource(res).moduleBaseName}Refs`);
}

export function namespaceFromResource(res: Resource) {
  return res.cloudFormationType.split('::').slice(0, 2).join('::');
}

/**
 * Get the AWS namespace prefix from a resource in PascalCase for use as a type alias prefix.
 */
export function typeAliasPrefixFromResource(res: Resource) {
  return camelcase(res.cloudFormationType.split('::')[1], { pascalCase: true });
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

export function flattenFunctionNameFromType(struct: TypeDeclaration) {
  return `flatten${qualifiedName(struct)}`;
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
 * Make sure the resource name is included in the property
 */
export function referencePropertyName(propName: string, resourceName: string) {
  // Some primaryIdentifier components are structurally deep, like AWS::QuickSight::RefreshSchedule's
  // 'schedule/scheduleId', or AWS::S3::StorageLens's `configuration/id`. Only return the last part.
  propName = propName.split('/').pop() ?? propName;

  if (['arn', 'id', 'name', 'url'].includes(propName.toLowerCase())) {
    return `${camelcase(resourceName)}${propName.charAt(0).toUpperCase()}${propName.slice(1).toLowerCase()}`;
  }

  return camelcase(propName);
}

export function referenceInterfaceName(resourceName: string, suffix?: string) {
  return `I${resourceName}${suffix ?? ''}Ref`;
}

export function referenceInterfaceAttributeName(resourceName: string) {
  return `${camelcase(resourceName)}Ref`;
}

/**
 * namespace to module name parts (`AWS::S3` -> ['aws-s3', 'AWS', 'S3'])
 */
export function modulePartsFromNamespace(namespace: string) {
  const [moduleFamily, moduleBaseName] = (namespace === 'AWS::Serverless' ? 'AWS::SAM' : namespace).split('::');
  const moduleName = `${moduleFamily}-${moduleBaseName}`.toLocaleLowerCase();
  return {
    moduleName,
    moduleFamily,
    moduleBaseName,
  };
}

/**
 * resource to module name parts (`AWS::S3::Bucket` -> ['aws-s3', 'AWS', 'S3'])
 */
export function modulePartsFromResource(res: Resource) {
  return modulePartsFromNamespace(namespaceFromResource(res));
}

/**
 * Submodule identifier from name (`aws-s3` -> `aws_s3`)
 */
export function submoduleSymbolFromName(name: string) {
  return name.replace(/-/g, '_');
}

/**
 * Submodule identifier from name (`AWS::S3::Bucket` -> `aws_s3`)
 */
export function submoduleSymbolFromResource(res: Resource) {
  return modulePartsFromResource(res).moduleName.replace(/-/g, '_');
}

/**
 * Get the namespace name from the event name
 */
export function eventNamespaceName(eventName: string) {
  if ((eventName.match(/@/g) || []).length !== 1) {
    throw new Error('Input must contain exactly one "@" symbol');
  }

  // Extract the text after the '@'
  const extracted = eventName.split('@')[1];

  if (!extracted) {
    throw new Error('No event name found after "@" symbol');
  }

  // Check if the extracted string contains only alphanumeric characters
  if (!/^[a-zA-Z0-9]+$/.test(extracted)) {
    throw new Error('Event name contains invalid characters');
  }

  return extracted;
}

/**
 * Convert event name to pattern method name (AcknowledgementCompleted -> acknowledgementCompletedPattern)
 */
export function eventPatternMethodName(eventName: string) {
  if (eventName.startsWith('AWS')) {
    return `aws${eventName.slice(3)}Pattern`;
  }
  return `${eventName.charAt(0).toLowerCase()}${eventName.slice(1)}Pattern`;
}

/**
 * Get the fully qualified event pattern return type name
 */
export function eventPatternTypeName(eventsClassName: string, eventName: string) {
  return `${eventsClassName}.${eventName}.EventPattern`;
}

/**
 * Get the fully qualified event pattern props type name
 */
export function eventPatternPropsTypeName(eventsClassName: string, eventName: string) {
  return `${eventsClassName}.${eventName}.PatternProps`;
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

/**
 * Sanitize a type name to be a valid TypeScript identifier
 * Converts kebab-case and other invalid characters to PascalCase
 *
 * Also has a list of identifiers we need to avoid because they might cause
 * problems in some languages. The "Object" one is fixed separately in jsii
 * but we want to push this out now.
 */
export function sanitizeTypeName(name: string): string {
  const id = makeIdentifier(camelcase(name, { pascalCase: true }));

  return RESERVED_NAMES_LIST.has(id) ? `${id}Type` : id;
}

const RESERVED_NAMES_LIST = new Set(['Object']);
