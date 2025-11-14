import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as imagebuilder from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-imagebuilder-component-all-parameters');

const key = new kms.Key(stack, 'Component-EncryptionKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  pendingWindow: cdk.Duration.days(7),
});

new imagebuilder.Component(stack, 'InlineComponent', {
  componentName: 'aws-cdk-imagebuilder-component-all-parameters-inline-component',
  componentVersion: '1.0.0',
  description: 'This is a test component',
  changeDescription: 'This is a change description',
  platform: imagebuilder.Platform.LINUX,
  kmsKey: key,
  supportedOsVersions: [
    imagebuilder.OSVersion.AMAZON_LINUX,
    imagebuilder.OSVersion.custom(imagebuilder.Platform.LINUX, 'Custom OS'),
  ],
  data: imagebuilder.ComponentData.fromComponentDocumentJsonObject({
    name: 'test-component',
    schemaVersion: imagebuilder.ComponentSchemaVersion.V1_0,
    phases: [
      {
        name: imagebuilder.ComponentPhaseName.BUILD,
        steps: [
          {
            name: 'hello-world-build',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            onFailure: imagebuilder.ComponentOnFailure.CONTINUE,
            timeout: cdk.Duration.seconds(720),
            inputs: {
              commands: ['echo "Hello build!"'],
            },
          },
        ],
      },
      {
        name: imagebuilder.ComponentPhaseName.VALIDATE,
        steps: [
          {
            name: 'hello-world-validate',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['echo "Hello validate!"'],
            },
          },
        ],
      },
      {
        name: imagebuilder.ComponentPhaseName.TEST,
        steps: [
          {
            name: 'hello-world-test',
            action: imagebuilder.ComponentAction.EXECUTE_BASH,
            inputs: {
              commands: ['echo "Hello test!"'],
            },
          },
        ],
      },
    ],
  }),
});

new integ.IntegTest(app, 'ComponentTest', {
  testCases: [stack],
});
