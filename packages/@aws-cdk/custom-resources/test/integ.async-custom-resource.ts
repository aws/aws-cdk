import { App, Construct, Stack } from '@aws-cdk/core';
import { AsyncCustomResource } from '../lib/async-custom-resource';

const app = new App();

class CustomResourceConsumer extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AsyncCustomResource(this, 'MyCustomResource', {
      uuid: 'unique-id-of-custom-resource',
      properties: {
        Prop1: 1234,
        Prop2: 'hello'
      },
      resourceType: 'Custom::Boom',
    });

    new AsyncCustomResource(this, 'YourCustomResource', {
      resourceType: 'Custom::Boom',
      uuid: 'unique-id-of-custom-resource',
      properties: {
        Prop1: 9999,
        Prop2: 'bar'
      },
    });
  }
}

new CustomResourceConsumer(app, 'async-custom-resource-integ-5');

app.synth();