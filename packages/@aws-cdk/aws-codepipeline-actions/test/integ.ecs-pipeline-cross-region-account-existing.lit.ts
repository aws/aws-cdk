/// !cdk-integ *

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cpactions from '../lib';
import { EcsServiceCrossRegionAccountPipelineStack } from './ecs-pipeline-cross-region-account-helpers';
/**
 * This example demonstrates how to create a CodePipeline that deploys to an existing ECS Service across accounts and regions.
 * This will not deploy because integ tests only run in one account.
 * Updates to this require yarn integ --dry-run integ.ecs-pipeline-cross-region-account-existing.lit.js to generate the expected JSON file.
 */

/// !show

const app = new cdk.App();

/**
 * Deploying to an existing ECS Service using CodePipeline across account(s) and/or region(s).
 */


/**
 * This is the Stack which will import our existing ECS Service that uses
 * the provided clusterName and serviceName.
 */
class ExistingEcsServiceStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly deployRole: iam.IRole;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // import the existing VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VpcLookup', {
      isDefault: false,
    });
    const clusterName = 'cluster-name';
    const cluster = ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
      vpc,
      securityGroups: [],
      clusterName: clusterName,
    });
    const service = ecs.FargateService.fromFargateServiceAttributes(this, 'FargateService', {
      serviceName: 'service-name',
      cluster: cluster,
    });
    /**
     * The default serviceArn doesn't include the cluster, as it isn't in the new format.
     */
    this.serviceArn = this.formatArn({
      service: 'ecs',
      resource: 'service',
      resourceName: `${cluster.clusterName}/${service.serviceName}`,
    });
    /**
     * The deployRole is being looked up from an existing role.
     * If you want to create a new role here you can do that however you will need this stack deployed
     * before you add the ECSDeployAction to the pipeline.
     *
     * The role could be created in another pipeline or you could leverage the CDKBootstrap created role.
     *
     * To leverage the CDKBootstrap created role you would use something like this to define the resourceName.
     * 'hnb659fds' is the default bootstrap qualifier if you leverage a different qualifer change that.
     * const cdkBootstrapQualifier = 'hnb659fds';
     * const deployRoleName = `cdk-${cdkBootstrapQualifier}-deploy-role-${props.env!.account!}-${props.env!.region!}`;
     *
     * Ensure the role has permissions to deploy to ECS refer to.
     * https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
     */
    const deployArn = this.formatArn({
      region: '',
      service: 'iam',
      resource: 'role',
      resourceName: 'deployrole',
    });
    this.deployRole = iam.Role.fromRoleArn(this, 'DeployRole', deployArn);
    // Adding ECS Deploy Permissions to deployRole
    this.deployRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'ecs:DescribeServices',
        'ecs:DescribeTaskDefinition',
        'ecs:DescribeTasks',
        'ecs:ListTasks',
        'ecs:RegisterTaskDefinition',
        'ecs:UpdateService',
      ],
      resources: ['*'],
    }));

    this.deployRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: ['*'],
      conditions: {
        StringEqualsIfExists: {
          'iam:PassedToService': [
            'ec2.amazonaws.com',
            'ecs-tasks.amazonaws.com',
          ],
        },
      },
    }));
  }
}

/**
 * This is the Stage which does our import using {@link ExistingEcsServiceStack}.
 */
class ExistingEcsServiceStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly deployRole: iam.IRole;
  public readonly stack: cdk.Stack

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);

    const testStack = new ExistingEcsServiceStack(this, 'ecsStack', {});
    this.stack = testStack;
    this.serviceArn = testStack.serviceArn;
    this.deployRole = testStack.deployRole;
  }
}

/**
 * This is our pipeline which will create an ECS Service and deploy
 * to is using {@link EcsDeployAction} using our {@link NewEcsServiceStage}
 */
const pipelineStack = new EcsServiceCrossRegionAccountPipelineStack(app, 'ExistingEcsServicePipelineStack', {
  env: {
    region: 'pipeline-region',
    account: 'pipeline-account',
  },
});
const pipeline: codepipeline.Pipeline = pipelineStack.pipeline;
const artifact: codepipeline.Artifact = pipelineStack.artifact;

const testStage = new ExistingEcsServiceStage(pipelineStack, 'TestStage', {
  env: {
    region: 'service-region',
    account: 'service-account',
  },
});
const stackName = testStage.stack.stackName;
const changeSetName = `changeset-${testStage.stack.stackName}`;
const stageActions = [];
stageActions.push(new cpactions.CloudFormationCreateReplaceChangeSetAction({
  actionName: 'PrepareChanges',
  stackName: stackName,
  changeSetName: changeSetName,
  adminPermissions: true,
  templatePath: artifact.atPath(testStage.stack.templateFile),
  runOrder: 1,
}));
stageActions.push(new cpactions.CloudFormationExecuteChangeSetAction({
  actionName: 'ExecuteChanges',
  stackName: stackName,
  changeSetName: changeSetName,
  runOrder: 2,
}));

const testIStage = pipeline.addStage({
  stageName: testStage.stageName,
  actions: stageActions,
});
/**
 * This imports the service so it can be used by the ECS Deploy Action.
 * This must use the serviceArn so that the region is set correctly.
 * The VPC doesn't actually matter and it doesn't get created.
 * The construct ids will need to be unique.
*/
const service = ecs.BaseService.fromServiceArnWithCluster(pipelineStack, 'FargateService', testStage.serviceArn);
/**
 * It is highly recommended passing in the role from the stage/stack, if not a new role
 * will be added to the pipeline action, will not exist in the account you are deploying to.
 *
 * Using input however imageFile could be used as well, based on your use case.
 */
const deployAction = new cpactions.EcsDeployAction({
  actionName: 'ECS',
  service: service,
  input: artifact,
  role: testStage.deployRole,
  runOrder: 3,
});
testIStage.addAction(deployAction);

/// !hide

app.synth();
