import { Annotations, App, Stack, Tags } from '../lib';
import { getWarnings } from './util';

describe('ChangeSet tagging with explicitStackTags', () => {
  test('tags are applied to ChangeSets even when explicitStackTags is enabled', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': true,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    Tags.of(stack).add('TestKey', 'TestValue');
    Tags.of(stack).add('Environment', 'Production');
    Tags.of(stack).add('Project', 'CDK-Fix');

    // THEN
    // Stack should have tags for ChangeSets
    const stackTags = stack.tags.tagValues();
    expect(stackTags).toHaveProperty('TestKey', 'TestValue');
    expect(stackTags).toHaveProperty('Environment', 'Production');
    expect(stackTags).toHaveProperty('Project', 'CDK-Fix');
  });

  test('applyToChangeSets can be disabled explicitly', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': true,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    Tags.of(stack).add('TestKey', 'TestValue', { applyToChangeSets: false });

    // THEN
    // Stack should NOT have tags when applyToChangeSets is false
    const stackTags = stack.tags.tagValues();
    expect(Object.keys(stackTags)).toHaveLength(0);
  });

  test('legacy behavior is maintained when explicitStackTags is not enabled', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': false,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    Tags.of(stack).add('TestKey', 'TestValue');

    // THEN
    // Stack should have tags (legacy behavior)
    const stackTags = stack.tags.tagValues();
    expect(stackTags).toHaveProperty('TestKey', 'TestValue');
  });

  test('direct stack tagging still works with addStackTag', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': true,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    stack.addStackTag('DirectTag', 'DirectValue');

    // THEN
    const stackTags = stack.tags.tagValues();
    expect(stackTags).toHaveProperty('DirectTag', 'DirectValue');
  });

  test('mixed tagging approaches work together', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': true,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    stack.addStackTag('DirectTag', 'DirectValue');
    Tags.of(stack).add('AspectTag', 'AspectValue');
    Tags.of(stack).add('NoChangeSetTag', 'NoValue', { applyToChangeSets: false });

    // THEN
    const stackTags = stack.tags.tagValues();
    expect(stackTags).toHaveProperty('DirectTag', 'DirectValue');
    expect(stackTags).toHaveProperty('AspectTag', 'AspectValue');
    expect(stackTags).not.toHaveProperty('NoChangeSetTag');
  });

  test('tags with tokens show warning but still apply to ChangeSets', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/core:explicitStackTags': true,
      },
    });
    const stack = new Stack(app, 'TestStack');

    // WHEN
    Tags.of(stack).add('StaticKey', 'StaticValue');
    Tags.of(stack).add('TokenKey', stack.stackName); // This contains a token

    // Synthesize to trigger warnings
    app.synth();

    // THEN
    const warnings = getWarnings(app.synth());
    // Should have warning about token tags
    const tokenWarnings = warnings.filter(w => 
      w.message.includes('Ignoring stack tags that contain deploy-time values')
    );
    expect(tokenWarnings.length).toBeGreaterThan(0);
    
    // But static tags should still be applied
    const stackTags = stack.tags.tagValues();
    expect(stackTags).toHaveProperty('StaticKey', 'StaticValue');
  });
});