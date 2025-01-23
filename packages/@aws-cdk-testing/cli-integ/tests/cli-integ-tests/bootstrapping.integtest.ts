/* eslint-disable @cdklabs/no-literal-partition */
import * as fs from 'fs';
import * as path from 'path';
import { DescribeStackResourcesCommand, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { DescribeRepositoriesCommand } from '@aws-sdk/client-ecr';
import { CreatePolicyCommand, DeletePolicyCommand, GetRoleCommand } from '@aws-sdk/client-iam';
import * as yaml from 'yaml';
import { integTest, randomString, withoutBootstrap } from '../../lib';
import eventually from '../../lib/eventually';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

integTest('can bootstrap without execution', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapLegacy({
    toolkitStackName: bootstrapStackName,
    noExecute: true,
  });

  const resp = await fixture.aws.cloudFormation.send(
    new DescribeStacksCommand({
      StackName: bootstrapStackName,
    }),
  );

  expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
}));

integTest('upgrade legacy bootstrap stack to new bootstrap stack while in use', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
  const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;
  fixture.rememberToDeleteBucket(legacyBootstrapBucketName); // This one will leak
  fixture.rememberToDeleteBucket(newBootstrapBucketName); // This one shouldn't leak if the test succeeds, but let's be safe in case it doesn't

  // Legacy bootstrap
  await fixture.cdkBootstrapLegacy({
    toolkitStackName: bootstrapStackName,
    bootstrapBucketName: legacyBootstrapBucketName,
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--context', `bootstrapBucket=${legacyBootstrapBucketName}`,
      '--context', 'legacySynth=true',
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--toolkit-stack-name', bootstrapStackName,
    ],
  });

  // Upgrade bootstrap stack to "new" style
  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    bootstrapBucketName: newBootstrapBucketName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // (Force) deploy stack again
  // --force to bypass the check which says that the template hasn't changed.
  await fixture.cdkDeploy('lambda', {
    options: [
      '--context', `bootstrapBucket=${newBootstrapBucketName}`,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--toolkit-stack-name', bootstrapStackName,
      '--force',
    ],
  });
}));

integTest('can and deploy if omitting execution policies', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
}));

integTest('can deploy with session tags on the deploy, lookup, file asset, and image asset publishing roles', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    bootstrapTemplate: path.join(__dirname, '..', '..', 'resources', 'bootstrap-templates', 'session-tags.all-roles-deny-all.yaml'),
  });

  await fixture.cdkDeploy('session-tags', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
    modEnv: {
      ENABLE_VPC_TESTING: 'IMPORT',
    },
  });
}));

integTest('can deploy without execution role and with session tags on deploy role', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    bootstrapTemplate: path.join(__dirname, '..', '..', 'resources', 'bootstrap-templates', 'session-tags.deploy-role-deny-sqs.yaml'),
  });

  await fixture.cdkDeploy('session-tags-with-custom-synthesizer', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
}));

integTest('deploy new style synthesis to new style bootstrap', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
}));

integTest('deploy new style synthesis to new style bootstrap (with docker image)', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('docker', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
}));

integTest('deploy old style synthesis to new style bootstrap', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--toolkit-stack-name', bootstrapStackName,
    ],
  });
}));

integTest('can create a legacy bootstrap stack with --public-access-block-configuration=false', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapLegacy({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    publicAccessBlockConfiguration: false,
    tags: 'Foo=Bar',
  });

  const response = await fixture.aws.cloudFormation.send(new DescribeStacksCommand({ StackName: bootstrapStackName }));
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));

