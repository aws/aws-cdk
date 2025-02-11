import type { CcApiContextQuery } from '@aws-cdk/cloud-assembly-schema';
import { ICloudControlClient } from '../api';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { ContextProviderError } from '../toolkit/error';
import { findJsonValue, getResultObj } from '../util/json';

export class CcApiContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {}

  /**
   * This returns a data object with the value from CloudControl API result.
   * args.typeName - see https://docs.aws.amazon.com/cloudcontrolapi/latest/userguide/supported-resources.html
   * args.exactIdentifier -  use CC API getResource.
   * args.propertyMatch - use CCP API listResources to get resources and propertyMatch to search through the list.
   * args.propertiesToReturn - Properties from CC API to return.
   *
   * @param args
   * @returns
   */
  public async getValue(args: CcApiContextQuery) {
    const cloudControl = (await initContextProviderSdk(this.aws, args)).cloudControl();

    const result = await this.findResources(cloudControl, args);
    return result;
  }

  private async findResources(cc: ICloudControlClient, args: CcApiContextQuery): Promise<{[key: string]: any} []> {
    if (args.exactIdentifier && args.propertyMatch) {
      throw new ContextProviderError(`Specify either exactIdentifier or propertyMatch, but not both. Failed to find resources using CC API for type ${args.typeName}.`);
    }
    if (!args.exactIdentifier && !args.propertyMatch) {
      throw new ContextProviderError(`Neither exactIdentifier nor propertyMatch is specified. Failed to find resources using CC API for type ${args.typeName}.`);
    }

    if (args.exactIdentifier) {
      // use getResource to get the exact indentifier
      return this.getResource(cc, args.typeName, args.exactIdentifier, args.propertiesToReturn);
    } else {
      // use listResource
      return this.listResources(cc, args.typeName, args.propertyMatch!, args.propertiesToReturn);
    }
  }

  /**
   * Calls getResource from CC API to get the resource.
   * See https://docs.aws.amazon.com/cli/latest/reference/cloudcontrol/get-resource.html
   *
   * If the exactIdentifier is not found, then an empty map is returned.
   * If the resource is found, then a map of the identifier to a map of property values is returned.
   *
   * @param cc - CC API client
   * @param typeName
   * @param exactIdentifier
   * @param propertiesToReturn
   * @returns resultObject - resultObject.results contains a list of the propObjects.
   */
  private async getResource(
    cc: ICloudControlClient,
    typeName: string,
    exactIdentifier: string,
    propertiesToReturn: string[],
  ): Promise<{[key: string]: any}[]> {
    const resultObjs: {[key: string]: any}[] = [];
    try {
      const result = await cc.getResource({
        TypeName: typeName,
        Identifier: exactIdentifier,
      });
      const id = result.ResourceDescription?.Identifier ?? '';
      if (id !== '') {
        const propsObject = JSON.parse(result.ResourceDescription?.Properties ?? '');
        const propsObj = getResultObj(propsObject, result.ResourceDescription?.Identifier!, propertiesToReturn);
        resultObjs.push(propsObj);
      } else {
        throw new ContextProviderError(`Could not get resource ${exactIdentifier}.`);
      }
    } catch (err) {
      throw new ContextProviderError(`Encountered CC API error while getting resource ${exactIdentifier}. Error: ${err}`);
    }
    return resultObjs;
  }

  /**
   * Calls listResources from CC API to get the resources and apply args.propertyMatch to find the resources.
   * See https://docs.aws.amazon.com/cli/latest/reference/cloudcontrol/list-resources.html
   *
   * Since exactIdentifier is not specified, propertyMatch must be specified.
   * This returns an object where the ids are object keys and values are objects with keys of args.propertiesToReturn.
   *
   * @param cc
   * @param typeName
   * @param propertyMatch
   * @param propertiesToReturn
   * @returns resultObject - resultObject.results contains a list of the propObjects.
   */
  private async listResources(
    cc: ICloudControlClient,
    typeName: string,
    propertyMatch: Record<string, unknown>,
    propertiesToReturn: string[],
  ): Promise<{[key: string]: any}[]> {
    const resultObjs: {[key: string]: any}[] = [];

    try {
      const result = await cc.listResources({
        TypeName: typeName,
      });
      result.ResourceDescriptions?.forEach((resource) => {
        const id = resource.Identifier ?? '';
        if (id !== '') {
          const propsObject = JSON.parse(resource.Properties ?? '');

          const filters = Object.entries(propertyMatch);
          let match = false;
          if (filters) {
            match = filters.every((record, _index, _arr) => {
              const key = record[0];
              const expected = record[1];
              const actual = findJsonValue(propsObject, key);
              return propertyMatchesFilter(actual, expected);
            });

            function propertyMatchesFilter(actual: any, expected: unknown) {
              // For now we just check for strict equality, but we can implement pattern matching and fuzzy matching here later
              return expected === actual;
            }
          }

          if (match) {
            const propsObj = getResultObj(propsObject, resource.Identifier!, propertiesToReturn);
            resultObjs.push(propsObj);
          }
        }
      });
    } catch (err) {
      throw new ContextProviderError(`Could not get resources ${propertyMatch}. Error: ${err}`);
    }
    return resultObjs;
  }
}
