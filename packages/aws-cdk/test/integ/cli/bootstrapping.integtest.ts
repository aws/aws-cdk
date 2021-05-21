import * as fs from 'fs';
import * as path from 'path';
import { randomString, withDefaultFixture } from '../helpers/cdk';
import { integTest } from '../helpers/test-helpers';

const timeout = process.env.CODEBUILD_BUILD_ID ? // if the process is running in CodeBuild
  3_600_000 : // 1 hour
  600_000; // 10 minutes
jest.setTimeout(timeout);
process.stdout.write(`bootstrapping.integtest.ts: Setting jest time out to ${timeout} ms`);

integTest('can bootstrap without execution', withDefaultFixture(async (fixture) => {
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

integTest('upgrade legacy bootstrap stack to new bootstrap stack while in use', withDefaultFixture(async (fixture) => {
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
    options: ['--toolkit-stack-name', bootstrapStackName],
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
      '--toolkit-stack-name', bootstrapStackName,
      '--force',
    ],
  });
}));

integTest('can and deploy if omitting execution policies', withDefaultFixture(async (fixture) => {
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

integTest('deploy new style synthesis to new style bootstrap', withDefaultFixture(async (fixture) => {
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

integTest('deploy new style synthesis to new style bootstrap (with docker image)', withDefaultFixture(async (fixture) => {
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

integTest('deploy old style synthesis to new style bootstrap', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapModern({
    toolkitStackName: bootstrapStackName,
    cfnExecutionPolicy: 'arn:aws:iam::aws:policy/AdministratorAccess',
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
    ],
  });
}));

integTest('deploying new style synthesis to old style bootstrap fails', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.bootstrapStackName;

  await fixture.cdkBootstrapLegacy({
    toolkitStackName: bootstrapStackName,
  });

  // Deploy stack that uses file assets, this fails because the bootstrap stack
  // is version checked.
  await expect(fixture.cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
      '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
    ],
  })).rejects.toThrow('exited with error');
}));

integTest('can create a legacy bootstrap stack with --public-access-block-configuration=false', withDefaultFixture(async (fixture) => {
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

integTest('can create multiple legacy bootstrap stacks', withDefaultFixture(async (fixture) => {
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

integTest('can dump the template, modify and use it to deploy a custom bootstrap stack', withDefaultFixture(async (fixture) => {
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

integTest('switch on termination protection, switch is left alone on re-bootstrap', withDefaultFixture(async (fixture) => {
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

integTest('add tags, left alone on re-bootstrap', withDefaultFixture(async (fixture) => {
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

integTest('can deploy modern-synthesized stack even if bootstrap stack name is unknown', withDefaultFixture(async (fixture) => {
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
