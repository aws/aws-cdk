/**
 * Normalize a service name from:
 *
 * - A full SDKv3 package name
 * - A partial SDKv3 package name
 * - An SDKv2 constructor name
 *
 * To a partial SDKv3 package name.
 */
export declare function normalizeServiceName(service: string): string;
/**
 * Normalize an action name from:
 *
 * - camelCase SDKv2 method name
 * - PascalCase API name
 * - SDKv3 command class name
 *
 * To a PascalCase API name.
 */
export declare function normalizeActionName(v3Service: string, action: string): string;
