import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { App, Stack } from 'aws-cdk-lib/core';
import * as eks from '../lib';
import { Addon, Cluster, KubernetesVersion, ResolveConflictsType } from '../lib';

describe('Addon', () => {
  let app: App;
  let stack: Stack;
  let cluster: Cluster;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack');
    cluster = new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_30,
    });
  });

  test('creates a new Addon', () => {
    // GIVEN

    // WHEN
    new Addon(stack, 'TestAddon', {
      addonName: 'test-addon',
      cluster,
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
    });
  });
  test('creates a new Addon with version', () => {
    // GIVEN
    const addonVersion = 'v1.3.0-eksbuild.1';

    // WHEN
    new Addon(stack, 'TestAddonWithVersion', {
      addonName: 'test-addon',
      addonVersion,
      cluster,
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      AddonVersion: addonVersion,
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
    });
  });
  test('create a new Addon with preserveOnDelete', () => {
    // GIVEN

    // WHEN
    new Addon(stack, 'TestAddonWithPreserveOnDelete', {
      addonName: 'test-addon',
      cluster,
      preserveOnDelete: false,
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      PreserveOnDelete: false,
    });
  });

  test('create a new Addon with configurationValues', () => {
    // WHEN
    new Addon(stack, 'TestAddonWithPreserveOnDelete', {
      addonName: 'test-addon',
      cluster,
      configurationValues: {
        replicaCount: 2,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      ConfigurationValues: '{\"replicaCount\":2}',
    });
  });

  test('create a new Addon with namespace', () => {
    // GIVEN

    // WHEN
    new Addon(stack, 'TestAddonWithNamespace', {
      addonName: 'test-addon',
      cluster,
      namespace: 'test-namespace',
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      NamespaceConfig: {
        Namespace: 'test-namespace',
      },
    });
  });

  test('create a new Addon with podIdentityAssociations', () => {
    // GIVEN
    const testRole = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('test.com'),
    });

    // WHEN
    new Addon(stack, 'TestAddonWithNamespace', {
      addonName: 'test-addon',
      cluster,
      podIdentityAssociations: [{
        addonRole: testRole,
        serviceAccount: 'test-serviceAccount',
      }],
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      PodIdentityAssociations: [{
        RoleArn: {
          'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'],
        },
        ServiceAccount: 'test-serviceAccount',
      }],
    });
  });

  test('create a new Addon with resolveConflicts', () => {
    // GIVEN

    // WHEN
    new Addon(stack, 'TestAddonWithNamespace', {
      addonName: 'test-addon',
      cluster,
      resolveConflicts: ResolveConflictsType.PRESERVE,
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      ResolveConflicts: 'PRESERVE',
    });
  });

  test('create a new Addon with ServiceAccountRole', () => {
    // GIVEN
    const testRole = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('test.com'),
    });

    // WHEN
    new Addon(stack, 'TestAddonWithNamespace', {
      addonName: 'test-addon',
      cluster,
      serviceAccountRole: testRole,
    });

    // THEN
    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::EKS::Addon', {
      AddonName: 'test-addon',
      ClusterName: {
        Ref: 'ClusterEB0386A7',
      },
      ServiceAccountRoleArn: {
        'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'],
      },
    });
  });

  test('creates an Addon from attributes', () => {
    // GIVEN
    const addonName = 'test-addon';
    const clusterName = 'my-cluster';

    // WHEN
    const addon = Addon.fromAddonAttributes(stack, 'ImportedAddon', {
      addonName,
      clusterName,
    });

    // THEN
    expect(addon.addonName).toEqual(addonName);
    expect(addon.addonArn).toBeDefined();
  });
  test('creates an Addon from a valid addon ARN', () => {
    // GIVEN
    const addonArn = 'arn:aws:eks:us-east-1:123456789012:addon/my-cluster/my-addon';

    // WHEN
    const addon = Addon.fromAddonArn(stack, 'ImportedAddon', addonArn);

    // THEN
    expect(addon.addonName).toEqual('my-addon');
    expect(addon.addonArn).toEqual(addonArn);
  });

  test('handles an ARN with a different resource name format', () => {
    // GIVEN
    const addonArn = 'arn:aws:eks:us-east-1:123456789012:addon/my-cluster/my-addon/90c81310-edbe-f297-f08b-154e35476d85';

    // WHEN
    const addon = Addon.fromAddonArn(stack, 'ImportedAddon', addonArn);

    // THEN
    expect(addon.addonName).toEqual('my-addon');
    expect(addon.addonArn).toEqual(addonArn);
  });

  test('applies removal policy', () => {
    new eks.Addon(stack, 'Addon', {
      cluster,
      addonName: 'vpc-cni',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    Template.fromStack(stack).hasResource('AWS::EKS::Addon', {
      DeletionPolicy: 'Retain',
    });
  });
});
