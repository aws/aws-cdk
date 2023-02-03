import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Mode } from '../../api/aws-auth/credentials';
import { SdkProvider } from '../../api/aws-auth/sdk-provider';
import { ContextProviderPlugin } from '../../api/plugin';

export class AnalysisContextProviderPlugin implements ContextProviderPlugin {
  constructor(private readonly aws: SdkProvider) {
  }

  async getValue(args: cxschema.QuickSightAnalysisContextQuery): Promise<cxapi.AnalysisContextResponse> {

    const options = { assumeRoleArn: args.lookupRoleArn };

    const quickSight = (await this.aws.forEnvironment(
      cxapi.EnvironmentUtils.make(args.account, args.region),
      Mode.ForReading,
      options,
    )).sdk.quickSight();

    const response = await quickSight.describeAnalysis({
      AwsAccountId: args.account,
      AnalysisId: args.analysisId,
    }).promise();

    const analysis = response.Analysis;

    if (!analysis) {
      throw new Error(`No Analysis found in account ${args.account} with id ${args.analysisId}`);
    }

    return analysis;
  }
}