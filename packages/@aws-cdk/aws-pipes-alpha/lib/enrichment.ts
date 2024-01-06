import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { IPipe } from '.';

/**
 * The parameters required to set up enrichment on your pipe.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html
 */
export interface EnrichmentParametersConfig {

  /**
   * The parameters for the enrichment target.
   */
  readonly enrichmentParameters: CfnPipe.PipeEnrichmentParametersProperty;

  /**
   * The ARN of the enrichment resource.
   *
   * Length Constraints: Minimum length of 0. Maximum length of 1600.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichment
   */
  readonly enrichmentArn: string;
}

/**
 * Enrichment step to enhance the data from the source before sending it to the target.
 */
export interface IEnrichment {
  /**
   * Grant the pipes role to invoke the enrichment.
   */
  grantInvoke(grantee: IRole): void;

  /**
   * Bind this enrichment to a pipe.
   */
  bind(pipe: IPipe): EnrichmentParametersConfig;
}

