import { TagType } from '../lib/cfn-resource';
import { TagManager } from '../lib/tag-manager';

describe('tag manager', () => {
  test('TagManagerOptions can set tagPropertyName', () => {
    const tagPropName = 'specialName';
    const mgr = new TagManager(TagType.MAP, 'Foo', undefined, { tagPropertyName: tagPropName });

    expect(mgr.tagPropertyName).toEqual(tagPropName);
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
});
