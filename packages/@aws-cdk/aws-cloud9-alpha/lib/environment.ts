import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IUser } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { CfnEnvironmentEC2 } from 'aws-cdk-lib/aws-cloud9';

/**
 * A Cloud9 Environment
 *
 */
export interface IEc2Environment extends cdk.IResource {
  /**
   * The name of the EnvironmentEc2
   *
   * @attribute environmentEc2Name
   */
  readonly ec2EnvironmentName: string;

  /**
   * The arn of the EnvironmentEc2
   *
   * @attribute environmentE2Arn
   */
  readonly ec2EnvironmentArn: string;
}

/**
 * The connection type used for connecting to an Amazon EC2 environment.
 */
export enum ConnectionType {
  /**
   * Connect through SSH
   */
  CONNECT_SSH = 'CONNECT_SSH',
  /**
   * Connect through AWS Systems Manager
   * When using SSM, service role and instance profile aren't automatically created.
   * See https://docs.aws.amazon.com/cloud9/latest/user-guide/ec2-ssm.html#service-role-ssm
   */
  CONNECT_SSM = 'CONNECT_SSM'
}

/**
 * The image ID used for creating an Amazon EC2 environment.
 */
export enum ImageId {
  /**
   * Create using Amazon Linux 2
   */
  AMAZON_LINUX_2 = 'amazonlinux-2-x86_64',
  /**
   * Create using Amazon Linux 2023
   */
  AMAZON_LINUX_2023 = 'amazonlinux-2023-x86_64',
  /**
   * Create using Ubuntu 18.04
   *
   * @deprecated Since Ubuntu 18.04 has ended standard support as of May 31, 2023, we recommend you choose Ubuntu 22.04.
   */
  UBUNTU_18_04 = 'ubuntu-18.04-x86_64',
  /**
   * Create using Ubuntu 22.04
   */
  UBUNTU_22_04 = 'ubuntu-22.04-x86_64',
}
/**
 * Properties for Ec2Environment
 */
export interface Ec2EnvironmentProps {
  /**
   * Owner of the environment.
   *
   * The owner has full control of the environment and can invite additional members.
   *
   * @default - The identity that CloudFormation executes under will be the owner
   */
  readonly owner?: Owner;

  /**
   * The type of instance to connect to the environment.
   *
   * @default - t2.micro
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The subnetSelection of the VPC that AWS Cloud9 will use to communicate with
   * the Amazon EC2 instance.
   *
   * @default - all public subnets of the VPC are selected.
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * The VPC that AWS Cloud9 will use to communicate with the Amazon Elastic Compute Cloud (Amazon EC2) instance.
   *
   */
  readonly vpc: ec2.IVpc;

  /**
   * Name of the environment
   *
   * @default - automatically generated name
   */
  readonly ec2EnvironmentName?: string;

  /**
   * Description of the environment
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * The AWS CodeCommit repository to be cloned
   *
   * @default - do not clone any repository
   */
  // readonly clonedRepositories?: Cloud9Repository[];
  readonly clonedRepositories?: CloneRepository[];

  /**
   * The connection type used for connecting to an Amazon EC2 environment.
   *
   * Valid values are: CONNECT_SSH (default) and CONNECT_SSM (connected through AWS Systems Manager)
   *
   * @default - CONNECT_SSH
   */
  readonly connectionType?: ConnectionType

  /**
   * The image ID used for creating an Amazon EC2 environment.
   *
   */
  readonly imageId: ImageId

  /**
   * The number of minutes until the running instance is shut down after the
   * environment was last used.
   *
   * Setting a value of 0 means the instance will never be automatically shut down."
   *
   * @default - The instance will not be shut down automatically.
   */
  readonly automaticStop?: cdk.Duration
}

/**
 * A Cloud9 Environment with Amazon EC2
 * @resource AWS::Cloud9::EnvironmentEC2
 */
export class Ec2Environment extends cdk.Resource implements IEc2Environment {
  /**
   * import from EnvironmentEc2Name
   */
  public static fromEc2EnvironmentName(scope: Construct, id: string, ec2EnvironmentName: string): IEc2Environment {
    class Import extends cdk.Resource {
      public ec2EnvironmentName = ec2EnvironmentName;
      public ec2EnvironmentArn = cdk.Stack.of(this).formatArn({
        service: 'cloud9',
        resource: 'environment',
        resourceName: this.ec2EnvironmentName,
      });
    }
    return new Import(scope, id);
  }

