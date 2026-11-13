import { capitalizePropertyNames } from './utils';
import { Template } from '../../assertions';
import * as ecs from '../../aws-ecs';
import { CfnParameter, Size, Stack, Validations } from '../../core';
import type { CfnJobDefinitionProps, EksContainerDefinitionProps } from '../lib';
import { EksContainerDefinition, EksJobDefinition, ImagePullPolicy, EksSeccompProfile, EksVolume, EmptyDirMediumType } from '../lib';

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

describe('eks container security context', () => {
  let secStack: Stack;

  beforeEach(() => {
    secStack = new Stack();
    // TODO: Remove this acknowledge once the bundled CFN validation schema includes the EKS security context properties
    Validations.of(secStack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'Capabilities, SeccompProfile and the pod SecurityContext are newly launched properties not yet in the bundled schema' });
  });

  function containerSecurityContext(): any {
    const resources = Template.fromStack(secStack).findResources('AWS::Batch::JobDefinition');
    return Object.values(resources)[0].Properties.EksProperties.PodProperties.Containers[0].SecurityContext;
  }

  function jobWith(props: Partial<EksContainerDefinitionProps>) {
    return new EksJobDefinition(secStack, 'EksJobDefn', {
      container: new EksContainerDefinition(secStack, 'EksContainer', {
        ...defaultContainerProps,
        ...props,
      }),
    });
  }

  test('renders linux capabilities to add and drop', () => {
    jobWith({
      linuxCapabilitiesToAdd: ['NET_BIND_SERVICE'],
      linuxCapabilitiesToDrop: ['ALL'],
    });

    expect(containerSecurityContext()).toEqual({
      RunAsNonRoot: true,
      Capabilities: { Add: ['NET_BIND_SERVICE'], Drop: ['ALL'] },
    });
  });

  test('omits empty capability lists', () => {
    jobWith({ linuxCapabilitiesToAdd: [], linuxCapabilitiesToDrop: [] });

    expect(containerSecurityContext()).toEqual({ RunAsNonRoot: true });
  });

  test('renders only the capability list that is set', () => {
    jobWith({ linuxCapabilitiesToDrop: ['ALL'] });

    expect(containerSecurityContext().Capabilities).toEqual({ Drop: ['ALL'] });
  });

  test.each([
    [EksSeccompProfile.runtimeDefault(), { Type: 'RuntimeDefault' }],
    [EksSeccompProfile.unconfined(), { Type: 'Unconfined' }],
    [EksSeccompProfile.localhost('profiles/audit.json'), { Type: 'Localhost', LocalhostProfile: 'profiles/audit.json' }],
  ])('renders seccomp profile %#', (seccompProfile, expected) => {
    jobWith({ seccompProfile });

    expect(containerSecurityContext().SeccompProfile).toEqual(expected);
  });

  test('exposes the new props on the container', () => {
    const profile = EksSeccompProfile.localhost('profiles/audit.json');
    const job = jobWith({
      linuxCapabilitiesToAdd: ['NET_ADMIN'],
      linuxCapabilitiesToDrop: ['ALL'],
      seccompProfile: profile,
    });

    expect(job.container.linuxCapabilitiesToAdd).toEqual(['NET_ADMIN']);
    expect(job.container.linuxCapabilitiesToDrop).toEqual(['ALL']);
    expect(job.container.seccompProfile).toBe(profile);
    expect(profile.type).toEqual('Localhost');
    expect(profile.localhostProfile).toEqual('profiles/audit.json');
  });

  test('leaves the security context unchanged when the new props are omitted', () => {
    jobWith({});

    expect(containerSecurityContext()).toEqual({ RunAsNonRoot: true });
  });

  test('rejects more than 64 capabilities', () => {
    const capabilities = Array.from({ length: 65 }, (_, i) => `CAPABILITY${i}`);
    expect(() => jobWith({ linuxCapabilitiesToAdd: capabilities }))
      .toThrow("'linuxCapabilitiesToAdd' can contain at most 64 capabilities, got 65");
  });

  test('accepts 64 capabilities', () => {
    const capabilities = Array.from({ length: 64 }, (_, i) => `CAPABILITY${i}`);
    expect(() => jobWith({ linuxCapabilitiesToDrop: capabilities })).not.toThrow();
  });

  test.each(['CAP_NET_ADMIN', 'cap_sys_time'])('rejects the CAP_ prefix in %p', (capability) => {
    expect(() => jobWith({ linuxCapabilitiesToDrop: [capability] }))
      .toThrow(/'linuxCapabilitiesToDrop' must not include the 'CAP_' prefix/);
  });

  test.each(['', 'X'.repeat(129)])('rejects a capability name of invalid length %#', (capability) => {
    expect(() => jobWith({ linuxCapabilitiesToAdd: [capability] }))
      .toThrow(/must be between 1 and 128 characters/);
  });

  test('skips capability validation for tokens', () => {
    const list = new CfnParameter(secStack, 'Caps', { type: 'CommaDelimitedList' }).valueAsList;
    const single = new CfnParameter(secStack, 'Cap').valueAsString;

    jobWith({ linuxCapabilitiesToAdd: list, linuxCapabilitiesToDrop: [single] });

    expect(containerSecurityContext().Capabilities).toEqual({ Add: { Ref: 'Caps' }, Drop: [{ Ref: 'Cap' }] });
  });

  test.each(['', 'p'.repeat(4096)])('rejects a localhost profile path of invalid length %#', (path) => {
    expect(() => EksSeccompProfile.localhost(path)).toThrow(/must be between 1 and 4095 characters/);
  });

  test('accepts a localhost profile path of 4095 characters and a token', () => {
    expect(() => EksSeccompProfile.localhost('p'.repeat(4095))).not.toThrow();
    expect(() => EksSeccompProfile.localhost(new CfnParameter(secStack, 'Path').valueAsString)).not.toThrow();
  });
});
