import { promises as fs, existsSync } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { integTest, cloneDirectory, shell, withDefaultFixture, retry, sleep, randomInteger, withSamIntegrationFixture, RESOURCES_DIR } from '../../lib';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

describe('ci', () => {
  integTest('output to stderr', withDefaultFixture(async (fixture) => {
    const deployOutput = await fixture.cdkDeploy('test-2', { captureStderr: true, onlyStderr: true });
    const diffOutput = await fixture.cdk(['diff', fixture.fullStackName('test-2')], { captureStderr: true, onlyStderr: true });
    const destroyOutput = await fixture.cdkDestroy('test-2', { captureStderr: true, onlyStderr: true });
    expect(deployOutput).not.toEqual('');
    expect(destroyOutput).not.toEqual('');
    expect(diffOutput).not.toEqual('');
  }));
  describe('ci=true', () => {
    integTest('output to stdout', withDefaultFixture(async (fixture) => {

      const execOptions = {
        captureStderr: true,
        onlyStderr: true,
        modEnv: { CI: 'true' },
      };

      const deployOutput = await fixture.cdkDeploy('test-2', execOptions);
      const diffOutput = await fixture.cdk(['diff', fixture.fullStackName('test-2')], execOptions);
      const destroyOutput = await fixture.cdkDestroy('test-2', execOptions);
      expect(deployOutput).toEqual('');
      expect(destroyOutput).toEqual('');
      expect(diffOutput).toEqual('');
    }));
  });
});

integTest('VPC Lookup', withDefaultFixture(async (fixture) => {
  fixture.log('Making sure we are clean before starting.');
  await fixture.cdkDestroy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' } });

  fixture.log('Setting up: creating a VPC with known tags');
  await fixture.cdkDeploy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' } });
  fixture.log('Setup complete!');

  fixture.log('Verifying we can now import that VPC');
  await fixture.cdkDeploy('import-vpc', { modEnv: { ENABLE_VPC_TESTING: 'IMPORT' } });
}));

// testing a construct with a builtin Nodejs Lambda Function.
// In this case we are testing the s3.Bucket construct with the
// autoDeleteObjects prop set to true, which creates a Lambda backed
// CustomResource. Since the compiled Lambda code (e.g. __entrypoint__.js)
// is bundled as part of the CDK package, we want to make sure we don't
// introduce changes to the compiled code that could prevent the Lambda from
// executing. If we do, this test will timeout and fail.
integTest('Construct with builtin Lambda function', withDefaultFixture(async (fixture) => {
  await fixture.cdkDeploy('builtin-lambda-function');
  fixture.log('Setup complete!');
  await fixture.cdkDestroy('builtin-lambda-function');
}));

// this is to ensure that asset bundling for apps under a stage does not break
integTest('Stage with bundled Lambda function', withDefaultFixture(async (fixture) => {
  await fixture.cdkDeploy('bundling-stage/BundlingStack');
  fixture.log('Setup complete!');
  await fixture.cdkDestroy('bundling-stage/BundlingStack');
}));

integTest('Two ways of showing the version', withDefaultFixture(async (fixture) => {
  const version1 = await fixture.cdk(['version'], { verbose: false });
  const version2 = await fixture.cdk(['--version'], { verbose: false });

  expect(version1).toEqual(version2);
}));

integTest('Termination protection', withDefaultFixture(async (fixture) => {
  const stackName = 'termination-protection';
  await fixture.cdkDeploy(stackName);

  // Try a destroy that should fail
  await expect(fixture.cdkDestroy(stackName)).rejects.toThrow('exited with error');

  // Can update termination protection even though the change set doesn't contain changes
  await fixture.cdkDeploy(stackName, { modEnv: { TERMINATION_PROTECTION: 'FALSE' } });
  await fixture.cdkDestroy(stackName);
}));

integTest('cdk synth', withDefaultFixture(async (fixture) => {
  await fixture.cdk(['synth', fixture.fullStackName('test-1')]);
  expect(fixture.template('test-1')).toEqual(expect.objectContaining({
    Resources: {
      topic69831491: {
        Type: 'AWS::SNS::Topic',
        Metadata: {
          'aws:cdk:path': `${fixture.stackNamePrefix}-test-1/topic/Resource`,
        },
      },
    },
  }));

  await fixture.cdk(['synth', fixture.fullStackName('test-2')], { verbose: false });
  expect(fixture.template('test-2')).toEqual(expect.objectContaining({
    Resources: {
      topic152D84A37: {
        Type: 'AWS::SNS::Topic',
        Metadata: {
          'aws:cdk:path': `${fixture.stackNamePrefix}-test-2/topic1/Resource`,
        },
      },
      topic2A4FB547F: {
        Type: 'AWS::SNS::Topic',
        Metadata: {
          'aws:cdk:path': `${fixture.stackNamePrefix}-test-2/topic2/Resource`,
        },
      },
    },
  }));
}));

integTest('ssm parameter provider error', withDefaultFixture(async (fixture) => {
  await expect(fixture.cdk(['synth',
    fixture.fullStackName('missing-ssm-parameter'),
    '-c', 'test:ssm-parameter-name=/does/not/exist'], {
    allowErrExit: true,
  })).resolves.toContain('SSM parameter not available in account');
}));

