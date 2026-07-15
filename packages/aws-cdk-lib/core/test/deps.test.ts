import { Construct } from 'constructs';
import * as core from '../lib';
import { Names } from '../lib';
import { dispatchDependencyOperation } from '../lib/private/deps';

describe('deps', () => {
  describe('dependency methods', () => {
    test('can explicitly add a dependency between resources', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });

      resource1.addResourceDependency(resource2);

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
      resource1.addResourceDependency(resource2);
      resource1.removeResourceDependency(resource2);

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

      resource1.addResourceDependency(resource2);
      // Adding the same resource dependency twice should be a no-op
      resource1.addDependency(resource2);
      resource1.addDependency(resource3);
      expect(stack1.dependencies.length).toEqual(1);
      expect(stack1.dependencies[0].node.id).toEqual(stack2.node.id);
      // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
      expect(resource1.obtainDependencies().map(x => x.node.path)).toEqual([resource3.node.path, resource2.node.path]);

      resource1.removeResourceDependency(resource2);
      // For symmetry, removing a dependency that doesn't exist should be a no-op
      resource1.removeResourceDependency(resource2);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('do nothing if source is target', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      resource1.addResourceDependency(resource1);

      expect(app.synth().getStackByName(stack.stackName).template.Resources).toEqual({
        Resource1: {
          Type: 'Test::Resource::Fake1',
        },
      });
    });

    test('handle source being common stack', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });

      // If source is the common stack, this should be a noop
      dispatchDependencyOperation({
        kind: 'add',
        source: stack1,
        target: resource1,
        reason: 'test',
      });
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('throws error if target is common stack', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });

      expect(() => dispatchDependencyOperation({
        kind: 'add',
        source: resource1,
        target: stack1,
        reason: 'test',
      })).toThrow(/cannot depend on /);
    });

    test('can explicitly add, obtain, and remove dependencies across nested stacks', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      const construct1 = new Construct(stack1, 'CommonConstruct');
      // Use a really long construct id to identify issues between Names.uniqueId and Names.uniqueResourceName
      const nestedStack1 = new core.Stack(construct1, 'TestNestedStack1');
      const nestedStack2 = new core.Stack(construct1, 'TestNestedStack2');
      const resource1 = new core.CfnResource(nestedStack1, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(nestedStack2, 'Resource2', { type: 'Test::Resource::Fake2' });

      resource1.addDependency(resource2);
      // Adding the same resource dependency twice should be a no-op
      resource1.addDependency(resource2);
      expect(nestedStack1.dependencies.length).toEqual(1);
      expect(nestedStack1.dependencies[0].node.id).toEqual(nestedStack2.node.id);

      resource1.removeDependency(resource2);
      // For symmetry, removing a dependency that doesn't exist should be a no-op
      resource1.removeDependency(resource2);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('node.addDependency stack dependencies should not be superlinear in size of stack', () => {
      const nStacks = 10;
      const baseN = 35;

      const growthFactor = 4; // Should take 4x the time, not 16x (or worse)
      const errorMargin = 2; // Have some measurement margin of error

      const small = runTest(baseN);
      const large = runTest(baseN * growthFactor);

      console.log({ small, large });

      expect(large).toBeLessThan(small * growthFactor * errorMargin);

      function runTest(nResources: number) {
        const start = Date.now();

        const app = new core.App();

        let lastStack: core.Stack | undefined;
        for (let i = 0; i < nStacks; i++) {
          const stack = new core.Stack(app, `TestStack${i}`);
          for (let j = 0; j < nResources; j++) {
            new core.CfnResource(stack, `Resource${j}`, { type: 'Test::Resource::Fake' });
          }
          lastStack?.node.addDependency(stack);
          lastStack = stack;
        }

        app.synth();

        return Date.now() - start;
      }
    });
  });
});
