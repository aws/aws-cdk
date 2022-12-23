import * as iam from '@aws-cdk/aws-iam';
import { Resource, IResource, ArnFormat, Arn, Aws } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { validateName } from './utils';

/**
 * Structural typing, not jsii compatible but doesn't need to be
 */
interface IApplicationLike extends IResource {
  readonly applicationArn: string;
  readonly applicationName: string;
}

/**
 */
export interface ImportedDeploymentGroupBaseProps {
  /**
   * The reference to the CodeDeploy Application that this Deployment Group belongs to.
   */
  readonly application: IApplicationLike;

  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group
   * that we are referencing.
   *
   * @default Either deploymentGroupName or deploymentGroupArn is required
   */
  readonly deploymentGroupName: string;
}

/**
 * @internal
 */
export class ImportedDeploymentGroupBase extends Resource {
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;

  constructor(scope: Construct, id: string, props: ImportedDeploymentGroupBaseProps) {
    const deploymentGroupName = props.deploymentGroupName;
    const deploymentGroupArn = Arn.format({
      partition: Aws.PARTITION,
      account: props.application.env.account,
      region: props.application.env.region,
      service: 'codedeploy',
      resource: 'deploymentgroup',
      resourceName: `${props.application.applicationName}/${deploymentGroupName}`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    super(scope, id, { environmentFromArn: deploymentGroupArn });
    this.deploymentGroupName = deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupArn;
  }
}

export interface DeploymentGroupBaseProps {
  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group.
   *
   * @default An auto-generated name will be used.
   */
  readonly deploymentGroupName?: string;

  /**
   * The service Role of this Deployment Group.
   *
   * @default A new Role will be created.
   */
  readonly role?: iam.IRole;
}

/**
 * @internal
 */
export class DeploymentGroupBase extends Resource {
  /**
   * The name of the Deployment Group.
   */
  public readonly deploymentGroupName!: string;

  /**
   * The ARN of the Deployment Group.
   */
  public readonly deploymentGroupArn!: string;

  /**
   * The service Role of this Deployment Group.
   *
   * (Can't make `role` properly public here, as it's typed as optional in one
   * interface and typing it here as definitely set interferes with that.)
   *
   * @internal
   */
  public readonly _role: iam.IRole;

  constructor(scope: Construct, id: string, props: DeploymentGroupBaseProps) {
    super(scope, id, {
      physicalName: props.deploymentGroupName,
    });

    this._role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
    });

    this.node.addValidation({ validate: () => validateName('Deployment group', this.physicalName) });
  }

  /**
   * Set name and ARN properties.
   *
   * Must be called in the child constructor.
   *
   * @internal
   */
  protected _setNameAndArn(resource: CfnDeploymentGroup, application: IApplicationLike) {
    (this as any).deploymentGroupName = this.getResourceNameAttribute(resource.ref);
    (this as any).deploymentGroupArn = this.getResourceArnAttribute(this.stack.formatArn({
      service: 'codedeploy',
      resource: 'deploymentgroup',
      resourceName: `${application.applicationName}/${resource.ref}`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }), {
      service: 'codedeploy',
      resource: 'deploymentgroup',
      resourceName: `${application.applicationName}/${this.physicalName}`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }
}