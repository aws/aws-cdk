import { Test } from 'nodeunit';
import { TagType } from '../../lib/cloudformation/resource';
import { TagManager } from '../../lib/core/tag-manager';

// class TaggableResource extends Resource {
//   public readonly tagType = TagType.Standard;
// }
//
// class AsgTaggableResource extends Resource {
//   public readonly tagType = TagType.AutoScalingGroup;
// }
//
// class MapTaggableResource extends Resource {
//   public readonly tagType = TagType.Map;
// }

export = {
  '#setTag() supports setting a tag regardless of Type'(test: Test) {
    const notTaggable = new TagManager(TagType.NotTaggable);
    notTaggable.setTag('key', 'value');
    test.deepEqual(notTaggable.renderTags(), undefined);
    test.done();
  },
  'when there are no tags': {
    '#renderTags() returns undefined'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      test.deepEqual(mgr.renderTags(), undefined );
      test.done();
    },
    '#renderTags() returns undefined with set and remove'(test: Test) {
      const mgr = new TagManager(TagType.Standard);
      mgr.setTag('foo', 'bar');
      mgr.removeTag('foo');
      test.deepEqual(mgr.renderTags(), undefined );
      test.done();
    },
  }
};
