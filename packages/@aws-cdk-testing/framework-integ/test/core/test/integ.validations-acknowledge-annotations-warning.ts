import * as cdk from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integ test: Validations.acknowledge() suppresses warnings added via Annotations.addWarningV2()
 *
 * Regression test for https://github.com/aws/aws-cdk/issues/37764.
 * Annotations.addWarningV2() stores warnings with a bare ID (no prefix), while
 * Validations.acknowledge() previously only acknowledged the qualified form
 * ("annotation::<id>"). This mismatch meant acknowledge() silently failed to
 * suppress warnings issued directly through the Annotations class.
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'core-validations-acknowledge-annotations-warning');

// Emit a warning using Annotations.addWarningV2 (stores bare ID, no "annotation::" prefix)
cdk.Annotations.of(stack).addWarningV2('@aws-cdk/core:testWarning', 'This warning should be suppressed by acknowledge()');

// Acknowledge using the bare ID — must suppress the warning even though acknowledge()
// internally qualifies the ID with the "annotation::" prefix.
cdk.Validations.of(stack).acknowledge({
  id: '@aws-cdk/core:testWarning',
  reason: 'Verified in integ test: bare-ID warnings from Annotations.addWarningV2 are suppressed correctly',
});

new cdk.CfnOutput(stack, 'AcknowledgmentResult', { value: 'warning-suppressed' });

new IntegTest(app, 'ValidationsAcknowledgeAnnotationsWarning', {
  testCases: [stack],
});
