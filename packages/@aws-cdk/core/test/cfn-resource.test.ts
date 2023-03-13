import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { VALIDATE_SNAPSHOT_REMOVAL_POLICY } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { getWarnings } from './util';
import * as core from '../lib';
import { Names } from '../lib';

describe('cfn resource', () => {
  describe('._toCloudFormation', () => {
    test('does not call renderProperties with an undefined value', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

      let called = false;
      (resource as any).renderProperties = (val: any) => {
        called = true;
        expect(val).not.toBeNull();
      };

      expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
        DefaultResource: {
          Type: 'Test::Resource::Fake',
        },
      });
      expect(called).toEqual(true);
    });

    test('renders "Properties" for a resource that has only properties set to "false"', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      new core.CfnResource(stack, 'Resource', {
        type: 'Test::Resource::Fake',
        properties: {
          FakeProperty: false,
        },
      });

      expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
        Resource: {
          Type: 'Test::Resource::Fake',
          Properties: {
            FakeProperty: false,
          },
        },
      });
    });
  });

  describe('snapshot removal policy', () => {
    const supportedResources = [
      'AWS::EC2::Volume',
      'AWS::ElastiCache::CacheCluster',
      'AWS::ElastiCache::ReplicationGroup',
      'AWS::Neptune::DBCluster',
      'AWS::RDS::DBCluster',
      'AWS::RDS::DBInstance',
      'AWS::Redshift::Cluster',
    ];

    test.each(supportedResources) (
      'works as expected when used on supported resources (old behavior)', (resourceType) => {
        // GIVEN
        const app = new core.App();
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'Resource', {
          type: resourceType,
        });

        // WHEN
        resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);

        // THEN
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
          Resource: {
            Type: resourceType,
            DeletionPolicy: 'Snapshot',
            UpdateReplacePolicy: 'Snapshot',
          },
        });
      },
    );

    test.each(supportedResources) (
      'works as expected when used on supported resources (under feature flag)', (resourceType) => {
        // GIVEN
        const app = new core.App({ context: { [VALIDATE_SNAPSHOT_REMOVAL_POLICY]: true } });
        const stack = new core.Stack(app, 'TestStack');
        const resource = new core.CfnResource(stack, 'Resource', {
          type: resourceType,
        });

        // WHEN
        resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);

        // THEN
        expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
          Resource: {
            Type: resourceType,
            DeletionPolicy: 'Snapshot',
            UpdateReplacePolicy: 'Snapshot',
          },
        });
      },
    );

    test('warns on unsupported resources (without feature flag)', () => {
      // GIVEN
      const app = new core.App();
      const stack = new core.Stack(app);
      const resource = new core.CfnResource(stack, 'Resource', {
        type: 'AWS::Lambda::Function',
      });

      // WHEN
      resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT);

      // THEN
      expect(getWarnings(app.synth())).toEqual([
        {
          path: '/Default/Resource',
          message: 'AWS::Lambda::Function does not support snapshot removal policy. This policy will be ignored.',
        },
      ]);
    });

    test('fails on unsupported resources (under feature flag)', () => {
      // GIVEN
      const app = new core.App({ context: { [VALIDATE_SNAPSHOT_REMOVAL_POLICY]: true } });
      const stack = new core.Stack(app);
      const resource = new core.CfnResource(stack, 'Resource', {
        type: 'AWS::Lambda::Function',
      });

      // THEN
      expect(() => resource.applyRemovalPolicy(core.RemovalPolicy.SNAPSHOT)).toThrowError('AWS::Lambda::Function does not support snapshot removal policy');
    });
  });

  describe('dependency methods', () => {
    test('can explicitly add a dependency between resources', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
      resource1.addDependency(resource2);

      expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
        Resource1: {
          Type: 'Test::Resource::Fake1',
          DependsOn: [
            'Resource2',
          ],
        },
        Resource2: {
          Type: 'Test::Resource::Fake2',
        },
      });
    });

    test('can explicitly remove a dependency between resources', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
      resource1.addDependency(resource2);
      resource1.removeDependency(resource2);

      expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
        Resource1: {
          Type: 'Test::Resource::Fake1',
        },
        Resource2: {
          Type: 'Test::Resource::Fake2',
        },
      });
    });

    test('can explicitly add, obtain, and remove dependencies across stacks', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      // Use a really long construct id to identify issues between Names.uniqueId and Names.uniqueResourceName
      const reallyLongConstructId = 'A'.repeat(247);
      const stack2 = new core.Stack(app, reallyLongConstructId, { stackName: 'TestStack2' });
      // Sanity check since this test depends on the discrepancy
      expect(Names.uniqueId(stack2)).not.toBe(Names.uniqueResourceName(stack2, {}));
      const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack2, 'Resource2', { type: 'Test::Resource::Fake2' });
      const resource3 = new core.CfnResource(stack1, 'Resource3', { type: 'Test::Resource::Fake3' });

      resource1.addDependency(resource2);
      // Adding the same resource dependency twice should be a no-op
      resource1.addDependency(resource2);
      resource1.addDependency(resource3);
      expect(stack1.dependencies.length).toEqual(1);
      expect(stack1.dependencies[0].node.id).toEqual(stack2.node.id);
      // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
      expect(resource1.obtainDependencies().map(x => x.node.path)).toEqual([resource3.node.path, resource2.node.path]);

      resource1.removeDependency(resource2);
      // For symmetry, removing a dependency that doesn't exist should be a no-op
      resource1.removeDependency(resource2);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('can explicitly add, then replace dependencies across stacks', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      const stack2 = new core.Stack(app, 'TestStack2');
      const stack3 = new core.Stack(app, 'TestStack3');
      const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack2, 'Resource2', { type: 'Test::Resource::Fake2' });
      const resource3 = new core.CfnResource(stack3, 'Resource3', { type: 'Test::Resource::Fake3' });

      resource1.addDependency(resource2);
      // Adding the same resource dependency twice should be a no-op
      resource1.replaceDependency(resource2, resource3);
      expect(stack1.dependencies).toEqual([stack3]);
      // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
      expect(resource1.obtainDependencies().map(x => x.node.path)).toEqual([resource3.node.path]);

      // Replacing a dependency that doesn't exist should raise an exception
      expect(() => {
        resource1.replaceDependency(resource2, resource3);
      }).toThrow(/ does not depend on /);
    });

    test('do nothing if source is target', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      resource1.addDependency(resource1);

      expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
        Resource1: {
          Type: 'Test::Resource::Fake1',
        },
      });
    });

    test('do nothing if target does not synth', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');

      class NoSynthResource extends core.CfnResource {
        protected shouldSynthesize(): boolean {
          return false;
        }
      }

      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new NoSynthResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
      resource1.removeDependency(resource2);
      resource1.addDependency(resource2);

      expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
        Resource1: {
          Type: 'Test::Resource::Fake1',
        },
      });
    });

    test('replace throws an error if oldTarget is not depended on', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');

      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
      const resource3 = new core.CfnResource(stack, 'Resource3', { type: 'Test::Resource::Fake3' });
      expect(() => {
        resource1.replaceDependency(resource2, resource3);
      }).toThrow(/does not depend on/);
    });
  });

  test('applyRemovalPolicy default includes Update policy', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN);

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
      DefaultResource: {
        Type: 'Test::Resource::Fake',
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
    });
  });

  test('can switch off updating Update policy', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.applyRemovalPolicy(core.RemovalPolicy.RETAIN, {
      applyToUpdateReplacePolicy: false,
    });

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
      DefaultResource: {
        Type: 'Test::Resource::Fake',
        DeletionPolicy: 'Retain',
      },
    });
  });

  test('can add metadata', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });

    // WHEN
    resource.addMetadata('Beep', 'Boop');

    // THEN
    expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
      DefaultResource: {
        Type: 'Test::Resource::Fake',
        Metadata: {
          Beep: 'Boop',
        },
      },
    });
  });

  test('can read metadata', () => {
    // GIVEN
    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const resource = new core.CfnResource(stack, 'DefaultResource', { type: 'Test::Resource::Fake' });
    resource.addMetadata('Beep', 'Boop');

    // THEN
    expect(resource.getMetadata('Beep')).toEqual('Boop');
  });

  test('subclasses can override "shouldSynthesize" to lazy-determine if the resource should be included', () => {
    // GIVEN
    class HiddenCfnResource extends core.CfnResource {
      protected shouldSynthesize() {
        return false;
      }
    }

    const app = new core.App();
    const stack = new core.Stack(app, 'TestStack');
    const subtree = new Construct(stack, 'subtree');

    // WHEN
    new HiddenCfnResource(subtree, 'R1', { type: 'Foo::R1' });
    const r2 = new core.CfnResource(stack, 'R2', { type: 'Foo::R2' });

    // also try to take a dependency on the parent of `r1` and expect the dependency not to materialize
    r2.node.addDependency(subtree);

    // THEN - only R2 is synthesized
    expect(app.synth().getStackByName(stack.stackName).template?.Resources).toEqual({
      R2: {
        Type: 'Foo::R2',
        // No DependsOn!
      },
    });
  });

  test('CfnResource cannot be created outside Stack', () => {
    const app = new core.App();
    expect(() => {
      new core.CfnResource(app, 'Resource', {
        type: 'Some::Resource',
      });
    }).toThrow(/should be created in the scope of a Stack, but no Stack found/);
  });

  /**
   * Stages start a new scope, which does not count as a Stack anymore
   */
  test('CfnResource cannot be in Stage in Stack', () => {
    const app = new core.App();
    const stack = new core.Stack(app, 'Stack');
    const stage = new core.Stage(stack, 'Stage');
    expect(() => {
      new core.CfnResource(stage, 'Resource', {
        type: 'Some::Resource',
      });
    }).toThrow(/should be created in the scope of a Stack, but no Stack found/);
  });

  test('CfnResource has logical ID metadata with stack trace attached', () => {
    process.env.CDK_DEBUG = '1';
    try {
      const app = new core.App();
      const stack = new core.Stack(app, 'Stack');
      const res = new core.CfnResource(stack, 'SomeCfnResource', {
        type: 'Some::Resource',
      });

      // THEN
      const metadata = res.node.metadata.find(m => m.type === cxschema.ArtifactMetadataEntryType.LOGICAL_ID);
      expect(metadata).toBeDefined();
      expect(metadata?.trace).toBeDefined();
      expect(metadata?.trace?.length).toBeGreaterThan(0);
    } finally {
      delete process.env.CDK_DEBUG;
    }
  });
});
