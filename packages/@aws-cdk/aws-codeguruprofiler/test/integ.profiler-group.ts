import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { ProfilingGroup } from '../lib';

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
});
