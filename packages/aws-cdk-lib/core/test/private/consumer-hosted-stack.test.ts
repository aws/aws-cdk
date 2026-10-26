import type { Construct } from 'constructs';
import { Annotations as AssertionAnnotations } from '../../../assertions';
import { Annotations, App, CfnResource, NestedStack, Stack } from '../../lib';
import { addTemplateConsumer, markConsumerHostedStack } from '../../lib/private/consumer-hosted-stack';

/**
 * A stack whose template the stacks of its consumers host
 */
class HostedStack extends Stack {
  public readonly prepareCalls = new Array<string>();

  constructor(scope: Construct, id: string, private readonly onPrepare: () => string) {
    super(scope, id);
    markConsumerHostedStack(this);
  }

  public _prepareTemplateAsset(): void {
    this.prepareCalls.push(this.onPrepare());
  }
}

describe('consumer-hosted stacks', () => {
  test('are prepared once per synthesis, before the nested stack that consumes them is', () => {
    const app = new App();
    const top = new Stack(app, 'Top');
    const nested = new NestedStack(top, 'Nested');
    const consumer = new CfnResource(nested, 'Consumer', { type: 'My::Consumer' });
    const nestedPrepare = jest.spyOn(nested, '_prepareTemplateAsset');
    const hosted = new HostedStack(app, 'Hosted', () => `nested prepared ${nestedPrepare.mock.calls.length} times`);
    addTemplateConsumer(hosted, consumer);

    app.synth();

    expect(hosted.prepareCalls).toEqual(['nested prepared 0 times']);
    expect(nestedPrepare).toHaveBeenCalledTimes(1);
  });

  test('cannot reference resources of another stack', () => {
    const app = new App();
    const other = new Stack(app, 'Other');
    const hosted = new HostedStack(app, 'Hosted', () => 'prepared');
    const producer = new CfnResource(other, 'Producer', { type: 'My::Producer' });
    new CfnResource(hosted, 'Consumer', { type: 'My::Consumer', properties: { Value: producer.ref } });

    expect(() => app.synth()).toThrow(expect.objectContaining({ name: 'StackSetStackCrossStackReference' }));
  });

  test('cannot be referenced by the nested stacks of another stack', () => {
    const app = new App();
    const hosted = new HostedStack(app, 'Hosted', () => 'prepared');
    const producer = new CfnResource(hosted, 'Producer', { type: 'My::Producer' });
    const nested = new NestedStack(new Stack(app, 'Other'), 'Nested');
    new CfnResource(nested, 'Consumer', { type: 'My::Consumer', properties: { Value: producer.ref } });

    expect(() => app.synth()).toThrow(expect.objectContaining({ name: 'StackSetStackCrossStackReference' }));
  });

  test('have their annotations reported by the stacks that host them only', () => {
    const app = new App();
    const parent = new Stack(app, 'Parent');
    const host = new Stack(app, 'Host');
    const hosted = new HostedStack(parent, 'Hosted', () => 'prepared');
    Annotations.of(new CfnResource(hosted, 'Resource', { type: 'My::Resource' })).addError('an error inside');
    addTemplateConsumer(hosted, new CfnResource(host, 'Consumer', { type: 'My::Consumer' }));

    AssertionAnnotations.fromStack(host).hasError('/Parent/Hosted/Resource', 'an error inside');
    AssertionAnnotations.fromStack(parent).hasNoError('*', 'an error inside');
  });
});
