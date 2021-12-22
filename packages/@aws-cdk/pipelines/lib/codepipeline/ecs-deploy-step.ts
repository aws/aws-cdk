/* eslint-disable comma-dangle */
import { IStage } from '@aws-cdk/aws-codepipeline';
import { EcsDeployAction } from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { IRole } from '@aws-cdk/aws-iam';
import { Stack, Arn, ArnFormat } from '@aws-cdk/core';
import { Construct } from 'constructs';
import {
  IFileSetProducer,
  ICodePipelineActionFactory,
  Step,
  ProduceActionOptions,
  CodePipelineActionFactoryResult,
} from '../../lib';

/**
 * Properties for a `EcsDeployStep`
 */
export interface EcsDeployStepProps {
  /**
   * The role which will take the action on the ECSDeployAction.
   * Role is required when you are deploying across accounts.
   *
   * @default - new role will be created.
   */
  readonly role?: IRole;

  /**
   * The clusterName for the ECS service you are deploying to.
   */
  readonly clusterName: string;

  /**
   * The serviceArn for the ECS service you are deploying to.
   */
  readonly serviceArn: string;

  /**
   * This is the IFileSetProducer which contains the input.
   */
  readonly input: IFileSetProducer;

  /**
   * The path inside of the input (artifact) which contains the imageFile.
   * If provided the path must exist inside of the input artifact.
   * If not provided the input will be used to EcsDeployAction
   * @default - no path will not be leveraged as an imageFile to EcsDeployAction
   */
  readonly imagePath?: string;
}

/**
 * Step for deploying ECS Service.
 */
export class EcsDeployStep extends Step implements ICodePipelineActionFactory {
  /**
   * This is the IFileSetProducer which contains the input.
   */
  public readonly input: IFileSetProducer;

  /**
   * The ECS service which is being deployed to.
   */
  public readonly service: ecs.IBaseService;

  /**
   * The IAM role which the ECS Deploy Action runs as.
   * @default - new role will be created.
   */
  public readonly role?: IRole;
  /**
   * The path inside of the input (artifact) which contains the imageFile.
   * @default - no path will not be leveraged as an imageFile to EcsDeployAction
   */
  public readonly imagePath?: string;
  public constructor(
    scope: Construct,
    id: string,
    props: EcsDeployStepProps,
  ) {
    super(id);

    const stack = Stack.of(scope);
    this.input = props.input;
    this.imagePath = props.imagePath;

    const serviceComponents = Arn.split(props.serviceArn, ArnFormat.NO_RESOURCE_NAME);
    if ( serviceComponents.account! !== stack.account && props.role === undefined ) {
      throw new Error('For cross account deployments "role" must be provied.');
    } else if (serviceComponents.account! !== stack.account && props.role ) {
      const roleComponents = Arn.split(props.role!.roleArn, ArnFormat.NO_RESOURCE_NAME);
      if ( serviceComponents.account! !== roleComponents.account! ) {
        throw new Error('For cross account deployments the "role" must be in the same account as the service.');
      }
    }

    this.role = props.role;

    const account = serviceComponents.account!;
    const region = serviceComponents.region!;
    const resourceName = serviceComponents.resourceName;
    const idSuffix = `${account}-${region}-${resourceName}`;

    const fakeVpc = new ec2.Vpc(
      stack,
      `fakeVpc-${idSuffix}`,
    );

    const importCluster = ecs.Cluster.fromClusterAttributes(
      stack,
      `importCluster-${idSuffix}`, {
        vpc: fakeVpc,
        securityGroups: [],
        clusterName: props.clusterName,
      },
    );

    this.service = ecs.Ec2Service.fromEc2ServiceAttributes(
      stack,
      `importService-${idSuffix}`, {
        serviceArn: props.serviceArn,
        cluster: importCluster,
      },
    );
  }
  public produceAction(
    stage: IStage,
    options: ProduceActionOptions,
  ): CodePipelineActionFactoryResult {
    // Translate the FileSet into a codepipeline.Artifact
    const artifact = options.artifacts.toCodePipeline(this.input.primaryOutput!);
    const input = this.imagePath === undefined ? artifact : undefined;
    const imageFile = this.imagePath !== undefined ? artifact.atPath(this.imagePath) : undefined;

    const ecsDeployAction = new EcsDeployAction({
      actionName: options.actionName,
      runOrder: options.runOrder,
      role: this.role,
      service: this.service,
      input: input,
      imageFile: imageFile,
    });
    stage.addAction(ecsDeployAction);

    return { runOrdersConsumed: 1 };
  }
}