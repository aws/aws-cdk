import { IRole } from 'aws-cdk-lib/aws-iam';

/**
   * These are custom parameter to be used when the target is an API Gateway REST APIs or EventBridge ApiDestinations.
   *
   * In the latter case, these are merged with any InvocationParameters specified on the Connection, with any values from the Connection taking precedence.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html
   */
export interface EnrichmentHttpParametersProperty {
  /**
   * The headers that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-headerparameters
   * @default - none
   */
  readonly headerParameters?: Record<string, string>;

  /**
   * The path parameter values to be used to populate API Gateway REST API or EventBridge ApiDestination path wildcards ("*").
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-pathparametervalues
   * @default - none
   */
  readonly pathParameterValues?: Array<string>;

  /**
   * The query string keys/values that need to be sent as part of request invoking the API Gateway REST API or EventBridge ApiDestination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmenthttpparameters.html#cfn-pipes-pipe-pipeenrichmenthttpparameters-querystringparameters
   * @default - none
   */
  readonly queryStringParameters?: Record<string, string>;
}

/**
   * The parameters required to set up enrichment on your pipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html
   */
export interface EnrichmentParametersProperty {
  /**
   * Contains the HTTP parameters to use when the target is a API Gateway REST endpoint or EventBridge ApiDestination.
   *
   * If you specify an API Gateway REST API or EventBridge ApiDestination as a target, you can use this parameter to specify headers, path parameters, and query string keys/values as part of your target invoking request. If you're using ApiDestinations, the corresponding Connection can also have these values configured. In case of any conflicting keys, values from the Connection take precedence.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-httpparameters
   * @default - none
   */
  readonly httpParameters?: EnrichmentHttpParametersProperty;

  /**
   * Valid JSON text passed to the enrichment.
   *
   * In this case, nothing from the event itself is passed to the enrichment. For more information, see [The JavaScript Object Notation (JSON) Data Interchange Format](https://docs.aws.amazon.com/http://www.rfc-editor.org/rfc/rfc7159.txt) .
   *
   * To remove an input template, specify an empty string.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipeenrichmentparameters.html#cfn-pipes-pipe-pipeenrichmentparameters-inputtemplate
   * @default - none
   */
  readonly inputTemplate?: string;
}

/**
 * Enrichment step to enhance the data from the source before sending it to the target.
 */
export interface IEnrichment {
  /**
   * The ARN of the enrichment resource.
   *
   * Length Constraints: Minimum length of 0. Maximum length of 1600.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichment
   */
  readonly enrichmentArn: string;

  /**
   * The parameters required to set up enrichment on your pipe.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pipes-pipe.html#cfn-pipes-pipe-enrichmentparameters
   */
  readonly enrichmentParameters: EnrichmentParametersProperty;

  /**
   * Grant the pipes role to invoke the enrichment.
   */
  grantInvoke(grantee: IRole): void;
}

/**
 * Enrichment step to enhance the data from the source before sending it to the target.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/pipes-enrichment.html
 */
export abstract class Enrichment implements IEnrichment {
  public readonly enrichmentArn: string;
  public readonly enrichmentParameters: EnrichmentParametersProperty;

  constructor(
    enrichmentArn: string,
    props: EnrichmentParametersProperty,
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
