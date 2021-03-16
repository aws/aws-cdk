import { Construct } from '../construct-compat';
import { CustomResource } from '../custom-resource';
import { CustomResourceProvider, CustomResourceProviderRuntime } from '../custom-resource-provider';
import { CfnUtilsResourceType } from './cfn-utils-provider/consts';

/**
 * A custom resource provider for CFN utilities such as `CfnJson`.
 */
export class CfnUtilsProvider extends Construct {
  public static getOrCreate(scope: Construct) {
    return CustomResourceProvider.getOrCreate(scope, 'AWSCDKCfnUtilsProvider', {
      runtime: CustomResourceProviderRuntime.NODEJS_12_X,
      codeDirectory: `${__dirname}/cfn-utils-provider`,
    });
  }
}

/**
 * Utility functions provided by the CfnUtilsProvider
 */
export abstract class CfnUtils {
  /**
   * Encode a structure to JSON at CloudFormation deployment time
   *
   * This would have been suitable for the JSON-encoding of abitrary structures, however:
   *
   * - It uses a custom resource to do the encoding, and we'd rather not use a custom
   *   resource if we can avoid it.
   * - It cannot be used to encode objects where the keys of the objects can contain
   *   tokens--because those cannot be represented in the JSON encoding that CloudFormation
   *   templates use.
   *
   * This helper is used by `CloudFormationLang.toJSON()` if and only if it encounters
   * objects that cannot be stringified any other way.
   */
  public static stringify(scope: Construct, id: string, value: any): string {
    const resource = new CustomResource(scope, id, {
      serviceToken: CfnUtilsProvider.getOrCreate(scope),
      resourceType: CfnUtilsResourceType.CFN_JSON_STRINGIFY,
      properties: {
        Value: value,
      },
    });

    return resource.getAttString('Value');
  }
}