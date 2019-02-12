import { Test } from 'nodeunit';
import { RemoveTag, Resource, Stack, Tag, TagManager, TagType } from '../../lib';

class TaggableResource extends Resource {
  public readonly tags = new TagManager(TagType.Standard, 'AWS::Fake::Resource');
  public testProperties() {
    return this.properties;
  }
}

class AsgTaggableResource extends TaggableResource {
  public readonly tags = new TagManager(TagType.AutoScalingGroup, 'AWS::Fake::Resource');
}

class MapTaggableResource extends TaggableResource {
  public readonly tags = new TagManager(TagType.Map, 'AWS::Fake::Resource');
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
  'Aspects are mutually exclusive with tags created by L1 Constructor'(test: Test) {
    const root = new Stack();
    const aspectBranch = new TaggableResource(root, 'FakeBranchA', {
      type: 'AWS::Fake::Thing',
      properties: {
        tags: [
          {key: 'cfn', value: 'is cool'},
        ],
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
    test.deepEqual(aspectBranch.tags.renderTags(), [{key: 'aspects', value: 'rule'}]);
    test.deepEqual(cfnBranch.testProperties().tags, [{key: 'cfn', value: 'is cool'}]);
    test.done();
  },
};
