import * as path from 'path';
import * as fs from 'fs-extra';
import { integTest, withTemporaryDirectory, ShellHelper, withPackages } from '../../lib';

['app', 'sample-app'].forEach(template => {
  integTest(`init javascript ${template}`, withTemporaryDirectory(withPackages(async (context) => {
    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['cdk', 'init', '-l', 'javascript', template]);
    await shell.shell(['npm', 'prune']);
    await shell.shell(['npm', 'ls']); // this will fail if we have unmet peer dependencies
    await shell.shell(['npm', 'run', 'test']);

    await shell.shell(['cdk', 'synth']);
  })));
});

integTest('Test importing CDK from ESM', withTemporaryDirectory(withPackages(async (context) => {
  // Use 'cdk init -l=javascript' to get set up, but use a different file
  const shell = ShellHelper.fromContext(context);
  await context.packages.makeCliAvailable();

  await shell.shell(['cdk', 'init', '-l', 'javascript', 'app']);

  // Rewrite some files
  await fs.writeFile(path.join(context.integTestDir, 'new-entrypoint.mjs'), `
// Test multiple styles of imports
import { Stack, aws_sns as sns } from 'aws-cdk-lib';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';

class TestjsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'TestjsQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'TestjsTopic');

    topic.addSubscription(new SqsSubscription(queue));
  }
}

const app = new cdk.App();
new TestjsStack(app, 'TestjsStack');
`, { encoding: 'utf-8' });

  // Rewrite 'cdk.json' to use new entrypoint
  const cdkJson = await fs.readJson(path.join(context.integTestDir, 'cdk.json'));
  cdkJson.app = 'node new-entrypoint.mjs';
  await fs.writeJson(path.join(context.integTestDir, 'cdk.json'), cdkJson);

  await shell.shell(['cdk', 'synth']);

})));
