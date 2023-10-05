import * as path from 'path';

/**
 * Transform SDK service/action to IAM action using metadata obtained from AWS SDK metadata.
 * Example: CloudWatchLogs with putRetentionPolicy => logs:PutRetentionPolicy
 */
export function awsSdkToIamAction(service: string, action: string): string {
  const v3Name = normalizeServiceName(service);
  const iamPrefix = v3Metadata()[v3Name]?.iamPrefix ?? v3Name;
  const iamAction = normalizeActionName(v3Name, action);
  return `${iamPrefix}:${iamAction}`;
}

/**
 * Normalize a service name from:
 *
 * - A full SDKv3 package name
 * - A partial SDKv3 package name
 * - An SDKv2 constructor name
 *
 * To a partial SDKv3 package name.
 */
function normalizeServiceName(service: string) {
  service = service.toLowerCase(); // Lowercase
  service = service.replace(/^@aws-sdk\/client-/, ''); // Strip the start of a V3 package name
  service = v2ToV3Mapping()?.[service] ?? service; // Optionally map v2 name -> v3 name
  return service;
}

/**
 * Normalize an action name from:
 *
 * - camelCase SDKv2 method name
 * - PascalCase API name
 * - SDKv3 command class name
 *
 * To a PascalCase API name.
 */
function normalizeActionName(v3Service: string, action: string) {
  if (action.charAt(0).toLowerCase() === action.charAt(0)) {
    return action.charAt(0).toUpperCase() + action.slice(1);
  }

  // If the given word is in the APIs ending in 'Command' for this service,
  // return as is. Otherwise, return with a potential 'Command' suffix stripped.
  if (v3Metadata()[v3Service]?.commands?.includes(action)) {
    return action;
  }

  return action.replace(/Command$/, '');
}

function v2ToV3Mapping(): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(__dirname, 'sdk-v2-to-v3.json'));
}

function v3Metadata(): Record<string, { iamPrefix?: string; commands?: string[] }> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(__dirname, 'sdk-v3-metadata.json'));
}
