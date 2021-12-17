/// !cdk-integ *

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cpactions from '../lib';


/**
 * This example demonstrates how to create a CodePipeline that deploy to an existing an ECS Service across
 * accounts and regions.
 * This will not deploy because integ tests only run in one account.
 * Updates to this require yarn integ --dry-run integ.pipeline-ecs-import-cross-account.lit.js to generate the expected JSON file.
 */

/// !show

const app = new cdk.App();

/**
 * Deploying a existing ECS Service using CodePipeline across account(s) and/or region(s).
 */


/**
 * This is the Stack which will import our existing ECS Service that uses
 * the provided clusterName and serviceName.
 */
class TestImportEcsStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    // import the existing VPC
    const vpc = ec2.Vpc.fromLookup(
      this,
      'VpcLookup',
      {
        isDefault: false,
      },
    );
    this.clusterName = 'cluster-name';
    const service = ecs.FargateService.fromFargateServiceAttributes(this, 'FargateService', {
      serviceName: 'service-name',
      cluster: ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
        vpc,
        securityGroups: [],
        clusterName: this.clusterName,
      }),
    });
    this.serviceArn = service.serviceArn;
    /**
     * The deployRole is being looked up from an existing role.
     * If you want to create a new role here you can do that however you will need this stack deployed
     * before you add the ECSDeployAction to the pipeline.
     *
     * The role could be created in another pipeline or you could leverage the CDKBootstrap created role.
     *
     *  To leverage the CDKBootstrap created role you would use something like this to define the resourceName
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
    this.deployRole = iam.Role.fromRoleArn(
      this,
      'DeployRole',
      deployArn,
    );
    // Adding ECS Deploy Permissions to deployRole
    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:DescribeServices',
          'ecs:DescribeTaskDefinition',
          'ecs:DescribeTasks',
          'ecs:ListTasks',
          'ecs:RegisterTaskDefinition',
          'ecs:UpdateService',
        ],
        resources: ['*'],
      }),
    );

    this.deployRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
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
      }),
    );
  }
}

/**
 * This is the Stage which does our import using {@link TestImportEcsStack}.
 */
class TestImportEcsStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);
    const testStack = new TestImportEcsStack(this, 'ecsStack', {});
    this.serviceArn = testStack.serviceArn;
    this.clusterName = testStack.clusterName;
    this.deployRole = testStack.deployRole;
  }
}

/**
 * This is our pipeline which will import our existing ECS Service and deploy
 * to is using {@link EcsDeployAction} using our {@link TestImportEcsStage}
 */
class PipelineEcsDeployImportStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const artifact = new codepipeline.Artifact('Artifact');
    const bucket = new s3.Bucket(this, 'PipelineBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const source = new cpactions.S3SourceAction({
      actionName: 'Source',
      output: artifact,
      bucket,
      bucketKey: 'key',
    });
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [source],
        },
      ],
    });
    const testStage = new TestImportEcsStage(
      this,
      'TestStage',
      {
        env: {
          region: 'us-west-2',
          account: '123456789012',
        },
      },
    );
    const testIStage = pipeline.addStage(testStage);
    /**
     * This imports the service so it can be used by the ECS Deploy Action.
     * This must use the serviceArn so that the region is set correctly.
     * The VPC doesn't actually matter and it doesn't get created.
     * The construct ids will need to be unique.
    */
    const service = ecs.FargateService.fromFargateServiceAttributes(this, 'FargateService', {
      serviceArn: testStage.serviceArn,
      cluster: ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
        vpc: new ec2.Vpc(this, 'Vpc'),
        securityGroups: [],
        clusterName: testStage.clusterName,
      }),
    });
    /**
     * It is highly recommended passing in the role from the stage/stack, if not a new role
     * will be added to the pipeline action, will not exist in the account you are deploying to.
     */
    const deployAction = new cpactions.EcsDeployAction({
      actionName: 'ECS',
      service: service,
      imageFile: artifact.atPath('imageFile.json'),
      role: testStage.deployRole,
    });
    testIStage.addAction(deployAction);
  }
}

// Define our ECS Deploy Import Stack related to import and deploy existing services.
new PipelineEcsDeployImportStack(app, 'ImportPipelineStack', {
  env: {
    region: 'us-east-1',
    account: '234567890123',
  },
});


/// !hide

app.synth();
