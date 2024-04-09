import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * This test creates a stack and changes termination protection with the setter.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { terminationProtection: false });
stack.terminationProtection = true;

stack.exportValue('someValue', {
  name: 'MyExportValue',
  description: 'This is a description for MyExportValue',
});
stack.exportStringListValue(['someValue', 'anotherValue'], {
  name: 'MyExportStringListValue',
  description: 'This is a description for MyExportStringListValue',
});

new IntegTest(app, 'stack', { testCases: [stack] });
