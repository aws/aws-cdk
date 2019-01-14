import { Test } from 'nodeunit';
import { RemoveTag, Resource, Stack, Tag, TagManager, TagType } from '../../lib';

class TaggableResource extends Resource {
  public readonly tags = new TagManager(TagType.Standard);
  public testProperties() {
    return this.properties;
  }
}

class AsgTaggableResource extends TaggableResource {
  public readonly tags = new TagManager(TagType.AutoScalingGroup);
}

class MapTaggableResource extends TaggableResource {
  public readonly tags = new TagManager(TagType.Map);
}

class TestRoot extends Stack {
  constructor() {
    super(undefined, 'TestStack', { env: { account: '123456789012', region: 'us-east-1' } });
  }
  public testInvokeAspects() {
    this.invokeAspects();
  }
}

export = {
  'Tag visit all children of the applied node'(test: Test) {
    const root = new TestRoot();
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
    res.apply(new Tag('foo', 'bar'));
    test.deepEqual(res.node.aspects.length, 1);
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(map.tags.renderTags(), {foo: 'bar'});
    test.deepEqual(asg.tags.renderTags(), [{key: 'foo', value: 'bar', propagateAtLaunch: true}]);
    test.done();
  },
  'The last aspect applied takes precedence'(test: Test) {
    const root = new TestRoot();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    res.apply(new Tag('foo', 'bar'));
    res.apply(new Tag('foo', 'foobar'));
    res.apply(new Tag('foo', 'baz'));
    res2.apply(new Tag('foo', 'good'));
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'baz'}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'foo', value: 'good'}]);
    test.done();
  },
  'RemoveTag will remove a tag if it exists'(test: Test) {
    const root = new TestRoot();
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
    root.apply(new Tag('root', 'was here'));
    res.apply(new Tag('first', 'there is only 1'));
    res.apply(new RemoveTag('root'));
    res.apply(new RemoveTag('doesnotexist'));
    root.testInvokeAspects();

    test.deepEqual(res.tags.renderTags(), [{key: 'first', value: 'there is only 1'}]);
    test.deepEqual(map.tags.renderTags(), {first: 'there is only 1'});
    test.deepEqual(asg.tags.renderTags(), [{key: 'first', value: 'there is only 1', propagateAtLaunch: true}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'first', value: 'there is only 1'}]);
    test.done();
  },
  'the #visit function is idempotent'(test: Test) {
    const root = new TestRoot();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });

    res.apply(new Tag('foo', 'bar'));
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.done();
  },
  'include restricts tag application to resources types in the list'(test: Test) {
    const root = new TestRoot();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const asg = new AsgTaggableResource(res, 'AsgFakeResource', {
      type: 'AWS::Fake::Asg',
    });

    const map = new MapTaggableResource(res, 'MapFakeResource', {
      type: 'AWS::Fake::Map',
    });
    res.apply(new Tag('foo', 'bar', {include: ['AWS::Fake::Asg']}));
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), undefined);
    test.deepEqual(map.tags.renderTags(), undefined);
    test.deepEqual(res2.tags.renderTags(), undefined);
    test.deepEqual(asg.tags.renderTags(), [{key: 'foo', value: 'bar', propagateAtLaunch: true}]);
    test.deepEqual(map.testProperties().tags, undefined);
    test.done();
  },
  'exclude prevents tag application to resource types in the list'(test: Test) {
    const root = new TestRoot();
    const res = new TaggableResource(root, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const res2 = new TaggableResource(res, 'FakeResource', {
      type: 'AWS::Fake::Thing',
    });
    const asg = new AsgTaggableResource(res, 'AsgFakeResource', {
      type: 'AWS::Fake::Asg',
    });

    const map = new MapTaggableResource(res, 'MapFakeResource', {
      type: 'AWS::Fake::Map',
    });
    res.apply(new Tag('foo', 'bar', {exclude: ['AWS::Fake::Asg']}));
    root.testInvokeAspects();
    test.deepEqual(res.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(res2.tags.renderTags(), [{key: 'foo', value: 'bar'}]);
    test.deepEqual(asg.tags.renderTags(), undefined);
    test.deepEqual(map.tags.renderTags(), {foo: 'bar'});
    test.done();
  },
  'Aspects are mutually exclusive with tags created by L1 Constructor'(test: Test) {
    const root = new TestRoot();
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
    aspectBranch.apply(new Tag('aspects', 'rule'));
    root.testInvokeAspects();
    test.deepEqual(aspectBranch.tags.renderTags(), [{key: 'aspects', value: 'rule'}]);
    test.deepEqual(cfnBranch.testProperties().tags, [{key: 'cfn', value: 'is cool'}]);
    test.done();
  },
};
