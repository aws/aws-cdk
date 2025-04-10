import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Rule, Match } from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();

const stack = new Stack(app, 'RuleStack');

const role = new iam.Role(stack, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

new Rule(stack, 'MyRule', {
  role,
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

new Rule(stack, 'MyWildcardRule', {
  eventPattern: {
    account: Match.wildcard('account*'),
  },
});

new Rule(stack, 'MyAnythingButPrefixRule', {
  eventPattern: {
    account: Match.anythingButPrefix('prefix-'),
  },
});

new Rule(stack, 'MyAnythingButSuffixRule', {
  eventPattern: {
    account: Match.anythingButSuffix('-suffix'),
  },
});

new Rule(stack, 'MyAnythingButWildcardRule', {
  eventPattern: {
    account: Match.anythingButWildcard('account*'),
  },
});

new Rule(stack, 'MyAnythingButEqualsIgnoreCase', {
  eventPattern: {
    account: Match.anythingButEqualsIgnoreCase('account1', 'account2'),
  },
});

new Rule(stack, 'MyPrefixEqualsIgnoreCase', {
  eventPattern: {
    account: Match.prefixEqualsIgnoreCase('prefix-'),
  },
});

new Rule(stack, 'MySuffixEqualsIgnoreCase', {
  eventPattern: {
    account: Match.suffixEqualsIgnoreCase('-suffix'),
  },
});

new IntegTest(app, 'IntegTest-BatchDefaultEnvVarsStack', {
  testCases: [stack],
});
