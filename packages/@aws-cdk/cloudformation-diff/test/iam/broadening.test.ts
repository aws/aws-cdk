import { diffTemplate, formatSecurityChanges } from '../../lib';
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
          Principal: { Service: 'sns.amazonaws.com' },
        }),
      }),
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(true);
  });

  test('permissions diff can be printed', () => {
    // GIVEN
    const diff = diffTemplate({}, template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc({
          Effect: 'Allow',
          Action: 'sqs:SendMessage',
          Resource: '*',
          Principal: { Service: 'sns.amazonaws.com' },
        }),
      }),
    }));

    // WHEN
    // Behave like process.stderr, but have a 'columns' property to trigger the column width calculation
    const stdErrMostly = Object.create(process.stderr, {
      columns: { value: 80 },
    });
    formatSecurityChanges(stdErrMostly, diff);

    // THEN: does not throw
    expect(true).toBeTruthy();
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
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' },
          },
          {
            Effect: 'Allow',
            Action: 'sqs:LookAtMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
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
          NotPrincipal: { Service: 'sns.amazonaws.com' },
        }),
      }),
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
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyOtherQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
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
            },
          ],
        }),
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
            },
          ],
        }),
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
            Principal: { Service: 'sns.amazonaws.com' },
          },
          {
            Effect: 'Allow',
            Action: 'sqs:LookAtMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
    }), template({
      QueuePolicy: resource('AWS::SQS::QueuePolicy', {
        Queues: [{ Ref: 'MyQueue' }],
        PolicyDocument: poldoc(
          {
            Effect: 'Allow',
            Action: 'sqs:SendMessage',
            Resource: '*',
            Principal: { Service: 'sns.amazonaws.com' },
          },
        ),
      }),
    }));

    // THEN
    expect(diff.permissionsBroadened).toBe(false);
  });
});
