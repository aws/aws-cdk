import { Test } from 'nodeunit';
import sns = require('../lib');

export = {
  'create a filter policy'(test: Test) {
    // GIVEN
    const policy = new sns.SubscriptionFilterPolicy();

    // WHEN
    policy
      .addStringFilter('color')
      .whitelist('red', 'green')
      .blacklist('white', 'orange')
      .matchPrefixes('bl', 'ye');
    policy
      .addNumericFilter('price')
      .whitelist(100, 200)
      .between(300, 350)
      .greaterThan(500)
      .lessThan(1000)
      .betweenStrict(2000, 3000)
      .greaterThanOrEqualTo(1000)
      .lessThanOrEqualTo(-2);

    // THEN
    test.deepEqual(policy.render(), {
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
        { numeric: ['>=', 300, '<=', 350] },
        { numeric: ['>', 500] },
        { numeric: ['<', 1000] },
        { numeric: ['>', 2000, '<', 3000] },
        { numeric: ['>=', 1000] },
        { numeric: ['<=', -2] },
      ]
    });
    test.done();
  },

  'throws with more than 5 attributes'(test: Test) {
    // GIVEN
    const policy = new sns.SubscriptionFilterPolicy();

    // WHEN
    [...Array(6).keys()].forEach((k) => policy.addStringFilter(`${k}`));

    // THEN
    test.throws(() => policy.render(), /5 attribute names/);
    test.done();
  },

  'throws with more than 100 conditions'(test: Test) {
    // GIVEN
    const policy = new sns.SubscriptionFilterPolicy();

    // WHEN
    const first = policy.addNumericFilter('first');
    const second = policy.addNumericFilter('second');
    const third = policy.addNumericFilter('third');
    first.whitelist(...Array.from(Array(2).keys()));
    second.whitelist(...Array.from(Array(10).keys()));
    third.whitelist(...Array.from(Array(6).keys()));

    // THEN
    test.throws(() => policy.render(), /\(120\) must not exceed 100/);
    test.done();
  }
};
