import { Construct } from 'constructs';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { IPipeline } from 'aws-cdk-lib/aws-sagemaker';
import { Arn, Resource, Stack, Token } from 'aws-cdk-lib';
import { ValidationError } from 'aws-cdk-lib/core/lib/errors';

/**
 * Validates a SageMaker Pipeline name according to AWS requirements
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
    throw new ValidationError(`Invalid pipeline name format: ${pipelineName}. Pipeline name must be between 1-256 characters.`, scope);
  }

  // Check character pattern: must start and end with alphanumeric, can contain hyphens
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(pipelineName)) {
    throw new ValidationError(`Invalid pipeline name format: ${pipelineName}. Must start and end with alphanumeric characters, can contain hyphens but not consecutive hyphens, underscores, dots, or spaces.`, scope);
  }

  // Check for consecutive hyphens (not allowed)
  if (pipelineName.includes('--')) {
    throw new ValidationError(`Invalid pipeline name format: ${pipelineName}. Cannot contain consecutive hyphens.`, scope);
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
export class Pipeline extends Resource implements IPipeline {
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
   * Create a new Pipeline (not supported - use import methods instead)
   * @internal
   */
  constructor(scope: Construct, id: string, props?: PipelineProps) {
    super(scope, id);
    // Suppress unused parameter warning
    void props;
    throw new ValidationError('Pipeline construct cannot be instantiated directly. Use Pipeline.fromPipelineArn() or Pipeline.fromPipelineName() to import existing pipelines.', scope);
  }

  /**
   * Permits an IAM principal to start this pipeline execution
   * @param grantee The principal to grant access to
   */
  public grantStartPipelineExecution(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions: ['sagemaker:StartPipelineExecution'],
      resourceArns: [this.pipelineArn],
    });
  }
}
