import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Rule, Matchers } from '../lib';

const app = new App();

const stack = new Stack(app, 'RuleStack');


new Rule(stack, 'MyRule', {
  eventPattern: {
    account: ['account1', 'account2'],
    detail: {
      foo: [1, 2],
      strings: ['foo', 'bar'],
      rangeMatcher: Matchers.interval(-1, 1),
      stringMatcher: Matchers.exactString('I am just a string'),
      prefixMatcher: Matchers.prefix('aws.'),
      ipAddress: Matchers.ipAddressRange('192.0.2.0/24'),
      shouldExist: Matchers.exists(),
      shouldNotExist: Matchers.doesNotExist(),
      numbers: Matchers.numeric(Matchers.greaterThan(0), Matchers.lessThan(5)),
      topLevel: {
        deeper: Matchers.equal(42),
        oneMoreLevel: {
          deepest: Matchers.anyOf(Matchers.lessThanOrEqual(-1), Matchers.greaterThanOrEqual(1)),
        },
      },
      state: Matchers.anythingBut('initializing'),
      limit: Matchers.anythingBut(100, 200, 300),
      notPrefixedBy: Matchers.anythingButPrefix('sensitive-'),
    },
    detailType: ['detailType1'],
    id: ['id1', 'id2'],
    region: ['region1', 'region2', 'region3'],
    resources: ['r1'],
    source: ['src1', 'src2'],
    time: ['t1'],
    version: ['0'],
  },
});

new IntegTest(app, 'IntegTest-BatchDefaultEnvVarsStack', {
  testCases: [stack],
});

app.synth();
