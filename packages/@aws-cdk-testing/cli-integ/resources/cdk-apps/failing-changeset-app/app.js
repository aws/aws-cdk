const cdk = require('aws-cdk-lib');
const sns = require('aws-cdk-lib/aws-sns');
/**
 * This stack will be deployed in multiple phases, to achieve a very specific effect
 *
 * - Deploy Phase: a stack is deployed with an output set to a static string
 * - Diff Phase: a reference to a non-existing macro is used for the output value
 *
 * To exercise this app:
 *
 * ```
 * npx cdk deploy
 * env DIFF_PHASE=on npx cdk diff --no-fallback
 * # This will surface an error to the user about the missing macro
 * ```
 */
class FailingChangesetStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Have at least one resource so that we can deploy this
    new sns.Topic(this, 'topic', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const outputValue = process.env.DIFF_PHASE ? cdk.Fn.transform('NonExisting', { Param: 'Value' }) : 'static-string'
   
    new cdk.CfnOutput(this, 'MyOutput', {
      value: outputValue
    })
  }
}
const stackPrefix = process.env.STACK_NAME_PREFIX;
const app = new cdk.App();

new FailingChangesetStack(app, `${stackPrefix}-test-failing-changeset`);

app.synth();
