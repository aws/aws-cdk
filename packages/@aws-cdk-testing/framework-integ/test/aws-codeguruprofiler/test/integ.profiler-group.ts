import { AccountRootPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ProfilingGroup } from 'aws-cdk-lib/aws-codeguruprofiler';

class ProfilerGroupIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const profilingGroup = new ProfilingGroup(this, 'MyProfilingGroup');

    const publishAppRole = new Role(this, 'PublishAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    profilingGroup.grantPublish(publishAppRole);

    const readAppRole = new Role(this, 'ReadAppRole', {
      assumedBy: new AccountRootPrincipal(),
    });
    profilingGroup.grantRead(readAppRole);
  }
}

const app = new App();

new IntegTest(app, 'cdk-code-guru-profiler-group', {
  testCases: [new ProfilerGroupIntegrationTest(app, 'ProfilerGroupIntegrationTest')],
  regions: ['ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'eu-north-1', 'eu-west-1', 'eu-west-2', 'us-east-1', 'us-east-2', 'us-west-2'],
});
