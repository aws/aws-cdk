import * as fs from 'fs';
import * as path from 'path';
import { randomString, withDefaultFixture } from '../helpers/cdk';
import { integTest } from '../helpers/test-helpers';

jest.setTimeout(600_000);

integTest('can bootstrap without execution', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--no-execute']);

  const resp = await fixture.aws.cloudFormation('describeStacks', {
    StackName: bootstrapStackName,
  });

  expect(resp.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
}));

integTest('upgrade legacy bootstrap stack to new bootstrap stack while in use', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
  const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;
  fixture.rememberToDeleteBucket(legacyBootstrapBucketName); // This one will leak
  fixture.rememberToDeleteBucket(newBootstrapBucketName); // This one shouldn't leak if the test succeeds, but let's be safe in case it doesn't

  // Legacy bootstrap
  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--bootstrap-bucket-name', legacyBootstrapBucketName]);

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: ['--toolkit-stack-name', bootstrapStackName],
  });

  // Upgrade bootstrap stack to "new" style
  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--bootstrap-bucket-name', newBootstrapBucketName,
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
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
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--qualifier', fixture.qualifier], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
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
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
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
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
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
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', bootstrapStackName,
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
  });

  // Deploy stack that uses file assets
  await fixture.cdkDeploy('lambda', {
    options: [
      '--toolkit-stack-name', bootstrapStackName,
    ],
  });
}));

integTest('deploying new style synthesis to old style bootstrap fails', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap', '--toolkit-stack-name', bootstrapStackName]);

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
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack-1');

  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName, '--public-access-block-configuration', 'false', '--tags', 'Foo=Bar']);

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));

integTest('can create multiple legacy bootstrap stacks', withDefaultFixture(async (fixture) => {
  const bootstrapStackName1 = fixture.fullStackName('bootstrap-stack-1');
  const bootstrapStackName2 = fixture.fullStackName('bootstrap-stack-2');

  // deploy two toolkit stacks into the same environment (see #1416)
  // one with tags
  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName1, '--tags', 'Foo=Bar']);
  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName2]);

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));

integTest('can dump the template, modify and use it to deploy a custom bootstrap stack', withDefaultFixture(async (fixture) => {
  let template = await fixture.cdk(['bootstrap', '--show-template'], {
    captureStderr: false,
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
  });

  expect(template).toContain('BootstrapVersion:');

  template += '\n' + [
    '  TwiddleDee:',
    '    Value: Template got twiddled',
  ].join('\n');

  const filename = path.join(fixture.integTestDir, `${fixture.qualifier}-template.yaml`);
  fs.writeFileSync(filename, template, { encoding: 'utf-8' });
  await fixture.cdk(['bootstrap',
    '--toolkit-stack-name', fixture.fullStackName('bootstrap-stack'),
    '--qualifier', fixture.qualifier,
    '--template', filename,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: {
      CDK_NEW_BOOTSTRAP: '1',
    },
  });
}));

integTest('switch on termination protection, switch is left alone on re-bootstrap', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName,
    '--termination-protection', 'true',
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: { CDK_NEW_BOOTSTRAP: '1' },
  });
  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName, '--force'], { modEnv: { CDK_NEW_BOOTSTRAP: '1' } });

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
  expect(response.Stacks?.[0].EnableTerminationProtection).toEqual(true);
}));

integTest('add tags, left alone on re-bootstrap', withDefaultFixture(async (fixture) => {
  const bootstrapStackName = fixture.fullStackName('bootstrap-stack');

  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName,
    '--tags', 'Foo=Bar',
    '--qualifier', fixture.qualifier,
    '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess'], {
    modEnv: { CDK_NEW_BOOTSTRAP: '1' },
  });
  await fixture.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName, '--force'], { modEnv: { CDK_NEW_BOOTSTRAP: '1' } });

  const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
  expect(response.Stacks?.[0].Tags).toEqual([
    { Key: 'Foo', Value: 'Bar' },
  ]);
}));
