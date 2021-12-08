import '@aws-cdk/assert-internal/jest';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

describe('ecs deploy action', () => {
  describe('ECS deploy Action', () => {
    test('throws an exception if neither service nor serviceAttributes were provided', () => {
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          input: artifact,
        });
      }).toThrow(/one of 'service' or 'serviceAttributes' is required/);


    });

    test('can be created just by specifying the service', () => {
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

    test('throws an exception if specifiying the serviceAttributes were provided without region and role', () => {
      const artifact = new codepipeline.Artifact('Artifact');
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          input: artifact,
          serviceAttributes: serviceAttributes,
        });
      }).toThrow(/'region' and 'role' is required when specifying 'serviceAttributes'/);
    });

    test('throws an exception if specifiying the serviceAttributes were provided without region', () => {
      const artifact = new codepipeline.Artifact('Artifact');
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          input: artifact,
          serviceAttributes: serviceAttributes,
          role: anyIamRole(),
        });
      }).toThrow(/'region' is required when specifying 'serviceAttributes'/);
    });

    test('throws an exception if specifiying the serviceAttributes were provided without role', () => {
      const artifact = new codepipeline.Artifact('Artifact');
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          input: artifact,
          serviceAttributes: serviceAttributes,
          region: 'us-east-1',
        });
      }).toThrow(/'role' is required when specifying 'serviceAttributes'/);
    });

    test('can be created just by specifying the serviceAttributes with role and region', () => {
      const artifact = new codepipeline.Artifact('Artifact');
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          serviceAttributes: serviceAttributes,
          input: artifact,
          region: 'us-east-1',
          role: anyIamRole(),
        });
      }).not.toThrow();

    });

    test('throws an exception if both service and serviceAttributes were provided', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          serviceAttributes: serviceAttributes,
        });
      }).toThrow(/one of 'service' or 'serviceAttributes' can be provided/);

    });

    test('throws an exception if both service and region were provided', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');


      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          region: 'us-east-1',
        });
      }).toThrow(/not specify 'region' when specifying 'service'/);

    });

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
    test('throws an error when service imported is defined in a pipeline stage', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'PipelineStack', {
        env: {
          region: 'us-east-1',
        },
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
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [source],
          },
        ],
      });

      class TestStack extends cdk.Stack {
        public readonly service: ecs.IBaseService;
        // eslint-disable-next-line @aws-cdk/no-core-construct
        constructor(scope: Construct, id: string, props: cdk.StackProps) {
          super(scope, id, props);
          const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
          taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          });
          const vpc = new ec2.Vpc(this, 'VPC');
          const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc,
          });
          this.service = new ecs.FargateService(this, 'FargateService', {
            cluster,
            taskDefinition,
          });
        }
      }
      class TestStage extends cdk.Stage {
        public readonly service: ecs.IBaseService;
        // eslint-disable-next-line @aws-cdk/no-core-construct
        constructor(scope: Construct, id: string, props: cdk.StageProps) {
          super(scope, id, props);
          const testStack = new TestStack(this, 'ecsStack', {});
          this.service = testStack.service;
        }
      }
      const testStage = new TestStage(
        stack,
        'TestStage',
        {
          env: {
            region: 'us-east-1',
          },
        },
      );
      const testIStage = pipeline.addStage(testStage);
      const deployAction = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service: testStage.service,
        imageFile: artifact.atPath('imageFile.json'),
      });
      testIStage.addAction(deployAction);
      expect(() => {
        app.synth();
      }).toThrow(/dependency cannot cross stage boundaries/);
    });
    test('can be created by serviceAttribes, region and role', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(
        app,
        'pipelineStack',
        {
          env: {
            region: 'us-east-1',
          },
        },
      );
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
      const serviceAttributes = {
        clusterName: 'cluster-name',
        serviceName: 'service-name',
      };
      const region = 'us-east-1';
      const deploymentRole = new iam.Role(stack, 'DeploymentRole', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      });
      const role = iam.Role.fromRoleArn(
        stack,
        'roleFromArnForIRole',
        deploymentRole.roleArn,
      );
      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        serviceAttributes: serviceAttributes,
        imageFile: artifact.atPath('imageFile.json'),
        region: region,
        role: role,

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
                Region: 'us-east-1',
              },
            ],
          },
        ],
      });
    });
    test('can be created cross stage serviceAttribes, region and role', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'PipelineStack', {
        env: {
          region: 'us-east-1',
        },
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
      const deploymentRole = new iam.Role(stack, 'DeploymentRole', {
        assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      });
      const role = iam.Role.fromRoleArn(
        stack,
        'roleFromArnForIRole',
        deploymentRole.roleArn,
      );
      const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [source],
          },
        ],
      });

      interface TestStackProps extends cdk.StackProps {
        readonly serviceName: string;
        readonly clusterName: string;
      }

      class TestStack extends cdk.Stack {
        // eslint-disable-next-line @aws-cdk/no-core-construct
        constructor(scope: Construct, id: string, props: TestStackProps) {
          super(scope, id, props);
          const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');
          taskDefinition.addContainer('MainContainer', {
            image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
          });
          const vpc = new ec2.Vpc(this, 'VPC');
          const cluster = new ecs.Cluster(this, 'Cluster', {
            clusterName: props.clusterName,
            vpc,
          });
          new ecs.FargateService(this, 'FargateService', {
            serviceName: props.serviceName,
            cluster,
            taskDefinition,
          });
        }
      }
      class TestStage extends cdk.Stage {
        public readonly serviceName: string;
        public readonly clusterName: string;
        // eslint-disable-next-line @aws-cdk/no-core-construct
        constructor(scope: Construct, id: string, props: cdk.StageProps) {
          super(scope, id, props);
          this.serviceName = 'service-name';
          this.clusterName = 'cluster-name';
          new TestStack(this, 'ecsStack', {
            serviceName: this.serviceName,
            clusterName: this.clusterName,
          });
        }
      }
      const testStage = new TestStage(
        stack,
        'TestStage',
        {
          env: {
            region: 'us-east-1',
          },
        },
      );
      const testIStage = pipeline.addStage(testStage);
      const deployAction = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        serviceAttributes: {
          serviceName: testStage.serviceName,
          clusterName: testStage.clusterName,
        },
        region: 'us-east-1',
        role: role,
        imageFile: artifact.atPath('imageFile.json'),
      });
      testIStage.addAction(deployAction);
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
                Region: 'us-east-1',
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


function anyIamRole(): iam.IRole {
  const stack = new cdk.Stack();
  const role = new iam.Role(stack, 'DeploymentRole', {
    assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
    roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
  });
  return iam.Role.fromRoleArn(
    stack,
    'roleFromArn',
    role.roleArn,
  );
}
