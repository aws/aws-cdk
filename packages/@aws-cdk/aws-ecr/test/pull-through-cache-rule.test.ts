import { Template } from '@aws-cdk/assertions';
import { AccountRootPrincipal } from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import { PullThroughCacheRule } from '../lib';

describe('pull-through-cache-rule', function () {
  it('should generate the correct resource', function () {
    const stack = new Stack();
    new PullThroughCacheRule(stack, 'PullThroughCacheRule', {
      upstreamRegistryUrl: 'public.ecr.aws',
      ecrRepositoryPrefix: 'my-ecr',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECR::PullThroughCacheRule', {
      EcrRepositoryPrefix: 'my-ecr',
      UpstreamRegistryUrl: 'public.ecr.aws',
    });
  });

  it('should generate a registry policy', function () {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '1337',
        region: 'eu-west-1',
      },
    });
    new PullThroughCacheRule(stack, 'PullThroughCacheRule', {
      upstreamRegistryUrl: 'public.ecr.aws',
      ecrRepositoryPrefix: 'my-ecr',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECR::RegistryPolicy', {
      PolicyText: {
        Statement: [
          {
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::1337:root',
                  ],
                ],
              },
            },
            Action: [
              'ecr:CreateRepository',
              'ecr:BatchImportUpstreamImage',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ecr:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':repository/my-ecr/*',
                ],
              ],
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  it('should be able to restrict access to certain repositories', function () {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '1337',
        region: 'eu-west-1',
      },
    });
    const rule = new PullThroughCacheRule(stack, 'PullThroughCacheRule', {
      upstreamRegistryUrl: 'public.ecr.aws',
      ecrRepositoryPrefix: 'my-ecr',
    });
    rule.restrictAccess([new AccountRootPrincipal()], ['docker/library/nginx', 'amazonlinux/amazonlinux']);

    Template.fromStack(stack).hasResourceProperties('AWS::ECR::RegistryPolicy', {
      PolicyText: {
        Statement: [
          {
            Principal: {
              AWS: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':iam::1337:root',
                  ],
                ],
              },
            },
            Action: [
              'ecr:CreateRepository',
              'ecr:BatchImportUpstreamImage',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ecr:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':repository/my-ecr/docker/library/nginx',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ecr:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':repository/my-ecr/amazonlinux/amazonlinux',
                  ],
                ],
              },
            ],
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});