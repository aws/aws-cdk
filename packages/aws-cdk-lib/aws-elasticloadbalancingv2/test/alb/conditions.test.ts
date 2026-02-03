import * as cdk from '../../../core';
import { Template } from '../../../assertions';
import * as ec2 from '../../../aws-ec2';
import * as elbv2 from '../../lib';

describe('tests', () => {
  test('pathPatterns length greater than 5 will throw exception', () => {
    // GIVEN
    const array = ['/u1', '/u2', '/u3', '/u4', '/u5'];

    // WHEN
    elbv2.ListenerCondition.pathPatterns(array); // Does not throw
    array.push('/u6');

    // THEN
    expect(() => {
      elbv2.ListenerCondition.pathPatterns(array);
    }).toThrow(/A rule can only have '5' condition values/);
  });

  test('regexPathPatterns length greater than 5 will throw exception', () => {
    // GIVEN
    const array = ['^/u1$', '^/u2$', '^/u3$', '^/u4$', '^/u5$'];

    // WHEN
    elbv2.ListenerCondition.regexPathPatterns(array); // Does not throw
    array.push('^/u6$');

    // THEN
    expect(() => {
      elbv2.ListenerCondition.regexPathPatterns(array);
    }).toThrow(/A rule can only have '5' condition values/);
  });

  test('regexPathPatterns renders with regexValues in CloudFormation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addAction('Rule', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.regexPathPatterns(['^/api/?.*$']),
      ],
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [{
        Field: 'path-pattern',
        PathPatternConfig: {
          RegexValues: ['^/api/?.*$'],
        },
      }],
    });
  });

  test('regexPathPatterns works with multiple patterns', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addAction('Rule', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.regexPathPatterns([
          '^/api/?.*$',
          '^/v[0-9]+/.*$',
        ]),
      ],
      action: elbv2.ListenerAction.fixedResponse(200),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [{
        Field: 'path-pattern',
        PathPatternConfig: {
          RegexValues: [
            '^/api/?.*$',
            '^/v[0-9]+/.*$',
          ],
        },
      }],
    });
  });
});
