import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Rule, Match } from '../lib';

const app = new App();

const stack = new Stack(app, 'RuleStack');


new Rule(stack, 'MyRule', {
  eventPattern: {
    account: ['account1', 'account2'],
    detail: {
      foo: [1, 2],
      strings: ['foo', 'bar'],
      rangeMatcher: Match.interval(-1, 1),
      stringMatcher: Match.exactString('I am just a string'),
      prefixMatcher: Match.prefix('aws.'),
      ipAddress: Match.ipAddressRange('192.0.2.0/24'),
      shouldExist: Match.exists(),
      shouldNotExist: Match.doesNotExist(),
      numbers: Match.allOf(Match.greaterThan(0), Match.lessThan(5)),
      topLevel: {
        deeper: Match.equal(42),
        oneMoreLevel: {
          deepest: Match.anyOf(Match.lessThanOrEqual(-1), Match.greaterThanOrEqual(1)),
        },
      },
      state: Match.anythingBut('initializing'),
      limit: Match.anythingBut(100, 200, 300),
      notPrefixedBy: Match.anythingButPrefix('sensitive-'),
      suffix: Match.suffix('.com'),
      equalsIgnoreCase: Match.equalsIgnoreCase('ignore case'),
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
