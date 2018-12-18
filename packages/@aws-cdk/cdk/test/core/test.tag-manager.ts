import { Test } from 'nodeunit';
import { Construct, Root } from '../../lib/core/construct';
import { ITaggable, TagManager } from '../../lib/core/tag-manager';
import { resolve } from '../../lib/core/tokens';

class ChildTagger extends Construct implements ITaggable {
  public readonly tags: TagManager;
  constructor(parent: Construct, name: string) {
    super(parent, name);
    this.tags = new TagManager(parent);
  }
}

class Child extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);
  }
}

export = {
  'TagManger handles tags for a Contruct Tree': {
    'setTag by default propagates to children'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagger1 = new ChildTagger(ctagger, 'two');
      const ctagger2 = new ChildTagger(root, 'three');

      // not taggable at all
      new Child(ctagger, 'notag');

      const tag = {key: 'Name', value: 'TheCakeIsALie'};
      ctagger.tags.setTag(tag.key, tag.value);

      const tagArray = [tag];
      for (const construct of [ctagger, ctagger1]) {
        test.deepEqual(resolve(construct.tags), tagArray);
      }

      test.deepEqual(resolve(ctagger2.tags), undefined);
      test.done();
    },
    'setTag with propagate false tags do not propagate'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagger1 = new ChildTagger(ctagger, 'two');
      const ctagger2 = new ChildTagger(root, 'three');

      // not taggable at all
      new Child(ctagger, 'notag');

      const tag = {key: 'Name', value: 'TheCakeIsALie'};
      ctagger.tags.setTag(tag.key, tag.value, {propagate: false});

      for (const construct of [ctagger1, ctagger2]) {
        test.deepEqual(resolve(construct.tags), undefined);
      }
      test.deepEqual(resolve(ctagger.tags)[0].key, 'Name');
      test.deepEqual(resolve(ctagger.tags)[0].value, 'TheCakeIsALie');
      test.done();
    },
    'setTag with overwrite false does not overwrite a tag'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      ctagger.tags.setTag('Env', 'Dev');
      ctagger.tags.setTag('Env', 'Prod', {overwrite: false});
      const result = resolve(ctagger.tags);
      test.deepEqual(result, [{key: 'Env', value: 'Dev'}]);
      test.done();
    },
    'setTag with sticky false enables propagations to overwrite child tags'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagger1 = new ChildTagger(ctagger, 'two');
      ctagger.tags.setTag('Parent', 'Is always right');
      ctagger1.tags.setTag('Parent', 'Is wrong', {sticky: false});
      const parent = resolve(ctagger.tags);
      const child = resolve(ctagger1.tags);
      test.deepEqual(parent, child);
      test.done();

    },
    'tags propagate from all parents'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      new ChildTagger(ctagger, 'two');
      const cNoTag = new Child(ctagger, 'three');
      const ctagger2 = new ChildTagger(cNoTag, 'four');
      const tag = {key: 'Name', value: 'TheCakeIsALie'};
      ctagger.tags.setTag(tag.key, tag.value, {propagate: true});
      test.deepEqual(resolve(ctagger2.tags), [tag]);
      test.done();
    },
    'a tag can be removed and added back'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const tag = {key: 'Name', value: 'TheCakeIsALie'};
      ctagger.tags.setTag(tag.key, tag.value, {propagate: true});
      test.deepEqual(resolve(ctagger.tags), [tag]);
      ctagger.tags.removeTag(tag.key);
      test.deepEqual(resolve(ctagger.tags), undefined);
      ctagger.tags.setTag(tag.key, tag.value, {propagate: true});
      test.deepEqual(resolve(ctagger.tags), [tag]);
      test.done();
    },
    'removeTag removes a tag by key'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagger1 = new ChildTagger(ctagger, 'two');
      const ctagger2 = new ChildTagger(root, 'three');

      // not taggable at all
      new Child(ctagger, 'notag');

      const tag = {key: 'Name', value: 'TheCakeIsALie'};
      ctagger.tags.setTag(tag.key, tag.value);
      ctagger.tags.removeTag('Name');

      for (const construct of [ctagger, ctagger1, ctagger2]) {
        test.deepEqual(resolve(construct.tags), undefined);
      }
      test.done();
    },
    'removeTag with blockPropagate removes any propagated tags'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagger1 = new ChildTagger(ctagger, 'two');
      ctagger.tags.setTag('Env', 'Dev');
      ctagger1.tags.removeTag('Env', {blockPropagate: true});
      const result = resolve(ctagger.tags);
      test.deepEqual(result, [{key: 'Env', value: 'Dev'}]);
      test.deepEqual(resolve(ctagger1.tags), undefined);
      test.done();
    },
    'children can override parent propagated tags'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagChild = new ChildTagger(ctagger, 'one');
      const tag = {key: 'BestBeach', value: 'StoneSteps'};
      const tag2 = {key: 'BestBeach', value: 'k-38'};
      ctagger.tags.setTag(tag2.key, tag2.value);
      ctagger.tags.setTag(tag.key, tag.value);
      ctagChild.tags.setTag(tag2.key, tag2.value);
      const parentTags = resolve(ctagger.tags);
      const childTags = resolve(ctagChild.tags);
      test.deepEqual(parentTags, [tag]);
      test.deepEqual(childTags, [tag2]);
      test.done();
    },
    'resolve() returns all tags'(test: Test) {
      const root = new Root();
      const ctagger = new ChildTagger(root, 'one');
      const ctagChild = new ChildTagger(ctagger, 'one');
      const tagsNoProp = [
        {key: 'NorthCountySpot', value: 'Tabletops'},
        {key: 'Crowded', value: 'Trestles'},
      ];
      const tagsProp = [
        {key: 'BestBeach', value: 'StoneSteps'},
        {key: 'BestWaves', value: 'Blacks'},
      ];
      for (const tag of tagsNoProp) {
        ctagger.tags.setTag(tag.key, tag.value, {propagate: false});
      }
      for (const tag of tagsProp) {
        ctagger.tags.setTag(tag.key, tag.value);
      }
      const allTags = tagsNoProp.concat(tagsProp);
      const cAll = ctagger.tags;
      const cProp = ctagChild.tags;

      for (const tag of resolve(cAll)) {
        const expectedTag = allTags.filter( (t) => (t.key === tag.key));
        test.deepEqual(expectedTag[0].value, tag.value);
      }
      for (const tag of resolve(cProp)) {
        const expectedTag = tagsProp.filter( (t) => (t.key === tag.key));
        test.deepEqual(expectedTag[0].value, tag.value);
      }
      test.done();
    },
  },
};
