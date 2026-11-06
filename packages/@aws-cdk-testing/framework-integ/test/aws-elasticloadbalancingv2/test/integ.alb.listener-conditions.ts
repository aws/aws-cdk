#!/usr/bin/env node
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

/**
 * Stack verification steps:
 * * `aws elbv2 describe-rules --listener-arn <listener-arn>`
 *   Should show all 9 listener rules with different condition types:
 *    1. host-header with values
 *    2. host-header with regexValues
 *    3. http-header with values
 *    4. http-header with regexValues
 *    5. http-request-method
 *    6. path-pattern with values
 *    7. path-pattern with regexValues
 *    8. query-string
 *    9. source-ip
 */
class TestStack extends cdk.Stack {
  public readonly hostHeaderRegexRule: elbv2.ApplicationListenerRule;
  public readonly httpHeaderRegexRule: elbv2.ApplicationListenerRule;
  public readonly pathPatternRegexRule: elbv2.ApplicationListenerRule;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: true,
      maxAzs: 2,
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: false,
    });

    lb.connections.allowFrom(ec2.Peer.ipv4('10.0.0.0/16'), ec2.Port.tcp(80), 'Allow from VPC');

    const listener = lb.addListener('Listener', {
      port: 80,
      open: false,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'No matching rule found',
      }),
    });

    listener.addAction('HostHeaderCondition', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['example.com', 'www.example.com']),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Host header matched',
      }),
    });

    // The regex rules are created directly, with the same IDs `addAction` would use,
    // so that the assertions below can look each of them up by ARN.
    this.hostHeaderRegexRule = new elbv2.ApplicationListenerRule(listener, 'HostHeaderRegexConditionRule', {
      listener,
      priority: 15,
      conditions: [
        elbv2.ListenerCondition.hostHeadersRegex(['.*\\.example\\.com']),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Host header regex matched',
      }),
    });

    listener.addAction('HttpHeaderCondition', {
      priority: 20,
      conditions: [
        elbv2.ListenerCondition.httpHeader('User-Agent', [
          'curl/*',
          'Mozilla/*',
        ]),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'HTTP header matched',
      }),
    });

    this.httpHeaderRegexRule = new elbv2.ApplicationListenerRule(listener, 'HttpHeaderRegexConditionRule', {
      listener,
      priority: 25,
      conditions: [
        elbv2.ListenerCondition.httpHeaderRegex('User-Agent', [
          '^Mozilla/.*Chrome.*$',
        ]),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'HTTP header regex matched',
      }),
    });

    listener.addAction('HttpRequestMethodCondition', {
      priority: 30,
      conditions: [elbv2.ListenerCondition.httpRequestMethods(['GET', 'POST'])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'HTTP method matched',
      }),
    });

    listener.addAction('PathPatternCondition', {
      priority: 40,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/api/*', '/v1/*'])],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Path pattern matched',
      }),
    });

    this.pathPatternRegexRule = new elbv2.ApplicationListenerRule(listener, 'PathPatternRegexConditionRule', {
      listener,
      priority: 50,
      conditions: [
        elbv2.ListenerCondition.pathPatternsRegex([
          '/images/.*\\.(jpg|png|gif)',
          '/docs/.*\\.pdf',
        ]),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Path pattern regex matched',
      }),
    });

    listener.addAction('QueryStringCondition', {
      priority: 60,
      conditions: [
        elbv2.ListenerCondition.queryStrings([
          { key: 'version', value: 'v1' },
          { key: 'debug', value: 'true' },
          { value: 'test' },
        ]),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Query string matched',
      }),
    });

    listener.addAction('SourceIpCondition', {
      priority: 70,
      conditions: [
        elbv2.ListenerCondition.sourceIps(['192.0.2.0/24', '198.51.100.0/24']),
      ],
      action: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Source IP matched',
      }),
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-elbv2-alb-listener-conditions-integ');

const test = new integ.IntegTest(app, 'ListenerConditionsTest', {
  testCases: [stack],
});

// Verify the regex conditions round-trip through the service, i.e. that they are
// stored as `RegexValues` rather than as plain `Values`. Each rule is described on
// its own, because describing the whole listener returns more than the 4 KB a
// custom resource response may hold.
function expectRuleCondition(rule: elbv2.ApplicationListenerRule, condition: Record<string, unknown>) {
  test.assertions.awsApiCall('elastic-load-balancing-v2', 'describeRules', {
    RuleArns: [rule.listenerRuleArn],
  }).expect(integ.ExpectedResult.objectLike({
    Rules: [integ.Match.objectLike({
      Conditions: [integ.Match.objectLike(condition)],
    })],
  }));
}

expectRuleCondition(stack.hostHeaderRegexRule, {
  Field: 'host-header',
  HostHeaderConfig: { RegexValues: ['.*\\.example\\.com'] },
});

expectRuleCondition(stack.httpHeaderRegexRule, {
  Field: 'http-header',
  HttpHeaderConfig: {
    HttpHeaderName: 'User-Agent',
    RegexValues: ['^Mozilla/.*Chrome.*$'],
  },
});

expectRuleCondition(stack.pathPatternRegexRule, {
  Field: 'path-pattern',
  PathPatternConfig: {
    RegexValues: ['/images/.*\\.(jpg|png|gif)', '/docs/.*\\.pdf'],
  },
});
