"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const ecs = require("aws-cdk-lib/aws-ecs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const utils_1 = require("./utils");
const lib_1 = require("../lib");
// GIVEN
const defaultContainerProps = {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
};
const defaultExpectedProps = {
    type: 'container',
    eksProperties: {
        podProperties: {
            containers: [{
                    image: 'amazon/amazon-ecs-sample',
                }],
        },
    },
};
let stack;
let pascalCaseExpectedProps;
describe('eks container', () => {
    // GIVEN
    beforeEach(() => {
        stack = new aws_cdk_lib_1.Stack();
        pascalCaseExpectedProps = (0, utils_1.capitalizePropertyNames)(stack, defaultExpectedProps);
    });
    test('eks container defaults', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
        });
    });
    test('respects args', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                args: ['arg1', 'arg2'],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Args: ['arg1', 'arg2'],
                        }],
                },
            },
        });
    });
    test('respects command', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                command: ['echo', 'bar'],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Command: ['echo', 'bar'],
                        }],
                },
            },
        });
    });
    test('respects cpuLimit', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                cpuLimit: 256,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Limits: {
                                    cpu: 256,
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects cpuReservation', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                cpuReservation: 256,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Requests: {
                                    cpu: 256,
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects memoryLimitMiB', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                memoryLimit: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Limits: {
                                    memory: '2048Mi',
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects memoryReservation', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                memoryReservation: aws_cdk_lib_1.Size.mebibytes(2048),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Requests: {
                                    memory: '2048Mi',
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects gpuLimit', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                gpuLimit: 20,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Limits: {
                                    'nvidia.com/gpu': 20,
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects gpuReservation', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                gpuReservation: 20,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Requests: {
                                    'nvidia.com/gpu': 20,
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects resource requests and limits', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                cpuLimit: 256,
                cpuReservation: 128,
                memoryLimit: aws_cdk_lib_1.Size.mebibytes(2048),
                memoryReservation: aws_cdk_lib_1.Size.mebibytes(2048),
                gpuLimit: 20,
                gpuReservation: 10,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Resources: {
                                Limits: {
                                    'cpu': 256,
                                    'memory': '2048Mi',
                                    'nvidia.com/gpu': 20,
                                },
                                Requests: {
                                    'cpu': 128,
                                    'memory': '2048Mi',
                                    'nvidia.com/gpu': 10,
                                },
                            },
                        }],
                },
            },
        });
    });
    test('respects env', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                env: {
                    var: 'val',
                    boo: 'bah',
                },
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Env: [
                                {
                                    Name: 'var',
                                    Value: 'val',
                                },
                                {
                                    Name: 'boo',
                                    Value: 'bah',
                                },
                            ],
                        }],
                },
            },
        });
    });
    test('respects imagePullPolicy', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                imagePullPolicy: lib_1.ImagePullPolicy.NEVER,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            ImagePullPolicy: 'Never',
                        }],
                },
            },
        });
    });
    test('respects name', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                name: 'myContainerName',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            Name: 'myContainerName',
                        }],
                },
            },
        });
    });
    test('respects privileged', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                privileged: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            SecurityContext: {
                                Privileged: true,
                            },
                        }],
                },
            },
        });
    });
    test('respects readonlyFileSystem', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                readonlyRootFilesystem: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            SecurityContext: {
                                ReadOnlyRootFilesystem: true,
                            },
                        }],
                },
            },
        });
    });
    test('respects runAsGroup', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                runAsGroup: 1,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            SecurityContext: {
                                RunAsGroup: 1,
                            },
                        }],
                },
            },
        });
    });
    test('respects runAsRoot', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefEksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                runAsRoot: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            SecurityContext: {
                                RunAsNonRoot: false,
                            },
                        }],
                },
            },
        });
    });
    test('respects runAsUser', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                runAsUser: 90,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            SecurityContext: {
                                RunAsUser: 90,
                            },
                        }],
                },
            },
        });
    });
    test('respects emptyDir volumes', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                volumes: [
                    lib_1.EksVolume.emptyDir({
                        name: 'emptyDirName',
                        medium: lib_1.EmptyDirMediumType.DISK,
                        mountPath: '/mount/path',
                        readonly: false,
                        sizeLimit: aws_cdk_lib_1.Size.mebibytes(2048),
                    }),
                ],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    Name: 'emptyDirName',
                                    ReadOnly: false,
                                }],
                        }],
                    Volumes: [{
                            Name: 'emptyDirName',
                            EmptyDir: {
                                Medium: '',
                                SizeLimit: '2048Mi',
                            },
                        }],
                },
            },
        });
    });
    test('respects hostPath volumes', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                volumes: [lib_1.EksVolume.hostPath({
                        name: 'hostPathName',
                        hostPath: 'hostPathPath',
                        mountPath: '/mount/path',
                        readonly: true,
                    })],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    Name: 'hostPathName',
                                    ReadOnly: true,
                                }],
                        }],
                    Volumes: [{
                            Name: 'hostPathName',
                            HostPath: {
                                Path: 'hostPathPath',
                            },
                        }],
                },
            },
        });
    });
    test('respects secret volumes, and ensures optional defaults to true', () => {
        // WHEN
        new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
                volumes: [lib_1.EksVolume.secret({
                        name: 'secretVolumeName',
                        secretName: 'myKubeSecret',
                        mountPath: '/mount/path',
                        readonly: true,
                    })],
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    ReadOnly: true,
                                }],
                        }],
                    Volumes: [{
                            Name: 'secretVolumeName',
                            Secret: {
                                SecretName: 'myKubeSecret',
                                Optional: true,
                            },
                        }],
                },
            },
        });
    });
    test('respects addVolume() with emptyDir volume', () => {
        // GIVEN
        const jobDefn = new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addVolume(lib_1.EksVolume.emptyDir({
            name: 'emptyDirName',
            medium: lib_1.EmptyDirMediumType.DISK,
            mountPath: '/mount/path',
            readonly: false,
            sizeLimit: aws_cdk_lib_1.Size.mebibytes(2048),
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    Name: 'emptyDirName',
                                    ReadOnly: false,
                                }],
                        }],
                    Volumes: [{
                            Name: 'emptyDirName',
                            EmptyDir: {
                                Medium: '',
                                SizeLimit: '2048Mi',
                            },
                        }],
                },
            },
        });
    });
    test('respects addVolume() with hostPath volume', () => {
        // GIVEN
        const jobDefn = new lib_1.EksJobDefinition(stack, 'EksJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addVolume(lib_1.EksVolume.hostPath({
            name: 'hostPathName',
            hostPath: 'hostPathPath',
            mountPath: '/mount/path',
            readonly: true,
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    Name: 'hostPathName',
                                    ReadOnly: true,
                                }],
                        }],
                    Volumes: [{
                            Name: 'hostPathName',
                            HostPath: {
                                Path: 'hostPathPath',
                            },
                        }],
                },
            },
        });
    });
    test('respects addVolume() with secret volume (optional: false)', () => {
        // GIVEN
        const jobDefn = new lib_1.EksJobDefinition(stack, 'EKSJobDefn', {
            container: new lib_1.EksContainerDefinition(stack, 'EcsEc2Container', {
                ...defaultContainerProps,
            }),
        });
        // WHEN
        jobDefn.container.addVolume(lib_1.EksVolume.secret({
            name: 'secretVolumeName',
            secretName: 'secretName',
            optional: false,
            mountPath: '/mount/path',
            readonly: true,
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
            ...pascalCaseExpectedProps,
            EksProperties: {
                PodProperties: {
                    ...pascalCaseExpectedProps.EksProperties.PodProperties,
                    Containers: [{
                            ...pascalCaseExpectedProps.EksProperties.PodProperties.Containers[0],
                            VolumeMounts: [{
                                    MountPath: '/mount/path',
                                    Name: 'secretVolumeName',
                                    ReadOnly: true,
                                }],
                        }],
                    Volumes: [{
                            Name: 'secretVolumeName',
                            Secret: {
                                SecretName: 'secretName',
                                Optional: false,
                            },
                        }],
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLWNvbnRhaW5lci1kZWZpbml0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJla3MtY29udGFpbmVyLWRlZmluaXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsNkNBQTBDO0FBQzFDLG1DQUFrRDtBQUNsRCxnQ0FBK0k7QUFHL0ksUUFBUTtBQUNSLE1BQU0scUJBQXFCLEdBQWdDO0lBQ3pELEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztDQUNuRSxDQUFDO0FBRUYsTUFBTSxvQkFBb0IsR0FBMEI7SUFDbEQsSUFBSSxFQUFFLFdBQVc7SUFDakIsYUFBYSxFQUFFO1FBQ2IsYUFBYSxFQUFFO1lBQ2IsVUFBVSxFQUFFLENBQUM7b0JBQ1gsS0FBSyxFQUFFLDBCQUEwQjtpQkFDbEMsQ0FBQztTQUNIO0tBQ0Y7Q0FDRixDQUFDO0FBRUYsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSx1QkFBNEIsQ0FBQztBQUVqQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixRQUFRO0lBQ1IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztRQUNwQix1QkFBdUIsR0FBRyxJQUFBLCtCQUF1QixFQUFDLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtRQUNsQyxPQUFPO1FBQ1AsSUFBSSxzQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1lBQ3hDLFNBQVMsRUFBRSxJQUFJLDRCQUFzQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtnQkFDOUQsR0FBRyxxQkFBcUI7YUFDekIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxx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QUFFLENBQUM7NEJBQ1gsR0FBRyx1QkFBdUIsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7NEJBQ3BFLFlBQVksRUFBRSxDQUFDO29DQUNiLFNBQVMsRUFBRSxhQUFhO29DQUN4QixJQUFJLEVBQUUsa0JBQWtCO29DQUN4QixRQUFRLEVBQUUsSUFBSTtpQ0FDZixDQUFDO3lCQUNILENBQUM7b0JBQ0YsT0FBTyxFQUFFLENBQUM7NEJBQ1IsSUFBSSxFQUFFLGtCQUFrQjs0QkFDeEIsTUFBTSxFQUFFO2dDQUNOLFVBQVUsRUFBRSxZQUFZO2dDQUN4QixRQUFRLEVBQUUsS0FBSzs2QkFDaEI7eUJBQ0YsQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5pbXBvcnQgeyBTaXplLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWVzIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBFa3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMsIEVrc0NvbnRhaW5lckRlZmluaXRpb24sIEVrc0pvYkRlZmluaXRpb24sIEltYWdlUHVsbFBvbGljeSwgRWtzVm9sdW1lLCBFbXB0eURpck1lZGl1bVR5cGUgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQ2ZuSm9iRGVmaW5pdGlvblByb3BzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWJhdGNoJztcblxuLy8gR0lWRU5cbmNvbnN0IGRlZmF1bHRDb250YWluZXJQcm9wczogRWtzQ29udGFpbmVyRGVmaW5pdGlvblByb3BzID0ge1xuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG59O1xuXG5jb25zdCBkZWZhdWx0RXhwZWN0ZWRQcm9wczogQ2ZuSm9iRGVmaW5pdGlvblByb3BzID0ge1xuICB0eXBlOiAnY29udGFpbmVyJyxcbiAgZWtzUHJvcGVydGllczoge1xuICAgIHBvZFByb3BlcnRpZXM6IHtcbiAgICAgIGNvbnRhaW5lcnM6IFt7XG4gICAgICAgIGltYWdlOiAnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyxcbiAgICAgIH1dLFxuICAgIH0sXG4gIH0sXG59O1xuXG5sZXQgc3RhY2s6IFN0YWNrO1xubGV0IHBhc2NhbENhc2VFeHBlY3RlZFByb3BzOiBhbnk7XG5cbmRlc2NyaWJlKCdla3MgY29udGFpbmVyJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHBhc2NhbENhc2VFeHBlY3RlZFByb3BzID0gY2FwaXRhbGl6ZVByb3BlcnR5TmFtZXMoc3RhY2ssIGRlZmF1bHRFeHBlY3RlZFByb3BzKTtcbiAgfSk7XG5cbiAgdGVzdCgnZWtzIGNvbnRhaW5lciBkZWZhdWx0cycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgYXJncycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBhcmdzOiBbJ2FyZzEnLCAnYXJnMiddLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBBcmdzOiBbJ2FyZzEnLCAnYXJnMiddLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgY29tbWFuZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBjb21tYW5kOiBbJ2VjaG8nLCAnYmFyJ10sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIENvbW1hbmQ6IFsnZWNobycsICdiYXInXSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGNwdUxpbWl0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGNwdUxpbWl0OiAyNTYsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgICAgICBMaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBjcHVSZXNlcnZhdGlvbicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBjcHVSZXNlcnZhdGlvbjogMjU2LFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICAgICAgUmVxdWVzdHM6IHtcbiAgICAgICAgICAgICAgICBjcHU6IDI1NixcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBtZW1vcnlMaW1pdE1pQicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBtZW1vcnlMaW1pdDogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgICAgICBMaW1pdHM6IHtcbiAgICAgICAgICAgICAgICBtZW1vcnk6ICcyMDQ4TWknLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIG1lbW9yeVJlc2VydmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIG1lbW9yeVJlc2VydmF0aW9uOiBTaXplLm1lYmlieXRlcygyMDQ4KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgICAgIFJlcXVlc3RzOiB7XG4gICAgICAgICAgICAgICAgbWVtb3J5OiAnMjA0OE1pJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBncHVMaW1pdCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBncHVMaW1pdDogMjAsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgICAgICBMaW1pdHM6IHtcbiAgICAgICAgICAgICAgICAnbnZpZGlhLmNvbS9ncHUnOiAyMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBncHVSZXNlcnZhdGlvbicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICBncHVSZXNlcnZhdGlvbjogMjAsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgICAgICBSZXF1ZXN0czoge1xuICAgICAgICAgICAgICAgICdudmlkaWEuY29tL2dwdSc6IDIwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHJlc291cmNlIHJlcXVlc3RzIGFuZCBsaW1pdHMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgY3B1TGltaXQ6IDI1NixcbiAgICAgICAgY3B1UmVzZXJ2YXRpb246IDEyOCxcbiAgICAgICAgbWVtb3J5TGltaXQ6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgICBtZW1vcnlSZXNlcnZhdGlvbjogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgICAgIGdwdUxpbWl0OiAyMCxcbiAgICAgICAgZ3B1UmVzZXJ2YXRpb246IDEwLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgICAgICAgTGltaXRzOiB7XG4gICAgICAgICAgICAgICAgJ2NwdSc6IDI1NixcbiAgICAgICAgICAgICAgICAnbWVtb3J5JzogJzIwNDhNaScsXG4gICAgICAgICAgICAgICAgJ252aWRpYS5jb20vZ3B1JzogMjAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJlcXVlc3RzOiB7XG4gICAgICAgICAgICAgICAgJ2NwdSc6IDEyOCxcbiAgICAgICAgICAgICAgICAnbWVtb3J5JzogJzIwNDhNaScsXG4gICAgICAgICAgICAgICAgJ252aWRpYS5jb20vZ3B1JzogMTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgZW52JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIHZhcjogJ3ZhbCcsXG4gICAgICAgICAgYm9vOiAnYmFoJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgRW52OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAndmFyJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ3ZhbCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBOYW1lOiAnYm9vJyxcbiAgICAgICAgICAgICAgICBWYWx1ZTogJ2JhaCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgaW1hZ2VQdWxsUG9saWN5JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIGltYWdlUHVsbFBvbGljeTogSW1hZ2VQdWxsUG9saWN5Lk5FVkVSLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBJbWFnZVB1bGxQb2xpY3k6ICdOZXZlcicsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBuYW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIG5hbWU6ICdteUNvbnRhaW5lck5hbWUnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBOYW1lOiAnbXlDb250YWluZXJOYW1lJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHByaXZpbGVnZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgU2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgICAgIFByaXZpbGVnZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgcmVhZG9ubHlGaWxlU3lzdGVtJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHJlYWRvbmx5Um9vdEZpbGVzeXN0ZW06IHRydWUsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFNlY3VyaXR5Q29udGV4dDoge1xuICAgICAgICAgICAgICBSZWFkT25seVJvb3RGaWxlc3lzdGVtOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIHJ1bkFzR3JvdXAnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgcnVuQXNHcm91cDogMSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgU2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgICAgIFJ1bkFzR3JvdXA6IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgcnVuQXNSb290JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZkVrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHJ1bkFzUm9vdDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgU2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgICAgIFJ1bkFzTm9uUm9vdDogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgcnVuQXNVc2VyJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICAgIHJ1bkFzVXNlcjogOTAsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFNlY3VyaXR5Q29udGV4dDoge1xuICAgICAgICAgICAgICBSdW5Bc1VzZXI6IDkwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGVtcHR5RGlyIHZvbHVtZXMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgICAgdm9sdW1lczogW1xuICAgICAgICAgIEVrc1ZvbHVtZS5lbXB0eURpcih7XG4gICAgICAgICAgICBuYW1lOiAnZW1wdHlEaXJOYW1lJyxcbiAgICAgICAgICAgIG1lZGl1bTogRW1wdHlEaXJNZWRpdW1UeXBlLkRJU0ssXG4gICAgICAgICAgICBtb3VudFBhdGg6ICcvbW91bnQvcGF0aCcsXG4gICAgICAgICAgICByZWFkb25seTogZmFsc2UsXG4gICAgICAgICAgICBzaXplTGltaXQ6IFNpemUubWViaWJ5dGVzKDIwNDgpLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBWb2x1bWVNb3VudHM6IFt7XG4gICAgICAgICAgICAgIE1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgICAgICAgICAgTmFtZTogJ2VtcHR5RGlyTmFtZScsXG4gICAgICAgICAgICAgIFJlYWRPbmx5OiBmYWxzZSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFZvbHVtZXM6IFt7XG4gICAgICAgICAgICBOYW1lOiAnZW1wdHlEaXJOYW1lJyxcbiAgICAgICAgICAgIEVtcHR5RGlyOiB7XG4gICAgICAgICAgICAgIE1lZGl1bTogJycsXG4gICAgICAgICAgICAgIFNpemVMaW1pdDogJzIwNDhNaScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgaG9zdFBhdGggdm9sdW1lcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICB2b2x1bWVzOiBbRWtzVm9sdW1lLmhvc3RQYXRoKHtcbiAgICAgICAgICBuYW1lOiAnaG9zdFBhdGhOYW1lJyxcbiAgICAgICAgICBob3N0UGF0aDogJ2hvc3RQYXRoUGF0aCcsXG4gICAgICAgICAgbW91bnRQYXRoOiAnL21vdW50L3BhdGgnLFxuICAgICAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgICAgICB9KV0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFZvbHVtZU1vdW50czogW3tcbiAgICAgICAgICAgICAgTW91bnRQYXRoOiAnL21vdW50L3BhdGgnLFxuICAgICAgICAgICAgICBOYW1lOiAnaG9zdFBhdGhOYW1lJyxcbiAgICAgICAgICAgICAgUmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBWb2x1bWVzOiBbe1xuICAgICAgICAgICAgTmFtZTogJ2hvc3RQYXRoTmFtZScsXG4gICAgICAgICAgICBIb3N0UGF0aDoge1xuICAgICAgICAgICAgICBQYXRoOiAnaG9zdFBhdGhQYXRoJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBzZWNyZXQgdm9sdW1lcywgYW5kIGVuc3VyZXMgb3B0aW9uYWwgZGVmYXVsdHMgdG8gdHJ1ZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbmV3IEVrc0pvYkRlZmluaXRpb24oc3RhY2ssICdFa3NKb2JEZWZuJywge1xuICAgICAgY29udGFpbmVyOiBuZXcgRWtzQ29udGFpbmVyRGVmaW5pdGlvbihzdGFjaywgJ0Vjc0VjMkNvbnRhaW5lcicsIHtcbiAgICAgICAgLi4uZGVmYXVsdENvbnRhaW5lclByb3BzLFxuICAgICAgICB2b2x1bWVzOiBbRWtzVm9sdW1lLnNlY3JldCh7XG4gICAgICAgICAgbmFtZTogJ3NlY3JldFZvbHVtZU5hbWUnLFxuICAgICAgICAgIHNlY3JldE5hbWU6ICdteUt1YmVTZWNyZXQnLFxuICAgICAgICAgIG1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgICAgICByZWFkb25seTogdHJ1ZSxcbiAgICAgICAgfSldLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBWb2x1bWVNb3VudHM6IFt7XG4gICAgICAgICAgICAgIE1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgICAgICAgICAgUmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBWb2x1bWVzOiBbe1xuICAgICAgICAgICAgTmFtZTogJ3NlY3JldFZvbHVtZU5hbWUnLFxuICAgICAgICAgICAgU2VjcmV0OiB7XG4gICAgICAgICAgICAgIFNlY3JldE5hbWU6ICdteUt1YmVTZWNyZXQnLFxuICAgICAgICAgICAgICBPcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNwZWN0cyBhZGRWb2x1bWUoKSB3aXRoIGVtcHR5RGlyIHZvbHVtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGpvYkRlZm4gPSBuZXcgRWtzSm9iRGVmaW5pdGlvbihzdGFjaywgJ0Vrc0pvYkRlZm4nLCB7XG4gICAgICBjb250YWluZXI6IG5ldyBFa3NDb250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnRWNzRWMyQ29udGFpbmVyJywge1xuICAgICAgICAuLi5kZWZhdWx0Q29udGFpbmVyUHJvcHMsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBqb2JEZWZuLmNvbnRhaW5lci5hZGRWb2x1bWUoRWtzVm9sdW1lLmVtcHR5RGlyKHtcbiAgICAgIG5hbWU6ICdlbXB0eURpck5hbWUnLFxuICAgICAgbWVkaXVtOiBFbXB0eURpck1lZGl1bVR5cGUuRElTSyxcbiAgICAgIG1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgIHJlYWRvbmx5OiBmYWxzZSxcbiAgICAgIHNpemVMaW1pdDogU2l6ZS5tZWJpYnl0ZXMoMjA0OCksXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkJhdGNoOjpKb2JEZWZpbml0aW9uJywge1xuICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMsXG4gICAgICBFa3NQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFBvZFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMsXG4gICAgICAgICAgQ29udGFpbmVyczogW3tcbiAgICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcy5Db250YWluZXJzWzBdLFxuICAgICAgICAgICAgVm9sdW1lTW91bnRzOiBbe1xuICAgICAgICAgICAgICBNb3VudFBhdGg6ICcvbW91bnQvcGF0aCcsXG4gICAgICAgICAgICAgIE5hbWU6ICdlbXB0eURpck5hbWUnLFxuICAgICAgICAgICAgICBSZWFkT25seTogZmFsc2UsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBWb2x1bWVzOiBbe1xuICAgICAgICAgICAgTmFtZTogJ2VtcHR5RGlyTmFtZScsXG4gICAgICAgICAgICBFbXB0eURpcjoge1xuICAgICAgICAgICAgICBNZWRpdW06ICcnLFxuICAgICAgICAgICAgICBTaXplTGltaXQ6ICcyMDQ4TWknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3BlY3RzIGFkZFZvbHVtZSgpIHdpdGggaG9zdFBhdGggdm9sdW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgam9iRGVmbiA9IG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRWtzSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGpvYkRlZm4uY29udGFpbmVyLmFkZFZvbHVtZShFa3NWb2x1bWUuaG9zdFBhdGgoe1xuICAgICAgbmFtZTogJ2hvc3RQYXRoTmFtZScsXG4gICAgICBob3N0UGF0aDogJ2hvc3RQYXRoUGF0aCcsXG4gICAgICBtb3VudFBhdGg6ICcvbW91bnQvcGF0aCcsXG4gICAgICByZWFkb25seTogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QmF0Y2g6OkpvYkRlZmluaXRpb24nLCB7XG4gICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcyxcbiAgICAgIEVrc1Byb3BlcnRpZXM6IHtcbiAgICAgICAgUG9kUHJvcGVydGllczoge1xuICAgICAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLkVrc1Byb3BlcnRpZXMuUG9kUHJvcGVydGllcyxcbiAgICAgICAgICBDb250YWluZXJzOiBbe1xuICAgICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLkNvbnRhaW5lcnNbMF0sXG4gICAgICAgICAgICBWb2x1bWVNb3VudHM6IFt7XG4gICAgICAgICAgICAgIE1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgICAgICAgICAgTmFtZTogJ2hvc3RQYXRoTmFtZScsXG4gICAgICAgICAgICAgIFJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgVm9sdW1lczogW3tcbiAgICAgICAgICAgIE5hbWU6ICdob3N0UGF0aE5hbWUnLFxuICAgICAgICAgICAgSG9zdFBhdGg6IHtcbiAgICAgICAgICAgICAgUGF0aDogJ2hvc3RQYXRoUGF0aCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzcGVjdHMgYWRkVm9sdW1lKCkgd2l0aCBzZWNyZXQgdm9sdW1lIChvcHRpb25hbDogZmFsc2UpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgam9iRGVmbiA9IG5ldyBFa3NKb2JEZWZpbml0aW9uKHN0YWNrLCAnRUtTSm9iRGVmbicsIHtcbiAgICAgIGNvbnRhaW5lcjogbmV3IEVrc0NvbnRhaW5lckRlZmluaXRpb24oc3RhY2ssICdFY3NFYzJDb250YWluZXInLCB7XG4gICAgICAgIC4uLmRlZmF1bHRDb250YWluZXJQcm9wcyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGpvYkRlZm4uY29udGFpbmVyLmFkZFZvbHVtZShFa3NWb2x1bWUuc2VjcmV0KHtcbiAgICAgIG5hbWU6ICdzZWNyZXRWb2x1bWVOYW1lJyxcbiAgICAgIHNlY3JldE5hbWU6ICdzZWNyZXROYW1lJyxcbiAgICAgIG9wdGlvbmFsOiBmYWxzZSxcbiAgICAgIG1vdW50UGF0aDogJy9tb3VudC9wYXRoJyxcbiAgICAgIHJlYWRvbmx5OiB0cnVlLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpCYXRjaDo6Sm9iRGVmaW5pdGlvbicsIHtcbiAgICAgIC4uLnBhc2NhbENhc2VFeHBlY3RlZFByb3BzLFxuICAgICAgRWtzUHJvcGVydGllczoge1xuICAgICAgICBQb2RQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgLi4ucGFzY2FsQ2FzZUV4cGVjdGVkUHJvcHMuRWtzUHJvcGVydGllcy5Qb2RQcm9wZXJ0aWVzLFxuICAgICAgICAgIENvbnRhaW5lcnM6IFt7XG4gICAgICAgICAgICAuLi5wYXNjYWxDYXNlRXhwZWN0ZWRQcm9wcy5Fa3NQcm9wZXJ0aWVzLlBvZFByb3BlcnRpZXMuQ29udGFpbmVyc1swXSxcbiAgICAgICAgICAgIFZvbHVtZU1vdW50czogW3tcbiAgICAgICAgICAgICAgTW91bnRQYXRoOiAnL21vdW50L3BhdGgnLFxuICAgICAgICAgICAgICBOYW1lOiAnc2VjcmV0Vm9sdW1lTmFtZScsXG4gICAgICAgICAgICAgIFJlYWRPbmx5OiB0cnVlLFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgVm9sdW1lczogW3tcbiAgICAgICAgICAgIE5hbWU6ICdzZWNyZXRWb2x1bWVOYW1lJyxcbiAgICAgICAgICAgIFNlY3JldDoge1xuICAgICAgICAgICAgICBTZWNyZXROYW1lOiAnc2VjcmV0TmFtZScsXG4gICAgICAgICAgICAgIE9wdGlvbmFsOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19