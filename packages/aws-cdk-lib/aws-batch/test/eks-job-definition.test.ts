import { Template } from '../../assertions';
import * as ecs from '../../aws-ecs';
import { CfnParameter, Stack, Validations } from '../../core';
import type { EksPodSecurityContext } from '../lib';
import { DnsPolicy, EksContainerDefinition, EksJobDefinition, EksSeccompProfile } from '../lib';

test('EcsJobDefinition respects dnsPolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    dnsPolicy: DnsPolicy.CLUSTER_FIRST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        DnsPolicy: DnsPolicy.CLUSTER_FIRST,
      },
    },
  });
});

test('EcsJobDefinition respects useHostNetwork', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    useHostNetwork: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        HostNetwork: true,
      },
    },
  });
});

test('EcsJobDefinition respects serviceAccount', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    serviceAccount: 'my-service-account',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        ServiceAccountName: 'my-service-account',
      },
    },
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const importedJob = EksJobDefinition.fromEksJobDefinitionArn(stack, 'importedJobDefinition',
    'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

  // THEN
  expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});

test.each([true, false])('set skipDeregisterOnUpdate property %s', (skipDeregisterOnUpdate) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefnWithSkip', {
    skipDeregisterOnUpdate,
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    ResourceRetentionPolicy: {
      SkipDeregisterOnUpdate: skipDeregisterOnUpdate,
    },
  });
});

describe('EksJobDefinition podSecurityContext', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
    // TODO: Remove this acknowledge once the bundled CFN validation schema includes the EKS security context properties
    Validations.of(stack).acknowledge({ id: 'CloudFormation-Validate::F3002', reason: 'Capabilities, SeccompProfile and the pod SecurityContext are newly launched properties not yet in the bundled schema' });
  });

  function jobWith(podSecurityContext?: EksPodSecurityContext) {
    return new EksJobDefinition(stack, 'EKSJobDefn', {
      container: new EksContainerDefinition(stack, 'EksContainer', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
      podSecurityContext,
    });
  }

  function podProperties(): any {
    const resources = Template.fromStack(stack).findResources('AWS::Batch::JobDefinition');
    return Object.values(resources)[0].Properties.EksProperties.PodProperties;
  }

  test('renders all fields', () => {
    const job = jobWith({
      fsGroup: 2000,
      runAsUser: 1000,
      runAsGroup: 3000,
      runAsNonRoot: true,
      seccompProfile: EksSeccompProfile.localhost('profiles/audit.json'),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      EksProperties: {
        PodProperties: {
          SecurityContext: {
            FsGroup: 2000,
            RunAsUser: 1000,
            RunAsGroup: 3000,
            RunAsNonRoot: true,
            SeccompProfile: { Type: 'Localhost', LocalhostProfile: 'profiles/audit.json' },
          },
        },
      },
    });
    expect(job.podSecurityContext?.fsGroup).toEqual(2000);
  });

  test('renders only the fields that are set', () => {
    jobWith({ seccompProfile: EksSeccompProfile.runtimeDefault() });

    expect(podProperties().SecurityContext).toEqual({ SeccompProfile: { Type: 'RuntimeDefault' } });
  });

  test('renders zero IDs', () => {
    jobWith({ fsGroup: 0, runAsUser: 0, runAsGroup: 0 });

    expect(podProperties().SecurityContext).toEqual({ FsGroup: 0, RunAsUser: 0, RunAsGroup: 0 });
  });

  test('omits the pod security context when not set', () => {
    jobWith();

    expect(podProperties().SecurityContext).toBeUndefined();
  });

  test('omits the pod security context when it is empty', () => {
    jobWith({});

    expect(podProperties().SecurityContext).toBeUndefined();
  });

  test.each([
    ['fsGroup', { fsGroup: -1 }, -1],
    ['runAsUser', { runAsUser: 2147483648 }, 2147483648],
    ['runAsGroup', { runAsGroup: 1.5 }, 1.5],
  ])('rejects an invalid %s', (name, context, value) => {
    expect(() => jobWith(context)).toThrow(`'podSecurityContext.${name}' must be an integer between 0 and 2147483647, got ${value}`);
  });

  test('accepts the maximum ID', () => {
    expect(() => jobWith({ fsGroup: 2147483647, runAsUser: 2147483647, runAsGroup: 2147483647 })).not.toThrow();
  });

  test('skips ID validation for tokens', () => {
    const id = new CfnParameter(stack, 'Id', { type: 'Number' }).valueAsNumber;
    jobWith({ fsGroup: id, runAsUser: id, runAsGroup: id });

    expect(podProperties().SecurityContext).toEqual({ FsGroup: { Ref: 'Id' }, RunAsUser: { Ref: 'Id' }, RunAsGroup: { Ref: 'Id' } });
  });
});
