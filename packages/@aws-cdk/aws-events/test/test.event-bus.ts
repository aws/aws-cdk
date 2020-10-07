import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, CfnResource, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { EventBus } from '../lib';

export = {
  'default event bus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new EventBus(stack, 'Bus');

    // THEN
    expect(stack).to(haveResource('AWS::Events::EventBus', {
      Name: 'Bus',
    }));

    test.done();
  },

  'named event bus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new EventBus(stack, 'Bus', {
      eventBusName: 'myEventBus',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::EventBus', {
      Name: 'myEventBus',
    }));

    test.done();
  },

  'partner event bus'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new EventBus(stack, 'Bus', {
      eventSourceName: 'aws.partner/PartnerName/acct1/repo1',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Events::EventBus', {
      Name: 'aws.partner/PartnerName/acct1/repo1',
      EventSourceName: 'aws.partner/PartnerName/acct1/repo1',
    }));

    test.done();
  },

  'can get bus name'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bus = new EventBus(stack, 'Bus', {
      eventBusName: 'myEventBus',
    });

    // WHEN
    new CfnResource(stack, 'Res', {
      type: 'Test::Resource',
      properties: {
        EventBusName: bus.eventBusName,
      },
    });

    // THEN
    expect(stack).to(haveResource('Test::Resource', {
      EventBusName: { Ref: 'BusEA82B648' },
    }));

    test.done();
  },

  'can get bus arn'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const bus = new EventBus(stack, 'Bus', {
      eventBusName: 'myEventBus',
    });

    // WHEN
    new CfnResource(stack, 'Res', {
      type: 'Test::Resource',
      properties: {
        EventBusArn: bus.eventBusArn,
      },
    });

    // THEN
    expect(stack).to(haveResource('Test::Resource', {
      EventBusArn: { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] },
    }));

    test.done();
  },

  'event bus name cannot be default'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventBusName: 'default',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventBusName' must not be 'default'/);

    test.done();
  },

  'event bus name cannot contain slash'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventBusName: 'my/bus',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventBusName' must not contain '\/'/);

    test.done();
  },

  'event bus cannot have name and source name'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventBusName: 'myBus',
      eventSourceName: 'myBus',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventBusName' and 'eventSourceName' cannot both be provided/);

    test.done();
  },

  'event bus name cannot be empty string'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventBusName: '',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventBusName' must satisfy: /);

    test.done();
  },

  'does not throw if eventBusName is a token'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN / THEN
    test.doesNotThrow(() => new EventBus(stack, 'EventBus', {
      eventBusName: Aws.STACK_NAME,
    }));

    test.done();
  },

  'event bus source name must follow pattern'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventSourceName: 'invalid-partner',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventSourceName' must satisfy: \/\^aws/);

    test.done();
  },

  'event bus source name cannot be empty string'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const createInvalidBus = () => new EventBus(stack, 'Bus', {
      eventSourceName: '',
    });

    // THEN
    test.throws(() => {
      createInvalidBus();
    }, /'eventSourceName' must satisfy: /);

    test.done();
  },

  'can grant PutEvents'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    EventBus.grantPutEvents(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'events:PutEvents',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      Roles: [
        {
          Ref: 'Role1ABCC5F0',
        },
      ],
    }));

    test.done();
  },
};
