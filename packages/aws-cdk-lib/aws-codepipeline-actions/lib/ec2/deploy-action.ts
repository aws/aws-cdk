import { Construct } from 'constructs';
import * as codepipeline from '../../../aws-codepipeline';
import * as elbv2 from '../../../aws-elasticloadbalancingv2';
import * as iam from '../../../aws-iam';
import { ArnFormat, Stack, Token, Tokenization, UnscopedValidationError, ValidationError } from '../../../core';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of `Ec2DeployAction`.
 */
export interface Ec2DeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The input artifact to deploy to EC2 instances.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The tag key of the instances that you created in Amazon EC2.
   */
  readonly instanceTagKey: string;

  /**
   * The tag value of the instances that you created in Amazon EC2.
   * @default - all instances with `instanceTagKey` will be matched
   */
  readonly instanceTagValue?: string;

  /**
   * The type of instances or SSM nodes created in Amazon EC2.
   *
   * You must have already created, tagged, and installed the SSM agent on all instances.
   */
  readonly instanceType: Ec2InstanceType;

  /**
   * The deploy specifications.
   */
  readonly deploySpecifications: Ec2DeploySpecifications;

  /**
   * The number or percentage of instances that can deploy in parallel.
   *
   * @default - No configuration
   */
  readonly maxBatch?: Ec2MaxInstances;

  /**
   * Stop the task after the task fails on the specified number or percentage of instances.
   *
   * @default - No configuration
   */
  readonly maxError?: Ec2MaxInstances;

  /**
   * The list of target groups for deployment. You must have already created the target groups.
   *
   * Target groups provide a set of instances to process specific requests.
   * If the target group is specified, instances will be removed from the target group before deployment and added back to the target group after deployment.
   *
   * @default - No target groups
   */
  readonly targetGroups?: elbv2.ITargetGroup[];
}

/**
 * The type of instances or SSM nodes created in Amazon EC2.
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-EC2Deploy.html#action-reference-EC2Deploy-parameters
 */
export enum Ec2InstanceType {
  /** Amazon EC2 instances */
  EC2 = 'EC2',
  /** AWS System Manager (SSM) managed nodes */
  SSM_MANAGED_NODE = 'SSM_MANAGED_NODE',
}

/**
 * Properties of `Ec2DeploySpecifications.inline()`.
 */
export interface Ec2DeploySpecificationsInlineProps {
  /**
   * The location of the target directory you want to deploy to.
   * Use an absolute path like `/home/ec2-user/deploy`.
   */
  readonly targetDirectory: string;

  /**
   * Path to the executable script file that runs BEFORE the Deploy phase.
   * It should start from the root directory of your uploaded source artifact.
   * Use an absolute path like `uploadDir/preScript.sh`.
   *
   * @default - No script
   */
  readonly preScript?: string;

  /**
   * Path to the executable script file that runs AFTER the Deploy phase.
   * It should start from the root directory of your uploaded source artifact.
   * Use an absolute path like `uploadDir/postScript.sh`.
   */
  readonly postScript: string;
}

/**
 * A deploy specifications for EC2 deploy action.
 */
export abstract class Ec2DeploySpecifications {
  /**
   * Store deploy specifications as action configurations.
   */
  public static inline(props: Ec2DeploySpecificationsInlineProps): Ec2DeploySpecifications {
    return new Ec2DeploySpecificationsInline(props);
  }

  /**
   * The callback invoked when this deploy specifications is bound to an action.
   *
   * @param scope the Construct tree scope
   * @returns the action configurations
   */
  abstract bind(scope: Construct): any;
}

class Ec2DeploySpecificationsInline extends Ec2DeploySpecifications {
  constructor(private readonly props: Ec2DeploySpecificationsInlineProps) {
    super();
  }

  bind(scope: Construct) {
    if (!Token.isUnresolved(this.props.targetDirectory) && !this.props.targetDirectory.startsWith('/')) {
      throw new ValidationError('The targetDirectory must be an absolute path.', scope);
    }

    return {
      TargetDirectory: this.props.targetDirectory,
      PreScript: this.props.preScript,
      PostScript: this.props.postScript,
    };
  }
}

