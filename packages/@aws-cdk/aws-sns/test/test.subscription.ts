import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import sns = require('../lib');

export = {
  'create a subscription'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic
    });

    // THEN
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      Endpoint: 'endpoint',
      Protocol: 'lambda',
      TopicArn: {
        Ref: 'TopicBFC7AF6E'
      }
    }));
    test.done();
  },

  'with filter policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      filterPolicy: {
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
      },
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic
    });

    // THEN
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      FilterPolicy: {
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
      },
    }));
    test.done();
  },

  'with existsFilter'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // WHEN
    new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      filterPolicy: {
        size: sns.SubscriptionFilter.existsFilter(),
      },
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic
    });

    // THEN
    expect(stack).to(haveResource('AWS::SNS::Subscription', {
      FilterPolicy: {
        size: [{ exists: true }]
      },
    }));
    test.done();
  },

  'throws with raw delivery for protocol other than http, https or sqs'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // THEN
    test.throws(() => new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic,
      rawMessageDelivery: true
    }), /Raw message delivery/);
    test.done();
  },

  'throws with more than 5 attributes in a filter policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');
    const cond = { conditions: [] };

    // THEN
    test.throws(() => new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic,
      filterPolicy: {
        a: cond,
        b: cond,
        c: cond,
        d: cond,
        e: cond,
        f: cond,
      },
    }), /5 attribute names/);
    test.done();
  },

  'throws with more than 100 conditions in a filter policy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const topic = new sns.Topic(stack, 'Topic');

    // THEN
    test.throws(() => new sns.Subscription(stack, 'Subscription', {
      endpoint: 'endpoint',
      protocol: sns.SubscriptionProtocol.LAMBDA,
      topic,
      filterPolicy: {
        a: { conditions: [...Array.from(Array(2).keys())] },
        b: { conditions: [...Array.from(Array(10).keys())] },
        c: { conditions: [...Array.from(Array(6).keys())] },
      },
    }), /\(120\) must not exceed 100/);
    test.done();
  }
};