  /**
   * The environment name of this Cloud9 environment
   *
   * @attribute
   */
  public readonly ec2EnvironmentName: string;

  /**
   * The environment ARN of this Cloud9 environment
   *
   * @attribute
   */
  public readonly ec2EnvironmentArn: string;

  /**
   * The environment ID of this Cloud9 environment
   */
  public readonly environmentId: string;

  /**
   * The complete IDE URL of this Cloud9 environment
   */
  public readonly ideUrl: string;

  /**
   * VPC ID
   */
  public readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: Ec2EnvironmentProps) {
    super(scope, id);

    this.vpc = props.vpc;
    if (!props.subnetSelection && this.vpc.publicSubnets.length === 0) {
      throw new Error('no subnetSelection specified and no public subnet found in the vpc, please specify subnetSelection');
    }

    if (!props.imageId) {
      throw new Error('No imageId specified, please specify imageId');
    }

    const vpcSubnets = props.subnetSelection ?? { subnetType: ec2.SubnetType.PUBLIC };
    const c9env = new CfnEnvironmentEC2(this, 'Resource', {
      name: props.ec2EnvironmentName,
      description: props.description,
      ownerArn: props.owner?.ownerArn,
      instanceType: props.instanceType?.toString() ?? ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO).toString(),
      subnetId: this.vpc.selectSubnets(vpcSubnets).subnetIds[0],
      repositories: props.clonedRepositories ? props.clonedRepositories.map(r => ({
        repositoryUrl: r.repositoryUrl,
        pathComponent: r.pathComponent,
      })) : undefined,
      connectionType: props.connectionType ?? ConnectionType.CONNECT_SSH,
      imageId: props.imageId,
      automaticStopTimeMinutes: props.automaticStop?.toMinutes(),
    });
    this.environmentId = c9env.ref;
    this.ec2EnvironmentArn = c9env.getAtt('Arn').toString();
    this.ec2EnvironmentName = c9env.getAtt('Name').toString();
    this.ideUrl = `https://${this.env.region}.console.aws.amazon.com/cloud9/ide/${this.environmentId}`;
  }
}

/**
 * The class for different repository providers
 */
export class CloneRepository {
  /**
   * import repository to cloud9 environment from AWS CodeCommit
   *
   * @param repository the codecommit repository to clone from
   * @param path  the target path in cloud9 environment
   */
  public static fromCodeCommit(repository: codecommit.IRepository, path: string): CloneRepository {
    return {
      repositoryUrl: repository.repositoryCloneUrlHttp,
      pathComponent: path,
    };
  }

  private constructor(public readonly repositoryUrl: string, public readonly pathComponent: string) {}
}

/**
 * An environment owner
 *
 *
 */
export class Owner {
  /**
   * Make an IAM user the environment owner
   *
   * User need to have AWSCloud9Administrator permissions
   * @see https://docs.aws.amazon.com/cloud9/latest/user-guide/share-environment.html#share-environment-about
   *
   * @param user the User object to use as the environment owner
   */
  public static user(user: IUser): Owner {
    return { ownerArn: user.userArn };
  }

  /**
   * Make an IAM assumed role the environment owner
   *
   * @param accountId The account id of the target account
   * @param roleName The name of the assumed role
   */
  public static assumedRole(accountId: string, roleName: string): Owner {
    return { ownerArn: `arn:${cdk.Aws.PARTITION}:sts::${accountId}:assumed-role/${roleName}` };
  }

  /**
   * Make an IAM federated user the environment owner
   *
   * @param accountId The AccountId of the target account
   * @param userName The name of the federated user
   */
  public static federatedUser(accountId: string, userName: string): Owner {
    return { ownerArn: `arn:${cdk.Aws.PARTITION}:sts::${accountId}:federated-user/${userName}` };
  }

  /**
   * Make the Account Root User the environment owner (not recommended)
   *
   * @param accountId the AccountId to use as the environment owner.
   */
  public static accountRoot(accountId: string): Owner {
    return { ownerArn: `arn:${cdk.Aws.PARTITION}:iam::${accountId}:root` };
  }

  /**
   *
   * @param ownerArn of environment owner.
   */
  private constructor(public readonly ownerArn: string) {}
}