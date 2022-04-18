import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { arnForDeploymentGroup } from '../utils';
import { IEcsApplication } from './application';
import { EcsDeploymentConfig, IEcsDeploymentConfig } from './deployment-config';

/**
 * Interface for an ECS deployment group.
 */
export interface IEcsDeploymentGroup extends cdk.IResource {
  /**
   * The reference to the CodeDeploy ECS Application that this Deployment Group belongs to.
   */
  readonly application: IEcsApplication;

  /**
   * The physical name of the CodeDeploy Deployment Group.
   * @attribute
   */
  readonly deploymentGroupName: string;

  /**
   * The ARN of this Deployment Group.
   * @attribute
   */
  readonly deploymentGroupArn: string;

  /**
   * The Deployment Configuration this Group uses.
   */
  readonly deploymentConfig: IEcsDeploymentConfig;
}

/**
 * Note: This class currently stands as a namespaced container for importing an ECS
 * Deployment Group defined outside the CDK app until CloudFormation supports provisioning
 * ECS Deployment Groups. Until then it is closed (private constructor) and does not
 * extend {@link Construct}.
 *
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export class EcsDeploymentGroup {
  /**
   * Import an ECS Deployment Group defined outside the CDK app.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param attrs the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static fromEcsDeploymentGroupAttributes(
    scope:Construct,
    id: string,
    attrs: EcsDeploymentGroupAttributes): IEcsDeploymentGroup {
    return new ImportedEcsDeploymentGroup(scope, id, attrs);
  }

  private constructor() {
    // nothing to do until CFN supports ECS deployment groups
  }
}

/**
 * Properties of a reference to a CodeDeploy ECS Deployment Group.
 *
 * @see EcsDeploymentGroup#fromEcsDeploymentGroupAttributes
 */
export interface EcsDeploymentGroupAttributes {
  /**
   * The reference to the CodeDeploy ECS Application
   * that this Deployment Group belongs to.
   */
  readonly application: IEcsApplication;

  /**
   * The physical, human-readable name of the CodeDeploy ECS Deployment Group
   * that we are referencing.
   */
  readonly deploymentGroupName: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default EcsDeploymentConfig.ALL_AT_ONCE
   */
  readonly deploymentConfig?: IEcsDeploymentConfig;
}

class ImportedEcsDeploymentGroup extends cdk.Resource implements IEcsDeploymentGroup {
  public readonly application: IEcsApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly deploymentConfig: IEcsDeploymentConfig;

  constructor(scope:Construct, id: string, props: EcsDeploymentGroupAttributes) {
    super(scope, id);
    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = arnForDeploymentGroup(props.application.applicationName, props.deploymentGroupName);
    this.deploymentConfig = props.deploymentConfig || EcsDeploymentConfig.ALL_AT_ONCE;
  }
}
