import { Arn, Resource, Stack, Token } from 'aws-cdk-lib';
import { Grant } from 'aws-cdk-lib/aws-iam';
import type { IGrantable } from 'aws-cdk-lib/aws-iam';
import type { IPipeline, PipelineReference } from 'aws-cdk-lib/aws-sagemaker';
import { ValidationError } from 'aws-cdk-lib/core/lib/errors';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';

/**
 * Validates a SageMaker Pipeline name according to AWS requirements.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-sagemaker-pipeline.html#cfn-sagemaker-pipeline-pipelinename
 *
 * @param pipelineName The pipeline name to validate
 * @param scope The construct scope for error reporting
 * @throws ValidationError if the pipeline name is invalid
 */
function validatePipelineName(pipelineName: string, scope: Construct): void {
  // Skip validation for CDK tokens
  if (Token.isUnresolved(pipelineName)) {
    return;
  }

  // Check length constraints (1-256 characters)
  if (!pipelineName || pipelineName.length === 0 || pipelineName.length > 256) {
    throw new ValidationError(`Invalid pipeline name: "${pipelineName}". Pipeline name must be between 1-256 characters.`, scope);
  }

  // Pattern from AWS docs: ^[a-zA-Z0-9](-*[a-zA-Z0-9])*$
  if (!/^[a-zA-Z0-9](-*[a-zA-Z0-9])*$/.test(pipelineName)) {
    throw new ValidationError(`Invalid pipeline name: "${pipelineName}". Pipeline name must match pattern: ^[a-zA-Z0-9](-*[a-zA-Z0-9])*$`, scope);
  }
}

/**
 * Attributes for importing a SageMaker Pipeline
 */
export interface PipelineAttributes {
  /**
   * The ARN of the pipeline
   * @default - Either this or pipelineName must be provided
   */
  readonly pipelineArn?: string;

  /**
   * The name of the pipeline
   * @default - Either this or pipelineArn must be provided
   */
  readonly pipelineName?: string;

  /**
   * The account the pipeline is in
   * @default - same account as the stack
   */
  readonly account?: string;

  /**
   * The region the pipeline is in
   * @default - same region as the stack
   */
  readonly region?: string;
}

/**
 * Properties for defining a SageMaker Pipeline
 */
export interface PipelineProps {
  /**
   * The physical name of the pipeline
   * @default - CDK generated name
   */
  readonly pipelineName?: string;
}

/**
 * A SageMaker Pipeline
 *
 * @resource AWS::SageMaker::Pipeline
 */
@propertyInjectable
export class Pipeline extends Resource implements IPipeline {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-sagemaker-alpha.Pipeline';

  /**
   * Import a pipeline from its ARN
   *
   * @param scope The parent construct
   * @param id The construct id
   * @param pipelineArn The ARN of the pipeline
   */
  public static fromPipelineArn(scope: Construct, id: string, pipelineArn: string): IPipeline {
    return Pipeline.fromPipelineAttributes(scope, id, { pipelineArn });
  }

  /**
   * Import a pipeline from its name
   *
   * For this to work, the pipeline must be in the same account and region as the stack.
   *
   * @param scope The parent construct
   * @param id The construct id
   * @param pipelineName The name of the pipeline
   */
  public static fromPipelineName(scope: Construct, id: string, pipelineName: string): IPipeline {
    return Pipeline.fromPipelineAttributes(scope, id, { pipelineName });
  }

  /**
   * Import a pipeline from attributes
   *
   * @param scope The parent construct
   * @param id The construct id
   * @param attrs The attributes of the pipeline to import
   */
  public static fromPipelineAttributes(scope: Construct, id: string, attrs: PipelineAttributes): IPipeline {
    const stack = Stack.of(scope);

    // Determine pipeline name and ARN
    let pipelineName: string;
    let pipelineArn: string;

    if (attrs.pipelineArn) {
      pipelineArn = attrs.pipelineArn;
      pipelineName = Arn.extractResourceName(pipelineArn, 'pipeline');
    } else if (attrs.pipelineName !== undefined) {
      pipelineName = attrs.pipelineName;
      // Validate pipeline name format
      validatePipelineName(pipelineName, scope);

      pipelineArn = stack.formatArn({
        service: 'sagemaker',
        resource: 'pipeline',
        resourceName: pipelineName,
        account: attrs.account,
        region: attrs.region,
      });
    } else {
      throw new ValidationError('Either pipelineArn or pipelineName must be provided', scope);
    }

    class Import extends Resource implements IPipeline {
      public readonly pipelineArn = pipelineArn;
      public readonly pipelineName = pipelineName;

      public get pipelineRef(): PipelineReference {
        return { pipelineName: this.pipelineName };
      }

      public grantStartPipelineExecution(grantee: IGrantable): Grant {
        return Grant.addToPrincipal({
          grantee,
          actions: ['sagemaker:StartPipelineExecution'],
          resourceArns: [this.pipelineArn],
        });
      }
    }

    return new Import(scope, id, {
      account: attrs.account,
      region: attrs.region,
    });
  }

  /**
   * The ARN of the pipeline.
   */
  public readonly pipelineArn!: string;

  /**
   * The name of the pipeline.
   */
  public readonly pipelineName!: string;

  /**
   * A reference to this pipeline.
   */
  public get pipelineRef(): PipelineReference {
    return { pipelineName: this.pipelineName };
  }

  /**
   * Create a new Pipeline (not supported - use import methods instead)
   * @internal
   */
  constructor(scope: Construct, id: string, props?: PipelineProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    // Suppress unused parameter warning
    void props;
    throw new ValidationError('Pipeline construct cannot be instantiated directly. Use Pipeline.fromPipelineArn() or Pipeline.fromPipelineName() to import existing pipelines.', scope);
  }

  /**
   * Permits an IAM principal to start this pipeline execution
   * @param grantee The principal to grant access to
   */
  @MethodMetadata()
  public grantStartPipelineExecution(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions: ['sagemaker:StartPipelineExecution'],
      resourceArns: [this.pipelineArn],
    });
  }
}
