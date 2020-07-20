import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { cloudFormation, iam, lambda, retry, sleep, sns, sts, testEnv } from './aws-helpers';
import { cdk, cdkDeploy, cdkDestroy, cleanup, cloneDirectory, fullStackName,
  INTEG_TEST_DIR, log, prepareAppFixture, shell, STACK_NAME_PREFIX } from './cdk-helpers';
import { integTest } from './test-helpers';

jest.setTimeout(600 * 1000);

beforeAll(async () => {
  await prepareAppFixture();
});

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

integTest('VPC Lookup', async () => {
  log('Making sure we are clean before starting.');
  await cdkDestroy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' }});

  log('Setting up: creating a VPC with known tags');
  await cdkDeploy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' }});
  log('Setup complete!');

  log('Verifying we can now import that VPC');
  await cdkDeploy('import-vpc', { modEnv: { ENABLE_VPC_TESTING: 'IMPORT' }});
});

integTest('Two ways of shoing the version', async () => {
  const version1 = await cdk(['version']);
  const version2 = await cdk(['--version']);

  expect(version1).toEqual(version2);
});

integTest('Termination protection', async () => {
  const stackName = 'termination-protection';
  await cdkDeploy(stackName);

  // Try a destroy that should fail
  await expect(cdkDestroy(stackName)).rejects.toThrow('exited with error');

  // Can update termination protection even though the change set doesn't contain changes
  await cdkDeploy(stackName, { modEnv: { TERMINATION_PROTECTION: 'FALSE' } });
  await cdkDestroy(stackName);
});

integTest('cdk synth', async () => {
  await expect(cdk(['synth', fullStackName('test-1')])).resolves.toEqual(
    `Resources:
  topic69831491:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-1/topic/Resource`);

  await expect(cdk(['synth', fullStackName('test-2')])).resolves.toEqual(
    `Resources:
  topic152D84A37:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-2/topic1/Resource
  topic2A4FB547F:
    Type: AWS::SNS::Topic
    Metadata:
      aws:cdk:path: ${STACK_NAME_PREFIX}-test-2/topic2/Resource`);
});

integTest('ssm parameter provider error', async () => {
  await expect(cdk(['synth',
    fullStackName('missing-ssm-parameter'),
    '-c', 'test:ssm-parameter-name=/does/not/exist',
  ], {
    allowErrExit: true,
  })).resolves.toContain('SSM parameter not available in account');
});

integTest('automatic ordering', async () => {
  // Deploy the consuming stack which will include the producing stack
  await cdkDeploy('order-consuming');

  // Destroy the providing stack which will include the consuming stack
  await cdkDestroy('order-providing');
});

integTest('context setting', async () => {
  await fs.writeFile(path.join(INTEG_TEST_DIR, 'cdk.context.json'), JSON.stringify({
    contextkey: 'this is the context value',
  }));
  try {
    await expect(cdk(['context'])).resolves.toContain('this is the context value');

    // Test that deleting the contextkey works
    await cdk(['context', '--reset', 'contextkey']);
    await expect(cdk(['context'])).resolves.not.toContain('this is the context value');

    // Test that forced delete of the context key does not throw
    await cdk(['context', '-f', '--reset', 'contextkey']);

  } finally {
    await fs.unlink(path.join(INTEG_TEST_DIR, 'cdk.context.json'));
  }
});

integTest('deploy', async () => {
  const stackArn = await cdkDeploy('test-2', { captureStderr: false });

  // verify the number of resources in the stack
  const response = await cloudFormation('describeStackResources', {
    StackName: stackArn,
  });
  expect(response.StackResources?.length).toEqual(2);
});

integTest('deploy all', async () => {
  const arns = await cdkDeploy('test-*', { captureStderr: false });

  // verify that we only deployed a single stack (there's a single ARN in the output)
  expect(arns.split('\n').length).toEqual(2);
});

