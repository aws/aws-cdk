"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const s3 = require("@aws-cdk/aws-s3");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const ssm = require("@aws-cdk/aws-ssm");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const ecs = require("../lib");
const lib_1 = require("../lib");
describe('container definition', () => {
    describe('When creating a Task Definition', () => {
        test('add a container using default props', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 2048,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Essential: true,
                        Image: '/aws/aws-example-app',
                        Memory: 2048,
                        Name: 'Container',
                    },
                ],
            });
        });
        describe('PortMap validates', () => {
            test('throws when PortMapping.name is empty string.', () => {
                // GIVEN
                const portMapping = {
                    containerPort: 8080,
                    name: '',
                };
                const networkmode = ecs.NetworkMode.AWS_VPC;
                const portMap = new ecs.PortMap(networkmode, portMapping);
                // THEN
                expect(() => {
                    portMap.validate();
                }).toThrow();
            });
            describe('ContainerPort should not eqaul Hostport', () => {
                test('when AWS_VPC Networkmode', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        hostPort: 8081,
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const portMap = new ecs.PortMap(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        portMap.validate();
                    }).toThrow();
                });
                test('when Host Networkmode', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        hostPort: 8081,
                    };
                    const networkmode = ecs.NetworkMode.HOST;
                    const portMap = new ecs.PortMap(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        portMap.validate();
                    }).toThrow();
                });
            });
            describe('ContainerPort can equal HostPort cases', () => {
                test('when Bridge Networkmode', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        hostPort: 8080,
                    };
                    const networkmode = ecs.NetworkMode.BRIDGE;
                    const portMap = new ecs.PortMap(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        portMap.validate();
                    }).not.toThrow();
                });
            });
        });
        describe('ServiceConnect class', () => {
            describe('isServiceConnect', () => {
                test('return true if params has portname', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        name: 'test',
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(serviceConnect.isServiceConnect()).toEqual(true);
                });
                test('return true if params has appProtocol', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        appProtocol: ecs.AppProtocol.http2,
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(serviceConnect.isServiceConnect()).toEqual(true);
                });
                test('return false if params has not appProtocl and portName ', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(serviceConnect.isServiceConnect()).toEqual(false);
                });
            });
            describe('validate', () => {
                test('throw if Host Networkmode', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        name: 'test',
                    };
                    const networkmode = ecs.NetworkMode.HOST;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        serviceConnect.validate();
                    }).toThrow();
                });
                test('throw if has not portmap name', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        appProtocol: ecs.AppProtocol.http2,
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        serviceConnect.validate();
                    }).toThrow('Service connect-related port mapping field \'appProtocol\' cannot be set without \'name\'');
                });
                test('should not throw if AWS_VPC NetworkMode and has portname', () => {
                    // GIVEN
                    const portMapping = {
                        containerPort: 8080,
                        name: 'test',
                    };
                    const networkmode = ecs.NetworkMode.AWS_VPC;
                    const serviceConnect = new ecs.ServiceConnect(networkmode, portMapping);
                    // THEN
                    expect(() => {
                        serviceConnect.validate();
                    }).not.toThrow();
                });
            });
        });
        test('port mapping throws an error when appProtocol is set without name', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const container = new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 2048,
                portMappings: [
                    {
                        containerPort: 80,
                        name: 'api',
                    },
                ],
            });
            // THEN
            const expected = [
                {
                    containerPort: 80,
                    hostPort: 0,
                    name: 'api',
                },
            ];
            expect(container.portMappings).toEqual(expected);
            expect(() => {
                container.addPortMappings({
                    containerPort: 443,
                    appProtocol: lib_1.AppProtocol.grpc,
                });
            }).toThrow(/Service connect-related port mapping field 'appProtocol' cannot be set without 'name'/);
        });
        test('multiple port mappings of the same name error out', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
            const container = new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 2048,
            });
            // THEN
            expect(() => {
                container.addPortMappings({
                    containerPort: 80,
                    name: 'api',
                }, {
                    containerPort: 443,
                    name: 'api',
                });
            }).toThrow(/Port mapping name 'api' already exists on this container/);
        });
        test('empty string port mapping name throws', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
            const container = new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 2048,
            });
            // THEN
            expect(() => {
                container.addPortMappings({
                    containerPort: 80,
                    name: '',
                });
            }).toThrow();
        });
        test('add a container using all props', () => {
            // GIVEN
            const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
            const stack = new cdk.Stack(app);
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const secret = new secretsmanager.Secret(stack, 'Secret');
            new ecs.ContainerDefinition(stack, 'Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                taskDefinition,
                memoryLimitMiB: 1024,
                memoryReservationMiB: 512,
                containerName: 'Example Container',
                command: ['CMD-SHELL'],
                cpu: 128,
                disableNetworking: true,
                dnsSearchDomains: ['example.com'],
                dnsServers: ['host.com'],
                dockerLabels: {
                    key: 'fooLabel',
                    value: 'barLabel',
                },
                dockerSecurityOptions: ['ECS_SELINUX_CAPABLE=true'],
                entryPoint: ['top', '-b'],
                environment: {
                    key: 'foo',
                    value: 'bar',
                },
                environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
                essential: true,
                extraHosts: {
                    name: 'dev-db.hostname.pvt',
                },
                gpuCount: 256,
                hostname: 'host.example.com',
                privileged: true,
                readonlyRootFilesystem: true,
                startTimeout: cdk.Duration.millis(2000),
                stopTimeout: cdk.Duration.millis(5000),
                user: 'rootUser',
                workingDirectory: 'a/b/c',
                healthCheck: {
                    command: ['curl localhost:8000'],
                },
                linuxParameters: new ecs.LinuxParameters(stack, 'LinuxParameters'),
                logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
                secrets: {
                    SECRET: ecs.Secret.fromSecretsManager(secret),
                },
                systemControls: [
                    { namespace: 'SomeNamespace', value: 'SomeValue' },
                ],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        Command: [
                            'CMD-SHELL',
                        ],
                        Cpu: 128,
                        DisableNetworking: true,
                        DnsSearchDomains: [
                            'example.com',
                        ],
                        DnsServers: [
                            'host.com',
                        ],
                        DockerLabels: {
                            key: 'fooLabel',
                            value: 'barLabel',
                        },
                        DockerSecurityOptions: [
                            'ECS_SELINUX_CAPABLE=true',
                        ],
                        EntryPoint: [
                            'top',
                            '-b',
                        ],
                        Environment: [
                            {
                                Name: 'key',
                                Value: 'foo',
                            },
                            {
                                Name: 'value',
                                Value: 'bar',
                            },
                        ],
                        EnvironmentFiles: [{
                                Type: 's3',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {
                                                Ref: 'AWS::Partition',
                                            },
                                            ':s3:::',
                                            {
                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3Bucket7B2069B7',
                                            },
                                            '/',
                                            {
                                                'Fn::Select': [
                                                    0,
                                                    {
                                                        'Fn::Split': [
                                                            '||',
                                                            {
                                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                'Fn::Select': [
                                                    1,
                                                    {
                                                        'Fn::Split': [
                                                            '||',
                                                            {
                                                                Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    ],
                                },
                            }],
                        Essential: true,
                        ExtraHosts: [
                            {
                                Hostname: 'name',
                                IpAddress: 'dev-db.hostname.pvt',
                            },
                        ],
                        HealthCheck: {
                            Command: [
                                'CMD-SHELL',
                                'curl localhost:8000',
                            ],
                            Interval: 30,
                            Retries: 3,
                            Timeout: 5,
                        },
                        Hostname: 'host.example.com',
                        Image: '/aws/aws-example-app',
                        LinuxParameters: {
                            Capabilities: {},
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'ContainerLogGroupE6FD74A4',
                                },
                                'awslogs-stream-prefix': 'prefix',
                                'awslogs-region': {
                                    Ref: 'AWS::Region',
                                },
                            },
                        },
                        Memory: 1024,
                        MemoryReservation: 512,
                        Name: 'Example Container',
                        Privileged: true,
                        ReadonlyRootFilesystem: true,
                        ResourceRequirements: [
                            {
                                Type: 'GPU',
                                Value: '256',
                            },
                        ],
                        Secrets: [
                            {
                                Name: 'SECRET',
                                ValueFrom: {
                                    Ref: 'SecretA720EF05',
                                },
                            },
                        ],
                        StartTimeout: 2,
                        StopTimeout: 5,
                        SystemControls: [
                            {
                                Namespace: 'SomeNamespace',
                                Value: 'SomeValue',
                            },
                        ],
                        User: 'rootUser',
                        WorkingDirectory: 'a/b/c',
                    },
                ],
            });
        });
        test('throws when MemoryLimit is less than MemoryReservationLimit', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            // THEN
            expect(() => {
                new ecs.ContainerDefinition(stack, 'Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    taskDefinition,
                    memoryLimitMiB: 512,
                    memoryReservationMiB: 1024,
                });
            }).toThrow(/MemoryLimitMiB should not be less than MemoryReservationMiB./);
        });
        describe('With network mode AwsVpc', () => {
            test('throws when Host port is different from container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // THEN
                expect(() => {
                    container.addPortMappings({
                        containerPort: 8080,
                        hostPort: 8081,
                    });
                }).toThrow();
            });
            test('Host port is the same as container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                container.addPortMappings({
                    containerPort: 8080,
                    hostPort: 8080,
                });
                // THEN no exception raised
            });
            test('Host port can be empty ', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8080,
                });
                // THEN no exception raised
            });
        });
        describe('With network mode Host ', () => {
            test('throws when Host port is different from container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // THEN
                expect(() => {
                    container.addPortMappings({
                        containerPort: 8080,
                        hostPort: 8081,
                    });
                }).toThrow();
            });
            test('when host port is the same as container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                container.addPortMappings({
                    containerPort: 8080,
                    hostPort: 8080,
                });
                // THEN no exception raised
            });
            test('Host port can be empty ', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8080,
                });
                // THEN no exception raised
            });
            test('errors when adding links', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                const logger = taskDefinition.addContainer('LoggingContainer', {
                    image: ecs.ContainerImage.fromRegistry('myLogger'),
                    memoryLimitMiB: 1024,
                });
                // THEN
                expect(() => {
                    container.addLink(logger);
                }).toThrow();
            });
            test('service connect fields are not allowed', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                // THEN
                expect(() => {
                    taskDefinition.addContainer('Container', {
                        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                        memoryLimitMiB: 2048,
                        portMappings: [
                            {
                                name: 'api',
                                containerPort: 80,
                            },
                        ],
                    });
                }).toThrow('Service connect related port mapping fields \'name\' and \'appProtocol\' are not supported for network mode host');
            });
        });
        describe('With network mode Bridge', () => {
            test('when Host port is empty ', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                container.addPortMappings({
                    containerPort: 8080,
                });
                // THEN no exception raises
            });
            test('when Host port is not empty ', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                container.addPortMappings({
                    containerPort: 8080,
                    hostPort: 8084,
                });
                // THEN no exception raises
            });
            test('allows adding links', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                const logger = taskDefinition.addContainer('LoggingContainer', {
                    image: ecs.ContainerImage.fromRegistry('myLogger'),
                    memoryLimitMiB: 1024,
                });
                // THEN
                container.addLink(logger);
            });
        });
        describe('With network mode NAT', () => {
            test('produces undefined CF networkMode property', () => {
                // GIVEN
                const stack = new cdk.Stack();
                // WHEN
                new ecs.TaskDefinition(stack, 'TD', {
                    compatibility: ecs.Compatibility.EC2,
                    networkMode: ecs.NetworkMode.NAT,
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                    NetworkMode: assertions_1.Match.absent(),
                });
            });
        });
    });
    describe('Container Port', () => {
        test('should return the first container port in PortMappings', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            const container = taskDefinition.addContainer('Container', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                memoryLimitMiB: 2048,
            });
            // WHEN
            container.addPortMappings({
                containerPort: 8080,
            });
            container.addPortMappings({
                containerPort: 8081,
            });
            const actual = container.containerPort;
            // THEN
            const expected = 8080;
            expect(actual).toEqual(expected);
        });
        test('throws when calling containerPort with no PortMappings', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                networkMode: ecs.NetworkMode.AWS_VPC,
            });
            const container = taskDefinition.addContainer('MyContainer', {
                image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                memoryLimitMiB: 2048,
            });
            // THEN
            expect(() => {
                const actual = container.containerPort;
                const expected = 8080;
                expect(actual).toEqual(expected);
            }).toThrow(/Container MyContainer hasn't defined any ports. Call addPortMappings\(\)./);
        });
    });
    describe('Ingress Port', () => {
        describe('With network mode AwsVpc', () => {
            test('Ingress port should be the same as container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8080,
                });
                const actual = container.ingressPort;
                // THEN
                const expected = 8080;
                expect(actual).toEqual(expected);
            });
            test('throws when calling ingressPort with no PortMappings', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.AWS_VPC,
                });
                const container = taskDefinition.addContainer('MyContainer', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // THEN
                expect(() => {
                    const actual = container.ingressPort;
                    const expected = 8080;
                    expect(actual).toEqual(expected);
                }).toThrow(/Container MyContainer hasn't defined any ports. Call addPortMappings\(\)./);
            });
        });
        describe('With network mode Host ', () => {
            test('Ingress port should be the same as container port', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.HOST,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8080,
                });
                const actual = container.ingressPort;
                // THEN
                const expected = 8080;
                expect(actual).toEqual(expected);
            });
        });
        describe('With network mode Bridge', () => {
            test('Ingress port should be the same as host port if supplied', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8080,
                    hostPort: 8081,
                });
                const actual = container.ingressPort;
                // THEN
                const expected = 8081;
                expect(actual).toEqual(expected);
            });
            test('Ingress port should be 0 if not supplied', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
                    networkMode: ecs.NetworkMode.BRIDGE,
                });
                const container = taskDefinition.addContainer('Container', {
                    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
                    memoryLimitMiB: 2048,
                });
                // WHEN
                container.addPortMappings({
                    containerPort: 8081,
                });
                const actual = container.ingressPort;
                // THEN
                const expected = 0;
                expect(actual).toEqual(expected);
            });
        });
    });
    test('can add environment variables to the container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        const container = taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            environment: {
                TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
            },
        });
        container.addEnvironment('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Environment: [{
                            Name: 'TEST_ENVIRONMENT_VARIABLE',
                            Value: 'test environment variable value',
                        },
                        {
                            Name: 'SECOND_ENVIRONEMENT_VARIABLE',
                            Value: 'second test value',
                        }],
                }),
            ],
        });
    });
    test('can add environment variables to container definition with no environment', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        const container = taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
        });
        container.addEnvironment('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Environment: [{
                            Name: 'SECOND_ENVIRONEMENT_VARIABLE',
                            Value: 'second test value',
                        }],
                }),
            ],
        });
    });
    test('can add port mappings to the container definition by props', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            portMappings: [{ containerPort: 80 }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    PortMappings: [assertions_1.Match.objectLike({ ContainerPort: 80 })],
                }),
            ],
        });
    });
    test('can add port mappings using props and addPortMappings and both are included', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        const containerDefinition = taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            portMappings: [{ containerPort: 80 }],
        });
        containerDefinition.addPortMappings({ containerPort: 443 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    PortMappings: [
                        assertions_1.Match.objectLike({ ContainerPort: 80 }),
                        assertions_1.Match.objectLike({ ContainerPort: 443 }),
                    ],
                }),
            ],
        });
    });
    test('can specify system controls', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            systemControls: [
                { namespace: 'SomeNamespace1', value: 'SomeValue1' },
                { namespace: 'SomeNamespace2', value: 'SomeValue2' },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    SystemControls: [
                        {
                            Namespace: 'SomeNamespace1',
                            Value: 'SomeValue1',
                        },
                        {
                            Namespace: 'SomeNamespace2',
                            Value: 'SomeValue2',
                        },
                    ],
                }),
            ],
        });
    });
    describe('Environment Files', () => {
        describe('with EC2 task definitions', () => {
            test('can add asset environment file to the container definition', () => {
                // GIVEN
                const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
                const stack = new cdk.Stack(app);
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
                // WHEN
                taskDefinition.addContainer('cont', {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    memoryLimitMiB: 1024,
                    environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                    ContainerDefinitions: [
                        assertions_1.Match.objectLike({
                            EnvironmentFiles: [{
                                    Type: 's3',
                                    Value: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':s3:::',
                                                {
                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3Bucket7B2069B7',
                                                },
                                                '/',
                                                {
                                                    'Fn::Select': [
                                                        0,
                                                        {
                                                            'Fn::Split': [
                                                                '||',
                                                                {
                                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    'Fn::Select': [
                                                        1,
                                                        {
                                                            'Fn::Split': [
                                                                '||',
                                                                {
                                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        ],
                                    },
                                }],
                        }),
                    ],
                });
            });
            test('can add s3 bucket environment file to the container definition', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const bucket = new s3.Bucket(stack, 'Bucket', {
                    bucketName: 'test-bucket',
                });
                const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
                // WHEN
                taskDefinition.addContainer('cont', {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    memoryLimitMiB: 1024,
                    environmentFiles: [ecs.EnvironmentFile.fromBucket(bucket, 'test-key')],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                    ContainerDefinitions: [
                        assertions_1.Match.objectLike({
                            EnvironmentFiles: [{
                                    Type: 's3',
                                    Value: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':s3:::',
                                                {
                                                    Ref: 'Bucket83908E77',
                                                },
                                                '/test-key',
                                            ],
                                        ],
                                    },
                                }],
                        }),
                    ],
                });
            });
        });
        describe('with Fargate task definitions', () => {
            test('can add asset environment file to the container definition', () => {
                // GIVEN
                const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
                const stack = new cdk.Stack(app);
                const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
                // WHEN
                taskDefinition.addContainer('cont', {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    memoryLimitMiB: 1024,
                    environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                    ContainerDefinitions: [
                        assertions_1.Match.objectLike({
                            EnvironmentFiles: [{
                                    Type: 's3',
                                    Value: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':s3:::',
                                                {
                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3Bucket7B2069B7',
                                                },
                                                '/',
                                                {
                                                    'Fn::Select': [
                                                        0,
                                                        {
                                                            'Fn::Split': [
                                                                '||',
                                                                {
                                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    'Fn::Select': [
                                                        1,
                                                        {
                                                            'Fn::Split': [
                                                                '||',
                                                                {
                                                                    Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        ],
                                    },
                                }],
                        }),
                    ],
                });
            });
            test('can add s3 bucket environment file to the container definition', () => {
                // GIVEN
                const stack = new cdk.Stack();
                const bucket = new s3.Bucket(stack, 'Bucket', {
                    bucketName: 'test-bucket',
                });
                const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
                // WHEN
                taskDefinition.addContainer('cont', {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    memoryLimitMiB: 1024,
                    environmentFiles: [ecs.EnvironmentFile.fromBucket(bucket, 'test-key')],
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                    ContainerDefinitions: [
                        assertions_1.Match.objectLike({
                            EnvironmentFiles: [{
                                    Type: 's3',
                                    Value: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':s3:::',
                                                {
                                                    Ref: 'Bucket83908E77',
                                                },
                                                '/test-key',
                                            ],
                                        ],
                                    },
                                }],
                        }),
                    ],
                });
            });
        });
    });
    describe('Given GPU count parameter', () => {
        test('will add resource requirements to container definition', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                gpuCount: 4,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        ResourceRequirements: [
                            {
                                Type: 'GPU',
                                Value: '4',
                            },
                        ],
                    }),
                ],
            });
        });
    });
    describe('Given InferenceAccelerator resource parameter', () => {
        test('correctly adds resource requirements to container definition using inference accelerator resource property', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const inferenceAccelerators = [{
                    deviceName: 'device1',
                    deviceType: 'eia2.medium',
                }];
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                inferenceAccelerators,
            });
            const inferenceAcceleratorResources = ['device1'];
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                inferenceAcceleratorResources,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                InferenceAccelerators: [{
                        DeviceName: 'device1',
                        DeviceType: 'eia2.medium',
                    }],
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        ResourceRequirements: [
                            {
                                Type: 'InferenceAccelerator',
                                Value: 'device1',
                            },
                        ],
                    }),
                ],
            });
        });
        test('correctly adds resource requirements to container definition using both props and addInferenceAcceleratorResource method', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const inferenceAccelerators = [{
                    deviceName: 'device1',
                    deviceType: 'eia2.medium',
                }, {
                    deviceName: 'device2',
                    deviceType: 'eia2.large',
                }];
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                inferenceAccelerators,
            });
            const inferenceAcceleratorResources = ['device1'];
            const container = taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                inferenceAcceleratorResources,
            });
            // WHEN
            container.addInferenceAcceleratorResource('device2');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                Family: 'Ec2TaskDef',
                InferenceAccelerators: [{
                        DeviceName: 'device1',
                        DeviceType: 'eia2.medium',
                    }, {
                        DeviceName: 'device2',
                        DeviceType: 'eia2.large',
                    }],
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        ResourceRequirements: [
                            {
                                Type: 'InferenceAccelerator',
                                Value: 'device1',
                            },
                            {
                                Type: 'InferenceAccelerator',
                                Value: 'device2',
                            },
                        ],
                    }),
                ],
            });
        });
        test('throws when the value of inference accelerator resource does not match any inference accelerators defined in the Task Definition', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const inferenceAccelerators = [{
                    deviceName: 'device1',
                    deviceType: 'eia2.medium',
                }];
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
                inferenceAccelerators,
            });
            const inferenceAcceleratorResources = ['device2'];
            // THEN
            expect(() => {
                taskDefinition.addContainer('cont', {
                    image: ecs.ContainerImage.fromRegistry('test'),
                    memoryLimitMiB: 1024,
                    inferenceAcceleratorResources,
                });
            }).toThrow(/Resource value device2 in container definition doesn't match any inference accelerator device name in the task definition./);
        });
    });
    test('adds resource requirements when both inference accelerator and gpu count are defined in the container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const inferenceAccelerators = [{
                deviceName: 'device1',
                deviceType: 'eia2.medium',
            }];
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
            inferenceAccelerators,
        });
        const inferenceAcceleratorResources = ['device1'];
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            gpuCount: 2,
            inferenceAcceleratorResources,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            Family: 'Ec2TaskDef',
            InferenceAccelerators: [{
                    DeviceName: 'device1',
                    DeviceType: 'eia2.medium',
                }],
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Image: 'test',
                    ResourceRequirements: [{
                            Type: 'InferenceAccelerator',
                            Value: 'device1',
                        }, {
                            Type: 'GPU',
                            Value: '2',
                        }],
                }),
            ],
        });
    });
    test('can add secret environment variables to the container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
            parameterName: '/name',
            version: 1,
        });
        // WHEN
        const container = taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            secrets: {
                SECRET: ecs.Secret.fromSecretsManager(secret),
                PARAMETER: ecs.Secret.fromSsmParameter(parameter),
                SECRET_ID: ecs.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }),
                SECRET_STAGE: ecs.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }),
            },
        });
        container.addSecret('LATER_SECRET', ecs.Secret.fromSecretsManager(secret, 'field'));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Secrets: [
                        {
                            Name: 'SECRET',
                            ValueFrom: {
                                Ref: 'SecretA720EF05',
                            },
                        },
                        {
                            Name: 'PARAMETER',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {
                                            Ref: 'AWS::Partition',
                                        },
                                        ':ssm:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':parameter/name',
                                    ],
                                ],
                            },
                        },
                        {
                            Name: 'SECRET_ID',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':::version-id',
                                    ],
                                ],
                            },
                        },
                        {
                            Name: 'SECRET_STAGE',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        '::version-stage:',
                                    ],
                                ],
                            },
                        },
                        {
                            Name: 'LATER_SECRET',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':field::',
                                    ],
                                ],
                            },
                        },
                    ],
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'secretsmanager:GetSecretValue',
                            'secretsmanager:DescribeSecret',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'SecretA720EF05',
                        },
                    },
                    {
                        Action: [
                            'ssm:DescribeParameters',
                            'ssm:GetParameters',
                            'ssm:GetParameter',
                            'ssm:GetParameterHistory',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':ssm:',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    ':',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':parameter/name',
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('use a specific secret JSON key as environment variable', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            secrets: {
                SECRET_KEY: ecs.Secret.fromSecretsManager(secret, 'specificKey'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Secrets: [
                        {
                            Name: 'SECRET_KEY',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':specificKey::',
                                    ],
                                ],
                            },
                        },
                    ],
                }),
            ],
        });
    });
    test('use a specific secret JSON field as environment variable for a Fargate task', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            secrets: {
                SECRET_KEY: ecs.Secret.fromSecretsManager(secret, 'specificKey'),
                SECRET_KEY_ID: ecs.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }, 'specificKey'),
                SECRET_KEY_STAGE: ecs.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }, 'specificKey'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Secrets: [
                        {
                            Name: 'SECRET_KEY',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':specificKey::',
                                    ],
                                ],
                            },
                        },
                        {
                            Name: 'SECRET_KEY_ID',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':specificKey::version-id',
                                    ],
                                ],
                            },
                        },
                        {
                            Name: 'SECRET_KEY_STAGE',
                            ValueFrom: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'SecretA720EF05',
                                        },
                                        ':specificKey:version-stage:',
                                    ],
                                ],
                            },
                        },
                    ],
                }),
            ],
        });
    });
    test('can add AWS logging to container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    LogConfiguration: {
                        LogDriver: 'awslogs',
                        Options: {
                            'awslogs-group': { Ref: 'TaskDefcontLogGroup4E10DCBF' },
                            'awslogs-stream-prefix': 'prefix',
                            'awslogs-region': { Ref: 'AWS::Region' },
                        },
                    },
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['TaskDefcontLogGroup4E10DCBF', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can set Health Check with defaults', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const hcCommand = 'curl localhost:8000';
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: [hcCommand],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    HealthCheck: {
                        Command: ['CMD-SHELL', hcCommand],
                        Interval: 30,
                        Retries: 3,
                        Timeout: 5,
                    },
                }),
            ],
        });
    });
    test('throws when setting Health Check with no commands', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: [],
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: [],
                            Interval: 30,
                            Retries: 3,
                            Timeout: 5,
                        },
                    },
                ],
            });
        }).toThrow(/At least one argument must be supplied for health check command./);
    });
    test('throws when setting Health Check with invalid interval because of too short', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', 'curl localhost:8000'],
                interval: core_1.Duration.seconds(4),
                timeout: core_1.Duration.seconds(30),
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: ['CMD-SHELL', 'curl localhost:8000'],
                            Interval: 4,
                        },
                    },
                ],
            });
        }).toThrow(/Interval must be between 5 seconds and 300 seconds./);
    });
    test('throws when setting Health Check with invalid interval because of too long', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', 'curl localhost:8000'],
                interval: core_1.Duration.seconds(301),
                timeout: core_1.Duration.seconds(30),
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: ['CMD-SHELL', 'curl localhost:8000'],
                            Interval: 4,
                        },
                    },
                ],
            });
        }).toThrow(/Interval must be between 5 seconds and 300 seconds./);
    });
    test('throws when setting Health Check with invalid timeout because of too short', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', 'curl localhost:8000'],
                interval: core_1.Duration.seconds(40),
                timeout: core_1.Duration.seconds(1),
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: ['CMD-SHELL', 'curl localhost:8000'],
                            Interval: 4,
                        },
                    },
                ],
            });
        }).toThrow(/Timeout must be between 2 seconds and 120 seconds./);
    });
    test('throws when setting Health Check with invalid timeout because of too long', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', 'curl localhost:8000'],
                interval: core_1.Duration.seconds(150),
                timeout: core_1.Duration.seconds(130),
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: ['CMD-SHELL', 'curl localhost:8000'],
                            Interval: 4,
                        },
                    },
                ],
            });
        }).toThrow(/Timeout must be between 2 seconds and 120 seconds./);
    });
    test('throws when setting Health Check with invalid interval and timeout because timeout is longer than interval', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', 'curl localhost:8000'],
                interval: core_1.Duration.seconds(10),
                timeout: core_1.Duration.seconds(30),
            },
        });
        // THEN
        expect(() => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    {
                        HealthCheck: {
                            Command: ['CMD-SHELL', 'curl localhost:8000'],
                            Interval: 4,
                        },
                    },
                ],
            });
        }).toThrow(/Health check interval should be longer than timeout./);
    });
    test('can specify Health Check values in shell form', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const hcCommand = 'curl localhost:8000';
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: [hcCommand],
                interval: cdk.Duration.seconds(20),
                retries: 5,
                startPeriod: cdk.Duration.seconds(10),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    HealthCheck: {
                        Command: ['CMD-SHELL', hcCommand],
                        Interval: 20,
                        Retries: 5,
                        Timeout: 5,
                        StartPeriod: 10,
                    },
                }),
            ],
        });
    });
    test('can specify Health Check values in array form starting with CMD-SHELL', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const hcCommand = 'curl localhost:8000';
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD-SHELL', hcCommand],
                interval: cdk.Duration.seconds(20),
                retries: 5,
                startPeriod: cdk.Duration.seconds(10),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    HealthCheck: {
                        Command: ['CMD-SHELL', hcCommand],
                        Interval: 20,
                        Retries: 5,
                        Timeout: 5,
                        StartPeriod: 10,
                    },
                }),
            ],
        });
    });
    test('can specify Health Check values in array form starting with CMD', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const hcCommand = 'curl localhost:8000';
        // WHEN
        taskDefinition.addContainer('cont', {
            image: ecs.ContainerImage.fromRegistry('test'),
            memoryLimitMiB: 1024,
            healthCheck: {
                command: ['CMD', hcCommand],
                interval: cdk.Duration.seconds(20),
                retries: 5,
                startPeriod: cdk.Duration.seconds(10),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    HealthCheck: {
                        Command: ['CMD', hcCommand],
                        Interval: 20,
                        Retries: 5,
                        Timeout: 5,
                        StartPeriod: 10,
                    },
                }),
            ],
        });
    });
    test('can specify private registry credentials', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
        const mySecretArn = 'arn:aws:secretsmanager:region:1234567890:secret:MyRepoSecret-6f8hj3';
        const repoCreds = secretsmanager.Secret.fromSecretCompleteArn(stack, 'MyRepoSecret', mySecretArn);
        // WHEN
        taskDefinition.addContainer('Container', {
            image: ecs.ContainerImage.fromRegistry('user-x/my-app', {
                credentials: repoCreds,
            }),
            memoryLimitMiB: 2048,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
            ContainerDefinitions: [
                assertions_1.Match.objectLike({
                    Image: 'user-x/my-app',
                    RepositoryCredentials: {
                        CredentialsParameter: mySecretArn,
                    },
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'secretsmanager:GetSecretValue',
                            'secretsmanager:DescribeSecret',
                        ],
                        Effect: 'Allow',
                        Resource: mySecretArn,
                    },
                ],
            },
        });
    });
    describe('_linkContainer works properly', () => {
        test('when the props passed in is an essential container', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            // WHEN
            const container = taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                essential: true,
            });
            // THEN
            expect(taskDefinition.defaultContainer).toEqual(container);
        });
        test('when the props passed in is not an essential container', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                essential: false,
            });
            // THEN
            expect(taskDefinition.defaultContainer).toEqual(undefined);
        });
    });
    describe('Can specify linux parameters', () => {
        test('validation throws with out of range params', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const swappinessValues = [-1, 30.5, 101];
            swappinessValues.forEach(swappiness => expect(() => new ecs.LinuxParameters(stack, `LinuxParametersWithSwappiness(${swappiness})`, { swappiness }))
                .toThrowError(`swappiness: Must be an integer between 0 and 100; received ${swappiness}.`));
        });
        test('with only required properties set, it correctly sets default properties', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters');
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                linuxParameters,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        LinuxParameters: {
                            Capabilities: {},
                        },
                    }),
                ],
            });
        });
        test('before calling addContainer', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
                initProcessEnabled: true,
                sharedMemorySize: 1024,
                maxSwap: cdk.Size.gibibytes(5),
                swappiness: 90,
            });
            linuxParameters.addCapabilities(ecs.Capability.ALL);
            linuxParameters.dropCapabilities(ecs.Capability.KILL);
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                linuxParameters,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        LinuxParameters: {
                            Capabilities: {
                                Add: ['ALL'],
                                Drop: ['KILL'],
                            },
                            InitProcessEnabled: true,
                            MaxSwap: 5 * 1024,
                            SharedMemorySize: 1024,
                            Swappiness: 90,
                        },
                    }),
                ],
            });
        });
        test('after calling addContainer', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
                initProcessEnabled: true,
                sharedMemorySize: 1024,
                maxSwap: cdk.Size.gibibytes(5),
                swappiness: 90,
            });
            linuxParameters.addCapabilities(ecs.Capability.ALL);
            // WHEN
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                linuxParameters,
            });
            // Mutate linuxParameter after added to a container
            linuxParameters.dropCapabilities(ecs.Capability.SETUID);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        LinuxParameters: {
                            Capabilities: {
                                Add: ['ALL'],
                                Drop: ['SETUID'],
                            },
                            InitProcessEnabled: true,
                            MaxSwap: 5 * 1024,
                            SharedMemorySize: 1024,
                            Swappiness: 90,
                        },
                    }),
                ],
            });
        });
        test('with one or more host devices', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
                initProcessEnabled: true,
                sharedMemorySize: 1024,
                maxSwap: cdk.Size.gibibytes(5),
                swappiness: 90,
            });
            // WHEN
            linuxParameters.addDevices({
                hostPath: 'a/b/c',
            });
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                linuxParameters,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        LinuxParameters: {
                            Devices: [
                                {
                                    HostPath: 'a/b/c',
                                },
                            ],
                            InitProcessEnabled: true,
                            MaxSwap: 5 * 1024,
                            SharedMemorySize: 1024,
                            Swappiness: 90,
                        },
                    }),
                ],
            });
        });
        test('with the tmpfs mount for a container', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
            const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
                initProcessEnabled: true,
                sharedMemorySize: 1024,
                maxSwap: cdk.Size.gibibytes(5),
                swappiness: 90,
            });
            // WHEN
            linuxParameters.addTmpfs({
                containerPath: 'a/b/c',
                size: 1024,
            });
            taskDefinition.addContainer('cont', {
                image: ecs.ContainerImage.fromRegistry('test'),
                memoryLimitMiB: 1024,
                linuxParameters,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
                ContainerDefinitions: [
                    assertions_1.Match.objectLike({
                        Image: 'test',
                        LinuxParameters: {
                            Tmpfs: [
                                {
                                    ContainerPath: 'a/b/c',
                                    Size: 1024,
                                },
                            ],
                            InitProcessEnabled: true,
                            MaxSwap: 5 * 1024,
                            SharedMemorySize: 1024,
                            Swappiness: 90,
                        },
                    }),
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWRlZmluaXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRhaW5lci1kZWZpbml0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQXNEO0FBQ3RELHNDQUFzQztBQUN0Qyw4REFBOEQ7QUFDOUQsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyx3Q0FBeUM7QUFDekMseUNBQXlDO0FBQ3pDLDhCQUE4QjtBQUM5QixnQ0FBcUM7QUFFckMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtJQUNwQyxRQUFRLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVuRSxJQUFJLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO2dCQUM5QyxLQUFLLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUM7Z0JBQzlELGNBQWM7Z0JBQ2QsY0FBYyxFQUFFLElBQUk7YUFDckIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO2dCQUMxRSxvQkFBb0IsRUFBRTtvQkFDcEI7d0JBQ0UsU0FBUyxFQUFFLElBQUk7d0JBQ2YsS0FBSyxFQUFFLHNCQUFzQjt3QkFDN0IsTUFBTSxFQUFFLElBQUk7d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ2xCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxD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Q0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgZWNzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBcHBQcm90b2NvbCB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdjb250YWluZXIgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1doZW4gY3JlYXRpbmcgYSBUYXNrIERlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnYWRkIGEgY29udGFpbmVyIHVzaW5nIGRlZmF1bHQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgIG5ldyBlY3MuQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIEltYWdlOiAnL2F3cy9hd3MtZXhhbXBsZS1hcHAnLFxuICAgICAgICAgICAgTWVtb3J5OiAyMDQ4LFxuICAgICAgICAgICAgTmFtZTogJ0NvbnRhaW5lcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1BvcnRNYXAgdmFsaWRhdGVzJywgKCkgPT4ge1xuICAgICAgdGVzdCgndGhyb3dzIHdoZW4gUG9ydE1hcHBpbmcubmFtZSBpcyBlbXB0eSBzdHJpbmcuJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBwb3J0TWFwcGluZzogZWNzLlBvcnRNYXBwaW5nID0ge1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgbmFtZTogJycsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5ldHdvcmttb2RlID0gZWNzLk5ldHdvcmtNb2RlLkFXU19WUEM7XG4gICAgICAgIGNvbnN0IHBvcnRNYXAgPSBuZXcgZWNzLlBvcnRNYXAobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIHBvcnRNYXAudmFsaWRhdGUoKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdDb250YWluZXJQb3J0IHNob3VsZCBub3QgZXFhdWwgSG9zdHBvcnQnLCAoKSA9PiB7XG4gICAgICAgIHRlc3QoJ3doZW4gQVdTX1ZQQyBOZXR3b3JrbW9kZScsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHBvcnRNYXBwaW5nOiBlY3MuUG9ydE1hcHBpbmcgPSB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICAgICAgaG9zdFBvcnQ6IDgwODEsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrbW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDO1xuICAgICAgICAgIGNvbnN0IHBvcnRNYXAgPSBuZXcgZWNzLlBvcnRNYXAobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgIHBvcnRNYXAudmFsaWRhdGUoKTtcbiAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3doZW4gSG9zdCBOZXR3b3JrbW9kZScsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHBvcnRNYXBwaW5nOiBlY3MuUG9ydE1hcHBpbmcgPSB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICAgICAgaG9zdFBvcnQ6IDgwODEsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrbW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5IT1NUO1xuICAgICAgICAgIGNvbnN0IHBvcnRNYXAgPSBuZXcgZWNzLlBvcnRNYXAobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgIHBvcnRNYXAudmFsaWRhdGUoKTtcbiAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdDb250YWluZXJQb3J0IGNhbiBlcXVhbCBIb3N0UG9ydCBjYXNlcycsICgpID0+IHtcbiAgICAgICAgdGVzdCgnd2hlbiBCcmlkZ2UgTmV0d29ya21vZGUnLCAoKSA9PiB7XG4gICAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgICBjb25zdCBwb3J0TWFwcGluZzogZWNzLlBvcnRNYXBwaW5nID0ge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgICAgIGhvc3RQb3J0OiA4MDgwLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgbmV0d29ya21vZGUgPSBlY3MuTmV0d29ya01vZGUuQlJJREdFO1xuICAgICAgICAgIGNvbnN0IHBvcnRNYXAgPSBuZXcgZWNzLlBvcnRNYXAobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgIHBvcnRNYXAudmFsaWRhdGUoKTtcbiAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdTZXJ2aWNlQ29ubmVjdCBjbGFzcycsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCdpc1NlcnZpY2VDb25uZWN0JywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCdyZXR1cm4gdHJ1ZSBpZiBwYXJhbXMgaGFzIHBvcnRuYW1lJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcG9ydE1hcHBpbmc6IGVjcy5Qb3J0TWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrbW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDO1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2VDb25uZWN0ID0gbmV3IGVjcy5TZXJ2aWNlQ29ubmVjdChuZXR3b3JrbW9kZSwgcG9ydE1hcHBpbmcpO1xuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBleHBlY3Qoc2VydmljZUNvbm5lY3QuaXNTZXJ2aWNlQ29ubmVjdCgpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KCdyZXR1cm4gdHJ1ZSBpZiBwYXJhbXMgaGFzIGFwcFByb3RvY29sJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcG9ydE1hcHBpbmc6IGVjcy5Qb3J0TWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBhcHBQcm90b2NvbDogZWNzLkFwcFByb3RvY29sLmh0dHAyLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgbmV0d29ya21vZGUgPSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQztcbiAgICAgICAgICBjb25zdCBzZXJ2aWNlQ29ubmVjdCA9IG5ldyBlY3MuU2VydmljZUNvbm5lY3QobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KHNlcnZpY2VDb25uZWN0LmlzU2VydmljZUNvbm5lY3QoKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgncmV0dXJuIGZhbHNlIGlmIHBhcmFtcyBoYXMgbm90IGFwcFByb3RvY2wgYW5kIHBvcnROYW1lICcsICgpID0+IHtcbiAgICAgICAgICAvLyBHSVZFTlxuICAgICAgICAgIGNvbnN0IHBvcnRNYXBwaW5nOiBlY3MuUG9ydE1hcHBpbmcgPSB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgbmV0d29ya21vZGUgPSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQztcbiAgICAgICAgICBjb25zdCBzZXJ2aWNlQ29ubmVjdCA9IG5ldyBlY3MuU2VydmljZUNvbm5lY3QobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KHNlcnZpY2VDb25uZWN0LmlzU2VydmljZUNvbm5lY3QoKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3ZhbGlkYXRlJywgKCkgPT4ge1xuICAgICAgICB0ZXN0KCd0aHJvdyBpZiBIb3N0IE5ldHdvcmttb2RlJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcG9ydE1hcHBpbmc6IGVjcy5Qb3J0TWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrbW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5IT1NUO1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2VDb25uZWN0ID0gbmV3IGVjcy5TZXJ2aWNlQ29ubmVjdChuZXR3b3JrbW9kZSwgcG9ydE1hcHBpbmcpO1xuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgICAgc2VydmljZUNvbm5lY3QudmFsaWRhdGUoKTtcbiAgICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3Rocm93IGlmIGhhcyBub3QgcG9ydG1hcCBuYW1lJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcG9ydE1hcHBpbmc6IGVjcy5Qb3J0TWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBhcHBQcm90b2NvbDogZWNzLkFwcFByb3RvY29sLmh0dHAyLFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgbmV0d29ya21vZGUgPSBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQztcbiAgICAgICAgICBjb25zdCBzZXJ2aWNlQ29ubmVjdCA9IG5ldyBlY3MuU2VydmljZUNvbm5lY3QobmV0d29ya21vZGUsIHBvcnRNYXBwaW5nKTtcbiAgICAgICAgICAvLyBUSEVOXG4gICAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICAgIHNlcnZpY2VDb25uZWN0LnZhbGlkYXRlKCk7XG4gICAgICAgICAgfSkudG9UaHJvdygnU2VydmljZSBjb25uZWN0LXJlbGF0ZWQgcG9ydCBtYXBwaW5nIGZpZWxkIFxcJ2FwcFByb3RvY29sXFwnIGNhbm5vdCBiZSBzZXQgd2l0aG91dCBcXCduYW1lXFwnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3Nob3VsZCBub3QgdGhyb3cgaWYgQVdTX1ZQQyBOZXR3b3JrTW9kZSBhbmQgaGFzIHBvcnRuYW1lJywgKCkgPT4ge1xuICAgICAgICAgIC8vIEdJVkVOXG4gICAgICAgICAgY29uc3QgcG9ydE1hcHBpbmc6IGVjcy5Qb3J0TWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBuYW1lOiAndGVzdCcsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBuZXR3b3JrbW9kZSA9IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDO1xuICAgICAgICAgIGNvbnN0IHNlcnZpY2VDb25uZWN0ID0gbmV3IGVjcy5TZXJ2aWNlQ29ubmVjdChuZXR3b3JrbW9kZSwgcG9ydE1hcHBpbmcpO1xuICAgICAgICAgIC8vIFRIRU5cbiAgICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgICAgc2VydmljZUNvbm5lY3QudmFsaWRhdGUoKTtcbiAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3BvcnQgbWFwcGluZyB0aHJvd3MgYW4gZXJyb3Igd2hlbiBhcHBQcm90b2NvbCBpcyBzZXQgd2l0aG91dCBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSBuZXcgZWNzLkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIHBvcnRNYXBwaW5nczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgbmFtZTogJ2FwaScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBleHBlY3RlZCA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgIGhvc3RQb3J0OiAwLFxuICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICAgIGV4cGVjdChjb250YWluZXIucG9ydE1hcHBpbmdzKS50b0VxdWFsKGV4cGVjdGVkKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyhcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiA0NDMsXG4gICAgICAgICAgICBhcHBQcm90b2NvbDogQXBwUHJvdG9jb2wuZ3JwYyxcbiAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgfSkudG9UaHJvdygvU2VydmljZSBjb25uZWN0LXJlbGF0ZWQgcG9ydCBtYXBwaW5nIGZpZWxkICdhcHBQcm90b2NvbCcgY2Fubm90IGJlIHNldCB3aXRob3V0ICduYW1lJy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbXVsdGlwbGUgcG9ydCBtYXBwaW5ncyBvZiB0aGUgc2FtZSBuYW1lIGVycm9yIG91dCcsICgpID0+e1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gbmV3IGVjcy5Db250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnQ29udGFpbmVyJywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3MoXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAgICAgICAgICBuYW1lOiAnYXBpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDQ0MyxcbiAgICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgICB9KS50b1Rocm93KC9Qb3J0IG1hcHBpbmcgbmFtZSAnYXBpJyBhbHJlYWR5IGV4aXN0cyBvbiB0aGlzIGNvbnRhaW5lci8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZW1wdHkgc3RyaW5nIHBvcnQgbWFwcGluZyBuYW1lIHRocm93cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBlY3MuQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZCBhIGNvbnRhaW5lciB1c2luZyBhbGwgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG4gICAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgICBuZXcgZWNzLkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdDb250YWluZXInLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbixcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uTWlCOiA1MTIsXG4gICAgICAgIGNvbnRhaW5lck5hbWU6ICdFeGFtcGxlIENvbnRhaW5lcicsXG4gICAgICAgIGNvbW1hbmQ6IFsnQ01ELVNIRUxMJ10sXG4gICAgICAgIGNwdTogMTI4LFxuICAgICAgICBkaXNhYmxlTmV0d29ya2luZzogdHJ1ZSxcbiAgICAgICAgZG5zU2VhcmNoRG9tYWluczogWydleGFtcGxlLmNvbSddLFxuICAgICAgICBkbnNTZXJ2ZXJzOiBbJ2hvc3QuY29tJ10sXG4gICAgICAgIGRvY2tlckxhYmVsczoge1xuICAgICAgICAgIGtleTogJ2Zvb0xhYmVsJyxcbiAgICAgICAgICB2YWx1ZTogJ2JhckxhYmVsJyxcbiAgICAgICAgfSxcbiAgICAgICAgZG9ja2VyU2VjdXJpdHlPcHRpb25zOiBbJ0VDU19TRUxJTlVYX0NBUEFCTEU9dHJ1ZSddLFxuICAgICAgICBlbnRyeVBvaW50OiBbJ3RvcCcsICctYiddLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGtleTogJ2ZvbycsXG4gICAgICAgICAgdmFsdWU6ICdiYXInLFxuICAgICAgICB9LFxuICAgICAgICBlbnZpcm9ubWVudEZpbGVzOiBbZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8tZW52ZmlsZXMvdGVzdC1lbnZmaWxlLmVudicpKV0sXG4gICAgICAgIGVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgZXh0cmFIb3N0czoge1xuICAgICAgICAgIG5hbWU6ICdkZXYtZGIuaG9zdG5hbWUucHZ0JyxcbiAgICAgICAgfSxcbiAgICAgICAgZ3B1Q291bnQ6IDI1NixcbiAgICAgICAgaG9zdG5hbWU6ICdob3N0LmV4YW1wbGUuY29tJyxcbiAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgICAgcmVhZG9ubHlSb290RmlsZXN5c3RlbTogdHJ1ZSxcbiAgICAgICAgc3RhcnRUaW1lb3V0OiBjZGsuRHVyYXRpb24ubWlsbGlzKDIwMDApLFxuICAgICAgICBzdG9wVGltZW91dDogY2RrLkR1cmF0aW9uLm1pbGxpcyg1MDAwKSxcbiAgICAgICAgdXNlcjogJ3Jvb3RVc2VyJyxcbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogJ2EvYi9jJyxcbiAgICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICBjb21tYW5kOiBbJ2N1cmwgbG9jYWxob3N0OjgwMDAnXSxcbiAgICAgICAgfSxcbiAgICAgICAgbGludXhQYXJhbWV0ZXJzOiBuZXcgZWNzLkxpbnV4UGFyYW1ldGVycyhzdGFjaywgJ0xpbnV4UGFyYW1ldGVycycpLFxuICAgICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ3ByZWZpeCcgfSksXG4gICAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgICBTRUNSRVQ6IGVjcy5TZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyKHNlY3JldCksXG4gICAgICAgIH0sXG4gICAgICAgIHN5c3RlbUNvbnRyb2xzOiBbXG4gICAgICAgICAgeyBuYW1lc3BhY2U6ICdTb21lTmFtZXNwYWNlJywgdmFsdWU6ICdTb21lVmFsdWUnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBDb21tYW5kOiBbXG4gICAgICAgICAgICAgICdDTUQtU0hFTEwnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIENwdTogMTI4LFxuICAgICAgICAgICAgRGlzYWJsZU5ldHdvcmtpbmc6IHRydWUsXG4gICAgICAgICAgICBEbnNTZWFyY2hEb21haW5zOiBbXG4gICAgICAgICAgICAgICdleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRG5zU2VydmVyczogW1xuICAgICAgICAgICAgICAnaG9zdC5jb20nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIERvY2tlckxhYmVsczoge1xuICAgICAgICAgICAgICBrZXk6ICdmb29MYWJlbCcsXG4gICAgICAgICAgICAgIHZhbHVlOiAnYmFyTGFiZWwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERvY2tlclNlY3VyaXR5T3B0aW9uczogW1xuICAgICAgICAgICAgICAnRUNTX1NFTElOVVhfQ0FQQUJMRT10cnVlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFbnRyeVBvaW50OiBbXG4gICAgICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICAgICAnLWInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVudmlyb25tZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAna2V5JyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ2ZvbycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnYmFyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFbnZpcm9ubWVudEZpbGVzOiBbe1xuICAgICAgICAgICAgICBUeXBlOiAnczMnLFxuICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzODcyNTYxYmYwNzhlZGQxNjg1ZDUwYzlmZjgyMWNkZDYwZDJiMmRkZmIwMDEzYzQwODdlNzliZjJiYjUwNzI0ZFMzQnVja2V0N0IyMDY5QjcnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIEVzc2VudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgIEV4dHJhSG9zdHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEhvc3RuYW1lOiAnbmFtZScsXG4gICAgICAgICAgICAgICAgSXBBZGRyZXNzOiAnZGV2LWRiLmhvc3RuYW1lLnB2dCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgICAgQ29tbWFuZDogW1xuICAgICAgICAgICAgICAgICdDTUQtU0hFTEwnLFxuICAgICAgICAgICAgICAgICdjdXJsIGxvY2FsaG9zdDo4MDAwJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgSW50ZXJ2YWw6IDMwLFxuICAgICAgICAgICAgICBSZXRyaWVzOiAzLFxuICAgICAgICAgICAgICBUaW1lb3V0OiA1LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEhvc3RuYW1lOiAnaG9zdC5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBJbWFnZTogJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyxcbiAgICAgICAgICAgIExpbnV4UGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBDYXBhYmlsaXRpZXM6IHt9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgTG9nRHJpdmVyOiAnYXdzbG9ncycsXG4gICAgICAgICAgICAgIE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0NvbnRhaW5lckxvZ0dyb3VwRTZGRDc0QTQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2F3c2xvZ3Mtc3RyZWFtLXByZWZpeCc6ICdwcmVmaXgnLFxuICAgICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1lbW9yeTogMTAyNCxcbiAgICAgICAgICAgIE1lbW9yeVJlc2VydmF0aW9uOiA1MTIsXG4gICAgICAgICAgICBOYW1lOiAnRXhhbXBsZSBDb250YWluZXInLFxuICAgICAgICAgICAgUHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgICAgICAgIFJlYWRvbmx5Um9vdEZpbGVzeXN0ZW06IHRydWUsXG4gICAgICAgICAgICBSZXNvdXJjZVJlcXVpcmVtZW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0dQVScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICcyNTYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFNlY3JldHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE5hbWU6ICdTRUNSRVQnLFxuICAgICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU3RhcnRUaW1lb3V0OiAyLFxuICAgICAgICAgICAgU3RvcFRpbWVvdXQ6IDUsXG4gICAgICAgICAgICBTeXN0ZW1Db250cm9sczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnU29tZU5hbWVzcGFjZScsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdTb21lVmFsdWUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFVzZXI6ICdyb290VXNlcicsXG4gICAgICAgICAgICBXb3JraW5nRGlyZWN0b3J5OiAnYS9iL2MnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIE1lbW9yeUxpbWl0IGlzIGxlc3MgdGhhbiBNZW1vcnlSZXNlcnZhdGlvbkxpbWl0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgZWNzLkNvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgdGFza0RlZmluaXRpb24sXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDUxMixcbiAgICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbk1pQjogMTAyNCxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9NZW1vcnlMaW1pdE1pQiBzaG91bGQgbm90IGJlIGxlc3MgdGhhbiBNZW1vcnlSZXNlcnZhdGlvbk1pQi4vKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaXRoIG5ldHdvcmsgbW9kZSBBd3NWcGMnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBIb3N0IHBvcnQgaXMgZGlmZmVyZW50IGZyb20gY29udGFpbmVyIHBvcnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgICBob3N0UG9ydDogODA4MSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ0hvc3QgcG9ydCBpcyB0aGUgc2FtZSBhcyBjb250YWluZXIgcG9ydCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgICBob3N0UG9ydDogODA4MCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTiBubyBleGNlcHRpb24gcmFpc2VkXG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnSG9zdCBwb3J0IGNhbiBiZSBlbXB0eSAnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTiBubyBleGNlcHRpb24gcmFpc2VkXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaXRoIG5ldHdvcmsgbW9kZSBIb3N0ICcsICgpID0+IHtcbiAgICAgIHRlc3QoJ3Rocm93cyB3aGVuIEhvc3QgcG9ydCBpcyBkaWZmZXJlbnQgZnJvbSBjb250YWluZXIgcG9ydCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5IT1NULFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgICAgIGhvc3RQb3J0OiA4MDgxLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnd2hlbiBob3N0IHBvcnQgaXMgdGhlIHNhbWUgYXMgY29udGFpbmVyIHBvcnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuSE9TVCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgaG9zdFBvcnQ6IDgwODAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU4gbm8gZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ0hvc3QgcG9ydCBjYW4gYmUgZW1wdHkgJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU4gbm8gZXhjZXB0aW9uIHJhaXNlZFxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2Vycm9ycyB3aGVuIGFkZGluZyBsaW5rcycsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5IT1NULFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbG9nZ2VyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdMb2dnaW5nQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdteUxvZ2dlcicpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgY29udGFpbmVyLmFkZExpbmsobG9nZ2VyKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ3NlcnZpY2UgY29ubmVjdCBmaWVsZHMgYXJlIG5vdCBhbGxvd2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkhPU1QsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgICAgICBwb3J0TWFwcGluZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkudG9UaHJvdygnU2VydmljZSBjb25uZWN0IHJlbGF0ZWQgcG9ydCBtYXBwaW5nIGZpZWxkcyBcXCduYW1lXFwnIGFuZCBcXCdhcHBQcm90b2NvbFxcJyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgbmV0d29yayBtb2RlIGhvc3QnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ1dpdGggbmV0d29yayBtb2RlIEJyaWRnZScsICgpID0+IHtcbiAgICAgIHRlc3QoJ3doZW4gSG9zdCBwb3J0IGlzIGVtcHR5ICcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOIG5vIGV4Y2VwdGlvbiByYWlzZXNcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCd3aGVuIEhvc3QgcG9ydCBpcyBub3QgZW1wdHkgJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicsIHtcbiAgICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkJSSURHRSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODAsXG4gICAgICAgICAgaG9zdFBvcnQ6IDgwODQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU4gbm8gZXhjZXB0aW9uIHJhaXNlc1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2FsbG93cyBhZGRpbmcgbGlua3MnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbG9nZ2VyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdMb2dnaW5nQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdteUxvZ2dlcicpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnRhaW5lci5hZGRMaW5rKGxvZ2dlcik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaXRoIG5ldHdvcmsgbW9kZSBOQVQnLCAoKSA9PiB7XG4gICAgICB0ZXN0KCdwcm9kdWNlcyB1bmRlZmluZWQgQ0YgbmV0d29ya01vZGUgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgbmV3IGVjcy5UYXNrRGVmaW5pdGlvbihzdGFjaywgJ1REJywge1xuICAgICAgICAgIGNvbXBhdGliaWxpdHk6IGVjcy5Db21wYXRpYmlsaXR5LkVDMixcbiAgICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLk5BVCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICAgIE5ldHdvcmtNb2RlOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0NvbnRhaW5lciBQb3J0JywgKCkgPT4ge1xuICAgIHRlc3QoJ3Nob3VsZCByZXR1cm4gdGhlIGZpcnN0IGNvbnRhaW5lciBwb3J0IGluIFBvcnRNYXBwaW5ncycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICBjb250YWluZXJQb3J0OiA4MDgxLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBhY3R1YWwgPSBjb250YWluZXIuY29udGFpbmVyUG9ydDtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSA4MDgwO1xuICAgICAgZXhwZWN0KGFjdHVhbCkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3Mgd2hlbiBjYWxsaW5nIGNvbnRhaW5lclBvcnQgd2l0aCBubyBQb3J0TWFwcGluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICBuZXR3b3JrTW9kZTogZWNzLk5ldHdvcmtNb2RlLkFXU19WUEMsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdNeUNvbnRhaW5lcicsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IGNvbnRhaW5lci5jb250YWluZXJQb3J0O1xuICAgICAgICBjb25zdCBleHBlY3RlZCA9IDgwODA7XG4gICAgICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSkudG9UaHJvdygvQ29udGFpbmVyIE15Q29udGFpbmVyIGhhc24ndCBkZWZpbmVkIGFueSBwb3J0cy4gQ2FsbCBhZGRQb3J0TWFwcGluZ3NcXChcXCkuLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdJbmdyZXNzIFBvcnQnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ1dpdGggbmV0d29yayBtb2RlIEF3c1ZwYycsICgpID0+IHtcbiAgICAgIHRlc3QoJ0luZ3Jlc3MgcG9ydCBzaG91bGQgYmUgdGhlIHNhbWUgYXMgY29udGFpbmVyIHBvcnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IGNvbnRhaW5lci5pbmdyZXNzUG9ydDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkID0gODA4MDtcbiAgICAgICAgZXhwZWN0KGFjdHVhbCkudG9FcXVhbChleHBlY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgndGhyb3dzIHdoZW4gY2FsbGluZyBpbmdyZXNzUG9ydCB3aXRoIG5vIFBvcnRNYXBwaW5ncycsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5BV1NfVlBDLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ015Q29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0dWFsID0gY29udGFpbmVyLmluZ3Jlc3NQb3J0O1xuICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gODA4MDtcbiAgICAgICAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKGV4cGVjdGVkKTtcbiAgICAgICAgfSkudG9UaHJvdygvQ29udGFpbmVyIE15Q29udGFpbmVyIGhhc24ndCBkZWZpbmVkIGFueSBwb3J0cy4gQ2FsbCBhZGRQb3J0TWFwcGluZ3NcXChcXCkuLyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdXaXRoIG5ldHdvcmsgbW9kZSBIb3N0ICcsICgpID0+IHtcbiAgICAgIHRlc3QoJ0luZ3Jlc3MgcG9ydCBzaG91bGQgYmUgdGhlIHNhbWUgYXMgY29udGFpbmVyIHBvcnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuSE9TVCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdDb250YWluZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJy9hd3MvYXdzLWV4YW1wbGUtYXBwJyksXG4gICAgICAgICAgbWVtb3J5TGltaXRNaUI6IDIwNDgsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XG4gICAgICAgICAgY29udGFpbmVyUG9ydDogODA4MCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IGNvbnRhaW5lci5pbmdyZXNzUG9ydDtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IGV4cGVjdGVkID0gODA4MDtcbiAgICAgICAgZXhwZWN0KGFjdHVhbCkudG9FcXVhbCggZXhwZWN0ZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnV2l0aCBuZXR3b3JrIG1vZGUgQnJpZGdlJywgKCkgPT4ge1xuICAgICAgdGVzdCgnSW5ncmVzcyBwb3J0IHNob3VsZCBiZSB0aGUgc2FtZSBhcyBob3N0IHBvcnQgaWYgc3VwcGxpZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJywge1xuICAgICAgICAgIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQlJJREdFLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnL2F3cy9hd3MtZXhhbXBsZS1hcHAnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgICAgICBjb250YWluZXJQb3J0OiA4MDgwLFxuICAgICAgICAgIGhvc3RQb3J0OiA4MDgxLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYWN0dWFsID0gY29udGFpbmVyLmluZ3Jlc3NQb3J0O1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSA4MDgxO1xuICAgICAgICBleHBlY3QoYWN0dWFsKS50b0VxdWFsKCBleHBlY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnSW5ncmVzcyBwb3J0IHNob3VsZCBiZSAwIGlmIG5vdCBzdXBwbGllZCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnLCB7XG4gICAgICAgICAgbmV0d29ya01vZGU6IGVjcy5OZXR3b3JrTW9kZS5CUklER0UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignQ29udGFpbmVyJywge1xuICAgICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCcvYXdzL2F3cy1leGFtcGxlLWFwcCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAyMDQ4LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIGNvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDgwODEsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBhY3R1YWwgPSBjb250YWluZXIuaW5ncmVzc1BvcnQ7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBjb25zdCBleHBlY3RlZCA9IDA7XG4gICAgICAgIGV4cGVjdChhY3R1YWwpLnRvRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHRoZSBjb250YWluZXIgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBURVNUX0VOVklST05NRU5UX1ZBUklBQkxFOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnRhaW5lci5hZGRFbnZpcm9ubWVudCgnU0VDT05EX0VOVklST05FTUVOVF9WQVJJQUJMRScsICdzZWNvbmQgdGVzdCB2YWx1ZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBFbnZpcm9ubWVudDogW3tcbiAgICAgICAgICAgIE5hbWU6ICdURVNUX0VOVklST05NRU5UX1ZBUklBQkxFJyxcbiAgICAgICAgICAgIFZhbHVlOiAndGVzdCBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBOYW1lOiAnU0VDT05EX0VOVklST05FTUVOVF9WQVJJQUJMRScsXG4gICAgICAgICAgICBWYWx1ZTogJ3NlY29uZCB0ZXN0IHZhbHVlJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBjb250YWluZXIgZGVmaW5pdGlvbiB3aXRoIG5vIGVudmlyb25tZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICB9KTtcbiAgICBjb250YWluZXIuYWRkRW52aXJvbm1lbnQoJ1NFQ09ORF9FTlZJUk9ORU1FTlRfVkFSSUFCTEUnLCAnc2Vjb25kIHRlc3QgdmFsdWUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgRW52aXJvbm1lbnQ6IFt7XG4gICAgICAgICAgICBOYW1lOiAnU0VDT05EX0VOVklST05FTUVOVF9WQVJJQUJMRScsXG4gICAgICAgICAgICBWYWx1ZTogJ3NlY29uZCB0ZXN0IHZhbHVlJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIHBvcnQgbWFwcGluZ3MgdG8gdGhlIGNvbnRhaW5lciBkZWZpbml0aW9uIGJ5IHByb3BzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIHBvcnRNYXBwaW5nczogW3sgY29udGFpbmVyUG9ydDogODAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIFBvcnRNYXBwaW5nczogW01hdGNoLm9iamVjdExpa2UoeyBDb250YWluZXJQb3J0OiA4MCB9KV0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBwb3J0IG1hcHBpbmdzIHVzaW5nIHByb3BzIGFuZCBhZGRQb3J0TWFwcGluZ3MgYW5kIGJvdGggYXJlIGluY2x1ZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNvbnRhaW5lckRlZmluaXRpb24gPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBwb3J0TWFwcGluZ3M6IFt7IGNvbnRhaW5lclBvcnQ6IDgwIH1dLFxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyRGVmaW5pdGlvbi5hZGRQb3J0TWFwcGluZ3MoeyBjb250YWluZXJQb3J0OiA0NDMgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIFBvcnRNYXBwaW5nczogW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7IENvbnRhaW5lclBvcnQ6IDgwIH0pLFxuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7IENvbnRhaW5lclBvcnQ6IDQ0MyB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IHN5c3RlbSBjb250cm9scycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBzeXN0ZW1Db250cm9sczogW1xuICAgICAgICB7IG5hbWVzcGFjZTogJ1NvbWVOYW1lc3BhY2UxJywgdmFsdWU6ICdTb21lVmFsdWUxJyB9LFxuICAgICAgICB7IG5hbWVzcGFjZTogJ1NvbWVOYW1lc3BhY2UyJywgdmFsdWU6ICdTb21lVmFsdWUyJyB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgU3lzdGVtQ29udHJvbHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnU29tZU5hbWVzcGFjZTEnLFxuICAgICAgICAgICAgICBWYWx1ZTogJ1NvbWVWYWx1ZTEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZXNwYWNlOiAnU29tZU5hbWVzcGFjZTInLFxuICAgICAgICAgICAgICBWYWx1ZTogJ1NvbWVWYWx1ZTInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdFbnZpcm9ubWVudCBGaWxlcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnd2l0aCBFQzIgdGFzayBkZWZpbml0aW9ucycsICgpID0+IHtcbiAgICAgIHRlc3QoJ2NhbiBhZGQgYXNzZXQgZW52aXJvbm1lbnQgZmlsZSB0byB0aGUgY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICAgIGVudmlyb25tZW50RmlsZXM6IFtlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby1lbnZmaWxlcy90ZXN0LWVudmZpbGUuZW52JykpXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVEhFTlxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgRW52aXJvbm1lbnRGaWxlczogW3tcbiAgICAgICAgICAgICAgICBUeXBlOiAnczMnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6czM6OjonLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyczg3MjU2MWJmMDc4ZWRkMTY4NWQ1MGM5ZmY4MjFjZGQ2MGQyYjJkZGZiMDAxM2M0MDg3ZTc5YmYyYmI1MDcyNGRTM0J1Y2tldDdCMjA2OUI3JyxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd8fCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0Fzc2V0UGFyYW1ldGVyczg3MjU2MWJmMDc4ZWRkMTY4NWQ1MGM5ZmY4MjFjZGQ2MGQyYjJkZGZiMDAxM2M0MDg3ZTc5YmYyYmI1MDcyNGRTM1ZlcnNpb25LZXk0MEUxMkMxNScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnY2FuIGFkZCBzMyBidWNrZXQgZW52aXJvbm1lbnQgZmlsZSB0byB0aGUgY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgICAgIGJ1Y2tldE5hbWU6ICd0ZXN0LWJ1Y2tldCcsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgICBlbnZpcm9ubWVudEZpbGVzOiBbZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQnVja2V0KGJ1Y2tldCwgJ3Rlc3Qta2V5JyldLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICBFbnZpcm9ubWVudEZpbGVzOiBbe1xuICAgICAgICAgICAgICAgIFR5cGU6ICdzMycsXG4gICAgICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpzMzo6OicsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQnVja2V0ODM5MDhFNzcnLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJy90ZXN0LWtleScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIEZhcmdhdGUgdGFzayBkZWZpbml0aW9ucycsICgpID0+IHtcbiAgICAgIHRlc3QoJ2NhbiBhZGQgYXNzZXQgZW52aXJvbm1lbnQgZmlsZSB0byB0aGUgY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgICBlbnZpcm9ubWVudEZpbGVzOiBbZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8tZW52ZmlsZXMvdGVzdC1lbnZmaWxlLmVudicpKV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgIEVudmlyb25tZW50RmlsZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ3MzJyxcbiAgICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNCdWNrZXQ3QjIwNjlCNycsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3x8JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQXNzZXRQYXJhbWV0ZXJzODcyNTYxYmYwNzhlZGQxNjg1ZDUwYzlmZjgyMWNkZDYwZDJiMmRkZmIwMDEzYzQwODdlNzliZjJiYjUwNzI0ZFMzVmVyc2lvbktleTQwRTEyQzE1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnfHwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBc3NldFBhcmFtZXRlcnM4NzI1NjFiZjA3OGVkZDE2ODVkNTBjOWZmODIxY2RkNjBkMmIyZGRmYjAwMTNjNDA4N2U3OWJmMmJiNTA3MjRkUzNWZXJzaW9uS2V5NDBFMTJDMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NhbiBhZGQgczMgYnVja2V0IGVudmlyb25tZW50IGZpbGUgdG8gdGhlIGNvbnRhaW5lciBkZWZpbml0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgICAgICBidWNrZXROYW1lOiAndGVzdC1idWNrZXQnLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkZhcmdhdGVUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgICAvLyBXSEVOXG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICAgIGVudmlyb25tZW50RmlsZXM6IFtlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21CdWNrZXQoYnVja2V0LCAndGVzdC1rZXknKV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgIEVudmlyb25tZW50RmlsZXM6IFt7XG4gICAgICAgICAgICAgICAgVHlwZTogJ3MzJyxcbiAgICAgICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnMzOjo6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdCdWNrZXQ4MzkwOEU3NycsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnL3Rlc3Qta2V5JyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnR2l2ZW4gR1BVIGNvdW50IHBhcmFtZXRlcicsICgpID0+IHtcbiAgICB0ZXN0KCd3aWxsIGFkZCByZXNvdXJjZSByZXF1aXJlbWVudHMgdG8gY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIGdwdUNvdW50OiA0LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgUmVzb3VyY2VSZXF1aXJlbWVudHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFR5cGU6ICdHUFUnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnNCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdHaXZlbiBJbmZlcmVuY2VBY2NlbGVyYXRvciByZXNvdXJjZSBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgdGVzdCgnY29ycmVjdGx5IGFkZHMgcmVzb3VyY2UgcmVxdWlyZW1lbnRzIHRvIGNvbnRhaW5lciBkZWZpbml0aW9uIHVzaW5nIGluZmVyZW5jZSBhY2NlbGVyYXRvciByZXNvdXJjZSBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgY29uc3QgaW5mZXJlbmNlQWNjZWxlcmF0b3JzID0gW3tcbiAgICAgICAgZGV2aWNlTmFtZTogJ2RldmljZTEnLFxuICAgICAgICBkZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgICAgfV07XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9ycyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcyA9IFsnZGV2aWNlMSddO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgICAgSW5mZXJlbmNlQWNjZWxlcmF0b3JzOiBbe1xuICAgICAgICAgIERldmljZU5hbWU6ICdkZXZpY2UxJyxcbiAgICAgICAgICBEZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgICAgICB9XSxcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgICAgICBSZXNvdXJjZVJlcXVpcmVtZW50czogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHlwZTogJ0luZmVyZW5jZUFjY2VsZXJhdG9yJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ2RldmljZTEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29ycmVjdGx5IGFkZHMgcmVzb3VyY2UgcmVxdWlyZW1lbnRzIHRvIGNvbnRhaW5lciBkZWZpbml0aW9uIHVzaW5nIGJvdGggcHJvcHMgYW5kIGFkZEluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2UgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCBpbmZlcmVuY2VBY2NlbGVyYXRvcnMgPSBbe1xuICAgICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgIGRldmljZVR5cGU6ICdlaWEyLm1lZGl1bScsXG4gICAgICB9LCB7XG4gICAgICAgIGRldmljZU5hbWU6ICdkZXZpY2UyJyxcbiAgICAgICAgZGV2aWNlVHlwZTogJ2VpYTIubGFyZ2UnLFxuICAgICAgfV07XG5cbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ0VjMlRhc2tEZWYnLCB7XG4gICAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9ycyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcyA9IFsnZGV2aWNlMSddO1xuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb250YWluZXIuYWRkSW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZSgnZGV2aWNlMicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgICAgSW5mZXJlbmNlQWNjZWxlcmF0b3JzOiBbe1xuICAgICAgICAgIERldmljZU5hbWU6ICdkZXZpY2UxJyxcbiAgICAgICAgICBEZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgICAgICB9LCB7XG4gICAgICAgICAgRGV2aWNlTmFtZTogJ2RldmljZTInLFxuICAgICAgICAgIERldmljZVR5cGU6ICdlaWEyLmxhcmdlJyxcbiAgICAgICAgfV0sXG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgUmVzb3VyY2VSZXF1aXJlbWVudHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFR5cGU6ICdJbmZlcmVuY2VBY2NlbGVyYXRvcicsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdkZXZpY2UxJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFR5cGU6ICdJbmZlcmVuY2VBY2NlbGVyYXRvcicsXG4gICAgICAgICAgICAgICAgVmFsdWU6ICdkZXZpY2UyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyB3aGVuIHRoZSB2YWx1ZSBvZiBpbmZlcmVuY2UgYWNjZWxlcmF0b3IgcmVzb3VyY2UgZG9lcyBub3QgbWF0Y2ggYW55IGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgZGVmaW5lZCBpbiB0aGUgVGFzayBEZWZpbml0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBjb25zdCBpbmZlcmVuY2VBY2NlbGVyYXRvcnMgPSBbe1xuICAgICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICAgIGRldmljZVR5cGU6ICdlaWEyLm1lZGl1bScsXG4gICAgICB9XTtcblxuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgICAgaW5mZXJlbmNlQWNjZWxlcmF0b3JzLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzID0gWydkZXZpY2UyJ107XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1Jlc291cmNlIHZhbHVlIGRldmljZTIgaW4gY29udGFpbmVyIGRlZmluaXRpb24gZG9lc24ndCBtYXRjaCBhbnkgaW5mZXJlbmNlIGFjY2VsZXJhdG9yIGRldmljZSBuYW1lIGluIHRoZSB0YXNrIGRlZmluaXRpb24uLyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZHMgcmVzb3VyY2UgcmVxdWlyZW1lbnRzIHdoZW4gYm90aCBpbmZlcmVuY2UgYWNjZWxlcmF0b3IgYW5kIGdwdSBjb3VudCBhcmUgZGVmaW5lZCBpbiB0aGUgY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGluZmVyZW5jZUFjY2VsZXJhdG9ycyA9IFt7XG4gICAgICBkZXZpY2VOYW1lOiAnZGV2aWNlMScsXG4gICAgICBkZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgIH1dO1xuXG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnRWMyVGFza0RlZicsIHtcbiAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9ycyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzID0gWydkZXZpY2UxJ107XG5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBncHVDb3VudDogMixcbiAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBGYW1pbHk6ICdFYzJUYXNrRGVmJyxcbiAgICAgIEluZmVyZW5jZUFjY2VsZXJhdG9yczogW3tcbiAgICAgICAgRGV2aWNlTmFtZTogJ2RldmljZTEnLFxuICAgICAgICBEZXZpY2VUeXBlOiAnZWlhMi5tZWRpdW0nLFxuICAgICAgfV0sXG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgIFJlc291cmNlUmVxdWlyZW1lbnRzOiBbe1xuICAgICAgICAgICAgVHlwZTogJ0luZmVyZW5jZUFjY2VsZXJhdG9yJyxcbiAgICAgICAgICAgIFZhbHVlOiAnZGV2aWNlMScsXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgVHlwZTogJ0dQVScsXG4gICAgICAgICAgICBWYWx1ZTogJzInLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgc2VjcmV0IGVudmlyb25tZW50IHZhcmlhYmxlcyB0byB0aGUgY29udGFpbmVyIGRlZmluaXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgY29uc3QgcGFyYW1ldGVyID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyhzdGFjaywgJ1BhcmFtZXRlcicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvbmFtZScsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgU0VDUkVUOiBlY3MuU2VjcmV0LmZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQpLFxuICAgICAgICBQQVJBTUVURVI6IGVjcy5TZWNyZXQuZnJvbVNzbVBhcmFtZXRlcihwYXJhbWV0ZXIpLFxuICAgICAgICBTRUNSRVRfSUQ6IGVjcy5TZWNyZXQuZnJvbVNlY3JldHNNYW5hZ2VyVmVyc2lvbihzZWNyZXQsIHsgdmVyc2lvbklkOiAndmVyc2lvbi1pZCcgfSksXG4gICAgICAgIFNFQ1JFVF9TVEFHRTogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXJWZXJzaW9uKHNlY3JldCwgeyB2ZXJzaW9uU3RhZ2U6ICd2ZXJzaW9uLXN0YWdlJyB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFkZFNlY3JldCgnTEFURVJfU0VDUkVUJywgZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXIoc2VjcmV0LCAnZmllbGQnKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIFNlY3JldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVCcsXG4gICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdQQVJBTUVURVInLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOnNzbTonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL25hbWUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVF9JRCcsXG4gICAgICAgICAgICAgIFZhbHVlRnJvbToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOjo6dmVyc2lvbi1pZCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBOYW1lOiAnU0VDUkVUX1NUQUdFJyxcbiAgICAgICAgICAgICAgVmFsdWVGcm9tOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6OnZlcnNpb24tc3RhZ2U6JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdMQVRFUl9TRUNSRVQnLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpmaWVsZDo6JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkRlc2NyaWJlU2VjcmV0JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzc206RGVzY3JpYmVQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXInLFxuICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlckhpc3RvcnknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOnNzbTonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvbmFtZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlIGEgc3BlY2lmaWMgc2VjcmV0IEpTT04ga2V5IGFzIGVudmlyb25tZW50IHZhcmlhYmxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgU0VDUkVUX0tFWTogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXIoc2VjcmV0LCAnc3BlY2lmaWNLZXknKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIFNlY3JldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVF9LRVknLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzcGVjaWZpY0tleTo6JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1c2UgYSBzcGVjaWZpYyBzZWNyZXQgSlNPTiBmaWVsZCBhcyBlbnZpcm9ubWVudCB2YXJpYWJsZSBmb3IgYSBGYXJnYXRlIHRhc2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIHNlY3JldHM6IHtcbiAgICAgICAgU0VDUkVUX0tFWTogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXIoc2VjcmV0LCAnc3BlY2lmaWNLZXknKSxcbiAgICAgICAgU0VDUkVUX0tFWV9JRDogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXJWZXJzaW9uKHNlY3JldCwgeyB2ZXJzaW9uSWQ6ICd2ZXJzaW9uLWlkJyB9LCAnc3BlY2lmaWNLZXknKSxcbiAgICAgICAgU0VDUkVUX0tFWV9TVEFHRTogZWNzLlNlY3JldC5mcm9tU2VjcmV0c01hbmFnZXJWZXJzaW9uKHNlY3JldCwgeyB2ZXJzaW9uU3RhZ2U6ICd2ZXJzaW9uLXN0YWdlJyB9LCAnc3BlY2lmaWNLZXknKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIFNlY3JldHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVF9LRVknLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzcGVjaWZpY0tleTo6JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5hbWU6ICdTRUNSRVRfS0VZX0lEJyxcbiAgICAgICAgICAgICAgVmFsdWVGcm9tOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6c3BlY2lmaWNLZXk6OnZlcnNpb24taWQnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgTmFtZTogJ1NFQ1JFVF9LRVlfU1RBR0UnLFxuICAgICAgICAgICAgICBWYWx1ZUZyb206IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpzcGVjaWZpY0tleTp2ZXJzaW9uLXN0YWdlOicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFkZCBBV1MgbG9nZ2luZyB0byBjb250YWluZXIgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBsb2dnaW5nOiBuZXcgZWNzLkF3c0xvZ0RyaXZlcih7IHN0cmVhbVByZWZpeDogJ3ByZWZpeCcgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIExvZ0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgIExvZ0RyaXZlcjogJ2F3c2xvZ3MnLFxuICAgICAgICAgICAgT3B0aW9uczoge1xuICAgICAgICAgICAgICAnYXdzbG9ncy1ncm91cCc6IHsgUmVmOiAnVGFza0RlZmNvbnRMb2dHcm91cDRFMTBEQ0JGJyB9LFxuICAgICAgICAgICAgICAnYXdzbG9ncy1zdHJlYW0tcHJlZml4JzogJ3ByZWZpeCcsXG4gICAgICAgICAgICAgICdhd3Nsb2dzLXJlZ2lvbic6IHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJywgJ2xvZ3M6UHV0TG9nRXZlbnRzJ10sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnVGFza0RlZmNvbnRMb2dHcm91cDRFMTBEQ0JGJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNldCBIZWFsdGggQ2hlY2sgd2l0aCBkZWZhdWx0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBoY0NvbW1hbmQgPSAnY3VybCBsb2NhbGhvc3Q6ODAwMCc7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgY29tbWFuZDogW2hjQ29tbWFuZF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBIZWFsdGhDaGVjazoge1xuICAgICAgICAgICAgQ29tbWFuZDogWydDTUQtU0hFTEwnLCBoY0NvbW1hbmRdLFxuICAgICAgICAgICAgSW50ZXJ2YWw6IDMwLFxuICAgICAgICAgICAgUmV0cmllczogMyxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBzZXR0aW5nIEhlYWx0aCBDaGVjayB3aXRoIG5vIGNvbW1hbmRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgIGNvbW1hbmQ6IFtdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBIZWFsdGhDaGVjazoge1xuICAgICAgICAgICAgICBDb21tYW5kOiBbXSxcbiAgICAgICAgICAgICAgSW50ZXJ2YWw6IDMwLFxuICAgICAgICAgICAgICBSZXRyaWVzOiAzLFxuICAgICAgICAgICAgICBUaW1lb3V0OiA1LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQXQgbGVhc3Qgb25lIGFyZ3VtZW50IG11c3QgYmUgc3VwcGxpZWQgZm9yIGhlYWx0aCBjaGVjayBjb21tYW5kLi8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBzZXR0aW5nIEhlYWx0aCBDaGVjayB3aXRoIGludmFsaWQgaW50ZXJ2YWwgYmVjYXVzZSBvZiB0b28gc2hvcnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgY29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcyg0KSxcbiAgICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgICAgIENvbW1hbmQ6IFsnQ01ELVNIRUxMJywgJ2N1cmwgbG9jYWxob3N0OjgwMDAnXSxcbiAgICAgICAgICAgICAgSW50ZXJ2YWw6IDQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9JbnRlcnZhbCBtdXN0IGJlIGJldHdlZW4gNSBzZWNvbmRzIGFuZCAzMDAgc2Vjb25kcy4vKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gc2V0dGluZyBIZWFsdGggQ2hlY2sgd2l0aCBpbnZhbGlkIGludGVydmFsIGJlY2F1c2Ugb2YgdG9vIGxvbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgY29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygzMDEpLFxuICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgICAgQ29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICAgICAgICBJbnRlcnZhbDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0ludGVydmFsIG11c3QgYmUgYmV0d2VlbiA1IHNlY29uZHMgYW5kIDMwMCBzZWNvbmRzLi8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBzZXR0aW5nIEhlYWx0aCBDaGVjayB3aXRoIGludmFsaWQgdGltZW91dCBiZWNhdXNlIG9mIHRvbyBzaG9ydCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBjb21tYW5kOiBbJ0NNRC1TSEVMTCcsICdjdXJsIGxvY2FsaG9zdDo4MDAwJ10sXG4gICAgICAgIGludGVydmFsOiBEdXJhdGlvbi5zZWNvbmRzKDQwKSxcbiAgICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgICAgQ29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICAgICAgICBJbnRlcnZhbDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1RpbWVvdXQgbXVzdCBiZSBiZXR3ZWVuIDIgc2Vjb25kcyBhbmQgMTIwIHNlY29uZHMuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIHNldHRpbmcgSGVhbHRoIENoZWNrIHdpdGggaW52YWxpZCB0aW1lb3V0IGJlY2F1c2Ugb2YgdG9vIGxvbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRWMyVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgY29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICBpbnRlcnZhbDogRHVyYXRpb24uc2Vjb25kcygxNTApLFxuICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDEzMCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgICAgIENvbW1hbmQ6IFsnQ01ELVNIRUxMJywgJ2N1cmwgbG9jYWxob3N0OjgwMDAnXSxcbiAgICAgICAgICAgICAgSW50ZXJ2YWw6IDQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9UaW1lb3V0IG11c3QgYmUgYmV0d2VlbiAyIHNlY29uZHMgYW5kIDEyMCBzZWNvbmRzLi8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBzZXR0aW5nIEhlYWx0aCBDaGVjayB3aXRoIGludmFsaWQgaW50ZXJ2YWwgYW5kIHRpbWVvdXQgYmVjYXVzZSB0aW1lb3V0IGlzIGxvbmdlciB0aGFuIGludGVydmFsJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgIGhlYWx0aENoZWNrOiB7XG4gICAgICAgIGNvbW1hbmQ6IFsnQ01ELVNIRUxMJywgJ2N1cmwgbG9jYWxob3N0OjgwMDAnXSxcbiAgICAgICAgaW50ZXJ2YWw6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgICAgQ29tbWFuZDogWydDTUQtU0hFTEwnLCAnY3VybCBsb2NhbGhvc3Q6ODAwMCddLFxuICAgICAgICAgICAgICBJbnRlcnZhbDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0hlYWx0aCBjaGVjayBpbnRlcnZhbCBzaG91bGQgYmUgbG9uZ2VyIHRoYW4gdGltZW91dC4vKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgSGVhbHRoIENoZWNrIHZhbHVlcyBpbiBzaGVsbCBmb3JtJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICAgIGNvbnN0IGhjQ29tbWFuZCA9ICdjdXJsIGxvY2FsaG9zdDo4MDAwJztcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBjb21tYW5kOiBbaGNDb21tYW5kXSxcbiAgICAgICAgaW50ZXJ2YWw6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDIwKSxcbiAgICAgICAgcmV0cmllczogNSxcbiAgICAgICAgc3RhcnRQZXJpb2Q6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEhlYWx0aENoZWNrOiB7XG4gICAgICAgICAgICBDb21tYW5kOiBbJ0NNRC1TSEVMTCcsIGhjQ29tbWFuZF0sXG4gICAgICAgICAgICBJbnRlcnZhbDogMjAsXG4gICAgICAgICAgICBSZXRyaWVzOiA1LFxuICAgICAgICAgICAgVGltZW91dDogNSxcbiAgICAgICAgICAgIFN0YXJ0UGVyaW9kOiAxMCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IEhlYWx0aCBDaGVjayB2YWx1ZXMgaW4gYXJyYXkgZm9ybSBzdGFydGluZyB3aXRoIENNRC1TSEVMTCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcbiAgICBjb25zdCBoY0NvbW1hbmQgPSAnY3VybCBsb2NhbGhvc3Q6ODAwMCc7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgaGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgY29tbWFuZDogWydDTUQtU0hFTEwnLCBoY0NvbW1hbmRdLFxuICAgICAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMjApLFxuICAgICAgICByZXRyaWVzOiA1LFxuICAgICAgICBzdGFydFBlcmlvZDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgSGVhbHRoQ2hlY2s6IHtcbiAgICAgICAgICAgIENvbW1hbmQ6IFsnQ01ELVNIRUxMJywgaGNDb21tYW5kXSxcbiAgICAgICAgICAgIEludGVydmFsOiAyMCxcbiAgICAgICAgICAgIFJldHJpZXM6IDUsXG4gICAgICAgICAgICBUaW1lb3V0OiA1LFxuICAgICAgICAgICAgU3RhcnRQZXJpb2Q6IDEwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNwZWNpZnkgSGVhbHRoIENoZWNrIHZhbHVlcyBpbiBhcnJheSBmb3JtIHN0YXJ0aW5nIHdpdGggQ01EJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICAgIGNvbnN0IGhjQ29tbWFuZCA9ICdjdXJsIGxvY2FsaG9zdDo4MDAwJztcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICBoZWFsdGhDaGVjazoge1xuICAgICAgICBjb21tYW5kOiBbJ0NNRCcsIGhjQ29tbWFuZF0sXG4gICAgICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24uc2Vjb25kcygyMCksXG4gICAgICAgIHJldHJpZXM6IDUsXG4gICAgICAgIHN0YXJ0UGVyaW9kOiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICBIZWFsdGhDaGVjazoge1xuICAgICAgICAgICAgQ29tbWFuZDogWydDTUQnLCBoY0NvbW1hbmRdLFxuICAgICAgICAgICAgSW50ZXJ2YWw6IDIwLFxuICAgICAgICAgICAgUmV0cmllczogNSxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDUsXG4gICAgICAgICAgICBTdGFydFBlcmlvZDogMTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBwcml2YXRlIHJlZ2lzdHJ5IGNyZWRlbnRpYWxzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuICAgIGNvbnN0IG15U2VjcmV0QXJuID0gJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6cmVnaW9uOjEyMzQ1Njc4OTA6c2VjcmV0Ok15UmVwb1NlY3JldC02ZjhoajMnO1xuXG4gICAgY29uc3QgcmVwb0NyZWRzID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXRDb21wbGV0ZUFybihzdGFjaywgJ015UmVwb1NlY3JldCcsIG15U2VjcmV0QXJuKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ0NvbnRhaW5lcicsIHtcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd1c2VyLXgvbXktYXBwJywge1xuICAgICAgICBjcmVkZW50aWFsczogcmVwb0NyZWRzLFxuICAgICAgfSksXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMjA0OCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgSW1hZ2U6ICd1c2VyLXgvbXktYXBwJyxcbiAgICAgICAgICBSZXBvc2l0b3J5Q3JlZGVudGlhbHM6IHtcbiAgICAgICAgICAgIENyZWRlbnRpYWxzUGFyYW1ldGVyOiBteVNlY3JldEFybixcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiBteVNlY3JldEFybixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ19saW5rQ29udGFpbmVyIHdvcmtzIHByb3Blcmx5JywgKCkgPT4ge1xuICAgIHRlc3QoJ3doZW4gdGhlIHByb3BzIHBhc3NlZCBpbiBpcyBhbiBlc3NlbnRpYWwgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICBlc3NlbnRpYWw6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRhc2tEZWZpbml0aW9uLmRlZmF1bHRDb250YWluZXIpLnRvRXF1YWwoIGNvbnRhaW5lcik7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2hlbiB0aGUgcHJvcHMgcGFzc2VkIGluIGlzIG5vdCBhbiBlc3NlbnRpYWwgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICBlc3NlbnRpYWw6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0YXNrRGVmaW5pdGlvbi5kZWZhdWx0Q29udGFpbmVyKS50b0VxdWFsKCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnQ2FuIHNwZWNpZnkgbGludXggcGFyYW1ldGVycycsICgpID0+IHtcbiAgICB0ZXN0KCd2YWxpZGF0aW9uIHRocm93cyB3aXRoIG91dCBvZiByYW5nZSBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHN3YXBwaW5lc3NWYWx1ZXMgPSBbLTEsIDMwLjUsIDEwMV07XG4gICAgICBzd2FwcGluZXNzVmFsdWVzLmZvckVhY2goc3dhcHBpbmVzcyA9PiBleHBlY3QoKCkgPT5cbiAgICAgICAgbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssIGBMaW51eFBhcmFtZXRlcnNXaXRoU3dhcHBpbmVzcygke3N3YXBwaW5lc3N9KWAsIHsgc3dhcHBpbmVzcyB9KSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihgc3dhcHBpbmVzczogTXVzdCBiZSBhbiBpbnRlZ2VyIGJldHdlZW4gMCBhbmQgMTAwOyByZWNlaXZlZCAke3N3YXBwaW5lc3N9LmApKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggb25seSByZXF1aXJlZCBwcm9wZXJ0aWVzIHNldCwgaXQgY29ycmVjdGx5IHNldHMgZGVmYXVsdCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBsaW51eFBhcmFtZXRlcnMgPSBuZXcgZWNzLkxpbnV4UGFyYW1ldGVycyhzdGFjaywgJ0xpbnV4UGFyYW1ldGVycycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ2NvbnQnLCB7XG4gICAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0ZXN0JyksXG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiAxMDI0LFxuICAgICAgICBsaW51eFBhcmFtZXRlcnMsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNTOjpUYXNrRGVmaW5pdGlvbicsIHtcbiAgICAgICAgQ29udGFpbmVyRGVmaW5pdGlvbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIEltYWdlOiAndGVzdCcsXG4gICAgICAgICAgICBMaW51eFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgQ2FwYWJpbGl0aWVzOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2JlZm9yZSBjYWxsaW5nIGFkZENvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgY29uc3QgbGludXhQYXJhbWV0ZXJzID0gbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssICdMaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgIGluaXRQcm9jZXNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc2hhcmVkTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgbWF4U3dhcDogY2RrLlNpemUuZ2liaWJ5dGVzKDUpLFxuICAgICAgICBzd2FwcGluZXNzOiA5MCxcbiAgICAgIH0pO1xuXG4gICAgICBsaW51eFBhcmFtZXRlcnMuYWRkQ2FwYWJpbGl0aWVzKGVjcy5DYXBhYmlsaXR5LkFMTCk7XG4gICAgICBsaW51eFBhcmFtZXRlcnMuZHJvcENhcGFiaWxpdGllcyhlY3MuQ2FwYWJpbGl0eS5LSUxMKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgbGludXhQYXJhbWV0ZXJzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTGludXhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIENhcGFiaWxpdGllczoge1xuICAgICAgICAgICAgICAgIEFkZDogWydBTEwnXSxcbiAgICAgICAgICAgICAgICBEcm9wOiBbJ0tJTEwnXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgICBNYXhTd2FwOiA1ICogMTAyNCxcbiAgICAgICAgICAgICAgU2hhcmVkTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgICAgICAgU3dhcHBpbmVzczogOTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZnRlciBjYWxsaW5nIGFkZENvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgY29uc3QgbGludXhQYXJhbWV0ZXJzID0gbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssICdMaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgIGluaXRQcm9jZXNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc2hhcmVkTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgbWF4U3dhcDogY2RrLlNpemUuZ2liaWJ5dGVzKDUpLFxuICAgICAgICBzd2FwcGluZXNzOiA5MCxcbiAgICAgIH0pO1xuXG4gICAgICBsaW51eFBhcmFtZXRlcnMuYWRkQ2FwYWJpbGl0aWVzKGVjcy5DYXBhYmlsaXR5LkFMTCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIGxpbnV4UGFyYW1ldGVycyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBNdXRhdGUgbGludXhQYXJhbWV0ZXIgYWZ0ZXIgYWRkZWQgdG8gYSBjb250YWluZXJcbiAgICAgIGxpbnV4UGFyYW1ldGVycy5kcm9wQ2FwYWJpbGl0aWVzKGVjcy5DYXBhYmlsaXR5LlNFVFVJRCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTGludXhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIENhcGFiaWxpdGllczoge1xuICAgICAgICAgICAgICAgIEFkZDogWydBTEwnXSxcbiAgICAgICAgICAgICAgICBEcm9wOiBbJ1NFVFVJRCddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBJbml0UHJvY2Vzc0VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgIE1heFN3YXA6IDUgKiAxMDI0LFxuICAgICAgICAgICAgICBTaGFyZWRNZW1vcnlTaXplOiAxMDI0LFxuICAgICAgICAgICAgICBTd2FwcGluZXNzOiA5MCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggb25lIG9yIG1vcmUgaG9zdCBkZXZpY2VzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuXG4gICAgICBjb25zdCBsaW51eFBhcmFtZXRlcnMgPSBuZXcgZWNzLkxpbnV4UGFyYW1ldGVycyhzdGFjaywgJ0xpbnV4UGFyYW1ldGVycycsIHtcbiAgICAgICAgaW5pdFByb2Nlc3NFbmFibGVkOiB0cnVlLFxuICAgICAgICBzaGFyZWRNZW1vcnlTaXplOiAxMDI0LFxuICAgICAgICBtYXhTd2FwOiBjZGsuU2l6ZS5naWJpYnl0ZXMoNSksXG4gICAgICAgIHN3YXBwaW5lc3M6IDkwLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGxpbnV4UGFyYW1ldGVycy5hZGREZXZpY2VzKHtcbiAgICAgICAgaG9zdFBhdGg6ICdhL2IvYycsXG4gICAgICB9KTtcblxuICAgICAgdGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKCdjb250Jywge1xuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgndGVzdCcpLFxuICAgICAgICBtZW1vcnlMaW1pdE1pQjogMTAyNCxcbiAgICAgICAgbGludXhQYXJhbWV0ZXJzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6VGFza0RlZmluaXRpb24nLCB7XG4gICAgICAgIENvbnRhaW5lckRlZmluaXRpb25zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBJbWFnZTogJ3Rlc3QnLFxuICAgICAgICAgICAgTGludXhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIERldmljZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBIb3N0UGF0aDogJ2EvYi9jJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBJbml0UHJvY2Vzc0VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgIE1heFN3YXA6IDUgKiAxMDI0LFxuICAgICAgICAgICAgICBTaGFyZWRNZW1vcnlTaXplOiAxMDI0LFxuICAgICAgICAgICAgICBTd2FwcGluZXNzOiA5MCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggdGhlIHRtcGZzIG1vdW50IGZvciBhIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5FYzJUYXNrRGVmaW5pdGlvbihzdGFjaywgJ1Rhc2tEZWYnKTtcblxuICAgICAgY29uc3QgbGludXhQYXJhbWV0ZXJzID0gbmV3IGVjcy5MaW51eFBhcmFtZXRlcnMoc3RhY2ssICdMaW51eFBhcmFtZXRlcnMnLCB7XG4gICAgICAgIGluaXRQcm9jZXNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc2hhcmVkTWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgICAgbWF4U3dhcDogY2RrLlNpemUuZ2liaWJ5dGVzKDUpLFxuICAgICAgICBzd2FwcGluZXNzOiA5MCxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBsaW51eFBhcmFtZXRlcnMuYWRkVG1wZnMoe1xuICAgICAgICBjb250YWluZXJQYXRoOiAnYS9iL2MnLFxuICAgICAgICBzaXplOiAxMDI0LFxuICAgICAgfSk7XG5cbiAgICAgIHRhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignY29udCcsIHtcbiAgICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3Rlc3QnKSxcbiAgICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsXG4gICAgICAgIGxpbnV4UGFyYW1ldGVycyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1M6OlRhc2tEZWZpbml0aW9uJywge1xuICAgICAgICBDb250YWluZXJEZWZpbml0aW9uczogW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgSW1hZ2U6ICd0ZXN0JyxcbiAgICAgICAgICAgIExpbnV4UGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBUbXBmczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIENvbnRhaW5lclBhdGg6ICdhL2IvYycsXG4gICAgICAgICAgICAgICAgICBTaXplOiAxMDI0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIEluaXRQcm9jZXNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgTWF4U3dhcDogNSAqIDEwMjQsXG4gICAgICAgICAgICAgIFNoYXJlZE1lbW9yeVNpemU6IDEwMjQsXG4gICAgICAgICAgICAgIFN3YXBwaW5lc3M6IDkwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19