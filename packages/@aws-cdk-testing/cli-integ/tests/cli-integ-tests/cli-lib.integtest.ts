import { integTest, withCliLibFixture, withCliLibNoStacksFixture } from '../../lib';

jest.setTimeout(2 * 60 * 60_000); // Includes the time to acquire locks, worst-case single-threaded runtime

integTest('cli-lib synth', withCliLibFixture(async (fixture) => {
  await fixture.cdk(['synth', fixture.fullStackName('simple-1')]);
  expect(fixture.template('simple-1')).toEqual(expect.objectContaining({
    // Checking for a small subset is enough as proof that synth worked
    Resources: expect.objectContaining({
      queue276F7297: expect.objectContaining({
        Type: 'AWS::SQS::Queue',
        Properties: {
          VisibilityTimeout: 300,
        },
        Metadata: {
          'aws:cdk:path': `${fixture.stackNamePrefix}-simple-1/queue/Resource`,
        },
      }),
    }),
  }));
}));

integTest('cli-lib list', withCliLibFixture(async (fixture) => {
  const listing = await fixture.cdk(['list'], { captureStderr: false });
  expect(listing).toContain(fixture.fullStackName('simple-1'));
}));

integTest('cli-lib deploy', withCliLibFixture(async (fixture) => {
  const stackName = fixture.fullStackName('simple-1');

  try {
    // deploy the stack
    await fixture.cdk(['deploy', stackName], {
      neverRequireApproval: true,
    });

    // verify the number of resources in the stack
    const expectedStack = await fixture.aws.cloudFormation('describeStackResources', {
      StackName: stackName,
    });
    expect(expectedStack.StackResources?.length).toEqual(3);
  } finally {
    // delete the stack
    await fixture.cdk(['destroy', stackName], {
      captureStderr: false,
    });
  }
}));

integTest('cli-lib deploy no stack', withCliLibNoStacksFixture(async (fixture) => {
  const stackName = fixture.fullStackName('no-stack-1');

  try {
    // deploy the stack
    await fixture.cdk(['deploy', stackName], {
      options: ['--ignore-no-stacks'],
    });

    // verify the number of resources in the stack
    const expectedStack = await fixture.aws.cloudFormation('describeStackResources', {
      StackName: stackName,
    });
    expect(expectedStack.StackResources?.length).toEqual(0);
  } finally {
    // delete the stack
    await fixture.cdk(['destroy', stackName], {
      captureStderr: false,
    });
  }
}));

integTest('security related changes without a CLI are expected to fail when approval is required', withCliLibFixture(async (fixture) => {
  const stdErr = await fixture.cdk(['deploy', fixture.fullStackName('simple-1')], {
    onlyStderr: true,
    captureStderr: true,
    allowErrExit: true,
    neverRequireApproval: false,
  });

  expect(stdErr).toContain('This deployment will make potentially sensitive changes according to your current security approval level');
  expect(stdErr).toContain('Deployment failed: Error: \"--require-approval\" is enabled and stack includes security-sensitive updates');

  // Ensure stack was not deployed
  await expect(fixture.aws.cloudFormation('describeStacks', {
    StackName: fixture.fullStackName('simple-1'),
  })).rejects.toThrow('does not exist');
}));