integTest('automatic ordering', withDefaultFixture(async (fixture) => {
  // Deploy the consuming stack which will include the producing stack
  await fixture.cdkDeploy('order-consuming');

  // Destroy the providing stack which will include the consuming stack
  await fixture.cdkDestroy('order-providing');
}));

integTest('automatic ordering with concurrency', withDefaultFixture(async (fixture) => {
  // Deploy the consuming stack which will include the producing stack
  await fixture.cdkDeploy('order-consuming', { options: ['--concurrency', '2'] });

  // Destroy the providing stack which will include the consuming stack
  await fixture.cdkDestroy('order-providing');
}));

integTest('--exclusively selects only selected stack', withDefaultFixture(async (fixture) => {
  // Deploy the "depends-on-failed" stack, with --exclusively. It will NOT fail (because
  // of --exclusively) and it WILL create an output we can check for to confirm that it did
  // get deployed.
  const outputsFile = path.join(fixture.integTestDir, 'outputs', 'outputs.json');
  await fs.mkdir(path.dirname(outputsFile), { recursive: true });

  await fixture.cdkDeploy('depends-on-failed', {
    options: [
      '--exclusively',
      '--outputs-file', outputsFile,
    ],
  });

  // Verify the output to see that the stack deployed
  const outputs = JSON.parse((await fs.readFile(outputsFile, { encoding: 'utf-8' })).toString());
  expect(outputs).toEqual({
    [`${fixture.stackNamePrefix}-depends-on-failed`]: {
      TopicName: `${fixture.stackNamePrefix}-depends-on-failedMyTopic`,
    },
  });
}));

integTest('context setting', withDefaultFixture(async (fixture) => {
  await fs.writeFile(path.join(fixture.integTestDir, 'cdk.context.json'), JSON.stringify({
    contextkey: 'this is the context value',
  }));
  try {
    await expect(fixture.cdk(['context'])).resolves.toContain('this is the context value');

    // Test that deleting the contextkey works
    await fixture.cdk(['context', '--reset', 'contextkey']);
    await expect(fixture.cdk(['context'])).resolves.not.toContain('this is the context value');

    // Test that forced delete of the context key does not throw
    await fixture.cdk(['context', '-f', '--reset', 'contextkey']);

  } finally {
    await fs.unlink(path.join(fixture.integTestDir, 'cdk.context.json'));
  }
}));

integTest('context in stage propagates to top', withDefaultFixture(async (fixture) => {
  await expect(fixture.cdkSynth({
    // This will make it error to prove that the context bubbles up, and also that we can fail on command
    options: ['--no-lookups'],
    modEnv: {
      INTEG_STACK_SET: 'stage-using-context',
    },
    allowErrExit: true,
  })).resolves.toContain('Context lookups have been disabled');
}));

integTest('deploy', withDefaultFixture(async (fixture) => {
  const stackArn = await fixture.cdkDeploy('test-2', { captureStderr: false });

  // verify the number of resources in the stack
  const response = await fixture.aws.cloudFormation('describeStackResources', {
    StackName: stackArn,
  });
  expect(response.StackResources?.length).toEqual(2);
}));

integTest('deploy --method=direct', withDefaultFixture(async (fixture) => {
  const stackArn = await fixture.cdkDeploy('test-2', {
    options: ['--method=direct'],
    captureStderr: false,
  });

  // verify the number of resources in the stack
  const response = await fixture.aws.cloudFormation('describeStackResources', {
    StackName: stackArn,
  });
  expect(response.StackResources?.length).toBeGreaterThan(0);
}));

integTest('deploy all', withDefaultFixture(async (fixture) => {
  const arns = await fixture.cdkDeploy('test-*', { captureStderr: false });

  // verify that we only deployed both stacks (there are 2 ARNs in the output)
  expect(arns.split('\n').length).toEqual(2);
}));

integTest('deploy all concurrently', withDefaultFixture(async (fixture) => {
  const arns = await fixture.cdkDeploy('test-*', {
    captureStderr: false,
    options: ['--concurrency', '2'],
  });

  // verify that we only deployed both stacks (there are 2 ARNs in the output)
  expect(arns.split('\n').length).toEqual(2);
}));

integTest('nested stack with parameters', withDefaultFixture(async (fixture) => {
  // STACK_NAME_PREFIX is used in MyTopicParam to allow multiple instances
  // of this test to run in parallel, othewise they will attempt to create the same SNS topic.
  const stackArn = await fixture.cdkDeploy('with-nested-stack-using-parameters', {
    options: ['--parameters', `MyTopicParam=${fixture.stackNamePrefix}ThereIsNoSpoon`],
    captureStderr: false,
  });

  // verify that we only deployed a single stack (there's a single ARN in the output)
  expect(stackArn.split('\n').length).toEqual(1);

  // verify the number of resources in the stack
  const response = await fixture.aws.cloudFormation('describeStackResources', {
    StackName: stackArn,
  });
  expect(response.StackResources?.length).toEqual(1);
}));

