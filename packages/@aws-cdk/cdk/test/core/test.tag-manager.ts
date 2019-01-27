import { Test } from 'nodeunit';
import { TagType } from '../../lib/cloudformation/resource';
import { TagManager } from '../../lib/core/tag-manager';

export = {
  '#setTag() supports setting a tag regardless of Type'(test: Test) {
    const notTaggable = new TagManager(TagType.NotTaggable);
    notTaggable.setTag('key', 'value');
    test.deepEqual(notTaggable.renderTags(), undefined);
    test.done();
  },
  'when a tag does not exist': {
    '#removeTag() does not throw an error'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      test.doesNotThrow(() => (mgr.removeTag('dne')));
      test.done();
    },
    '#setTag() creates the tag'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      mgr.setTag('dne', 'notanymore');
      test.deepEqual(mgr.renderTags(), [{key: 'dne', value: 'notanymore'}]);
      test.done();
    }
  },
  'when a tag does exist': {
    '#removeTag() deletes the tag'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      mgr.setTag('dne', 'notanymore');
      mgr.removeTag('dne');
      test.deepEqual(mgr.renderTags(), undefined);
      test.done();
    },
    '#setTag() overwrites the tag'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      mgr.setTag('dne', 'notanymore');
      mgr.setTag('dne', 'iwin');
      test.deepEqual(mgr.renderTags(), [{key: 'dne', value: 'iwin'}]);
      test.done();
    }
  },
  'when there are no tags': {
    '#renderTags() returns undefined'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      test.deepEqual(mgr.renderTags(), undefined );
      test.done();
    },
  },
  '#renderTags() handles standard, map, and ASG tag formats'(test: Test) {
    const tagged: TagManager[] = [];
    const standard = new TagManager(TagType.Standard);
    const asg = new TagManager(TagType.AutoScalingGroup);
    const mapper = new TagManager(TagType.Map);
    tagged.push(standard);
    tagged.push(asg);
    tagged.push(mapper);
    for (const res of tagged) {
      res.setTag('foo', 'bar');
      res.setTag('asg', 'only', {applyToLaunchedInstances: false});
    }
    test.deepEqual(standard.renderTags(), [
      {key: 'foo', value: 'bar'},
      {key: 'asg', value: 'only'},
    ]);
    test.deepEqual(asg.renderTags(), [
      {key: 'foo', value: 'bar', propagateAtLaunch: true},
      {key: 'asg', value: 'only', propagateAtLaunch: false},
    ]);
    test.deepEqual(mapper.renderTags(), {
      foo: 'bar',
      asg: 'only',
    });
    test.done();
  },
  'tags with higher or equal priority always take precedence'(test: Test) {
    const mgr = new TagManager(TagType.Standard);
    mgr.setTag('key', 'myVal', {
      priority: 2,
    });
    mgr.setTag('key', 'newVal', {
      priority: 1,
    });
    mgr.removeTag('key', 1);
    test.deepEqual(mgr.renderTags(), [
      {key: 'key', value: 'myVal'},
    ]);
    mgr.removeTag('key', 2);
    test.deepEqual(mgr.renderTags(), undefined);
    test.done();
  },
};
