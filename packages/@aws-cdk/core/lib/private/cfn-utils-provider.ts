import { Construct } from '../construct-compat';
import { CustomResourceProvider, CustomResourceProviderRuntime } from '../custom-resource-provider';

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