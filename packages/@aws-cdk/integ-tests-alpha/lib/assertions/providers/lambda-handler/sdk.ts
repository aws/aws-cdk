/* eslint-disable no-console */
import { CustomResourceHandler } from './base';
import { AwsApiCallRequest, AwsApiCallResult } from './types';
import { decode } from './utils';
import { getV3ClientPackageName, findV3ClientConstructor } from 'aws-cdk-lib/custom-resources';

/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
export function flatten(object: object): { [key: string]: any } {
  return Object.assign(
    {},
    ...function _flatten(child: any, path: string[] = []): any {
      return [].concat(...Object.keys(child)
        .map(key => {
          let childKey = Buffer.isBuffer(child[key]) ? child[key].toString('utf8') : child[key];
          // if the value is a json string then treat it as an object
          // and keep recursing. This allows for easier assertions against complex json strings
          if (typeof childKey === 'string') {
            childKey = isJsonString(childKey);
          }
          return typeof childKey === 'object' && childKey !== null
            ? _flatten(childKey, path.concat([key]))
            : ({ [path.concat([key]).join('.')]: childKey });
        }));
    }(object),
  );
}

interface V3SdkPkg {
  service: string;
  packageName: string;
  pkg: object;
}

function getServicePackage(service: string): V3SdkPkg {
  const packageName = getV3ClientPackageName(service);
  try {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const pkg = require(packageName);

    return {
      service,
      pkg,
      packageName,
    };
  } catch (e) {
    throw Error(`Service ${service} client package with name '${packageName}' does not exist.`);
  }
}

function getServiceClient(sdkPkg: V3SdkPkg): any {
  try {
    const ServiceClient = findV3ClientConstructor(sdkPkg.pkg);
    return new ServiceClient({});
  } catch (e) {
    console.error(e);
    throw Error(`No client constructor found within package: ${sdkPkg.packageName}`);
  }
}

function getSdkCommand(sdkPkg: V3SdkPkg, api: string): any {
  const commandName = api.endsWith('Command') ? api : `${api}Command`;
  const command = Object.entries(sdkPkg.pkg).find(
    ([name]) => name.toLowerCase() === commandName.toLowerCase(),
  )?.[1] as { new (input: any): any };

  if (!command) {
    throw new Error(`Unable to find command named: ${commandName} for api: ${api} in service package`);
  }
  return command;
}

export class AwsApiCallHandler extends CustomResourceHandler<AwsApiCallRequest, AwsApiCallResult | { [key: string]: string }> {
  protected async processEvent(request: AwsApiCallRequest): Promise<AwsApiCallResult | { [key: string]: string } | undefined> {
    const sdkPkg = getServicePackage(request.service);
    const client = getServiceClient(sdkPkg);

    const Command = getSdkCommand(sdkPkg, request.api);
    const response = await client.send(
      new Command(
        (request.parameters &&
        decode(request.parameters)) ?? {},
      ),
    );

    console.log(`SDK response received ${JSON.stringify(response)}`);
    delete response.ResponseMetadata;
    const respond = {
      apiCallResponse: response,
    };
    const flatData: { [key: string]: string } = {
      ...flatten(respond),
    };

    let resp: AwsApiCallResult | { [key: string]: string } = respond;
    if (request.outputPaths) {
      resp = filterKeys(flatData, request.outputPaths!);
    } else if (request.flattenResponse === 'true') {
      resp = flatData;
    }
    console.log(`Returning result ${JSON.stringify(resp)}`);
    return resp;
  }
}

function filterKeys(object: object, searchStrings: string[]): { [key: string]: string } {
  return Object.entries(object).reduce((filteredObject: { [key: string]: string }, [key, value]) => {
    for (const searchString of searchStrings) {
      if (key.startsWith(`apiCallResponse.${searchString}`)) {
        filteredObject[key] = value;
      }
    }
    return filteredObject;
  }, {});
}

function isJsonString(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
