import type { Construct } from 'constructs';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import { Action } from '../action';

/**
 * The operating system image of the build environment that runs the commands of a `CommandsAction`.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-config
 */
export class CommandsEnvironmentType {
  /**
   * Linux container environment.
   */
  public static readonly LINUX_CONTAINER = new CommandsEnvironmentType('LINUX_CONTAINER');

  /**
   * Windows Server 2022 container environment.
   *
   * This environment type is not compatible with the `BUILD_GENERAL1_SMALL` compute type.
   */
  public static readonly WINDOWS_SERVER_2022_CONTAINER = new CommandsEnvironmentType('WINDOWS_SERVER_2022_CONTAINER');

  /**
   * Use an environment type that is not yet available as a static member of this class.
   *
   * @param value the value of the `EnvironmentType` configuration parameter, for example `LINUX_CONTAINER`
   */
  public static of(value: string): CommandsEnvironmentType {
    return new CommandsEnvironmentType(value);
  }

  /**
   * @param value the value of the `EnvironmentType` configuration parameter
   */
  private constructor(public readonly value: string) {}
}

/**
 * Construction properties of the `CommandsAction`.
 */
export interface CommandsActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The source to use as input for this action.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The list of additional input artifacts for this action.
   *
   * @default - no extra inputs
   */
  readonly extraInputs?: codepipeline.Artifact[];

  /**
   * The output artifact for this action.
   *
   * You can filter files that you want to export as the output artifact for the action.
   *
   * @example
   * new codepipeline.Artifact('CommandsArtifact', ['my-dir/**']);
   *
   * @default - no output artifact
   */
  readonly output?: codepipeline.Artifact;

  /**
   * The names of the variables in your environment that you want to export.
   *
   * These variables can be referenced in other actions by using the `variable` method
   * of this class.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   * @default - No output variables are exported
   */
  readonly outputVariables?: string[];

  /**
   * Shell commands for the Commands action to run.
   *
   * All formats are supported except multi-line formats.
   *
   * The length of the commands array must be between 1 and 50.
   */
  readonly commands: string[];

  /**
   * The operating system image of the build environment that runs the commands.
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-config
   * @default - CodePipeline uses `LINUX_CONTAINER`
   */
  readonly environmentType?: CommandsEnvironmentType;

  /**
   * The compute type of the build environment that runs the commands.
   *
   * Only `ComputeType.SMALL`, `ComputeType.MEDIUM` and `ComputeType.LARGE` are supported.
   * `CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER` is not compatible with
   * `ComputeType.SMALL`, so you must set `ComputeType.MEDIUM` or `ComputeType.LARGE` when you use it.
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-config
   * @default - CodePipeline uses `BUILD_GENERAL1_SMALL`
   */
  readonly computeType?: codebuild.ComputeType;

  /**
   * The VPC in which to run the commands.
   *
   * Set this when your commands need to connect to resources in a VPC.
   * The VPC must be in the same region as the pipeline.
   *
   * @default - the commands do not run in a VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * Only used if `vpc` is supplied.
   *
   * @default - all private subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The security groups to associate with the network interfaces of the build environment.
   *
   * Only used if `vpc` is supplied. Required if the VPC is in a different account than the pipeline.
   *
   * @default - a new security group that allows all outbound traffic is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * The compute types supported by the Commands action.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-config
 */
const SUPPORTED_COMPUTE_TYPES: string[] = [
  codebuild.ComputeType.SMALL,
  codebuild.ComputeType.MEDIUM,
  codebuild.ComputeType.LARGE,
];

/**
 * CodePipeline compute action that uses AWS Commands.
 */
export class CommandsAction extends Action implements ec2.IConnectable {
  private readonly outputVariables: string[];
  private readonly props: CommandsActionProps;
  private readonly _connections?: ec2.Connections;