integTest('can create multiple legacy bootstrap stacks', withoutBootstrap(async (fixture) => {
  const bootstrapStackName1 = `${fixture.bootstrapStackName}-1`;
  const bootstrapStackName2 = `${fixture.bootstrapStackName}-2`;

  // deploy two toolkit stacks into the same environment (see #1416)
  // one with tags
  await fixture.cdkBootstrapLegacy({
    verbose: true,
    toolkitStackName: bootstrapStackName1,
    tags: 'Foo=Bar',
  });
  await fixture.cdkBootstrapLegacy({
    verbose: true,
    toolkitStackName: bootstrapStackName2,
  });

  const response = await fixture.aws.cloudFormation.send(new DescribeStacksCommand({ StackName: bootstrapStackName1 }));
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));

integTest('can dump the template, modify and use it to deploy a custom bootstrap stack', withoutBootstrap(async (fixture) => {
  let template = await fixture.cdkBootstrapModern({
    // toolkitStackName doesn't matter for this particular invocation
    toolkitStackName: fixture.bootstrapStackName,
    showTemplate: true,
    cliOptions: {
      captureStderr: false,
    },
  });

  expect(template).toContain('BootstrapVersion:');

  template += '\n' + [
    '  TwiddleDee:',
    '    Value: Template got twiddled',
  ].join('\n');

  const filename = path.join(fixture.integTestDir, `${fixture.qualifier}-template.yaml`);
  fs.writeFileSync(filename, template, { encoding: 'utf-8' });
  await fixture.cdkBootstrapModern({
    toolkitStackName: fixture.bootstrapStackName,
    template: filename,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });
}));

integTest('a customized template vendor will not overwrite the default template', withoutBootstrap(async (fixture) => {
  // Initial bootstrap
  const toolkitStackName = fixture.bootstrapStackName;
  await fixture.cdkBootstrapModern({
    toolkitStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Customize template
  const templateStr = await fixture.cdkBootstrapModern({
    // toolkitStackName doesn't matter for this particular invocation
    toolkitStackName,
    showTemplate: true,
    cliOptions: {
      captureStderr: false,
    },
  });

  const template = yaml.parse(templateStr, { schema: 'core' });
  template.Parameters.BootstrapVariant.Default = 'CustomizedVendor';
  const filename = path.join(fixture.integTestDir, `${fixture.qualifier}-template.yaml`);
  fs.writeFileSync(filename, yaml.stringify(template, { schema: 'yaml-1.1' }), { encoding: 'utf-8' });

  // Rebootstrap. For some reason, this doesn't cause a failure, it's a successful no-op.
  const output = await fixture.cdkBootstrapModern({
    toolkitStackName,
    template: filename,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
    cliOptions: {
      captureStderr: true,
    },
  });
  expect(output).toContain('Not overwriting it with a template containing');
}));

integTest('can use the default permissions boundary to bootstrap', withoutBootstrap(async (fixture) => {
  let template = await fixture.cdkBootstrapModern({
    // toolkitStackName doesn't matter for this particular invocation
    toolkitStackName: fixture.bootstrapStackName,
    showTemplate: true,
    examplePermissionsBoundary: true,
  });

  expect(template).toContain('PermissionsBoundary');
}));

integTest('can use the custom permissions boundary to bootstrap', withoutBootstrap(async (fixture) => {
  let template = await fixture.cdkBootstrapModern({
    // toolkitStackName doesn't matter for this particular invocation
    toolkitStackName: fixture.bootstrapStackName,
    showTemplate: true,
    customPermissionsBoundary: 'permission-boundary-name',
  });

  expect(template).toContain('permission-boundary-name');
}));

integTest('can use the custom permissions boundary (with slashes) to bootstrap', withoutBootstrap(async (fixture) => {
  let template = await fixture.cdkBootstrapModern({
    // toolkitStackName doesn't matter for this particular invocation
    toolkitStackName: fixture.bootstrapStackName,
    showTemplate: true,
    customPermissionsBoundary: 'permission-boundary-name/with/path',
  });

  expect(template).toContain('permission-boundary-name/with/path');
}));

integTest('can remove customPermissionsBoundary', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;
  const policyName = `${bootstrapStackName}-pb`;
  let policyArn;
  try {
    const policy = await fixture.aws.iam.send(
      new CreatePolicyCommand({
        PolicyName: policyName,
        PolicyDocument: JSON.stringify({
          Version: '2012-10-17',
          Statement: {
            Action: ['*'],
            Resource: ['*'],
            Effect: 'Allow',
          },
        }),
      }),
    );
    policyArn = policy.Policy?.Arn;

    // Policy creation and consistency across regions is "almost immediate"
    // See: https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_general.html#troubleshoot_general_eventual-consistency
    // We will put this in an `eventually` block to retry stack creation with a reasonable timeout
    const createStackWithPermissionBoundary = async (): Promise<void> => {
      await fixture.cdkBootstrapModern({
        // toolkitStackName doesn't matter for this particular invocation
        toolkitStackName: bootstrapStackName,
        customPermissionsBoundary: policyName,
      });

      const response = await fixture.aws.cloudFormation.send(
        new DescribeStacksCommand({ StackName: bootstrapStackName }),
      );
      expect(
        response.Stacks?.[0].Parameters?.some(
          param => (param.ParameterKey === 'InputPermissionsBoundary' && param.ParameterValue === policyName),
        )).toEqual(true);
    };

    await eventually(createStackWithPermissionBoundary, { maxAttempts: 3 });

    await fixture.cdkBootstrapModern({
      // toolkitStackName doesn't matter for this particular invocation
      toolkitStackName: bootstrapStackName,
      usePreviousParameters: false,
    });
    const response2 = await fixture.aws.cloudFormation.send(
      new DescribeStacksCommand({ StackName: bootstrapStackName }),
    );
    expect(
      response2.Stacks?.[0].Parameters?.some(
        param => (param.ParameterKey === 'InputPermissionsBoundary' && !param.ParameterValue),
      )).toEqual(true);

    const region = fixture.aws.region;
    const account = await fixture.aws.account();
    const role = await fixture.aws.iam.send(
      new GetRoleCommand({ RoleName: `cdk-${fixture.qualifier}-cfn-exec-role-${account}-${region}` }),
    );
    if (!role.Role) {
      throw new Error('Role not found');
    }
    expect(role.Role.PermissionsBoundary).toBeUndefined();

  } finally {
    if (policyArn) {
      await fixture.aws.iam.send(new DeletePolicyCommand({ PolicyArn: policyArn }));
    }
  }
}));

integTest('switch on termination protection, switch is left alone on re-bootstrap', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    terminationProtection: true,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });
  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    force: true,
  });

  const response = await fixture.aws.cloudFormation.send(new DescribeStacksCommand({ StackName: bootstrapStackName }));
  expect(response.Stacks?.[0].EnableTerminationProtection).toEqual(true);
}));

