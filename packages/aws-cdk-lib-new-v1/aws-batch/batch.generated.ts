/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Batch::ComputeEnvironment` resource defines your AWS Batch compute environment.
 *
 * You can define `MANAGED` or `UNMANAGED` compute environments. `MANAGED` compute environments can use Amazon EC2 or AWS Fargate resources. `UNMANAGED` compute environments can only use EC2 resources. For more information, see [Compute Environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) in the ** .
 *
 * In a managed compute environment, AWS Batch manages the capacity and instance types of the compute resources within the environment. This is based on the compute resource specification that you define or the [launch template](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html) that you specify when you create the compute environment. You can choose either to use EC2 On-Demand Instances and EC2 Spot Instances, or to use Fargate and Fargate Spot capacity in your managed compute environment. You can optionally set a maximum price so that Spot Instances only launch when the Spot Instance price is below a specified percentage of the On-Demand price.
 *
 * > Multi-node parallel jobs are not supported on Spot Instances.
 *
 * In an unmanaged compute environment, you can manage your own EC2 compute resources and have a lot of flexibility with how you configure your compute resources. For example, you can use custom AMI. However, you need to verify that your AMI meets the Amazon ECS container instance AMI specification. For more information, see [container instance AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container_instance_AMIs.html) in the *Amazon Elastic Container Service Developer Guide* . After you have created your unmanaged compute environment, you can use the [DescribeComputeEnvironments](https://docs.aws.amazon.com/batch/latest/APIReference/API_DescribeComputeEnvironments.html) operation to find the Amazon ECS cluster that is associated with it. Then, manually launch your container instances into that Amazon ECS cluster. For more information, see [Launching an Amazon ECS container instance](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_container_instance.html) in the *Amazon Elastic Container Service Developer Guide* .
 *
 * > To create a compute environment that uses EKS resources, the caller must have permissions to call `eks:DescribeCluster` . > AWS Batch doesn't upgrade the AMIs in a compute environment after it's created except under specific conditions. For example, it doesn't automatically update the AMIs when a newer version of the Amazon ECS optimized AMI is available. Therefore, you're responsible for the management of the guest operating system (including updates and security patches) and any additional application software or utilities that you install on the compute resources. There are two ways to use a new AMI for your AWS Batch jobs. The original method is to complete these steps:
 * >
 * > - Create a new compute environment with the new AMI.
 * > - Add the compute environment to an existing job queue.
 * > - Remove the earlier compute environment from your job queue.
 * > - Delete the earlier compute environment.
 * >
 * > In April 2022, AWS Batch added enhanced support for updating compute environments. For example, the `UpdateComputeEnvironent` API lets you use the `ReplaceComputeEnvironment` property to dynamically update compute environment parameters such as the launch template or instance type without replacement. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
 * >
 * > To use the enhanced updating of compute environments to update AMIs, follow these rules:
 * >
 * > - Either do not set the [ServiceRole](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-servicerole) property or set it to the *AWSServiceRoleForBatch* service-linked role.
 * > - Set the [AllocationStrategy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-allocationstrategy) property to `BEST_FIT_PROGRESSIVE` or `SPOT_CAPACITY_OPTIMIZED` .
 * > - Set the [ReplaceComputeEnvironment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment) property to `false` .
 * >
 * > > Set the `ReplaceComputeEnvironment` property to `true` if the compute environment uses the `BEST_FIT` allocation strategy. > If the `ReplaceComputeEnvironment` property is set to `false` , you might receive an error message when you update the CFN template for a compute environment. This issue occurs if the updated `desiredvcpus` value is less than the current `desiredvcpus` value. As a workaround, delete the `desiredvcpus` value from the updated template or use the `minvcpus` property to manage the number of vCPUs. For information, see [Error message when you update the `DesiredvCpus` setting](https://docs.aws.amazon.com/batch/latest/userguide/troubleshooting.html#error-desired-vcpus-update) .
 * > - Set the [UpdateToLatestImageVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-updatetolatestimageversion) property to `true` . This property is used when you update a compute environment. The [UpdateToLatestImageVersion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-updatetolatestimageversion) property is ignored when you create a compute environment.
 * > - Either do not specify an image ID in [ImageId](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-imageid) or [ImageIdOverride](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-ec2configurationobject.html#cfn-batch-computeenvironment-ec2configurationobject-imageidoverride) properties, or in the launch template identified by the [Launch Template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-launchtemplate) property. In that case AWS Batch will select the latest Amazon ECS optimized AMI supported by AWS Batch at the time the infrastructure update is initiated. Alternatively you can specify the AMI ID in the `ImageId` or `ImageIdOverride` properties, or the launch template identified by the `LaunchTemplate` properties. Changing any of these properties will trigger an infrastructure update.
 * >
 * > If these rules are followed, any update that triggers an infrastructure update will cause the AMI ID to be re-selected. If the [Version](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html#cfn-batch-computeenvironment-launchtemplatespecification-version) property of the [LaunchTemplateSpecification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html) is set to `$Latest` or `$Default` , the latest or default version of the launch template will be evaluated up at the time of the infrastructure update, even if the `LaunchTemplateSpecification` was not updated.
 *
 * @cloudformationResource AWS::Batch::ComputeEnvironment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html
 */
export class CfnComputeEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Batch::ComputeEnvironment";

  /**
   * Build a CfnComputeEnvironment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnComputeEnvironment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnComputeEnvironmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnComputeEnvironment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the compute environment ARN, such as `batch: *us-east-1* : *111122223333* :compute-environment/ *ComputeEnvironmentName*` .
   *
   * @cloudformationAttribute ComputeEnvironmentArn
   */
  public readonly attrComputeEnvironmentArn: string;

  /**
   * The name for your compute environment.
   */
  public computeEnvironmentName?: string;

  /**
   * The ComputeResources property type specifies details of the compute resources managed by the compute environment.
   */
  public computeResources?: CfnComputeEnvironment.ComputeResourcesProperty | cdk.IResolvable;

  /**
   * The details for the Amazon EKS cluster that supports the compute environment.
   */
  public eksConfiguration?: CfnComputeEnvironment.EksConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether the compute environment is replaced if an update is made that requires replacing the instances in the compute environment.
   */
  public replaceComputeEnvironment?: boolean | cdk.IResolvable;

  /**
   * The full Amazon Resource Name (ARN) of the IAM role that allows AWS Batch to make calls to other AWS services on your behalf.
   */
  public serviceRole?: string;

  /**
   * The state of the compute environment.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags applied to the compute environment.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The type of the compute environment: `MANAGED` or `UNMANAGED` .
   */
  public type: string;

  /**
   * The maximum number of vCPUs for an unmanaged compute environment.
   */
  public unmanagedvCpus?: number;

  /**
   * Specifies the infrastructure update policy for the compute environment.
   */
  public updatePolicy?: cdk.IResolvable | CfnComputeEnvironment.UpdatePolicyProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnComputeEnvironmentProps) {
    super(scope, id, {
      "type": CfnComputeEnvironment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);

    this.attrComputeEnvironmentArn = cdk.Token.asString(this.getAtt("ComputeEnvironmentArn", cdk.ResolutionTypeHint.STRING));
    this.computeEnvironmentName = props.computeEnvironmentName;
    this.computeResources = props.computeResources;
    this.eksConfiguration = props.eksConfiguration;
    this.replaceComputeEnvironment = props.replaceComputeEnvironment;
    this.serviceRole = props.serviceRole;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Batch::ComputeEnvironment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
    this.unmanagedvCpus = props.unmanagedvCpus;
    this.updatePolicy = props.updatePolicy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "computeEnvironmentName": this.computeEnvironmentName,
      "computeResources": this.computeResources,
      "eksConfiguration": this.eksConfiguration,
      "replaceComputeEnvironment": this.replaceComputeEnvironment,
      "serviceRole": this.serviceRole,
      "state": this.state,
      "tags": this.tags.renderTags(),
      "type": this.type,
      "unmanagedvCpus": this.unmanagedvCpus,
      "updatePolicy": this.updatePolicy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnComputeEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnComputeEnvironmentPropsToCloudFormation(props);
  }
}

export namespace CfnComputeEnvironment {
  /**
   * Specifies the infrastructure update policy for the compute environment.
   *
   * For more information about infrastructure updates, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-updatepolicy.html
   */
  export interface UpdatePolicyProperty {
    /**
     * Specifies the job timeout (in minutes) when the compute environment infrastructure is updated.
     *
     * The default value is 30.
     *
     * @default - 30
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-updatepolicy.html#cfn-batch-computeenvironment-updatepolicy-jobexecutiontimeoutminutes
     */
    readonly jobExecutionTimeoutMinutes?: number;

    /**
     * Specifies whether jobs are automatically terminated when the computer environment infrastructure is updated.
     *
     * The default value is `false` .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-updatepolicy.html#cfn-batch-computeenvironment-updatepolicy-terminatejobsonupdate
     */
    readonly terminateJobsOnUpdate?: boolean | cdk.IResolvable;
  }

  /**
   * Configuration for the Amazon EKS cluster that supports the AWS Batch compute environment.
   *
   * The cluster must exist before the compute environment can be created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-eksconfiguration.html
   */
  export interface EksConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon EKS cluster.
     *
     * An example is `arn: *aws* :eks: *us-east-1* : *123456789012* :cluster/ *ClusterForBatch*` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-eksconfiguration.html#cfn-batch-computeenvironment-eksconfiguration-eksclusterarn
     */
    readonly eksClusterArn: string;

    /**
     * The namespace of the Amazon EKS cluster.
     *
     * AWS Batch manages pods in this namespace. The value can't left empty or null. It must be fewer than 64 characters long, can't be set to `default` , can't start with " `kube-` ," and must match this regular expression: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$` . For more information, see [Namespaces](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) in the Kubernetes documentation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-eksconfiguration.html#cfn-batch-computeenvironment-eksconfiguration-kubernetesnamespace
     */
    readonly kubernetesNamespace: string;
  }

  /**
   * Details about the compute resources managed by the compute environment.
   *
   * This parameter is required for managed compute environments. For more information, see [Compute Environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) in the *AWS Batch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html
   */
  export interface ComputeResourcesProperty {
    /**
     * The allocation strategy to use for the compute resource if not enough instances of the best fitting instance type can be allocated.
     *
     * This might be because of availability of the instance type in the Region or [Amazon EC2 service limits](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html) . For more information, see [Allocation strategies](https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html) in the *AWS Batch User Guide* .
     *
     * When updating a compute environment, changing the allocation strategy requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* . `BEST_FIT` is not supported when updating a compute environment.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources, and shouldn't be specified.
     *
     * - **BEST_FIT (default)** - AWS Batch selects an instance type that best fits the needs of the jobs with a preference for the lowest-cost instance type. If additional instances of the selected instance type aren't available, AWS Batch waits for the additional instances to be available. If there aren't enough instances available, or if the user is reaching [Amazon EC2 service limits](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-resource-limits.html) then additional jobs aren't run until the currently running jobs have completed. This allocation strategy keeps costs lower but can limit scaling. If you are using Spot Fleets with `BEST_FIT` then the Spot Fleet IAM role must be specified.
     * - **BEST_FIT_PROGRESSIVE** - AWS Batch will select additional instance types that are large enough to meet the requirements of the jobs in the queue, with a preference for instance types with a lower cost per unit vCPU. If additional instances of the previously selected instance types aren't available, AWS Batch will select new instance types.
     * - **SPOT_CAPACITY_OPTIMIZED** - AWS Batch will select one or more instance types that are large enough to meet the requirements of the jobs in the queue, with a preference for instance types that are less likely to be interrupted. This allocation strategy is only available for Spot Instance compute resources.
     * - **SPOT_PRICE_CAPACITY_OPTIMIZED** - The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price. This allocation strategy is only available for Spot Instance compute resources.
     *
     * > We recommend that you use `SPOT_PRICE_CAPACITY_OPTIMIZED` rather than `SPOT_CAPACITY_OPTIMIZED` in most instances.
     *
     * With `BEST_FIT_PROGRESSIVE` , `SPOT_CAPACITY_OPTIMIZED` , and `SPOT_PRICE_CAPACITY_OPTIMIZED` allocation strategies using On-Demand or Spot Instances, and the `BEST_FIT` strategy using Spot Instances, AWS Batch might need to go above `maxvCpus` to meet your capacity requirements. In this event, AWS Batch never exceeds `maxvCpus` by more than a single instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-allocationstrategy
     */
    readonly allocationStrategy?: string;

    /**
     * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for that instance type before instances are launched.
     *
     * For example, if your maximum percentage is 20%, the Spot price must be less than 20% of the current On-Demand price for that Amazon EC2 instance. You always pay the lowest (market) price and never more than your maximum percentage. For most use cases, we recommend leaving this field empty.
     *
     * When updating a compute environment, changing the bid percentage requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-bidpercentage
     */
    readonly bidPercentage?: number;

    /**
     * The desired number of vCPUS in the compute environment.
     *
     * AWS Batch modifies this value between the minimum and maximum values based on job queue demand.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. > AWS Batch doesn't support changing the desired number of vCPUs of an existing compute environment. Don't specify this parameter for compute environments using Amazon EKS clusters. > When you update the `desiredvCpus` setting, the value must be between the `minvCpus` and `maxvCpus` values.
     * >
     * > Additionally, the updated `desiredvCpus` value must be greater than or equal to the current `desiredvCpus` value. For more information, see [Troubleshooting AWS Batch](https://docs.aws.amazon.com/batch/latest/userguide/troubleshooting.html#error-desired-vcpus-update) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-desiredvcpus
     */
    readonly desiredvCpus?: number;

    /**
     * Provides information used to select Amazon Machine Images (AMIs) for EC2 instances in the compute environment.
     *
     * If `Ec2Configuration` isn't specified, the default is `ECS_AL2` .
     *
     * When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* . To remove the EC2 configuration and any custom AMI ID specified in `imageIdOverride` , set this value to an empty string.
     *
     * One or two values can be provided.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-ec2configuration
     */
    readonly ec2Configuration?: Array<CfnComputeEnvironment.Ec2ConfigurationObjectProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon EC2 key pair that's used for instances launched in the compute environment.
     *
     * You can use this key pair to log in to your instances with SSH. To remove the Amazon EC2 key pair, set this value to an empty string.
     *
     * When updating a compute environment, changing the EC2 key pair requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-ec2keypair
     */
    readonly ec2KeyPair?: string;

    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment.
     *
     * This parameter is overridden by the `imageIdOverride` member of the `Ec2Configuration` structure. To remove the custom AMI ID and use the default AMI ID, set this value to an empty string.
     *
     * When updating a compute environment, changing the AMI ID requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. > The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see [Amazon ECS-optimized Amazon Linux 2 AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#ecs-optimized-ami-linux-variants.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-imageid
     */
    readonly imageId?: string;

    /**
     * The Amazon ECS instance profile applied to Amazon EC2 instances in a compute environment.
     *
     * Required for Amazon EC2 instances. You can specify the short name or full Amazon Resource Name (ARN) of an instance profile. For example, `*ecsInstanceRole*` or `arn:aws:iam:: *<aws_account_id>* :instance-profile/ *ecsInstanceRole*` . For more information, see [Amazon ECS instance role](https://docs.aws.amazon.com/batch/latest/userguide/instance_IAM_role.html) in the *AWS Batch User Guide* .
     *
     * When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-instancerole
     */
    readonly instanceRole?: string;

    /**
     * The instances types that can be launched.
     *
     * You can specify instance families to launch any instance type within those families (for example, `c5` or `p3` ), or you can specify specific sizes within a family (such as `c5.8xlarge` ). You can also choose `optimal` to select instance types (from the C4, M4, and R4 instance families) that match the demand of your job queues.
     *
     * When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. > When you create a compute environment, the instance types that you select for the compute environment must share the same architecture. For example, you can't mix x86 and ARM instances in the same compute environment. > Currently, `optimal` uses instance types from the C4, M4, and R4 instance families. In Regions that don't have instance types from those instance families, instance types from the C5, M5, and R5 instance families are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-instancetypes
     */
    readonly instanceTypes?: Array<string>;

    /**
     * The launch template to use for your compute resources.
     *
     * Any other compute resource parameters that you specify in a [CreateComputeEnvironment](https://docs.aws.amazon.com/batch/latest/APIReference/API_CreateComputeEnvironment.html) API operation override the same parameters in the launch template. You must specify either the launch template ID or launch template name in the request, but not both. For more information, see [Launch Template Support](https://docs.aws.amazon.com/batch/latest/userguide/launch-templates.html) in the ** . Removing the launch template from a compute environment will not remove the AMI specified in the launch template. In order to update the AMI specified in a launch template, the `updateToLatestImageVersion` parameter must be set to `true` .
     *
     * When updating a compute environment, changing the launch template requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the ** .
     *
     * > This parameter isn't applicable to jobs running on Fargate resources, and shouldn't be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-launchtemplate
     */
    readonly launchTemplate?: cdk.IResolvable | CfnComputeEnvironment.LaunchTemplateSpecificationProperty;

    /**
     * The maximum number of Amazon EC2 vCPUs that an environment can reach.
     *
     * > With `BEST_FIT_PROGRESSIVE` , `SPOT_CAPACITY_OPTIMIZED` and `SPOT_PRICE_CAPACITY_OPTIMIZED` (recommended) strategies using On-Demand or Spot Instances, and the `BEST_FIT` strategy using Spot Instances, AWS Batch might need to exceed `maxvCpus` to meet your capacity requirements. In this event, AWS Batch never exceeds `maxvCpus` by more than a single instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-maxvcpus
     */
    readonly maxvCpus: number;

    /**
     * The minimum number of vCPUs that an environment should maintain (even if the compute environment is `DISABLED` ).
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-minvcpus
     */
    readonly minvCpus?: number;

    /**
     * The Amazon EC2 placement group to associate with your compute resources.
     *
     * If you intend to submit multi-node parallel jobs to your compute environment, you should consider creating a cluster placement group and associate it with your compute resources. This keeps your multi-node parallel job on a logical grouping of instances within a single Availability Zone with high network flow potential. For more information, see [Placement groups](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) in the *Amazon EC2 User Guide for Linux Instances* .
     *
     * When updating a compute environment, changing the placement group requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-placementgroup
     */
    readonly placementGroup?: string;

    /**
     * The Amazon EC2 security groups that are associated with instances launched in the compute environment.
     *
     * This parameter is required for Fargate compute resources, where it can contain up to 5 security groups. For Fargate compute resources, providing an empty list is handled as if this parameter wasn't specified and no change is made. For EC2 compute resources, providing an empty list removes the security groups from the compute resource.
     *
     * When updating a compute environment, changing the EC2 security groups requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a `SPOT` compute environment.
     *
     * This role is required if the allocation strategy set to `BEST_FIT` or if the allocation strategy isn't specified. For more information, see [Amazon EC2 spot fleet role](https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it. > To tag your Spot Instances on creation, the Spot Fleet IAM role specified here must use the newer *AmazonEC2SpotFleetTaggingRole* managed policy. The previously recommended *AmazonEC2SpotFleetRole* managed policy doesn't have the required permissions to tag Spot Instances. For more information, see [Spot instances not tagged on creation](https://docs.aws.amazon.com/batch/latest/userguide/troubleshooting.html#spot-instance-no-tag) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-spotiamfleetrole
     */
    readonly spotIamFleetRole?: string;

    /**
     * The VPC subnets where the compute resources are launched.
     *
     * Fargate compute resources can contain up to 16 subnets. For Fargate compute resources, providing an empty list will be handled as if this parameter wasn't specified and no change is made. For EC2 compute resources, providing an empty list removes the VPC subnets from the compute resource. For more information, see [VPCs and subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) in the *Amazon VPC User Guide* .
     *
     * When updating a compute environment, changing the VPC subnets requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > AWS Batch on Amazon EC2 and AWS Batch on Amazon EKS support Local Zones. For more information, see [Local Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-local-zones) in the *Amazon EC2 User Guide for Linux Instances* , [Amazon EKS and AWS Local Zones](https://docs.aws.amazon.com/eks/latest/userguide/local-zones.html) in the *Amazon EKS User Guide* and [Amazon ECS clusters in Local Zones, Wavelength Zones, and AWS Outposts](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-regions-zones.html#clusters-local-zones) in the *Amazon ECS Developer Guide* .
     * >
     * > AWS Batch on Fargate doesn't currently support Local Zones.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-subnets
     */
    readonly subnets: Array<string>;

    /**
     * Key-value pair tags to be applied to EC2 resources that are launched in the compute environment.
     *
     * For AWS Batch , these take the form of `"String1": "String2"` , where `String1` is the tag key and `String2` is the tag value-for example, `{ "Name": "Batch Instance - C4OnDemand" }` . This is helpful for recognizing your Batch instances in the Amazon EC2 console. These tags aren't seen when using the AWS Batch `ListTagsForResource` API operation.
     *
     * When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't specify it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-tags
     */
    readonly tags?: Record<string, string>;

    /**
     * The type of compute environment: `EC2` , `SPOT` , `FARGATE` , or `FARGATE_SPOT` .
     *
     * For more information, see [Compute environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) in the *AWS Batch User Guide* .
     *
     * If you choose `SPOT` , you must also specify an Amazon EC2 Spot Fleet role with the `spotIamFleetRole` parameter. For more information, see [Amazon EC2 spot fleet role](https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html) in the *AWS Batch User Guide* .
     *
     * When updating compute environment, changing the type of a compute environment requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * When updating the type of a compute environment, changing between `EC2` and `SPOT` or between `FARGATE` and `FARGATE_SPOT` will initiate an infrastructure update, but if you switch between `EC2` and `FARGATE` , AWS CloudFormation will create a new compute environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-type
     */
    readonly type: string;

    /**
     * Specifies whether the AMI ID is updated to the latest one that's supported by AWS Batch when the compute environment has an infrastructure update.
     *
     * The default value is `false` .
     *
     * > An AMI ID can either be specified in the `imageId` or `imageIdOverride` parameters or be determined by the launch template that's specified in the `launchTemplate` parameter. If an AMI ID is specified any of these ways, this parameter is ignored. For more information about to update AMI IDs during an infrastructure update, see [Updating the AMI ID](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html#updating-compute-environments-ami) in the *AWS Batch User Guide* .
     *
     * When updating a compute environment, changing this setting requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-updatetolatestimageversion
     */
    readonly updateToLatestImageVersion?: boolean | cdk.IResolvable;
  }

  /**
   * Provides information used to select Amazon Machine Images (AMIs) for instances in the compute environment.
   *
   * If `Ec2Configuration` isn't specified, the default is `ECS_AL2` ( [Amazon Linux 2](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#al2ami) ).
   *
   * > This object isn't applicable to jobs that are running on Fargate resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-ec2configurationobject.html
   */
  export interface Ec2ConfigurationObjectProperty {
    /**
     * The AMI ID used for instances launched in the compute environment that match the image type.
     *
     * This setting overrides the `imageId` set in the `computeResource` object.
     *
     * > The AMI that you choose for a compute environment must match the architecture of the instance types that you intend to use for that compute environment. For example, if your compute environment uses A1 instance types, the compute resource AMI that you choose must support ARM instances. Amazon ECS vends both x86 and ARM versions of the Amazon ECS-optimized Amazon Linux 2 AMI. For more information, see [Amazon ECS-optimized Amazon Linux 2 AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#ecs-optimized-ami-linux-variants.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-ec2configurationobject.html#cfn-batch-computeenvironment-ec2configurationobject-imageidoverride
     */
    readonly imageIdOverride?: string;

    /**
     * The Kubernetes version for the compute environment.
     *
     * If you don't specify a value, the latest version that AWS Batch supports is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-ec2configurationobject.html#cfn-batch-computeenvironment-ec2configurationobject-imagekubernetesversion
     */
    readonly imageKubernetesVersion?: string;

    /**
     * The image type to match with the instance type to select an AMI.
     *
     * The supported values are different for `ECS` and `EKS` resources.
     *
     * - **ECS** - If the `imageIdOverride` parameter isn't specified, then a recent [Amazon ECS-optimized Amazon Linux 2 AMI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#al2ami) ( `ECS_AL2` ) is used. If a new image type is specified in an update, but neither an `imageId` nor a `imageIdOverride` parameter is specified, then the latest Amazon ECS optimized AMI for that image type that's supported by AWS Batch is used.
     *
     * - **ECS_AL2** - [Amazon Linux 2](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#al2ami) : Default for all non-GPU instance families.
     * - **ECS_AL2_NVIDIA** - [Amazon Linux 2 (GPU)](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#gpuami) : Default for all GPU instance families (for example `P4` and `G4` ) and can be used for all non AWS Graviton-based instance types.
     * - **ECS_AL2023** - [Amazon Linux 2023](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html) : AWS Batch supports Amazon Linux 2023.
     *
     * > Amazon Linux 2023 does not support `A1` instances.
     * - **ECS_AL1** - [Amazon Linux](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html#alami) . Amazon Linux has reached the end-of-life of standard support. For more information, see [Amazon Linux AMI](https://docs.aws.amazon.com/amazon-linux-ami/) .
     * - **EKS** - If the `imageIdOverride` parameter isn't specified, then a recent [Amazon EKS-optimized Amazon Linux AMI](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html) ( `EKS_AL2` ) is used. If a new image type is specified in an update, but neither an `imageId` nor a `imageIdOverride` parameter is specified, then the latest Amazon EKS optimized AMI for that image type that AWS Batch supports is used.
     *
     * - **EKS_AL2** - [Amazon Linux 2](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html) : Default for all non-GPU instance families.
     * - **EKS_AL2_NVIDIA** - [Amazon Linux 2 (accelerated)](https://docs.aws.amazon.com/eks/latest/userguide/eks-optimized-ami.html) : Default for all GPU instance families (for example, `P4` and `G4` ) and can be used for all non AWS Graviton-based instance types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-ec2configurationobject.html#cfn-batch-computeenvironment-ec2configurationobject-imagetype
     */
    readonly imageType: string;
  }

  /**
   * An object that represents a launch template that's associated with a compute resource.
   *
   * You must specify either the launch template ID or launch template name in the request, but not both.
   *
   * If security groups are specified using both the `securityGroupIds` parameter of `CreateComputeEnvironment` and the launch template, the values in the `securityGroupIds` parameter of `CreateComputeEnvironment` will be used.
   *
   * > This object isn't applicable to jobs that are running on Fargate resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html
   */
  export interface LaunchTemplateSpecificationProperty {
    /**
     * The ID of the launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html#cfn-batch-computeenvironment-launchtemplatespecification-launchtemplateid
     */
    readonly launchTemplateId?: string;

    /**
     * The name of the launch template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html#cfn-batch-computeenvironment-launchtemplatespecification-launchtemplatename
     */
    readonly launchTemplateName?: string;

    /**
     * The version number of the launch template, `$Latest` , or `$Default` .
     *
     * If the value is `$Latest` , the latest version of the launch template is used. If the value is `$Default` , the default version of the launch template is used.
     *
     * > If the AMI ID that's used in a compute environment is from the launch template, the AMI isn't changed when the compute environment is updated. It's only changed if the `updateToLatestImageVersion` parameter for the compute environment is set to `true` . During an infrastructure update, if either `$Latest` or `$Default` is specified, AWS Batch re-evaluates the launch template version, and it might use a different version of the launch template. This is the case even if the launch template isn't specified in the update. When updating a compute environment, changing the launch template requires an infrastructure update of the compute environment. For more information, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
     *
     * Default: `$Default` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-launchtemplatespecification.html#cfn-batch-computeenvironment-launchtemplatespecification-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnComputeEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html
 */
export interface CfnComputeEnvironmentProps {
  /**
   * The name for your compute environment.
   *
   * It can be up to 128 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-computeenvironmentname
   */
  readonly computeEnvironmentName?: string;

  /**
   * The ComputeResources property type specifies details of the compute resources managed by the compute environment.
   *
   * This parameter is required for managed compute environments. For more information, see [Compute Environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) in the ** .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-computeresources
   */
  readonly computeResources?: CfnComputeEnvironment.ComputeResourcesProperty | cdk.IResolvable;

  /**
   * The details for the Amazon EKS cluster that supports the compute environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-eksconfiguration
   */
  readonly eksConfiguration?: CfnComputeEnvironment.EksConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether the compute environment is replaced if an update is made that requires replacing the instances in the compute environment.
   *
   * The default value is `true` . To enable more properties to be updated, set this property to `false` . When changing the value of this property to `false` , do not change any other properties at the same time. If other properties are changed at the same time, and the change needs to be rolled back but it can't, it's possible for the stack to go into the `UPDATE_ROLLBACK_FAILED` state. You can't update a stack that is in the `UPDATE_ROLLBACK_FAILED` state. However, if you can continue to roll it back, you can return the stack to its original settings and then try to update it again. For more information, see [Continue rolling back an update](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html) in the *AWS CloudFormation User Guide* .
   *
   * The properties that can't be changed without replacing the compute environment are in the [`ComputeResources`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html) property type: [`AllocationStrategy`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-allocationstrategy) , [`BidPercentage`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-bidpercentage) , [`Ec2Configuration`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-ec2configuration) , [`Ec2KeyPair`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-ec2keypair) , [`Ec2KeyPair`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-ec2keypair) , [`ImageId`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-imageid) , [`InstanceRole`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-instancerole) , [`InstanceTypes`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-instancetypes) , [`LaunchTemplate`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-launchtemplate) , [`MaxvCpus`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-maxvcpus) , [`MinvCpus`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-minvcpus) , [`PlacementGroup`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-placementgroup) , [`SecurityGroupIds`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-securitygroupids) , [`Subnets`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-subnets) , [Tags](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-tags) , [`Type`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-type) , and [`UpdateToLatestImageVersion`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-computeenvironment-computeresources.html#cfn-batch-computeenvironment-computeresources-updatetolatestimageversion) .
   *
   * @default - true
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
   */
  readonly replaceComputeEnvironment?: boolean | cdk.IResolvable;

  /**
   * The full Amazon Resource Name (ARN) of the IAM role that allows AWS Batch to make calls to other AWS services on your behalf.
   *
   * For more information, see [AWS Batch service IAM role](https://docs.aws.amazon.com/batch/latest/userguide/service_IAM_role.html) in the *AWS Batch User Guide* .
   *
   * > If your account already created the AWS Batch service-linked role, that role is used by default for your compute environment unless you specify a different role here. If the AWS Batch service-linked role doesn't exist in your account, and no role is specified here, the service attempts to create the AWS Batch service-linked role in your account.
   *
   * If your specified role has a path other than `/` , then you must specify either the full role ARN (recommended) or prefix the role name with the path. For example, if a role with the name `bar` has a path of `/foo/` , specify `/foo/bar` as the role name. For more information, see [Friendly names and paths](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_identifiers.html#identifiers-friendly-names) in the *IAM User Guide* .
   *
   * > Depending on how you created your AWS Batch service role, its ARN might contain the `service-role` path prefix. When you only specify the name of the service role, AWS Batch assumes that your ARN doesn't use the `service-role` path prefix. Because of this, we recommend that you specify the full ARN of your service role when you create compute environments.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-servicerole
   */
  readonly serviceRole?: string;

  /**
   * The state of the compute environment.
   *
   * If the state is `ENABLED` , then the compute environment accepts jobs from a queue and can scale out automatically based on queues.
   *
   * If the state is `ENABLED` , then the AWS Batch scheduler can attempt to place jobs from an associated job queue on the compute resources within the environment. If the compute environment is managed, then it can scale its instances out or in automatically, based on the job queue demand.
   *
   * If the state is `DISABLED` , then the AWS Batch scheduler doesn't attempt to place jobs within the environment. Jobs in a `STARTING` or `RUNNING` state continue to progress normally. Managed compute environments in the `DISABLED` state don't scale out.
   *
   * > Compute environments in a `DISABLED` state may continue to incur billing charges. To prevent additional charges, turn off and then delete the compute environment. For more information, see [State](https://docs.aws.amazon.com/batch/latest/userguide/compute_environment_parameters.html#compute_environment_state) in the *AWS Batch User Guide* .
   *
   * When an instance is idle, the instance scales down to the `minvCpus` value. However, the instance size doesn't change. For example, consider a `c5.8xlarge` instance with a `minvCpus` value of `4` and a `desiredvCpus` value of `36` . This instance doesn't scale down to a `c5.large` instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-state
   */
  readonly state?: string;

  /**
   * The tags applied to the compute environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The type of the compute environment: `MANAGED` or `UNMANAGED` .
   *
   * For more information, see [Compute Environments](https://docs.aws.amazon.com/batch/latest/userguide/compute_environments.html) in the *AWS Batch User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-type
   */
  readonly type: string;

  /**
   * The maximum number of vCPUs for an unmanaged compute environment.
   *
   * This parameter is only used for fair share scheduling to reserve vCPU capacity for new share identifiers. If this parameter isn't provided for a fair share job queue, no vCPU capacity is reserved.
   *
   * > This parameter is only supported when the `type` parameter is set to `UNMANAGED` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-unmanagedvcpus
   */
  readonly unmanagedvCpus?: number;

  /**
   * Specifies the infrastructure update policy for the compute environment.
   *
   * For more information about infrastructure updates, see [Updating compute environments](https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html) in the *AWS Batch User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-updatepolicy
   */
  readonly updatePolicy?: cdk.IResolvable | CfnComputeEnvironment.UpdatePolicyProperty;
}

/**
 * Determine whether the given properties match those of a `UpdatePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `UpdatePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentUpdatePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jobExecutionTimeoutMinutes", cdk.validateNumber)(properties.jobExecutionTimeoutMinutes));
  errors.collect(cdk.propertyValidator("terminateJobsOnUpdate", cdk.validateBoolean)(properties.terminateJobsOnUpdate));
  return errors.wrap("supplied properties not correct for \"UpdatePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentUpdatePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentUpdatePolicyPropertyValidator(properties).assertSuccess();
  return {
    "JobExecutionTimeoutMinutes": cdk.numberToCloudFormation(properties.jobExecutionTimeoutMinutes),
    "TerminateJobsOnUpdate": cdk.booleanToCloudFormation(properties.terminateJobsOnUpdate)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentUpdatePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComputeEnvironment.UpdatePolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironment.UpdatePolicyProperty>();
  ret.addPropertyResult("jobExecutionTimeoutMinutes", "JobExecutionTimeoutMinutes", (properties.JobExecutionTimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.JobExecutionTimeoutMinutes) : undefined));
  ret.addPropertyResult("terminateJobsOnUpdate", "TerminateJobsOnUpdate", (properties.TerminateJobsOnUpdate != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TerminateJobsOnUpdate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EksConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentEksConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eksClusterArn", cdk.requiredValidator)(properties.eksClusterArn));
  errors.collect(cdk.propertyValidator("eksClusterArn", cdk.validateString)(properties.eksClusterArn));
  errors.collect(cdk.propertyValidator("kubernetesNamespace", cdk.requiredValidator)(properties.kubernetesNamespace));
  errors.collect(cdk.propertyValidator("kubernetesNamespace", cdk.validateString)(properties.kubernetesNamespace));
  return errors.wrap("supplied properties not correct for \"EksConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentEksConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentEksConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EksClusterArn": cdk.stringToCloudFormation(properties.eksClusterArn),
    "KubernetesNamespace": cdk.stringToCloudFormation(properties.kubernetesNamespace)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentEksConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComputeEnvironment.EksConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironment.EksConfigurationProperty>();
  ret.addPropertyResult("eksClusterArn", "EksClusterArn", (properties.EksClusterArn != null ? cfn_parse.FromCloudFormation.getString(properties.EksClusterArn) : undefined));
  ret.addPropertyResult("kubernetesNamespace", "KubernetesNamespace", (properties.KubernetesNamespace != null ? cfn_parse.FromCloudFormation.getString(properties.KubernetesNamespace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `Ec2ConfigurationObjectProperty`
 *
 * @param properties - the TypeScript properties of a `Ec2ConfigurationObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentEc2ConfigurationObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageIdOverride", cdk.validateString)(properties.imageIdOverride));
  errors.collect(cdk.propertyValidator("imageKubernetesVersion", cdk.validateString)(properties.imageKubernetesVersion));
  errors.collect(cdk.propertyValidator("imageType", cdk.requiredValidator)(properties.imageType));
  errors.collect(cdk.propertyValidator("imageType", cdk.validateString)(properties.imageType));
  return errors.wrap("supplied properties not correct for \"Ec2ConfigurationObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentEc2ConfigurationObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentEc2ConfigurationObjectPropertyValidator(properties).assertSuccess();
  return {
    "ImageIdOverride": cdk.stringToCloudFormation(properties.imageIdOverride),
    "ImageKubernetesVersion": cdk.stringToCloudFormation(properties.imageKubernetesVersion),
    "ImageType": cdk.stringToCloudFormation(properties.imageType)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentEc2ConfigurationObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComputeEnvironment.Ec2ConfigurationObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironment.Ec2ConfigurationObjectProperty>();
  ret.addPropertyResult("imageIdOverride", "ImageIdOverride", (properties.ImageIdOverride != null ? cfn_parse.FromCloudFormation.getString(properties.ImageIdOverride) : undefined));
  ret.addPropertyResult("imageKubernetesVersion", "ImageKubernetesVersion", (properties.ImageKubernetesVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ImageKubernetesVersion) : undefined));
  ret.addPropertyResult("imageType", "ImageType", (properties.ImageType != null ? cfn_parse.FromCloudFormation.getString(properties.ImageType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LaunchTemplateSpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `LaunchTemplateSpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentLaunchTemplateSpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchTemplateId", cdk.validateString)(properties.launchTemplateId));
  errors.collect(cdk.propertyValidator("launchTemplateName", cdk.validateString)(properties.launchTemplateName));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"LaunchTemplateSpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentLaunchTemplateSpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentLaunchTemplateSpecificationPropertyValidator(properties).assertSuccess();
  return {
    "LaunchTemplateId": cdk.stringToCloudFormation(properties.launchTemplateId),
    "LaunchTemplateName": cdk.stringToCloudFormation(properties.launchTemplateName),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentLaunchTemplateSpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnComputeEnvironment.LaunchTemplateSpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironment.LaunchTemplateSpecificationProperty>();
  ret.addPropertyResult("launchTemplateId", "LaunchTemplateId", (properties.LaunchTemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateId) : undefined));
  ret.addPropertyResult("launchTemplateName", "LaunchTemplateName", (properties.LaunchTemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchTemplateName) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComputeResourcesProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeResourcesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentComputeResourcesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationStrategy", cdk.validateString)(properties.allocationStrategy));
  errors.collect(cdk.propertyValidator("bidPercentage", cdk.validateNumber)(properties.bidPercentage));
  errors.collect(cdk.propertyValidator("desiredvCpus", cdk.validateNumber)(properties.desiredvCpus));
  errors.collect(cdk.propertyValidator("ec2Configuration", cdk.listValidator(CfnComputeEnvironmentEc2ConfigurationObjectPropertyValidator))(properties.ec2Configuration));
  errors.collect(cdk.propertyValidator("ec2KeyPair", cdk.validateString)(properties.ec2KeyPair));
  errors.collect(cdk.propertyValidator("imageId", cdk.validateString)(properties.imageId));
  errors.collect(cdk.propertyValidator("instanceRole", cdk.validateString)(properties.instanceRole));
  errors.collect(cdk.propertyValidator("instanceTypes", cdk.listValidator(cdk.validateString))(properties.instanceTypes));
  errors.collect(cdk.propertyValidator("launchTemplate", CfnComputeEnvironmentLaunchTemplateSpecificationPropertyValidator)(properties.launchTemplate));
  errors.collect(cdk.propertyValidator("maxvCpus", cdk.requiredValidator)(properties.maxvCpus));
  errors.collect(cdk.propertyValidator("maxvCpus", cdk.validateNumber)(properties.maxvCpus));
  errors.collect(cdk.propertyValidator("minvCpus", cdk.validateNumber)(properties.minvCpus));
  errors.collect(cdk.propertyValidator("placementGroup", cdk.validateString)(properties.placementGroup));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("spotIamFleetRole", cdk.validateString)(properties.spotIamFleetRole));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("updateToLatestImageVersion", cdk.validateBoolean)(properties.updateToLatestImageVersion));
  return errors.wrap("supplied properties not correct for \"ComputeResourcesProperty\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentComputeResourcesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentComputeResourcesPropertyValidator(properties).assertSuccess();
  return {
    "AllocationStrategy": cdk.stringToCloudFormation(properties.allocationStrategy),
    "BidPercentage": cdk.numberToCloudFormation(properties.bidPercentage),
    "DesiredvCpus": cdk.numberToCloudFormation(properties.desiredvCpus),
    "Ec2Configuration": cdk.listMapper(convertCfnComputeEnvironmentEc2ConfigurationObjectPropertyToCloudFormation)(properties.ec2Configuration),
    "Ec2KeyPair": cdk.stringToCloudFormation(properties.ec2KeyPair),
    "ImageId": cdk.stringToCloudFormation(properties.imageId),
    "InstanceRole": cdk.stringToCloudFormation(properties.instanceRole),
    "InstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.instanceTypes),
    "LaunchTemplate": convertCfnComputeEnvironmentLaunchTemplateSpecificationPropertyToCloudFormation(properties.launchTemplate),
    "MaxvCpus": cdk.numberToCloudFormation(properties.maxvCpus),
    "MinvCpus": cdk.numberToCloudFormation(properties.minvCpus),
    "PlacementGroup": cdk.stringToCloudFormation(properties.placementGroup),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SpotIamFleetRole": cdk.stringToCloudFormation(properties.spotIamFleetRole),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UpdateToLatestImageVersion": cdk.booleanToCloudFormation(properties.updateToLatestImageVersion)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentComputeResourcesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComputeEnvironment.ComputeResourcesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironment.ComputeResourcesProperty>();
  ret.addPropertyResult("allocationStrategy", "AllocationStrategy", (properties.AllocationStrategy != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationStrategy) : undefined));
  ret.addPropertyResult("bidPercentage", "BidPercentage", (properties.BidPercentage != null ? cfn_parse.FromCloudFormation.getNumber(properties.BidPercentage) : undefined));
  ret.addPropertyResult("desiredvCpus", "DesiredvCpus", (properties.DesiredvCpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.DesiredvCpus) : undefined));
  ret.addPropertyResult("ec2Configuration", "Ec2Configuration", (properties.Ec2Configuration != null ? cfn_parse.FromCloudFormation.getArray(CfnComputeEnvironmentEc2ConfigurationObjectPropertyFromCloudFormation)(properties.Ec2Configuration) : undefined));
  ret.addPropertyResult("ec2KeyPair", "Ec2KeyPair", (properties.Ec2KeyPair != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2KeyPair) : undefined));
  ret.addPropertyResult("imageId", "ImageId", (properties.ImageId != null ? cfn_parse.FromCloudFormation.getString(properties.ImageId) : undefined));
  ret.addPropertyResult("instanceRole", "InstanceRole", (properties.InstanceRole != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceRole) : undefined));
  ret.addPropertyResult("instanceTypes", "InstanceTypes", (properties.InstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstanceTypes) : undefined));
  ret.addPropertyResult("launchTemplate", "LaunchTemplate", (properties.LaunchTemplate != null ? CfnComputeEnvironmentLaunchTemplateSpecificationPropertyFromCloudFormation(properties.LaunchTemplate) : undefined));
  ret.addPropertyResult("maxvCpus", "MaxvCpus", (properties.MaxvCpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxvCpus) : undefined));
  ret.addPropertyResult("minvCpus", "MinvCpus", (properties.MinvCpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinvCpus) : undefined));
  ret.addPropertyResult("placementGroup", "PlacementGroup", (properties.PlacementGroup != null ? cfn_parse.FromCloudFormation.getString(properties.PlacementGroup) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("spotIamFleetRole", "SpotIamFleetRole", (properties.SpotIamFleetRole != null ? cfn_parse.FromCloudFormation.getString(properties.SpotIamFleetRole) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("updateToLatestImageVersion", "UpdateToLatestImageVersion", (properties.UpdateToLatestImageVersion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UpdateToLatestImageVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnComputeEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnComputeEnvironmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnComputeEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeEnvironmentName", cdk.validateString)(properties.computeEnvironmentName));
  errors.collect(cdk.propertyValidator("computeResources", CfnComputeEnvironmentComputeResourcesPropertyValidator)(properties.computeResources));
  errors.collect(cdk.propertyValidator("eksConfiguration", CfnComputeEnvironmentEksConfigurationPropertyValidator)(properties.eksConfiguration));
  errors.collect(cdk.propertyValidator("replaceComputeEnvironment", cdk.validateBoolean)(properties.replaceComputeEnvironment));
  errors.collect(cdk.propertyValidator("serviceRole", cdk.validateString)(properties.serviceRole));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("unmanagedvCpus", cdk.validateNumber)(properties.unmanagedvCpus));
  errors.collect(cdk.propertyValidator("updatePolicy", CfnComputeEnvironmentUpdatePolicyPropertyValidator)(properties.updatePolicy));
  return errors.wrap("supplied properties not correct for \"CfnComputeEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnComputeEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnComputeEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "ComputeEnvironmentName": cdk.stringToCloudFormation(properties.computeEnvironmentName),
    "ComputeResources": convertCfnComputeEnvironmentComputeResourcesPropertyToCloudFormation(properties.computeResources),
    "EksConfiguration": convertCfnComputeEnvironmentEksConfigurationPropertyToCloudFormation(properties.eksConfiguration),
    "ReplaceComputeEnvironment": cdk.booleanToCloudFormation(properties.replaceComputeEnvironment),
    "ServiceRole": cdk.stringToCloudFormation(properties.serviceRole),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "UnmanagedvCpus": cdk.numberToCloudFormation(properties.unmanagedvCpus),
    "UpdatePolicy": convertCfnComputeEnvironmentUpdatePolicyPropertyToCloudFormation(properties.updatePolicy)
  };
}

// @ts-ignore TS6133
function CfnComputeEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnComputeEnvironmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnComputeEnvironmentProps>();
  ret.addPropertyResult("computeEnvironmentName", "ComputeEnvironmentName", (properties.ComputeEnvironmentName != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeEnvironmentName) : undefined));
  ret.addPropertyResult("computeResources", "ComputeResources", (properties.ComputeResources != null ? CfnComputeEnvironmentComputeResourcesPropertyFromCloudFormation(properties.ComputeResources) : undefined));
  ret.addPropertyResult("eksConfiguration", "EksConfiguration", (properties.EksConfiguration != null ? CfnComputeEnvironmentEksConfigurationPropertyFromCloudFormation(properties.EksConfiguration) : undefined));
  ret.addPropertyResult("replaceComputeEnvironment", "ReplaceComputeEnvironment", (properties.ReplaceComputeEnvironment != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReplaceComputeEnvironment) : undefined));
  ret.addPropertyResult("serviceRole", "ServiceRole", (properties.ServiceRole != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceRole) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("unmanagedvCpus", "UnmanagedvCpus", (properties.UnmanagedvCpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnmanagedvCpus) : undefined));
  ret.addPropertyResult("updatePolicy", "UpdatePolicy", (properties.UpdatePolicy != null ? CfnComputeEnvironmentUpdatePolicyPropertyFromCloudFormation(properties.UpdatePolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Batch::JobDefinition` resource specifies the parameters for an AWS Batch job definition.
 *
 * For more information, see [Job Definitions](https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html) in the ** .
 *
 * @cloudformationResource AWS::Batch::JobDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html
 */
export class CfnJobDefinition extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Batch::JobDefinition";

  /**
   * Build a CfnJobDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnJobDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnJobDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnJobDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The orchestration type of the compute environment. The valid values are `ECS` (default) or `EKS` .
   *
   * @cloudformationAttribute ContainerOrchestrationType
   */
  public readonly attrContainerOrchestrationType: string;

  /**
   * The job definition ARN, such as `batch: *us-east-1* : *111122223333* :job-definition/ *test-gpu* : *2*` .
   *
   * @cloudformationAttribute JobDefinitionArn
   */
  public readonly attrJobDefinitionArn: string;

  /**
   * The revision of the job definition.
   *
   * @cloudformationAttribute Revision
   */
  public readonly attrRevision: number;

  /**
   * The status of the job definition.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * An object with various properties specific to Amazon ECS based jobs.
   */
  public containerProperties?: CfnJobDefinition.ContainerPropertiesProperty | cdk.IResolvable;

  /**
   * An object with various properties that are specific to Amazon EKS based jobs.
   */
  public eksProperties?: CfnJobDefinition.EksPropertiesProperty | cdk.IResolvable;

  /**
   * The name of the job definition.
   */
  public jobDefinitionName?: string;

  /**
   * An object with various properties that are specific to multi-node parallel jobs.
   */
  public nodeProperties?: cdk.IResolvable | CfnJobDefinition.NodePropertiesProperty;

  /**
   * Default parameters or parameter substitution placeholders that are set in the job definition.
   */
  public parameters?: any | cdk.IResolvable;

  /**
   * The platform capabilities required by the job definition.
   */
  public platformCapabilities?: Array<string>;

  /**
   * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task.
   */
  public propagateTags?: boolean | cdk.IResolvable;

  /**
   * The retry strategy to use for failed jobs that are submitted with this job definition.
   */
  public retryStrategy?: cdk.IResolvable | CfnJobDefinition.RetryStrategyProperty;

  /**
   * The scheduling priority of the job definition.
   */
  public schedulingPriority?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that are applied to the job definition.
   */
  public tagsRaw?: any;

  /**
   * The timeout time for jobs that are submitted with this job definition.
   */
  public timeout?: cdk.IResolvable | CfnJobDefinition.TimeoutProperty;

  /**
   * The type of job definition.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnJobDefinitionProps) {
    super(scope, id, {
      "type": CfnJobDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "type", this);

    this.attrContainerOrchestrationType = cdk.Token.asString(this.getAtt("ContainerOrchestrationType", cdk.ResolutionTypeHint.STRING));
    this.attrJobDefinitionArn = cdk.Token.asString(this.getAtt("JobDefinitionArn", cdk.ResolutionTypeHint.STRING));
    this.attrRevision = cdk.Token.asNumber(this.getAtt("Revision", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.containerProperties = props.containerProperties;
    this.eksProperties = props.eksProperties;
    this.jobDefinitionName = props.jobDefinitionName;
    this.nodeProperties = props.nodeProperties;
    this.parameters = props.parameters;
    this.platformCapabilities = props.platformCapabilities;
    this.propagateTags = props.propagateTags;
    this.retryStrategy = props.retryStrategy;
    this.schedulingPriority = props.schedulingPriority;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Batch::JobDefinition", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "containerProperties": this.containerProperties,
      "eksProperties": this.eksProperties,
      "jobDefinitionName": this.jobDefinitionName,
      "nodeProperties": this.nodeProperties,
      "parameters": this.parameters,
      "platformCapabilities": this.platformCapabilities,
      "propagateTags": this.propagateTags,
      "retryStrategy": this.retryStrategy,
      "schedulingPriority": this.schedulingPriority,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnJobDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnJobDefinitionPropsToCloudFormation(props);
  }
}

export namespace CfnJobDefinition {
  /**
   * An object that represents the node properties of a multi-node parallel job.
   *
   * > Node properties can't be specified for Amazon EKS based job definitions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-nodeproperties.html
   */
  export interface NodePropertiesProperty {
    /**
     * Specifies the node index for the main node of a multi-node parallel job.
     *
     * This node index value must be fewer than the number of nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-nodeproperties.html#cfn-batch-jobdefinition-nodeproperties-mainnode
     */
    readonly mainNode: number;

    /**
     * A list of node ranges and their properties that are associated with a multi-node parallel job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-nodeproperties.html#cfn-batch-jobdefinition-nodeproperties-noderangeproperties
     */
    readonly nodeRangeProperties: Array<cdk.IResolvable | CfnJobDefinition.NodeRangePropertyProperty> | cdk.IResolvable;

    /**
     * The number of nodes that are associated with a multi-node parallel job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-nodeproperties.html#cfn-batch-jobdefinition-nodeproperties-numnodes
     */
    readonly numNodes: number;
  }

  /**
   * An object that represents the properties of the node range for a multi-node parallel job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-noderangeproperty.html
   */
  export interface NodeRangePropertyProperty {
    /**
     * The container details for the node range.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-noderangeproperty.html#cfn-batch-jobdefinition-noderangeproperty-container
     */
    readonly container?: CfnJobDefinition.ContainerPropertiesProperty | cdk.IResolvable;

    /**
     * The range of nodes, using node index values.
     *
     * A range of `0:3` indicates nodes with index values of `0` through `3` . If the starting range value is omitted ( `:n` ), then `0` is used to start the range. If the ending range value is omitted ( `n:` ), then the highest possible node index is used to end the range. Your accumulative node ranges must account for all nodes ( `0:n` ). You can nest node ranges (for example, `0:10` and `4:5` ). In this case, the `4:5` range properties override the `0:10` properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-noderangeproperty.html#cfn-batch-jobdefinition-noderangeproperty-targetnodes
     */
    readonly targetNodes: string;
  }

  /**
   * Container properties are used for Amazon ECS based job definitions.
   *
   * These properties to describe the container that's launched as part of a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html
   */
  export interface ContainerPropertiesProperty {
    /**
     * The command that's passed to the container.
     *
     * This parameter maps to `Cmd` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `COMMAND` parameter to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . For more information, see [https://docs.docker.com/engine/reference/builder/#cmd](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/builder/#cmd) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-command
     */
    readonly command?: Array<string>;

    /**
     * The environment variables to pass to a container.
     *
     * This parameter maps to `Env` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--env` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > We don't recommend using plaintext environment variables for sensitive information, such as credential data. > Environment variables cannot start with " `AWS_BATCH` ". This naming convention is reserved for variables that AWS Batch sets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-environment
     */
    readonly environment?: Array<CfnJobDefinition.EnvironmentProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The amount of ephemeral storage to allocate for the task.
     *
     * This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on AWS Fargate .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-ephemeralstorage
     */
    readonly ephemeralStorage?: CfnJobDefinition.EphemeralStorageProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the execution role that AWS Batch can assume.
     *
     * For jobs that run on Fargate resources, you must provide an execution role. For more information, see [AWS Batch execution IAM role](https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-executionrolearn
     */
    readonly executionRoleArn?: string;

    /**
     * The platform configuration for jobs that are running on Fargate resources.
     *
     * Jobs that are running on EC2 resources must not specify this parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-fargateplatformconfiguration
     */
    readonly fargatePlatformConfiguration?: CfnJobDefinition.FargatePlatformConfigurationProperty | cdk.IResolvable;

    /**
     * Required.
     *
     * The image used to start a container. This string is passed directly to the Docker daemon. Images in the Docker Hub registry are available by default. Other repositories are specified with `*repository-url* / *image* : *tag*` . It can be 255 characters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), underscores (_), colons (:), periods (.), forward slashes (/), and number signs (#). This parameter maps to `Image` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `IMAGE` parameter of [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > Docker image architecture must match the processor architecture of the compute resources that they're scheduled on. For example, ARM-based Docker images can only run on ARM-based compute resources.
     *
     * - Images in Amazon ECR Public repositories use the full `registry/repository[:tag]` or `registry/repository[@digest]` naming conventions. For example, `public.ecr.aws/ *registry_alias* / *my-web-app* : *latest*` .
     * - Images in Amazon ECR repositories use the full registry and repository URI (for example, `123456789012.dkr.ecr.<region-name>.amazonaws.com/<repository-name>` ).
     * - Images in official repositories on Docker Hub use a single name (for example, `ubuntu` or `mongo` ).
     * - Images in other repositories on Docker Hub are qualified with an organization name (for example, `amazon/amazon-ecs-agent` ).
     * - Images in other online repositories are qualified further by a domain name (for example, `quay.io/assemblyline/ubuntu` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-image
     */
    readonly image: string;

    /**
     * The instance type to use for a multi-node parallel job.
     *
     * All node groups in a multi-node parallel job must use the same instance type.
     *
     * > This parameter isn't applicable to single-node container jobs or jobs that run on Fargate resources, and shouldn't be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-instancetype
     */
    readonly instanceType?: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that the container can assume for AWS permissions.
     *
     * For more information, see [IAM roles for tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-jobrolearn
     */
    readonly jobRoleArn?: string;

    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-linuxparameters
     */
    readonly linuxParameters?: cdk.IResolvable | CfnJobDefinition.LinuxParametersProperty;

    /**
     * The log configuration specification for the container.
     *
     * This parameter maps to `LogConfig` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--log-driver` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . By default, containers use the same logging driver that the Docker daemon uses. However the container might use a different logging driver than the Docker daemon by specifying a log driver with this parameter in the container definition. To use a different logging driver for a container, the log system must be configured properly on the container instance (or on a different log server for remote logging options). For more information on the options for different supported log drivers, see [Configure logging drivers](https://docs.aws.amazon.com/https://docs.docker.com/engine/admin/logging/overview/) in the Docker documentation.
     *
     * > AWS Batch currently supports a subset of the logging drivers available to the Docker daemon (shown in the `LogConfiguration` data type).
     *
     * This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version | grep "Server API version"`
     *
     * > The Amazon ECS container agent running on a container instance must register the logging drivers available on that instance with the `ECS_AVAILABLE_LOGGING_DRIVERS` environment variable before containers placed on that instance can use these log configuration options. For more information, see [Amazon ECS container agent configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-agent-config.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-logconfiguration
     */
    readonly logConfiguration?: cdk.IResolvable | CfnJobDefinition.LogConfigurationProperty;

    /**
     * This parameter is deprecated, use `resourceRequirements` to specify the memory requirements for the job definition.
     *
     * It's not supported for jobs running on Fargate resources. For jobs that run on EC2 resources, it specifies the memory hard limit (in MiB) for a container. If your container attempts to exceed the specified number, it's terminated. You must specify at least 4 MiB of memory for a job using this parameter. The memory hard limit can be specified in several places. It must be specified for each node at least once.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-memory
     */
    readonly memory?: number;

    /**
     * The mount points for data volumes in your container.
     *
     * This parameter maps to `Volumes` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--volume` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-mountpoints
     */
    readonly mountPoints?: Array<cdk.IResolvable | CfnJobDefinition.MountPointsProperty> | cdk.IResolvable;

    /**
     * The network configuration for jobs that are running on Fargate resources.
     *
     * Jobs that are running on EC2 resources must not specify this parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-networkconfiguration
     */
    readonly networkConfiguration?: cdk.IResolvable | CfnJobDefinition.NetworkConfigurationProperty;

    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the `root` user).
     *
     * This parameter maps to `Privileged` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--privileged` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . The default value is false.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided, or specified as false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-privileged
     */
    readonly privileged?: boolean | cdk.IResolvable;

    /**
     * When this parameter is true, the container is given read-only access to its root file system.
     *
     * This parameter maps to `ReadonlyRootfs` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--read-only` option to `docker run` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-readonlyrootfilesystem
     */
    readonly readonlyRootFilesystem?: boolean | cdk.IResolvable;

    /**
     * The type and amount of resources to assign to a container.
     *
     * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-resourcerequirements
     */
    readonly resourceRequirements?: Array<cdk.IResolvable | CfnJobDefinition.ResourceRequirementProperty> | cdk.IResolvable;

    /**
     * An object that represents the compute environment architecture for AWS Batch jobs on Fargate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-runtimeplatform
     */
    readonly runtimePlatform?: cdk.IResolvable | CfnJobDefinition.RuntimePlatformProperty;

    /**
     * The secrets for the container.
     *
     * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-secrets
     */
    readonly secrets?: Array<cdk.IResolvable | CfnJobDefinition.SecretProperty> | cdk.IResolvable;

    /**
     * A list of `ulimits` to set in the container.
     *
     * This parameter maps to `Ulimits` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--ulimit` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources and shouldn't be provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-ulimits
     */
    readonly ulimits?: Array<cdk.IResolvable | CfnJobDefinition.UlimitProperty> | cdk.IResolvable;

    /**
     * The user name to use inside the container.
     *
     * This parameter maps to `User` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--user` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-user
     */
    readonly user?: string;

    /**
     * This parameter is deprecated, use `resourceRequirements` to specify the vCPU requirements for the job definition.
     *
     * It's not supported for jobs running on Fargate resources. For jobs running on EC2 resources, it specifies the number of vCPUs reserved for the job.
     *
     * Each vCPU is equivalent to 1,024 CPU shares. This parameter maps to `CpuShares` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--cpu-shares` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . The number of vCPUs must be specified but can be specified in several places. You must specify it at least once for each node.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-vcpus
     */
    readonly vcpus?: number;

    /**
     * A list of data volumes used in a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-containerproperties.html#cfn-batch-jobdefinition-containerproperties-volumes
     */
    readonly volumes?: Array<cdk.IResolvable | CfnJobDefinition.VolumesProperty> | cdk.IResolvable;
  }

  /**
   * An object that represents the secret to expose to your container.
   *
   * Secrets can be exposed to a container in the following ways:
   *
   * - To inject sensitive data into your containers as environment variables, use the `secrets` container definition parameter.
   * - To reference sensitive information in the log configuration of a container, use the `secretOptions` container definition parameter.
   *
   * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html) in the *AWS Batch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-secret.html
   */
  export interface SecretProperty {
    /**
     * The name of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-secret.html#cfn-batch-jobdefinition-secret-name
     */
    readonly name: string;

    /**
     * The secret to expose to the container.
     *
     * The supported values are either the full Amazon Resource Name (ARN) of the AWS Secrets Manager secret or the full ARN of the parameter in the AWS Systems Manager Parameter Store.
     *
     * > If the AWS Systems Manager Parameter Store parameter exists in the same Region as the job you're launching, then you can use either the full Amazon Resource Name (ARN) or name of the parameter. If the parameter exists in a different Region, then the full ARN must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-secret.html#cfn-batch-jobdefinition-secret-valuefrom
     */
    readonly valueFrom: string;
  }

  /**
   * Linux-specific modifications that are applied to the container, such as details for device mappings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html
   */
  export interface LinuxParametersProperty {
    /**
     * Any of the host devices to expose to the container.
     *
     * This parameter maps to `Devices` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--device` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-devices
     */
    readonly devices?: Array<CfnJobDefinition.DeviceProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If true, run an `init` process inside the container that forwards signals and reaps processes.
     *
     * This parameter maps to the `--init` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . This parameter requires version 1.25 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version | grep "Server API version"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-initprocessenabled
     */
    readonly initProcessEnabled?: boolean | cdk.IResolvable;

    /**
     * The total amount of swap memory (in MiB) a container can use.
     *
     * This parameter is translated to the `--memory-swap` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) where the value is the sum of the container memory plus the `maxSwap` value. For more information, see [`--memory-swap` details](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/resource_constraints/#--memory-swap-details) in the Docker documentation.
     *
     * If a `maxSwap` value of `0` is specified, the container doesn't use swap. Accepted values are `0` or any positive integer. If the `maxSwap` parameter is omitted, the container doesn't use the swap configuration for the container instance that it's running on. A `maxSwap` value must be set for the `swappiness` parameter to be used.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-maxswap
     */
    readonly maxSwap?: number;

    /**
     * The value for the size (in MiB) of the `/dev/shm` volume.
     *
     * This parameter maps to the `--shm-size` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-sharedmemorysize
     */
    readonly sharedMemorySize?: number;

    /**
     * You can use this parameter to tune a container's memory swappiness behavior.
     *
     * A `swappiness` value of `0` causes swapping to not occur unless absolutely necessary. A `swappiness` value of `100` causes pages to be swapped aggressively. Valid values are whole numbers between `0` and `100` . If the `swappiness` parameter isn't specified, a default value of `60` is used. If a value isn't specified for `maxSwap` , then this parameter is ignored. If `maxSwap` is set to 0, the container doesn't use swap. This parameter maps to the `--memory-swappiness` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * Consider the following when you use a per-container swap configuration.
     *
     * - Swap space must be enabled and allocated on the container instance for the containers to use.
     *
     * > By default, the Amazon ECS optimized AMIs don't have swap enabled. You must enable swap on the instance to use this feature. For more information, see [Instance store swap volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-store-swap-volumes.html) in the *Amazon EC2 User Guide for Linux Instances* or [How do I allocate memory to work as swap space in an Amazon EC2 instance by using a swap file?](https://docs.aws.amazon.com/premiumsupport/knowledge-center/ec2-memory-swap-file/)
     * - The swap space parameters are only supported for job definitions using EC2 resources.
     * - If the `maxSwap` and `swappiness` parameters are omitted from a job definition, each container has a default `swappiness` value of 60. Moreover, the total swap usage is limited to two times the memory reservation of the container.
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide it for these jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-swappiness
     */
    readonly swappiness?: number;

    /**
     * The container path, mount options, and size (in MiB) of the `tmpfs` mount.
     *
     * This parameter maps to the `--tmpfs` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > This parameter isn't applicable to jobs that are running on Fargate resources. Don't provide this parameter for this resource type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-linuxparameters.html#cfn-batch-jobdefinition-linuxparameters-tmpfs
     */
    readonly tmpfs?: Array<cdk.IResolvable | CfnJobDefinition.TmpfsProperty> | cdk.IResolvable;
  }

  /**
   * The container path, mount options, and size of the `tmpfs` mount.
   *
   * > This object isn't applicable to jobs that are running on Fargate resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-tmpfs.html
   */
  export interface TmpfsProperty {
    /**
     * The absolute file path in the container where the `tmpfs` volume is mounted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-tmpfs.html#cfn-batch-jobdefinition-tmpfs-containerpath
     */
    readonly containerPath: string;

    /**
     * The list of `tmpfs` volume mount options.
     *
     * Valid values: " `defaults` " | " `ro` " | " `rw` " | " `suid` " | " `nosuid` " | " `dev` " | " `nodev` " | " `exec` " | " `noexec` " | " `sync` " | " `async` " | " `dirsync` " | " `remount` " | " `mand` " | " `nomand` " | " `atime` " | " `noatime` " | " `diratime` " | " `nodiratime` " | " `bind` " | " `rbind" | "unbindable" | "runbindable" | "private" | "rprivate" | "shared" | "rshared" | "slave" | "rslave" | "relatime` " | " `norelatime` " | " `strictatime` " | " `nostrictatime` " | " `mode` " | " `uid` " | " `gid` " | " `nr_inodes` " | " `nr_blocks` " | " `mpol` "
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-tmpfs.html#cfn-batch-jobdefinition-tmpfs-mountoptions
     */
    readonly mountOptions?: Array<string>;

    /**
     * The size (in MiB) of the `tmpfs` volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-tmpfs.html#cfn-batch-jobdefinition-tmpfs-size
     */
    readonly size: number;
  }

  /**
   * An object that represents a container instance host device.
   *
   * > This object isn't applicable to jobs that are running on Fargate resources and shouldn't be provided.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-device.html
   */
  export interface DeviceProperty {
    /**
     * The path inside the container that's used to expose the host device.
     *
     * By default, the `hostPath` value is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-device.html#cfn-batch-jobdefinition-device-containerpath
     */
    readonly containerPath?: string;

    /**
     * The path for the device on the host container instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-device.html#cfn-batch-jobdefinition-device-hostpath
     */
    readonly hostPath?: string;

    /**
     * The explicit permissions to provide to the container for the device.
     *
     * By default, the container has permissions for `read` , `write` , and `mknod` for the device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-device.html#cfn-batch-jobdefinition-device-permissions
     */
    readonly permissions?: Array<string>;
  }

  /**
   * The platform configuration for jobs that are running on Fargate resources.
   *
   * Jobs that run on EC2 resources must not specify this parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-fargateplatformconfiguration.html
   */
  export interface FargatePlatformConfigurationProperty {
    /**
     * The AWS Fargate platform version where the jobs are running.
     *
     * A platform version is specified only for jobs that are running on Fargate resources. If one isn't specified, the `LATEST` platform version is used by default. This uses a recent, approved version of the AWS Fargate platform for compute resources. For more information, see [AWS Fargate platform versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html) in the *Amazon Elastic Container Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-fargateplatformconfiguration.html#cfn-batch-jobdefinition-fargateplatformconfiguration-platformversion
     */
    readonly platformVersion?: string;
  }

  /**
   * The type and amount of a resource to assign to a container.
   *
   * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resourcerequirement.html
   */
  export interface ResourceRequirementProperty {
    /**
     * The type of resource to assign to a container.
     *
     * The supported resources include `GPU` , `MEMORY` , and `VCPU` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resourcerequirement.html#cfn-batch-jobdefinition-resourcerequirement-type
     */
    readonly type?: string;

    /**
     * The quantity of the specified resource to reserve for the container. The values vary based on the `type` specified.
     *
     * - **type="GPU"** - The number of physical GPUs to reserve for the container. Make sure that the number of GPUs reserved for all containers in a job doesn't exceed the number of available GPUs on the compute resource that the job is launched on.
     *
     * > GPUs aren't available for jobs that are running on Fargate resources.
     * - **type="MEMORY"** - The memory hard limit (in MiB) present to the container. This parameter is supported for jobs that are running on EC2 resources. If your container attempts to exceed the memory specified, the container is terminated. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . You must specify at least 4 MiB of memory for a job. This is required but can be specified in several places for multi-node parallel (MNP) jobs. It must be specified for each node at least once. This parameter maps to `Memory` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--memory` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) .
     *
     * > If you're trying to maximize your resource utilization by providing your jobs as much memory as possible for a particular instance type, see [Memory management](https://docs.aws.amazon.com/batch/latest/userguide/memory-management.html) in the *AWS Batch User Guide* .
     *
     * For jobs that are running on Fargate resources, then `value` is the hard limit (in MiB), and must match one of the supported values and the `VCPU` values must be one of the values supported for that memory value.
     *
     * - **value = 512** - `VCPU` = 0.25
     * - **value = 1024** - `VCPU` = 0.25 or 0.5
     * - **value = 2048** - `VCPU` = 0.25, 0.5, or 1
     * - **value = 3072** - `VCPU` = 0.5, or 1
     * - **value = 4096** - `VCPU` = 0.5, 1, or 2
     * - **value = 5120, 6144, or 7168** - `VCPU` = 1 or 2
     * - **value = 8192** - `VCPU` = 1, 2, or 4
     * - **value = 9216, 10240, 11264, 12288, 13312, 14336, or 15360** - `VCPU` = 2 or 4
     * - **value = 16384** - `VCPU` = 2, 4, or 8
     * - **value = 17408, 18432, 19456, 21504, 22528, 23552, 25600, 26624, 27648, 29696, or 30720** - `VCPU` = 4
     * - **value = 20480, 24576, or 28672** - `VCPU` = 4 or 8
     * - **value = 36864, 45056, 53248, or 61440** - `VCPU` = 8
     * - **value = 32768, 40960, 49152, or 57344** - `VCPU` = 8 or 16
     * - **value = 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880** - `VCPU` = 16
     * - **type="VCPU"** - The number of vCPUs reserved for the container. This parameter maps to `CpuShares` in the [Create a container](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/#create-a-container) section of the [Docker Remote API](https://docs.aws.amazon.com/https://docs.docker.com/engine/api/v1.23/) and the `--cpu-shares` option to [docker run](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/run/) . Each vCPU is equivalent to 1,024 CPU shares. For EC2 resources, you must specify at least one vCPU. This is required but can be specified in several places; it must be specified for each node at least once.
     *
     * The default for the Fargate On-Demand vCPU resource count quota is 6 vCPUs. For more information about Fargate quotas, see [AWS Fargate quotas](https://docs.aws.amazon.com/general/latest/gr/ecs-service.html#service-quotas-fargate) in the *AWS General Reference* .
     *
     * For jobs that are running on Fargate resources, then `value` must match one of the supported values and the `MEMORY` values must be one of the values supported for that `VCPU` value. The supported values are 0.25, 0.5, 1, 2, 4, 8, and 16
     *
     * - **value = 0.25** - `MEMORY` = 512, 1024, or 2048
     * - **value = 0.5** - `MEMORY` = 1024, 2048, 3072, or 4096
     * - **value = 1** - `MEMORY` = 2048, 3072, 4096, 5120, 6144, 7168, or 8192
     * - **value = 2** - `MEMORY` = 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, or 16384
     * - **value = 4** - `MEMORY` = 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384, 17408, 18432, 19456, 20480, 21504, 22528, 23552, 24576, 25600, 26624, 27648, 28672, 29696, or 30720
     * - **value = 8** - `MEMORY` = 16384, 20480, 24576, 28672, 32768, 36864, 40960, 45056, 49152, 53248, 57344, or 61440
     * - **value = 16** - `MEMORY` = 32768, 40960, 49152, 57344, 65536, 73728, 81920, 90112, 98304, 106496, 114688, or 122880
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resourcerequirement.html#cfn-batch-jobdefinition-resourcerequirement-value
     */
    readonly value?: string;
  }

  /**
   * Log configuration options to send to a custom log driver for the container.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * The log driver to use for the container.
     *
     * The valid values that are listed for this parameter are log drivers that the Amazon ECS container agent can communicate with by default.
     *
     * The supported log drivers are `awslogs` , `fluentd` , `gelf` , `json-file` , `journald` , `logentries` , `syslog` , and `splunk` .
     *
     * > Jobs that are running on Fargate resources are restricted to the `awslogs` and `splunk` log drivers.
     *
     * - **awslogs** - Specifies the Amazon CloudWatch Logs logging driver. For more information, see [Using the awslogs log driver](https://docs.aws.amazon.com/batch/latest/userguide/using_awslogs.html) in the *AWS Batch User Guide* and [Amazon CloudWatch Logs logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/awslogs/) in the Docker documentation.
     * - **fluentd** - Specifies the Fluentd logging driver. For more information including usage and options, see [Fluentd logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/fluentd/) in the *Docker documentation* .
     * - **gelf** - Specifies the Graylog Extended Format (GELF) logging driver. For more information including usage and options, see [Graylog Extended Format logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/gelf/) in the *Docker documentation* .
     * - **journald** - Specifies the journald logging driver. For more information including usage and options, see [Journald logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/journald/) in the *Docker documentation* .
     * - **json-file** - Specifies the JSON file logging driver. For more information including usage and options, see [JSON File logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/json-file/) in the *Docker documentation* .
     * - **splunk** - Specifies the Splunk logging driver. For more information including usage and options, see [Splunk logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/splunk/) in the *Docker documentation* .
     * - **syslog** - Specifies the syslog logging driver. For more information including usage and options, see [Syslog logging driver](https://docs.aws.amazon.com/https://docs.docker.com/config/containers/logging/syslog/) in the *Docker documentation* .
     *
     * > If you have a custom driver that's not listed earlier that you want to work with the Amazon ECS container agent, you can fork the Amazon ECS container agent project that's [available on GitHub](https://docs.aws.amazon.com/https://github.com/aws/amazon-ecs-agent) and customize it to work with that driver. We encourage you to submit pull requests for changes that you want to have included. However, Amazon Web Services doesn't currently support running modified copies of this software.
     *
     * This parameter requires version 1.18 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version | grep "Server API version"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-logconfiguration.html#cfn-batch-jobdefinition-logconfiguration-logdriver
     */
    readonly logDriver: string;

    /**
     * The configuration options to send to the log driver.
     *
     * This parameter requires version 1.19 of the Docker Remote API or greater on your container instance. To check the Docker Remote API version on your container instance, log in to your container instance and run the following command: `sudo docker version | grep "Server API version"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-logconfiguration.html#cfn-batch-jobdefinition-logconfiguration-options
     */
    readonly options?: any | cdk.IResolvable;

    /**
     * The secrets to pass to the log configuration.
     *
     * For more information, see [Specifying sensitive data](https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html) in the *AWS Batch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-logconfiguration.html#cfn-batch-jobdefinition-logconfiguration-secretoptions
     */
    readonly secretOptions?: Array<cdk.IResolvable | CfnJobDefinition.SecretProperty> | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html
   */
  export interface MountPointsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-containerpath
     */
    readonly containerPath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-readonly
     */
    readonly readOnly?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-mountpoints.html#cfn-batch-jobdefinition-mountpoints-sourcevolume
     */
    readonly sourceVolume?: string;
  }

  /**
   * An object that represents the compute environment architecture for AWS Batch jobs on Fargate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-runtimeplatform.html
   */
  export interface RuntimePlatformProperty {
    /**
     * The vCPU architecture. The default value is `X86_64` . Valid values are `X86_64` and `ARM64` .
     *
     * > This parameter must be set to `X86_64` for Windows containers. > Fargate Spot is not supported for `ARM64` and Windows-based containers on Fargate. A job queue will be blocked if a Fargate `ARM64` or Windows job is submitted to a job queue with only Fargate Spot compute environments. However, you can attach both `FARGATE` and `FARGATE_SPOT` compute environments to the same job queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-runtimeplatform.html#cfn-batch-jobdefinition-runtimeplatform-cpuarchitecture
     */
    readonly cpuArchitecture?: string;

    /**
     * The operating system for the compute environment.
     *
     * Valid values are: `LINUX` (default), `WINDOWS_SERVER_2019_CORE` , `WINDOWS_SERVER_2019_FULL` , `WINDOWS_SERVER_2022_CORE` , and `WINDOWS_SERVER_2022_FULL` .
     *
     * > The following parameters can’t be set for Windows containers: `linuxParameters` , `privileged` , `user` , `ulimits` , `readonlyRootFilesystem` , and `efsVolumeConfiguration` . > The AWS Batch Scheduler checks the compute environments that are attached to the job queue before registering a task definition with Fargate. In this scenario, the job queue is where the job is submitted. If the job requires a Windows container and the first compute environment is `LINUX` , the compute environment is skipped and the next compute environment is checked until a Windows-based compute environment is found. > Fargate Spot is not supported for `ARM64` and Windows-based containers on Fargate. A job queue will be blocked if a Fargate `ARM64` or Windows job is submitted to a job queue with only Fargate Spot compute environments. However, you can attach both `FARGATE` and `FARGATE_SPOT` compute environments to the same job queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-runtimeplatform.html#cfn-batch-jobdefinition-runtimeplatform-operatingsystemfamily
     */
    readonly operatingSystemFamily?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html
   */
  export interface VolumesProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html#cfn-batch-jobdefinition-volumes-efsvolumeconfiguration
     */
    readonly efsVolumeConfiguration?: CfnJobDefinition.EfsVolumeConfigurationProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html#cfn-batch-jobdefinition-volumes-host
     */
    readonly host?: cdk.IResolvable | CfnJobDefinition.VolumesHostProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumes.html#cfn-batch-jobdefinition-volumes-name
     */
    readonly name?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumeshost.html
   */
  export interface VolumesHostProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-volumeshost.html#cfn-batch-jobdefinition-volumeshost-sourcepath
     */
    readonly sourcePath?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html
   */
  export interface EfsVolumeConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html#cfn-batch-jobdefinition-efsvolumeconfiguration-authorizationconfig
     */
    readonly authorizationConfig?: CfnJobDefinition.AuthorizationConfigProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html#cfn-batch-jobdefinition-efsvolumeconfiguration-filesystemid
     */
    readonly fileSystemId: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html#cfn-batch-jobdefinition-efsvolumeconfiguration-rootdirectory
     */
    readonly rootDirectory?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html#cfn-batch-jobdefinition-efsvolumeconfiguration-transitencryption
     */
    readonly transitEncryption?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-efsvolumeconfiguration.html#cfn-batch-jobdefinition-efsvolumeconfiguration-transitencryptionport
     */
    readonly transitEncryptionPort?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-authorizationconfig.html
   */
  export interface AuthorizationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-authorizationconfig.html#cfn-batch-jobdefinition-authorizationconfig-accesspointid
     */
    readonly accessPointId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-authorizationconfig.html#cfn-batch-jobdefinition-authorizationconfig-iam
     */
    readonly iam?: string;
  }

  /**
   * The Environment property type specifies environment variables to use in a job definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-environment.html
   */
  export interface EnvironmentProperty {
    /**
     * The name of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-environment.html#cfn-batch-jobdefinition-environment-name
     */
    readonly name?: string;

    /**
     * The value of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-environment.html#cfn-batch-jobdefinition-environment-value
     */
    readonly value?: string;
  }

  /**
   * The `ulimit` settings to pass to the container. For more information, see [Ulimit](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_Ulimit.html) .
   *
   * > This object isn't applicable to jobs that are running on Fargate resources.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ulimit.html
   */
  export interface UlimitProperty {
    /**
     * The hard limit for the `ulimit` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ulimit.html#cfn-batch-jobdefinition-ulimit-hardlimit
     */
    readonly hardLimit: number;

    /**
     * The `type` of the `ulimit` .
     *
     * Valid values are: `core` | `cpu` | `data` | `fsize` | `locks` | `memlock` | `msgqueue` | `nice` | `nofile` | `nproc` | `rss` | `rtprio` | `rttime` | `sigpending` | `stack` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ulimit.html#cfn-batch-jobdefinition-ulimit-name
     */
    readonly name: string;

    /**
     * The soft limit for the `ulimit` type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ulimit.html#cfn-batch-jobdefinition-ulimit-softlimit
     */
    readonly softLimit: number;
  }

  /**
   * The network configuration for jobs that are running on Fargate resources.
   *
   * Jobs that are running on EC2 resources must not specify this parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * Indicates whether the job has a public IP address.
     *
     * For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet. For more information, see [Amazon ECS task networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html) in the *Amazon Elastic Container Service Developer Guide* . The default value is " `DISABLED` ".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-networkconfiguration.html#cfn-batch-jobdefinition-networkconfiguration-assignpublicip
     */
    readonly assignPublicIp?: string;
  }

  /**
   * The amount of ephemeral storage to allocate for the task.
   *
   * This parameter is used to expand the total amount of ephemeral storage available, beyond the default amount, for tasks hosted on AWS Fargate .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ephemeralstorage.html
   */
  export interface EphemeralStorageProperty {
    /**
     * The total amount, in GiB, of ephemeral storage to set for the task.
     *
     * The minimum supported value is `21` GiB and the maximum supported value is `200` GiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ephemeralstorage.html#cfn-batch-jobdefinition-ephemeralstorage-sizeingib
     */
    readonly sizeInGiB: number;
  }

  /**
   * An object that represents a job timeout configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-jobtimeout.html
   */
  export interface JobTimeoutProperty {
    /**
     * The job timeout time (in seconds) that's measured from the job attempt's `startedAt` timestamp.
     *
     * After this time passes, AWS Batch terminates your jobs if they aren't finished. The minimum value for the timeout is 60 seconds.
     *
     * For array jobs, the timeout applies to the child jobs, not to the parent array job.
     *
     * For multi-node parallel (MNP) jobs, the timeout applies to the whole job, not to the individual nodes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-jobtimeout.html#cfn-batch-jobdefinition-jobtimeout-attemptdurationseconds
     */
    readonly attemptDurationSeconds?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-timeout.html
   */
  export interface TimeoutProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-timeout.html#cfn-batch-jobdefinition-timeout-attemptdurationseconds
     */
    readonly attemptDurationSeconds?: number;
  }

  /**
   * An object that contains the properties for the Kubernetes resources of a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksproperties.html
   */
  export interface EksPropertiesProperty {
    /**
     * The properties for the Kubernetes pod resources of a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksproperties.html#cfn-batch-jobdefinition-eksproperties-podproperties
     */
    readonly podProperties?: cdk.IResolvable | CfnJobDefinition.PodPropertiesProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html
   */
  export interface PodPropertiesProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-containers
     */
    readonly containers?: Array<CfnJobDefinition.EksContainerProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-dnspolicy
     */
    readonly dnsPolicy?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-hostnetwork
     */
    readonly hostNetwork?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-metadata
     */
    readonly metadata?: cdk.IResolvable | CfnJobDefinition.MetadataProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-serviceaccountname
     */
    readonly serviceAccountName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-podproperties.html#cfn-batch-jobdefinition-podproperties-volumes
     */
    readonly volumes?: Array<CfnJobDefinition.EksVolumeProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies an Amazon EKS volume for a job definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksvolume.html
   */
  export interface EksVolumeProperty {
    /**
     * Specifies the configuration of a Kubernetes `emptyDir` volume.
     *
     * For more information, see [emptyDir](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksvolume.html#cfn-batch-jobdefinition-eksvolume-emptydir
     */
    readonly emptyDir?: CfnJobDefinition.EmptyDirProperty | cdk.IResolvable;

    /**
     * Specifies the configuration of a Kubernetes `hostPath` volume.
     *
     * For more information, see [hostPath](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksvolume.html#cfn-batch-jobdefinition-eksvolume-hostpath
     */
    readonly hostPath?: CfnJobDefinition.HostPathProperty | cdk.IResolvable;

    /**
     * The name of the volume.
     *
     * The name must be allowed as a DNS subdomain name. For more information, see [DNS subdomain names](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksvolume.html#cfn-batch-jobdefinition-eksvolume-name
     */
    readonly name: string;

    /**
     * Specifies the configuration of a Kubernetes `secret` volume.
     *
     * For more information, see [secret](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/#secret) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-eksvolume.html#cfn-batch-jobdefinition-eksvolume-secret
     */
    readonly secret?: CfnJobDefinition.EksSecretProperty | cdk.IResolvable;
  }

  /**
   * Specifies the configuration of a Kubernetes `secret` volume.
   *
   * For more information, see [secret](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/#secret) in the *Kubernetes documentation* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekssecret.html
   */
  export interface EksSecretProperty {
    /**
     * Specifies whether the secret or the secret's keys must be defined.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekssecret.html#cfn-batch-jobdefinition-ekssecret-optional
     */
    readonly optional?: boolean | cdk.IResolvable;

    /**
     * The name of the secret.
     *
     * The name must be allowed as a DNS subdomain name. For more information, see [DNS subdomain names](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekssecret.html#cfn-batch-jobdefinition-ekssecret-secretname
     */
    readonly secretName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-emptydir.html
   */
  export interface EmptyDirProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-emptydir.html#cfn-batch-jobdefinition-emptydir-medium
     */
    readonly medium?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-emptydir.html#cfn-batch-jobdefinition-emptydir-sizelimit
     */
    readonly sizeLimit?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-hostpath.html
   */
  export interface HostPathProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-hostpath.html#cfn-batch-jobdefinition-hostpath-path
     */
    readonly path?: string;
  }

  /**
   * EKS container properties are used in job definitions for Amazon EKS based job definitions to describe the properties for a container node in the pod that's launched as part of a job.
   *
   * This can't be specified for Amazon ECS based job definitions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html
   */
  export interface EksContainerProperty {
    /**
     * An array of arguments to the entrypoint.
     *
     * If this isn't specified, the `CMD` of the container image is used. This corresponds to the `args` member in the [Entrypoint](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#entrypoint) portion of the [Pod](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/) in Kubernetes. Environment variable references are expanded using the container's environment.
     *
     * If the referenced environment variable doesn't exist, the reference in the command isn't changed. For example, if the reference is to " `$(NAME1)` " and the `NAME1` environment variable doesn't exist, the command string will remain " `$(NAME1)` ." `$$` is replaced with `$` , and the resulting string isn't expanded. For example, `$$(VAR_NAME)` is passed as `$(VAR_NAME)` whether or not the `VAR_NAME` environment variable exists. For more information, see [CMD](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/builder/#cmd) in the *Dockerfile reference* and [Define a command and arguments for a pod](https://docs.aws.amazon.com/https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-args
     */
    readonly args?: Array<string>;

    /**
     * The entrypoint for the container.
     *
     * This isn't run within a shell. If this isn't specified, the `ENTRYPOINT` of the container image is used. Environment variable references are expanded using the container's environment.
     *
     * If the referenced environment variable doesn't exist, the reference in the command isn't changed. For example, if the reference is to " `$(NAME1)` " and the `NAME1` environment variable doesn't exist, the command string will remain " `$(NAME1)` ." `$$` is replaced with `$` and the resulting string isn't expanded. For example, `$$(VAR_NAME)` will be passed as `$(VAR_NAME)` whether or not the `VAR_NAME` environment variable exists. The entrypoint can't be updated. For more information, see [ENTRYPOINT](https://docs.aws.amazon.com/https://docs.docker.com/engine/reference/builder/#entrypoint) in the *Dockerfile reference* and [Define a command and arguments for a container](https://docs.aws.amazon.com/https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/) and [Entrypoint](https://docs.aws.amazon.com/https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/pod-v1/#entrypoint) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-command
     */
    readonly command?: Array<string>;

    /**
     * The environment variables to pass to a container.
     *
     * > Environment variables cannot start with " `AWS_BATCH` ". This naming convention is reserved for variables that AWS Batch sets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-env
     */
    readonly env?: Array<CfnJobDefinition.EksContainerEnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Docker image used to start the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-image
     */
    readonly image: string;

    /**
     * The image pull policy for the container.
     *
     * Supported values are `Always` , `IfNotPresent` , and `Never` . This parameter defaults to `IfNotPresent` . However, if the `:latest` tag is specified, it defaults to `Always` . For more information, see [Updating images](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/containers/images/#updating-images) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-imagepullpolicy
     */
    readonly imagePullPolicy?: string;

    /**
     * The name of the container.
     *
     * If the name isn't specified, the default name " `Default` " is used. Each container in a pod must have a unique name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-name
     */
    readonly name?: string;

    /**
     * The type and amount of resources to assign to a container.
     *
     * The supported resources include `memory` , `cpu` , and `nvidia.com/gpu` . For more information, see [Resource management for pods and containers](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-resources
     */
    readonly resources?: cdk.IResolvable | CfnJobDefinition.ResourcesProperty;

    /**
     * The security context for a job.
     *
     * For more information, see [Configure a security context for a pod or container](https://docs.aws.amazon.com/https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-securitycontext
     */
    readonly securityContext?: cdk.IResolvable | CfnJobDefinition.SecurityContextProperty;

    /**
     * The volume mounts for the container.
     *
     * AWS Batch supports `emptyDir` , `hostPath` , and `secret` volume types. For more information about volumes and volume mounts in Kubernetes, see [Volumes](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/) in the *Kubernetes documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainer.html#cfn-batch-jobdefinition-ekscontainer-volumemounts
     */
    readonly volumeMounts?: Array<CfnJobDefinition.EksContainerVolumeMountProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The volume mounts for a container for an Amazon EKS job.
   *
   * For more information about volumes and volume mounts in Kubernetes, see [Volumes](https://docs.aws.amazon.com/https://kubernetes.io/docs/concepts/storage/volumes/) in the *Kubernetes documentation* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainervolumemount.html
   */
  export interface EksContainerVolumeMountProperty {
    /**
     * The path on the container where the volume is mounted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainervolumemount.html#cfn-batch-jobdefinition-ekscontainervolumemount-mountpath
     */
    readonly mountPath?: string;

    /**
     * The name the volume mount.
     *
     * This must match the name of one of the volumes in the pod.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainervolumemount.html#cfn-batch-jobdefinition-ekscontainervolumemount-name
     */
    readonly name?: string;

    /**
     * If this value is `true` , the container has read-only access to the volume.
     *
     * Otherwise, the container can write to the volume. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainervolumemount.html#cfn-batch-jobdefinition-ekscontainervolumemount-readonly
     */
    readonly readOnly?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html
   */
  export interface SecurityContextProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html#cfn-batch-jobdefinition-securitycontext-privileged
     */
    readonly privileged?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html#cfn-batch-jobdefinition-securitycontext-readonlyrootfilesystem
     */
    readonly readOnlyRootFilesystem?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html#cfn-batch-jobdefinition-securitycontext-runasgroup
     */
    readonly runAsGroup?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html#cfn-batch-jobdefinition-securitycontext-runasnonroot
     */
    readonly runAsNonRoot?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-securitycontext.html#cfn-batch-jobdefinition-securitycontext-runasuser
     */
    readonly runAsUser?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resources.html
   */
  export interface ResourcesProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resources.html#cfn-batch-jobdefinition-resources-limits
     */
    readonly limits?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-resources.html#cfn-batch-jobdefinition-resources-requests
     */
    readonly requests?: any | cdk.IResolvable;
  }

  /**
   * An environment variable.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainerenvironmentvariable.html
   */
  export interface EksContainerEnvironmentVariableProperty {
    /**
     * The name of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainerenvironmentvariable.html#cfn-batch-jobdefinition-ekscontainerenvironmentvariable-name
     */
    readonly name: string;

    /**
     * The value of the environment variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-ekscontainerenvironmentvariable.html#cfn-batch-jobdefinition-ekscontainerenvironmentvariable-value
     */
    readonly value?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-metadata.html
   */
  export interface MetadataProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-metadata.html#cfn-batch-jobdefinition-metadata-labels
     */
    readonly labels?: any | cdk.IResolvable;
  }

  /**
   * The retry strategy that's associated with a job.
   *
   * For more information, see [Automated job retries](https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html) in the *AWS Batch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-retrystrategy.html
   */
  export interface RetryStrategyProperty {
    /**
     * The number of times to move a job to the `RUNNABLE` status.
     *
     * You can specify between 1 and 10 attempts. If the value of `attempts` is greater than one, the job is retried on failure the same number of attempts as the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-retrystrategy.html#cfn-batch-jobdefinition-retrystrategy-attempts
     */
    readonly attempts?: number;

    /**
     * Array of up to 5 objects that specify the conditions where jobs are retried or failed.
     *
     * If this parameter is specified, then the `attempts` parameter must also be specified. If none of the listed conditions match, then the job is retried.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-retrystrategy.html#cfn-batch-jobdefinition-retrystrategy-evaluateonexit
     */
    readonly evaluateOnExit?: Array<CfnJobDefinition.EvaluateOnExitProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Specifies an array of up to 5 conditions to be met, and an action to take ( `RETRY` or `EXIT` ) if all conditions are met.
   *
   * If none of the `EvaluateOnExit` conditions in a `RetryStrategy` match, then the job is retried.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-evaluateonexit.html
   */
  export interface EvaluateOnExitProperty {
    /**
     * Specifies the action to take if all of the specified conditions ( `onStatusReason` , `onReason` , and `onExitCode` ) are met.
     *
     * The values aren't case sensitive.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-evaluateonexit.html#cfn-batch-jobdefinition-evaluateonexit-action
     */
    readonly action: string;

    /**
     * Contains a glob pattern to match against the decimal representation of the `ExitCode` returned for a job.
     *
     * The pattern can be up to 512 characters long. It can contain only numbers, and can end with an asterisk (*) so that only the start of the string needs to be an exact match.
     *
     * The string can contain up to 512 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-evaluateonexit.html#cfn-batch-jobdefinition-evaluateonexit-onexitcode
     */
    readonly onExitCode?: string;

    /**
     * Contains a glob pattern to match against the `Reason` returned for a job.
     *
     * The pattern can contain up to 512 characters. It can contain letters, numbers, periods (.), colons (:), and white space (including spaces and tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-evaluateonexit.html#cfn-batch-jobdefinition-evaluateonexit-onreason
     */
    readonly onReason?: string;

    /**
     * Contains a glob pattern to match against the `StatusReason` returned for a job.
     *
     * The pattern can contain up to 512 characters. It can contain letters, numbers, periods (.), colons (:), and white spaces (including spaces or tabs). It can optionally end with an asterisk (*) so that only the start of the string needs to be an exact match.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobdefinition-evaluateonexit.html#cfn-batch-jobdefinition-evaluateonexit-onstatusreason
     */
    readonly onStatusReason?: string;
  }
}

/**
 * Properties for defining a `CfnJobDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html
 */
export interface CfnJobDefinitionProps {
  /**
   * An object with various properties specific to Amazon ECS based jobs.
   *
   * Valid values are `containerProperties` , `eksProperties` , and `nodeProperties` . Only one can be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-containerproperties
   */
  readonly containerProperties?: CfnJobDefinition.ContainerPropertiesProperty | cdk.IResolvable;

  /**
   * An object with various properties that are specific to Amazon EKS based jobs.
   *
   * Valid values are `containerProperties` , `eksProperties` , and `nodeProperties` . Only one can be specified.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-eksproperties
   */
  readonly eksProperties?: CfnJobDefinition.EksPropertiesProperty | cdk.IResolvable;

  /**
   * The name of the job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-jobdefinitionname
   */
  readonly jobDefinitionName?: string;

  /**
   * An object with various properties that are specific to multi-node parallel jobs.
   *
   * Valid values are `containerProperties` , `eksProperties` , and `nodeProperties` . Only one can be specified.
   *
   * > If the job runs on Fargate resources, don't specify `nodeProperties` . Use `containerProperties` instead.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-nodeproperties
   */
  readonly nodeProperties?: cdk.IResolvable | CfnJobDefinition.NodePropertiesProperty;

  /**
   * Default parameters or parameter substitution placeholders that are set in the job definition.
   *
   * Parameters are specified as a key-value pair mapping. Parameters in a `SubmitJob` request override any corresponding parameter defaults from the job definition. For more information about specifying parameters, see [Job definition parameters](https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html) in the *AWS Batch User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-parameters
   */
  readonly parameters?: any | cdk.IResolvable;

  /**
   * The platform capabilities required by the job definition.
   *
   * If no value is specified, it defaults to `EC2` . Jobs run on Fargate resources specify `FARGATE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-platformcapabilities
   */
  readonly platformCapabilities?: Array<string>;

  /**
   * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task.
   *
   * If no value is specified, the tags aren't propagated. Tags can only be propagated to the tasks when the tasks are created. For tags with the same name, job tags are given priority over job definitions tags. If the total number of combined tags from the job and job definition is over 50, the job is moved to the `FAILED` state.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-propagatetags
   */
  readonly propagateTags?: boolean | cdk.IResolvable;

  /**
   * The retry strategy to use for failed jobs that are submitted with this job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-retrystrategy
   */
  readonly retryStrategy?: cdk.IResolvable | CfnJobDefinition.RetryStrategyProperty;

  /**
   * The scheduling priority of the job definition.
   *
   * This only affects jobs in job queues with a fair share policy. Jobs with a higher scheduling priority are scheduled before jobs with a lower scheduling priority.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-schedulingpriority
   */
  readonly schedulingPriority?: number;

  /**
   * The tags that are applied to the job definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-tags
   */
  readonly tags?: any;

  /**
   * The timeout time for jobs that are submitted with this job definition.
   *
   * After the amount of time you specify passes, AWS Batch terminates your jobs if they aren't finished.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-timeout
   */
  readonly timeout?: cdk.IResolvable | CfnJobDefinition.TimeoutProperty;

  /**
   * The type of job definition.
   *
   * For more information about multi-node parallel jobs, see [Creating a multi-node parallel job definition](https://docs.aws.amazon.com/batch/latest/userguide/multi-node-job-def.html) in the *AWS Batch User Guide* .
   *
   * > If the job is run on Fargate resources, then `multinode` isn't supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `SecretProperty`
 *
 * @param properties - the TypeScript properties of a `SecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.requiredValidator)(properties.valueFrom));
  errors.collect(cdk.propertyValidator("valueFrom", cdk.validateString)(properties.valueFrom));
  return errors.wrap("supplied properties not correct for \"SecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionSecretPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ValueFrom": cdk.stringToCloudFormation(properties.valueFrom)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.SecretProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.SecretProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("valueFrom", "ValueFrom", (properties.ValueFrom != null ? cfn_parse.FromCloudFormation.getString(properties.ValueFrom) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TmpfsProperty`
 *
 * @param properties - the TypeScript properties of a `TmpfsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionTmpfsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.requiredValidator)(properties.containerPath));
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("mountOptions", cdk.listValidator(cdk.validateString))(properties.mountOptions));
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"TmpfsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionTmpfsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionTmpfsPropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "MountOptions": cdk.listMapper(cdk.stringToCloudFormation)(properties.mountOptions),
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionTmpfsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.TmpfsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.TmpfsProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("mountOptions", "MountOptions", (properties.MountOptions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MountOptions) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionDevicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("hostPath", cdk.validateString)(properties.hostPath));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  return errors.wrap("supplied properties not correct for \"DeviceProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionDevicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionDevicePropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "HostPath": cdk.stringToCloudFormation(properties.hostPath),
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionDevicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.DeviceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.DeviceProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("hostPath", "HostPath", (properties.HostPath != null ? cfn_parse.FromCloudFormation.getString(properties.HostPath) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LinuxParametersProperty`
 *
 * @param properties - the TypeScript properties of a `LinuxParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionLinuxParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("devices", cdk.listValidator(CfnJobDefinitionDevicePropertyValidator))(properties.devices));
  errors.collect(cdk.propertyValidator("initProcessEnabled", cdk.validateBoolean)(properties.initProcessEnabled));
  errors.collect(cdk.propertyValidator("maxSwap", cdk.validateNumber)(properties.maxSwap));
  errors.collect(cdk.propertyValidator("sharedMemorySize", cdk.validateNumber)(properties.sharedMemorySize));
  errors.collect(cdk.propertyValidator("swappiness", cdk.validateNumber)(properties.swappiness));
  errors.collect(cdk.propertyValidator("tmpfs", cdk.listValidator(CfnJobDefinitionTmpfsPropertyValidator))(properties.tmpfs));
  return errors.wrap("supplied properties not correct for \"LinuxParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionLinuxParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionLinuxParametersPropertyValidator(properties).assertSuccess();
  return {
    "Devices": cdk.listMapper(convertCfnJobDefinitionDevicePropertyToCloudFormation)(properties.devices),
    "InitProcessEnabled": cdk.booleanToCloudFormation(properties.initProcessEnabled),
    "MaxSwap": cdk.numberToCloudFormation(properties.maxSwap),
    "SharedMemorySize": cdk.numberToCloudFormation(properties.sharedMemorySize),
    "Swappiness": cdk.numberToCloudFormation(properties.swappiness),
    "Tmpfs": cdk.listMapper(convertCfnJobDefinitionTmpfsPropertyToCloudFormation)(properties.tmpfs)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionLinuxParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.LinuxParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.LinuxParametersProperty>();
  ret.addPropertyResult("devices", "Devices", (properties.Devices != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionDevicePropertyFromCloudFormation)(properties.Devices) : undefined));
  ret.addPropertyResult("initProcessEnabled", "InitProcessEnabled", (properties.InitProcessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InitProcessEnabled) : undefined));
  ret.addPropertyResult("maxSwap", "MaxSwap", (properties.MaxSwap != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSwap) : undefined));
  ret.addPropertyResult("sharedMemorySize", "SharedMemorySize", (properties.SharedMemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.SharedMemorySize) : undefined));
  ret.addPropertyResult("swappiness", "Swappiness", (properties.Swappiness != null ? cfn_parse.FromCloudFormation.getNumber(properties.Swappiness) : undefined));
  ret.addPropertyResult("tmpfs", "Tmpfs", (properties.Tmpfs != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionTmpfsPropertyFromCloudFormation)(properties.Tmpfs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FargatePlatformConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FargatePlatformConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionFargatePlatformConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("platformVersion", cdk.validateString)(properties.platformVersion));
  return errors.wrap("supplied properties not correct for \"FargatePlatformConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionFargatePlatformConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionFargatePlatformConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "PlatformVersion": cdk.stringToCloudFormation(properties.platformVersion)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionFargatePlatformConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.FargatePlatformConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.FargatePlatformConfigurationProperty>();
  ret.addPropertyResult("platformVersion", "PlatformVersion", (properties.PlatformVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PlatformVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceRequirementProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceRequirementProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionResourceRequirementPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ResourceRequirementProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionResourceRequirementPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionResourceRequirementPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionResourceRequirementPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.ResourceRequirementProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.ResourceRequirementProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logDriver", cdk.requiredValidator)(properties.logDriver));
  errors.collect(cdk.propertyValidator("logDriver", cdk.validateString)(properties.logDriver));
  errors.collect(cdk.propertyValidator("options", cdk.validateObject)(properties.options));
  errors.collect(cdk.propertyValidator("secretOptions", cdk.listValidator(CfnJobDefinitionSecretPropertyValidator))(properties.secretOptions));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogDriver": cdk.stringToCloudFormation(properties.logDriver),
    "Options": cdk.objectToCloudFormation(properties.options),
    "SecretOptions": cdk.listMapper(convertCfnJobDefinitionSecretPropertyToCloudFormation)(properties.secretOptions)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.LogConfigurationProperty>();
  ret.addPropertyResult("logDriver", "LogDriver", (properties.LogDriver != null ? cfn_parse.FromCloudFormation.getString(properties.LogDriver) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getAny(properties.Options) : undefined));
  ret.addPropertyResult("secretOptions", "SecretOptions", (properties.SecretOptions != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionSecretPropertyFromCloudFormation)(properties.SecretOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MountPointsProperty`
 *
 * @param properties - the TypeScript properties of a `MountPointsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionMountPointsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerPath", cdk.validateString)(properties.containerPath));
  errors.collect(cdk.propertyValidator("readOnly", cdk.validateBoolean)(properties.readOnly));
  errors.collect(cdk.propertyValidator("sourceVolume", cdk.validateString)(properties.sourceVolume));
  return errors.wrap("supplied properties not correct for \"MountPointsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionMountPointsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionMountPointsPropertyValidator(properties).assertSuccess();
  return {
    "ContainerPath": cdk.stringToCloudFormation(properties.containerPath),
    "ReadOnly": cdk.booleanToCloudFormation(properties.readOnly),
    "SourceVolume": cdk.stringToCloudFormation(properties.sourceVolume)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionMountPointsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.MountPointsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.MountPointsProperty>();
  ret.addPropertyResult("containerPath", "ContainerPath", (properties.ContainerPath != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerPath) : undefined));
  ret.addPropertyResult("readOnly", "ReadOnly", (properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined));
  ret.addPropertyResult("sourceVolume", "SourceVolume", (properties.SourceVolume != null ? cfn_parse.FromCloudFormation.getString(properties.SourceVolume) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuntimePlatformProperty`
 *
 * @param properties - the TypeScript properties of a `RuntimePlatformProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionRuntimePlatformPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuArchitecture", cdk.validateString)(properties.cpuArchitecture));
  errors.collect(cdk.propertyValidator("operatingSystemFamily", cdk.validateString)(properties.operatingSystemFamily));
  return errors.wrap("supplied properties not correct for \"RuntimePlatformProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionRuntimePlatformPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionRuntimePlatformPropertyValidator(properties).assertSuccess();
  return {
    "CpuArchitecture": cdk.stringToCloudFormation(properties.cpuArchitecture),
    "OperatingSystemFamily": cdk.stringToCloudFormation(properties.operatingSystemFamily)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionRuntimePlatformPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.RuntimePlatformProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.RuntimePlatformProperty>();
  ret.addPropertyResult("cpuArchitecture", "CpuArchitecture", (properties.CpuArchitecture != null ? cfn_parse.FromCloudFormation.getString(properties.CpuArchitecture) : undefined));
  ret.addPropertyResult("operatingSystemFamily", "OperatingSystemFamily", (properties.OperatingSystemFamily != null ? cfn_parse.FromCloudFormation.getString(properties.OperatingSystemFamily) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumesHostProperty`
 *
 * @param properties - the TypeScript properties of a `VolumesHostProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionVolumesHostPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourcePath", cdk.validateString)(properties.sourcePath));
  return errors.wrap("supplied properties not correct for \"VolumesHostProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionVolumesHostPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionVolumesHostPropertyValidator(properties).assertSuccess();
  return {
    "SourcePath": cdk.stringToCloudFormation(properties.sourcePath)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionVolumesHostPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.VolumesHostProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.VolumesHostProperty>();
  ret.addPropertyResult("sourcePath", "SourcePath", (properties.SourcePath != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthorizationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionAuthorizationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessPointId", cdk.validateString)(properties.accessPointId));
  errors.collect(cdk.propertyValidator("iam", cdk.validateString)(properties.iam));
  return errors.wrap("supplied properties not correct for \"AuthorizationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionAuthorizationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionAuthorizationConfigPropertyValidator(properties).assertSuccess();
  return {
    "AccessPointId": cdk.stringToCloudFormation(properties.accessPointId),
    "Iam": cdk.stringToCloudFormation(properties.iam)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionAuthorizationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.AuthorizationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.AuthorizationConfigProperty>();
  ret.addPropertyResult("accessPointId", "AccessPointId", (properties.AccessPointId != null ? cfn_parse.FromCloudFormation.getString(properties.AccessPointId) : undefined));
  ret.addPropertyResult("iam", "Iam", (properties.Iam != null ? cfn_parse.FromCloudFormation.getString(properties.Iam) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EfsVolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EfsVolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEfsVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationConfig", CfnJobDefinitionAuthorizationConfigPropertyValidator)(properties.authorizationConfig));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.requiredValidator)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("rootDirectory", cdk.validateString)(properties.rootDirectory));
  errors.collect(cdk.propertyValidator("transitEncryption", cdk.validateString)(properties.transitEncryption));
  errors.collect(cdk.propertyValidator("transitEncryptionPort", cdk.validateNumber)(properties.transitEncryptionPort));
  return errors.wrap("supplied properties not correct for \"EfsVolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEfsVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEfsVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationConfig": convertCfnJobDefinitionAuthorizationConfigPropertyToCloudFormation(properties.authorizationConfig),
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "RootDirectory": cdk.stringToCloudFormation(properties.rootDirectory),
    "TransitEncryption": cdk.stringToCloudFormation(properties.transitEncryption),
    "TransitEncryptionPort": cdk.numberToCloudFormation(properties.transitEncryptionPort)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEfsVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EfsVolumeConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EfsVolumeConfigurationProperty>();
  ret.addPropertyResult("authorizationConfig", "AuthorizationConfig", (properties.AuthorizationConfig != null ? CfnJobDefinitionAuthorizationConfigPropertyFromCloudFormation(properties.AuthorizationConfig) : undefined));
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("rootDirectory", "RootDirectory", (properties.RootDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.RootDirectory) : undefined));
  ret.addPropertyResult("transitEncryption", "TransitEncryption", (properties.TransitEncryption != null ? cfn_parse.FromCloudFormation.getString(properties.TransitEncryption) : undefined));
  ret.addPropertyResult("transitEncryptionPort", "TransitEncryptionPort", (properties.TransitEncryptionPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.TransitEncryptionPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumesProperty`
 *
 * @param properties - the TypeScript properties of a `VolumesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionVolumesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("efsVolumeConfiguration", CfnJobDefinitionEfsVolumeConfigurationPropertyValidator)(properties.efsVolumeConfiguration));
  errors.collect(cdk.propertyValidator("host", CfnJobDefinitionVolumesHostPropertyValidator)(properties.host));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"VolumesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionVolumesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionVolumesPropertyValidator(properties).assertSuccess();
  return {
    "EfsVolumeConfiguration": convertCfnJobDefinitionEfsVolumeConfigurationPropertyToCloudFormation(properties.efsVolumeConfiguration),
    "Host": convertCfnJobDefinitionVolumesHostPropertyToCloudFormation(properties.host),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionVolumesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.VolumesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.VolumesProperty>();
  ret.addPropertyResult("efsVolumeConfiguration", "EfsVolumeConfiguration", (properties.EfsVolumeConfiguration != null ? CfnJobDefinitionEfsVolumeConfigurationPropertyFromCloudFormation(properties.EfsVolumeConfiguration) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? CfnJobDefinitionVolumesHostPropertyFromCloudFormation(properties.Host) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EnvironmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEnvironmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEnvironmentPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EnvironmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EnvironmentProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UlimitProperty`
 *
 * @param properties - the TypeScript properties of a `UlimitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionUlimitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hardLimit", cdk.requiredValidator)(properties.hardLimit));
  errors.collect(cdk.propertyValidator("hardLimit", cdk.validateNumber)(properties.hardLimit));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("softLimit", cdk.requiredValidator)(properties.softLimit));
  errors.collect(cdk.propertyValidator("softLimit", cdk.validateNumber)(properties.softLimit));
  return errors.wrap("supplied properties not correct for \"UlimitProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionUlimitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionUlimitPropertyValidator(properties).assertSuccess();
  return {
    "HardLimit": cdk.numberToCloudFormation(properties.hardLimit),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SoftLimit": cdk.numberToCloudFormation(properties.softLimit)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionUlimitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.UlimitProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.UlimitProperty>();
  ret.addPropertyResult("hardLimit", "HardLimit", (properties.HardLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.HardLimit) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("softLimit", "SoftLimit", (properties.SoftLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.SoftLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignPublicIp", cdk.validateString)(properties.assignPublicIp));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AssignPublicIp": cdk.stringToCloudFormation(properties.assignPublicIp)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.NetworkConfigurationProperty>();
  ret.addPropertyResult("assignPublicIp", "AssignPublicIp", (properties.AssignPublicIp != null ? cfn_parse.FromCloudFormation.getString(properties.AssignPublicIp) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.requiredValidator)(properties.sizeInGiB));
  errors.collect(cdk.propertyValidator("sizeInGiB", cdk.validateNumber)(properties.sizeInGiB));
  return errors.wrap("supplied properties not correct for \"EphemeralStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEphemeralStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEphemeralStoragePropertyValidator(properties).assertSuccess();
  return {
    "SizeInGiB": cdk.numberToCloudFormation(properties.sizeInGiB)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EphemeralStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EphemeralStorageProperty>();
  ret.addPropertyResult("sizeInGiB", "SizeInGiB", (properties.SizeInGiB != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGiB) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionContainerPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnJobDefinitionEnvironmentPropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("ephemeralStorage", CfnJobDefinitionEphemeralStoragePropertyValidator)(properties.ephemeralStorage));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("fargatePlatformConfiguration", CfnJobDefinitionFargatePlatformConfigurationPropertyValidator)(properties.fargatePlatformConfiguration));
  errors.collect(cdk.propertyValidator("image", cdk.requiredValidator)(properties.image));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  errors.collect(cdk.propertyValidator("instanceType", cdk.validateString)(properties.instanceType));
  errors.collect(cdk.propertyValidator("jobRoleArn", cdk.validateString)(properties.jobRoleArn));
  errors.collect(cdk.propertyValidator("linuxParameters", CfnJobDefinitionLinuxParametersPropertyValidator)(properties.linuxParameters));
  errors.collect(cdk.propertyValidator("logConfiguration", CfnJobDefinitionLogConfigurationPropertyValidator)(properties.logConfiguration));
  errors.collect(cdk.propertyValidator("memory", cdk.validateNumber)(properties.memory));
  errors.collect(cdk.propertyValidator("mountPoints", cdk.listValidator(CfnJobDefinitionMountPointsPropertyValidator))(properties.mountPoints));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnJobDefinitionNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("privileged", cdk.validateBoolean)(properties.privileged));
  errors.collect(cdk.propertyValidator("readonlyRootFilesystem", cdk.validateBoolean)(properties.readonlyRootFilesystem));
  errors.collect(cdk.propertyValidator("resourceRequirements", cdk.listValidator(CfnJobDefinitionResourceRequirementPropertyValidator))(properties.resourceRequirements));
  errors.collect(cdk.propertyValidator("runtimePlatform", CfnJobDefinitionRuntimePlatformPropertyValidator)(properties.runtimePlatform));
  errors.collect(cdk.propertyValidator("secrets", cdk.listValidator(CfnJobDefinitionSecretPropertyValidator))(properties.secrets));
  errors.collect(cdk.propertyValidator("ulimits", cdk.listValidator(CfnJobDefinitionUlimitPropertyValidator))(properties.ulimits));
  errors.collect(cdk.propertyValidator("user", cdk.validateString)(properties.user));
  errors.collect(cdk.propertyValidator("vcpus", cdk.validateNumber)(properties.vcpus));
  errors.collect(cdk.propertyValidator("volumes", cdk.listValidator(CfnJobDefinitionVolumesPropertyValidator))(properties.volumes));
  return errors.wrap("supplied properties not correct for \"ContainerPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionContainerPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionContainerPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Environment": cdk.listMapper(convertCfnJobDefinitionEnvironmentPropertyToCloudFormation)(properties.environment),
    "EphemeralStorage": convertCfnJobDefinitionEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "FargatePlatformConfiguration": convertCfnJobDefinitionFargatePlatformConfigurationPropertyToCloudFormation(properties.fargatePlatformConfiguration),
    "Image": cdk.stringToCloudFormation(properties.image),
    "InstanceType": cdk.stringToCloudFormation(properties.instanceType),
    "JobRoleArn": cdk.stringToCloudFormation(properties.jobRoleArn),
    "LinuxParameters": convertCfnJobDefinitionLinuxParametersPropertyToCloudFormation(properties.linuxParameters),
    "LogConfiguration": convertCfnJobDefinitionLogConfigurationPropertyToCloudFormation(properties.logConfiguration),
    "Memory": cdk.numberToCloudFormation(properties.memory),
    "MountPoints": cdk.listMapper(convertCfnJobDefinitionMountPointsPropertyToCloudFormation)(properties.mountPoints),
    "NetworkConfiguration": convertCfnJobDefinitionNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "Privileged": cdk.booleanToCloudFormation(properties.privileged),
    "ReadonlyRootFilesystem": cdk.booleanToCloudFormation(properties.readonlyRootFilesystem),
    "ResourceRequirements": cdk.listMapper(convertCfnJobDefinitionResourceRequirementPropertyToCloudFormation)(properties.resourceRequirements),
    "RuntimePlatform": convertCfnJobDefinitionRuntimePlatformPropertyToCloudFormation(properties.runtimePlatform),
    "Secrets": cdk.listMapper(convertCfnJobDefinitionSecretPropertyToCloudFormation)(properties.secrets),
    "Ulimits": cdk.listMapper(convertCfnJobDefinitionUlimitPropertyToCloudFormation)(properties.ulimits),
    "User": cdk.stringToCloudFormation(properties.user),
    "Vcpus": cdk.numberToCloudFormation(properties.vcpus),
    "Volumes": cdk.listMapper(convertCfnJobDefinitionVolumesPropertyToCloudFormation)(properties.volumes)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionContainerPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.ContainerPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.ContainerPropertiesProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEnvironmentPropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("ephemeralStorage", "EphemeralStorage", (properties.EphemeralStorage != null ? CfnJobDefinitionEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("fargatePlatformConfiguration", "FargatePlatformConfiguration", (properties.FargatePlatformConfiguration != null ? CfnJobDefinitionFargatePlatformConfigurationPropertyFromCloudFormation(properties.FargatePlatformConfiguration) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addPropertyResult("instanceType", "InstanceType", (properties.InstanceType != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceType) : undefined));
  ret.addPropertyResult("jobRoleArn", "JobRoleArn", (properties.JobRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.JobRoleArn) : undefined));
  ret.addPropertyResult("linuxParameters", "LinuxParameters", (properties.LinuxParameters != null ? CfnJobDefinitionLinuxParametersPropertyFromCloudFormation(properties.LinuxParameters) : undefined));
  ret.addPropertyResult("logConfiguration", "LogConfiguration", (properties.LogConfiguration != null ? CfnJobDefinitionLogConfigurationPropertyFromCloudFormation(properties.LogConfiguration) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getNumber(properties.Memory) : undefined));
  ret.addPropertyResult("mountPoints", "MountPoints", (properties.MountPoints != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionMountPointsPropertyFromCloudFormation)(properties.MountPoints) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnJobDefinitionNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("privileged", "Privileged", (properties.Privileged != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Privileged) : undefined));
  ret.addPropertyResult("readonlyRootFilesystem", "ReadonlyRootFilesystem", (properties.ReadonlyRootFilesystem != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadonlyRootFilesystem) : undefined));
  ret.addPropertyResult("resourceRequirements", "ResourceRequirements", (properties.ResourceRequirements != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionResourceRequirementPropertyFromCloudFormation)(properties.ResourceRequirements) : undefined));
  ret.addPropertyResult("runtimePlatform", "RuntimePlatform", (properties.RuntimePlatform != null ? CfnJobDefinitionRuntimePlatformPropertyFromCloudFormation(properties.RuntimePlatform) : undefined));
  ret.addPropertyResult("secrets", "Secrets", (properties.Secrets != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionSecretPropertyFromCloudFormation)(properties.Secrets) : undefined));
  ret.addPropertyResult("ulimits", "Ulimits", (properties.Ulimits != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionUlimitPropertyFromCloudFormation)(properties.Ulimits) : undefined));
  ret.addPropertyResult("user", "User", (properties.User != null ? cfn_parse.FromCloudFormation.getString(properties.User) : undefined));
  ret.addPropertyResult("vcpus", "Vcpus", (properties.Vcpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.Vcpus) : undefined));
  ret.addPropertyResult("volumes", "Volumes", (properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionVolumesPropertyFromCloudFormation)(properties.Volumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NodeRangePropertyProperty`
 *
 * @param properties - the TypeScript properties of a `NodeRangePropertyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionNodeRangePropertyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("container", CfnJobDefinitionContainerPropertiesPropertyValidator)(properties.container));
  errors.collect(cdk.propertyValidator("targetNodes", cdk.requiredValidator)(properties.targetNodes));
  errors.collect(cdk.propertyValidator("targetNodes", cdk.validateString)(properties.targetNodes));
  return errors.wrap("supplied properties not correct for \"NodeRangePropertyProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionNodeRangePropertyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionNodeRangePropertyPropertyValidator(properties).assertSuccess();
  return {
    "Container": convertCfnJobDefinitionContainerPropertiesPropertyToCloudFormation(properties.container),
    "TargetNodes": cdk.stringToCloudFormation(properties.targetNodes)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionNodeRangePropertyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.NodeRangePropertyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.NodeRangePropertyProperty>();
  ret.addPropertyResult("container", "Container", (properties.Container != null ? CfnJobDefinitionContainerPropertiesPropertyFromCloudFormation(properties.Container) : undefined));
  ret.addPropertyResult("targetNodes", "TargetNodes", (properties.TargetNodes != null ? cfn_parse.FromCloudFormation.getString(properties.TargetNodes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NodePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `NodePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionNodePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mainNode", cdk.requiredValidator)(properties.mainNode));
  errors.collect(cdk.propertyValidator("mainNode", cdk.validateNumber)(properties.mainNode));
  errors.collect(cdk.propertyValidator("nodeRangeProperties", cdk.requiredValidator)(properties.nodeRangeProperties));
  errors.collect(cdk.propertyValidator("nodeRangeProperties", cdk.listValidator(CfnJobDefinitionNodeRangePropertyPropertyValidator))(properties.nodeRangeProperties));
  errors.collect(cdk.propertyValidator("numNodes", cdk.requiredValidator)(properties.numNodes));
  errors.collect(cdk.propertyValidator("numNodes", cdk.validateNumber)(properties.numNodes));
  return errors.wrap("supplied properties not correct for \"NodePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionNodePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionNodePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "MainNode": cdk.numberToCloudFormation(properties.mainNode),
    "NodeRangeProperties": cdk.listMapper(convertCfnJobDefinitionNodeRangePropertyPropertyToCloudFormation)(properties.nodeRangeProperties),
    "NumNodes": cdk.numberToCloudFormation(properties.numNodes)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionNodePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.NodePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.NodePropertiesProperty>();
  ret.addPropertyResult("mainNode", "MainNode", (properties.MainNode != null ? cfn_parse.FromCloudFormation.getNumber(properties.MainNode) : undefined));
  ret.addPropertyResult("nodeRangeProperties", "NodeRangeProperties", (properties.NodeRangeProperties != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionNodeRangePropertyPropertyFromCloudFormation)(properties.NodeRangeProperties) : undefined));
  ret.addPropertyResult("numNodes", "NumNodes", (properties.NumNodes != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumNodes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobTimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `JobTimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionJobTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attemptDurationSeconds", cdk.validateNumber)(properties.attemptDurationSeconds));
  return errors.wrap("supplied properties not correct for \"JobTimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionJobTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionJobTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "AttemptDurationSeconds": cdk.numberToCloudFormation(properties.attemptDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionJobTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.JobTimeoutProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.JobTimeoutProperty>();
  ret.addPropertyResult("attemptDurationSeconds", "AttemptDurationSeconds", (properties.AttemptDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttemptDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimeoutProperty`
 *
 * @param properties - the TypeScript properties of a `TimeoutProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionTimeoutPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attemptDurationSeconds", cdk.validateNumber)(properties.attemptDurationSeconds));
  return errors.wrap("supplied properties not correct for \"TimeoutProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionTimeoutPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionTimeoutPropertyValidator(properties).assertSuccess();
  return {
    "AttemptDurationSeconds": cdk.numberToCloudFormation(properties.attemptDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionTimeoutPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.TimeoutProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.TimeoutProperty>();
  ret.addPropertyResult("attemptDurationSeconds", "AttemptDurationSeconds", (properties.AttemptDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.AttemptDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksSecretProperty`
 *
 * @param properties - the TypeScript properties of a `EksSecretProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksSecretPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("optional", cdk.validateBoolean)(properties.optional));
  errors.collect(cdk.propertyValidator("secretName", cdk.requiredValidator)(properties.secretName));
  errors.collect(cdk.propertyValidator("secretName", cdk.validateString)(properties.secretName));
  return errors.wrap("supplied properties not correct for \"EksSecretProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksSecretPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksSecretPropertyValidator(properties).assertSuccess();
  return {
    "Optional": cdk.booleanToCloudFormation(properties.optional),
    "SecretName": cdk.stringToCloudFormation(properties.secretName)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksSecretPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksSecretProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksSecretProperty>();
  ret.addPropertyResult("optional", "Optional", (properties.Optional != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Optional) : undefined));
  ret.addPropertyResult("secretName", "SecretName", (properties.SecretName != null ? cfn_parse.FromCloudFormation.getString(properties.SecretName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EmptyDirProperty`
 *
 * @param properties - the TypeScript properties of a `EmptyDirProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEmptyDirPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("medium", cdk.validateString)(properties.medium));
  errors.collect(cdk.propertyValidator("sizeLimit", cdk.validateString)(properties.sizeLimit));
  return errors.wrap("supplied properties not correct for \"EmptyDirProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEmptyDirPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEmptyDirPropertyValidator(properties).assertSuccess();
  return {
    "Medium": cdk.stringToCloudFormation(properties.medium),
    "SizeLimit": cdk.stringToCloudFormation(properties.sizeLimit)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEmptyDirPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EmptyDirProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EmptyDirProperty>();
  ret.addPropertyResult("medium", "Medium", (properties.Medium != null ? cfn_parse.FromCloudFormation.getString(properties.Medium) : undefined));
  ret.addPropertyResult("sizeLimit", "SizeLimit", (properties.SizeLimit != null ? cfn_parse.FromCloudFormation.getString(properties.SizeLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HostPathProperty`
 *
 * @param properties - the TypeScript properties of a `HostPathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionHostPathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"HostPathProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionHostPathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionHostPathPropertyValidator(properties).assertSuccess();
  return {
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionHostPathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.HostPathProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.HostPathProperty>();
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksVolumeProperty`
 *
 * @param properties - the TypeScript properties of a `EksVolumeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksVolumePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emptyDir", CfnJobDefinitionEmptyDirPropertyValidator)(properties.emptyDir));
  errors.collect(cdk.propertyValidator("hostPath", CfnJobDefinitionHostPathPropertyValidator)(properties.hostPath));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("secret", CfnJobDefinitionEksSecretPropertyValidator)(properties.secret));
  return errors.wrap("supplied properties not correct for \"EksVolumeProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksVolumePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksVolumePropertyValidator(properties).assertSuccess();
  return {
    "EmptyDir": convertCfnJobDefinitionEmptyDirPropertyToCloudFormation(properties.emptyDir),
    "HostPath": convertCfnJobDefinitionHostPathPropertyToCloudFormation(properties.hostPath),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Secret": convertCfnJobDefinitionEksSecretPropertyToCloudFormation(properties.secret)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksVolumePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksVolumeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksVolumeProperty>();
  ret.addPropertyResult("emptyDir", "EmptyDir", (properties.EmptyDir != null ? CfnJobDefinitionEmptyDirPropertyFromCloudFormation(properties.EmptyDir) : undefined));
  ret.addPropertyResult("hostPath", "HostPath", (properties.HostPath != null ? CfnJobDefinitionHostPathPropertyFromCloudFormation(properties.HostPath) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("secret", "Secret", (properties.Secret != null ? CfnJobDefinitionEksSecretPropertyFromCloudFormation(properties.Secret) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksContainerVolumeMountProperty`
 *
 * @param properties - the TypeScript properties of a `EksContainerVolumeMountProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksContainerVolumeMountPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mountPath", cdk.validateString)(properties.mountPath));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("readOnly", cdk.validateBoolean)(properties.readOnly));
  return errors.wrap("supplied properties not correct for \"EksContainerVolumeMountProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksContainerVolumeMountPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksContainerVolumeMountPropertyValidator(properties).assertSuccess();
  return {
    "MountPath": cdk.stringToCloudFormation(properties.mountPath),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReadOnly": cdk.booleanToCloudFormation(properties.readOnly)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksContainerVolumeMountPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksContainerVolumeMountProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksContainerVolumeMountProperty>();
  ret.addPropertyResult("mountPath", "MountPath", (properties.MountPath != null ? cfn_parse.FromCloudFormation.getString(properties.MountPath) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("readOnly", "ReadOnly", (properties.ReadOnly != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnly) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecurityContextProperty`
 *
 * @param properties - the TypeScript properties of a `SecurityContextProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionSecurityContextPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("privileged", cdk.validateBoolean)(properties.privileged));
  errors.collect(cdk.propertyValidator("readOnlyRootFilesystem", cdk.validateBoolean)(properties.readOnlyRootFilesystem));
  errors.collect(cdk.propertyValidator("runAsGroup", cdk.validateNumber)(properties.runAsGroup));
  errors.collect(cdk.propertyValidator("runAsNonRoot", cdk.validateBoolean)(properties.runAsNonRoot));
  errors.collect(cdk.propertyValidator("runAsUser", cdk.validateNumber)(properties.runAsUser));
  return errors.wrap("supplied properties not correct for \"SecurityContextProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionSecurityContextPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionSecurityContextPropertyValidator(properties).assertSuccess();
  return {
    "Privileged": cdk.booleanToCloudFormation(properties.privileged),
    "ReadOnlyRootFilesystem": cdk.booleanToCloudFormation(properties.readOnlyRootFilesystem),
    "RunAsGroup": cdk.numberToCloudFormation(properties.runAsGroup),
    "RunAsNonRoot": cdk.booleanToCloudFormation(properties.runAsNonRoot),
    "RunAsUser": cdk.numberToCloudFormation(properties.runAsUser)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionSecurityContextPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.SecurityContextProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.SecurityContextProperty>();
  ret.addPropertyResult("privileged", "Privileged", (properties.Privileged != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Privileged) : undefined));
  ret.addPropertyResult("readOnlyRootFilesystem", "ReadOnlyRootFilesystem", (properties.ReadOnlyRootFilesystem != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReadOnlyRootFilesystem) : undefined));
  ret.addPropertyResult("runAsGroup", "RunAsGroup", (properties.RunAsGroup != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunAsGroup) : undefined));
  ret.addPropertyResult("runAsNonRoot", "RunAsNonRoot", (properties.RunAsNonRoot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RunAsNonRoot) : undefined));
  ret.addPropertyResult("runAsUser", "RunAsUser", (properties.RunAsUser != null ? cfn_parse.FromCloudFormation.getNumber(properties.RunAsUser) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourcesProperty`
 *
 * @param properties - the TypeScript properties of a `ResourcesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionResourcesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("limits", cdk.validateObject)(properties.limits));
  errors.collect(cdk.propertyValidator("requests", cdk.validateObject)(properties.requests));
  return errors.wrap("supplied properties not correct for \"ResourcesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionResourcesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionResourcesPropertyValidator(properties).assertSuccess();
  return {
    "Limits": cdk.objectToCloudFormation(properties.limits),
    "Requests": cdk.objectToCloudFormation(properties.requests)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionResourcesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.ResourcesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.ResourcesProperty>();
  ret.addPropertyResult("limits", "Limits", (properties.Limits != null ? cfn_parse.FromCloudFormation.getAny(properties.Limits) : undefined));
  ret.addPropertyResult("requests", "Requests", (properties.Requests != null ? cfn_parse.FromCloudFormation.getAny(properties.Requests) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksContainerEnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EksContainerEnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksContainerEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"EksContainerEnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksContainerEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksContainerEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksContainerEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksContainerEnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksContainerEnvironmentVariableProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksContainerProperty`
 *
 * @param properties - the TypeScript properties of a `EksContainerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksContainerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("args", cdk.listValidator(cdk.validateString))(properties.args));
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("env", cdk.listValidator(CfnJobDefinitionEksContainerEnvironmentVariablePropertyValidator))(properties.env));
  errors.collect(cdk.propertyValidator("image", cdk.requiredValidator)(properties.image));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  errors.collect(cdk.propertyValidator("imagePullPolicy", cdk.validateString)(properties.imagePullPolicy));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("resources", CfnJobDefinitionResourcesPropertyValidator)(properties.resources));
  errors.collect(cdk.propertyValidator("securityContext", CfnJobDefinitionSecurityContextPropertyValidator)(properties.securityContext));
  errors.collect(cdk.propertyValidator("volumeMounts", cdk.listValidator(CfnJobDefinitionEksContainerVolumeMountPropertyValidator))(properties.volumeMounts));
  return errors.wrap("supplied properties not correct for \"EksContainerProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksContainerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksContainerPropertyValidator(properties).assertSuccess();
  return {
    "Args": cdk.listMapper(cdk.stringToCloudFormation)(properties.args),
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "Env": cdk.listMapper(convertCfnJobDefinitionEksContainerEnvironmentVariablePropertyToCloudFormation)(properties.env),
    "Image": cdk.stringToCloudFormation(properties.image),
    "ImagePullPolicy": cdk.stringToCloudFormation(properties.imagePullPolicy),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Resources": convertCfnJobDefinitionResourcesPropertyToCloudFormation(properties.resources),
    "SecurityContext": convertCfnJobDefinitionSecurityContextPropertyToCloudFormation(properties.securityContext),
    "VolumeMounts": cdk.listMapper(convertCfnJobDefinitionEksContainerVolumeMountPropertyToCloudFormation)(properties.volumeMounts)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksContainerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksContainerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksContainerProperty>();
  ret.addPropertyResult("args", "Args", (properties.Args != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Args) : undefined));
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("env", "Env", (properties.Env != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEksContainerEnvironmentVariablePropertyFromCloudFormation)(properties.Env) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addPropertyResult("imagePullPolicy", "ImagePullPolicy", (properties.ImagePullPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ImagePullPolicy) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? CfnJobDefinitionResourcesPropertyFromCloudFormation(properties.Resources) : undefined));
  ret.addPropertyResult("securityContext", "SecurityContext", (properties.SecurityContext != null ? CfnJobDefinitionSecurityContextPropertyFromCloudFormation(properties.SecurityContext) : undefined));
  ret.addPropertyResult("volumeMounts", "VolumeMounts", (properties.VolumeMounts != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEksContainerVolumeMountPropertyFromCloudFormation)(properties.VolumeMounts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetadataProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("labels", cdk.validateObject)(properties.labels));
  return errors.wrap("supplied properties not correct for \"MetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionMetadataPropertyValidator(properties).assertSuccess();
  return {
    "Labels": cdk.objectToCloudFormation(properties.labels)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.MetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.MetadataProperty>();
  ret.addPropertyResult("labels", "Labels", (properties.Labels != null ? cfn_parse.FromCloudFormation.getAny(properties.Labels) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PodPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `PodPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionPodPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containers", cdk.listValidator(CfnJobDefinitionEksContainerPropertyValidator))(properties.containers));
  errors.collect(cdk.propertyValidator("dnsPolicy", cdk.validateString)(properties.dnsPolicy));
  errors.collect(cdk.propertyValidator("hostNetwork", cdk.validateBoolean)(properties.hostNetwork));
  errors.collect(cdk.propertyValidator("metadata", CfnJobDefinitionMetadataPropertyValidator)(properties.metadata));
  errors.collect(cdk.propertyValidator("serviceAccountName", cdk.validateString)(properties.serviceAccountName));
  errors.collect(cdk.propertyValidator("volumes", cdk.listValidator(CfnJobDefinitionEksVolumePropertyValidator))(properties.volumes));
  return errors.wrap("supplied properties not correct for \"PodPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionPodPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionPodPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Containers": cdk.listMapper(convertCfnJobDefinitionEksContainerPropertyToCloudFormation)(properties.containers),
    "DnsPolicy": cdk.stringToCloudFormation(properties.dnsPolicy),
    "HostNetwork": cdk.booleanToCloudFormation(properties.hostNetwork),
    "Metadata": convertCfnJobDefinitionMetadataPropertyToCloudFormation(properties.metadata),
    "ServiceAccountName": cdk.stringToCloudFormation(properties.serviceAccountName),
    "Volumes": cdk.listMapper(convertCfnJobDefinitionEksVolumePropertyToCloudFormation)(properties.volumes)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionPodPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.PodPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.PodPropertiesProperty>();
  ret.addPropertyResult("containers", "Containers", (properties.Containers != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEksContainerPropertyFromCloudFormation)(properties.Containers) : undefined));
  ret.addPropertyResult("dnsPolicy", "DnsPolicy", (properties.DnsPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DnsPolicy) : undefined));
  ret.addPropertyResult("hostNetwork", "HostNetwork", (properties.HostNetwork != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HostNetwork) : undefined));
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? CfnJobDefinitionMetadataPropertyFromCloudFormation(properties.Metadata) : undefined));
  ret.addPropertyResult("serviceAccountName", "ServiceAccountName", (properties.ServiceAccountName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceAccountName) : undefined));
  ret.addPropertyResult("volumes", "Volumes", (properties.Volumes != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEksVolumePropertyFromCloudFormation)(properties.Volumes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EksPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EksPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEksPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("podProperties", CfnJobDefinitionPodPropertiesPropertyValidator)(properties.podProperties));
  return errors.wrap("supplied properties not correct for \"EksPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEksPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEksPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "PodProperties": convertCfnJobDefinitionPodPropertiesPropertyToCloudFormation(properties.podProperties)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEksPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EksPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EksPropertiesProperty>();
  ret.addPropertyResult("podProperties", "PodProperties", (properties.PodProperties != null ? CfnJobDefinitionPodPropertiesPropertyFromCloudFormation(properties.PodProperties) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluateOnExitProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluateOnExitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionEvaluateOnExitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", cdk.validateString)(properties.action));
  errors.collect(cdk.propertyValidator("onExitCode", cdk.validateString)(properties.onExitCode));
  errors.collect(cdk.propertyValidator("onReason", cdk.validateString)(properties.onReason));
  errors.collect(cdk.propertyValidator("onStatusReason", cdk.validateString)(properties.onStatusReason));
  return errors.wrap("supplied properties not correct for \"EvaluateOnExitProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionEvaluateOnExitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionEvaluateOnExitPropertyValidator(properties).assertSuccess();
  return {
    "Action": cdk.stringToCloudFormation(properties.action),
    "OnExitCode": cdk.stringToCloudFormation(properties.onExitCode),
    "OnReason": cdk.stringToCloudFormation(properties.onReason),
    "OnStatusReason": cdk.stringToCloudFormation(properties.onStatusReason)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionEvaluateOnExitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinition.EvaluateOnExitProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.EvaluateOnExitProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? cfn_parse.FromCloudFormation.getString(properties.Action) : undefined));
  ret.addPropertyResult("onExitCode", "OnExitCode", (properties.OnExitCode != null ? cfn_parse.FromCloudFormation.getString(properties.OnExitCode) : undefined));
  ret.addPropertyResult("onReason", "OnReason", (properties.OnReason != null ? cfn_parse.FromCloudFormation.getString(properties.OnReason) : undefined));
  ret.addPropertyResult("onStatusReason", "OnStatusReason", (properties.OnStatusReason != null ? cfn_parse.FromCloudFormation.getString(properties.OnStatusReason) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetryStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `RetryStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionRetryStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attempts", cdk.validateNumber)(properties.attempts));
  errors.collect(cdk.propertyValidator("evaluateOnExit", cdk.listValidator(CfnJobDefinitionEvaluateOnExitPropertyValidator))(properties.evaluateOnExit));
  return errors.wrap("supplied properties not correct for \"RetryStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionRetryStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionRetryStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Attempts": cdk.numberToCloudFormation(properties.attempts),
    "EvaluateOnExit": cdk.listMapper(convertCfnJobDefinitionEvaluateOnExitPropertyToCloudFormation)(properties.evaluateOnExit)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionRetryStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJobDefinition.RetryStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinition.RetryStrategyProperty>();
  ret.addPropertyResult("attempts", "Attempts", (properties.Attempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.Attempts) : undefined));
  ret.addPropertyResult("evaluateOnExit", "EvaluateOnExit", (properties.EvaluateOnExit != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDefinitionEvaluateOnExitPropertyFromCloudFormation)(properties.EvaluateOnExit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnJobDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnJobDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerProperties", CfnJobDefinitionContainerPropertiesPropertyValidator)(properties.containerProperties));
  errors.collect(cdk.propertyValidator("eksProperties", CfnJobDefinitionEksPropertiesPropertyValidator)(properties.eksProperties));
  errors.collect(cdk.propertyValidator("jobDefinitionName", cdk.validateString)(properties.jobDefinitionName));
  errors.collect(cdk.propertyValidator("nodeProperties", CfnJobDefinitionNodePropertiesPropertyValidator)(properties.nodeProperties));
  errors.collect(cdk.propertyValidator("parameters", cdk.validateObject)(properties.parameters));
  errors.collect(cdk.propertyValidator("platformCapabilities", cdk.listValidator(cdk.validateString))(properties.platformCapabilities));
  errors.collect(cdk.propertyValidator("propagateTags", cdk.validateBoolean)(properties.propagateTags));
  errors.collect(cdk.propertyValidator("retryStrategy", CfnJobDefinitionRetryStrategyPropertyValidator)(properties.retryStrategy));
  errors.collect(cdk.propertyValidator("schedulingPriority", cdk.validateNumber)(properties.schedulingPriority));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("timeout", CfnJobDefinitionTimeoutPropertyValidator)(properties.timeout));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnJobDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnJobDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDefinitionPropsValidator(properties).assertSuccess();
  return {
    "ContainerProperties": convertCfnJobDefinitionContainerPropertiesPropertyToCloudFormation(properties.containerProperties),
    "EksProperties": convertCfnJobDefinitionEksPropertiesPropertyToCloudFormation(properties.eksProperties),
    "JobDefinitionName": cdk.stringToCloudFormation(properties.jobDefinitionName),
    "NodeProperties": convertCfnJobDefinitionNodePropertiesPropertyToCloudFormation(properties.nodeProperties),
    "Parameters": cdk.objectToCloudFormation(properties.parameters),
    "PlatformCapabilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.platformCapabilities),
    "PropagateTags": cdk.booleanToCloudFormation(properties.propagateTags),
    "RetryStrategy": convertCfnJobDefinitionRetryStrategyPropertyToCloudFormation(properties.retryStrategy),
    "SchedulingPriority": cdk.numberToCloudFormation(properties.schedulingPriority),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "Timeout": convertCfnJobDefinitionTimeoutPropertyToCloudFormation(properties.timeout),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnJobDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobDefinitionProps>();
  ret.addPropertyResult("containerProperties", "ContainerProperties", (properties.ContainerProperties != null ? CfnJobDefinitionContainerPropertiesPropertyFromCloudFormation(properties.ContainerProperties) : undefined));
  ret.addPropertyResult("eksProperties", "EksProperties", (properties.EksProperties != null ? CfnJobDefinitionEksPropertiesPropertyFromCloudFormation(properties.EksProperties) : undefined));
  ret.addPropertyResult("jobDefinitionName", "JobDefinitionName", (properties.JobDefinitionName != null ? cfn_parse.FromCloudFormation.getString(properties.JobDefinitionName) : undefined));
  ret.addPropertyResult("nodeProperties", "NodeProperties", (properties.NodeProperties != null ? CfnJobDefinitionNodePropertiesPropertyFromCloudFormation(properties.NodeProperties) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getAny(properties.Parameters) : undefined));
  ret.addPropertyResult("platformCapabilities", "PlatformCapabilities", (properties.PlatformCapabilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PlatformCapabilities) : undefined));
  ret.addPropertyResult("propagateTags", "PropagateTags", (properties.PropagateTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PropagateTags) : undefined));
  ret.addPropertyResult("retryStrategy", "RetryStrategy", (properties.RetryStrategy != null ? CfnJobDefinitionRetryStrategyPropertyFromCloudFormation(properties.RetryStrategy) : undefined));
  ret.addPropertyResult("schedulingPriority", "SchedulingPriority", (properties.SchedulingPriority != null ? cfn_parse.FromCloudFormation.getNumber(properties.SchedulingPriority) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? CfnJobDefinitionTimeoutPropertyFromCloudFormation(properties.Timeout) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Batch::JobQueue` resource specifies the parameters for an AWS Batch job queue definition.
 *
 * For more information, see [Job Queues](https://docs.aws.amazon.com/batch/latest/userguide/job_queues.html) in the ** .
 *
 * @cloudformationResource AWS::Batch::JobQueue
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html
 */
export class CfnJobQueue extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Batch::JobQueue";

  /**
   * Build a CfnJobQueue from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnJobQueue {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnJobQueuePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnJobQueue(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the job queue ARN, such as `batch: *us-east-1* : *111122223333* :job-queue/ *JobQueueName*` .
   *
   * @cloudformationAttribute JobQueueArn
   */
  public readonly attrJobQueueArn: string;

  /**
   * The set of compute environments mapped to a job queue and their order relative to each other.
   */
  public computeEnvironmentOrder: Array<CfnJobQueue.ComputeEnvironmentOrderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the job queue.
   */
  public jobQueueName?: string;

  /**
   * The priority of the job queue.
   */
  public priority: number;

  /**
   * The Amazon Resource Name (ARN) of the scheduling policy.
   */
  public schedulingPolicyArn?: string;

  /**
   * The state of the job queue.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that are applied to the job queue.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnJobQueueProps) {
    super(scope, id, {
      "type": CfnJobQueue.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "computeEnvironmentOrder", this);
    cdk.requireProperty(props, "priority", this);

    this.attrJobQueueArn = cdk.Token.asString(this.getAtt("JobQueueArn", cdk.ResolutionTypeHint.STRING));
    this.computeEnvironmentOrder = props.computeEnvironmentOrder;
    this.jobQueueName = props.jobQueueName;
    this.priority = props.priority;
    this.schedulingPolicyArn = props.schedulingPolicyArn;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Batch::JobQueue", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "computeEnvironmentOrder": this.computeEnvironmentOrder,
      "jobQueueName": this.jobQueueName,
      "priority": this.priority,
      "schedulingPolicyArn": this.schedulingPolicyArn,
      "state": this.state,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnJobQueue.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnJobQueuePropsToCloudFormation(props);
  }
}

export namespace CfnJobQueue {
  /**
   * The order that compute environments are tried in for job placement within a queue.
   *
   * Compute environments are tried in ascending order. For example, if two compute environments are associated with a job queue, the compute environment with a lower order integer value is tried for job placement first. Compute environments must be in the `VALID` state before you can associate them with a job queue. All of the compute environments must be either EC2 ( `EC2` or `SPOT` ) or Fargate ( `FARGATE` or `FARGATE_SPOT` ); EC2 and Fargate compute environments can't be mixed.
   *
   * > All compute environments that are associated with a job queue must share the same architecture. AWS Batch doesn't support mixing compute environment architecture types in a single job queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html
   */
  export interface ComputeEnvironmentOrderProperty {
    /**
     * The Amazon Resource Name (ARN) of the compute environment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-computeenvironment
     */
    readonly computeEnvironment: string;

    /**
     * The order of the compute environment.
     *
     * Compute environments are tried in ascending order. For example, if two compute environments are associated with a job queue, the compute environment with a lower `order` integer value is tried for job placement first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-jobqueue-computeenvironmentorder.html#cfn-batch-jobqueue-computeenvironmentorder-order
     */
    readonly order: number;
  }
}

/**
 * Properties for defining a `CfnJobQueue`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html
 */
export interface CfnJobQueueProps {
  /**
   * The set of compute environments mapped to a job queue and their order relative to each other.
   *
   * The job scheduler uses this parameter to determine which compute environment runs a specific job. Compute environments must be in the `VALID` state before you can associate them with a job queue. You can associate up to three compute environments with a job queue. All of the compute environments must be either EC2 ( `EC2` or `SPOT` ) or Fargate ( `FARGATE` or `FARGATE_SPOT` ); EC2 and Fargate compute environments can't be mixed.
   *
   * > All compute environments that are associated with a job queue must share the same architecture. AWS Batch doesn't support mixing compute environment architecture types in a single job queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-computeenvironmentorder
   */
  readonly computeEnvironmentOrder: Array<CfnJobQueue.ComputeEnvironmentOrderProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the job queue.
   *
   * It can be up to 128 letters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-jobqueuename
   */
  readonly jobQueueName?: string;

  /**
   * The priority of the job queue.
   *
   * Job queues with a higher priority (or a higher integer value for the `priority` parameter) are evaluated first when associated with the same compute environment. Priority is determined in descending order. For example, a job queue with a priority value of `10` is given scheduling preference over a job queue with a priority value of `1` . All of the compute environments must be either EC2 ( `EC2` or `SPOT` ) or Fargate ( `FARGATE` or `FARGATE_SPOT` ); EC2 and Fargate compute environments can't be mixed.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-priority
   */
  readonly priority: number;

  /**
   * The Amazon Resource Name (ARN) of the scheduling policy.
   *
   * The format is `aws: *Partition* :batch: *Region* : *Account* :scheduling-policy/ *Name*` . For example, `aws:aws:batch:us-west-2:123456789012:scheduling-policy/MySchedulingPolicy` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-schedulingpolicyarn
   */
  readonly schedulingPolicyArn?: string;

  /**
   * The state of the job queue.
   *
   * If the job queue state is `ENABLED` , it is able to accept jobs. If the job queue state is `DISABLED` , new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-state
   */
  readonly state?: string;

  /**
   * The tags that are applied to the job queue.
   *
   * For more information, see [Tagging your AWS Batch resources](https://docs.aws.amazon.com/batch/latest/userguide/using-tags.html) in *AWS Batch User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobqueue.html#cfn-batch-jobqueue-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `ComputeEnvironmentOrderProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeEnvironmentOrderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobQueueComputeEnvironmentOrderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeEnvironment", cdk.requiredValidator)(properties.computeEnvironment));
  errors.collect(cdk.propertyValidator("computeEnvironment", cdk.validateString)(properties.computeEnvironment));
  errors.collect(cdk.propertyValidator("order", cdk.requiredValidator)(properties.order));
  errors.collect(cdk.propertyValidator("order", cdk.validateNumber)(properties.order));
  return errors.wrap("supplied properties not correct for \"ComputeEnvironmentOrderProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobQueueComputeEnvironmentOrderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobQueueComputeEnvironmentOrderPropertyValidator(properties).assertSuccess();
  return {
    "ComputeEnvironment": cdk.stringToCloudFormation(properties.computeEnvironment),
    "Order": cdk.numberToCloudFormation(properties.order)
  };
}

// @ts-ignore TS6133
function CfnJobQueueComputeEnvironmentOrderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobQueue.ComputeEnvironmentOrderProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobQueue.ComputeEnvironmentOrderProperty>();
  ret.addPropertyResult("computeEnvironment", "ComputeEnvironment", (properties.ComputeEnvironment != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeEnvironment) : undefined));
  ret.addPropertyResult("order", "Order", (properties.Order != null ? cfn_parse.FromCloudFormation.getNumber(properties.Order) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnJobQueueProps`
 *
 * @param properties - the TypeScript properties of a `CfnJobQueueProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobQueuePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeEnvironmentOrder", cdk.requiredValidator)(properties.computeEnvironmentOrder));
  errors.collect(cdk.propertyValidator("computeEnvironmentOrder", cdk.listValidator(CfnJobQueueComputeEnvironmentOrderPropertyValidator))(properties.computeEnvironmentOrder));
  errors.collect(cdk.propertyValidator("jobQueueName", cdk.validateString)(properties.jobQueueName));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("schedulingPolicyArn", cdk.validateString)(properties.schedulingPolicyArn));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnJobQueueProps\"");
}

// @ts-ignore TS6133
function convertCfnJobQueuePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobQueuePropsValidator(properties).assertSuccess();
  return {
    "ComputeEnvironmentOrder": cdk.listMapper(convertCfnJobQueueComputeEnvironmentOrderPropertyToCloudFormation)(properties.computeEnvironmentOrder),
    "JobQueueName": cdk.stringToCloudFormation(properties.jobQueueName),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "SchedulingPolicyArn": cdk.stringToCloudFormation(properties.schedulingPolicyArn),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnJobQueuePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobQueueProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobQueueProps>();
  ret.addPropertyResult("computeEnvironmentOrder", "ComputeEnvironmentOrder", (properties.ComputeEnvironmentOrder != null ? cfn_parse.FromCloudFormation.getArray(CfnJobQueueComputeEnvironmentOrderPropertyFromCloudFormation)(properties.ComputeEnvironmentOrder) : undefined));
  ret.addPropertyResult("jobQueueName", "JobQueueName", (properties.JobQueueName != null ? cfn_parse.FromCloudFormation.getString(properties.JobQueueName) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("schedulingPolicyArn", "SchedulingPolicyArn", (properties.SchedulingPolicyArn != null ? cfn_parse.FromCloudFormation.getString(properties.SchedulingPolicyArn) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Batch::SchedulingPolicy` resource specifies the parameters for an AWS Batch scheduling policy.
 *
 * For more information, see [Scheduling Policies](https://docs.aws.amazon.com/batch/latest/userguide/scheduling_policies.html) in the ** .
 *
 * @cloudformationResource AWS::Batch::SchedulingPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-schedulingpolicy.html
 */
export class CfnSchedulingPolicy extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Batch::SchedulingPolicy";

  /**
   * Build a CfnSchedulingPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchedulingPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchedulingPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchedulingPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the scheduling policy ARN, such as `batch: *us-east-1* : *111122223333* :scheduling-policy/ *HighPriority*` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The fair share policy of the scheduling policy.
   */
  public fairsharePolicy?: CfnSchedulingPolicy.FairsharePolicyProperty | cdk.IResolvable;

  /**
   * The name of the scheduling policy.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that you apply to the scheduling policy to help you categorize and organize your resources.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchedulingPolicyProps = {}) {
    super(scope, id, {
      "type": CfnSchedulingPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.fairsharePolicy = props.fairsharePolicy;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Batch::SchedulingPolicy", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "fairsharePolicy": this.fairsharePolicy,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchedulingPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchedulingPolicyPropsToCloudFormation(props);
  }
}

export namespace CfnSchedulingPolicy {
  /**
   * The fair share policy for a scheduling policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-fairsharepolicy.html
   */
  export interface FairsharePolicyProperty {
    /**
     * A value used to reserve some of the available maximum vCPU for fair share identifiers that aren't already used.
     *
     * The reserved ratio is `( *computeReservation* /100)^ *ActiveFairShares*` where `*ActiveFairShares*` is the number of active fair share identifiers.
     *
     * For example, a `computeReservation` value of 50 indicates that AWS Batch reserves 50% of the maximum available vCPU if there's only one fair share identifier. It reserves 25% if there are two fair share identifiers. It reserves 12.5% if there are three fair share identifiers. A `computeReservation` value of 25 indicates that AWS Batch should reserve 25% of the maximum available vCPU if there's only one fair share identifier, 6.25% if there are two fair share identifiers, and 1.56% if there are three fair share identifiers.
     *
     * The minimum value is 0 and the maximum value is 99.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-fairsharepolicy.html#cfn-batch-schedulingpolicy-fairsharepolicy-computereservation
     */
    readonly computeReservation?: number;

    /**
     * The amount of time (in seconds) to use to calculate a fair share percentage for each fair share identifier in use.
     *
     * A value of zero (0) indicates that only current usage is measured. The decay allows for more recently run jobs to have more weight than jobs that ran earlier. The maximum supported value is 604800 (1 week).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-fairsharepolicy.html#cfn-batch-schedulingpolicy-fairsharepolicy-sharedecayseconds
     */
    readonly shareDecaySeconds?: number;

    /**
     * An array of `SharedIdentifier` objects that contain the weights for the fair share identifiers for the fair share policy.
     *
     * Fair share identifiers that aren't included have a default weight of `1.0` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-fairsharepolicy.html#cfn-batch-schedulingpolicy-fairsharepolicy-sharedistribution
     */
    readonly shareDistribution?: Array<cdk.IResolvable | CfnSchedulingPolicy.ShareAttributesProperty> | cdk.IResolvable;
  }

  /**
   * Specifies the weights for the fair share identifiers for the fair share policy.
   *
   * Fair share identifiers that aren't included have a default weight of `1.0` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-shareattributes.html
   */
  export interface ShareAttributesProperty {
    /**
     * A fair share identifier or fair share identifier prefix.
     *
     * If the string ends with an asterisk (*), this entry specifies the weight factor to use for fair share identifiers that start with that prefix. The list of fair share identifiers in a fair share policy can't overlap. For example, you can't have one that specifies a `shareIdentifier` of `UserA*` and another that specifies a `shareIdentifier` of `UserA-1` .
     *
     * There can be no more than 500 fair share identifiers active in a job queue.
     *
     * The string is limited to 255 alphanumeric characters, and can be followed by an asterisk (*).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-shareattributes.html#cfn-batch-schedulingpolicy-shareattributes-shareidentifier
     */
    readonly shareIdentifier?: string;

    /**
     * The weight factor for the fair share identifier.
     *
     * The default value is 1.0. A lower value has a higher priority for compute resources. For example, jobs that use a share identifier with a weight factor of 0.125 (1/8) get 8 times the compute resources of jobs that use a share identifier with a weight factor of 1.
     *
     * The smallest supported value is 0.0001, and the largest supported value is 999.9999.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-batch-schedulingpolicy-shareattributes.html#cfn-batch-schedulingpolicy-shareattributes-weightfactor
     */
    readonly weightFactor?: number;
  }
}

/**
 * Properties for defining a `CfnSchedulingPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-schedulingpolicy.html
 */
export interface CfnSchedulingPolicyProps {
  /**
   * The fair share policy of the scheduling policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-schedulingpolicy.html#cfn-batch-schedulingpolicy-fairsharepolicy
   */
  readonly fairsharePolicy?: CfnSchedulingPolicy.FairsharePolicyProperty | cdk.IResolvable;

  /**
   * The name of the scheduling policy.
   *
   * It can be up to 128 letters long. It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-schedulingpolicy.html#cfn-batch-schedulingpolicy-name
   */
  readonly name?: string;

  /**
   * The tags that you apply to the scheduling policy to help you categorize and organize your resources.
   *
   * Each tag consists of a key and an optional value. For more information, see [Tagging AWS Resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) in *AWS General Reference* .
   *
   * These tags can be updated or removed using the [TagResource](https://docs.aws.amazon.com/batch/latest/APIReference/API_TagResource.html) and [UntagResource](https://docs.aws.amazon.com/batch/latest/APIReference/API_UntagResource.html) API operations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-schedulingpolicy.html#cfn-batch-schedulingpolicy-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `ShareAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `ShareAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulingPolicyShareAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("shareIdentifier", cdk.validateString)(properties.shareIdentifier));
  errors.collect(cdk.propertyValidator("weightFactor", cdk.validateNumber)(properties.weightFactor));
  return errors.wrap("supplied properties not correct for \"ShareAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchedulingPolicyShareAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulingPolicyShareAttributesPropertyValidator(properties).assertSuccess();
  return {
    "ShareIdentifier": cdk.stringToCloudFormation(properties.shareIdentifier),
    "WeightFactor": cdk.numberToCloudFormation(properties.weightFactor)
  };
}

// @ts-ignore TS6133
function CfnSchedulingPolicyShareAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchedulingPolicy.ShareAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedulingPolicy.ShareAttributesProperty>();
  ret.addPropertyResult("shareIdentifier", "ShareIdentifier", (properties.ShareIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.ShareIdentifier) : undefined));
  ret.addPropertyResult("weightFactor", "WeightFactor", (properties.WeightFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.WeightFactor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FairsharePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `FairsharePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulingPolicyFairsharePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeReservation", cdk.validateNumber)(properties.computeReservation));
  errors.collect(cdk.propertyValidator("shareDecaySeconds", cdk.validateNumber)(properties.shareDecaySeconds));
  errors.collect(cdk.propertyValidator("shareDistribution", cdk.listValidator(CfnSchedulingPolicyShareAttributesPropertyValidator))(properties.shareDistribution));
  return errors.wrap("supplied properties not correct for \"FairsharePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchedulingPolicyFairsharePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulingPolicyFairsharePolicyPropertyValidator(properties).assertSuccess();
  return {
    "ComputeReservation": cdk.numberToCloudFormation(properties.computeReservation),
    "ShareDecaySeconds": cdk.numberToCloudFormation(properties.shareDecaySeconds),
    "ShareDistribution": cdk.listMapper(convertCfnSchedulingPolicyShareAttributesPropertyToCloudFormation)(properties.shareDistribution)
  };
}

// @ts-ignore TS6133
function CfnSchedulingPolicyFairsharePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedulingPolicy.FairsharePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedulingPolicy.FairsharePolicyProperty>();
  ret.addPropertyResult("computeReservation", "ComputeReservation", (properties.ComputeReservation != null ? cfn_parse.FromCloudFormation.getNumber(properties.ComputeReservation) : undefined));
  ret.addPropertyResult("shareDecaySeconds", "ShareDecaySeconds", (properties.ShareDecaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShareDecaySeconds) : undefined));
  ret.addPropertyResult("shareDistribution", "ShareDistribution", (properties.ShareDistribution != null ? cfn_parse.FromCloudFormation.getArray(CfnSchedulingPolicyShareAttributesPropertyFromCloudFormation)(properties.ShareDistribution) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSchedulingPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchedulingPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulingPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fairsharePolicy", CfnSchedulingPolicyFairsharePolicyPropertyValidator)(properties.fairsharePolicy));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSchedulingPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnSchedulingPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulingPolicyPropsValidator(properties).assertSuccess();
  return {
    "FairsharePolicy": convertCfnSchedulingPolicyFairsharePolicyPropertyToCloudFormation(properties.fairsharePolicy),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSchedulingPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchedulingPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchedulingPolicyProps>();
  ret.addPropertyResult("fairsharePolicy", "FairsharePolicy", (properties.FairsharePolicy != null ? CfnSchedulingPolicyFairsharePolicyPropertyFromCloudFormation(properties.FairsharePolicy) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}