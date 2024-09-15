import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * This test creates a stack and sets its termination protection via stage.
 */

const app = new cdk.App();
const stage = new cdk.Stage(app, 'Stage', { terminationProtection: true });
const stack = new cdk.Stack(stage, 'Stack');

new IntegTest(app, 'stack', { testCases: [stack] });
