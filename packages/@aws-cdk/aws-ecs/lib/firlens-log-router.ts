import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { TaskDefinition } from './base/task-definition';
import { ContainerDefinition, ContainerDefinitionOptions, ContainerDefinitionProps } from "./container-definition";
import { ContainerImage } from './container-image';
import { CfnTaskDefinition } from './ecs.generated';
import { LogDriverConfig } from './log-drivers/log-driver';

/**
 * Firelens log router type, fluentbit or fluentd.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html
 */
export enum FirelensLogRouterType {
  /**
   * fluentbit
   */
  FLUENTBIT = 'fluentbit',

  /**
   * fluentd
   */
  FLUENTD = 'fluentd',
}

/**
 * Firelens configuration file type, s3 or file path.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef-customconfig
 */
export enum FirelensConfigFileType {
  /**
   * s3
   */
  S3 = 's3',

  /**
   * fluentd
   */
  FILE = 'file',
}

/**
 * The options for firelens log router
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef-customconfig
 */
export interface FirelensOptions {
  /**
   * By default, Amazon ECS adds additional fields in your log entries that help identify the source of the logs.
   * You can disable this action by setting enable-ecs-log-metadata to false.
   * @default - true
   */
  readonly enableECSLogMetadata?: boolean;

  /**
   * Custom configuration file, s3 or file
   * @default - determined by checking configFileValue with S3 ARN.
   */
  readonly configFileType?: FirelensConfigFileType;

  /**
   * Custom configuration file, S3 ARN or a file path
   */
  readonly configFileValue: string;
}

/**
 * Firelens Configuration
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef
 */
export interface FirelensConfig {

  /**
   * The log router to use
   * @default - fluentbit
   */
  readonly type: FirelensLogRouterType;

  /**
   * Firelens options
   * @default - no additional options
   */
  readonly options?: FirelensOptions;
}

/**
 * The properties in a firelens log router.
 */
export interface FirelensLogRouterProps extends ContainerDefinitionProps {
  /**
   * Firelens configuration
   */
  readonly firelensConfig: FirelensConfig;
}

/**
 * The options for creating a firelens log router.
 */
export interface FirelensLogRouterDefinitionOptions extends ContainerDefinitionOptions {
  /**
   * Firelens configuration
   */
  readonly firelensConfig: FirelensConfig;
}

/**
 * Render to CfnTaskDefinition.FirelensConfigurationProperty from FirelensConfig
 */
function renderFirelensConfig(firelensConfig: FirelensConfig): CfnTaskDefinition.FirelensConfigurationProperty {
  if (!firelensConfig.options) {
    return { type: firelensConfig.type };
  } else {
    const enableECSLogMetadata = firelensConfig.options.enableECSLogMetadata || firelensConfig.options.enableECSLogMetadata === undefined ? 'true' : 'false';
    const configFileType = firelensConfig.options.configFileType || /arn:aws[a-zA-Z-]*:s3:::.+/.test(firelensConfig.options.configFileValue)
      ? FirelensConfigFileType.S3 : FirelensConfigFileType.FILE;
    return {
      type: firelensConfig.type,
      options: {
        'enable-ecs-log-metadata': enableECSLogMetadata,
        'config-file-type': configFileType,
        'config-file-value': firelensConfig.options.configFileValue
      }
    };
  }
}

/**
 * Fluent Bit images in Amazon ECR
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-using-fluentbit
 */
const regFluentBitECRImageMapping: { [region: string]: string } = {
  'us-east-1': '906394416424.dkr.ecr.us-east-1.amazonaws.com/aws-for-fluent-bit:latest',
  'us-east-2': '906394416424.dkr.ecr.us-east-2.amazonaws.com/aws-for-fluent-bit:latest',
  'us-west-1': '906394416424.dkr.ecr.us-west-1.amazonaws.com/aws-for-fluent-bit:latest',
  'us-west-2': '906394416424.dkr.ecr.us-west-2.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-east-1': '449074385750.dkr.ecr.ap-east-1.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-south-1': '906394416424.dkr.ecr.ap-south-1.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-northeast-2': '906394416424.dkr.ecr.ap-northeast-2.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-southeast-1': '906394416424.dkr.ecr.ap-southeast-1.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-southeast-2': '906394416424.dkr.ecr.ap-southeast-2.amazonaws.com/aws-for-fluent-bit:latest',
  'ap-northeast-1': '906394416424.dkr.ecr.ap-northeast-1.amazonaws.com/aws-for-fluent-bit:latest',
  'ca-central-1': '906394416424.dkr.ecr.ca-central-1.amazonaws.com/aws-for-fluent-bit:latest',
  'eu-central-1': '906394416424.dkr.ecr.eu-central-1.amazonaws.com/aws-for-fluent-bit:latest',
  'eu-west-1': '906394416424.dkr.ecr.eu-west-1.amazonaws.com/aws-for-fluent-bit:latest',
  'eu-west-2': '906394416424.dkr.ecr.eu-west-2.amazonaws.com/aws-for-fluent-bit:latest',
  'eu-west-3': '906394416424.dkr.ecr.eu-west-3.amazonaws.com/aws-for-fluent-bit:latest',
  'eu-north-1': '906394416424.dkr.ecr.eu-north-1.amazonaws.com/aws-for-fluent-bit:latest',
  'me-south-1': '741863432321.dkr.ecr.me-south-1.amazonaws.com/aws-for-fluent-bit:latest',
  'sa-east-1': '906394416424.dkr.ecr.sa-east-1.amazonaws.com/aws-for-fluent-bit:latest',
  'us-gov-east-1': '161423150738.dkr.ecr.us-gov-east-1.amazonaws.com/aws-for-fluent-bit:latest',
  'us-gov-west-1': '161423150738.dkr.ecr.us-gov-west-1.amazonaws.com/aws-for-fluent-bit:latest',
  'cn-north-1': '128054284489.dkr.ecr.cn-north-1.amazonaws.com.cn/aws-for-fluent-bit:latest',
  'cn-northwest-1': '128054284489.dkr.ecr.cn-northwest-1.amazonaws.com.cn/aws-for-fluent-bit:latest',
};