  constructor(props: CommandsActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.COMPUTE,
      provider: 'Commands',
      artifactBounds: { minInputs: 1, maxInputs: 10, minOutputs: 0, maxOutputs: 1 },
      inputs: [props.input, ...props.extraInputs || []],
      outputs: props.output ? [props.output] : [],
      commands: props.commands,
      outputVariables: props.outputVariables,
    });

    if (props.commands.length < 1 || props.commands.length > 50) {
      throw new cdk.UnscopedValidationError(lit`InvalidCommandsLength`, `The length of the commands array must be between 1 and 50, got: ${props.commands.length}`);
    }

    if (props.outputVariables !== undefined && (props.outputVariables.length < 1 || props.outputVariables.length > 15)) {
      throw new cdk.UnscopedValidationError(lit`InvalidOutputVariablesLength`, `The length of the outputVariables array must be between 1 and 15, got: ${props.outputVariables.length}`);
    }

    if (props.computeType !== undefined && !cdk.Token.isUnresolved(props.computeType)
      && !SUPPORTED_COMPUTE_TYPES.includes(props.computeType)) {
      throw new cdk.UnscopedValidationError(lit`UnsupportedCommandsComputeType`, `Unsupported compute type for the Commands action: ${JSON.stringify(props.computeType)}, supported compute types are: ${SUPPORTED_COMPUTE_TYPES.join(', ')}`);
    }

    if (props.environmentType?.value === CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER.value) {
      if (props.computeType === codebuild.ComputeType.SMALL) {
        throw new cdk.UnscopedValidationError(lit`IncompatibleCommandsEnvironmentComputeType`, `The environment type ${CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER.value} is not compatible with the compute type ${codebuild.ComputeType.SMALL}, use ${codebuild.ComputeType.MEDIUM} or ${codebuild.ComputeType.LARGE} instead`);
      }
      // CodePipeline defaults the compute type to BUILD_GENERAL1_SMALL, which is not compatible with Windows
      if (props.computeType === undefined) {
        throw new cdk.UnscopedValidationError(lit`CommandsWindowsComputeTypeRequired`, `The environment type ${CommandsEnvironmentType.WINDOWS_SERVER_2022_CONTAINER.value} requires 'computeType' to be set to ${codebuild.ComputeType.MEDIUM} or ${codebuild.ComputeType.LARGE}, because the default compute type ${codebuild.ComputeType.SMALL} is not compatible with it`);
      }
    }

    if (!props.vpc && (props.subnetSelection !== undefined || props.securityGroups !== undefined)) {
      throw new cdk.UnscopedValidationError(lit`CommandsVpcRequired`, 'Cannot configure \'subnetSelection\' or \'securityGroups\' without configuring a \'vpc\'');
    }

    this.outputVariables = props.outputVariables || [];
    this.props = props;
    if (props.vpc) {
      this._connections = new ec2.Connections({ securityGroups: props.securityGroups });
    }
  }

  /**
   * The network connections of the build environment that runs the commands.
   *
   * Only available if `vpc` is supplied. If no `securityGroups` are supplied,
   * the generated security group is added when the action is added to a pipeline,
   * and rules that you add before that are applied to it.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new cdk.UnscopedValidationError(lit`CommandsActionNotInVpc`, 'Only Commands actions that run in a VPC have security groups to manage, supply the \'vpc\' property when creating the action');
    }
    return this._connections;
  }

  /**
   * Reference a CodePipeline variable exported in the Commands action.
   *
   * @param variableName the name of the variable exported by `outputVariables`
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   */
  public variable(variableName: string): string {
    if (!this.outputVariables.includes(variableName)) {
      throw new cdk.UnscopedValidationError(lit`VariableNotExported`, `Variable '${variableName}' is not exported by \`outputVariables\`, exported variables: ${this.outputVariables.join(', ')}`);
    }
    return this.variableExpression(variableName);
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const logGroupArn = cdk.Stack.of(scope).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `/aws/codepipeline/${stage.pipeline.pipelineName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });
    const logGroupArnWithWildcard = `${logGroupArn}:*`;

    // grant the Pipeline role the required permissions to put the logs in the log group
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-Commands.html#action-reference-Commands-policy
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArn, logGroupArnWithWildcard],
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    }));

    // grant the Pipeline role the required permissions to view the logs in the Commands action on the CodePipeline console
    // see: https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam-permissions-console-logs.html
    options.role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [logGroupArnWithWildcard],
      actions: [
        'logs:GetLogEvents',
      ],
    }));

    // allow the Role access to the Bucket, if there are any inputs/outputs
    if ((this.actionProperties.inputs ?? []).length > 0) {
      options.bucket.grantRead(options.role);
    }
    if ((this.actionProperties.outputs ?? []).length > 0) {
      options.bucket.grantWrite(options.role);
    }

    const configuration: { [key: string]: string } = {};
    if (this.props.environmentType !== undefined) {
      configuration.EnvironmentType = this.props.environmentType.value;
    }
    if (this.props.computeType !== undefined) {
      configuration.ComputeType = this.props.computeType;
    }
    if (this.props.vpc) {
      Object.assign(configuration, this.configureVpc(scope, options.role, this.props.vpc));
    }

    return {
      configuration: Object.keys(configuration).length > 0 ? configuration : undefined,
    };
  }

  private configureVpc(scope: Construct, role: iam.IRole, vpc: ec2.IVpc): { [key: string]: string } {
    const subnetIds = vpc.selectSubnets(this.props.subnetSelection).subnetIds;
    // the network interfaces are created in the account and region of the VPC
    const vpcStack = cdk.Stack.of(vpc);
    const actionStack = cdk.Stack.of(scope);
    if (cdk.Token.compareStrings(actionStack.region, vpcStack.region) === cdk.TokenComparison.DIFFERENT) {
      throw new cdk.ValidationError(lit`CommandsVpcRegionMismatch`, `The VPC of the Commands action '${this.actionProperties.actionName}' must be in the same region as the pipeline, got: '${vpcStack.region}' and '${actionStack.region}'`, scope);
    }

    let securityGroups = this.props.securityGroups;
    if (!securityGroups || securityGroups.length === 0) {
      // the generated security group is created in the scope of the action (the pipeline stack),
      // so it can only be used for a VPC in the same account as the pipeline
      if (cdk.Token.compareStrings(actionStack.account, vpcStack.account) === cdk.TokenComparison.DIFFERENT) {
        throw new cdk.ValidationError(lit`CommandsVpcSecurityGroupsRequired`, `The VPC of the Commands action '${this.actionProperties.actionName}' is in a different account than the pipeline, specify 'securityGroups' that belong to the VPC`, scope);
      }
      securityGroups = [new ec2.SecurityGroup(scope, 'SecurityGroup', {
        vpc,
        description: 'Automatic generated security group for CodePipeline Commands action',
        allowAllOutbound: true,
      })];
      this._connections?.addSecurityGroup(...securityGroups);
    }

    // grant the Role the permissions required to create the network interfaces of the build environment in the VPC
    // see: https://docs.aws.amazon.com/codebuild/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html#customer-managed-policies-example-create-vpc-network-interface
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface',
        'ec2:DescribeSubnets',
        'ec2:DescribeSecurityGroups',
        'ec2:DescribeDhcpOptions',
        'ec2:DescribeVpcs',
      ],
    }));
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      resources: [vpcStack.formatArn({ service: 'ec2', resource: 'network-interface', resourceName: '*' })],
      actions: ['ec2:CreateNetworkInterfacePermission'],
      conditions: {
        StringEquals: {
          'ec2:Subnet': subnetIds.map(subnetId => vpcStack.formatArn({ service: 'ec2', resource: 'subnet', resourceName: subnetId })),
        },
      },
    }));

    return {
      VpcId: vpc.vpcId,
      Subnets: cdk.Fn.join(',', subnetIds),
      SecurityGroupIds: cdk.Fn.join(',', securityGroups.map(sg => sg.securityGroupId)),
    };
  }
}
