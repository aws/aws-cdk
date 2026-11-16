import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-component-default-parameters');

new imagebuilder.Component(stack, 'Component', {
  platform: imagebuilder.Platform.LINUX,
  data: imagebuilder.ComponentData.fromJsonObject({
    name: 'test-component',
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'hello-world-build',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['echo "Hello build!"'],
            },
          },
        ],
      },
    ],
  }),
});

new integ.IntegTest(app, 'ComponentTest-DefaultParameters', {
  testCases: [stack],
});
