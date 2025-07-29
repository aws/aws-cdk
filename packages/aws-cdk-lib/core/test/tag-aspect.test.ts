import { Construct } from 'constructs';
import { toCloudFormation } from './util';
import {
  CfnResource,
  CfnResourceProps,
  RemoveTag,
  Stack,
  Tag,
  TagManager,
  TagType,
  Aspects,
  Tags,
  ITaggable,
  ITaggableV2,
  AspectPriority,
  UnscopedValidationError,
} from '../lib';
import { synthesize } from '../lib/private/synthesis';

class TaggableResource extends CfnResource implements ITaggable {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties?.tags;
    this.tags = new TagManager(TagType.STANDARD, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.cfnProperties;
  }
}

class TaggableResource2 extends CfnResource implements ITaggableV2 {
  public readonly cdkTagManager: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties?.tags;
    this.cdkTagManager = new TagManager(TagType.STANDARD, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.cfnProperties;
  }
}

class AsgTaggableResource extends CfnResource implements ITaggable {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties?.tags;
    this.tags = new TagManager(TagType.AUTOSCALING_GROUP, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.cfnProperties;
  }
}

class MapTaggableResource extends CfnResource implements ITaggable {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties?.tags;
    this.tags = new TagManager(TagType.MAP, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.cfnProperties;
  }
}

