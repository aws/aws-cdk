import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * This test creates a stack and changes termination protection with the setter.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'Stack', { terminationProtection: false });
stack.terminationProtection = true;

new IntegTest(app, 'stack', { testCases: [stack] });
