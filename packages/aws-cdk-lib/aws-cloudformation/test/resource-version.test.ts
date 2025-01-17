import { join } from 'path';
import { Template } from '../../assertions';
import { Role, ServicePrincipal } from '../../aws-iam';
import { Asset } from '../../aws-s3-assets';
import { App, Stack } from '../../core';
import { ResourceVersion } from '../lib';

test('it creates the resource-version and its related resources', () => {
  const app = new App();
  const stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
  const id = 'unittest';
  const asset = new Asset(stack, 'SampleAsset', {
    path: join(__dirname, 'asset-directory-fixture'),
  });
  const executionRole = new Role(stack, 'role', {
    assumedBy: new ServicePrincipal('unittest.amazonaws.com'),
  });
  const typeName = 'UNIT::TEST::TEST';
  const rv = new ResourceVersion(stack, id, {
    typeName,
    handler: asset,
    executionRole,
  });

  // it should create the l1 resource
  Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::ResourceVersion', {
    TypeName: typeName,
    SchemaHandlerPackage: asset.s3ObjectUrl,
    LoggingConfig: {
      LogGroupName: {
        Ref: 'unittestLogGroup321F9C37',
      },
      LogRoleArn: {
        'Fn::GetAtt': ['unittestLogRoleEC6FE6AD', 'Arn'],
      },
    },
    ExecutionRoleArn: {
      'Fn::GetAtt': ['roleC7B7E775', 'Arn'],
    },
  });

  // it should create the log group (if not provided)
  Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
    LogGroupName: `/aws/cloudformation/${typeName.split('::').join('-')}`,
  });

  // it should create the log delivery role (if not provided)
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'hooks.cloudformation.amazonaws.com',
          },
        },
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'resources.cloudformation.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});