integTest('nested stack with parameters', async () => {
// STACK_NAME_PREFIX is used in MyTopicParam to allow multiple instances
// of this test to run in parallel, othewise they will attempt to create the same SNS topic.
  const stackArn = await cdkDeploy('with-nested-stack-using-parameters', {
    options: ['--parameters', 'MyTopicParam=${STACK_NAME_PREFIX}ThereIsNoSpoon'],
    captureStderr: false,
  });

  // verify that we only deployed a single stack (there's a single ARN in the output)
  expect(stackArn.split('\n').length).toEqual(1);

  // verify the number of resources in the stack
  const response = await cloudFormation('describeStackResources', {
    StackName: stackArn,
  });
  expect(response.StackResources?.length).toEqual(1);
});

integTest('deploy without execute', async () => {
  const stackArn = await cdkDeploy('test-2', {
    options: ['--no-execute'],
    captureStderr: false,
  });
  // verify that we only deployed a single stack (there's a single ARN in the output)
  expect(stackArn.split('\n').length).toEqual(1);

  const response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
});

integTest('security related changes without a CLI are expected to fail', async () => {
  // redirect /dev/null to stdin, which means there will not be tty attached
  // since this stack includes security-related changes, the deployment should
  // immediately fail because we can't confirm the changes
  const stackName = 'iam-test';
  await expect(cdkDeploy(stackName, {
    options: ['<', '/dev/null'], // H4x, this only works because I happen to know we pass shell: true.
    neverRequireApproval: false,
  })).rejects.toThrow('exited with error');

  // Ensure stack was not deployed
  await expect(cloudFormation('describeStacks', {
    StackName: fullStackName(stackName),
  })).rejects.toThrow('does not exist');
});

integTest('deploy wildcard with outputs', async () => {
  const outputsFile = path.join(INTEG_TEST_DIR, 'outputs', 'outputs.json');
  await fs.mkdir(path.dirname(outputsFile), { recursive: true });

  await cdkDeploy(['outputs-test-*'], {
    options: ['--outputs-file', outputsFile],
  });

  const outputs = JSON.parse((await fs.readFile(outputsFile, { encoding: 'utf-8' })).toString());
  expect(outputs).toEqual({
    [`${STACK_NAME_PREFIX}-outputs-test-1`]: {
      TopicName: `${STACK_NAME_PREFIX}-outputs-test-1MyTopic`,
    },
    [`${STACK_NAME_PREFIX}-outputs-test-2`]: {
      TopicName: `${STACK_NAME_PREFIX}-outputs-test-2MyOtherTopic`,
    },
  });
});

integTest('deploy with parameters', async () => {
  const stackArn = await cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}bazinga`,
    ],
    captureStderr: false,
  });

  const response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].Parameters).toEqual([
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${STACK_NAME_PREFIX}bazinga`,
    },
  ]);
});

