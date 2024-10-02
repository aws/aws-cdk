import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as AWS from 'aws-sdk';
import { SdkProvider, initContextProviderSdk } from '../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../api/plugin';
import { debug } from '../logging';

/**
 * Plugin to read arbitrary SSM parameter names
 */
export class SSMContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  public async getValue(args: cxschema.SSMParameterContextQuery) {
    const region = args.region;
    const account = args.account;

    if (!('parameterName' in args)) {
      throw new Error('parameterName must be provided in props for SSMContextProviderPlugin');
    }
    const parameterName = args.parameterName;
    debug(`Reading SSM parameter ${account}:${region}:${parameterName}`);

    const response = await this.getSsmParameterValue(args);
    const parameterNotFound: boolean = !response.Parameter || response.Parameter.Value === undefined;
    const suppressError = 'ignoreErrorOnMissingContext' in args && args.ignoreErrorOnMissingContext as boolean;
    if (parameterNotFound && suppressError && 'dummyValue' in args) {
      return args.dummyValue;
    }
    if (parameterNotFound) {
      throw new Error(`SSM parameter not available in account ${account}, region ${region}: ${parameterName}`);
    }
    // will not be undefined because we've handled undefined cases above
    return response.Parameter!.Value;
  }

  /**
   * Gets the value of an SSM Parameter, while not throwin if the parameter does not exist.
   * @param account       the account in which the SSM Parameter is expected to be.
   * @param region        the region in which the SSM Parameter is expected to be.
   * @param parameterName the name of the SSM Parameter
   * @param lookupRoleArn the ARN of the lookup role.
   *
   * @returns the result of the ``GetParameter`` operation.
   *
   * @throws Error if a service error (other than ``ParameterNotFound``) occurs.
   */
  private async getSsmParameterValue(args: cxschema.SSMParameterContextQuery)
    : Promise<AWS.SSM.GetParameterResult> {
    const ssm = (await initContextProviderSdk(this.aws, args)).ssm();
    try {
      return await ssm.getParameter({ Name: args.parameterName }).promise();
    } catch (e: any) {
      if (e.code === 'ParameterNotFound') {
        return {};
      }
      throw e;
    }
  }
}