integTest('deploy without execute a named change set', withDefaultFixture(async (fixture) => {
  const changeSetName = 'custom-change-set-name';
  const stackArn = await fixture.cdkDeploy('test-2', {
    options: ['--no-execute', '--change-set-name', changeSetName],
    captureStderr: false,
  });
  // verify that we only deployed a single stack (there's a single ARN in the output)
  expect(stackArn.split('\n').length).toEqual(1);

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });
  expect(response.Stacks?.[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');

  //verify a change set was created with the provided name
  const changeSetResponse = await fixture.aws.cloudFormation('listChangeSets', {
    StackName: stackArn,
  });
  const changeSets = changeSetResponse.Summaries || [];
  expect(changeSets.length).toEqual(1);
  expect(changeSets[0].ChangeSetName).toEqual(changeSetName);
  expect(changeSets[0].Status).toEqual('CREATE_COMPLETE');
}));

integTest('security related changes without a CLI are expected to fail', withDefaultFixture(async (fixture) => {
  // redirect /dev/null to stdin, which means there will not be tty attached
  // since this stack includes security-related changes, the deployment should
  // immediately fail because we can't confirm the changes
  const stackName = 'iam-test';
  await expect(fixture.cdkDeploy(stackName, {
    options: ['<', '/dev/null'], // H4x, this only works because I happen to know we pass shell: true.
    neverRequireApproval: false,
  })).rejects.toThrow('exited with error');

  // Ensure stack was not deployed
  await expect(fixture.aws.cloudFormation('describeStacks', {
    StackName: fixture.fullStackName(stackName),
  })).rejects.toThrow('does not exist');
}));

integTest('deploy wildcard with outputs', withDefaultFixture(async (fixture) => {
  const outputsFile = path.join(fixture.integTestDir, 'outputs', 'outputs.json');
  await fs.mkdir(path.dirname(outputsFile), { recursive: true });

  await fixture.cdkDeploy(['outputs-test-*'], {
    options: ['--outputs-file', outputsFile],
  });

  const outputs = JSON.parse((await fs.readFile(outputsFile, { encoding: 'utf-8' })).toString());
  expect(outputs).toEqual({
    [`${fixture.stackNamePrefix}-outputs-test-1`]: {
      TopicName: `${fixture.stackNamePrefix}-outputs-test-1MyTopic`,
    },
    [`${fixture.stackNamePrefix}-outputs-test-2`]: {
      TopicName: `${fixture.stackNamePrefix}-outputs-test-2MyOtherTopic`,
    },
  });
}));

integTest('deploy with parameters', withDefaultFixture(async (fixture) => {
  const stackArn = await fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}bazinga`,
    ],
    captureStderr: false,
  });

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].Parameters).toContainEqual(
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${fixture.stackNamePrefix}bazinga`,
    },
  );
}));

