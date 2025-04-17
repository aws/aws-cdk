import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Lazy, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { TestSource } from './test-classes';
import { EventBridgeTarget } from '../lib/event-bridge';

describe('EventBridge', () => {
  it('should have only target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const target = new EventBridgeTarget(bus);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MyEventBus251E60F8',
          'Arn',
        ],
      },
      TargetParameters: {},
    });
  });

  it('should have target parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    const target = new EventBridgeTarget(bus, {
      detailType: 'detail-type',
      endpointId: 'abcde.veo',
      resources: ['resource-1', 'resource-2'],
      source: 'source',
      time: 'time',
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        EventBridgeEventBusParameters: {
          DetailType: 'detail-type',
          EndpointId: 'abcde.veo',
          Resources: [
            'resource-1',
            'resource-2',
          ],
          Source: 'source',
          Time: 'time',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });

    const target = new EventBridgeTarget(bus, {
      inputTransformation,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        InputTemplate: '{"key":"value"}',
      },
    });
  });

  it('should grant pipe role push access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const target = new EventBridgeTarget(bus);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    expect(template.findResources('AWS::IAM::Policy')).toMatchSnapshot();
  });
});

describe('EventBridge target parameters validation', () => {
  test('Detail type must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        detailType: '',
      });
    }).toThrow('Detail type must be between 1 and 128 characters, received 0');
  });

  test('Detail type must be <= 128 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        detailType: 'x'.repeat(129),
      });
    }).toThrow('Detail type must be between 1 and 128 characters, received 129');
  });

  test('Endpoint id must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        endpointId: '',
      });
    }).toThrow('Endpoint id must be between 1 and 50 characters, received 0');
  });

  test('Endpoint id must be <= 50 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        endpointId: 'x'.repeat(51),
      });
    }).toThrow('Endpoint id must be between 1 and 50 characters, received 51');
  });

  test('Source must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        source: '',
      });
    }).toThrow('Source must be between 1 and 256 characters, received 0');
  });

  test('Source must be <= 256 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        source: 'x'.repeat(257),
      });
    }).toThrow('Source must be between 1 and 256 characters, received 257');
  });

  test('Time must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        time: '',
      });
    }).toThrow('Time must be between 1 and 256 characters, received 0');
  });

  test('Time must be <= 256 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});

    // WHEN
    expect(() => {
      new EventBridgeTarget(bus, {
        time: 'x'.repeat(257),
      });
    }).toThrow('Time must be between 1 and 256 characters, received 257');
  });

  test('Detail type can be given for a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const detailType = Lazy.string({ produce: () => '20' });

    const target = new EventBridgeTarget(bus, {
      detailType,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // WHEN
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        EventBridgeEventBusParameters: {
          DetailType: '20',
        },
      },
    });
  });

  test('Endpoint can be given for a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const endpointId = Lazy.string({ produce: () => 'abcde.veo' });

    const target = new EventBridgeTarget(bus, {
      endpointId,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // WHEN
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        EventBridgeEventBusParameters: {
          EndpointId: 'abcde.veo',
        },
      },
    });
  });

  test('Source can be given for a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const source = Lazy.string({ produce: () => 'mySource' });

    const target = new EventBridgeTarget(bus, {
      source,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // WHEN
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        EventBridgeEventBusParameters: {
          Source: 'mySource',
        },
      },
    });
  });

  test('Time can be given for a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const bus = new EventBus(stack, 'MyEventBus', {});
    const time = Lazy.string({ produce: () => '1234' });

    const target = new EventBridgeTarget(bus, {
      time,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // WHEN
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        EventBridgeEventBusParameters: {
          Time: '1234',
        },
      },
    });
  });
});
