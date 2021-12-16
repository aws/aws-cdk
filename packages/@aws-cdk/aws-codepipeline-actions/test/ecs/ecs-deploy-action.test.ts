import '@aws-cdk/assert-internal/jest';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as cpactions from '../../lib';

describe('ecs deploy action', () => {
  describe('ECS deploy Action', () => {
    test('throws an exception if neither inputArtifact nor imageFile were provided', () => {
      const service = anyEcsService();

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
        });
      }).toThrow(/one of 'input' or 'imageFile' is required/);


    });

    test('can be created just by specifying the inputArtifact', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
        });
      }).not.toThrow();


    });

    test('can be created just by specifying the imageFile', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          imageFile: artifact.atPath('imageFile.json'),
        });
      }).not.toThrow();


    });

    test('throws an exception if both inputArtifact and imageFile were provided', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          imageFile: artifact.atPath('file.json'),
        });
      }).toThrow(/one of 'input' or 'imageFile' can be provided/);


    });

    test('can be created with deploymentTimeout between 1-60 minutes', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(30),
        });
      }).not.toThrow();


    });

    test('throws an exception if deploymentTimeout is out of bounds', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(61),
        });
      }).toThrow(/timeout must be between 1 and 60 minutes/);

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(0),
        });
      }).toThrow(/timeout must be between 1 and 60 minutes/);

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.seconds(30),
        });
      }).toThrow(/cannot be converted into a whole number/);


    });

    test("sets the target service as the action's backing resource", () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        input: artifact,
      });

      expect(action.actionProperties.resource).toEqual(service);


    });

    test('can be created by existing service', () => {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'FargateService', {
        serviceName: 'service-name',
        cluster: ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
          vpc,
          securityGroups: [],
          clusterName: 'cluster-name',
        }),
      });
      const artifact = new codepipeline.Artifact('Artifact');
      const bucket = new s3.Bucket(stack, 'PipelineBucket', {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      const source = new cpactions.S3SourceAction({
        actionName: 'Source',
        output: artifact,
        bucket,
        bucketKey: 'key',
      });
      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        imageFile: artifact.atPath('imageFile.json'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [source],
          },
          {
            stageName: 'Deploy',
            actions: [action],
          },
        ],
      });

      expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Name: 'ECS',
                ActionTypeId: {
                  Category: 'Deploy',
                  Provider: 'ECS',
                },
                Configuration: {
                  ClusterName: 'cluster-name',
                  ServiceName: 'service-name',
                  FileName: 'imageFile.json',
                },
              },
            ],
          },
        ],
      });


    });
  });
  describe('ECS deploy Action service reference cross account/region', () => {
    test('leverage existing service', () => {
      const app = new cdk.App();
      const stack = new PipelineEcsDeployImportStack(app, 'PipelineStack', {
        env: {
          region: 'us-east-1',
          account: '234567890123',
        },
      });
      app.synth();

      expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Name: 'ECS',
                ActionTypeId: {
                  Category: 'Deploy',
                  Provider: 'ECS',
                },
                Configuration: {
                  ClusterName: 'cluster-name',
                  ServiceName: 'service-name',
                  FileName: 'imageFile.json',
                },
                Region: 'us-west-2',
                RoleArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::123456789012:role/pipelinestack-support-123ageecsactionrolec7a0155032b56a30da59',
                    ],
                  ],
                },
              },
            ],
          },
        ],
      });

    });
    test('create new service', () => {
      const app = new cdk.App();
      const stack = new PipelineEcsDeployCreateStack(app, 'PipelineStack', {
        env: {
          region: 'us-east-1',
          account: '234567890123',
        },
      });
      app.synth();

      expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Name: 'ECS',
                ActionTypeId: {
                  Category: 'Deploy',
                  Provider: 'ECS',
                },
                Configuration: {
                  ClusterName: 'teststage-ecsstackeecsstackcluster631300db487421429f3b',
                  ServiceName: 'teststage-ecsstackckfargateservicecb7fe40e2cebe441d9da',
                  FileName: 'imageFile.json',
                },
                Region: 'us-west-2',
                RoleArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::123456789012:role/deployrole',
                    ],
                  ],
                },
              },
            ],
          },
        ],
      });
    });
  });
});

function anyEcsService(): ecs.FargateService {
  const stack = new cdk.Stack();
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
  taskDefinition.addContainer('MainContainer', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  });
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc,
  });
  return new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
  });
}

class PipelineEcsDeployBaseStack extends cdk.Stack {
  public readonly pipeline: codepipeline.Pipeline;
  public readonly artifact: codepipeline.Artifact;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const artifact = new codepipeline.Artifact('Artifact');
    this.artifact = artifact;
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
    this.pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [source],
        },
      ],
    });
    this.addStages();
  }
  public addStages() {
    throw new Error('Not Implemented');
  }
}

class TestImportStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly clusterName: string;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc');
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
  }
}
class TestImportStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly clusterName: string;

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);
    const testStack = new TestImportStack(this, 'ecsStack', {});
    this.serviceArn = testStack.serviceArn;
    this.clusterName = testStack.clusterName;
  }
}

class PipelineEcsDeployImportStack extends PipelineEcsDeployBaseStack {
  public addStages() {
    const testStage = new TestImportStage(
      this,
      'TestStage',
      {
        env: {
          region: 'us-west-2',
          account: '123456789012',
        },
      },
    );
    const testIStage = this.pipeline.addStage(testStage);
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
     * is created which most likely will not exist in the account you are deploying to.
     * The create test has an example of how to leverage that role.
     */
    const deployAction = new cpactions.EcsDeployAction({
      actionName: 'ECS',
      service: service,
      imageFile: this.artifact.atPath('imageFile.json'),
    });
    testIStage.addAction(deployAction);
  }
}

class TestCreateStack extends cdk.Stack {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
    taskDefinition.addContainer('MainContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    const vpc = new ec2.Vpc(this, 'VPC');
    const cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      vpc,
    });
    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      serviceName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
    this.serviceArn = this.formatArn({
      service: 'ecs',
      resource: 'service',
      resourceName: service.serviceName,
    });
    this.clusterName = cluster.clusterName;
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
  }
}
class TestCreateStage extends cdk.Stage {
  public readonly serviceArn: string;
  public readonly clusterName: string;
  public readonly deployRole: iam.IRole;

  constructor(scope: Construct, id: string, props: cdk.StageProps) {
    super(scope, id, props);
    const testStack = new TestCreateStack(this, 'ecsStack', {});
    this.serviceArn = testStack.serviceArn;
    this.clusterName = testStack.clusterName;
    this.deployRole = testStack.deployRole;
  }
}

class PipelineEcsDeployCreateStack extends PipelineEcsDeployBaseStack {
  public addStages() {
    const testStage = new TestCreateStage(
      this,
      'TestStage',
      {
        env: {
          region: 'us-west-2',
          account: '123456789012',
        },
      },
    );
    const testIStage = this.pipeline.addStage(testStage);
    const service = ecs.FargateService.fromFargateServiceAttributes(this, 'FargateService', {
      serviceArn: testStage.serviceArn,
      cluster: ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
        vpc: new ec2.Vpc(this, 'Vpc'),
        securityGroups: [],
        clusterName: testStage.clusterName,
      }),
    });
    const deployAction = new cpactions.EcsDeployAction({
      actionName: 'ECS',
      service: service,
      imageFile: this.artifact.atPath('imageFile.json'),
      role: testStage.deployRole,
    });
    testIStage.addAction(deployAction);
  }
}