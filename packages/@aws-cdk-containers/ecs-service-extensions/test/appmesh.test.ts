import { Match, Template } from '@aws-cdk/assertions';
import * as appmesh from '@aws-cdk/aws-appmesh';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { AppMeshExtension, Container, Environment, ServiceDescription, Service } from '../lib';

describe('appmesh', () => {
  test('should be able to add AWS App Mesh to a service', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
    });

    // THEN
    // Ensure that task has an App Mesh sidecar
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Cpu: 256,
          DependsOn: [
            {
              Condition: 'HEALTHY',
              ContainerName: 'envoy',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          Memory: 512,
          Name: 'app',
          PortMappings: [
            {
              ContainerPort: 80,
              Protocol: 'tcp',
            },
          ],
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
        },
        {
          Environment: [
            {
              Name: 'APPMESH_VIRTUAL_NODE_NAME',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    'mesh/',
                    {
                      'Fn::GetAtt': [
                        'mymeshEA67EDEF',
                        'MeshName',
                      ],
                    },
                    '/virtualNode/my-service',
                  ],
                ],
              },
            },
            {
              Name: 'AWS_REGION',
              Value: {
                Ref: 'AWS::Region',
              },
            },
            {
              Name: 'ENABLE_ENVOY_STATS_TAGS',
              Value: '1',
            },
            {
              Name: 'ENABLE_ENVOY_DOG_STATSD',
              Value: '1',
            },
          ],
          Essential: true,
          HealthCheck: {
            Command: [
              'CMD-SHELL',
              'curl -s http://localhost:9901/server_info | grep state | grep -q LIVE',
            ],
            Interval: 5,
            Retries: 3,
            StartPeriod: 10,
            Timeout: 2,
          },
          Image: {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::FindInMap': [
                    'myserviceenvoyimageaccountmapping',
                    {
                      Ref: 'AWS::Region',
                    },
                    'ecrRepo',
                  ],
                },
                '.dkr.ecr.',
                {
                  Ref: 'AWS::Region',
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/aws-appmesh-envoy:v1.15.1.0-prod',
              ],
            ],
          },
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'myservicetaskdefinitionenvoyLogGroup0C27EBDB',
              },
              'awslogs-stream-prefix': 'envoy',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          MemoryReservation: 128,
          Name: 'envoy',
          Ulimits: [
            {
              HardLimit: 1024000,
              Name: 'nofile',
              SoftLimit: 1024000,
            },
          ],
          User: '1337',
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionExecutionRole0CE74AD0',
          'Arn',
        ],
      },
      Family: 'myservicetaskdefinition',
      Memory: '512',
      NetworkMode: 'awsvpc',
      ProxyConfiguration: {
        ContainerName: 'envoy',
        ProxyConfigurationProperties: [
          {
            Name: 'AppPorts',
            Value: '80',
          },
          {
            Name: 'ProxyEgressPort',
            Value: '15001',
          },
          {
            Name: 'ProxyIngressPort',
            Value: '15000',
          },
          {
            Name: 'IgnoredUID',
            Value: '1337',
          },
          {
            Name: 'IgnoredGID',
            Value: '1338',
          },
          {
            Name: 'EgressIgnoredIPs',
            Value: '169.254.170.2,169.254.169.254',
          },
        ],
        Type: 'APPMESH',
      },
      RequiresCompatibilities: [
        'EC2',
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'myservicetaskdefinitionTaskRole92ACD903',
          'Arn',
        ],
      },
    });

    // Ensure that the service has the right settings
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      Cluster: {
        Ref: 'productionenvironmentclusterC6599D2D',
      },
      DeploymentConfiguration: {
        MaximumPercent: 200,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 1,
      EnableECSManagedTags: false,
      LaunchType: 'FARGATE',
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: 'DISABLED',
          SecurityGroups: [
            {
              'Fn::GetAtt': [
                'myserviceserviceSecurityGroup3A44A969',
                'GroupId',
              ],
            },
          ],
          Subnets: [
            {
              Ref: 'productionenvironmentvpcPrivateSubnet1Subnet53F632E6',
            },
            {
              Ref: 'productionenvironmentvpcPrivateSubnet2Subnet756FB93C',
            },
          ],
        },
      },
      ServiceRegistries: [
        {
          RegistryArn: {
            'Fn::GetAtt': [
              'myserviceserviceCloudmapService32F63163',
              'Arn',
            ],
          },
        },
      ],
      TaskDefinition: {
        Ref: 'myservicetaskdefinitionF3E2D86F',
      },
    });
  });

  test('should have the right maximumPercentage at desired count == 1', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      desiredCount: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 200,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 1,
    });
  });

  test('should have the right maximumPercentage at desired count == 2', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      desiredCount: 2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 150,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 2,
    });
  });

  test('should have the right maximumPercentage at desired count == 3', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      desiredCount: 3,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 150,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 3,
    });
  });

  test('should have the right maximumPercentage at desired count == 4', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      desiredCount: 4,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 125,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 4,
    });
  });

  test('should have the right maximumPercentage at desired count > 4', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const environment = new Environment(stack, 'production');

    const serviceDescription = new ServiceDescription();

    serviceDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    }));

    const mesh = new appmesh.Mesh(stack, 'my-mesh');

    serviceDescription.add(new AppMeshExtension({
      mesh,
    }));

    new Service(stack, 'my-service', {
      environment,
      serviceDescription,
      desiredCount: 8,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        MaximumPercent: 125,
        MinimumHealthyPercent: 100,
      },
      DesiredCount: 8,
    });
  });

  test('should be able to create multiple App Mesh enabled services and connect', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const mesh = new appmesh.Mesh(stack, 'my-mesh');
    const environment = new Environment(stack, 'production');

    const nameDescription = new ServiceDescription();
    nameDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));
    nameDescription.add(new AppMeshExtension({ mesh }));

    const greetingDescription = new ServiceDescription();
    greetingDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/greeting'),
      environment: {
        PORT: '80',
      },
    }));
    greetingDescription.add(new AppMeshExtension({ mesh }));

    const greeterDescription = new ServiceDescription();
    greeterDescription.add(new Container({
      cpu: 256,
      memoryMiB: 512,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/greeter'),
      environment: {
        PORT: '80',
      },
    }));
    greeterDescription.add(new AppMeshExtension({ mesh }));

    const greeterService = new Service(stack, 'greeter', {
      environment,
      serviceDescription: greeterDescription,
    });
    const greetingService = new Service(stack, 'greeting', {
      environment,
      serviceDescription: greetingDescription,
    });
    const nameService = new Service(stack, 'name', {
      environment,
      serviceDescription: nameDescription,
    });

    greeterService.connectTo(nameService);
    greeterService.connectTo(greetingService);

    // THEN
    Template.fromStack(stack).hasResource('AWS::ECS::TaskDefinition', Match.anyValue());
  });

  test('should detect when attempting to connect services from two different envs', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const production = new Environment(stack, 'production');
    const development = new Environment(stack, 'development');

    const productionMesh = new appmesh.Mesh(stack, 'production-mesh');
    const developmentMesh = new appmesh.Mesh(stack, 'development-mesh');

    /** Production name service */
    const productionNameDescription = new ServiceDescription();
    productionNameDescription.add(new Container({
      cpu: 1024,
      memoryMiB: 2048,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));
    productionNameDescription.add(new AppMeshExtension({ mesh: productionMesh }));

    const productionNameService = new Service(stack, 'name-production', {
      environment: production,
      serviceDescription: productionNameDescription,
    });

    /** Development name service */
    const developmentNameDescription = new ServiceDescription();
    developmentNameDescription.add(new Container({
      cpu: 1024,
      memoryMiB: 2048,
      trafficPort: 80,
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      environment: {
        PORT: '80',
      },
    }));
    developmentNameDescription.add(new AppMeshExtension({ mesh: developmentMesh }));

    const developmentNameService = new Service(stack, 'name-development', {
      environment: development,
      serviceDescription: developmentNameDescription,
    });

    // THEN
    expect(() => {
      developmentNameService.connectTo(productionNameService);
    }).toThrow(/Unable to connect service 'name-development' in environment 'development' to service 'name-production' in environment 'production' because services can not be connected across environment boundaries/);
  });
});