import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ContainerImage } from './container-image';
import { ModelData } from './model-data';
import { CfnModel } from './sagemaker.generated';

/**
 * Interface that defines a Model resource.
 */
export interface IModel extends cdk.IResource, iam.IGrantable, ec2.IConnectable {
  /**
   * Returns the ARN of this model.
   *
   * @attribute
   */
  readonly modelArn: string;

  /**
   * Returns the name of this model.
   *
   * @attribute
   */
  readonly modelName: string;

  /**
   * The IAM role associated with this Model.
   */
  readonly role?: iam.IRole;

  /**
   * Adds a statement to the IAM role assumed by the instance.
   */
  addToRolePolicy(statement: iam.PolicyStatement): void;
}

/**
 * Represents a Model resource defined outside this stack.
 */
export interface ModelAttributes {
  /**
   * The ARN of this model.
   */
  readonly modelArn: string;

  /**
   * The IAM execution role associated with this model.
   *
   * @default - When not provided, any role-related operations will no-op.
   */
  readonly role?: iam.IRole;

  /**
   * The security groups for this model, if in a VPC.
   *
   * @default - When not provided, the connections to/from this model cannot be managed.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

abstract class ModelBase extends cdk.Resource implements IModel {
  /**
   * Returns the ARN of this model.
   * @attribute
   */
  public abstract readonly modelArn: string;
  /**
   * Returns the name of the model.
   * @attribute
   */
  public abstract readonly modelName: string;
  /**
   * Execution role for SageMaker Model
   */
  public abstract readonly role?: iam.IRole;
  /**
   * The principal this Model is running as
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;
  /**
   * An accessor for the Connections object that will fail if this Model does not have a VPC
   * configured.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new Error('Cannot manage network access without configuring a VPC');
    }
    return this._connections;
  }
  /**
   * The actual Connections object for this Model. This may be unset in the event that a VPC has not
   * been configured.
   * @internal
   */
  protected _connections: ec2.Connections | undefined;

  /**
   * Adds a statement to the IAM role assumed by the instance.
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    if (!this.role) {
      return;
    }

    this.role.addToPolicy(statement);
  }
}

/**
 * Describes the container, as part of model definition.
 */
export interface ContainerDefinition {
  /**
   * The image used to start a container.
   */
  readonly image: ContainerImage;

  /**
   * A map of environment variables to pass into the container.
   *
   * @default - none
   */
  readonly environment?: {[key: string]: string};

  /**
   * Hostname of the container within an inference pipeline. For single container models, this field
   * is ignored. When specifying a hostname for one ContainerDefinition in a pipeline, hostnames
   * must be specified for all other ContainerDefinitions in that pipeline.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sagemaker-model-containerdefinition.html#cfn-sagemaker-model-containerdefinition-containerhostname
   *
   * @default - Amazon SageMaker will automatically assign a unique name based on the position of
   * this ContainerDefinition in an inference pipeline.
   */
  readonly containerHostname?: string;

  /**
   * S3 path to the model artifacts.
   *
   * @default - none
   */
  readonly modelData?: ModelData;
}

/**
 * Construction properties for a SageMaker Model.
 */
export interface ModelProps {

  /**
   * The IAM role that the Amazon SageMaker service assumes.
   *
   * @see https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-roles.html#sagemaker-roles-createmodel-perms
   *
   * @default - a new IAM role will be created with the `AmazonSageMakerFullAccess` policy attached.
   */
  readonly role?: iam.IRole;

  /**
   * Name of the SageMaker Model.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that ID for the model's
   * name.
   */
  readonly modelName?: string;

  /**
   * The VPC to deploy model containers to.
   *
   * @default - none
   */
  readonly vpc?: ec2.IVpc;

  /**
   * The VPC subnets to use when deploying model containers.
   *
   * @default - none
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups to associate to the Model. If no security groups are provided and 'vpc' is
   * configured, one security group will be created automatically.
   *
   * @default - A security group will be automatically created if 'vpc' is supplied
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Specifies the container definitions for this model, consisting of either a single primary
   * container or an inference pipeline of multiple containers.
   *
   * @default - none
   */
  readonly containers?: ContainerDefinition[];

  /**
   * Whether to allow the SageMaker Model to send all network traffic
   *
   * If set to false, you must individually add traffic rules to allow the
   * SageMaker Model to connect to network targets.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;
}

/**
 * Defines a SageMaker Model.
 */
export class Model extends ModelBase {
  /**
   * Imports a Model defined either outside the CDK or in a different CDK stack.
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param modelArn the ARN of the model.
   */
  public static fromModelArn(scope: Construct, id: string, modelArn: string): IModel {
    return Model.fromModelAttributes(scope, id, { modelArn });
  }

  /**
   * Imports a Model defined either outside the CDK or in a different CDK stack.
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param modelName the name of the model.
   */
  public static fromModelName(scope: Construct, id: string, modelName: string): IModel {
    const modelArn = cdk.Stack.of(scope).formatArn({
      service: 'sagemaker',
      resource: 'model',
      resourceName: modelName,
    });
    return Model.fromModelAttributes(scope, id, { modelArn });
  }

