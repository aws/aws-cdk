import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import { EventBus } from '../lib';

describe('EventBus grants', () => {
  test('grantPutEventsTo creates EventBusPolicy for service principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const servicePrincipal = new iam.ServicePrincipal('states.amazonaws.com');

    // WHEN
    eventBus.grantPutEventsTo(servicePrincipal);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
      Action: 'events:PutEvents',
      Principal: 'states.amazonaws.com',
      StatementId: 'AllowPutEvents-EventBus',
      EventBusName: { Ref: 'EventBus7B8748AA' },
    });
  });

  test('grantPutEventsTo creates IAM policy for IAM principal', () => {
    // GIVEN
    const stack = new Stack();
    const eventBus = new EventBus(stack, 'EventBus');
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    eventBus.grantPutEventsTo(role);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: 'events:PutEvents',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': ['EventBus7B8748AA', 'Arn'],
          },
        }],
        Version: '2012-10-17',
      },
    });
  });
});
