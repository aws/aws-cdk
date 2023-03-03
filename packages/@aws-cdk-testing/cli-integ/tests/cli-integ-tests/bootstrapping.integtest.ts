import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { integTest, randomString, withoutBootstrap } from '../../lib';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

integTest('can bootstrap without execution', withoutBootstrap(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapLegacy({
    toolkitStackName: bootstrapStackName,
    noExecute: true,
  });

  const resp = await fixture.aws.cloudFormation('describeStacks', {
    StackName: bootstrapStackName,
  });

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

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
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

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
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

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
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

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
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

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
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

  const response = await fixture.aws.cloudFormation('describeStackResources', {
    StackName: bootstrapStackName,
  });
  const ecrResource = response.StackResources?.find(resource => resource.LogicalResourceId === 'ContainerAssetsRepository');
  expect(ecrResource).toBeDefined();

  const ecrResponse = await fixture.aws.ecr('describeRepositories', {
    repositoryNames: [
      // This is set, as otherwise we don't end up here
      ecrResource?.PhysicalResourceId ?? '',
    ],
  });

  expect(ecrResponse.repositories?.[0].imageTagMutability).toEqual('IMMUTABLE');
}));

