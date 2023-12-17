import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

/**
 * Enrichment step to enhance the data from the source before sending it to the target.
 */
export interface IPipeEnrichment {
  /**
   * The ARN of the enrichment resource.
   *
   * Length Constraints: Minimum length of 0. Maximum length of 1600.
   */
  readonly enrichmentArn: string;

  /**
   * The parameters required to set up enrichment on your pipe.
   */
  readonly enrichmentParameters: CfnPipe.PipeEnrichmentParametersProperty;

  /**
   * Grant the pipes role to invoke the enrichment.
   */
  grantInvoke(grantee: IRole): void;
}

/**
 * Enrichment step to enhance the data from the source before sending it to the target.
 */
export abstract class PipeEnrichment implements IPipeEnrichment {
  public readonly enrichmentArn: string;
  public readonly enrichmentParameters: CfnPipe.PipeEnrichmentParametersProperty;

  constructor(
    enrichmentArn: string,
    props: CfnPipe.PipeEnrichmentParametersProperty,
  ) {
    this.enrichmentParameters = props;
    // TODO - validate ARN is a valid enrichment ARN based on regex from cfn
    this.enrichmentArn = enrichmentArn;
  }
  /**
   * Grant the pipes role to invoke the enrichment.
   */
  abstract grantInvoke(grantee: IRole): void;
}
