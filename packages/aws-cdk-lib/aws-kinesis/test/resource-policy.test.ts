import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import { ResourcePolicy, Stream } from '../lib';

describe('Kinesis resource policy', () => {
  test('create resource policy', () => {
    // GIVEN
    const stack = new Stack();
    const stream = new Stream(stack, 'Stream', {});

    // WHEN
    const policyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [
        new iam.PolicyStatement({
          actions: ['kinesis:GetRecords'],
          principals: [new iam.AnyPrincipal()],
          resources: [stream.streamArn],
        }),
      ],
    });

    new ResourcePolicy(stack, 'ResourcePolicy', {
      stream,
      policyDocument,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::ResourcePolicy', {
      ResourcePolicy: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: '0',
            Action: 'kinesis:GetRecords',
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Resource: stack.resolve(stream.streamArn),
          },
        ],
      },
    });
  });
});
