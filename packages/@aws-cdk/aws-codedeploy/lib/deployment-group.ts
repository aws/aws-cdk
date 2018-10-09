import autoscaling = require("@aws-cdk/aws-autoscaling");
import ec2 = require("@aws-cdk/aws-ec2");
import s3 = require("@aws-cdk/aws-s3");
import cdk = require("@aws-cdk/cdk");
import iam = require("../../aws-iam/lib/role");
import { ServerApplication, ServerApplicationRef } from "./application";
import { cloudformation } from './codedeploy.generated';
import { IServerDeploymentConfig, ServerDeploymentConfig } from "./deployment-config";

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * @see ServerDeploymentGroupRef#import
 * @see ServerDeploymentGroupRef#export
 */
export interface ServerDeploymentGroupRefProps {
  /**
   * The reference to the CodeDeploy EC2/on-premise Application
   * that this Deployment Group belongs to.
   */
  application: ServerApplicationRef;

  /**
   * The physical, human-readable name of the CodeDeploy EC2/on-premise Deployment Group
   * that we are referencing.
   */
  deploymentGroupName: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default ServerDeploymentConfig#OneAtATime
   */
  deploymentConfig?: IServerDeploymentConfig;
}

/**
 * Represents a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * If you're managing the Deployment Group alongside the rest of your CDK resources,
 * use the {@link ServerDeploymentGroup} class.
 *
 * If you want to reference an already existing Deployment Group,
 * or one defined in a different CDK Stack,
 * use the {@link #import} method.
 */
export abstract class ServerDeploymentGroupRef extends cdk.Construct {
  /**
   * Import an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param parent the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static import(parent: cdk.Construct, id: string, props: ServerDeploymentGroupRefProps): ServerDeploymentGroupRef {
    return new ImportedServerDeploymentGroupRef(parent, id, props);
  }

  public abstract readonly application: ServerApplicationRef;
  public abstract readonly role?: iam.Role;
  public abstract readonly deploymentGroupName: string;
  public abstract readonly deploymentGroupArn: string;
  public readonly deploymentConfig: IServerDeploymentConfig;
  public abstract readonly autoScalingGroups?: autoscaling.AutoScalingGroup[];

  constructor(parent: cdk.Construct, id: string, deploymentConfig?: IServerDeploymentConfig) {
    super(parent, id);
    this.deploymentConfig = deploymentConfig || ServerDeploymentConfig.OneAtATime;
  }

  public export(): ServerDeploymentGroupRefProps {
    return {
      application: this.application,
      deploymentGroupName: new cdk.Output(this, 'DeploymentGroupName', {
        value: this.deploymentGroupName
      }).makeImportValue().toString(),
      deploymentConfig: this.deploymentConfig,
    };
  }
}

class ImportedServerDeploymentGroupRef extends ServerDeploymentGroupRef {
  public readonly application: ServerApplicationRef;
  public readonly role?: iam.Role = undefined;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly autoScalingGroups?: autoscaling.AutoScalingGroup[] = undefined;

  constructor(parent: cdk.Construct, id: string, props: ServerDeploymentGroupRefProps) {
    super(parent, id, props.deploymentConfig);

    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupName2Arn(props.application.applicationName,
      props.deploymentGroupName);
  }
}

/**
 * Construction properties for {@link ServerDeploymentGroup}.
 */
export interface ServerDeploymentGroupProps {
  /**
   * The CodeDeploy EC2/on-premise Application this Deployment Group belongs to.
   * If you don't provide one, a new Application will be created.
   */
  application?: ServerApplicationRef;

  /**
   * The service Role of this Deployment Group.
   * If you don't provide one, a new Role will be created.
   */
  role?: iam.Role;

  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group.
   *
   * @default an auto-generated name will be used
   */
  deploymentGroupName?: string;

  /**
   * The EC2/on-premise Deployment Configuration to use for this Deployment Group.
   *
   * @default ServerDeploymentConfig#OneAtATime
   */
  deploymentConfig?: IServerDeploymentConfig;

  /**
   * The auto-scaling groups belonging to this Deployment Group.
   *
   * @default []
   */
  autoScalingGroups?: autoscaling.AutoScalingGroup[];