integTest('update to stack in ROLLBACK_COMPLETE state will delete stack and create a new one', withDefaultFixture(async (fixture) => {
  // GIVEN
  await expect(fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}@aww`,
    ],
    captureStderr: false,
  })).rejects.toThrow('exited with error');

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: fixture.fullStackName('param-test-1'),
  });

  const stackArn = response.Stacks?.[0].StackId;
  expect(response.Stacks?.[0].StackStatus).toEqual('ROLLBACK_COMPLETE');

  // WHEN
  const newStackArn = await fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}allgood`,
    ],
    captureStderr: false,
  });

  const newStackResponse = await fixture.aws.cloudFormation('describeStacks', {
    StackName: newStackArn,
  });

  // THEN
  expect(stackArn).not.toEqual(newStackArn); // new stack was created
  expect(newStackResponse.Stacks?.[0].StackStatus).toEqual('CREATE_COMPLETE');
  expect(newStackResponse.Stacks?.[0].Parameters).toContainEqual(
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${fixture.stackNamePrefix}allgood`,
    },
  );
}));

integTest('stack in UPDATE_ROLLBACK_COMPLETE state can be updated', withDefaultFixture(async (fixture) => {
  // GIVEN
  const stackArn = await fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}nice`,
    ],
    captureStderr: false,
  });

  let response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].StackStatus).toEqual('CREATE_COMPLETE');

  // bad parameter name with @ will put stack into UPDATE_ROLLBACK_COMPLETE
  await expect(fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}@aww`,
    ],
    captureStderr: false,
  })).rejects.toThrow('exited with error');;

  response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].StackStatus).toEqual('UPDATE_ROLLBACK_COMPLETE');

  // WHEN
  await fixture.cdkDeploy('param-test-1', {
    options: [
      '--parameters', `TopicNameParam=${fixture.stackNamePrefix}allgood`,
    ],
    captureStderr: false,
  });

  response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  // THEN
  expect(response.Stacks?.[0].StackStatus).toEqual('UPDATE_COMPLETE');
  expect(response.Stacks?.[0].Parameters).toContainEqual(
    {
      ParameterKey: 'TopicNameParam',
      ParameterValue: `${fixture.stackNamePrefix}allgood`,
    },
  );
}));

integTest('deploy with wildcard and parameters', withDefaultFixture(async (fixture) => {
  await fixture.cdkDeploy('param-test-*', {
    options: [
      '--parameters', `${fixture.stackNamePrefix}-param-test-1:TopicNameParam=${fixture.stackNamePrefix}bazinga`,
      '--parameters', `${fixture.stackNamePrefix}-param-test-2:OtherTopicNameParam=${fixture.stackNamePrefix}ThatsMySpot`,
      '--parameters', `${fixture.stackNamePrefix}-param-test-3:DisplayNameParam=${fixture.stackNamePrefix}HeyThere`,
      '--parameters', `${fixture.stackNamePrefix}-param-test-3:OtherDisplayNameParam=${fixture.stackNamePrefix}AnotherOne`,
    ],
  });
}));

integTest('deploy with parameters multi', withDefaultFixture(async (fixture) => {
  const paramVal1 = `${fixture.stackNamePrefix}bazinga`;
  const paramVal2 = `${fixture.stackNamePrefix}=jagshemash`;

  const stackArn = await fixture.cdkDeploy('param-test-3', {
    options: [
      '--parameters', `DisplayNameParam=${paramVal1}`,
      '--parameters', `OtherDisplayNameParam=${paramVal2}`,
    ],
    captureStderr: false,
  });

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });

  expect(response.Stacks?.[0].Parameters).toContainEqual(
    {
      ParameterKey: 'DisplayNameParam',
      ParameterValue: paramVal1,
    },
  );
  expect(response.Stacks?.[0].Parameters).toContainEqual(
    {
      ParameterKey: 'OtherDisplayNameParam',
      ParameterValue: paramVal2,
    },
  );
}));

integTest('deploy with notification ARN', withDefaultFixture(async (fixture) => {
  const topicName = `${fixture.stackNamePrefix}-test-topic`;

  const response = await fixture.aws.sns('createTopic', { Name: topicName });
  const topicArn = response.TopicArn!;
  try {
    await fixture.cdkDeploy('test-2', {
      options: ['--notification-arns', topicArn],
    });

    // verify that the stack we deployed has our notification ARN
    const describeResponse = await fixture.aws.cloudFormation('describeStacks', {
      StackName: fixture.fullStackName('test-2'),
    });
    expect(describeResponse.Stacks?.[0].NotificationARNs).toEqual([topicArn]);
  } finally {
    await fixture.aws.sns('deleteTopic', {
      TopicArn: topicArn,
    });
  }
}));

// NOTE: this doesn't currently work with modern-style synthesis, as the bootstrap
// role by default will not have permission to iam:PassRole the created role.
integTest('deploy with role', withDefaultFixture(async (fixture) => {
  if (fixture.packages.majorVersion() !== '1') {
    return; // Nothing to do
  }

  const roleName = `${fixture.stackNamePrefix}-test-role`;

  await deleteRole();

  const createResponse = await fixture.aws.iam('createRole', {
    RoleName: roleName,
    AssumeRolePolicyDocument: JSON.stringify({
      Version: '2012-10-17',
      Statement: [{
        Action: 'sts:AssumeRole',
        Principal: { Service: 'cloudformation.amazonaws.com' },
        Effect: 'Allow',
      }, {
        Action: 'sts:AssumeRole',
        Principal: { AWS: (await fixture.aws.sts('getCallerIdentity', {})).Arn },
        Effect: 'Allow',
      }],
    }),
  });
  const roleArn = createResponse.Role.Arn;
  try {
    await fixture.aws.iam('putRolePolicy', {
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

    await retry(fixture.output, 'Trying to assume fresh role', retry.forSeconds(300), async () => {
      await fixture.aws.sts('assumeRole', {
        RoleArn: roleArn,
        RoleSessionName: 'testing',
      });
    });

    // In principle, the role has replicated from 'us-east-1' to wherever we're testing.
    // Give it a little more sleep to make sure CloudFormation is not hitting a box
    // that doesn't have it yet.
    await sleep(5000);

    await fixture.cdkDeploy('test-2', {
      options: ['--role-arn', roleArn],
    });

    // Immediately delete the stack again before we delete the role.
    //
    // Since roles are sticky, if we delete the role before the stack, subsequent DeleteStack
    // operations will fail when CloudFormation tries to assume the role that's already gone.
    await fixture.cdkDestroy('test-2');

  } finally {
    await deleteRole();
  }

  async function deleteRole() {
    try {
      for (const policyName of (await fixture.aws.iam('listRolePolicies', { RoleName: roleName })).PolicyNames) {
        await fixture.aws.iam('deleteRolePolicy', {
          RoleName: roleName,
          PolicyName: policyName,
        });
      }
      await fixture.aws.iam('deleteRole', { RoleName: roleName });
    } catch (e: any) {
      if (e.message.indexOf('cannot be found') > -1) { return; }
      throw e;
    }
  }
}));

integTest('cdk diff', withDefaultFixture(async (fixture) => {
  const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
  expect(diff1).toContain('AWS::SNS::Topic');

  const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
  expect(diff2).toContain('AWS::SNS::Topic');

  // We can make it fail by passing --fail
  await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1')]))
    .rejects.toThrow('exited with error');
}));

integTest('enableDiffNoFail', withDefaultFixture(async (fixture) => {
  await diffShouldSucceedWith({ fail: false, enableDiffNoFail: false });
  await diffShouldSucceedWith({ fail: false, enableDiffNoFail: true });
  await diffShouldFailWith({ fail: true, enableDiffNoFail: false });
  await diffShouldFailWith({ fail: true, enableDiffNoFail: true });
  await diffShouldFailWith({ fail: undefined, enableDiffNoFail: false });
  await diffShouldSucceedWith({ fail: undefined, enableDiffNoFail: true });

  async function diffShouldSucceedWith(props: DiffParameters) {
    await expect(diff(props)).resolves.not.toThrowError();
  }

  async function diffShouldFailWith(props: DiffParameters) {
    await expect(diff(props)).rejects.toThrow('exited with error');
  }

  async function diff(props: DiffParameters): Promise<string> {
    await updateContext(props.enableDiffNoFail);
    const flag = props.fail != null
      ? (props.fail ? '--fail' : '--no-fail')
      : '';

    return fixture.cdk(['diff', flag, fixture.fullStackName('test-1')]);
  }

  async function updateContext(enableDiffNoFail: boolean) {
    const cdkJson = JSON.parse(await fs.readFile(path.join(fixture.integTestDir, 'cdk.json'), 'utf8'));
    cdkJson.context = {
      ...cdkJson.context,
      'aws-cdk:enableDiffNoFail': enableDiffNoFail,
    };
    await fs.writeFile(path.join(fixture.integTestDir, 'cdk.json'), JSON.stringify(cdkJson));
  }

  type DiffParameters = { fail?: boolean, enableDiffNoFail: boolean };
}));

integTest('cdk diff --fail on multiple stacks exits with error if any of the stacks contains a diff', withDefaultFixture(async (fixture) => {
  // GIVEN
  const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
  expect(diff1).toContain('AWS::SNS::Topic');

  await fixture.cdkDeploy('test-2');
  const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
  expect(diff2).toContain('There were no differences');

  // WHEN / THEN
  await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1'), fixture.fullStackName('test-2')])).rejects.toThrow('exited with error');
}));

integTest('cdk diff --fail with multiple stack exits with if any of the stacks contains a diff', withDefaultFixture(async (fixture) => {
  // GIVEN
  await fixture.cdkDeploy('test-1');
  const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
  expect(diff1).toContain('There were no differences');

  const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
  expect(diff2).toContain('AWS::SNS::Topic');

  // WHEN / THEN
  await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1'), fixture.fullStackName('test-2')])).rejects.toThrow('exited with error');
}));

integTest('cdk diff --security-only --fail exits when security changes are present', withDefaultFixture(async (fixture) => {
  const stackName = 'iam-test';
  await expect(fixture.cdk(['diff', '--security-only', '--fail', fixture.fullStackName(stackName)])).rejects.toThrow('exited with error');
}));

integTest('deploy stack with docker asset', withDefaultFixture(async (fixture) => {
  await fixture.cdkDeploy('docker');
}));

integTest('deploy and test stack with lambda asset', withDefaultFixture(async (fixture) => {
  const stackArn = await fixture.cdkDeploy('lambda', { captureStderr: false });

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });
  const lambdaArn = response.Stacks?.[0].Outputs?.[0].OutputValue;
  if (lambdaArn === undefined) {
    throw new Error('Stack did not have expected Lambda ARN output');
  }

  const output = await fixture.aws.lambda('invoke', {
    FunctionName: lambdaArn,
  });

  expect(JSON.stringify(output.Payload)).toContain('dear asset');
}));

integTest('cdk ls', withDefaultFixture(async (fixture) => {
  const listing = await fixture.cdk(['ls'], { captureStderr: false });

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
    expect(listing).toContain(fixture.fullStackName(stack));
  }
}));

integTest('synthing a stage with errors leads to failure', withDefaultFixture(async (fixture) => {
  const output = await fixture.cdk(['synth'], {
    allowErrExit: true,
    modEnv: {
      INTEG_STACK_SET: 'stage-with-errors',
    },
  });

  expect(output).toContain('This is an error');
}));

integTest('synthing a stage with errors can be suppressed', withDefaultFixture(async (fixture) => {
  await fixture.cdk(['synth', '--no-validation'], {
    modEnv: {
      INTEG_STACK_SET: 'stage-with-errors',
    },
  });
}));

integTest('deploy stack without resource', withDefaultFixture(async (fixture) => {
  // Deploy the stack without resources
  await fixture.cdkDeploy('conditional-resource', { modEnv: { NO_RESOURCE: 'TRUE' } });

  // This should have succeeded but not deployed the stack.
  await expect(fixture.aws.cloudFormation('describeStacks', { StackName: fixture.fullStackName('conditional-resource') }))
    .rejects.toThrow('conditional-resource does not exist');

  // Deploy the stack with resources
  await fixture.cdkDeploy('conditional-resource');

  // Then again WITHOUT resources (this should destroy the stack)
  await fixture.cdkDeploy('conditional-resource', { modEnv: { NO_RESOURCE: 'TRUE' } });

  await expect(fixture.aws.cloudFormation('describeStacks', { StackName: fixture.fullStackName('conditional-resource') }))
    .rejects.toThrow('conditional-resource does not exist');
}));

integTest('IAM diff', withDefaultFixture(async (fixture) => {
  const output = await fixture.cdk(['diff', fixture.fullStackName('iam-test')]);

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
}));

integTest('fast deploy', withDefaultFixture(async (fixture) => {
  // we are using a stack with a nested stack because CFN will always attempt to
  // update a nested stack, which will allow us to verify that updates are actually
  // skipped unless --force is specified.
  const stackArn = await fixture.cdkDeploy('with-nested-stack', { captureStderr: false });
  const changeSet1 = await getLatestChangeSet();

  // Deploy the same stack again, there should be no new change set created
  await fixture.cdkDeploy('with-nested-stack');
  const changeSet2 = await getLatestChangeSet();
  expect(changeSet2.ChangeSetId).toEqual(changeSet1.ChangeSetId);

  // Deploy the stack again with --force, now we should create a changeset
  await fixture.cdkDeploy('with-nested-stack', { options: ['--force'] });
  const changeSet3 = await getLatestChangeSet();
  expect(changeSet3.ChangeSetId).not.toEqual(changeSet2.ChangeSetId);

  // Deploy the stack again with tags, expected to create a new changeset
  // even though the resources didn't change.
  await fixture.cdkDeploy('with-nested-stack', { options: ['--tags', 'key=value'] });
  const changeSet4 = await getLatestChangeSet();
  expect(changeSet4.ChangeSetId).not.toEqual(changeSet3.ChangeSetId);

  async function getLatestChangeSet() {
    const response = await fixture.aws.cloudFormation('describeStacks', { StackName: stackArn });
    if (!response.Stacks?.[0]) { throw new Error('Did not get a ChangeSet at all'); }
    fixture.log(`Found Change Set ${response.Stacks?.[0].ChangeSetId}`);
    return response.Stacks?.[0];
  }
}));

integTest('failed deploy does not hang', withDefaultFixture(async (fixture) => {
  // this will hang if we introduce https://github.com/aws/aws-cdk/issues/6403 again.
  await expect(fixture.cdkDeploy('failed')).rejects.toThrow('exited with error');
}));

integTest('can still load old assemblies', withDefaultFixture(async (fixture) => {
  const cxAsmDir = path.join(os.tmpdir(), 'cdk-integ-cx');

  const testAssembliesDirectory = path.join(RESOURCES_DIR, 'cloud-assemblies');
  for (const asmdir of await listChildDirs(testAssembliesDirectory)) {
    fixture.log(`ASSEMBLY ${asmdir}`);
    await cloneDirectory(asmdir, cxAsmDir);

    // Some files in the asm directory that have a .js extension are
    // actually treated as templates. Evaluate them using NodeJS.
    const templates = await listChildren(cxAsmDir, fullPath => Promise.resolve(fullPath.endsWith('.js')));
    for (const template of templates) {
      const targetName = template.replace(/.js$/, '');
      await shell([process.execPath, template, '>', targetName], {
        cwd: cxAsmDir,
        output: fixture.output,
        modEnv: {
          TEST_ACCOUNT: await fixture.aws.account(),
          TEST_REGION: fixture.aws.region,
        },
      });
    }

    // Use this directory as a Cloud Assembly
    const output = await fixture.cdk([
      '--app', cxAsmDir,
      '-v',
      'synth',
    ]);

    // Assert that there was no providerError in CDK's stderr
    // Because we rely on the app/framework to actually error in case the
    // provider fails, we inspect the logs here.
    expect(output).not.toContain('$providerError');
  }
}));

integTest('generating and loading assembly', withDefaultFixture(async (fixture) => {
  const asmOutputDir = `${fixture.integTestDir}-cdk-integ-asm`;
  await fixture.shell(['rm', '-rf', asmOutputDir]);

  // Synthesize a Cloud Assembly tothe default directory (cdk.out) and a specific directory.
  await fixture.cdk(['synth']);
  await fixture.cdk(['synth', '--output', asmOutputDir]);

  // cdk.out in the current directory and the indicated --output should be the same
  await fixture.shell(['diff', 'cdk.out', asmOutputDir]);

  // Check that we can 'ls' the synthesized asm.
  // Change to some random directory to make sure we're not accidentally loading cdk.json
  const list = await fixture.cdk(['--app', asmOutputDir, 'ls'], { cwd: os.tmpdir() });
  // Same stacks we know are in the app
  expect(list).toContain(`${fixture.stackNamePrefix}-lambda`);
  expect(list).toContain(`${fixture.stackNamePrefix}-test-1`);
  expect(list).toContain(`${fixture.stackNamePrefix}-test-2`);

  // Check that we can use '.' and just synth ,the generated asm
  const stackTemplate = await fixture.cdk(['--app', '.', 'synth', fixture.fullStackName('test-2')], {
    cwd: asmOutputDir,
  });
  expect(stackTemplate).toContain('topic152D84A37');

  // Deploy a Lambda from the copied asm
  await fixture.cdkDeploy('lambda', { options: ['-a', '.'], cwd: asmOutputDir });

  // Remove (rename) the original custom docker file that was used during synth.
  // this verifies that the assemly has a copy of it and that the manifest uses
  // relative paths to reference to it.
  const customDockerFile = path.join(fixture.integTestDir, 'docker', 'Dockerfile.Custom');
  await fs.rename(customDockerFile, `${customDockerFile}~`);
  try {

    // deploy a docker image with custom file without synth (uses assets)
    await fixture.cdkDeploy('docker-with-custom-file', { options: ['-a', '.'], cwd: asmOutputDir });

  } finally {
    // Rename back to restore fixture to original state
    await fs.rename(`${customDockerFile}~`, customDockerFile);
  }
}));

integTest('templates on disk contain metadata resource, also in nested assemblies', withDefaultFixture(async (fixture) => {
  // Synth first, and switch on version reporting because cdk.json is disabling it
  await fixture.cdk(['synth', '--version-reporting=true']);

  // Load template from disk from root assembly
  const templateContents = await fixture.shell(['cat', 'cdk.out/*-lambda.template.json']);

  expect(JSON.parse(templateContents).Resources.CDKMetadata).toBeTruthy();

  // Load template from nested assembly
  const nestedTemplateContents = await fixture.shell(['cat', 'cdk.out/assembly-*-stage/*StackInStage*.template.json']);

  expect(JSON.parse(nestedTemplateContents).Resources.CDKMetadata).toBeTruthy();
}));

integTest('CDK synth add the metadata properties expected by sam', withSamIntegrationFixture(async (fixture) => {
  // Synth first
  await fixture.cdkSynth();

  const template = fixture.template('TestStack');

  const expectedResources = [
    {
      // Python Layer Version
      id: 'PythonLayerVersion39495CEF',
      cdkId: 'PythonLayerVersion',
      isBundled: true,
      property: 'Content',
    },
    {
      // Layer Version
      id: 'LayerVersion3878DA3A',
      cdkId: 'LayerVersion',
      isBundled: false,
      property: 'Content',
    },
    {
      // Bundled layer version
      id: 'BundledLayerVersionPythonRuntime6BADBD6E',
      cdkId: 'BundledLayerVersionPythonRuntime',
      isBundled: true,
      property: 'Content',
    },
    {
      // Python Function
      id: 'PythonFunction0BCF77FD',
      cdkId: 'PythonFunction',
      isBundled: true,
      property: 'Code',
    },
    {
      // Log Retention Function
      id: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
      cdkId: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a',
      isBundled: false,
      property: 'Code',
    },
    {
      // Function
      id: 'FunctionPythonRuntime28CBDA05',
      cdkId: 'FunctionPythonRuntime',
      isBundled: false,
      property: 'Code',
    },
    {
      // Bundled Function
      id: 'BundledFunctionPythonRuntime4D9A0918',
      cdkId: 'BundledFunctionPythonRuntime',
      isBundled: true,
      property: 'Code',
    },
    {
      // NodeJs Function
      id: 'NodejsFunction09C1F20F',
      cdkId: 'NodejsFunction',
      isBundled: true,
      property: 'Code',
    },
    {
      // Go Function
      id: 'GoFunctionCA95FBAA',
      cdkId: 'GoFunction',
      isBundled: true,
      property: 'Code',
    },
    {
      // Docker Image Function
      id: 'DockerImageFunction28B773E6',
      cdkId: 'DockerImageFunction',
      dockerFilePath: 'Dockerfile',
      property: 'Code.ImageUri',
    },
    {
      // Spec Rest Api
      id: 'SpecRestAPI7D4B3A34',
      cdkId: 'SpecRestAPI',
      property: 'BodyS3Location',
    },
  ];

  for (const resource of expectedResources) {
    fixture.output.write(`validate assets metadata for resource ${resource}`);
    expect(resource.id in template.Resources).toBeTruthy();
    expect(template.Resources[resource.id]).toEqual(expect.objectContaining({
      Metadata: {
        'aws:cdk:path': `${fixture.fullStackName('TestStack')}/${resource.cdkId}/Resource`,
        'aws:asset:path': expect.stringMatching(/asset\.[0-9a-zA-Z]{64}/),
        'aws:asset:is-bundled': resource.isBundled,
        'aws:asset:dockerfile-path': resource.dockerFilePath,
        'aws:asset:property': resource.property,
      },
    }));
  }

  // Nested Stack
  fixture.output.write('validate assets metadata for nested stack resource');
  expect('NestedStackNestedStackNestedStackNestedStackResourceB70834FD' in template.Resources).toBeTruthy();
  expect(template.Resources.NestedStackNestedStackNestedStackNestedStackResourceB70834FD).toEqual(expect.objectContaining({
    Metadata: {
      'aws:cdk:path': `${fixture.fullStackName('TestStack')}/NestedStack.NestedStack/NestedStack.NestedStackResource`,
      'aws:asset:path': expect.stringMatching(`${fixture.stackNamePrefix.replace(/-/, '')}TestStackNestedStack[0-9A-Z]{8}\.nested\.template\.json`),
      'aws:asset:property': 'TemplateURL',
    },
  }));
}));

integTest('CDK synth bundled functions as expected', withSamIntegrationFixture(async (fixture) => {
  // Synth first
  await fixture.cdkSynth();

  const template = fixture.template('TestStack');

  const expectedBundledAssets = [
    {
      // Python Layer Version
      id: 'PythonLayerVersion39495CEF',
      files: [
        'python/layer_version_dependency.py',
        'python/geonamescache/__init__.py',
        'python/geonamescache-1.3.0.dist-info',
      ],
    },
    {
      // Layer Version
      id: 'LayerVersion3878DA3A',
      files: [
        'layer_version_dependency.py',
        'requirements.txt',
      ],
    },
    {
      // Bundled layer version
      id: 'BundledLayerVersionPythonRuntime6BADBD6E',
      files: [
        'python/layer_version_dependency.py',
        'python/geonamescache/__init__.py',
        'python/geonamescache-1.3.0.dist-info',
      ],
    },
    {
      // Python Function
      id: 'PythonFunction0BCF77FD',
      files: [
        'app.py',
        'geonamescache/__init__.py',
        'geonamescache-1.3.0.dist-info',
      ],
    },
    {
      // Function
      id: 'FunctionPythonRuntime28CBDA05',
      files: [
        'app.py',
        'requirements.txt',
      ],
    },
    {
      // Bundled Function
      id: 'BundledFunctionPythonRuntime4D9A0918',
      files: [
        'app.py',
        'geonamescache/__init__.py',
        'geonamescache-1.3.0.dist-info',
      ],
    },
    {
      // NodeJs Function
      id: 'NodejsFunction09C1F20F',
      files: [
        'index.js',
      ],
    },
    {
      // Go Function
      id: 'GoFunctionCA95FBAA',
      files: [
        'bootstrap',
      ],
    },
    {
      // Docker Image Function
      id: 'DockerImageFunction28B773E6',
      files: [
        'app.js',
        'Dockerfile',
        'package.json',
      ],
    },
  ];

  for (const resource of expectedBundledAssets) {
    const assetPath = template.Resources[resource.id].Metadata['aws:asset:path'];
    for (const file of resource.files) {
      fixture.output.write(`validate Path ${file} for resource ${resource}`);
      expect(existsSync(path.join(fixture.integTestDir, 'cdk.out', assetPath, file))).toBeTruthy();
    }
  }
}));

integTest('sam can locally test the synthesized cdk application', withSamIntegrationFixture(async (fixture) => {
  // Synth first
  await fixture.cdkSynth();

  const result = await fixture.samLocalStartApi(
    'TestStack', false, randomInteger(30000, 40000), '/restapis/spec/pythonFunction');
  expect(result.actionSucceeded).toBeTruthy();
  expect(result.actionOutput).toEqual(expect.objectContaining({
    message: 'Hello World',
  }));
}));

integTest('skips notice refresh', withDefaultFixture(async (fixture) => {
  const output = await fixture.cdkSynth({
    options: ['--no-notices'],
    modEnv: {
      INTEG_STACK_SET: 'stage-using-context',
    },
    allowErrExit: true,
  });

  // Neither succeeds nor fails, but skips the refresh
  await expect(output).not.toContain('Notices refreshed');
  await expect(output).not.toContain('Notices refresh failed');
}));

/**
 * Create a queue with a fresh name, redeploy orphaning the queue, then import it again
 */
integTest('test resource import', withDefaultFixture(async (fixture) => {
  const outputsFile = path.join(fixture.integTestDir, 'outputs', 'outputs.json');
  await fs.mkdir(path.dirname(outputsFile), { recursive: true });

  // Initial deploy
  await fixture.cdkDeploy('importable-stack', {
    modEnv: { ORPHAN_TOPIC: '1' },
    options: ['--outputs-file', outputsFile],
  });

  const outputs = JSON.parse((await fs.readFile(outputsFile, { encoding: 'utf-8' })).toString());
  const queueName = outputs.QueueName;
  const queueLogicalId = outputs.QueueLogicalId;
  fixture.log(`Setup complete, created queue ${queueName}`);
  try {
    // Deploy again, orphaning the queue
    await fixture.cdkDeploy('importable-stack', {
      modEnv: { OMIT_TOPIC: '1' },
    });

    // Write a resource mapping file based on the ID from step one, then run an import
    const mappingFile = path.join(fixture.integTestDir, 'outputs', 'mapping.json');
    await fs.writeFile(mappingFile, JSON.stringify({ [queueLogicalId]: { QueueName: queueName } }), { encoding: 'utf-8' });

    await fixture.cdk(['import',
      '--resource-mapping', mappingFile,
      fixture.fullStackName('importable-stack')]);
  } finally {
    // Cleanup
    await fixture.cdkDestroy('importable-stack');
  }
}));

integTest('hotswap deployment supports Lambda function\'s description and environment variables', withDefaultFixture(async (fixture) => {
  // GIVEN
  const stackArn = await fixture.cdkDeploy('lambda-hotswap', {
    captureStderr: false,
    modEnv: {
      DYNAMIC_LAMBDA_PROPERTY_VALUE: 'original value',
    },
  });

  // WHEN
  const deployOutput = await fixture.cdkDeploy('lambda-hotswap', {
    options: ['--hotswap'],
    captureStderr: true,
    onlyStderr: true,
    modEnv: {
      DYNAMIC_LAMBDA_PROPERTY_VALUE: 'new value',
    },
  });

  const response = await fixture.aws.cloudFormation('describeStacks', {
    StackName: stackArn,
  });
  const functionName = response.Stacks?.[0].Outputs?.[0].OutputValue;

  // THEN

  // The deployment should not trigger a full deployment, thus the stack's status must remains
  // "CREATE_COMPLETE"
  expect(response.Stacks?.[0].StackStatus).toEqual('CREATE_COMPLETE');
  expect(deployOutput).toContain(`Lambda Function '${functionName}' hotswapped!`);
}));

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
