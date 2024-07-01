import type { AwsCredentialIdentityProvider } from '@smithy/types';
import { coerceApiParameters } from './coerce-api-parameters';
import { findV3ClientConstructor } from './find-client-constructor';
import { normalizeActionName, normalizeServiceName } from './sdk-info';

export interface InvokeOptions {
  /**
   * The SDKv3 package for the service.
   *
   * @default - Load the package automatically
   */
  readonly sdkPackage?: any;

  /**
   * Override API version
   *
   * @default - Use default API version
   */
  readonly apiVersion?: string;

  /**
   * Override region
   *
   * @default - Current region
   */
  readonly region?: string;

  /**
   * Override credentials
   *
   * @default - Default credentials
   */
  readonly credentials?: AwsCredentialIdentityProvider;

  /**
   * Parameters to the API call
   *
   * @default {}
   */
  readonly parameters?: Record<string, unknown>;

  /**
   * Flatten the response object
   *
   * Instead of a nested object structure, return a map of `{ string -> value }`, with the keys
   * being the paths to each primitive value.
   *
   * @default false
   */
  readonly flattenResponse?: boolean;
}

/**
 * Wrapper to make an SDKv3 API call, with SDKv2 compatibility
 */
export class ApiCall {
  public readonly service: string;
  public readonly action: string;
  public readonly v3PackageName: string;

  public v3Package?: any; // For testing purposes
  public client?: any; // For testing purposes

  constructor(service: string, action: string) {
    this.service = normalizeServiceName(service);
    this.action = normalizeActionName(this.service, action);

    this.v3PackageName = `@aws-sdk/client-${this.service}`;
  }

  public async invoke(options: InvokeOptions): Promise<Record<string, unknown>> {
    this.initializePackage(options.sdkPackage);
    this.initializeClient(options);

    const Command = this.findCommandClass();

    // Command must pass input value https://github.com/aws/aws-sdk-js-v3/issues/424
    const response = await this.client.send(
      new Command(coerceApiParameters(this.service, this.action, options.parameters ?? {})),
    );

    delete response.$metadata;

    const coerced = await coerceSdkv3Response(response);

    return (options.flattenResponse ? flatten(coerced) : coerced) as Record<string, unknown>;
  }

  public initializePackage(packageOverride?: any): any {
    if (this.v3Package) {
      return;
    }

    if (packageOverride) {
      this.v3Package = packageOverride;
      return;
    }

    try {
      /* eslint-disable-next-line @typescript-eslint/no-require-imports */ // esbuild-disable unsupported-require-call
      this.v3Package = require(this.v3PackageName);
    } catch (e) {
      throw Error(`Service ${this.service} client package with name '${this.v3PackageName}' does not exist.`);
    }
  }

  public initializeClient(options: Pick<InvokeOptions, 'apiVersion' | 'credentials' | 'region'>) {
    if (!this.v3Package) {
      this.initializePackage();
    }
    const ServiceClient = this.findConstructor(this.v3Package);

    this.client = new ServiceClient({
      apiVersion: options.apiVersion,
      credentials: options.credentials,
      region: options.region,
    });
    return this.client;
  }

  public findCommandClass() {
    if (!this.v3Package) {
      this.initializePackage();
    }
    const commandName = `${this.action}Command`;
    const Command = Object.entries(this.v3Package ?? {}).find(
      ([name]) => name.toLowerCase() === commandName.toLowerCase(),
    )?.[1] as { new (input: any): any };
    if (!Command) {
      throw new Error(`Unable to find command named: ${commandName} for action: ${this.action} in service package ${this.v3PackageName}`);
    }
    return Command;
  }

  private findConstructor(pkg: Object) {
    try {
      const ret = findV3ClientConstructor(pkg);
      if (!ret) {
        throw new Error('findV3ClientConstructor returned undefined');
      }
      return ret;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      throw Error(`No client constructor found within package: ${this.v3PackageName}`);
    }
  }

}

/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
export function flatten(root: unknown): { [key: string]: any } {
  const ret: { [key: string]: any } = {};
  recurse(root);
  return ret;

  function recurse(x: unknown, path: string[] = []): any {
    if (x && typeof x === 'object') {
      for (const [key, value] of Object.entries(x)) {
        recurse(value, [...path, key]);
      }
      return;
    }

    ret[path.join('.')] = x;
  }
}

/**
 * Text decoder used for Uint8Array response parsing
 */
const decoder = new TextDecoder();

export async function coerceSdkv3Response(value: unknown): Promise<unknown> {
  if (value && typeof(value) === 'object' && typeof((value as any).transformToString) === 'function') {
    // in sdk v3 some return types are now adapters that we need to explicitly
    // convert to strings. see example: https://github.com/aws/aws-sdk-js-v3/blob/main/UPGRADING.md?plain=1#L573-L576
    // note we don't use 'instanceof Unit8Array' because observations show this won't always return true, even though
    // the `transformToString` function will be available. (for example S3::GetObject)
    return (value as any).transformToString();
  }
  if (Buffer.isBuffer(value)) {
    return value.toString('utf8');
  }
  if (ArrayBuffer.isView(value)) {
    return decoder.decode(value.buffer);
  }

  if (Array.isArray(value)) {
    const ret = [];
    for (const x of value) {
      ret.push(await coerceSdkv3Response(x));
    }
    return ret;
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      (value as any)[key] = await coerceSdkv3Response((value as any)[key]);
    }
    return value;
  }

  return value;
}