integTest('update to stack in ROLLBACK_COMPLETE state will delete stack and create a new one', async () => {
  // GIVEN
  await expect(cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}@aww`,
    ],
    captureStderr: false,
  })).rejects.toThrow('exited with error');

  const response = await cloudFormation('describeStacks', {
    StackName: fullStackName('param-test-1'),
  });

  const stackArn = response.Stacks?.[0].StackId;
  expect(response.Stacks?.[0].StackStatus).toEqual('ROLLBACK_COMPLETE');

  // WHEN
  const newStackArn = await cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}allgood`,
    ],
    captureStderr: false,
  });

  const newStackResponse = await cloudFormation('describeStacks', {
    StackName: newStackArn,
  });

  // THEN
  expect (stackArn).not.toEqual(newStackArn); // new stack was created
  expect(newStackResponse.Stacks?.[0].StackStatus).toEqual('CREATE_COMPLETE');
  expect(newStackResponse.Stacks?.[0].Parameters).toEqual([
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${STACK_NAME_PREFIX}allgood`,
    },
  ]);
});

integTest('stack in UPDATE_ROLLBACK_COMPLETE state can be updated', async () => {
  // GIVEN
  const stackArn = await cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}nice`,
    ],
    captureStderr: false,
  });

  let response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].StackStatus).toEqual('CREATE_COMPLETE');

  // bad parameter name with @ will put stack into UPDATE_ROLLBACK_COMPLETE
  await expect(cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}@aww`,
    ],
    captureStderr: false,
  })).rejects.toThrow('exited with error');;

  response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].StackStatus).toEqual('UPDATE_ROLLBACK_COMPLETE');

  // WHEN
  await cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${STACK_NAME_PREFIX}allgood`,
    ],
    captureStderr: false,
  });

  response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  // THEN
  expect(response.Stacks?.[0].StackStatus).toEqual('UPDATE_COMPLETE');
  expect(response.Stacks?.[0].Parameters).toEqual([
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${STACK_NAME_PREFIX}allgood`,
    },
  ]);
});

integTest('deploy with wildcard and parameters', async () => {
  await cdkDeploy('param-test-*', {
    options: [
      '--parameters', `${STACK_NAME_PREFIX}-param-test-1:TopicNameParam=${STACK_NAME_PREFIX}bazinga`,
      '--parameters', `${STACK_NAME_PREFIX}-param-test-2:OtherTopicNameParam=${STACK_NAME_PREFIX}ThatsMySpot`,
      '--parameters', `${STACK_NAME_PREFIX}-param-test-3:DisplayNameParam=${STACK_NAME_PREFIX}HeyThere`,
      '--parameters', `${STACK_NAME_PREFIX}-param-test-3:OtherDisplayNameParam=${STACK_NAME_PREFIX}AnotherOne`,
    ],
  });
});

integTest('deploy with parameters multi', async () => {
  const paramVal1 = `${STACK_NAME_PREFIX}bazinga`;
  const paramVal2 = `${STACK_NAME_PREFIX}=jagshemash`;

  const stackArn = await cdkDeploy('param-test-3', {
    options: [
      '--parameters', `DisplayNameParam=${paramVal1}`,
      '--parameters', `OtherDisplayNameParam=${paramVal2}`,
    ],
    captureStderr: false,
  });

  const response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].Parameters).toEqual([
    {
      ParameterKey: 'DisplayNameParam',
      ParameterValue: paramVal1,
    },
    {
      ParameterKey: 'OtherDisplayNameParam',
      ParameterValue: paramVal2,
    },
  ]);
});

integTest('deploy with notification ARN', async () => {
  const topicName = `${STACK_NAME_PREFIX}-test-topic`;

  const response = await sns('createTopic', { Name: topicName });
  const topicArn = response.TopicArn!;
  try {
    await cdkDeploy('test-2', {
      options: ['--notification-arns', topicArn],
    });

    // verify that the stack we deployed has our notification ARN
    const describeResponse = await cloudFormation('describeStacks', {
      StackName: fullStackName('test-2'),
    });
    expect(describeResponse.Stacks?.[0].NotificationARNs).toEqual([topicArn]);
  } finally {
    await sns('deleteTopic', {
      TopicArn: topicArn,
    });
  }
});

integTest('deploy with role', async () => {
  const roleName = `${STACK_NAME_PREFIX}-test-role`;

  await deleteRole();

  const createResponse = await iam('createRole', {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Principal: { Service: 'cloudformation.amazonaws.com' },
        Effect: 'Allow',
      }, {
        Action: 'sts:AssumeRole',
        Principal: { AWS: (await sts('getCallerIdentity', {})).Arn },
        Effect: 'Allow',
      }],
    }),
  });
  const roleArn = createResponse.Role.Arn;
  try {
    await iam('putRolePolicy', {
      RoleName: roleName,
      PolicyName: 'DefaultPolicy',
      PolicyDocument: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{
          Action: '*',
          Resource: '*',
          Effect: 'Allow',
        }],
      }),
    });

    await retry('Trying to assume fresh role', retry.forSeconds(300), async () => {
      await sts('assumeRole', {
        RoleArn: roleArn,
        RoleSessionName: 'testing',
      });
    });

    // In principle, the role has replicated from 'us-east-1' to wherever we're testing.
    // Give it a little more sleep to make sure CloudFormation is not hitting a box
    // that doesn't have it yet.
    await sleep(5000);

    await cdkDeploy('test-2', {
      options: ['--role-arn', roleArn],
    });

    // Immediately delete the stack again before we delete the role.
    //
    // Since roles are sticky, if we delete the role before the stack, subsequent DeleteStack
    // operations will fail when CloudFormation tries to assume the role that's already gone.
    await cdkDestroy('test-2');

  } finally {
    await deleteRole();
  }

  async function deleteRole() {
    try {
      for (const policyName of (await iam('listRolePolicies', { RoleName: roleName })).PolicyNames) {
        await iam('deleteRolePolicy', {
          RoleName: roleName,
          PolicyName: policyName,
        });
      }
      await iam('deleteRole', { RoleName: roleName });
    } catch (e) {
      if (e.message.indexOf('cannot be found') > -1) { return; }
      throw e;
    }
  }
});

integTest('cdk diff', async () => {
  const diff1 = await cdk(['diff', fullStackName('test-1')]);
  expect(diff1).toContain('AWS::SNS::Topic');

  const diff2 = await cdk(['diff', fullStackName('test-2')]);
  expect(diff2).toContain('AWS::SNS::Topic');

  // We can make it fail by passing --fail
  await expect(cdk(['diff', '--fail', fullStackName('test-1')]))
    .rejects.toThrow('exited with error');
});

integTest('cdk diff --fail on multiple stacks exits with error if any of the stacks contains a diff', async () => {
  // GIVEN
  const diff1 = await cdk(['diff', fullStackName('test-1')]);
  expect(diff1).toContain('AWS::SNS::Topic');

  await cdkDeploy('test-2');
  const diff2 = await cdk(['diff', fullStackName('test-2')]);
  expect(diff2).toContain('There were no differences');

  // WHEN / THEN
  await expect(cdk(['diff', '--fail', fullStackName('test-1'), fullStackName('test-2')])).rejects.toThrow('exited with error');
});

integTest('cdk diff --fail with multiple stack exits with if any of the stacks contains a diff', async () => {
  // GIVEN
  await cdkDeploy('test-1');
  const diff1 = await cdk(['diff', fullStackName('test-1')]);
  expect(diff1).toContain('There were no differences');

  const diff2 = await cdk(['diff', fullStackName('test-2')]);
  expect(diff2).toContain('AWS::SNS::Topic');

  // WHEN / THEN
  await expect(cdk(['diff', '--fail', fullStackName('test-1'), fullStackName('test-2')])).rejects.toThrow('exited with error');
});

integTest('deploy stack with docker asset', async () => {
  await cdkDeploy('docker');
});

integTest('deploy and test stack with lambda asset', async () => {
  const stackArn = await cdkDeploy('lambda', { captureStderr: false });

  const response = await cloudFormation('describeStacks', {
    StackName: stackArn,
  });
  const lambdaArn = response.Stacks?.[0].Outputs?.[0].OutputValue;
  if (lambdaArn === undefined) {
    throw new Error('Stack did not have expected Lambda ARN output');
  }

  const output = await lambda('invoke', {
    FunctionName: lambdaArn,
  });

  expect(JSON.stringify(output.Payload)).toContain('dear asset');
});

integTest('cdk ls', async () => {
  const listing = await cdk(['ls'], { captureStderr: false });

  const expectedStacks = [
    'conditional-resource',
    'docker',
    'docker-with-custom-file',
    'failed',
    'iam-test',
    'lambda',
    'missing-ssm-parameter',
    'order-providing',
    'outputs-test-1',
    'outputs-test-2',
    'param-test-1',
    'param-test-2',
    'param-test-3',
    'termination-protection',
    'test-1',
    'test-2',
    'with-nested-stack',
    'with-nested-stack-using-parameters',
    'order-consuming',
  ];

  for (const stack of expectedStacks) {
    expect(listing).toContain(fullStackName(stack));
  }
});

integTest('deploy stack without resource', async () => {
  // Deploy the stack without resources
  await cdkDeploy('conditional-resource', { modEnv: { NO_RESOURCE: 'TRUE' }});

  // This should have succeeded but not deployed the stack.
  await expect(cloudFormation('describeStacks', { StackName: fullStackName('conditional-resource') }))
    .rejects.toThrow('conditional-resource does not exist');

  // Deploy the stack with resources
  await cdkDeploy('conditional-resource');

  // Then again WITHOUT resources (this should destroy the stack)
  await cdkDeploy('conditional-resource', { modEnv: { NO_RESOURCE: 'TRUE' } });

  await expect(cloudFormation('describeStacks', { StackName: fullStackName('conditional-resource') }))
    .rejects.toThrow('conditional-resource does not exist');
});

integTest('IAM diff', async () => {
  const output = await cdk(['diff', fullStackName('iam-test')]);

  // Roughly check for a table like this:
  //
  // ┌───┬─────────────────┬────────┬────────────────┬────────────────────────────-──┬───────────┐
  // │   │ Resource        │ Effect │ Action         │ Principal                     │ Condition │
  // ├───┼─────────────────┼────────┼────────────────┼───────────────────────────────┼───────────┤
  // │ + │ ${SomeRole.Arn} │ Allow  │ sts:AssumeRole │ Service:ec2.amazonaws.com     │           │
  // └───┴─────────────────┴────────┴────────────────┴───────────────────────────────┴───────────┘

  expect(output).toContain('${SomeRole.Arn}');
  expect(output).toContain('sts:AssumeRole');
  expect(output).toContain('ec2.amazonaws.com');
});

integTest('fast deploy', async () => {
  // we are using a stack with a nested stack because CFN will always attempt to
  // update a nested stack, which will allow us to verify that updates are actually
  // skipped unless --force is specified.
  const stackArn = await cdkDeploy('with-nested-stack', { captureStderr: false });
  const changeSet1 = await getLatestChangeSet();

  // Deploy the same stack again, there should be no new change set created
  await cdkDeploy('with-nested-stack');
  const changeSet2 = await getLatestChangeSet();
  expect(changeSet2.ChangeSetId).toEqual(changeSet1.ChangeSetId);

  // Deploy the stack again with --force, now we should create a changeset
  await cdkDeploy('with-nested-stack', { options: ['--force'] });
  const changeSet3 = await getLatestChangeSet();
  expect(changeSet3.ChangeSetId).not.toEqual(changeSet2.ChangeSetId);

  // Deploy the stack again with tags, expected to create a new changeset
  // even though the resources didn't change.
  await cdkDeploy('with-nested-stack', { options: ['--tags', 'key=value'] });
  const changeSet4 = await getLatestChangeSet();
  expect(changeSet4.ChangeSetId).not.toEqual(changeSet3.ChangeSetId);

  async function getLatestChangeSet() {
    const response = await cloudFormation('describeStacks', { StackName: stackArn });
    if (!response.Stacks?.[0]) { throw new Error('Did not get a ChangeSet at all'); }
    log(`Found Change Set ${response.Stacks?.[0].ChangeSetId}`);
    return response.Stacks?.[0];
  }
});

integTest('failed deploy does not hang', async () => {
  // this will hang if we introduce https://github.com/aws/aws-cdk/issues/6403 again.
  await expect(cdkDeploy('failed')).rejects.toThrow('exited with error');
});

integTest('can still load old assemblies', async () => {
  const cxAsmDir =  path.join(os.tmpdir(), 'cdk-integ-cx');

  const testAssembliesDirectory = path.join(__dirname, 'cloud-assemblies');
  for (const asmdir of await listChildDirs(testAssembliesDirectory)) {
    log(`ASSEMBLY ${asmdir}`);
    await cloneDirectory(asmdir, cxAsmDir);

    // Some files in the asm directory that have a .js extension are
    // actually treated as templates. Evaluate them using NodeJS.
    const templates = await listChildren(cxAsmDir, fullPath => Promise.resolve(fullPath.endsWith('.js')));
    for (const template of templates) {
      const targetName = template.replace(/.js$/, '');
      await shell([process.execPath, template, '>', targetName], {
        cwd: cxAsmDir,
        modEnv: {
          TEST_ACCOUNT: (await testEnv()).account,
          TEST_REGION: (await testEnv()).region,
        },
      });
    }

    // Use this directory as a Cloud Assembly
    const output = await cdk([
      '--app', cxAsmDir,
      '-v',
      'synth']);

    // Assert that there was no providerError in CDK's stderr
    // Because we rely on the app/framework to actually error in case the
    // provider fails, we inspect the logs here.
    expect(output).not.toContain('$providerError');
  }
});

integTest('generating and loading assembly', async () => {
  const asmOutputDir = path.join(os.tmpdir(), 'cdk-integ-asm');
  await shell(['rm', '-rf', asmOutputDir]);

  // Make sure our fixture directory is clean
  await prepareAppFixture();

  // Synthesize a Cloud Assembly tothe default directory (cdk.out) and a specific directory.
  await cdk(['synth']);
  await cdk(['synth', '--output', asmOutputDir]);

  // cdk.out in the current directory and the indicated --output should be the same
  await shell(['diff', 'cdk.out', asmOutputDir], {
    cwd: INTEG_TEST_DIR,
  });

  // Check that we can 'ls' the synthesized asm.
  // Change to some random directory to make sure we're not accidentally loading cdk.json
  const list = await cdk(['--app', asmOutputDir, 'ls'], { cwd: os.tmpdir() });
  // Same stacks we know are in the app
  expect(list).toContain(`${STACK_NAME_PREFIX}-lambda`);
  expect(list).toContain(`${STACK_NAME_PREFIX}-test-1`);
  expect(list).toContain(`${STACK_NAME_PREFIX}-test-2`);

  // Check that we can use '.' and just synth ,the generated asm
  const stackTemplate = await cdk(['--app', '.', 'synth', fullStackName('test-2')], {
    cwd: asmOutputDir,
  });
  expect(stackTemplate).toContain('topic152D84A37');

  // Deploy a Lambda from the copied asm
  await cdkDeploy('lambda', { options: ['-a', '.'], cwd: asmOutputDir });

  // Remove the original custom docker file that was used during synth.
  // this verifies that the assemly has a copy of it and that the manifest uses
  // relative paths to reference to it.
  await fs.unlink(path.join(INTEG_TEST_DIR, 'docker', 'Dockerfile.Custom'));

  // deploy a docker image with custom file without synth (uses assets)
  await cdkDeploy('docker-with-custom-file', { options: ['-a', '.'], cwd: asmOutputDir });
});

async function listChildren(parent: string, pred: (x: string) => Promise<boolean>) {
  const ret = new Array<string>();
  for (const child of await fs.readdir(parent, { encoding: 'utf-8' })) {
    const fullPath = path.join(parent, child.toString());
    if (await pred(fullPath)) {
      ret.push(fullPath);
    }
  }
  return ret;
}

async function listChildDirs(parent: string) {
  return listChildren(parent, async (fullPath: string) => (await fs.stat(fullPath)).isDirectory());
}
