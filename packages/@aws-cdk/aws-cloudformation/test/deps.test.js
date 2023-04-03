"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
describe('resource dependencies', () => {
    test('between two resources in a top-level stack', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack');
        const r1 = new core_1.CfnResource(stack, 'r1', { type: 'r1' });
        const r2 = new core_1.CfnResource(stack, 'r2', { type: 'r2' });
        // WHEN
        r1.addDependency(r2);
        // THEN
        expect(app.synth().getStackArtifact(stack.artifactId).template?.Resources).toEqual({
            r1: { Type: 'r1', DependsOn: ['r2'] }, r2: { Type: 'r2' },
        });
    });
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in nested stack depends on a resource in the parent stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const parent = new core_1.Stack(undefined, 'root');
        const nested = new lib_1.NestedStack(parent, 'Nested');
        const resourceInParent = new core_1.CfnResource(parent, 'ResourceInParent', { type: 'PARENT' });
        const resourceInNested = new core_1.CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });
        // WHEN
        addDep(resourceInNested, resourceInParent);
        // THEN: the dependency needs to transfer from the resource within the
        // nested stack to the nested stack resource itself so the nested stack
        // will only be deployed the dependent resource
        assertions_1.Template.fromStack(parent).hasResource('AWS::CloudFormation::Stack', { DependsOn: ['ResourceInParent'] });
        assertions_1.Template.fromStack(nested).templateMatches({ Resources: { ResourceInNested: { Type: 'NESTED' } } }); // no DependsOn for the actual resource
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in nested stack depends on a resource in a grandparent stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const grantparent = new core_1.Stack(undefined, 'Grandparent');
        const parent = new lib_1.NestedStack(grantparent, 'Parent');
        const nested = new lib_1.NestedStack(parent, 'Nested');
        const resourceInGrandparent = new core_1.CfnResource(grantparent, 'ResourceInGrandparent', { type: 'GRANDPARENT' });
        const resourceInNested = new core_1.CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });
        // WHEN
        addDep(resourceInNested, resourceInGrandparent);
        // THEN: the dependency needs to transfer from the resource within the
        // nested stack to the *parent* nested stack
        assertions_1.Template.fromStack(grantparent).hasResource('AWS::CloudFormation::Stack', { DependsOn: ['ResourceInGrandparent'] });
        assertions_1.Template.fromStack(nested).templateMatches({ Resources: { ResourceInNested: { Type: 'NESTED' } } }); // no DependsOn for the actual resource
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in parent stack depends on resource in nested stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const parent = new core_1.Stack(undefined, 'root');
        const nested = new lib_1.NestedStack(parent, 'Nested');
        const resourceInParent = new core_1.CfnResource(parent, 'ResourceInParent', { type: 'PARENT' });
        const resourceInNested = new core_1.CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });
        // WHEN
        addDep(resourceInParent, resourceInNested);
        // THEN: resource in parent needs to depend on the nested stack
        assertions_1.Template.fromStack(parent).hasResource('PARENT', {
            DependsOn: [parent.resolve(nested.nestedStackResource.logicalId)],
        });
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in grantparent stack depends on resource in nested stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const grandparent = new core_1.Stack(undefined, 'Grandparent');
        const parent = new lib_1.NestedStack(grandparent, 'Parent');
        const nested = new lib_1.NestedStack(parent, 'Nested');
        const resourceInGrandparent = new core_1.CfnResource(grandparent, 'ResourceInGrandparent', { type: 'GRANDPARENT' });
        const resourceInNested = new core_1.CfnResource(nested, 'ResourceInNested', { type: 'NESTED' });
        // WHEN
        addDep(resourceInGrandparent, resourceInNested);
        // THEN: resource in grantparent needs to depend on the top-level nested stack
        assertions_1.Template.fromStack(grandparent).hasResource('GRANDPARENT', {
            DependsOn: [grandparent.resolve(parent.nestedStackResource.logicalId)],
        });
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in sibling stack depends on a resource in nested stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const nested1 = new lib_1.NestedStack(stack1, 'Nested1');
        const resourceInNested1 = new core_1.CfnResource(nested1, 'ResourceInNested', { type: 'NESTED' });
        const stack2 = new core_1.Stack(app, 'Stack2');
        const resourceInStack2 = new core_1.CfnResource(stack2, 'ResourceInSibling', { type: 'SIBLING' });
        // WHEN
        addDep(resourceInStack2, resourceInNested1);
        // THEN: stack2 should depend on stack1 and no "DependsOn" inside templates
        const assembly = app.synth();
        assertAssemblyDependency(assembly, stack1, []);
        assertAssemblyDependency(assembly, stack2, ['Stack1']);
        assertNoDependsOn(assembly, stack1);
        assertNoDependsOn(assembly, stack2);
        assertNoDependsOn(assembly, nested1);
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in nested stack depends on a resource in sibling stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const nested1 = new lib_1.NestedStack(stack1, 'Nested1');
        const resourceInNested1 = new core_1.CfnResource(nested1, 'ResourceInNested', { type: 'NESTED' });
        const stack2 = new core_1.Stack(app, 'Stack2');
        const resourceInStack2 = new core_1.CfnResource(stack2, 'ResourceInSibling', { type: 'SIBLING' });
        // WHEN
        addDep(resourceInNested1, resourceInStack2);
        // THEN: stack1 should depend on stack2 and no "DependsOn" inside templates
        const assembly = app.synth();
        assertAssemblyDependency(assembly, stack1, ['Stack2']);
        assertAssemblyDependency(assembly, stack2, []);
        assertNoDependsOn(assembly, stack1);
        assertNoDependsOn(assembly, stack2);
        assertNoDependsOn(assembly, nested1);
    }));
    // eslint-disable-next-line jest/valid-describe
    cdk_build_tools_1.describeDeprecated('resource in nested stack depends on a resource in nested sibling stack', matrixForResourceDependencyTest((addDep) => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack1');
        const nested1 = new lib_1.NestedStack(stack, 'Nested1');
        const nested2 = new lib_1.NestedStack(stack, 'Nested2');
        const resourceInNested1 = new core_1.CfnResource(nested1, 'ResourceInNested1', { type: 'NESTED1' });
        const resourceInNested2 = new core_1.CfnResource(nested2, 'ResourceInNested2', { type: 'NESTED2' });
        // WHEN
        addDep(resourceInNested1, resourceInNested2);
        // THEN: dependency transfered to nested stack resources
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::Stack', {
            DependsOn: [stack.resolve(nested2.nestedStackResource.logicalId)],
        });
        expect(assertions_1.Template.fromStack(stack).findResources('AWS::CloudFormation::Stack', {
            DependsOn: [stack.resolve(nested1.nestedStackResource.logicalId)],
        })).toEqual({});
    }));
});
describe('stack dependencies', () => {
    test('top level stack depends on itself', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new core_1.Stack(app, 'Stack');
        // WHEN
        stack.addDependency(stack);
        // THEN
        const assembly = app.synth();
        assertAssemblyDependency(assembly, stack, []);
        assertNoDependsOn(assembly, stack);
    });
    cdk_build_tools_1.testDeprecated('nested stack depends on itself', () => {
        // GIVEN
        const app = new core_1.App();
        const parent = new core_1.Stack(app, 'Parent');
        const nested = new lib_1.NestedStack(parent, 'Nested');
        // WHEN
        nested.addDependency(nested);
        // THEN
        assertNoDependsOn(app.synth(), parent);
    });
    cdk_build_tools_1.testDeprecated('nested stack cannot depend on any of its parents', () => {
        // GIVEN
        const root = new core_1.Stack();
        const nested1 = new lib_1.NestedStack(root, 'Nested1');
        const nested2 = new lib_1.NestedStack(nested1, 'Nested2');
        // THEN
        expect(() => nested1.addDependency(root)).toThrow(/Nested stack 'Default\/Nested1' cannot depend on a parent stack 'Default'/);
        expect(() => nested2.addDependency(nested1)).toThrow(/Nested stack 'Default\/Nested1\/Nested2' cannot depend on a parent stack 'Default\/Nested1'/);
        expect(() => nested2.addDependency(root)).toThrow(/Nested stack 'Default\/Nested1\/Nested2' cannot depend on a parent stack 'Default'/);
    });
    cdk_build_tools_1.testDeprecated('any parent stack is by definition dependent on the nested stack so dependency is ignored', () => {
        // GIVEN
        const root = new core_1.Stack();
        const nested1 = new lib_1.NestedStack(root, 'Nested1');
        const nested2 = new lib_1.NestedStack(nested1, 'Nested2');
        // WHEN
        root.addDependency(nested1);
        root.addDependency(nested2);
        nested1.addDependency(nested2);
    });
    cdk_build_tools_1.testDeprecated('sibling nested stacks transfer to resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const nested1 = new lib_1.NestedStack(stack, 'Nested1');
        const nested2 = new lib_1.NestedStack(stack, 'Nested2');
        // WHEN
        nested1.addDependency(nested2);
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::Stack', {
            DependsOn: [stack.resolve(nested2.nestedStackResource.logicalId)],
        });
    });
    cdk_build_tools_1.testDeprecated('nested stack depends on a deeply nested stack', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const nested1 = new lib_1.NestedStack(stack, 'Nested1');
        const nested2 = new lib_1.NestedStack(stack, 'Nested2');
        const nested21 = new lib_1.NestedStack(nested2, 'Nested21');
        // WHEN
        nested1.addDependency(nested21);
        // THEN: transfered to a resource dep between the resources in the common stack
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::Stack', {
            DependsOn: [stack.resolve(nested2.nestedStackResource.logicalId)],
        });
    });
    cdk_build_tools_1.testDeprecated('deeply nested stack depends on a parent nested stack', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const nested1 = new lib_1.NestedStack(stack, 'Nested1');
        const nested2 = new lib_1.NestedStack(stack, 'Nested2');
        const nested21 = new lib_1.NestedStack(nested2, 'Nested21');
        // WHEN
        nested21.addDependency(nested1);
        // THEN: transfered to a resource dep between the resources in the common stack
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::Stack', {
            DependsOn: [stack.resolve(nested1.nestedStackResource.logicalId)],
        });
    });
    cdk_build_tools_1.testDeprecated('top-level stack depends on a nested stack within a sibling', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const nested1 = new lib_1.NestedStack(stack1, 'Nested1');
        const stack2 = new core_1.Stack(app, 'Stack2');
        // WHEN
        stack2.addDependency(nested1);
        // THEN: assembly-level dependency between stack2 and stack1
        const assembly = app.synth();
        assertAssemblyDependency(assembly, stack2, ['Stack1']);
        assertAssemblyDependency(assembly, stack1, []);
        assertNoDependsOn(assembly, stack1);
        assertNoDependsOn(assembly, stack2);
        assertNoDependsOn(assembly, nested1);
    });
    cdk_build_tools_1.testDeprecated('nested stack within a sibling depends on top-level stack', () => {
        // GIVEN
        const app = new core_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack1 = new core_1.Stack(app, 'Stack1');
        const nested1 = new lib_1.NestedStack(stack1, 'Nested1');
        const stack2 = new core_1.Stack(app, 'Stack2');
        // WHEN
        nested1.addDependency(stack2);
        // THEN: assembly-level dependency between stack2 and stack1
        const assembly = app.synth();
        assertAssemblyDependency(assembly, stack2, []);
        assertAssemblyDependency(assembly, stack1, ['Stack2']);
        assertNoDependsOn(assembly, stack1);
        assertNoDependsOn(assembly, stack2);
        assertNoDependsOn(assembly, nested1);
    });
});
/**
 * Given a test function which sets the stage and verifies a dependency scenario
 * between two CloudFormation resources, returns two tests which exercise both
 * "construct dependency" (i.e. node.addDependency) and "resource dependency"
 * (i.e. resource.addDependency).
 *
 * @param testFunction The test function
 */
