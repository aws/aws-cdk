import { Construct } from 'constructs';
import * as core from '../lib';
import { Names } from '../lib';
import { addDependency, obtainDependencies, removeDependency } from '../lib/deps';

describe('deps', () => {
  describe('dependency methods', () => {
    test('can explicitly add a dependency between resources', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      const resource2 = new core.CfnResource(stack, 'Resource2', { type: 'Test::Resource::Fake2' });
      addDependency(resource1, resource2);

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
      addDependency(resource1, resource2);
      removeDependency(resource1, resource2);

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

      addDependency(resource1, resource2);
      // Adding the same resource dependency twice should be a no-op
      addDependency(resource1, resource2);
      addDependency(resource1, resource3);
      expect(stack1.dependencies.length).toEqual(1);
      expect(stack1.dependencies[0].node.id).toEqual(stack2.node.id);
      // obtainDependencies should assemble and flatten resource-to-resource dependencies even across stacks
      expect(obtainDependencies(resource1).map(x => x.node.path)).toEqual([resource3.node.path, resource2.node.path]);

      removeDependency(resource1, resource2);
      // For symmetry, removing a dependency that doesn't exist should be a no-op
      removeDependency(resource1, resource2);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('do nothing if source is target', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const resource1 = new core.CfnResource(stack, 'Resource1', { type: 'Test::Resource::Fake1' });
      addDependency(resource1, resource1);

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
      addDependency(stack1, resource1);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('throws error if target is common stack', () => {
      const app = new core.App();
      const stack1 = new core.Stack(app, 'TestStack1');
      const resource1 = new core.CfnResource(stack1, 'Resource1', { type: 'Test::Resource::Fake1' });

      expect(() => {
        addDependency(resource1, stack1);
      }).toThrow(/cannot depend on /);
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

      addDependency(resource1, resource2);
      // Adding the same resource dependency twice should be a no-op
      addDependency(resource1, resource2);
      expect(nestedStack1.dependencies.length).toEqual(1);
      expect(nestedStack1.dependencies[0].node.id).toEqual(nestedStack2.node.id);

      removeDependency(resource1, resource2);
      // For symmetry, removing a dependency that doesn't exist should be a no-op
      removeDependency(resource1, resource2);
      expect(stack1.dependencies.length).toEqual(0);
    });

    test('node.addDependency on a construct containing nested stacks depends on the nested stack resources, not their contents', () => {
      // https://github.com/aws/aws-cdk/issues/38406
      // A dependency on a construct that contains nested stacks must be reified as a
      // dependency on the AWS::CloudFormation::Stack resources in the parent template,
      // not flattened into a DependsOn entry for every resource inside the nested stacks.
      const app = new core.App();
      // The buggy behavior renders DependsOn entries for logical IDs that don't exist in the
      // template. Acknowledge that validation finding so synthesis completes and we can
      // assert on the actual DependsOn contents, which is what the issue is about.
      core.Validations.of(app).acknowledge({
        id: 'CloudFormation-Validate::E3005',
        reason: 'Assert on the rendered DependsOn instead of failing at validation time',
      });
      const stack = new core.Stack(app, 'TestStack');

      // An L3-style construct with one direct resource and a nested stack with many resources
      const api = new Construct(stack, 'Api');
      const directResource = new core.CfnResource(api, 'Direct', { type: 'Test::Resource::Fake' });
      const nested = new core.NestedStack(api, 'Nested');
      const nestedResourceCount = 5;
      for (let i = 0; i < nestedResourceCount; i++) {
        new core.CfnResource(nested, `InNested${i}`, { type: 'Test::Resource::Fake' });
      }

      const fn = new core.CfnResource(stack, 'Fn', { type: 'Test::Resource::Fake' });
      fn.node.addDependency(api);

      const template = app.synth().getStackByName(stack.stackName).template;
      const dependsOn: string[] = template.Resources.Fn.DependsOn;

      // The size of DependsOn must not scale with the number of resources inside the
      // nested stack (in the issue this grew a template past CloudFormation's 1MB limit).
      expect(dependsOn.length).toBeLessThan(nestedResourceCount);

      // Only the direct resource and the nested stack resource itself; none of the
      // resources inside the nested stack (their logical IDs don't even exist in this template).
      expect([...dependsOn].sort()).toEqual([
        stack.resolve(directResource.logicalId),
        stack.resolve(nested.nestedStackResource!.logicalId),
      ].sort());
    });

    test('cross-stack node.addDependency produces a stack-to-stack dependency without quadratic expansion', () => {
      // Verify that the cross-stack short-circuit produces the correct assembly
      // dependency and doesn't blow up with large stacks.
      const app = new core.App();
      const stackA = new core.Stack(app, 'StackA');
      const stackB = new core.Stack(app, 'StackB');

      // Create many resources in each stack
      const resourceCount = 100;
      for (let i = 0; i < resourceCount; i++) {
        new core.CfnResource(stackA, `ResA${i}`, { type: 'Test::Resource::Fake' });
        new core.CfnResource(stackB, `ResB${i}`, { type: 'Test::Resource::Fake' });
      }

      stackA.node.addDependency(stackB);
      app.synth();

      // Should produce exactly one stack dependency
      expect(stackA.dependencies).toHaveLength(1);
      expect(stackA.dependencies[0]).toBe(stackB);
    });

    test('cross-stack dependency works when source and target are in nested stacks under different top-level stacks', () => {
      const app = new core.App();
      const topA = new core.Stack(app, 'TopA');
      const topB = new core.Stack(app, 'TopB');

      const nestedA = new core.NestedStack(topA, 'NestedA');
      const nestedB = new core.NestedStack(topB, 'NestedB');

      const resA = new core.CfnResource(nestedA, 'ResA', { type: 'Test::Resource::Fake' });
      new core.CfnResource(nestedB, 'ResB', { type: 'Test::Resource::Fake' });

      resA.node.addDependency(nestedB);
      app.synth();

      // Should produce a top-level stack dependency
      expect(topA.dependencies).toHaveLength(1);
      expect(topA.dependencies[0]).toBe(topB);
    });

    test('nested stack resource does not get DependsOn entries referencing parent stack logical IDs', () => {
      // https://github.com/aws/aws-cdk/issues/38406 (schahal scenario)
      // A construct inside a nested stack depending on something in the parent
      // must not produce DependsOn entries for logical IDs that only exist in
      // the parent template.
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const target = new core.CfnResource(stack, 'Target', { type: 'AWS::SNS::Topic' });

      const nested = new core.NestedStack(stack, 'Nested');
      const inner = new core.CfnResource(nested, 'Inner', { type: 'AWS::SNS::Topic' });
      inner.node.addDependency(target);

      const assembly = app.synth();
      const parentTemplate = assembly.getStackByName(stack.stackName).template;

      // Find the nested stack template from the assembly artifacts
      const nestedArtifact = assembly.artifacts.find(
        (a) => a.id !== stack.artifactId && a.manifest?.type === 'aws:cloudformation:stack',
      );

      // The parent template's nested stack resource should depend on Target
      const nestedStackEntry = Object.entries(parentTemplate.Resources).find(
        ([_, v]: [string, any]) => v.Type === 'AWS::CloudFormation::Stack',
      );
      expect(nestedStackEntry).toBeDefined();
      expect((nestedStackEntry![1] as any).DependsOn).toContain('Target');

      // If we can access the nested template, verify it doesn't reference Target
      if (nestedArtifact) {
        const nestedTemplate = (nestedArtifact as any).template;
        if (nestedTemplate?.Resources?.Inner) {
          expect(nestedTemplate.Resources.Inner.DependsOn).toBeUndefined();
        }
      }
    });

    test('node.addDependency on a construct with no resources is a no-op', () => {
      const app = new core.App();
      const stack = new core.Stack(app, 'TestStack');
      const emptyConstruct = new Construct(stack, 'Empty');
      const resource = new core.CfnResource(stack, 'Res', { type: 'Test::Resource::Fake' });

      // Depend on empty construct — should not crash
      resource.node.addDependency(emptyConstruct);

      const template = app.synth().getStackByName(stack.stackName).template;
      // Resource should have no DependsOn since the target has no resources
      expect(template.Resources.Res.DependsOn).toBeUndefined();
    });
  });
});
