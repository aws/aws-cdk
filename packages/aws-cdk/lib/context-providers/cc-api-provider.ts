import type { CcApiContextQuery } from '@aws-cdk/cloud-assembly-schema';
import { ICloudControlClient } from '../api';
import { type SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { findJsonValue, getResultObj } from '../util/json';

export class CcApiContextProviderPlugin implements ContextProviderPlugin {
  public static RESULTS: string = 'results';

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

  private async findResources(cc: ICloudControlClient, args: CcApiContextQuery): Promise<{[key: string]: any}> {
    if (args.exactIdentifier) {
      // use getResource to get the exact indentifier
      return this.getResource(cc, args);
    } else {
      // use listResource
      return this.listResources(cc, args);
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
   * @param args - This contains TypeName, exactIdentifier, and propertiesToReturn
   * @returns resultObject - resultObject.results contains a list of the propObjects.
   */
  private async getResource(cc: ICloudControlClient, args: CcApiContextQuery): Promise<{[key: string]: any}> {
    const resultObj: {[key: string]: any} = {};
    try {
      const result = await cc.getResource({
        TypeName: args.typeName,
        Identifier: args.exactIdentifier,
      });
      const id = result.ResourceDescription?.Identifier ?? '';
      if (id !== '') {
        const propsObject = JSON.parse(result.ResourceDescription?.Properties ?? '');
        const propsObj = getResultObj(propsObject, args.propertiesToReturn);

        // Add the identifier back to the propsObj.
        propsObj.Identifier = result.ResourceDescription?.Identifier;
        resultObj[CcApiContextProviderPlugin.RESULTS] = [propsObj];
      } else {
        throw new TypeError(`Could not get resource ${args.exactIdentifier}.`);
      }
    } catch (err) {
      throw new TypeError(`Encountered CC API error while getting resource ${args.exactIdentifier}.`);
    }
    return resultObj;
  }

  /**
   * Calls listResources from CC API to get the resources and apply args.propertyMatch to find the resources.
   * See https://docs.aws.amazon.com/cli/latest/reference/cloudcontrol/list-resources.html
   *
   * Since exactIdentifier is not specified, propertyMatch must be specified.
   * This returns an object where the ids are object keys and values are objects with keys of args.propertiesToReturn.
   *
   * @param cc
   * @param args
   * @returns resultObject - resultObject.results contains a list of the propObjects.
   */
  private async listResources(cc: ICloudControlClient, args: CcApiContextQuery): Promise<{[key: string]: any}> {
    const resultObj: {[key: string]: any} = {};

    if (!args.propertyMatch) {
      throw new TypeError('Neither exactIdentifier nor propertyMatch are specified.');
    }

    try {
      const result = await cc.listResources({
        TypeName: args.typeName,
      });
      let propObjects: any[] = [];
      result.ResourceDescriptions?.forEach((resource) => {
        const id = resource.Identifier ?? '';
        if (id !== '') {
          const propsObject = JSON.parse(resource.Properties ?? '');
          const matchKey = Object.keys(args.propertyMatch!);

          let misMatch = false;
          matchKey.forEach((key) => {
            const value = findJsonValue(propsObject, key);
            if (value !== args.propertyMatch![key]) {
              misMatch = true;
            }
          });

          if (!misMatch) {
            const propsObj = getResultObj(propsObject, args.propertiesToReturn);
            propsObj.Identifier = resource.Identifier;
            propObjects.push(propsObj);
          }
        }
      });
      resultObj[CcApiContextProviderPlugin.RESULTS] = propObjects;
    } catch (err) {
      throw new TypeError(`Could not get resources ${args.propertyMatch}. Error: ${err}`);
    }
    return resultObj;
  }
}