/**
 * Number or percentage of max instances for EC2 deploy action.
 */
export abstract class Ec2MaxInstances {
  /**
   * Max number of instances.
   *
   * Valid range: from 1 to number of your instances
   */
  public static targets(targets: number): Ec2MaxInstances {
    if (!Token.isUnresolved(targets) && !(targets >= 1 && Number.isInteger(targets))) {
      throw new UnscopedValidationError(`targets must be a positive integer. got ${targets}`);
    }
    return { value: Tokenization.stringifyNumber(targets) };
  }

  /**
   * Max percentage of instances.
   *
   * Valid range: from 1 to 100
   */
  public static percentage(percentage: number): Ec2MaxInstances {
    if (!Token.isUnresolved(percentage) && !(percentage >= 1 && percentage <= 100 && Number.isInteger(percentage))) {
      throw new UnscopedValidationError(`percentage must be a positive integer between 1 and 100. got ${percentage}`);
    }
    return { value: `${Tokenization.stringifyNumber(percentage)}%` };
  }

  /** Template value */
  abstract readonly value: string;
}

/**
 * CodePipeline Action to deploy EC2 instances.
 */
export class Ec2DeployAction extends Action {
  constructor(private readonly props: Ec2DeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'EC2',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    if (Token.isUnresolved(this.props.instanceTagKey)) {
      throw new ValidationError('The instanceTagKey must be a non-empty concrete value.', scope);
    }

    // Permissions based on CodePipeline documentation:
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-EC2Deploy.html#action-reference-EC2Deploy-permissions-action

    // Statement with all resources. See the Service Authorization Reference for details.
    // https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html
    // https://docs.aws.amazon.com/service-authorization/latest/reference/list_awselasticloadbalancingv2.html
    // https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssystemsmanager.html
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'ec2:DescribeInstances',
        'elasticloadbalancing:DescribeTargetGroupAttributes',
        'elasticloadbalancing:DescribeTargetGroups',
        'elasticloadbalancing:DescribeTargetHealth',
        'ssm:CancelCommand',
        'ssm:DescribeInstanceInformation',
        'ssm:ListCommandInvocations',
      ],
      resources: ['*'],
    }));
    // Statement for logs
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: [Stack.of(scope).formatArn({
        service: 'logs',
        resource: 'log-group',
        resourceName: `/aws/codepipeline/${stage.pipeline.pipelineName}:*`,
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      })],
    }));
    // Statement for SSM on tagged instances
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ssm:SendCommand'],
      resources: [Stack.of(scope).formatArn({ service: 'ec2', resource: 'instance', resourceName: '*' })],
      conditions: this.props.instanceTagValue ?
        { StringEquals: { [`aws:ResourceTag/${this.props.instanceTagKey}`]: this.props.instanceTagValue } } :
        { Null: { [`aws:ResourceTag/${this.props.instanceTagKey}`]: 'false' } },
    }));
    // Statement for SSM approved documents
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ssm:SendCommand'],
      resources: [
        Stack.of(scope).formatArn({ service: 'ssm', account: '', resource: 'document/AWS-RunPowerShellScript' }),
        Stack.of(scope).formatArn({ service: 'ssm', account: '', resource: 'document/AWS-RunShellScript' }),
      ],
    }));

    // Statement for Elastic Load Balancing
    if (this.props.targetGroups?.length) {
      options.role.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['elasticloadbalancing:DeregisterTargets', 'elasticloadbalancing:RegisterTargets'],
        resources: this.props.targetGroups.map((tg) => tg.targetGroupArn),
      }));
    }

    return {
      configuration: {
        InstanceTagKey: this.props.instanceTagKey,
        InstanceTagValue: this.props.instanceTagValue,
        InstanceType: this.props.instanceType,
        MaxBatch: this.props.maxBatch?.value,
        MaxError: this.props.maxError?.value,
        TargetGroupNameList: this.props.targetGroups?.length ? this.props.targetGroups.map((tg) => tg.targetGroupName).join(',') : undefined,
        ...this.props.deploySpecifications.bind(scope),
      },
    };
  }
}
