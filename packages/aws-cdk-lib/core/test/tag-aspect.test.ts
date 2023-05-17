import { Construct } from 'constructs';
import { CfnResource, CfnResourceProps, RemoveTag, Stack, Tag, TagManager, TagType, Aspects, Tags } from '../lib';
import { synthesize } from '../lib/private/synthesis';

class TaggableResource extends CfnResource {
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

class AsgTaggableResource extends CfnResource {
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

class MapTaggableResource extends CfnResource {
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
  test('Tag visit all children of the applied node', () => {
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
    Aspects.of(res).add(new Tag('foo', 'bar'));

    synthesize(root);

    expect(res.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    expect(res2.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar' }]);
    expect(map.tags.renderTags()).toEqual({ foo: 'bar' });
    expect(asg.tags.renderTags()).toEqual([{ key: 'foo', value: 'bar', propagateAtLaunch: true }]);
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
});
