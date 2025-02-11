import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as ecr from '../../../aws-ecr';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { Action } from '../action';

/**
 * The CodePipeline variables emitted by the InspectorScan Action.
 */
export interface InspectorScanVariables {
  /**
   * The highest severity output from the scan.
   *
   * Valid values are medium | high | critical.
   */
  readonly highestScannedSeverity: string;
}

/**
 * The mode of the scan.
 */
export enum InspectorRunMode {
  /**
   * Scan the source code.
   */
  SOURCE_CODE_SCAN = 'SourceCodeScan',
  /**
   * Scan the image in the ECR repository.
   */
  ECR_IMAGE_SCAN = 'ECRImageScan',
}

/**
 * Construction properties of the `InspectorScanAction`.
 */
export interface InspectorScanActionProps extends codepipeline.CommonAwsActionProps {
  // TODO: consider separating class into two with base class.
  /**
   * Indicates the mode of the scan.
   */
  readonly inspectorRunMode: InspectorRunMode;

  /**
   * The Amazon ECR repository where the image is pushed.
   *
   * @default - required if `inspectorRunMode` is `InspectorRunMode.ECR_IMAGE_SCAN`, otherwise not needed
   */
  readonly repository?: ecr.IRepository;

  /**
   * The tag used for the image.
   *
   * @default - latest if `inspectorRunMode` is `InspectorRunMode.ECR_IMAGE_SCAN`, otherwise no tag.
   */
  readonly imageTag?: string;

  /**
   * The number of critical severity vulnerabilities found in your source
   * beyond which CodePipeline should fail the action.
   *
   * @default - no threshold
   */
  readonly criticalThreshold?: number;

  /**
   * The number of high severity vulnerabilities found in your source
   * beyond which CodePipeline should fail the action.
   *
   * @default - no threshold
   */
  readonly highThreshold?: number;

  /**
   * The number of medium severity vulnerabilities found in your source
   * beyond which CodePipeline should fail the action.
   *
   * @default - no threshold
   */
  readonly mediumThreshold?: number;

  /**
   * The number of low severity vulnerabilities found in your source
   * beyond which CodePipeline should fail the action.
   *
   * @default - no threshold
   */
  readonly lowThreshold?: number;

  /**
   * The source code to scan for vulnerabilities.
   *
   * If the scan is for an ECR repository, this input artifact is not needed.
   *
   * @default - required if `inspectorRunMode` is `InspectorRunMode.SOURCE_CODE_SCAN`, otherwise not needed
   */
  readonly input?: codepipeline.Artifact;

  /**
   * Vulnerability details of your source in the form of a Software Bill of Materials (SBOM) file.
   */
  readonly output: codepipeline.Artifact;
}

/**
 * CodePipeline invoke action that uses AWS InspectorScan.
 */
export class InspectorScanAction extends Action {
  private readonly props: InspectorScanActionProps;

  constructor(props: InspectorScanActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.INVOKE,
      provider: 'InspectorScan',
      artifactBounds: { minInputs: 0, maxInputs: 1, minOutputs: 1, maxOutputs: 1 },
      inputs: props.input ? [props.input] : undefined,
      outputs: [props.output],
    });

    this.props = props;
  }

  /** The variables emitted by this action. */
  public get variables(): InspectorScanVariables {
    return {
      highestScannedSeverity: this.variableExpression('HighestScannedSeverity'),
    };
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#how-to-custom-role
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'inspector-scan:ScanSbom',
      ],
    }));

    if (this.props.repository) {
      options.role.addToPrincipalPolicy(new iam.PolicyStatement({
        resources: [this.props.repository.repositoryArn],
        actions: [
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'ecr:BatchCheckLayerAvailability',
        ],
      }));
    }

    const logGroupArn = cdk.Stack.of(scope).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `/aws/codepipeline/${stage.pipeline.pipelineName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
    const logGroupArnWithWildcard = `${logGroupArn}:*`;

    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArn, logGroupArnWithWildcard],
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    }));

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs ?? []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    return {
      configuration: {
        InspectorRunMode: this.props.inspectorRunMode,
        Repository: this.props.repository?.repositoryName,
        ImageTag: this.props.imageTag,
        CriticalThreshold: this.props.criticalThreshold,
        HighThreshold: this.props.highThreshold,
        MediumThreshold: this.props.mediumThreshold,
        LowThreshold: this.props.lowThreshold,
      },
    };
  }
}