/**
 * Get static fluentbit image URI if region has been specified,
 * or build Fn::FindInMap to get Fluent Bit image in Amazon ECR if stack.region is unresolved (region agnostic),
 * TODO: retrieve image with SSM parameters, like EKS optimized AMI.
 */
function retrieveFluentBitECRImage(stack: cdk.Stack): string {
  if (cdk.Token.isUnresolved(stack.region)) {
    /**
     * Build Fn::FindInMap to get Fluent Bit image in Amazon ECR if stack.region is unresolved (region agnostic),
     * find existed cfn mapping to avoid duplicated mapping in cfn.
     */

    const imageMappingId = 'FluentBitECRImageMapping';
    let cfnRegFluentBitECRImageMapping = stack.node.tryFindChild(imageMappingId) as cdk.CfnMapping;
    if (!cfnRegFluentBitECRImageMapping) {
      // Transform {region: image} to {region: {image: $image}} and create CFN Mappings and Fn::FindInMap
      cfnRegFluentBitECRImageMapping = new cdk.CfnMapping(stack, imageMappingId, {
        mapping: Object.entries(regFluentBitECRImageMapping).reduce((ret, [region, image]) => ({ ...ret, [region]: { image } }), {})
      });
    }
    return cfnRegFluentBitECRImageMapping.findInMap(stack.region, 'image');
  } else {
    return regFluentBitECRImageMapping[stack.region];
  }
}

/**
 * Obtain Fluent Bit image in Amazon ECR build and setup corresponding IAM permissions.
 * Fluent Bit image will be static URI if region has been specified in this stack,
 * or build Fn::FindInMap to get Fluent Bit image in Amazon ECR.
 * ECR image pull permissions will be granted in task execution role.
 * Cloudwatch logs or Firehose permissions will be grant by check options in logDriverConfig.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-using-fluentbit
 */
export function obtainDefaultFluentBitECRImage(task: TaskDefinition, logDriverConfig?: LogDriverConfig): ContainerImage {
  // grant ECR image pull permissions to executor role
  task.addToExecutionRolePolicy(new iam.PolicyStatement({
    actions: [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ],
    resources: ['*']
  }));

  // grant cloudwatch or firehose permissions to task role
  const logName = logDriverConfig && logDriverConfig.logDriver === 'awsfirelens'
    && logDriverConfig.options && logDriverConfig.options.Name;
  if (logName === 'cloudwatch') {
    task.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:DescribeLogStreams',
        'logs:PutLogEvents'
      ],
      resources: ['*']
    }));
  } else if (logName === 'firehose') {
    task.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: [
        'firehose:PutRecordBatch',
      ],
      resources: ['*']
    }));
  }

  const fluentbitImage = retrieveFluentBitECRImage(cdk.Stack.of(task));

  // Not use ContainerImage.fromEcrRepository since it's not support parsing ECR repo URI,
  // use repo ARN might result in complex Fn:: functions in cloudformation template.
  return ContainerImage.fromRegistry(fluentbitImage);
}

/**
 * Firelens log router
 */
export class FirelensLogRouter extends ContainerDefinition {

  /**
   * Firelens configuration
   */
  public readonly firelensConfig: FirelensConfig;

  /**
   * Constructs a new instance of the ContainerDefinition class.
   */
  constructor(scope: cdk.Construct, id: string, props: FirelensLogRouterProps) {
    super(scope, id, props);
    this.firelensConfig = props.firelensConfig;
  }

  /**
   * Render this container definition to a CloudFormation object
   */
  public renderContainerDefinition(taskDefinition?: TaskDefinition): CfnTaskDefinition.ContainerDefinitionProperty {
    return {
      ...(super.renderContainerDefinition(taskDefinition)),
      firelensConfiguration: this.firelensConfig && renderFirelensConfig(this.firelensConfig),
    };
  }
}
