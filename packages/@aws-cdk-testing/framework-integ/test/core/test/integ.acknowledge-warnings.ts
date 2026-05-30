import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test: Validations.acknowledge() supports warnings added via Annotations.addWarningV2()
 *
 * This test verifies that warnings added via Annotations.addWarningV2() can be
 * acknowledged using Validations.acknowledge(), ensuring the acknowledgment
 * metadata is correctly propagated through both the Annotations and Validations systems.
 *
 * See: https://github.com/aws/aws-cdk/pull/37765
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'AcknowledgeWarningsStack');

const construct = new cdk.Construct(stack, 'MyConstruct');

// Add a warning via Annotations.addWarningV2()
cdk.Annotations.of(construct).addWarningV2('my-lib:TestWarning', 'This is a test warning');

// Acknowledge the warning via Validations.acknowledge()
cdk.Validations.of(construct).acknowledge({ id: 'my-lib:TestWarning', reason: 'Accepted risk for testing' });

// Add an unacknowledged warning for contrast
cdk.Annotations.of(construct).addWarningV2('my-lib:UnackedWarning', 'This warning is not acknowledged');

new IntegTest(app, 'acknowledge-warnings', { testCases: [stack] });