  /**
   * If you've provided any auto-scaling groups with the {@link #autoScalingGroups} property,
   * you can set this property to add User Data that installs the CodeDeploy agent on the instances.
   *
   * @default true
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install.html
   */
  installAgent?: boolean;
}

/**
 * A CodeDeploy Deployment Group that deploys to EC2/on-premise instances.
 */
export class ServerDeploymentGroup extends ServerDeploymentGroupRef {
  public readonly application: ServerApplicationRef;
  public readonly role?: iam.Role;
  public readonly deploymentGroupArn: string;
  public readonly deploymentGroupName: string;

  private readonly _autoScalingGroups: autoscaling.AutoScalingGroup[];
  private readonly installAgent: boolean;
  private readonly codeDeployBucket: s3.BucketRef;

  constructor(parent: cdk.Construct, id: string, props: ServerDeploymentGroupProps = {}) {
    super(parent, id, props.deploymentConfig);

    this.application = props.application || new ServerApplication(this, 'Application');

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new cdk.ServicePrincipal('codedeploy.amazonaws.com'),
      managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole'],
    });

    this._autoScalingGroups = props.autoScalingGroups || [];
    this.installAgent = props.installAgent === undefined ? true : props.installAgent;
    const region = (new cdk.AwsRegion()).toString();
    this.codeDeployBucket = s3.BucketRef.import(this, 'CodeDeployBucket', {
      bucketName: `aws-codedeploy-${region}`,
    });
    for (const asg of this._autoScalingGroups) {
      this.addCodeDeployAgentInstallUserData(asg);
    }

    const resource = new cloudformation.DeploymentGroupResource(this, 'Resource', {
      applicationName: this.application.applicationName,
      deploymentGroupName: props.deploymentGroupName,
      serviceRoleArn: this.role.roleArn,
      deploymentConfigName: props.deploymentConfig &&
        props.deploymentConfig.deploymentConfigName,
      autoScalingGroups: new cdk.Token(() =>
        this._autoScalingGroups.length === 0
          ? undefined
          : this._autoScalingGroups.map(asg => asg.autoScalingGroupName())),
    });

    this.deploymentGroupName = resource.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupName2Arn(this.application.applicationName,
      this.deploymentGroupName);
  }

  public addAutoScalingGroup(asg: autoscaling.AutoScalingGroup): void {
    this._autoScalingGroups.push(asg);
    this.addCodeDeployAgentInstallUserData(asg);
  }

  public get autoScalingGroups(): autoscaling.AutoScalingGroup[] | undefined {
    return this._autoScalingGroups.slice();
  }

  private addCodeDeployAgentInstallUserData(asg: autoscaling.AutoScalingGroup): void {
    if (!this.installAgent) {
      return;
    }

    this.codeDeployBucket.grantRead(asg.role, 'latest/*');

    const region = (new cdk.AwsRegion()).toString();
    switch (asg.osType) {
      case ec2.OperatingSystemType.Linux:
        asg.addUserData(
          'PKG_CMD=`which yum 2>/dev/null`',
          'if [ -z "$PKG_CMD" ]; then',
            'PKG_CMD=apt-get',
          'else',
            'PKG=CMD=yum',
          'fi',
          '$PKG_CMD update -y',
          '$PKG_CMD install -y ruby2.0',
          'if [ $? -ne 0 ]; then',
            '$PKG_CMD install -y ruby',
          'fi',
          '$PKG_CMD install -y awscli',
          'TMP_DIR=`mktemp -d`',
          'cd $TMP_DIR',
          `aws s3 cp s3://aws-codedeploy-${region}/latest/install . --region ${region}`,
          'chmod +x ./install',
          './install auto',
          'rm -fr $TMP_DIR',
        );
        break;
      case ec2.OperatingSystemType.Windows:
        asg.addUserData(
          'Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName',
          `aws s3 cp s3://aws-codedeploy-${region}/latest/codedeploy-agent.msi $TEMPDIR\\codedeploy-agent.msi`,
          '$TEMPDIR\\codedeploy-agent.msi /quiet /l c:\\temp\\host-agent-install-log.txt',
        );
        break;
    }
  }
}

function deploymentGroupName2Arn(applicationName: string, deploymentGroupName: string): string {
  return cdk.ArnUtils.fromComponents({
    service: 'codedeploy',
    resource: 'deploymentgroup',
    resourceName: `${applicationName}/${deploymentGroupName}`,
    sep: ':',
  });
}
