import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
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
 * Base construction properties of the `InspectorScanAction`.
 */
export interface BaseInspectorScanActionProps extends codepipeline.CommonAwsActionProps {
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
   * Vulnerability details of your source in the form of a Software Bill of Materials (SBOM) file.
   */
  readonly output: codepipeline.Artifact;
}

/**
 * CodePipeline invoke action that uses AWS InspectorScan.
 */
export abstract class BaseInspectorScanAction extends Action {
  protected readonly props: BaseInspectorScanActionProps;

  constructor(props: BaseInspectorScanActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.INVOKE,
      provider: 'InspectorScan',
      artifactBounds: { minInputs: 0, maxInputs: 1, minOutputs: 1, maxOutputs: 1 },
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

  protected abstract getActionConfiguration(): Record<string, any>;

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#how-to-custom-role
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'inspector-scan:ScanSbom',
      ],
    }));

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

    // allow the Role access to the Bucket for outputs
    if ((this.actionProperties.outputs ?? []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    return {
      configuration: {
        ...this.getActionConfiguration(),
        CriticalThreshold: this.props.criticalThreshold,
        HighThreshold: this.props.highThreshold,
        MediumThreshold: this.props.mediumThreshold,
        LowThreshold: this.props.lowThreshold,
      },
    };
  }
}
