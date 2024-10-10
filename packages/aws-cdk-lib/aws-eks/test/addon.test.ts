import { Template } from '../../assertions';
import { App, CfnOutput, Stack } from '../../core';
import { Addon, KubernetesVersion, Cluster } from '../lib';

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
        Ref: 'Cluster9EE0221C',
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
        Ref: 'Cluster9EE0221C',
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
        Ref: 'Cluster9EE0221C',
      },
      PreserveOnDelete: false,
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
});
