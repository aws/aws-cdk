import { Template } from 'aws-cdk-lib/assertions';
import { Stack } from 'aws-cdk-lib';
import { FirewallManagedDomainList, ManagedDomain } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('importing managed domain list creates custom resource', () => {
  // WHEN
  new FirewallManagedDomainList(stack, 'List', {
    managedDomainList: ManagedDomain.MALWARE_DOMAIN_LIST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::Route53ResolverManagedDomainList', {
    DomainListName: 'AWSManagedDomainsMalwareDomainList',
  });
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    ManagedPolicyArns: [
      {
        'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      },
    ],
    Policies: [
      {
        PolicyName: 'Inline',
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['route53resolver:ListFirewallDomainLists'],
              Resource: ['*'],
            },
          ],
        },
      },
    ],
  });
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {});
});