  /**
   * Imports a Model defined either outside the CDK or in a different CDK stack.
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param attrs the attributes of the model to import.
   */
  public static fromModelAttributes(scope: Construct, id: string, attrs: ModelAttributes): IModel {
    const modelArn = attrs.modelArn;
    const modelName = cdk.Stack.of(scope).splitArn(modelArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    const role = attrs.role;

    class Import extends ModelBase {
      public readonly modelArn = modelArn;
      public readonly modelName = modelName;
      public readonly role = role;
      public readonly grantPrincipal: iam.IPrincipal;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: attrs.modelArn,
        });

        this.grantPrincipal = role || new iam.UnknownPrincipal({ resource: this });
        if (attrs.securityGroups) {
          this._connections = new ec2.Connections({
            securityGroups: attrs.securityGroups,
          });
        }
      }
    }

    return new Import(scope, id);
  }

  /**
   * Returns the ARN of this model.
   * @attribute
   */
  public readonly modelArn: string;
  /**
   * Returns the name of the model.
   * @attribute
   */
  public readonly modelName: string;
  /**
   * Execution role for SageMaker Model
   */
  public readonly role?: iam.IRole;
  /**
   * The principal this Model is running as
   */
  public readonly grantPrincipal: iam.IPrincipal;
  private readonly subnets: ec2.SelectedSubnets | undefined;
  private readonly containers: CfnModel.ContainerDefinitionProperty[] = [];

  constructor(scope: Construct, id: string, props: ModelProps = {}) {
    super(scope, id, {
      physicalName: props.modelName,
    });

    this._connections = this.configureNetworking(props);
    this.subnets = (props.vpc) ? props.vpc.selectSubnets(props.vpcSubnets) : undefined;

    // set the sagemaker role or create new one
    this.role = props.role || this.createSageMakerRole();
    this.grantPrincipal = this.role;

    (props.containers || []).map(c => this.addContainer(c));

    const model = new CfnModel(this, 'Model', {
      executionRoleArn: this.role.roleArn,
      modelName: this.physicalName,
      primaryContainer: cdk.Lazy.any({ produce: () => this.renderPrimaryContainer() }),
      vpcConfig: cdk.Lazy.any({ produce: () => this.renderVpcConfig() }),
      containers: cdk.Lazy.any({ produce: () => this.renderContainers() }),
    });
    this.modelName = this.getResourceNameAttribute(model.attrModelName);
    this.modelArn = this.getResourceArnAttribute(model.ref, {
      service: 'sagemaker',
      resource: 'model',
      resourceName: this.physicalName,
    });

    /*
     * SageMaker model creation will fail if the model's execution role does not have read access to
     * its model data in S3. Since the CDK uses a separate AWS::IAM::Policy CloudFormation resource
     * to attach inline policies to IAM roles, the following line ensures that the role and its
     * AWS::IAM::Policy resource are deployed prior to model creation.
     */
    model.node.addDependency(this.role);
  }

  /**
   * Add containers to the model.
   *
   * @param container The container definition to add.
   */
  public addContainer(container: ContainerDefinition): void {
    this.containers.push(this.renderContainer(container));
  }

  private validateContainers(): void {
    // validate number of containers
    if (this.containers.length < 1) {
      throw new Error('Must configure at least 1 container for model');
    } else if (this.containers.length > 15) {
      throw new Error('Cannot have more than 15 containers in inference pipeline');
    }
  }

  private renderPrimaryContainer(): CfnModel.ContainerDefinitionProperty | undefined {
    return (this.containers.length === 1) ? this.containers[0] : undefined;
  }

  private renderContainers(): CfnModel.ContainerDefinitionProperty[] | undefined {
    this.validateContainers();
    return (this.containers.length === 1) ? undefined : this.containers;
  }

  private renderContainer(container: ContainerDefinition): CfnModel.ContainerDefinitionProperty {
    return {
      image: container.image.bind(this, this).imageName,
      containerHostname: container.containerHostname,
      environment: container.environment,
      modelDataUrl: container.modelData ? container.modelData.bind(this, this).uri : undefined,
    };
  }

  private configureNetworking(props: ModelProps): ec2.Connections | undefined {
    if ((props.securityGroups || props.allowAllOutbound !== undefined) && !props.vpc) {
      throw new Error('Cannot configure \'securityGroups\' or \'allowAllOutbound\' without configuring a VPC');
    }

    if (!props.vpc) { return undefined; }

    if ((props.securityGroups && props.securityGroups.length > 0) && props.allowAllOutbound !== undefined) {
      throw new Error('Configure \'allowAllOutbound\' directly on the supplied SecurityGroups');
    }

    let securityGroups: ec2.ISecurityGroup[];
    if (props.securityGroups && props.securityGroups.length > 0) {
      securityGroups = props.securityGroups;
    } else {
      const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        allowAllOutbound: props.allowAllOutbound,
      });
      securityGroups = [securityGroup];
    }

    return new ec2.Connections({ securityGroups });
  }

  private renderVpcConfig(): CfnModel.VpcConfigProperty | undefined {
    if (!this._connections) { return undefined; }

    return {
      subnets: this.subnets!.subnetIds,
      securityGroupIds: this.connections.securityGroups.map(s => s.securityGroupId),
    };
  }

  private createSageMakerRole(): iam.IRole {
    const sagemakerRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
    });
    // Grant SageMaker FullAccess
    sagemakerRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'));

    return sagemakerRole;
  }
}