describe('tag aspect', () => {
  test.each([
    ['TaggableResource', TaggableResource], ['TaggableResource2', TaggableResource2],
  ])('Tag visit all children of the applied node, using class %s', (_, taggableClass) => {
    const root = new Stack();
    const res = new taggableClass(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new taggableClass(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const asg = new AsgTaggableResource(res, 'AsgFakeResource', {
      type: 'AWS::Fake::Thing',
    });

    const map = new MapTaggableResource(res, 'MapFakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Aspects.of(res).add(new Tag('foo', 'bar'));

    synthesize(root);

    expect(TagManager.of(res)?.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    expect(TagManager.of(res2)?.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    expect(map.tags.renderTags()).toEqual({ foo: 'bar' });
    expect(asg.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar', propagateAtLaunch: true }]);

    const template = toCloudFormation(root);
    expect(template.Resources.FakeResource).toEqual({
      Type: 'AWS::Fake::Thing',
      Properties: {
        tags: [{ key: 'foo', value: 'bar' }],
      },
    });
  });

  test('The last aspect applied takes precedence', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Aspects.of(res).add(new Tag('foo', 'bar'));
    Aspects.of(res).add(new Tag('foo', 'foobar'));
    Aspects.of(res).add(new Tag('foo', 'baz'));
    Aspects.of(res2).add(new Tag('foo', 'good'));
    synthesize(root);
    expect(res.tags.renderTags()).toEqual([{ key: 'foo', value: 'baz' }]);
    expect(res2.tags.renderTags()).toEqual([{ key: 'foo', value: 'good' }]);
  });

  test('RemoveTag will remove a tag if it exists', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const asg = new AsgTaggableResource(res, 'AsgFakeResource', {
      type: 'AWS::Fake::Thing',
    });

    const map = new MapTaggableResource(res, 'MapFakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Aspects.of(root).add(new Tag('root', 'was here'));
    Aspects.of(res).add(new Tag('first', 'there is only 1'));
    Aspects.of(res).add(new RemoveTag('root'));
    Aspects.of(res).add(new RemoveTag('doesnotexist'));
    synthesize(root);

    expect(res.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1' }]);
    expect(map.tags.renderTags()).toEqual({ first: 'there is only 1' });
    expect(asg.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1', propagateAtLaunch: true }]);
    expect(res2.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1' }]);
  });

  test.each([false, true])('Tags applied without priority get priority value that depends on feature flag %p', (flag) => {
    const root = new Stack();
    root.node.setContext('@aws-cdk/core:aspectPrioritiesMutating', flag);
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });

    Tags.of(root).add('root', 'was here');
    Tags.of(res).add('first', 'there is only 1');
    Tags.of(res).remove('root');

    const expected = flag ? AspectPriority.MUTATING : AspectPriority.DEFAULT;

    const rootAspectApplications = Aspects.of(root).applied;
    expect(rootAspectApplications[0].priority).toEqual(expected);
    const resAspectApplications = Aspects.of(res).applied;
    expect(resAspectApplications[0].priority).toEqual(expected);
    expect(resAspectApplications[1].priority).toEqual(expected);
  });

  test('add will add a tag and remove will remove a tag if it exists', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const asg = new AsgTaggableResource(res, 'AsgFakeResource', {
      type: 'AWS::Fake::Thing',
    });

    const map = new MapTaggableResource(res, 'MapFakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Tags.of(root).add('root', 'was here');
    Tags.of(res).add('first', 'there is only 1');
    Tags.of(res).remove('root');
    Tags.of(res).remove('doesnotexist');

    synthesize(root);

    expect(res.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1' }]);
    expect(map.tags.renderTags()).toEqual({ first: 'there is only 1' });
    expect(asg.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1', propagateAtLaunch: true }]);
    expect(res2.tags.renderTags()).toEqual([{ key: 'first', value: 'there is only 1' }]);
  });

  test('the #visit function is idempotent', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });

    Aspects.of(res).add(new Tag('foo', 'bar'));
    synthesize(root);
    expect(res.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    synthesize(root);
    expect(res.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    synthesize(root);
    expect(res.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
  });

  test('removeTag Aspects by default will override child Tag Aspects', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Aspects.of(res).add(new RemoveTag('key'));
    Aspects.of(res2).add(new Tag('key', 'value'));
    synthesize(root);
    expect(res.tags.renderTags()).toEqual(undefined);
    expect(res2.tags.renderTags()).toEqual(undefined);
  });

  test('removeTag Aspects with priority 0 will not override child Tag Aspects', () => {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    Aspects.of(res).add(new RemoveTag('key', { priority: 0 }));
    Aspects.of(res2).add(new Tag('key', 'value'));
    synthesize(root);
    expect(res.tags.renderTags()).toEqual(undefined);
    expect(res2.tags.renderTags()).toEqual([{ key: 'key', value: 'value' }]);
  });

  test('Aspects are merged with tags created by L1 Constructor', () => {
    const root = new Stack();
    const aspectBranch = new TaggableResource(root, 'FakeBranchA', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          { key: 'aspects', value: 'overwrite' },
          { key: 'cfn', value: 'is cool' },
        ],
      },
    });
    const asgResource = new AsgTaggableResource(aspectBranch, 'FakeAsg', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          { key: 'aspects', value: 'overwrite', propagateAtLaunch: false },
          { key: 'cfn', value: 'is cool', propagateAtLaunch: true },
        ],
      },
    });
    const mapTaggable = new MapTaggableResource(aspectBranch, 'FakeSam', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: {
          aspects: 'overwrite',
          cfn: 'is cool',
        },
      },
    });
    const cfnBranch = new TaggableResource(root, 'FakeBranchB', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          { key: 'cfn', value: 'is cool' },
        ],
      },
    });
    Aspects.of(aspectBranch).add(new Tag('aspects', 'rule'));
    synthesize(root);
    expect(aspectBranch.testProperties().tags).toEqual([{ key: 'aspects', value: 'rule' }, { key: 'cfn', value: 'is cool' }]);
    expect(asgResource.testProperties().tags).toEqual([
      { key: 'aspects', value: 'rule', propagateAtLaunch: true },
      { key: 'cfn', value: 'is cool', propagateAtLaunch: true },
    ]);
    expect(mapTaggable.testProperties().tags).toEqual({
      aspects: 'rule',
      cfn: 'is cool',
    });
    expect(cfnBranch.testProperties().tags).toEqual([{ key: 'cfn', value: 'is cool' }]);
  });

  describe('when invalid tag properties are passed from L1s', () => {
    test('map passed instead of array it raises', () => {
      const root = new Stack();
      expect(() => {
        new TaggableResource(root, 'FakeBranchA', {
          type: 'AWS::Fake::Thing',
          properties: {
            tags: {
              cfn: 'is cool',
              aspects: 'overwrite',
            },
          },
        });
      }).toThrow();
      expect(() => {
        new AsgTaggableResource(root, 'FakeBranchA', {
          type: 'AWS::Fake::Thing',
          properties: {
            tags: {
              cfn: 'is cool',
              aspects: 'overwrite',
              propagateAtLaunch: true,
            },
          },
        });
      }).toThrow();
    });

    test('if array is passed instead of map it raises', () => {
      const root = new Stack();
      expect(() => {
        new MapTaggableResource(root, 'FakeSam', {
          type: 'AWS::Fake::Thing',
          properties: {
            tags: [
              { key: 'cfn', value: 'is cool', propagateAtLaunch: true },
              { key: 'aspects', value: 'overwrite' },
            ],
          },
        });
      }).toThrow();
    });
  });

  test('if tag value is undefined, it raises with appropriate content', () => {
    expect(() => {
      new Tag('test-key', undefined as any);
    }).toThrow(UnscopedValidationError);

    expect(() => {
      new Tag('test-key', undefined as any);
    }).toThrow("Tag 'test-key' must have a value");
  });
});