function matrixForResourceDependencyTest(testFunction) {
    return () => {
        test('construct dependency', () => {
            testFunction((source, target) => source.node.addDependency(target));
        });
        test('resource dependency', () => {
            testFunction((source, target) => source.addDependency(target));
        });
    };
}
function assertAssemblyDependency(assembly, stack, expectedDeps) {
    const stack1Art = assembly.getStackArtifact(stack.artifactId);
    const stack1Deps = stack1Art.dependencies.map(x => x.id);
    expect(stack1Deps).toEqual(expectedDeps);
}
function assertNoDependsOn(assembly, stack) {
    let templateText;
    if (!(stack instanceof lib_1.NestedStack)) {
        templateText = JSON.stringify(assembly.getStackArtifact(stack.artifactId).template);
    }
    else {
        templateText = fs.readFileSync(path.join(assembly.directory, stack.templateFile), 'utf-8');
    }
    // verify templates do not have any "DependsOn"
    expect(templateText.includes('DependsOn')).toBeFalsy();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixvREFBK0M7QUFDL0MsOERBQThFO0FBQzlFLHdDQUF3RDtBQUN4RCx5Q0FBeUM7QUFDekMsZ0NBQXFDO0FBRXJDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUN0RCxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN4RCxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRXhELE9BQU87UUFDUCxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXJCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pGLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1NBQzFELENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsK0NBQStDO0lB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RSxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLHdCQUF3QixDQUFDLFFBQTZCLEVBQUUsS0FBWSxFQUFFLFlBQXNCO0lBQ25HLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDOUQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxRQUE2QixFQUFFLEtBQVk7SUFDcEUsSUFBSSxZQUFZLENBQUM7SUFDakIsSUFBSSxDQUFDLENBQUMsS0FBSyxZQUFZLGlCQUFXLENBQUMsRUFBRTtRQUNuQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JGO1NBQU07UUFDTCxZQUFZLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzVGO0lBRUQsK0NBQStDO0lBQy9DLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQsIGRlc2NyaWJlRGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBcHAsIENmblJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IE5lc3RlZFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3Jlc291cmNlIGRlcGVuZGVuY2llcycsICgpID0+IHtcbiAgdGVzdCgnYmV0d2VlbiB0d28gcmVzb3VyY2VzIGluIGEgdG9wLWxldmVsIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgcjEgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdyMScsIHsgdHlwZTogJ3IxJyB9KTtcbiAgICBjb25zdCByMiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ3IyJywgeyB0eXBlOiAncjInIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHIxLmFkZERlcGVuZGVuY3kocjIpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgcjE6IHsgVHlwZTogJ3IxJywgRGVwZW5kc09uOiBbJ3IyJ10gfSwgcjI6IHsgVHlwZTogJ3IyJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC92YWxpZC1kZXNjcmliZVxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ3Jlc291cmNlIGluIG5lc3RlZCBzdGFjayBkZXBlbmRzIG9uIGEgcmVzb3VyY2UgaW4gdGhlIHBhcmVudCBzdGFjaycsIG1hdHJpeEZvclJlc291cmNlRGVwZW5kZW5jeVRlc3QoKGFkZERlcCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ3Jvb3QnKTtcbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnTmVzdGVkJyk7XG4gICAgY29uc3QgcmVzb3VyY2VJblBhcmVudCA9IG5ldyBDZm5SZXNvdXJjZShwYXJlbnQsICdSZXNvdXJjZUluUGFyZW50JywgeyB0eXBlOiAnUEFSRU5UJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkID0gbmV3IENmblJlc291cmNlKG5lc3RlZCwgJ1Jlc291cmNlSW5OZXN0ZWQnLCB7IHR5cGU6ICdORVNURUQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFkZERlcChyZXNvdXJjZUluTmVzdGVkLCByZXNvdXJjZUluUGFyZW50KTtcblxuICAgIC8vIFRIRU46IHRoZSBkZXBlbmRlbmN5IG5lZWRzIHRvIHRyYW5zZmVyIGZyb20gdGhlIHJlc291cmNlIHdpdGhpbiB0aGVcbiAgICAvLyBuZXN0ZWQgc3RhY2sgdG8gdGhlIG5lc3RlZCBzdGFjayByZXNvdXJjZSBpdHNlbGYgc28gdGhlIG5lc3RlZCBzdGFja1xuICAgIC8vIHdpbGwgb25seSBiZSBkZXBsb3llZCB0aGUgZGVwZW5kZW50IHJlc291cmNlXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHBhcmVudCkuaGFzUmVzb3VyY2UoJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJywgeyBEZXBlbmRzT246IFsnUmVzb3VyY2VJblBhcmVudCddIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLnRlbXBsYXRlTWF0Y2hlcyh7IFJlc291cmNlczogeyBSZXNvdXJjZUluTmVzdGVkOiB7IFR5cGU6ICdORVNURUQnIH0gfSB9KTsgLy8gbm8gRGVwZW5kc09uIGZvciB0aGUgYWN0dWFsIHJlc291cmNlXG4gIH0pKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC92YWxpZC1kZXNjcmliZVxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ3Jlc291cmNlIGluIG5lc3RlZCBzdGFjayBkZXBlbmRzIG9uIGEgcmVzb3VyY2UgaW4gYSBncmFuZHBhcmVudCBzdGFjaycsIG1hdHJpeEZvclJlc291cmNlRGVwZW5kZW5jeVRlc3QoKGFkZERlcCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZ3JhbnRwYXJlbnQgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCAnR3JhbmRwYXJlbnQnKTtcbiAgICBjb25zdCBwYXJlbnQgPSBuZXcgTmVzdGVkU3RhY2soZ3JhbnRwYXJlbnQsICdQYXJlbnQnKTtcbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnTmVzdGVkJyk7XG4gICAgY29uc3QgcmVzb3VyY2VJbkdyYW5kcGFyZW50ID0gbmV3IENmblJlc291cmNlKGdyYW50cGFyZW50LCAnUmVzb3VyY2VJbkdyYW5kcGFyZW50JywgeyB0eXBlOiAnR1JBTkRQQVJFTlQnIH0pO1xuICAgIGNvbnN0IHJlc291cmNlSW5OZXN0ZWQgPSBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkLCAnUmVzb3VyY2VJbk5lc3RlZCcsIHsgdHlwZTogJ05FU1RFRCcgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYWRkRGVwKHJlc291cmNlSW5OZXN0ZWQsIHJlc291cmNlSW5HcmFuZHBhcmVudCk7XG5cbiAgICAvLyBUSEVOOiB0aGUgZGVwZW5kZW5jeSBuZWVkcyB0byB0cmFuc2ZlciBmcm9tIHRoZSByZXNvdXJjZSB3aXRoaW4gdGhlXG4gICAgLy8gbmVzdGVkIHN0YWNrIHRvIHRoZSAqcGFyZW50KiBuZXN0ZWQgc3RhY2tcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soZ3JhbnRwYXJlbnQpLmhhc1Jlc291cmNlKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHsgRGVwZW5kc09uOiBbJ1Jlc291cmNlSW5HcmFuZHBhcmVudCddIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhuZXN0ZWQpLnRlbXBsYXRlTWF0Y2hlcyh7IFJlc291cmNlczogeyBSZXNvdXJjZUluTmVzdGVkOiB7IFR5cGU6ICdORVNURUQnIH0gfSB9KTsgLy8gbm8gRGVwZW5kc09uIGZvciB0aGUgYWN0dWFsIHJlc291cmNlXG4gIH0pKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC92YWxpZC1kZXNjcmliZVxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ3Jlc291cmNlIGluIHBhcmVudCBzdGFjayBkZXBlbmRzIG9uIHJlc291cmNlIGluIG5lc3RlZCBzdGFjaycsIG1hdHJpeEZvclJlc291cmNlRGVwZW5kZW5jeVRlc3QoKGFkZERlcCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ3Jvb3QnKTtcbiAgICBjb25zdCBuZXN0ZWQgPSBuZXcgTmVzdGVkU3RhY2socGFyZW50LCAnTmVzdGVkJyk7XG4gICAgY29uc3QgcmVzb3VyY2VJblBhcmVudCA9IG5ldyBDZm5SZXNvdXJjZShwYXJlbnQsICdSZXNvdXJjZUluUGFyZW50JywgeyB0eXBlOiAnUEFSRU5UJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkID0gbmV3IENmblJlc291cmNlKG5lc3RlZCwgJ1Jlc291cmNlSW5OZXN0ZWQnLCB7IHR5cGU6ICdORVNURUQnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFkZERlcChyZXNvdXJjZUluUGFyZW50LCByZXNvdXJjZUluTmVzdGVkKTtcblxuICAgIC8vIFRIRU46IHJlc291cmNlIGluIHBhcmVudCBuZWVkcyB0byBkZXBlbmQgb24gdGhlIG5lc3RlZCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhwYXJlbnQpLmhhc1Jlc291cmNlKCdQQVJFTlQnLCB7XG4gICAgICBEZXBlbmRzT246IFtwYXJlbnQucmVzb2x2ZShuZXN0ZWQubmVzdGVkU3RhY2tSZXNvdXJjZSEubG9naWNhbElkKV0sXG4gICAgfSk7XG4gIH0pKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC92YWxpZC1kZXNjcmliZVxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ3Jlc291cmNlIGluIGdyYW50cGFyZW50IHN0YWNrIGRlcGVuZHMgb24gcmVzb3VyY2UgaW4gbmVzdGVkIHN0YWNrJywgbWF0cml4Rm9yUmVzb3VyY2VEZXBlbmRlbmN5VGVzdCgoYWRkRGVwKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBncmFuZHBhcmVudCA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdHcmFuZHBhcmVudCcpO1xuICAgIGNvbnN0IHBhcmVudCA9IG5ldyBOZXN0ZWRTdGFjayhncmFuZHBhcmVudCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdOZXN0ZWQnKTtcbiAgICBjb25zdCByZXNvdXJjZUluR3JhbmRwYXJlbnQgPSBuZXcgQ2ZuUmVzb3VyY2UoZ3JhbmRwYXJlbnQsICdSZXNvdXJjZUluR3JhbmRwYXJlbnQnLCB7IHR5cGU6ICdHUkFORFBBUkVOVCcgfSk7XG4gICAgY29uc3QgcmVzb3VyY2VJbk5lc3RlZCA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQsICdSZXNvdXJjZUluTmVzdGVkJywgeyB0eXBlOiAnTkVTVEVEJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhZGREZXAocmVzb3VyY2VJbkdyYW5kcGFyZW50LCByZXNvdXJjZUluTmVzdGVkKTtcblxuICAgIC8vIFRIRU46IHJlc291cmNlIGluIGdyYW50cGFyZW50IG5lZWRzIHRvIGRlcGVuZCBvbiB0aGUgdG9wLWxldmVsIG5lc3RlZCBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhncmFuZHBhcmVudCkuaGFzUmVzb3VyY2UoJ0dSQU5EUEFSRU5UJywge1xuICAgICAgRGVwZW5kc09uOiBbZ3JhbmRwYXJlbnQucmVzb2x2ZShwYXJlbnQubmVzdGVkU3RhY2tSZXNvdXJjZSEubG9naWNhbElkKV0sXG4gICAgfSk7XG4gIH0pKTtcblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC92YWxpZC1kZXNjcmliZVxuICBkZXNjcmliZURlcHJlY2F0ZWQoJ3Jlc291cmNlIGluIHNpYmxpbmcgc3RhY2sgZGVwZW5kcyBvbiBhIHJlc291cmNlIGluIG5lc3RlZCBzdGFjaycsIG1hdHJpeEZvclJlc291cmNlRGVwZW5kZW5jeVRlc3QoKGFkZERlcCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2sxLCAnTmVzdGVkMScpO1xuICAgIGNvbnN0IHJlc291cmNlSW5OZXN0ZWQxID0gbmV3IENmblJlc291cmNlKG5lc3RlZDEsICdSZXNvdXJjZUluTmVzdGVkJywgeyB0eXBlOiAnTkVTVEVEJyB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgY29uc3QgcmVzb3VyY2VJblN0YWNrMiA9IG5ldyBDZm5SZXNvdXJjZShzdGFjazIsICdSZXNvdXJjZUluU2libGluZycsIHsgdHlwZTogJ1NJQkxJTkcnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFkZERlcChyZXNvdXJjZUluU3RhY2syLCByZXNvdXJjZUluTmVzdGVkMSk7XG5cbiAgICAvLyBUSEVOOiBzdGFjazIgc2hvdWxkIGRlcGVuZCBvbiBzdGFjazEgYW5kIG5vIFwiRGVwZW5kc09uXCIgaW5zaWRlIHRlbXBsYXRlc1xuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgYXNzZXJ0QXNzZW1ibHlEZXBlbmRlbmN5KGFzc2VtYmx5LCBzdGFjazEsIFtdKTtcbiAgICBhc3NlcnRBc3NlbWJseURlcGVuZGVuY3koYXNzZW1ibHksIHN0YWNrMiwgWydTdGFjazEnXSk7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIHN0YWNrMSk7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIHN0YWNrMik7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIG5lc3RlZDEpO1xuICB9KSk7XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGplc3QvdmFsaWQtZGVzY3JpYmVcbiAgZGVzY3JpYmVEZXByZWNhdGVkKCdyZXNvdXJjZSBpbiBuZXN0ZWQgc3RhY2sgZGVwZW5kcyBvbiBhIHJlc291cmNlIGluIHNpYmxpbmcgc3RhY2snLCBtYXRyaXhGb3JSZXNvdXJjZURlcGVuZGVuY3lUZXN0KChhZGREZXApID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMSwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkMSA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQxLCAnUmVzb3VyY2VJbk5lc3RlZCcsIHsgdHlwZTogJ05FU1RFRCcgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IHJlc291cmNlSW5TdGFjazIgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2syLCAnUmVzb3VyY2VJblNpYmxpbmcnLCB7IHR5cGU6ICdTSUJMSU5HJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhZGREZXAocmVzb3VyY2VJbk5lc3RlZDEsIHJlc291cmNlSW5TdGFjazIpO1xuXG4gICAgLy8gVEhFTjogc3RhY2sxIHNob3VsZCBkZXBlbmQgb24gc3RhY2syIGFuZCBubyBcIkRlcGVuZHNPblwiIGluc2lkZSB0ZW1wbGF0ZXNcbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGFzc2VydEFzc2VtYmx5RGVwZW5kZW5jeShhc3NlbWJseSwgc3RhY2sxLCBbJ1N0YWNrMiddKTtcbiAgICBhc3NlcnRBc3NlbWJseURlcGVuZGVuY3koYXNzZW1ibHksIHN0YWNrMiwgW10pO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBzdGFjazEpO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBzdGFjazIpO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBuZXN0ZWQxKTtcbiAgfSkpO1xuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBqZXN0L3ZhbGlkLWRlc2NyaWJlXG4gIGRlc2NyaWJlRGVwcmVjYXRlZCgncmVzb3VyY2UgaW4gbmVzdGVkIHN0YWNrIGRlcGVuZHMgb24gYSByZXNvdXJjZSBpbiBuZXN0ZWQgc2libGluZyBzdGFjaycsIG1hdHJpeEZvclJlc291cmNlRGVwZW5kZW5jeVRlc3QoKGFkZERlcCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdOZXN0ZWQxJyk7XG4gICAgY29uc3QgbmVzdGVkMiA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ05lc3RlZDInKTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkMSA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQxLCAnUmVzb3VyY2VJbk5lc3RlZDEnLCB7IHR5cGU6ICdORVNURUQxJyB9KTtcbiAgICBjb25zdCByZXNvdXJjZUluTmVzdGVkMiA9IG5ldyBDZm5SZXNvdXJjZShuZXN0ZWQyLCAnUmVzb3VyY2VJbk5lc3RlZDInLCB7IHR5cGU6ICdORVNURUQyJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhZGREZXAocmVzb3VyY2VJbk5lc3RlZDEsIHJlc291cmNlSW5OZXN0ZWQyKTtcblxuICAgIC8vIFRIRU46IGRlcGVuZGVuY3kgdHJhbnNmZXJlZCB0byBuZXN0ZWQgc3RhY2sgcmVzb3VyY2VzXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLCB7XG4gICAgICBEZXBlbmRzT246IFtzdGFjay5yZXNvbHZlKG5lc3RlZDIubmVzdGVkU3RhY2tSZXNvdXJjZSEubG9naWNhbElkKV0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIERlcGVuZHNPbjogW3N0YWNrLnJlc29sdmUobmVzdGVkMS5uZXN0ZWRTdGFja1Jlc291cmNlIS5sb2dpY2FsSWQpXSxcbiAgICB9KSkudG9FcXVhbCh7fSk7XG4gIH0pKTtcbn0pO1xuXG5kZXNjcmliZSgnc3RhY2sgZGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICB0ZXN0KCd0b3AgbGV2ZWwgc3RhY2sgZGVwZW5kcyBvbiBpdHNlbGYnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YWNrLmFkZERlcGVuZGVuY3koc3RhY2spO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgYXNzZXJ0QXNzZW1ibHlEZXBlbmRlbmN5KGFzc2VtYmx5LCBzdGFjaywgW10pO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBzdGFjayk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCduZXN0ZWQgc3RhY2sgZGVwZW5kcyBvbiBpdHNlbGYnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3QgcGFyZW50ID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudCcpO1xuICAgIGNvbnN0IG5lc3RlZCA9IG5ldyBOZXN0ZWRTdGFjayhwYXJlbnQsICdOZXN0ZWQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXN0ZWQuYWRkRGVwZW5kZW5jeShuZXN0ZWQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGFzc2VydE5vRGVwZW5kc09uKGFwcC5zeW50aCgpLCBwYXJlbnQpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnbmVzdGVkIHN0YWNrIGNhbm5vdCBkZXBlbmQgb24gYW55IG9mIGl0cyBwYXJlbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2socm9vdCwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCBuZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKG5lc3RlZDEsICdOZXN0ZWQyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5lc3RlZDEuYWRkRGVwZW5kZW5jeShyb290KSkudG9UaHJvdygvTmVzdGVkIHN0YWNrICdEZWZhdWx0XFwvTmVzdGVkMScgY2Fubm90IGRlcGVuZCBvbiBhIHBhcmVudCBzdGFjayAnRGVmYXVsdCcvKTtcbiAgICBleHBlY3QoKCkgPT4gbmVzdGVkMi5hZGREZXBlbmRlbmN5KG5lc3RlZDEpKS50b1Rocm93KC9OZXN0ZWQgc3RhY2sgJ0RlZmF1bHRcXC9OZXN0ZWQxXFwvTmVzdGVkMicgY2Fubm90IGRlcGVuZCBvbiBhIHBhcmVudCBzdGFjayAnRGVmYXVsdFxcL05lc3RlZDEnLyk7XG4gICAgZXhwZWN0KCgpID0+IG5lc3RlZDIuYWRkRGVwZW5kZW5jeShyb290KSkudG9UaHJvdygvTmVzdGVkIHN0YWNrICdEZWZhdWx0XFwvTmVzdGVkMVxcL05lc3RlZDInIGNhbm5vdCBkZXBlbmQgb24gYSBwYXJlbnQgc3RhY2sgJ0RlZmF1bHQnLyk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdhbnkgcGFyZW50IHN0YWNrIGlzIGJ5IGRlZmluaXRpb24gZGVwZW5kZW50IG9uIHRoZSBuZXN0ZWQgc3RhY2sgc28gZGVwZW5kZW5jeSBpcyBpZ25vcmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2socm9vdCwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCBuZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKG5lc3RlZDEsICdOZXN0ZWQyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcm9vdC5hZGREZXBlbmRlbmN5KG5lc3RlZDEpO1xuICAgIHJvb3QuYWRkRGVwZW5kZW5jeShuZXN0ZWQyKTtcbiAgICBuZXN0ZWQxLmFkZERlcGVuZGVuY3kobmVzdGVkMik7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdzaWJsaW5nIG5lc3RlZCBzdGFja3MgdHJhbnNmZXIgdG8gcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrLCAnTmVzdGVkMScpO1xuICAgIGNvbnN0IG5lc3RlZDIgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdOZXN0ZWQyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmVzdGVkMS5hZGREZXBlbmRlbmN5KG5lc3RlZDIpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJywge1xuICAgICAgRGVwZW5kc09uOiBbc3RhY2sucmVzb2x2ZShuZXN0ZWQyLm5lc3RlZFN0YWNrUmVzb3VyY2UhLmxvZ2ljYWxJZCldLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnbmVzdGVkIHN0YWNrIGRlcGVuZHMgb24gYSBkZWVwbHkgbmVzdGVkIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrLCAnTmVzdGVkMScpO1xuICAgIGNvbnN0IG5lc3RlZDIgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdOZXN0ZWQyJyk7XG4gICAgY29uc3QgbmVzdGVkMjEgPSBuZXcgTmVzdGVkU3RhY2sobmVzdGVkMiwgJ05lc3RlZDIxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmVzdGVkMS5hZGREZXBlbmRlbmN5KG5lc3RlZDIxKTtcblxuICAgIC8vIFRIRU46IHRyYW5zZmVyZWQgdG8gYSByZXNvdXJjZSBkZXAgYmV0d2VlbiB0aGUgcmVzb3VyY2VzIGluIHRoZSBjb21tb24gc3RhY2tcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsIHtcbiAgICAgIERlcGVuZHNPbjogW3N0YWNrLnJlc29sdmUobmVzdGVkMi5uZXN0ZWRTdGFja1Jlc291cmNlIS5sb2dpY2FsSWQpXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2RlZXBseSBuZXN0ZWQgc3RhY2sgZGVwZW5kcyBvbiBhIHBhcmVudCBuZXN0ZWQgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdOZXN0ZWQxJyk7XG4gICAgY29uc3QgbmVzdGVkMiA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ05lc3RlZDInKTtcbiAgICBjb25zdCBuZXN0ZWQyMSA9IG5ldyBOZXN0ZWRTdGFjayhuZXN0ZWQyLCAnTmVzdGVkMjEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXN0ZWQyMS5hZGREZXBlbmRlbmN5KG5lc3RlZDEpO1xuXG4gICAgLy8gVEhFTjogdHJhbnNmZXJlZCB0byBhIHJlc291cmNlIGRlcCBiZXR3ZWVuIHRoZSByZXNvdXJjZXMgaW4gdGhlIGNvbW1vbiBzdGFja1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJywge1xuICAgICAgRGVwZW5kc09uOiBbc3RhY2sucmVzb2x2ZShuZXN0ZWQxLm5lc3RlZFN0YWNrUmVzb3VyY2UhLmxvZ2ljYWxJZCldLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndG9wLWxldmVsIHN0YWNrIGRlcGVuZHMgb24gYSBuZXN0ZWQgc3RhY2sgd2l0aGluIGEgc2libGluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBuZXN0ZWQxID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMSwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhY2syLmFkZERlcGVuZGVuY3kobmVzdGVkMSk7XG5cbiAgICAvLyBUSEVOOiBhc3NlbWJseS1sZXZlbCBkZXBlbmRlbmN5IGJldHdlZW4gc3RhY2syIGFuZCBzdGFjazFcbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGFzc2VydEFzc2VtYmx5RGVwZW5kZW5jeShhc3NlbWJseSwgc3RhY2syLCBbJ1N0YWNrMSddKTtcbiAgICBhc3NlcnRBc3NlbWJseURlcGVuZGVuY3koYXNzZW1ibHksIHN0YWNrMSwgW10pO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBzdGFjazEpO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBzdGFjazIpO1xuICAgIGFzc2VydE5vRGVwZW5kc09uKGFzc2VtYmx5LCBuZXN0ZWQxKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ25lc3RlZCBzdGFjayB3aXRoaW4gYSBzaWJsaW5nIGRlcGVuZHMgb24gdG9wLWxldmVsIHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IG5lc3RlZDEgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2sxLCAnTmVzdGVkMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXN0ZWQxLmFkZERlcGVuZGVuY3koc3RhY2syKTtcblxuICAgIC8vIFRIRU46IGFzc2VtYmx5LWxldmVsIGRlcGVuZGVuY3kgYmV0d2VlbiBzdGFjazIgYW5kIHN0YWNrMVxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgYXNzZXJ0QXNzZW1ibHlEZXBlbmRlbmN5KGFzc2VtYmx5LCBzdGFjazIsIFtdKTtcbiAgICBhc3NlcnRBc3NlbWJseURlcGVuZGVuY3koYXNzZW1ibHksIHN0YWNrMSwgWydTdGFjazInXSk7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIHN0YWNrMSk7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIHN0YWNrMik7XG4gICAgYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHksIG5lc3RlZDEpO1xuICB9KTtcbn0pO1xuXG4vKipcbiAqIEdpdmVuIGEgdGVzdCBmdW5jdGlvbiB3aGljaCBzZXRzIHRoZSBzdGFnZSBhbmQgdmVyaWZpZXMgYSBkZXBlbmRlbmN5IHNjZW5hcmlvXG4gKiBiZXR3ZWVuIHR3byBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXMsIHJldHVybnMgdHdvIHRlc3RzIHdoaWNoIGV4ZXJjaXNlIGJvdGhcbiAqIFwiY29uc3RydWN0IGRlcGVuZGVuY3lcIiAoaS5lLiBub2RlLmFkZERlcGVuZGVuY3kpIGFuZCBcInJlc291cmNlIGRlcGVuZGVuY3lcIlxuICogKGkuZS4gcmVzb3VyY2UuYWRkRGVwZW5kZW5jeSkuXG4gKlxuICogQHBhcmFtIHRlc3RGdW5jdGlvbiBUaGUgdGVzdCBmdW5jdGlvblxuICovXG5mdW5jdGlvbiBtYXRyaXhGb3JSZXNvdXJjZURlcGVuZGVuY3lUZXN0KHRlc3RGdW5jdGlvbjogKGFkZERlcDogKHNvdXJjZTogQ2ZuUmVzb3VyY2UsIHRhcmdldDogQ2ZuUmVzb3VyY2UpID0+IHZvaWQpID0+IHZvaWQpIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICB0ZXN0KCdjb25zdHJ1Y3QgZGVwZW5kZW5jeScsICgpID0+IHtcbiAgICAgIHRlc3RGdW5jdGlvbigoc291cmNlLCB0YXJnZXQpID0+IHNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kodGFyZ2V0KSk7XG4gICAgfSk7XG4gICAgdGVzdCgncmVzb3VyY2UgZGVwZW5kZW5jeScsICgpID0+IHtcbiAgICAgIHRlc3RGdW5jdGlvbigoc291cmNlLCB0YXJnZXQpID0+IHNvdXJjZS5hZGREZXBlbmRlbmN5KHRhcmdldCkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhc3NlcnRBc3NlbWJseURlcGVuZGVuY3koYXNzZW1ibHk6IGN4YXBpLkNsb3VkQXNzZW1ibHksIHN0YWNrOiBTdGFjaywgZXhwZWN0ZWREZXBzOiBzdHJpbmdbXSkge1xuICBjb25zdCBzdGFjazFBcnQgPSBhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpO1xuICBjb25zdCBzdGFjazFEZXBzID0gc3RhY2sxQXJ0LmRlcGVuZGVuY2llcy5tYXAoeCA9PiB4LmlkKTtcbiAgZXhwZWN0KHN0YWNrMURlcHMpLnRvRXF1YWwoZXhwZWN0ZWREZXBzKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0Tm9EZXBlbmRzT24oYXNzZW1ibHk6IGN4YXBpLkNsb3VkQXNzZW1ibHksIHN0YWNrOiBTdGFjaykge1xuICBsZXQgdGVtcGxhdGVUZXh0O1xuICBpZiAoIShzdGFjayBpbnN0YW5jZW9mIE5lc3RlZFN0YWNrKSkge1xuICAgIHRlbXBsYXRlVGV4dCA9IEpTT04uc3RyaW5naWZ5KGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCkudGVtcGxhdGUpO1xuICB9IGVsc2Uge1xuICAgIHRlbXBsYXRlVGV4dCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBzdGFjay50ZW1wbGF0ZUZpbGUpLCAndXRmLTgnKTtcbiAgfVxuXG4gIC8vIHZlcmlmeSB0ZW1wbGF0ZXMgZG8gbm90IGhhdmUgYW55IFwiRGVwZW5kc09uXCJcbiAgZXhwZWN0KHRlbXBsYXRlVGV4dC5pbmNsdWRlcygnRGVwZW5kc09uJykpLnRvQmVGYWxzeSgpO1xufVxuIl19