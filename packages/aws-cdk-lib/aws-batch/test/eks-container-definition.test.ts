import { capitalizePropertyNames } from './utils';
import { Size, Stack } from '../..';
import { Template } from '../../assertions';
import * as ecs from '../../aws-ecs';
import { CfnJobDefinitionProps, EksContainerDefinitionProps, EksContainerDefinition, EksJobDefinition, ImagePullPolicy, EksVolume, EmptyDirMediumType } from '../lib';

// GIVEN
const defaultContainerProps: EksContainerDefinitionProps = {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
};

const defaultExpectedProps: CfnJobDefinitionProps = {
  type: 'container',
  eksProperties: {
    podProperties: {
      containers: [{
        image: 'amazon/amazon-ecs-sample',
      }],
    },
  },
};

let stack: Stack;
let pascalCaseExpectedProps: any;

describe('eks container', () => {
  // GIVEN
  beforeEach(() => {
    stack = new Stack();
    pascalCaseExpectedProps = capitalizePropertyNames(stack, defaultExpectedProps);
  });

  test('eks container defaults', () => {
    // WHEN
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
    });
  });

  test('respects args', () => {
    // WHEN
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        args: ['arg1', 'arg2'],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        command: ['echo', 'bar'],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        cpuLimit: 256,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        cpuReservation: 256,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        memoryLimit: Size.mebibytes(2048),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        memoryReservation: Size.mebibytes(2048),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        gpuLimit: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        gpuReservation: 20,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        cpuLimit: 256,
        cpuReservation: 128,
        memoryLimit: Size.mebibytes(2048),
        memoryReservation: Size.mebibytes(2048),
        gpuLimit: 20,
        gpuReservation: 10,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        env: {
          var: 'val',
          boo: 'bah',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        imagePullPolicy: ImagePullPolicy.NEVER,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        name: 'myContainerName',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        readonlyRootFilesystem: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        runAsGroup: 1,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefEksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        runAsRoot: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        runAsUser: 90,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        volumes: [
          EksVolume.emptyDir({
            name: 'emptyDirName',
            medium: EmptyDirMediumType.DISK,
            mountPath: '/mount/path',
            readonly: false,
            sizeLimit: Size.mebibytes(2048),
          }),
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        volumes: [EksVolume.hostPath({
          name: 'hostPathName',
          hostPath: 'hostPathPath',
          mountPath: '/mount/path',
          readonly: true,
        })],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        volumes: [EksVolume.secret({
          name: 'secretVolumeName',
          secretName: 'myKubeSecret',
          mountPath: '/mount/path',
          readonly: true,
        })],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    const jobDefn = new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // WHEN
    jobDefn.container.addVolume(EksVolume.emptyDir({
      name: 'emptyDirName',
      medium: EmptyDirMediumType.DISK,
      mountPath: '/mount/path',
      readonly: false,
      sizeLimit: Size.mebibytes(2048),
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    const jobDefn = new EksJobDefinition(stack, 'EksJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // WHEN
    jobDefn.container.addVolume(EksVolume.hostPath({
      name: 'hostPathName',
      hostPath: 'hostPathPath',
      mountPath: '/mount/path',
      readonly: true,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
    const jobDefn = new EksJobDefinition(stack, 'EKSJobDefn', {
      container: new EksContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // WHEN
    jobDefn.container.addVolume(EksVolume.secret({
      name: 'secretVolumeName',
      secretName: 'secretName',
      optional: false,
      mountPath: '/mount/path',
      readonly: true,
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
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
