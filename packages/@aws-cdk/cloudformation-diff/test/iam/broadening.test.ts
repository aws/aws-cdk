import { diffTemplate } from '../../lib';
import { poldoc, resource, template } from '../util';

describe('broadening is', () => {
  test('adding of positive statements', () => {
    // WHEN
    const diff = diffTemplate({}, template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: '*',
          Principal: { Service: 'sns.amazonaws.com' }
        })
      })
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('adding of positive statements to an existing policy', () => {
    // WHEN
    const diff = diffTemplate(template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          },
          {
            Effect: 'Allow',
            Action: 'sqs:LookAtMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('removal of not-statements', () => {
    // WHEN
    const diff = diffTemplate(template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: '*',
          NotPrincipal: { Service: 'sns.amazonaws.com' }
        })
      })
    }), {});

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('changing of resource target', () => {
    // WHEN
    const diff = diffTemplate(template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyOtherQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('addition of ingress rules', () => {
    // WHEN
    const diff = diffTemplate(
      template({
      }),
      template({
        SG: resource('AWS::EC2::SecurityGroup', {
          SecurityGroupIngress: [
            {
              CidrIp: '1.2.3.4/8',
              FromPort: 80,
              ToPort: 80,
              IpProtocol: 'tcp',
            }
          ],
        })
      }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('addition of egress rules', () => {
    // WHEN
    const diff = diffTemplate(
      template({
      }),
      template({
        SG: resource('AWS::EC2::SecurityGroup', {
          SecurityGroupEgress: [
            {
              DestinationSecurityGroupId: { 'Fn::GetAtt': ['ThatOtherGroup', 'GroupId'] },
              FromPort: 80,
              ToPort: 80,
              IpProtocol: 'tcp',
            }
          ],
        })
      }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });
});

describe('broadening is not', () => {
  test('removal of positive statements from an existing policy', () => {
    // WHEN
    const diff = diffTemplate(template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          },
          {
            Effect: 'Allow',
            Action: 'sqs:LookAtMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' }
          }
        )
      })
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(false);
  });
});
