import { Test } from 'nodeunit';
import { deepClone, deepGet, deepMerge, deepSet } from '../../lib/util';

export = {
  'deepSet can set deeply'(test: Test) {
    const obj = {};
    deepSet(obj, ['a', 'b'], 3);
    test.deepEqual(obj, {a: {b: 3}});
    test.done();
  },
  'deepGet can get deeply'(test: Test) {
    const obj = {a: {b: 3}};
    test.equal(deepGet(obj, ['a', 'b']), 3);
    test.done();
  },
  'deepGet can return an array'(test: Test) {
    const obj = {a: [1, 2, 3]};
    test.deepEqual(deepGet(obj, ['a']), [1, 2, 3]);
    test.done();
  },
  'changing deepClones copy leaves the original intact'(test: Test) {
    const original = {a: [{b: 3}]};
    const copy = deepClone(original);
    copy.a[0].c = 5;

    test.deepEqual(original, {a: [{b: 3}]});
    test.done();
  },
  'deepMerge merges objects'(test: Test) {
    const original = {a: {b: 3}};
    deepMerge(original, {a: {c: 4}});

    test.deepEqual(original, {a: {b: 3, c: 4}});
    test.done();
  },
  'deepMerge overwrites non-objects'(test: Test) {
    const original = {a: []};
    deepMerge(original, {a: {b: 3}});

    test.deepEqual(original, {a: {b: 3}});
    test.done();
  },
  'deepMerge does not overwrite if rightmost is "undefined"'(test: Test) {
    const original = {a: 1};
    deepMerge(original, {a: undefined});

    test.deepEqual(original, {a: 1});
    test.done();
  }
};
