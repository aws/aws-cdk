const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const sqs = require('aws-cdk-lib/aws-sqs');
const cr = require('aws-cdk-lib/custom-resources');

/**
 * This stack will be deployed in multiple phases, to achieve a very specific effect
 *
 * It contains resources r1 and r2, and a queue q, where r1 gets deployed first.
 *
 * - PHASE = 1: both resources deploy regularly.
 * - PHASE = 2a: r1 gets updated, r2 will fail to update
 * - PHASE = 2b: r1 gets updated, r2 will fail to update, and r1 will fail its rollback.
 * - PHASE = 3: q gets replaced w.r.t. phases 1 and 2
 *
 * To exercise this app:
 *
 * ```
 * env PHASE=1 npx cdk deploy
 * env PHASE=2b npx cdk deploy --no-rollback
 * # This will leave the stack in UPDATE_FAILED
 *
 * env PHASE=2b npx cdk rollback
 * # This will start a rollback that will fail because r1 fails its rollabck
 *
 * env PHASE=2b npx cdk rollback --force
 * # This will retry the rollback and skip r1
 * ```
 */
class RollbacktestStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    let r1props = {};
    let r2props = {};
    let fifo = false;

    const phase = process.env.PHASE;
    switch (phase) {
      case '1':
        // Normal deployment
        break;
      case '2a':
        // r1 updates normally, r2 fails updating
        r2props.FailUpdate = true;
        break;
      case '2b':
        // r1 updates normally, r2 fails updating, r1 fails rollback
        r1props.FailRollback = true;
        r2props.FailUpdate = true;
        break;
      case '3':
        fifo = true;
        break;
    }

    const fn = new lambda.Function(this, 'Fun', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      code: lambda.Code.fromInline(`exports.handler = async function(event, ctx) {
        const key = \`Fail\${event.RequestType}\`;
        if (event.ResourceProperties[key]) {
          throw new Error(\`\${event.RequestType} fails!\`);
        }
        if (event.OldResourceProperties?.FailRollback) {
          throw new Error('Failing rollback!');
        }
        return {};
      }`),
      handler: 'index.handler',
      timeout: cdk.Duration.minutes(1),
    });
    const provider = new cr.Provider(this, "MyProvider", {
      onEventHandler: fn,
    });

    const r1 = new cdk.CustomResource(this, 'r1', {
      serviceToken: provider.serviceToken,
      properties: r1props,
    });
    const r2 = new cdk.CustomResource(this, 'r2', {
      serviceToken: provider.serviceToken,
      properties: r2props,
    });
    r2.node.addDependency(r1);

    new sqs.Queue(this, 'Queue', {
      fifo,
    });
  }
}

const app = new cdk.App({
  context: {
    '@aws-cdk/core:assetHashSalt': process.env.CODEBUILD_BUILD_ID ?? process.env.GITHUB_RUN_ID, // Force all assets to be unique, but consistent in one build
  },
});

const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const stackPrefix = process.env.STACK_NAME_PREFIX;
if (!stackPrefix) {
  throw new Error(`the STACK_NAME_PREFIX environment variable is required`);
}

// Sometimes we don't want to synthesize all stacks because it will impact the results
new RollbacktestStack(app, `${stackPrefix}-test-rollback`, { env: defaultEnv });
app.synth();