integTest('add tags, left alone on re-bootstrap', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    tags: 'Foo=Bar',
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });
  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    force: true,
  });

  const response = await fixture.aws.cloudFormation.send(new DescribeStacksCommand({ StackName: bootstrapStackName }));
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));

integTest('can add tags then update tags during re-bootstrap', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    tags: 'Foo=Bar',
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });
  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    tags: 'Foo=BarBaz',
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
    force: true,
  });

  const response = await fixture.aws.cloudFormation.send(new DescribeStacksCommand({ StackName: bootstrapStackName }));
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'BarBaz' },
  ]);
}));

integTest('can deploy modern-synthesized stack even if bootstrap stack name is unknown', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      // Explicity pass a name that's sure to not exist, otherwise the CLI might accidentally find a
      // default bootstracp stack if that happens to be in the account already.
      '--toolkit-stack-name', 'DefinitelyDoesNotExist',
      '--context', `@aws-cdk/core:bootstrapQualifier=${fixture.qualifier}`,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  });
}));

integTest('create ECR with tag IMMUTABILITY to set on', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
  });

  const response = await fixture.aws.cloudFormation.send(
    new DescribeStackResourcesCommand({
      StackName: bootstrapStackName,
    }),
  );
  const ecrResource = response.StackResources?.find(resource => resource.LogicalResourceId === 'ContainerAssetsRepository');
  expect(ecrResource).toBeDefined();

  const ecrResponse = await fixture.aws.ecr.send(
    new DescribeRepositoriesCommand({
      repositoryNames: [
        // This is set, as otherwise we don't end up here
        ecrResource?.PhysicalResourceId ?? '',
      ],
    }),
  );

  expect(ecrResponse.repositories?.[0].imageTagMutability).toEqual('IMMUTABLE');
}));

integTest('can remove trusted account', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    verbose: false,
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
    trust: ['599757620138', '730170552321'],
  });

  await fixture.cdkBootstrapModern({
    verbose: true,
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: ' arn:aws:iam::aws:policy/AdministratorAccess',
    untrust: ['730170552321'],
  });

  const response = await fixture.aws.cloudFormation.send(
    new DescribeStacksCommand({ StackName: bootstrapStackName }),
  );

  const trustedAccounts = response.Stacks?.[0].Parameters?.find(p => p.ParameterKey === 'TrustedAccounts')?.ParameterValue;
  expect(trustedAccounts).toEqual('599757620138');
}));

