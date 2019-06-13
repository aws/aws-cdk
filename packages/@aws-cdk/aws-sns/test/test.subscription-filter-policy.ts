import { Test } from 'nodeunit';
import sns = require('../lib');

export = {
  'create a filter policy'(test: Test) {
    // GIVEN
    const policy = new sns.SubscriptionFilterPolicy({
      color: sns.SubscriptionFilter.stringFilter({
        whitelist: ['red', 'green'],
        blacklist: ['white', 'orange'],
        matchPrefixes: ['bl', 'ye'],
      }),
      price: sns.SubscriptionFilter.numericFilter({
        whitelist: [100, 200],
        between: { start: 300, stop: 350 },
        greaterThan: 500,
        lessThan: 1000,
        betweenStrict: { start: 2000, stop: 3000 },
        greaterThanOrEqualTo: 1000,
        lessThanOrEqualTo: -2,
      })
    });

    // THEN
    test.deepEqual(policy.policy, {
      color: [
        'red',
        'green',
        {'anything-but': ['white', 'orange']},
        { prefix: 'bl'},
        { prefix: 'ye'}
      ],
      price: [
        { numeric: ['=', 100] },
        { numeric: ['=', 200] },
        { numeric: ['>', 500] },
        { numeric: ['>=', 1000] },
        { numeric: ['<', 1000] },
        { numeric: ['<=', -2] },
        { numeric: ['>=', 300, '<=', 350] },
        { numeric: ['>', 2000, '<', 3000] },
      ]
    });
    test.done();
  },

  'throws with more than 5 attributes'(test: Test) {
    // GIVEN
    const cond = { conditions: [] };
    const attributesMap = {
      a: cond,
      b: cond,
      c: cond,
      d: cond,
      e: cond,
      f: cond,
    };

    // THEN
    test.throws(() => new sns.SubscriptionFilterPolicy(attributesMap), /5 attribute names/);
    test.done();
  },

  'throws with more than 100 conditions'(test: Test) {
    // GIVEN
    const attributesMap = {
      a: { conditions: [...Array.from(Array(2).keys())] },
      b: { conditions: [...Array.from(Array(10).keys())] },
      c: { conditions: [...Array.from(Array(6).keys())] },
    };

    // THEN
    test.throws(() => new sns.SubscriptionFilterPolicy(attributesMap), /\(120\) must not exceed 100/);
    test.done();
  }
};
