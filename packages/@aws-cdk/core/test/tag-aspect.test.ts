import { Construct } from 'constructs';
import { nodeunitShim, Test } from 'nodeunit-shim';
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

nodeunitShim({
  'Tag visit all children of the applied node'(test: Test) {
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

    test.deepEqual(res.tags.renderTags(), [{ key: 'foo', value: 'bar' }]);
    test.deepEqual(res2.tags.renderTags(), [{ key: 'foo', value: 'bar' }]);
    test.deepEqual(map.tags.renderTags(), { foo: 'bar' });
    test.deepEqual(asg.tags.renderTags(), [{ key: 'foo', value: 'bar', propagateAtLaunch: true }]);
    test.done();
  },
  'The last aspect applied takes precedence'(test: Test) {
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
    test.deepEqual(res.tags.renderTags(), [{ key: 'foo', value: 'baz' }]);
    test.deepEqual(res2.tags.renderTags(), [{ key: 'foo', value: 'good' }]);
    test.done();
  },
  'RemoveTag will remove a tag if it exists'(test: Test) {
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

    test.deepEqual(res.tags.renderTags(), [{ key: 'first', value: 'there is only 1' }]);
    test.deepEqual(map.tags.renderTags(), { first: 'there is only 1' });
    test.deepEqual(asg.tags.renderTags(), [{ key: 'first', value: 'there is only 1', propagateAtLaunch: true }]);
    test.deepEqual(res2.tags.renderTags(), [{ key: 'first', value: 'there is only 1' }]);
    test.done();
  },
  'add will add a tag and remove will remove a tag if it exists'(test: Test) {
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

    test.deepEqual(res.tags.renderTags(), [{ key: 'first', value: 'there is only 1' }]);
    test.deepEqual(map.tags.renderTags(), { first: 'there is only 1' });
    test.deepEqual(asg.tags.renderTags(), [{ key: 'first', value: 'there is only 1', propagateAtLaunch: true }]);
    test.deepEqual(res2.tags.renderTags(), [{ key: 'first', value: 'there is only 1' }]);
    test.done();
  },
  'the #visit function is idempotent'(test: Test) {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });

    Aspects.of(res).add(new Tag('foo', 'bar'));
    synthesize(root);
    test.deepEqual(res.tags.renderTags(), [{ key: 'foo', value: 'bar' }]);
    synthesize(root);
    test.deepEqual(res.tags.renderTags(), [{ key: 'foo', value: 'bar' }]);
    synthesize(root);
    test.deepEqual(res.tags.renderTags(), [{ key: 'foo', value: 'bar' }]);
    test.done();
  },
  'removeTag Aspects by default will override child Tag Aspects'(test: Test) {
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
    test.deepEqual(res.tags.renderTags(), undefined);
    test.deepEqual(res2.tags.renderTags(), undefined);
    test.done();
  },
  'removeTag Aspects with priority 0 will not override child Tag Aspects'(test: Test) {
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
    test.deepEqual(res.tags.renderTags(), undefined);
    test.deepEqual(res2.tags.renderTags(), [{ key: 'key', value: 'value' }]);
    test.done();
  },
  'Aspects are merged with tags created by L1 Constructor'(test: Test) {
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
    test.deepEqual(aspectBranch.testProperties().tags, [{ key: 'aspects', value: 'rule' }, { key: 'cfn', value: 'is cool' }]);
    test.deepEqual(asgResource.testProperties().tags, [
      { key: 'aspects', value: 'rule', propagateAtLaunch: true },
      { key: 'cfn', value: 'is cool', propagateAtLaunch: true },
    ]);
    test.deepEqual(mapTaggable.testProperties().tags, {
      aspects: 'rule',
      cfn: 'is cool',
    });
    test.deepEqual(cfnBranch.testProperties().tags, [{ key: 'cfn', value: 'is cool' }]);
    test.done();
  },
  'when invalid tag properties are passed from L1s': {
    'map passed instead of array it raises'(test: Test) {
      const root = new Stack();
      test.throws(() => {
        new TaggableResource(root, 'FakeBranchA', {
          type: 'AWS::Fake::Thing',
          properties: {
            tags: {
              cfn: 'is cool',
              aspects: 'overwrite',
            },
          },
        });
      });
      test.throws(() => {
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
      });
      test.done();
    },
    'if array is passed instead of map it raises'(test: Test) {
      const root = new Stack();
      test.throws(() => {
        new MapTaggableResource(root, 'FakeSam', {
          type: 'AWS::Fake::Thing',
          properties: {
            tags: [
              { key: 'cfn', value: 'is cool', propagateAtLaunch: true },
              { key: 'aspects', value: 'overwrite' },
            ],
          },
        });
      });
      test.done();
    },
  },
});
