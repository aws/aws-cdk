import { Construct } from 'constructs';
import * as cdk from '../../../aws-cdk-lib';
import { TagType } from '../lib/cfn-resource';
import { TagManager } from '../lib/tag-manager';

describe('tag manager', () => {
  test('TagManagerOptions can set tagPropertyName', () => {
    const tagPropName = 'specialName';
    const mgr = new TagManager(TagType.MAP, 'Foo', undefined, { tagPropertyName: tagPropName });

    expect(mgr.tagPropertyName).toEqual(tagPropName);
  });

  test.each(['early' as const, 'late' as const])('supplying tags %s works for MAP tags', (when) => {
    const externalTags = { someTag: 'someValue' };
    const mgr = new TagManager(TagType.MAP, 'Foo', when === 'early' ? externalTags : undefined);
    mgr.setTag('givenTag', 'givenValue');

    expect(mgr.renderTags(when === 'late' ? externalTags : undefined)).toEqual({
      givenTag: 'givenValue',
      someTag: 'someValue',
    });
  });

  test.each(['early' as const, 'late' as const])('supplying tags %s works for STANDARD tags', (when) => {
    const externalTags = [{ key: 'someTag', value: 'someValue' }];
    const mgr = new TagManager(TagType.STANDARD, 'Foo', when === 'early' ? externalTags : undefined);
    mgr.setTag('givenTag', 'givenValue');

    expect(mgr.renderTags(when === 'late' ? externalTags : undefined)).toEqual([
      {
        key: 'givenTag',
        value: 'givenValue',
      },
      {
        key: 'someTag',
        value: 'someValue',
      },
    ]);
  });

  test('#setTag() supports setting a tag regardless of Type', () => {
    const notTaggable = new TagManager(TagType.NOT_TAGGABLE, 'AWS::Resource::Type');
    notTaggable.setTag('key', 'value');
    expect(notTaggable.renderTags()).toEqual(undefined);
  });

  describe('when a tag does not exist', () => {
    test('#removeTag() does not throw an error', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      expect(() => (mgr.removeTag('dne', 0))).not.toThrow();
    });

    test('#setTag() creates the tag', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      mgr.setTag('dne', 'notanymore');
      expect(mgr.renderTags()).toEqual([{ key: 'dne', value: 'notanymore' }]);
    });
  });

  describe('when a tag does exist', () => {
    test('#removeTag() deletes the tag', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      mgr.setTag('dne', 'notanymore', 0);
      mgr.removeTag('dne', 0);
      expect(mgr.renderTags()).toEqual(undefined);
    });

    test('#setTag() overwrites the tag', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      mgr.setTag('dne', 'notanymore');
      mgr.setTag('dne', 'iwin');
      expect(mgr.renderTags()).toEqual([{ key: 'dne', value: 'iwin' }]);
    });
  });

  describe('when there are no tags', () => {
    test('#renderTags() returns undefined', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      expect(mgr.renderTags()).toEqual(undefined);
    });

    test('#hasTags() returns false', () => {
      const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
      expect(mgr.hasTags()).toEqual(false);
    });
  });

  test('#renderTags() handles standard, map, keyValue, and ASG tag formats', () => {
    const tagged: TagManager[] = [];
    const standard = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
    const asg = new TagManager(TagType.AUTOSCALING_GROUP, 'AWS::Resource::Type');
    const keyValue = new TagManager(TagType.KEY_VALUE, 'AWS::Resource::Type');
    const mapper = new TagManager(TagType.MAP, 'AWS::Resource::Type');
    tagged.push(standard);
    tagged.push(asg);
    tagged.push(keyValue);
    tagged.push(mapper);
    for (const res of tagged) {
      res.setTag('foo', 'bar');
      res.setTag('asg', 'only', 0, false);
    }
    expect(standard.renderTags()).toEqual([
      { key: 'asg', value: 'only' },
      { key: 'foo', value: 'bar' },
    ]);
    expect(asg.renderTags()).toEqual([
      { key: 'asg', value: 'only', propagateAtLaunch: false },
      { key: 'foo', value: 'bar', propagateAtLaunch: true },
    ]);
    expect(keyValue.renderTags()).toEqual([
      { Key: 'asg', Value: 'only' },
      { Key: 'foo', Value: 'bar' },
    ]);
    expect(mapper.renderTags()).toEqual({
      foo: 'bar',
      asg: 'only',
    });
  });

  test('when there are tags it hasTags returns true', () => {
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
    mgr.setTag('key', 'myVal', 2);
    mgr.setTag('key', 'newVal', 1);
    expect(mgr.hasTags()).toEqual(true);
  });

  test('tags with higher or equal priority always take precedence', () => {
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
    mgr.setTag('key', 'myVal', 2);
    mgr.setTag('key', 'newVal', 1);
    expect(mgr.renderTags()).toEqual([
      { key: 'key', value: 'myVal' },
    ]);
    mgr.removeTag('key', 1);
    expect(mgr.renderTags()).toEqual([
      { key: 'key', value: 'myVal' },
    ]);
    mgr.removeTag('key', 2);
    expect(mgr.renderTags()).toEqual(undefined);
  });

  test('tags are always ordered by key name', () => {
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
    mgr.setTag('key', 'foo');
    mgr.setTag('aardvark', 'zebra');
    mgr.setTag('name', 'test');
    expect(mgr.renderTags()).toEqual([
      { key: 'aardvark', value: 'zebra' },
      { key: 'key', value: 'foo' },
      { key: 'name', value: 'test' },
    ]);
    mgr.setTag('myKey', 'myVal');
    expect(mgr.renderTags()).toEqual([
      { key: 'aardvark', value: 'zebra' },
      { key: 'key', value: 'foo' },
      { key: 'myKey', value: 'myVal' },
      { key: 'name', value: 'test' },
    ]);
  });

  test('can add direct tags: STANDARD', () => {
    // GIVEN
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');

    // WHEN
    mgr.setTag('key', 'value');
    const rendered = mgr.renderTags([
      { key: 'key2', value: 'value2' },
    ]);

    // THEN
    expect(rendered).toEqual([
      { key: 'key', value: 'value' },
      { key: 'key2', value: 'value2' },
    ]);
  });

  test('can add direct tags: MAP', () => {
    // GIVEN
    const mgr = new TagManager(TagType.MAP, 'AWS::Resource::Type');

    // WHEN
    mgr.setTag('key', 'value');
    const rendered = mgr.renderTags({
      key2: 'value2',
    });

    // THEN
    expect(rendered).toEqual({
      key: 'value',
      key2: 'value2',
    });
  });

  test('may not specify external tags both at TagManager creation AND into renderTags', () => {
    // GIVEN
    const mgr = new TagManager(TagType.MAP, 'AWS::Resource::Type', { initial: 'tag' });

    // WHEN
    expect(() => mgr.renderTags({
      external: 'tag',
    })).toThrow(/not both/);
  });

  test('it is safe to call renderTags multiple times with external tags', () => {
    // GIVEN
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Resource::Type');
    mgr.setTag('tagOne', 'one');
    mgr.setTag('tagTwo', 'two');

    // WHEN
    const renders = [1, 2].map(() => mgr.renderTags([{ key: 'external', value: 'tag' }]));
    expect(renders[0]).toEqual(renders[1]);
  });

  test('excludeResourceTypes only tags resources that do not match', () => {
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Fake::Resource');

    expect(false).toEqual(mgr.applyTagAspectHere([], ['AWS::Fake::Resource']));
    expect(true).toEqual(mgr.applyTagAspectHere([], ['AWS::Wrong::Resource']));
  });

  test('includeResourceTypes only tags resources that match', () => {
    const mgr = new TagManager(TagType.STANDARD, 'AWS::Fake::Resource');

    expect(true).toEqual(mgr.applyTagAspectHere(['AWS::Fake::Resource'], []));
    expect(false).toEqual(mgr.applyTagAspectHere(['AWS::Wrong::Resource'], []));
  });

  test('isTaggable function works as expected', () => {
    const app = new cdk.App();
    const taggableConstruct = new TaggableConstruct(app, 'MyConstruct');
    const nonTaggableConstruct = new NonTaggableConstruct(app, 'NonTaggableConstruct');

    // Assert that isTaggable returns true for a taggable construct
    expect(TagManager.isTaggable(taggableConstruct)).toEqual(true);

    // Assert that isTaggable returns false (not undefined) for a non-taggable construct
    expect(TagManager.isTaggable(nonTaggableConstruct)).not.toEqual(undefined);
    expect(TagManager.isTaggable(nonTaggableConstruct)).toEqual(false);
  });
});

// `Stack` extends ITaggable so this construct is Taggable by default
class TaggableConstruct extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new cdk.CfnResource(this, 'Resource', {
      type: 'Whatever::The::Type',
      properties: {
        Tags: this.tags.renderedTags,
      },
    });
  }
}

// Simple Construct that does not extend ITaggable
class NonTaggableConstruct extends Construct {
  public readonly id: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.id = id;
  }
}
