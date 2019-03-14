import { App, Construct, Resource, Stack } from '@aws-cdk/cdk';
import { Mirror } from '../lib';

test('hey', () => {
  const app = new App();

  const stack = new Stack(app, 'myapp');
  const group1 = new Construct(stack, 'group1');
  const group2 = new Construct(stack, 'group2');

  const resource1 = new Resource(group1, 'group1-resource1', { type: 'my-resource-type' });
  new Resource(group1, 'group1-resource2', { type: 'my-resource-type-2' });

  new MyResource(group2, 'group2-resource3', {
    resource: resource1
  });

  new Mirror(app, 'mirror');

  const session = app.run();
  const output = session.store.readJson(Mirror.FileName);

  expect(output).toMatchSnapshot();
});

interface MyResourceProps {
  resource: Resource
}

class MyResource extends Resource {
  constructor(scope: Construct, id: string, props: MyResourceProps) {
    super(scope, id, {
      type: 'resource-type',
      properties: {
        SomeRef: props.resource.ref,
        SomeAttribute: props.resource.getAtt('Boom').toString()
      }
    });
  }
}
