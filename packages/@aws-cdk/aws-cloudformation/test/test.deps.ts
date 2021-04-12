import * as fs from 'fs';
import * as path from 'path';
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert-internal';
import { App, CfnResource, Stack } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Test } from 'nodeunit';
import { NestedStack } from '../lib';

export = {

  'resource dependencies': {

    'between two resources in a top-level stack'(test: Test) {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');
      const r1 = new CfnResource(stack, 'r1', { type: 'r1' });
      const r2 = new CfnResource(stack, 'r2', { type: 'r2' });

      // WHEN
      r1.addDependsOn(r2);

      // THEN
      test.deepEqual(app.synth().getStackArtifact(stack.artifactId).template, {
        Resources:
          { r1: { Type: 'r1', DependsOn: ['r2'] }, r2: { Type: 'r2' } },
      });

      test.done();
    },

    'resource in nested stack depends on a resource in the parent stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const parent = new Stack(undefined, 'root');
      const nested = new NestedStack(parent, 'Nested');
      const resourceInParent = new CfnResource(parent, 'ResourceInParent', { type: 'PARENT' });
      const resourceInNested = new CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });

      // WHEN
      addDep(resourceInNested, resourceInParent);

      // THEN: the dependency needs to transfer from the resource within the
      // nested stack to the nested stack resource itself so the nested stack
      // will only be deployed the dependent resource
      expect(parent).to(haveResource('AWS::CloudFormation::Stack', { DependsOn: ['ResourceInParent'] }, ResourcePart.CompleteDefinition));
      expect(nested).toMatch({ Resources: { ResourceInNested: { Type: 'NESTED' } } }); // no DependsOn for the actual resource
      test.done();
    }),

    'resource in nested stack depends on a resource in a grandparent stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const grantparent = new Stack(undefined, 'Grandparent');
      const parent = new NestedStack(grantparent, 'Parent');
      const nested = new NestedStack(parent, 'Nested');
      const resourceInGrandparent = new CfnResource(grantparent, 'ResourceInGrandparent', { type: 'GRANDPARENT' });
      const resourceInNested = new CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });

      // WHEN
      addDep(resourceInNested, resourceInGrandparent);

      // THEN: the dependency needs to transfer from the resource within the
      // nested stack to the *parent* nested stack
      expect(grantparent).to(haveResource('AWS::CloudFormation::Stack', { DependsOn: ['ResourceInGrandparent'] }, ResourcePart.CompleteDefinition));
      expect(nested).toMatch({ Resources: { ResourceInNested: { Type: 'NESTED' } } }); // no DependsOn for the actual resource
      test.done();
    }),

    'resource in parent stack depends on resource in nested stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const parent = new Stack(undefined, 'root');
      const nested = new NestedStack(parent, 'Nested');
      const resourceInParent = new CfnResource(parent, 'ResourceInParent', { type: 'PARENT' });
      const resourceInNested = new CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });

      // WHEN
      addDep(resourceInParent, resourceInNested);

      // THEN: resource in parent needs to depend on the nested stack
      expect(parent).to(haveResource('PARENT', {
        DependsOn: [parent.resolve(nested.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));
      test.done();
    }),

    'resource in grantparent stack depends on resource in nested stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const grandparent = new Stack(undefined, 'Grandparent');
      const parent = new NestedStack(grandparent, 'Parent');
      const nested = new NestedStack(parent, 'Nested');
      const resourceInGrandparent = new CfnResource(grandparent, 'ResourceInGrandparent', { type: 'GRANDPARENT' });
      const resourceInNested = new CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });

      // WHEN
      addDep(resourceInGrandparent, resourceInNested);

      // THEN: resource in grantparent needs to depend on the top-level nested stack
      expect(grandparent).to(haveResource('GRANDPARENT', {
        DependsOn: [grandparent.resolve(parent.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));

      test.done();
    }),

    'resource in sibling stack depends on a resource in nested stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const nested1 = new NestedStack(stack1, 'Nested1');
      const resourceInNested1 = new CfnResource(nested1, 'ResourceInNested', { type: 'NESTED' });
      const stack2 = new Stack(app, 'Stack2');
      const resourceInStack2 = new CfnResource(stack2, 'ResourceInSibling', { type: 'SIBLING' });

      // WHEN
      addDep(resourceInStack2, resourceInNested1);

      // THEN: stack2 should depend on stack1 and no "DependsOn" inside templates
      const assembly = app.synth();
      assertAssemblyDependency(test, assembly, stack1, []);
      assertAssemblyDependency(test, assembly, stack2, ['Stack1']);
      assertNoDependsOn(test, assembly, stack1);
      assertNoDependsOn(test, assembly, stack2);
      assertNoDependsOn(test, assembly, nested1);
      test.done();
    }),

    'resource in nested stack depends on a resource in sibling stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const nested1 = new NestedStack(stack1, 'Nested1');
      const resourceInNested1 = new CfnResource(nested1, 'ResourceInNested', { type: 'NESTED' });
      const stack2 = new Stack(app, 'Stack2');
      const resourceInStack2 = new CfnResource(stack2, 'ResourceInSibling', { type: 'SIBLING' });

      // WHEN
      addDep(resourceInNested1, resourceInStack2);

      // THEN: stack1 should depend on stack2 and no "DependsOn" inside templates
      const assembly = app.synth();
      assertAssemblyDependency(test, assembly, stack1, ['Stack2']);
      assertAssemblyDependency(test, assembly, stack2, []);
      assertNoDependsOn(test, assembly, stack1);
      assertNoDependsOn(test, assembly, stack2);
      assertNoDependsOn(test, assembly, nested1);
      test.done();
    }),

    'resource in nested stack depends on a resource in nested sibling stack': matrixForResourceDependencyTest((test, addDep) => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack1');
      const nested1 = new NestedStack(stack, 'Nested1');
      const nested2 = new NestedStack(stack, 'Nested2');
      const resourceInNested1 = new CfnResource(nested1, 'ResourceInNested1', { type: 'NESTED1' });
      const resourceInNested2 = new CfnResource(nested2, 'ResourceInNested2', { type: 'NESTED2' });

      // WHEN
      addDep(resourceInNested1, resourceInNested2);

      // THEN: dependency transfered to nested stack resources
      expect(stack).to(haveResource('AWS::CloudFormation::Stack', {
        DependsOn: [stack.resolve(nested2.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));

      expect(stack).notTo(haveResource('AWS::CloudFormation::Stack', {
        DependsOn: [stack.resolve(nested1.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));

      test.done();
    }),

  },

  'stack dependencies': {

    'top level stack depends on itself'(test: Test) {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'Stack');

      // WHEN
      stack.addDependency(stack);

      // THEN
      const assembly = app.synth();
      assertAssemblyDependency(test, assembly, stack, []);
      assertNoDependsOn(test, assembly, stack);
      test.done();
    },

    'nested stack depends on itself'(test: Test) {
      // GIVEN
      const app = new App();
      const parent = new Stack(app, 'Parent');
      const nested = new NestedStack(parent, 'Nested');

      // WHEN
      nested.addDependency(nested);

      // THEN
      assertNoDependsOn(test, app.synth(), parent);
      test.done();
    },

    'nested stack cannot depend on any of its parents'(test: Test) {
      // GIVEN
      const root = new Stack();
      const nested1 = new NestedStack(root, 'Nested1');
      const nested2 = new NestedStack(nested1, 'Nested2');

      // THEN
      test.throws(() => nested1.addDependency(root), /Nested stack 'Default\/Nested1' cannot depend on a parent stack 'Default'/);
      test.throws(() => nested2.addDependency(nested1), /Nested stack 'Default\/Nested1\/Nested2' cannot depend on a parent stack 'Default\/Nested1'/);
      test.throws(() => nested2.addDependency(root), /Nested stack 'Default\/Nested1\/Nested2' cannot depend on a parent stack 'Default'/);
      test.done();
    },

    'any parent stack is by definition dependent on the nested stack so dependency is ignored'(test: Test) {
      // GIVEN
      const root = new Stack();
      const nested1 = new NestedStack(root, 'Nested1');
      const nested2 = new NestedStack(nested1, 'Nested2');

      // WHEN
      root.addDependency(nested1);
      root.addDependency(nested2);
      nested1.addDependency(nested2);

      // THEN
      test.done();
    },

    'sibling nested stacks transfer to resources'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const nested1 = new NestedStack(stack, 'Nested1');
      const nested2 = new NestedStack(stack, 'Nested2');

      // WHEN
      nested1.addDependency(nested2);

      // THEN
      expect(stack).to(haveResource('AWS::CloudFormation::Stack', {
        DependsOn: [stack.resolve(nested2.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));
      test.done();
    },

    'nested stack depends on a deeply nested stack'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const nested1 = new NestedStack(stack, 'Nested1');
      const nested2 = new NestedStack(stack, 'Nested2');
      const nested21 = new NestedStack(nested2, 'Nested21');

      // WHEN
      nested1.addDependency(nested21);

      // THEN: transfered to a resource dep between the resources in the common stack
      expect(stack).to(haveResource('AWS::CloudFormation::Stack', {
        DependsOn: [stack.resolve(nested2.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));
      test.done();
    },

    'deeply nested stack depends on a parent nested stack'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const nested1 = new NestedStack(stack, 'Nested1');
      const nested2 = new NestedStack(stack, 'Nested2');
      const nested21 = new NestedStack(nested2, 'Nested21');

      // WHEN
      nested21.addDependency(nested1);

      // THEN: transfered to a resource dep between the resources in the common stack
      expect(stack).to(haveResource('AWS::CloudFormation::Stack', {
        DependsOn: [stack.resolve(nested1.nestedStackResource!.logicalId)],
      }, ResourcePart.CompleteDefinition));
      test.done();
    },

    'top-level stack depends on a nested stack within a sibling'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const nested1 = new NestedStack(stack1, 'Nested1');
      const stack2 = new Stack(app, 'Stack2');

      // WHEN
      stack2.addDependency(nested1);

      // THEN: assembly-level dependency between stack2 and stack1
      const assembly = app.synth();
      assertAssemblyDependency(test, assembly, stack2, ['Stack1']);
      assertAssemblyDependency(test, assembly, stack1, []);
      assertNoDependsOn(test, assembly, stack1);
      assertNoDependsOn(test, assembly, stack2);
      assertNoDependsOn(test, assembly, nested1);
      test.done();
    },

    'nested stack within a sibling depends on top-level stack'(test: Test) {
      // GIVEN
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const nested1 = new NestedStack(stack1, 'Nested1');
      const stack2 = new Stack(app, 'Stack2');

      // WHEN
      nested1.addDependency(stack2);

      // THEN: assembly-level dependency between stack2 and stack1
      const assembly = app.synth();
      assertAssemblyDependency(test, assembly, stack2, []);
      assertAssemblyDependency(test, assembly, stack1, ['Stack2']);
      assertNoDependsOn(test, assembly, stack1);
      assertNoDependsOn(test, assembly, stack2);
      assertNoDependsOn(test, assembly, nested1);
      test.done();
    },

  },

};

/**
 * Given a test function which sets the stage and verifies a dependency scenario
 * between two CloudFormation resources, returns two tests which exercise both
 * "construct dependency" (i.e. node.addDependency) and "resource dependency"
 * (i.e. resource.addDependsOn).
 *
 * @param testFunction The test function
 */
function matrixForResourceDependencyTest(testFunction: (test: Test, addDep: (source: CfnResource, target: CfnResource) => void) => void) {
  return {
    'construct dependency'(test: Test) {
      testFunction(test, (source, target) => source.node.addDependency(target));
    },
    'resource dependency'(test: Test) {
      testFunction(test, (source, target) => source.addDependsOn(target));
    },
  };
}

function assertAssemblyDependency(test: Test, assembly: cxapi.CloudAssembly, stack: Stack, expectedDeps: string[]) {
  const stack1Art = assembly.getStackArtifact(stack.artifactId);
  const stack1Deps = stack1Art.dependencies.map(x => x.id);
  test.deepEqual(stack1Deps, expectedDeps);
}

function assertNoDependsOn(test: Test, assembly: cxapi.CloudAssembly, stack: Stack) {
  let templateText;
  if (!(stack instanceof NestedStack)) {
    templateText = JSON.stringify(assembly.getStackArtifact(stack.artifactId).template);
  } else {
    templateText = fs.readFileSync(path.join(assembly.directory, stack.templateFile), 'utf-8');
  }

  // verify templates do not have any "DependsOn"
  test.ok(!templateText.includes('DependsOn'));
}
