import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import { AutoRollbackConfig } from '../rollback-config';
import { EcsAppSpec } from './appspec';
import { IEcsDeploymentGroup } from './deployment-group';

/**
 * Construction properties of {@link EcsDeployment}.
 */
export interface EcsDeploymentProps {
  /**
   * The deployment group to target for this deployment.
   */
  readonly deploymentGroup: IEcsDeploymentGroup;

  /**
   * The AppSpec to use for the deployment.
   *
   * {@link https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-resources.html#reference-appspec-file-structure-resources-ecs}
   */
  readonly appspec: EcsAppSpec;

  /**
   * The configuration for rollback in the event that a deployment fails.
   *
   * @default: no automatic rollback triggered
   */
  readonly autoRollback?: AutoRollbackConfig;

  /**
   * The description for the deployment.
   *
   * @default no description
   */
  readonly description?: string;

  /**
   * The timeout for the deployment. If the timeout is reached, it will trigger a rollback of the stack.
   *
   * @default 30 minutes
   */
  readonly timeout?: cdk.Duration;

}

/**
 * A CodeDeploy Deployment for a Amazon ECS service DeploymentGroup.
 */
export class EcsDeployment extends Construct {
  /**
   * The id of the deployment that was created.
   */
  deploymentId: string;

  /**
   * An {@link EcsDeploymentGroup} must only have 1 EcsDeployment. This limit is enforced by not allowing
   * the `scope` or `id` to be passed to the constructor. The `scope` will always be set to the
   * `deploymentGroup` from `props` and the `id` will always be set to the string 'Deployment'
   * to force an error if mulitiple EcsDeployment constructs are created for a single EcsDeploymentGrouop.
   */
  constructor(props: EcsDeploymentProps) {
    super(props.deploymentGroup, 'Deployment');

    const ecsDeploymentProvider = new EcsDeploymentProvider(this, 'DeploymentProvider', {
      deploymentGroup: props.deploymentGroup,
      timeout: props.timeout || cdk.Duration.minutes(30),
    });

    let autoRollbackConfigurationEvents = [];
    if (props.autoRollback?.deploymentInAlarm) {
      autoRollbackConfigurationEvents.push('DEPLOYMENT_STOP_ON_ALARM');
    }
    if (props.autoRollback?.failedDeployment) {
      autoRollbackConfigurationEvents.push('DEPLOYMENT_FAILURE');
    }
    if (props.autoRollback?.stoppedDeployment) {
      autoRollbackConfigurationEvents.push('DEPLOYMENT_STOP_ON_REQUEST');
    }

    const deployment = new cdk.CustomResource(this, 'DeploymentResource', {
      serviceToken: ecsDeploymentProvider.serviceToken,
      resourceType: 'Custom::EcsDeployment',
      properties: {
        applicationName: props.deploymentGroup.application.applicationName,
        deploymentConfigName: props.deploymentGroup.deploymentConfig.deploymentConfigName,
        deploymentGroupName: props.deploymentGroup.deploymentGroupName,
        autoRollbackConfigurationEnabled: (autoRollbackConfigurationEvents.length > 0).toString(),
        autoRollbackConfigurationEvents: autoRollbackConfigurationEvents.join(','),
        description: props.description,
        revisionAppSpecContent: props.appspec.toString(),
      },
    });
    this.deploymentId = deployment.getAttString('deploymentId');
  }
}

/**
 * Construction properties of {@link EcsDeploymentProvider}.
 */
interface EcsDeploymentProviderProps {
  /**
   * The deployment group to target for this deployment.
   */
  readonly deploymentGroup: IEcsDeploymentGroup;

  /**
   * The timeout for the deployment. If the timeout is reached, it will trigger a rollback of the stack.
   */
  readonly timeout: cdk.Duration;

  /**
   * The interval to query the deployment to determine when the deployment is completed.
   *
   * @default 15 seconds
   */
  readonly queryInterval?: cdk.Duration;
}

/**
 * A custom resource provider to handle creation of new {@link EcsDeployment}.
 */
class EcsDeploymentProvider extends cr.Provider {
  constructor(scope: Construct, id: string, props: EcsDeploymentProviderProps) {

    const functionNamePrefix = [
      'EcsDeploymentProvider',
      props.deploymentGroup.application.applicationName,
      props.deploymentGroup.deploymentGroupName,
    ].join('-');
    const eventLambda = new NodejsFunction(scope, `${id}OnEventLambda`, {
      functionName: `${functionNamePrefix}-onEvent`,
      timeout: cdk.Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.resolve(__dirname, '..', '..', 'lambda-packages', 'ecs-deployment-provider', 'lib', 'on-event.ts'),
    });
    eventLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'codedeploy:GetApplicationRevision',
        'codedeploy:RegisterApplicationRevision',
      ],
      resources: [
        props.deploymentGroup.application.applicationArn,
      ],
    }));
    eventLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'codedeploy:CreateDeployment',
        'codedeploy:StopDeployment',
        'codedeploy:GetDeployment',
      ],
      resources: [
        props.deploymentGroup.deploymentGroupArn,
      ],
    }));
    eventLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'codedeploy:GetDeploymentConfig',
      ],
      resources: [
        props.deploymentGroup.deploymentConfig.deploymentConfigArn,
      ],
    }));

    const completeLambda = new NodejsFunction(scope, `${id}IsCompleteLambda`, {
      functionName: `${functionNamePrefix}-isComplete`,
      timeout: cdk.Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler',
      entry: path.resolve(__dirname, '..', '..', 'lambda-packages', 'ecs-deployment-provider', 'lib', 'is-complete.ts'),
    });
    completeLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'codedeploy:GetDeployment',
      ],
      resources: [
        props.deploymentGroup.deploymentGroupArn,
      ],
    }));
    super(scope, id, {
      providerFunctionName: `${functionNamePrefix}-provider`,
      onEventHandler: eventLambda,
      isCompleteHandler: completeLambda,
      queryInterval: props.queryInterval || cdk.Duration.seconds(15),
      totalTimeout: props.timeout,
    });
  }

}