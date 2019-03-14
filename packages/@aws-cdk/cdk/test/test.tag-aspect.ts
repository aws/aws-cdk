import { Test } from 'nodeunit';
import { CfnResource, CfnResourceProps, Construct, RemoveTag, Stack, Tag, TagManager, TagType } from '../lib';

class TaggableResource extends CfnResource {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties === undefined ? undefined : props.properties.tags;
    this.tags = new TagManager(TagType.Standard, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.properties;
  }
}

class AsgTaggableResource extends CfnResource {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties === undefined ? undefined : props.properties.tags;
    this.tags = new TagManager(TagType.AutoScalingGroup, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.properties;
  }
}

class MapTaggableResource extends CfnResource {
  public readonly tags: TagManager;
  constructor(scope: Construct, id: string, props: CfnResourceProps) {
    super(scope, id, props);
    const tags = props.properties === undefined ? undefined : props.properties.tags;
    this.tags = new TagManager(TagType.Map, 'AWS::Fake::Resource', tags);
  }
  public testProperties() {
    return this.properties;
  }
}

export = {
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
    res.node.apply(new Tag('foo', 'bar'));
    test.deepEqual(res.node.aspects.length, 1);
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(map.tags.renderTags(), {foo: 'bar'});
    test.deepEqual(asg.tags.renderTags(), [{key: 'foo', value: 'bar', propagateAtLaunch: true}]);
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
    res.node.apply(new Tag('foo', 'bar'));
    res.node.apply(new Tag('foo', 'foobar'));
    res.node.apply(new Tag('foo', 'baz'));
    res2.node.apply(new Tag('foo', 'good'));
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'baz'}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'foo', value: 'good'}]);
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
    root.node.apply(new Tag('root', 'was here'));
    res.node.apply(new Tag('first', 'there is only 1'));
    res.node.apply(new RemoveTag('root'));
    res.node.apply(new RemoveTag('doesnotexist'));
    root.node.prepareTree();

    test.deepEqual(res.tags.renderTags(), [{key: 'first', value: 'there is only 1'}]);
    test.deepEqual(map.tags.renderTags(), {first: 'there is only 1'});
    test.deepEqual(asg.tags.renderTags(), [{key: 'first', value: 'there is only 1', propagateAtLaunch: true}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'first', value: 'there is only 1'}]);
    test.done();
  },
  'the #visit function is idempotent'(test: Test) {
    const root = new Stack();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });

    res.node.apply(new Tag('foo', 'bar'));
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
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
    res.node.apply(new RemoveTag('key'));
    res2.node.apply(new Tag('key', 'value'));
    root.node.prepareTree();
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
    res.node.apply(new RemoveTag('key', {priority: 0}));
    res2.node.apply(new Tag('key', 'value'));
    root.node.prepareTree();
    test.deepEqual(res.tags.renderTags(), undefined);
    test.deepEqual(res2.tags.renderTags(), [{key: 'key', value: 'value'}]);
    test.done();
  },
  'Aspects are merged with tags created by L1 Constructor'(test: Test) {
    const root = new Stack();
    const aspectBranch = new TaggableResource(root, 'FakeBranchA', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          {key: 'aspects', value: 'overwrite'},
          {key: 'cfn', value: 'is cool'},
        ],
      },
    });
    const asgResource = new AsgTaggableResource(aspectBranch, 'FakeAsg', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          {key: 'aspects', value: 'overwrite', propagateAtLaunch: false},
          {key: 'cfn', value: 'is cool', propagateAtLaunch: true},
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
          {key: 'cfn', value: 'is cool'},
        ],
      },
    });
    aspectBranch.node.apply(new Tag('aspects', 'rule'));
    root.node.prepareTree();
    test.deepEqual(aspectBranch.testProperties().tags, [{key: 'aspects', value: 'rule'}, {key: 'cfn', value: 'is cool'}]);
    test.deepEqual(asgResource.testProperties().tags, [
      {key: 'aspects', value: 'rule', propagateAtLaunch: true},
      {key: 'cfn', value: 'is cool', propagateAtLaunch: true}
    ]);
    test.deepEqual(mapTaggable.testProperties().tags, {
      aspects: 'rule',
      cfn: 'is cool',
    });
    test.deepEqual(cfnBranch.testProperties().tags, [{key: 'cfn', value: 'is cool'}]);
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
              {key: 'cfn', value: 'is cool', propagateAtLaunch: true},
              {key: 'aspects', value: 'overwrite'},
            ],
          },
        });
      });
      test.done();
    },
  },
};
