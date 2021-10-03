"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os = require("os");
const path = require("path");
const aws_1 = require("../helpers/aws");
const cdk_1 = require("../helpers/cdk");
const test_helpers_1 = require("../helpers/test-helpers");
jest.setTimeout(600 * 1000);
test_helpers_1.integTest('VPC Lookup', cdk_1.withDefaultFixture(async (fixture) => {
    fixture.log('Making sure we are clean before starting.');
    await fixture.cdkDestroy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' } });
    fixture.log('Setting up: creating a VPC with known tags');
    await fixture.cdkDeploy('define-vpc', { modEnv: { ENABLE_VPC_TESTING: 'DEFINE' } });
    fixture.log('Setup complete!');
    fixture.log('Verifying we can now import that VPC');
    await fixture.cdkDeploy('import-vpc', { modEnv: { ENABLE_VPC_TESTING: 'IMPORT' } });
}));
test_helpers_1.integTest('Two ways of shoing the version', cdk_1.withDefaultFixture(async (fixture) => {
    const version1 = await fixture.cdk(['version'], { verbose: false });
    const version2 = await fixture.cdk(['--version'], { verbose: false });
    expect(version1).toEqual(version2);
}));
test_helpers_1.integTest('Termination protection', cdk_1.withDefaultFixture(async (fixture) => {
    const stackName = 'termination-protection';
    await fixture.cdkDeploy(stackName);
    // Try a destroy that should fail
    await expect(fixture.cdkDestroy(stackName)).rejects.toThrow('exited with error');
    // Can update termination protection even though the change set doesn't contain changes
    await fixture.cdkDeploy(stackName, { modEnv: { TERMINATION_PROTECTION: 'FALSE' } });
    await fixture.cdkDestroy(stackName);
}));
test_helpers_1.integTest('cdk synth', cdk_1.withDefaultFixture(async (fixture) => {
    await fixture.cdk(['synth', fixture.fullStackName('test-1')]);
    const template1 = await readTemplate(fixture, 'test-1');
    expect(template1).toEqual({
        Resources: {
            topic69831491: {
                Type: 'AWS::SNS::Topic',
                Metadata: {
                    'aws:cdk:path': `${fixture.stackNamePrefix}-test-1/topic/Resource`,
                },
            },
        },
    });
    await fixture.cdk(['synth', fixture.fullStackName('test-2')], { verbose: false });
    const template2 = await readTemplate(fixture, 'test-2');
    expect(template2).toEqual({
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
    });
}));
test_helpers_1.integTest('ssm parameter provider error', cdk_1.withDefaultFixture(async (fixture) => {
    await expect(fixture.cdk(['synth',
        fixture.fullStackName('missing-ssm-parameter'),
        '-c', 'test:ssm-parameter-name=/does/not/exist'], {
        allowErrExit: true,
    })).resolves.toContain('SSM parameter not available in account');
}));
test_helpers_1.integTest('automatic ordering', cdk_1.withDefaultFixture(async (fixture) => {
    // Deploy the consuming stack which will include the producing stack
    await fixture.cdkDeploy('order-consuming');
    // Destroy the providing stack which will include the consuming stack
    await fixture.cdkDestroy('order-providing');
}));
test_helpers_1.integTest('context setting', cdk_1.withDefaultFixture(async (fixture) => {
    await fs_1.promises.writeFile(path.join(fixture.integTestDir, 'cdk.context.json'), JSON.stringify({
        contextkey: 'this is the context value',
    }));
    try {
        await expect(fixture.cdk(['context'])).resolves.toContain('this is the context value');
        // Test that deleting the contextkey works
        await fixture.cdk(['context', '--reset', 'contextkey']);
        await expect(fixture.cdk(['context'])).resolves.not.toContain('this is the context value');
        // Test that forced delete of the context key does not throw
        await fixture.cdk(['context', '-f', '--reset', 'contextkey']);
    }
    finally {
        await fs_1.promises.unlink(path.join(fixture.integTestDir, 'cdk.context.json'));
    }
}));
test_helpers_1.integTest('context in stage propagates to top', cdk_1.withDefaultFixture(async (fixture) => {
    await expect(fixture.cdkSynth({
        // This will make it error to prove that the context bubbles up, and also that we can fail on command
        options: ['--no-lookups'],
        modEnv: {
            INTEG_STACK_SET: 'stage-using-context',
        },
        allowErrExit: true,
    })).resolves.toContain('Context lookups have been disabled');
}));
test_helpers_1.integTest('deploy', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
    const stackArn = await fixture.cdkDeploy('test-2', { captureStderr: false });
    // verify the number of resources in the stack
    const response = await fixture.aws.cloudFormation('describeStackResources', {
        StackName: stackArn,
    });
    expect((_a = response.StackResources) === null || _a === void 0 ? void 0 : _a.length).toEqual(2);
}));
test_helpers_1.integTest('deploy all', cdk_1.withDefaultFixture(async (fixture) => {
    const arns = await fixture.cdkDeploy('test-*', { captureStderr: false });
    // verify that we only deployed a single stack (there's a single ARN in the output)
    expect(arns.split('\n').length).toEqual(2);
}));
test_helpers_1.integTest('nested stack with parameters', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.StackResources) === null || _a === void 0 ? void 0 : _a.length).toEqual(1);
}));
test_helpers_1.integTest('deploy without execute a named change set', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
    //verify a change set was created with the provided name
    const changeSetResponse = await fixture.aws.cloudFormation('listChangeSets', {
        StackName: stackArn,
    });
    const changeSets = changeSetResponse.Summaries || [];
    expect(changeSets.length).toEqual(1);
    expect(changeSets[0].ChangeSetName).toEqual(changeSetName);
    expect(changeSets[0].Status).toEqual('CREATE_COMPLETE');
}));
test_helpers_1.integTest('security related changes without a CLI are expected to fail', cdk_1.withDefaultFixture(async (fixture) => {
    // redirect /dev/null to stdin, which means there will not be tty attached
    // since this stack includes security-related changes, the deployment should
    // immediately fail because we can't confirm the changes
    const stackName = 'iam-test';
    await expect(fixture.cdkDeploy(stackName, {
        options: ['<', '/dev/null'],
        neverRequireApproval: false,
    })).rejects.toThrow('exited with error');
    // Ensure stack was not deployed
    await expect(fixture.aws.cloudFormation('describeStacks', {
        StackName: fixture.fullStackName(stackName),
    })).rejects.toThrow('does not exist');
}));
test_helpers_1.integTest('deploy wildcard with outputs', cdk_1.withDefaultFixture(async (fixture) => {
    const outputsFile = path.join(fixture.integTestDir, 'outputs', 'outputs.json');
    await fs_1.promises.mkdir(path.dirname(outputsFile), { recursive: true });
    await fixture.cdkDeploy(['outputs-test-*'], {
        options: ['--outputs-file', outputsFile],
    });
    const outputs = JSON.parse((await fs_1.promises.readFile(outputsFile, { encoding: 'utf-8' })).toString());
    expect(outputs).toEqual({
        [`${fixture.stackNamePrefix}-outputs-test-1`]: {
            TopicName: `${fixture.stackNamePrefix}-outputs-test-1MyTopic`,
        },
        [`${fixture.stackNamePrefix}-outputs-test-2`]: {
            TopicName: `${fixture.stackNamePrefix}-outputs-test-2MyOtherTopic`,
        },
    });
}));
test_helpers_1.integTest('deploy with parameters', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
    const stackArn = await fixture.cdkDeploy('param-test-1', {
        options: [
            '--parameters', `TopicNameParam=${fixture.stackNamePrefix}bazinga`,
        ],
        captureStderr: false,
    });
    const response = await fixture.aws.cloudFormation('describeStacks', {
        StackName: stackArn,
    });
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Parameters).toEqual([
        {
            ParameterKey: 'TopicNameParam',
            ParameterValue: `${fixture.stackNamePrefix}bazinga`,
        },
    ]);
}));
test_helpers_1.integTest('update to stack in ROLLBACK_COMPLETE state will delete stack and create a new one', cdk_1.withDefaultFixture(async (fixture) => {
    var _a, _b, _c, _d;
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
    const stackArn = (_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].StackId;
    expect((_b = response.Stacks) === null || _b === void 0 ? void 0 : _b[0].StackStatus).toEqual('ROLLBACK_COMPLETE');
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
    expect((_c = newStackResponse.Stacks) === null || _c === void 0 ? void 0 : _c[0].StackStatus).toEqual('CREATE_COMPLETE');
    expect((_d = newStackResponse.Stacks) === null || _d === void 0 ? void 0 : _d[0].Parameters).toEqual([
        {
            ParameterKey: 'TopicNameParam',
            ParameterValue: `${fixture.stackNamePrefix}allgood`,
        },
    ]);
}));
test_helpers_1.integTest('stack in UPDATE_ROLLBACK_COMPLETE state can be updated', cdk_1.withDefaultFixture(async (fixture) => {
    var _a, _b, _c, _d;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].StackStatus).toEqual('CREATE_COMPLETE');
    // bad parameter name with @ will put stack into UPDATE_ROLLBACK_COMPLETE
    await expect(fixture.cdkDeploy('param-test-1', {
        options: [
            '--parameters', `TopicNameParam=${fixture.stackNamePrefix}@aww`,
        ],
        captureStderr: false,
    })).rejects.toThrow('exited with error');
    ;
    response = await fixture.aws.cloudFormation('describeStacks', {
        StackName: stackArn,
    });
    expect((_b = response.Stacks) === null || _b === void 0 ? void 0 : _b[0].StackStatus).toEqual('UPDATE_ROLLBACK_COMPLETE');
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
    expect((_c = response.Stacks) === null || _c === void 0 ? void 0 : _c[0].StackStatus).toEqual('UPDATE_COMPLETE');
    expect((_d = response.Stacks) === null || _d === void 0 ? void 0 : _d[0].Parameters).toEqual([
        {
            ParameterKey: 'TopicNameParam',
            ParameterValue: `${fixture.stackNamePrefix}allgood`,
        },
    ]);
}));
test_helpers_1.integTest('deploy with wildcard and parameters', cdk_1.withDefaultFixture(async (fixture) => {
    await fixture.cdkDeploy('param-test-*', {
        options: [
            '--parameters', `${fixture.stackNamePrefix}-param-test-1:TopicNameParam=${fixture.stackNamePrefix}bazinga`,
            '--parameters', `${fixture.stackNamePrefix}-param-test-2:OtherTopicNameParam=${fixture.stackNamePrefix}ThatsMySpot`,
            '--parameters', `${fixture.stackNamePrefix}-param-test-3:DisplayNameParam=${fixture.stackNamePrefix}HeyThere`,
            '--parameters', `${fixture.stackNamePrefix}-param-test-3:OtherDisplayNameParam=${fixture.stackNamePrefix}AnotherOne`,
        ],
    });
}));
test_helpers_1.integTest('deploy with parameters multi', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Parameters).toEqual([
        {
            ParameterKey: 'DisplayNameParam',
            ParameterValue: paramVal1,
        },
        {
            ParameterKey: 'OtherDisplayNameParam',
            ParameterValue: paramVal2,
        },
    ]);
}));
test_helpers_1.integTest('deploy with notification ARN', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
    const topicName = `${fixture.stackNamePrefix}-test-topic`;
    const response = await fixture.aws.sns('createTopic', { Name: topicName });
    const topicArn = response.TopicArn;
    try {
        await fixture.cdkDeploy('test-2', {
            options: ['--notification-arns', topicArn],
        });
        // verify that the stack we deployed has our notification ARN
        const describeResponse = await fixture.aws.cloudFormation('describeStacks', {
            StackName: fixture.fullStackName('test-2'),
        });
        expect((_a = describeResponse.Stacks) === null || _a === void 0 ? void 0 : _a[0].NotificationARNs).toEqual([topicArn]);
    }
    finally {
        await fixture.aws.sns('deleteTopic', {
            TopicArn: topicArn,
        });
    }
}));
test_helpers_1.integTest('deploy with role', cdk_1.withDefaultFixture(async (fixture) => {
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
        await aws_1.retry(fixture.output, 'Trying to assume fresh role', aws_1.retry.forSeconds(300), async () => {
            await fixture.aws.sts('assumeRole', {
                RoleArn: roleArn,
                RoleSessionName: 'testing',
            });
        });
        // In principle, the role has replicated from 'us-east-1' to wherever we're testing.
        // Give it a little more sleep to make sure CloudFormation is not hitting a box
        // that doesn't have it yet.
        await aws_1.sleep(5000);
        await fixture.cdkDeploy('test-2', {
            options: ['--role-arn', roleArn],
        });
        // Immediately delete the stack again before we delete the role.
        //
        // Since roles are sticky, if we delete the role before the stack, subsequent DeleteStack
        // operations will fail when CloudFormation tries to assume the role that's already gone.
        await fixture.cdkDestroy('test-2');
    }
    finally {
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
        }
        catch (e) {
            if (e.message.indexOf('cannot be found') > -1) {
                return;
            }
            throw e;
        }
    }
}));
test_helpers_1.integTest('cdk diff', cdk_1.withDefaultFixture(async (fixture) => {
    const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
    expect(diff1).toContain('AWS::SNS::Topic');
    const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
    expect(diff2).toContain('AWS::SNS::Topic');
    // We can make it fail by passing --fail
    await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1')]))
        .rejects.toThrow('exited with error');
}));
test_helpers_1.integTest('cdk diff --fail on multiple stacks exits with error if any of the stacks contains a diff', cdk_1.withDefaultFixture(async (fixture) => {
    // GIVEN
    const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
    expect(diff1).toContain('AWS::SNS::Topic');
    await fixture.cdkDeploy('test-2');
    const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
    expect(diff2).toContain('There were no differences');
    // WHEN / THEN
    await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1'), fixture.fullStackName('test-2')])).rejects.toThrow('exited with error');
}));
test_helpers_1.integTest('cdk diff --fail with multiple stack exits with if any of the stacks contains a diff', cdk_1.withDefaultFixture(async (fixture) => {
    // GIVEN
    await fixture.cdkDeploy('test-1');
    const diff1 = await fixture.cdk(['diff', fixture.fullStackName('test-1')]);
    expect(diff1).toContain('There were no differences');
    const diff2 = await fixture.cdk(['diff', fixture.fullStackName('test-2')]);
    expect(diff2).toContain('AWS::SNS::Topic');
    // WHEN / THEN
    await expect(fixture.cdk(['diff', '--fail', fixture.fullStackName('test-1'), fixture.fullStackName('test-2')])).rejects.toThrow('exited with error');
}));
test_helpers_1.integTest('cdk diff --security-only --fail exits when security changes are present', cdk_1.withDefaultFixture(async (fixture) => {
    const stackName = 'iam-test';
    await expect(fixture.cdk(['diff', '--security-only', '--fail', fixture.fullStackName(stackName)])).rejects.toThrow('exited with error');
}));
test_helpers_1.integTest('deploy stack with docker asset', cdk_1.withDefaultFixture(async (fixture) => {
    await fixture.cdkDeploy('docker');
}));
test_helpers_1.integTest('deploy and test stack with lambda asset', cdk_1.withDefaultFixture(async (fixture) => {
    var _a, _b;
    const stackArn = await fixture.cdkDeploy('lambda', { captureStderr: false });
    const response = await fixture.aws.cloudFormation('describeStacks', {
        StackName: stackArn,
    });
    const lambdaArn = (_b = (_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Outputs) === null || _b === void 0 ? void 0 : _b[0].OutputValue;
    if (lambdaArn === undefined) {
        throw new Error('Stack did not have expected Lambda ARN output');
    }
    const output = await fixture.aws.lambda('invoke', {
        FunctionName: lambdaArn,
    });
    expect(JSON.stringify(output.Payload)).toContain('dear asset');
}));
test_helpers_1.integTest('cdk ls', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('synthing a stage with errors leads to failure', cdk_1.withDefaultFixture(async (fixture) => {
    const output = await fixture.cdk(['synth'], {
        allowErrExit: true,
        modEnv: {
            INTEG_STACK_SET: 'stage-with-errors',
        },
    });
    expect(output).toContain('This is an error');
}));
test_helpers_1.integTest('synthing a stage with errors can be suppressed', cdk_1.withDefaultFixture(async (fixture) => {
    await fixture.cdk(['synth', '--no-validation'], {
        modEnv: {
            INTEG_STACK_SET: 'stage-with-errors',
        },
    });
}));
test_helpers_1.integTest('deploy stack without resource', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('IAM diff', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('fast deploy', cdk_1.withDefaultFixture(async (fixture) => {
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
        var _a, _b, _c;
        const response = await fixture.aws.cloudFormation('describeStacks', { StackName: stackArn });
        if (!((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0])) {
            throw new Error('Did not get a ChangeSet at all');
        }
        fixture.log(`Found Change Set ${(_b = response.Stacks) === null || _b === void 0 ? void 0 : _b[0].ChangeSetId}`);
        return (_c = response.Stacks) === null || _c === void 0 ? void 0 : _c[0];
    }
}));
test_helpers_1.integTest('failed deploy does not hang', cdk_1.withDefaultFixture(async (fixture) => {
    // this will hang if we introduce https://github.com/aws/aws-cdk/issues/6403 again.
    await expect(fixture.cdkDeploy('failed')).rejects.toThrow('exited with error');
}));
test_helpers_1.integTest('can still load old assemblies', cdk_1.withDefaultFixture(async (fixture) => {
    const cxAsmDir = path.join(os.tmpdir(), 'cdk-integ-cx');
    const testAssembliesDirectory = path.join(__dirname, 'cloud-assemblies');
    for (const asmdir of await listChildDirs(testAssembliesDirectory)) {
        fixture.log(`ASSEMBLY ${asmdir}`);
        await cdk_1.cloneDirectory(asmdir, cxAsmDir);
        // Some files in the asm directory that have a .js extension are
        // actually treated as templates. Evaluate them using NodeJS.
        const templates = await listChildren(cxAsmDir, fullPath => Promise.resolve(fullPath.endsWith('.js')));
        for (const template of templates) {
            const targetName = template.replace(/.js$/, '');
            await cdk_1.shell([process.execPath, template, '>', targetName], {
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
test_helpers_1.integTest('generating and loading assembly', cdk_1.withDefaultFixture(async (fixture) => {
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
    await fs_1.promises.rename(customDockerFile, `${customDockerFile}~`);
    try {
        // deploy a docker image with custom file without synth (uses assets)
        await fixture.cdkDeploy('docker-with-custom-file', { options: ['-a', '.'], cwd: asmOutputDir });
    }
    finally {
        // Rename back to restore fixture to original state
        await fs_1.promises.rename(`${customDockerFile}~`, customDockerFile);
    }
}));
test_helpers_1.integTest('templates on disk contain metadata resource, also in nested assemblies', cdk_1.withDefaultFixture(async (fixture) => {
    // Synth first, and switch on version reporting because cdk.json is disabling it
    await fixture.cdk(['synth', '--version-reporting=true']);
    // Load template from disk from root assembly
    const templateContents = await fixture.shell(['cat', 'cdk.out/*-lambda.template.json']);
    expect(JSON.parse(templateContents).Resources.CDKMetadata).toBeTruthy();
    // Load template from nested assembly
    const nestedTemplateContents = await fixture.shell(['cat', 'cdk.out/assembly-*-stage/*-stage-StackInStage.template.json']);
    expect(JSON.parse(nestedTemplateContents).Resources.CDKMetadata).toBeTruthy();
}));
async function listChildren(parent, pred) {
    const ret = new Array();
    for (const child of await fs_1.promises.readdir(parent, { encoding: 'utf-8' })) {
        const fullPath = path.join(parent, child.toString());
        if (await pred(fullPath)) {
            ret.push(fullPath);
        }
    }
    return ret;
}
async function listChildDirs(parent) {
    return listChildren(parent, async (fullPath) => (await fs_1.promises.stat(fullPath)).isDirectory());
}
async function readTemplate(fixture, stackName) {
    const fullStackName = fixture.fullStackName(stackName);
    const templatePath = path.join(fixture.integTestDir, 'cdk.out', `${fullStackName}.template.json`);
    return JSON.parse((await fs_1.promises.readFile(templatePath, { encoding: 'utf-8' })).toString());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmludGVndGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaS5pbnRlZ3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBb0M7QUFDcEMseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix3Q0FBOEM7QUFDOUMsd0NBQXdGO0FBQ3hGLDBEQUFvRDtBQUVwRCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQztBQUU1Qix3QkFBUyxDQUFDLFlBQVksRUFBRSx3QkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ3pELE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFckYsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQzFELE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRS9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUNwRCxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3RGLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFSix3QkFBUyxDQUFDLGdDQUFnQyxFQUFFLHdCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUMvRSxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFH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YUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsR0FBRyxhQUFhLGdCQUFnQixDQUFDLENBQUM7SUFDbEcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxhQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgcmV0cnksIHNsZWVwIH0gZnJvbSAnLi4vaGVscGVycy9hd3MnO1xuaW1wb3J0IHsgY2xvbmVEaXJlY3RvcnksIHNoZWxsLCB3aXRoRGVmYXVsdEZpeHR1cmUsIFRlc3RGaXh0dXJlIH0gZnJvbSAnLi4vaGVscGVycy9jZGsnO1xuaW1wb3J0IHsgaW50ZWdUZXN0IH0gZnJvbSAnLi4vaGVscGVycy90ZXN0LWhlbHBlcnMnO1xuXG5qZXN0LnNldFRpbWVvdXQoNjAwICogMTAwMCk7XG5cbmludGVnVGVzdCgnVlBDIExvb2t1cCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBmaXh0dXJlLmxvZygnTWFraW5nIHN1cmUgd2UgYXJlIGNsZWFuIGJlZm9yZSBzdGFydGluZy4nKTtcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXN0cm95KCdkZWZpbmUtdnBjJywgeyBtb2RFbnY6IHsgRU5BQkxFX1ZQQ19URVNUSU5HOiAnREVGSU5FJyB9IH0pO1xuXG4gIGZpeHR1cmUubG9nKCdTZXR0aW5nIHVwOiBjcmVhdGluZyBhIFZQQyB3aXRoIGtub3duIHRhZ3MnKTtcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ2RlZmluZS12cGMnLCB7IG1vZEVudjogeyBFTkFCTEVfVlBDX1RFU1RJTkc6ICdERUZJTkUnIH0gfSk7XG4gIGZpeHR1cmUubG9nKCdTZXR1cCBjb21wbGV0ZSEnKTtcblxuICBmaXh0dXJlLmxvZygnVmVyaWZ5aW5nIHdlIGNhbiBub3cgaW1wb3J0IHRoYXQgVlBDJyk7XG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdpbXBvcnQtdnBjJywgeyBtb2RFbnY6IHsgRU5BQkxFX1ZQQ19URVNUSU5HOiAnSU1QT1JUJyB9IH0pO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ1R3byB3YXlzIG9mIHNob2luZyB0aGUgdmVyc2lvbicsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCB2ZXJzaW9uMSA9IGF3YWl0IGZpeHR1cmUuY2RrKFsndmVyc2lvbiddLCB7IHZlcmJvc2U6IGZhbHNlIH0pO1xuICBjb25zdCB2ZXJzaW9uMiA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnLS12ZXJzaW9uJ10sIHsgdmVyYm9zZTogZmFsc2UgfSk7XG5cbiAgZXhwZWN0KHZlcnNpb24xKS50b0VxdWFsKHZlcnNpb24yKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdUZXJtaW5hdGlvbiBwcm90ZWN0aW9uJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IHN0YWNrTmFtZSA9ICd0ZXJtaW5hdGlvbi1wcm90ZWN0aW9uJztcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koc3RhY2tOYW1lKTtcblxuICAvLyBUcnkgYSBkZXN0cm95IHRoYXQgc2hvdWxkIGZhaWxcbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuY2RrRGVzdHJveShzdGFja05hbWUpKS5yZWplY3RzLnRvVGhyb3coJ2V4aXRlZCB3aXRoIGVycm9yJyk7XG5cbiAgLy8gQ2FuIHVwZGF0ZSB0ZXJtaW5hdGlvbiBwcm90ZWN0aW9uIGV2ZW4gdGhvdWdoIHRoZSBjaGFuZ2Ugc2V0IGRvZXNuJ3QgY29udGFpbiBjaGFuZ2VzXG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KHN0YWNrTmFtZSwgeyBtb2RFbnY6IHsgVEVSTUlOQVRJT05fUFJPVEVDVElPTjogJ0ZBTFNFJyB9IH0pO1xuICBhd2FpdCBmaXh0dXJlLmNka0Rlc3Ryb3koc3RhY2tOYW1lKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdjZGsgc3ludGgnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgYXdhaXQgZml4dHVyZS5jZGsoWydzeW50aCcsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0xJyldKTtcbiAgY29uc3QgdGVtcGxhdGUxID0gYXdhaXQgcmVhZFRlbXBsYXRlKGZpeHR1cmUsICd0ZXN0LTEnKTtcbiAgZXhwZWN0KHRlbXBsYXRlMSkudG9FcXVhbCh7XG4gICAgUmVzb3VyY2VzOiB7XG4gICAgICB0b3BpYzY5ODMxNDkxOiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgICdhd3M6Y2RrOnBhdGgnOiBgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH0tdGVzdC0xL3RvcGljL1Jlc291cmNlYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGsoWydzeW50aCcsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0yJyldLCB7IHZlcmJvc2U6IGZhbHNlIH0pO1xuICBjb25zdCB0ZW1wbGF0ZTIgPSBhd2FpdCByZWFkVGVtcGxhdGUoZml4dHVyZSwgJ3Rlc3QtMicpO1xuICBleHBlY3QodGVtcGxhdGUyKS50b0VxdWFsKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIHRvcGljMTUyRDg0QTM3OiB7XG4gICAgICAgIFR5cGU6ICdBV1M6OlNOUzo6VG9waWMnLFxuICAgICAgICBNZXRhZGF0YToge1xuICAgICAgICAgICdhd3M6Y2RrOnBhdGgnOiBgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH0tdGVzdC0yL3RvcGljMS9SZXNvdXJjZWAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdG9waWMyQTRGQjU0N0Y6IHtcbiAgICAgICAgVHlwZTogJ0FXUzo6U05TOjpUb3BpYycsXG4gICAgICAgIE1ldGFkYXRhOiB7XG4gICAgICAgICAgJ2F3czpjZGs6cGF0aCc6IGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS10ZXN0LTIvdG9waWMyL1Jlc291cmNlYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbn0pKTtcblxuaW50ZWdUZXN0KCdzc20gcGFyYW1ldGVyIHByb3ZpZGVyIGVycm9yJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNkayhbJ3N5bnRoJyxcbiAgICBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ21pc3Npbmctc3NtLXBhcmFtZXRlcicpLFxuICAgICctYycsICd0ZXN0OnNzbS1wYXJhbWV0ZXItbmFtZT0vZG9lcy9ub3QvZXhpc3QnXSwge1xuICAgIGFsbG93RXJyRXhpdDogdHJ1ZSxcbiAgfSkpLnJlc29sdmVzLnRvQ29udGFpbignU1NNIHBhcmFtZXRlciBub3QgYXZhaWxhYmxlIGluIGFjY291bnQnKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdhdXRvbWF0aWMgb3JkZXJpbmcnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gRGVwbG95IHRoZSBjb25zdW1pbmcgc3RhY2sgd2hpY2ggd2lsbCBpbmNsdWRlIHRoZSBwcm9kdWNpbmcgc3RhY2tcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ29yZGVyLWNvbnN1bWluZycpO1xuXG4gIC8vIERlc3Ryb3kgdGhlIHByb3ZpZGluZyBzdGFjayB3aGljaCB3aWxsIGluY2x1ZGUgdGhlIGNvbnN1bWluZyBzdGFja1xuICBhd2FpdCBmaXh0dXJlLmNka0Rlc3Ryb3koJ29yZGVyLXByb3ZpZGluZycpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2NvbnRleHQgc2V0dGluZycsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBhd2FpdCBmcy53cml0ZUZpbGUocGF0aC5qb2luKGZpeHR1cmUuaW50ZWdUZXN0RGlyLCAnY2RrLmNvbnRleHQuanNvbicpLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgY29udGV4dGtleTogJ3RoaXMgaXMgdGhlIGNvbnRleHQgdmFsdWUnLFxuICB9KSk7XG4gIHRyeSB7XG4gICAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuY2RrKFsnY29udGV4dCddKSkucmVzb2x2ZXMudG9Db250YWluKCd0aGlzIGlzIHRoZSBjb250ZXh0IHZhbHVlJyk7XG5cbiAgICAvLyBUZXN0IHRoYXQgZGVsZXRpbmcgdGhlIGNvbnRleHRrZXkgd29ya3NcbiAgICBhd2FpdCBmaXh0dXJlLmNkayhbJ2NvbnRleHQnLCAnLS1yZXNldCcsICdjb250ZXh0a2V5J10pO1xuICAgIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNkayhbJ2NvbnRleHQnXSkpLnJlc29sdmVzLm5vdC50b0NvbnRhaW4oJ3RoaXMgaXMgdGhlIGNvbnRleHQgdmFsdWUnKTtcblxuICAgIC8vIFRlc3QgdGhhdCBmb3JjZWQgZGVsZXRlIG9mIHRoZSBjb250ZXh0IGtleSBkb2VzIG5vdCB0aHJvd1xuICAgIGF3YWl0IGZpeHR1cmUuY2RrKFsnY29udGV4dCcsICctZicsICctLXJlc2V0JywgJ2NvbnRleHRrZXknXSk7XG5cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBmcy51bmxpbmsocGF0aC5qb2luKGZpeHR1cmUuaW50ZWdUZXN0RGlyLCAnY2RrLmNvbnRleHQuanNvbicpKTtcbiAgfVxufSkpO1xuXG5pbnRlZ1Rlc3QoJ2NvbnRleHQgaW4gc3RhZ2UgcHJvcGFnYXRlcyB0byB0b3AnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuY2RrU3ludGgoe1xuICAgIC8vIFRoaXMgd2lsbCBtYWtlIGl0IGVycm9yIHRvIHByb3ZlIHRoYXQgdGhlIGNvbnRleHQgYnViYmxlcyB1cCwgYW5kIGFsc28gdGhhdCB3ZSBjYW4gZmFpbCBvbiBjb21tYW5kXG4gICAgb3B0aW9uczogWyctLW5vLWxvb2t1cHMnXSxcbiAgICBtb2RFbnY6IHtcbiAgICAgIElOVEVHX1NUQUNLX1NFVDogJ3N0YWdlLXVzaW5nLWNvbnRleHQnLFxuICAgIH0sXG4gICAgYWxsb3dFcnJFeGl0OiB0cnVlLFxuICB9KSkucmVzb2x2ZXMudG9Db250YWluKCdDb250ZXh0IGxvb2t1cHMgaGF2ZSBiZWVuIGRpc2FibGVkJyk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95Jywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IHN0YWNrQXJuID0gYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3Rlc3QtMicsIHsgY2FwdHVyZVN0ZGVycjogZmFsc2UgfSk7XG5cbiAgLy8gdmVyaWZ5IHRoZSBudW1iZXIgb2YgcmVzb3VyY2VzIGluIHRoZSBzdGFja1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrUmVzb3VyY2VzJywge1xuICAgIFN0YWNrTmFtZTogc3RhY2tBcm4sXG4gIH0pO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tSZXNvdXJjZXM/Lmxlbmd0aCkudG9FcXVhbCgyKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdkZXBsb3kgYWxsJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGFybnMgPSBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgndGVzdC0qJywgeyBjYXB0dXJlU3RkZXJyOiBmYWxzZSB9KTtcblxuICAvLyB2ZXJpZnkgdGhhdCB3ZSBvbmx5IGRlcGxveWVkIGEgc2luZ2xlIHN0YWNrICh0aGVyZSdzIGEgc2luZ2xlIEFSTiBpbiB0aGUgb3V0cHV0KVxuICBleHBlY3QoYXJucy5zcGxpdCgnXFxuJykubGVuZ3RoKS50b0VxdWFsKDIpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ25lc3RlZCBzdGFjayB3aXRoIHBhcmFtZXRlcnMnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gU1RBQ0tfTkFNRV9QUkVGSVggaXMgdXNlZCBpbiBNeVRvcGljUGFyYW0gdG8gYWxsb3cgbXVsdGlwbGUgaW5zdGFuY2VzXG4gIC8vIG9mIHRoaXMgdGVzdCB0byBydW4gaW4gcGFyYWxsZWwsIG90aGV3aXNlIHRoZXkgd2lsbCBhdHRlbXB0IHRvIGNyZWF0ZSB0aGUgc2FtZSBTTlMgdG9waWMuXG4gIGNvbnN0IHN0YWNrQXJuID0gYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3dpdGgtbmVzdGVkLXN0YWNrLXVzaW5nLXBhcmFtZXRlcnMnLCB7XG4gICAgb3B0aW9uczogWyctLXBhcmFtZXRlcnMnLCBgTXlUb3BpY1BhcmFtPSR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9VGhlcmVJc05vU3Bvb25gXSxcbiAgICBjYXB0dXJlU3RkZXJyOiBmYWxzZSxcbiAgfSk7XG5cbiAgLy8gdmVyaWZ5IHRoYXQgd2Ugb25seSBkZXBsb3llZCBhIHNpbmdsZSBzdGFjayAodGhlcmUncyBhIHNpbmdsZSBBUk4gaW4gdGhlIG91dHB1dClcbiAgZXhwZWN0KHN0YWNrQXJuLnNwbGl0KCdcXG4nKS5sZW5ndGgpLnRvRXF1YWwoMSk7XG5cbiAgLy8gdmVyaWZ5IHRoZSBudW1iZXIgb2YgcmVzb3VyY2VzIGluIHRoZSBzdGFja1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrUmVzb3VyY2VzJywge1xuICAgIFN0YWNrTmFtZTogc3RhY2tBcm4sXG4gIH0pO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tSZXNvdXJjZXM/Lmxlbmd0aCkudG9FcXVhbCgxKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdkZXBsb3kgd2l0aG91dCBleGVjdXRlIGEgbmFtZWQgY2hhbmdlIHNldCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBjaGFuZ2VTZXROYW1lID0gJ2N1c3RvbS1jaGFuZ2Utc2V0LW5hbWUnO1xuICBjb25zdCBzdGFja0FybiA9IGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCd0ZXN0LTInLCB7XG4gICAgb3B0aW9uczogWyctLW5vLWV4ZWN1dGUnLCAnLS1jaGFuZ2Utc2V0LW5hbWUnLCBjaGFuZ2VTZXROYW1lXSxcbiAgICBjYXB0dXJlU3RkZXJyOiBmYWxzZSxcbiAgfSk7XG4gIC8vIHZlcmlmeSB0aGF0IHdlIG9ubHkgZGVwbG95ZWQgYSBzaW5nbGUgc3RhY2sgKHRoZXJlJ3MgYSBzaW5nbGUgQVJOIGluIHRoZSBvdXRwdXQpXG4gIGV4cGVjdChzdGFja0Fybi5zcGxpdCgnXFxuJykubGVuZ3RoKS50b0VxdWFsKDEpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZml4dHVyZS5hd3MuY2xvdWRGb3JtYXRpb24oJ2Rlc2NyaWJlU3RhY2tzJywge1xuICAgIFN0YWNrTmFtZTogc3RhY2tBcm4sXG4gIH0pO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uU3RhY2tTdGF0dXMpLnRvRXF1YWwoJ1JFVklFV19JTl9QUk9HUkVTUycpO1xuXG4gIC8vdmVyaWZ5IGEgY2hhbmdlIHNldCB3YXMgY3JlYXRlZCB3aXRoIHRoZSBwcm92aWRlZCBuYW1lXG4gIGNvbnN0IGNoYW5nZVNldFJlc3BvbnNlID0gYXdhaXQgZml4dHVyZS5hd3MuY2xvdWRGb3JtYXRpb24oJ2xpc3RDaGFuZ2VTZXRzJywge1xuICAgIFN0YWNrTmFtZTogc3RhY2tBcm4sXG4gIH0pO1xuICBjb25zdCBjaGFuZ2VTZXRzID0gY2hhbmdlU2V0UmVzcG9uc2UuU3VtbWFyaWVzIHx8IFtdO1xuICBleHBlY3QoY2hhbmdlU2V0cy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gIGV4cGVjdChjaGFuZ2VTZXRzWzBdLkNoYW5nZVNldE5hbWUpLnRvRXF1YWwoY2hhbmdlU2V0TmFtZSk7XG4gIGV4cGVjdChjaGFuZ2VTZXRzWzBdLlN0YXR1cykudG9FcXVhbCgnQ1JFQVRFX0NPTVBMRVRFJyk7XG59KSk7XG5cbmludGVnVGVzdCgnc2VjdXJpdHkgcmVsYXRlZCBjaGFuZ2VzIHdpdGhvdXQgYSBDTEkgYXJlIGV4cGVjdGVkIHRvIGZhaWwnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gcmVkaXJlY3QgL2Rldi9udWxsIHRvIHN0ZGluLCB3aGljaCBtZWFucyB0aGVyZSB3aWxsIG5vdCBiZSB0dHkgYXR0YWNoZWRcbiAgLy8gc2luY2UgdGhpcyBzdGFjayBpbmNsdWRlcyBzZWN1cml0eS1yZWxhdGVkIGNoYW5nZXMsIHRoZSBkZXBsb3ltZW50IHNob3VsZFxuICAvLyBpbW1lZGlhdGVseSBmYWlsIGJlY2F1c2Ugd2UgY2FuJ3QgY29uZmlybSB0aGUgY2hhbmdlc1xuICBjb25zdCBzdGFja05hbWUgPSAnaWFtLXRlc3QnO1xuICBhd2FpdCBleHBlY3QoZml4dHVyZS5jZGtEZXBsb3koc3RhY2tOYW1lLCB7XG4gICAgb3B0aW9uczogWyc8JywgJy9kZXYvbnVsbCddLCAvLyBINHgsIHRoaXMgb25seSB3b3JrcyBiZWNhdXNlIEkgaGFwcGVuIHRvIGtub3cgd2UgcGFzcyBzaGVsbDogdHJ1ZS5cbiAgICBuZXZlclJlcXVpcmVBcHByb3ZhbDogZmFsc2UsXG4gIH0pKS5yZWplY3RzLnRvVGhyb3coJ2V4aXRlZCB3aXRoIGVycm9yJyk7XG5cbiAgLy8gRW5zdXJlIHN0YWNrIHdhcyBub3QgZGVwbG95ZWRcbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHtcbiAgICBTdGFja05hbWU6IGZpeHR1cmUuZnVsbFN0YWNrTmFtZShzdGFja05hbWUpLFxuICB9KSkucmVqZWN0cy50b1Rocm93KCdkb2VzIG5vdCBleGlzdCcpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2RlcGxveSB3aWxkY2FyZCB3aXRoIG91dHB1dHMnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3Qgb3V0cHV0c0ZpbGUgPSBwYXRoLmpvaW4oZml4dHVyZS5pbnRlZ1Rlc3REaXIsICdvdXRwdXRzJywgJ291dHB1dHMuanNvbicpO1xuICBhd2FpdCBmcy5ta2RpcihwYXRoLmRpcm5hbWUob3V0cHV0c0ZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcblxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveShbJ291dHB1dHMtdGVzdC0qJ10sIHtcbiAgICBvcHRpb25zOiBbJy0tb3V0cHV0cy1maWxlJywgb3V0cHV0c0ZpbGVdLFxuICB9KTtcblxuICBjb25zdCBvdXRwdXRzID0gSlNPTi5wYXJzZSgoYXdhaXQgZnMucmVhZEZpbGUob3V0cHV0c0ZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLnRvU3RyaW5nKCkpO1xuICBleHBlY3Qob3V0cHV0cykudG9FcXVhbCh7XG4gICAgW2Ake2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1vdXRwdXRzLXRlc3QtMWBdOiB7XG4gICAgICBUb3BpY05hbWU6IGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1vdXRwdXRzLXRlc3QtMU15VG9waWNgLFxuICAgIH0sXG4gICAgW2Ake2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1vdXRwdXRzLXRlc3QtMmBdOiB7XG4gICAgICBUb3BpY05hbWU6IGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1vdXRwdXRzLXRlc3QtMk15T3RoZXJUb3BpY2AsXG4gICAgfSxcbiAgfSk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IHdpdGggcGFyYW1ldGVycycsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBzdGFja0FybiA9IGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdwYXJhbS10ZXN0LTEnLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tcGFyYW1ldGVycycsIGBUb3BpY05hbWVQYXJhbT0ke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fWJhemluZ2FgLFxuICAgIF0sXG4gICAgY2FwdHVyZVN0ZGVycjogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZml4dHVyZS5hd3MuY2xvdWRGb3JtYXRpb24oJ2Rlc2NyaWJlU3RhY2tzJywge1xuICAgIFN0YWNrTmFtZTogc3RhY2tBcm4sXG4gIH0pO1xuXG4gIGV4cGVjdChyZXNwb25zZS5TdGFja3M/LlswXS5QYXJhbWV0ZXJzKS50b0VxdWFsKFtcbiAgICB7XG4gICAgICBQYXJhbWV0ZXJLZXk6ICdUb3BpY05hbWVQYXJhbScsXG4gICAgICBQYXJhbWV0ZXJWYWx1ZTogYCR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9YmF6aW5nYWAsXG4gICAgfSxcbiAgXSk7XG59KSk7XG5cbmludGVnVGVzdCgndXBkYXRlIHRvIHN0YWNrIGluIFJPTExCQUNLX0NPTVBMRVRFIHN0YXRlIHdpbGwgZGVsZXRlIHN0YWNrIGFuZCBjcmVhdGUgYSBuZXcgb25lJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNka0RlcGxveSgncGFyYW0tdGVzdC0xJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXBhcmFtZXRlcnMnLCBgVG9waWNOYW1lUGFyYW09JHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1AYXd3YCxcbiAgICBdLFxuICAgIGNhcHR1cmVTdGRlcnI6IGZhbHNlLFxuICB9KSkucmVqZWN0cy50b1Rocm93KCdleGl0ZWQgd2l0aCBlcnJvcicpO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZml4dHVyZS5hd3MuY2xvdWRGb3JtYXRpb24oJ2Rlc2NyaWJlU3RhY2tzJywge1xuICAgIFN0YWNrTmFtZTogZml4dHVyZS5mdWxsU3RhY2tOYW1lKCdwYXJhbS10ZXN0LTEnKSxcbiAgfSk7XG5cbiAgY29uc3Qgc3RhY2tBcm4gPSByZXNwb25zZS5TdGFja3M/LlswXS5TdGFja0lkO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uU3RhY2tTdGF0dXMpLnRvRXF1YWwoJ1JPTExCQUNLX0NPTVBMRVRFJyk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBuZXdTdGFja0FybiA9IGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdwYXJhbS10ZXN0LTEnLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tcGFyYW1ldGVycycsIGBUb3BpY05hbWVQYXJhbT0ke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fWFsbGdvb2RgLFxuICAgIF0sXG4gICAgY2FwdHVyZVN0ZGVycjogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IG5ld1N0YWNrUmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBuZXdTdGFja0FybixcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QgKHN0YWNrQXJuKS5ub3QudG9FcXVhbChuZXdTdGFja0Fybik7IC8vIG5ldyBzdGFjayB3YXMgY3JlYXRlZFxuICBleHBlY3QobmV3U3RhY2tSZXNwb25zZS5TdGFja3M/LlswXS5TdGFja1N0YXR1cykudG9FcXVhbCgnQ1JFQVRFX0NPTVBMRVRFJyk7XG4gIGV4cGVjdChuZXdTdGFja1Jlc3BvbnNlLlN0YWNrcz8uWzBdLlBhcmFtZXRlcnMpLnRvRXF1YWwoW1xuICAgIHtcbiAgICAgIFBhcmFtZXRlcktleTogJ1RvcGljTmFtZVBhcmFtJyxcbiAgICAgIFBhcmFtZXRlclZhbHVlOiBgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1hbGxnb29kYCxcbiAgICB9LFxuICBdKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdzdGFjayBpbiBVUERBVEVfUk9MTEJBQ0tfQ09NUExFVEUgc3RhdGUgY2FuIGJlIHVwZGF0ZWQnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2tBcm4gPSBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgncGFyYW0tdGVzdC0xJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXBhcmFtZXRlcnMnLCBgVG9waWNOYW1lUGFyYW09JHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1uaWNlYCxcbiAgICBdLFxuICAgIGNhcHR1cmVTdGRlcnI6IGZhbHNlLFxuICB9KTtcblxuICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBzdGFja0FybixcbiAgfSk7XG5cbiAgZXhwZWN0KHJlc3BvbnNlLlN0YWNrcz8uWzBdLlN0YWNrU3RhdHVzKS50b0VxdWFsKCdDUkVBVEVfQ09NUExFVEUnKTtcblxuICAvLyBiYWQgcGFyYW1ldGVyIG5hbWUgd2l0aCBAIHdpbGwgcHV0IHN0YWNrIGludG8gVVBEQVRFX1JPTExCQUNLX0NPTVBMRVRFXG4gIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNka0RlcGxveSgncGFyYW0tdGVzdC0xJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXBhcmFtZXRlcnMnLCBgVG9waWNOYW1lUGFyYW09JHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1AYXd3YCxcbiAgICBdLFxuICAgIGNhcHR1cmVTdGRlcnI6IGZhbHNlLFxuICB9KSkucmVqZWN0cy50b1Rocm93KCdleGl0ZWQgd2l0aCBlcnJvcicpOztcblxuICByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHtcbiAgICBTdGFja05hbWU6IHN0YWNrQXJuLFxuICB9KTtcblxuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uU3RhY2tTdGF0dXMpLnRvRXF1YWwoJ1VQREFURV9ST0xMQkFDS19DT01QTEVURScpO1xuXG4gIC8vIFdIRU5cbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3BhcmFtLXRlc3QtMScsIHtcbiAgICBvcHRpb25zOiBbXG4gICAgICAnLS1wYXJhbWV0ZXJzJywgYFRvcGljTmFtZVBhcmFtPSR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9YWxsZ29vZGAsXG4gICAgXSxcbiAgICBjYXB0dXJlU3RkZXJyOiBmYWxzZSxcbiAgfSk7XG5cbiAgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBzdGFja0FybixcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uU3RhY2tTdGF0dXMpLnRvRXF1YWwoJ1VQREFURV9DT01QTEVURScpO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uUGFyYW1ldGVycykudG9FcXVhbChbXG4gICAge1xuICAgICAgUGFyYW1ldGVyS2V5OiAnVG9waWNOYW1lUGFyYW0nLFxuICAgICAgUGFyYW1ldGVyVmFsdWU6IGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fWFsbGdvb2RgLFxuICAgIH0sXG4gIF0pO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2RlcGxveSB3aXRoIHdpbGRjYXJkIGFuZCBwYXJhbWV0ZXJzJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdwYXJhbS10ZXN0LSonLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tcGFyYW1ldGVycycsIGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1wYXJhbS10ZXN0LTE6VG9waWNOYW1lUGFyYW09JHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1iYXppbmdhYCxcbiAgICAgICctLXBhcmFtZXRlcnMnLCBgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH0tcGFyYW0tdGVzdC0yOk90aGVyVG9waWNOYW1lUGFyYW09JHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1UaGF0c015U3BvdGAsXG4gICAgICAnLS1wYXJhbWV0ZXJzJywgYCR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9LXBhcmFtLXRlc3QtMzpEaXNwbGF5TmFtZVBhcmFtPSR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9SGV5VGhlcmVgLFxuICAgICAgJy0tcGFyYW1ldGVycycsIGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1wYXJhbS10ZXN0LTM6T3RoZXJEaXNwbGF5TmFtZVBhcmFtPSR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9QW5vdGhlck9uZWAsXG4gICAgXSxcbiAgfSk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IHdpdGggcGFyYW1ldGVycyBtdWx0aScsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBwYXJhbVZhbDEgPSBgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH1iYXppbmdhYDtcbiAgY29uc3QgcGFyYW1WYWwyID0gYCR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9PWphZ3NoZW1hc2hgO1xuXG4gIGNvbnN0IHN0YWNrQXJuID0gYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3BhcmFtLXRlc3QtMycsIHtcbiAgICBvcHRpb25zOiBbXG4gICAgICAnLS1wYXJhbWV0ZXJzJywgYERpc3BsYXlOYW1lUGFyYW09JHtwYXJhbVZhbDF9YCxcbiAgICAgICctLXBhcmFtZXRlcnMnLCBgT3RoZXJEaXNwbGF5TmFtZVBhcmFtPSR7cGFyYW1WYWwyfWAsXG4gICAgXSxcbiAgICBjYXB0dXJlU3RkZXJyOiBmYWxzZSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBzdGFja0FybixcbiAgfSk7XG5cbiAgZXhwZWN0KHJlc3BvbnNlLlN0YWNrcz8uWzBdLlBhcmFtZXRlcnMpLnRvRXF1YWwoW1xuICAgIHtcbiAgICAgIFBhcmFtZXRlcktleTogJ0Rpc3BsYXlOYW1lUGFyYW0nLFxuICAgICAgUGFyYW1ldGVyVmFsdWU6IHBhcmFtVmFsMSxcbiAgICB9LFxuICAgIHtcbiAgICAgIFBhcmFtZXRlcktleTogJ090aGVyRGlzcGxheU5hbWVQYXJhbScsXG4gICAgICBQYXJhbWV0ZXJWYWx1ZTogcGFyYW1WYWwyLFxuICAgIH0sXG4gIF0pO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2RlcGxveSB3aXRoIG5vdGlmaWNhdGlvbiBBUk4nLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgdG9waWNOYW1lID0gYCR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9LXRlc3QtdG9waWNgO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZml4dHVyZS5hd3Muc25zKCdjcmVhdGVUb3BpYycsIHsgTmFtZTogdG9waWNOYW1lIH0pO1xuICBjb25zdCB0b3BpY0FybiA9IHJlc3BvbnNlLlRvcGljQXJuITtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgndGVzdC0yJywge1xuICAgICAgb3B0aW9uczogWyctLW5vdGlmaWNhdGlvbi1hcm5zJywgdG9waWNBcm5dLFxuICAgIH0pO1xuXG4gICAgLy8gdmVyaWZ5IHRoYXQgdGhlIHN0YWNrIHdlIGRlcGxveWVkIGhhcyBvdXIgbm90aWZpY2F0aW9uIEFSTlxuICAgIGNvbnN0IGRlc2NyaWJlUmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgICBTdGFja05hbWU6IGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0yJyksXG4gICAgfSk7XG4gICAgZXhwZWN0KGRlc2NyaWJlUmVzcG9uc2UuU3RhY2tzPy5bMF0uTm90aWZpY2F0aW9uQVJOcykudG9FcXVhbChbdG9waWNBcm5dKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBmaXh0dXJlLmF3cy5zbnMoJ2RlbGV0ZVRvcGljJywge1xuICAgICAgVG9waWNBcm46IHRvcGljQXJuLFxuICAgIH0pO1xuICB9XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IHdpdGggcm9sZScsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCByb2xlTmFtZSA9IGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS10ZXN0LXJvbGVgO1xuXG4gIGF3YWl0IGRlbGV0ZVJvbGUoKTtcblxuICBjb25zdCBjcmVhdGVSZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmlhbSgnY3JlYXRlUm9sZScsIHtcbiAgICBSb2xlTmFtZTogcm9sZU5hbWUsXG4gICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFt7XG4gICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdjbG91ZGZvcm1hdGlvbi5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICB9LCB7XG4gICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogKGF3YWl0IGZpeHR1cmUuYXdzLnN0cygnZ2V0Q2FsbGVySWRlbnRpdHknLCB7fSkpLkFybiB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICB9XSxcbiAgICB9KSxcbiAgfSk7XG4gIGNvbnN0IHJvbGVBcm4gPSBjcmVhdGVSZXNwb25zZS5Sb2xlLkFybjtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmaXh0dXJlLmF3cy5pYW0oJ3B1dFJvbGVQb2xpY3knLCB7XG4gICAgICBSb2xlTmFtZTogcm9sZU5hbWUsXG4gICAgICBQb2xpY3lOYW1lOiAnRGVmYXVsdFBvbGljeScsXG4gICAgICBQb2xpY3lEb2N1bWVudDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICcqJyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgfV0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGF3YWl0IHJldHJ5KGZpeHR1cmUub3V0cHV0LCAnVHJ5aW5nIHRvIGFzc3VtZSBmcmVzaCByb2xlJywgcmV0cnkuZm9yU2Vjb25kcygzMDApLCBhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCBmaXh0dXJlLmF3cy5zdHMoJ2Fzc3VtZVJvbGUnLCB7XG4gICAgICAgIFJvbGVBcm46IHJvbGVBcm4sXG4gICAgICAgIFJvbGVTZXNzaW9uTmFtZTogJ3Rlc3RpbmcnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbiBwcmluY2lwbGUsIHRoZSByb2xlIGhhcyByZXBsaWNhdGVkIGZyb20gJ3VzLWVhc3QtMScgdG8gd2hlcmV2ZXIgd2UncmUgdGVzdGluZy5cbiAgICAvLyBHaXZlIGl0IGEgbGl0dGxlIG1vcmUgc2xlZXAgdG8gbWFrZSBzdXJlIENsb3VkRm9ybWF0aW9uIGlzIG5vdCBoaXR0aW5nIGEgYm94XG4gICAgLy8gdGhhdCBkb2Vzbid0IGhhdmUgaXQgeWV0LlxuICAgIGF3YWl0IHNsZWVwKDUwMDApO1xuXG4gICAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3Rlc3QtMicsIHtcbiAgICAgIG9wdGlvbnM6IFsnLS1yb2xlLWFybicsIHJvbGVBcm5dLFxuICAgIH0pO1xuXG4gICAgLy8gSW1tZWRpYXRlbHkgZGVsZXRlIHRoZSBzdGFjayBhZ2FpbiBiZWZvcmUgd2UgZGVsZXRlIHRoZSByb2xlLlxuICAgIC8vXG4gICAgLy8gU2luY2Ugcm9sZXMgYXJlIHN0aWNreSwgaWYgd2UgZGVsZXRlIHRoZSByb2xlIGJlZm9yZSB0aGUgc3RhY2ssIHN1YnNlcXVlbnQgRGVsZXRlU3RhY2tcbiAgICAvLyBvcGVyYXRpb25zIHdpbGwgZmFpbCB3aGVuIENsb3VkRm9ybWF0aW9uIHRyaWVzIHRvIGFzc3VtZSB0aGUgcm9sZSB0aGF0J3MgYWxyZWFkeSBnb25lLlxuICAgIGF3YWl0IGZpeHR1cmUuY2RrRGVzdHJveSgndGVzdC0yJyk7XG5cbiAgfSBmaW5hbGx5IHtcbiAgICBhd2FpdCBkZWxldGVSb2xlKCk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBkZWxldGVSb2xlKCkge1xuICAgIHRyeSB7XG4gICAgICBmb3IgKGNvbnN0IHBvbGljeU5hbWUgb2YgKGF3YWl0IGZpeHR1cmUuYXdzLmlhbSgnbGlzdFJvbGVQb2xpY2llcycsIHsgUm9sZU5hbWU6IHJvbGVOYW1lIH0pKS5Qb2xpY3lOYW1lcykge1xuICAgICAgICBhd2FpdCBmaXh0dXJlLmF3cy5pYW0oJ2RlbGV0ZVJvbGVQb2xpY3knLCB7XG4gICAgICAgICAgUm9sZU5hbWU6IHJvbGVOYW1lLFxuICAgICAgICAgIFBvbGljeU5hbWU6IHBvbGljeU5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgYXdhaXQgZml4dHVyZS5hd3MuaWFtKCdkZWxldGVSb2xlJywgeyBSb2xlTmFtZTogcm9sZU5hbWUgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubWVzc2FnZS5pbmRleE9mKCdjYW5ub3QgYmUgZm91bmQnKSA+IC0xKSB7IHJldHVybjsgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cbn0pKTtcblxuaW50ZWdUZXN0KCdjZGsgZGlmZicsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBkaWZmMSA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnZGlmZicsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0xJyldKTtcbiAgZXhwZWN0KGRpZmYxKS50b0NvbnRhaW4oJ0FXUzo6U05TOjpUb3BpYycpO1xuXG4gIGNvbnN0IGRpZmYyID0gYXdhaXQgZml4dHVyZS5jZGsoWydkaWZmJywgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTInKV0pO1xuICBleHBlY3QoZGlmZjIpLnRvQ29udGFpbignQVdTOjpTTlM6OlRvcGljJyk7XG5cbiAgLy8gV2UgY2FuIG1ha2UgaXQgZmFpbCBieSBwYXNzaW5nIC0tZmFpbFxuICBhd2FpdCBleHBlY3QoZml4dHVyZS5jZGsoWydkaWZmJywgJy0tZmFpbCcsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0xJyldKSlcbiAgICAucmVqZWN0cy50b1Rocm93KCdleGl0ZWQgd2l0aCBlcnJvcicpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2NkayBkaWZmIC0tZmFpbCBvbiBtdWx0aXBsZSBzdGFja3MgZXhpdHMgd2l0aCBlcnJvciBpZiBhbnkgb2YgdGhlIHN0YWNrcyBjb250YWlucyBhIGRpZmYnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgZGlmZjEgPSBhd2FpdCBmaXh0dXJlLmNkayhbJ2RpZmYnLCBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ3Rlc3QtMScpXSk7XG4gIGV4cGVjdChkaWZmMSkudG9Db250YWluKCdBV1M6OlNOUzo6VG9waWMnKTtcblxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgndGVzdC0yJyk7XG4gIGNvbnN0IGRpZmYyID0gYXdhaXQgZml4dHVyZS5jZGsoWydkaWZmJywgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTInKV0pO1xuICBleHBlY3QoZGlmZjIpLnRvQ29udGFpbignVGhlcmUgd2VyZSBubyBkaWZmZXJlbmNlcycpO1xuXG4gIC8vIFdIRU4gLyBUSEVOXG4gIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNkayhbJ2RpZmYnLCAnLS1mYWlsJywgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTEnKSwgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTInKV0pKS5yZWplY3RzLnRvVGhyb3coJ2V4aXRlZCB3aXRoIGVycm9yJyk7XG59KSk7XG5cbmludGVnVGVzdCgnY2RrIGRpZmYgLS1mYWlsIHdpdGggbXVsdGlwbGUgc3RhY2sgZXhpdHMgd2l0aCBpZiBhbnkgb2YgdGhlIHN0YWNrcyBjb250YWlucyBhIGRpZmYnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gR0lWRU5cbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3Rlc3QtMScpO1xuICBjb25zdCBkaWZmMSA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnZGlmZicsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0xJyldKTtcbiAgZXhwZWN0KGRpZmYxKS50b0NvbnRhaW4oJ1RoZXJlIHdlcmUgbm8gZGlmZmVyZW5jZXMnKTtcblxuICBjb25zdCBkaWZmMiA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnZGlmZicsIGZpeHR1cmUuZnVsbFN0YWNrTmFtZSgndGVzdC0yJyldKTtcbiAgZXhwZWN0KGRpZmYyKS50b0NvbnRhaW4oJ0FXUzo6U05TOjpUb3BpYycpO1xuXG4gIC8vIFdIRU4gLyBUSEVOXG4gIGF3YWl0IGV4cGVjdChmaXh0dXJlLmNkayhbJ2RpZmYnLCAnLS1mYWlsJywgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTEnKSwgZml4dHVyZS5mdWxsU3RhY2tOYW1lKCd0ZXN0LTInKV0pKS5yZWplY3RzLnRvVGhyb3coJ2V4aXRlZCB3aXRoIGVycm9yJyk7XG59KSk7XG5cbmludGVnVGVzdCgnY2RrIGRpZmYgLS1zZWN1cml0eS1vbmx5IC0tZmFpbCBleGl0cyB3aGVuIHNlY3VyaXR5IGNoYW5nZXMgYXJlIHByZXNlbnQnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3Qgc3RhY2tOYW1lID0gJ2lhbS10ZXN0JztcbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuY2RrKFsnZGlmZicsICctLXNlY3VyaXR5LW9ubHknLCAnLS1mYWlsJywgZml4dHVyZS5mdWxsU3RhY2tOYW1lKHN0YWNrTmFtZSldKSkucmVqZWN0cy50b1Rocm93KCdleGl0ZWQgd2l0aCBlcnJvcicpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2RlcGxveSBzdGFjayB3aXRoIGRvY2tlciBhc3NldCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnZG9ja2VyJyk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IGFuZCB0ZXN0IHN0YWNrIHdpdGggbGFtYmRhIGFzc2V0Jywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IHN0YWNrQXJuID0gYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ2xhbWJkYScsIHsgY2FwdHVyZVN0ZGVycjogZmFsc2UgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBzdGFja0FybixcbiAgfSk7XG4gIGNvbnN0IGxhbWJkYUFybiA9IHJlc3BvbnNlLlN0YWNrcz8uWzBdLk91dHB1dHM/LlswXS5PdXRwdXRWYWx1ZTtcbiAgaWYgKGxhbWJkYUFybiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdGFjayBkaWQgbm90IGhhdmUgZXhwZWN0ZWQgTGFtYmRhIEFSTiBvdXRwdXQnKTtcbiAgfVxuXG4gIGNvbnN0IG91dHB1dCA9IGF3YWl0IGZpeHR1cmUuYXdzLmxhbWJkYSgnaW52b2tlJywge1xuICAgIEZ1bmN0aW9uTmFtZTogbGFtYmRhQXJuLFxuICB9KTtcblxuICBleHBlY3QoSlNPTi5zdHJpbmdpZnkob3V0cHV0LlBheWxvYWQpKS50b0NvbnRhaW4oJ2RlYXIgYXNzZXQnKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdjZGsgbHMnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgbGlzdGluZyA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnbHMnXSwgeyBjYXB0dXJlU3RkZXJyOiBmYWxzZSB9KTtcblxuICBjb25zdCBleHBlY3RlZFN0YWNrcyA9IFtcbiAgICAnY29uZGl0aW9uYWwtcmVzb3VyY2UnLFxuICAgICdkb2NrZXInLFxuICAgICdkb2NrZXItd2l0aC1jdXN0b20tZmlsZScsXG4gICAgJ2ZhaWxlZCcsXG4gICAgJ2lhbS10ZXN0JyxcbiAgICAnbGFtYmRhJyxcbiAgICAnbWlzc2luZy1zc20tcGFyYW1ldGVyJyxcbiAgICAnb3JkZXItcHJvdmlkaW5nJyxcbiAgICAnb3V0cHV0cy10ZXN0LTEnLFxuICAgICdvdXRwdXRzLXRlc3QtMicsXG4gICAgJ3BhcmFtLXRlc3QtMScsXG4gICAgJ3BhcmFtLXRlc3QtMicsXG4gICAgJ3BhcmFtLXRlc3QtMycsXG4gICAgJ3Rlcm1pbmF0aW9uLXByb3RlY3Rpb24nLFxuICAgICd0ZXN0LTEnLFxuICAgICd0ZXN0LTInLFxuICAgICd3aXRoLW5lc3RlZC1zdGFjaycsXG4gICAgJ3dpdGgtbmVzdGVkLXN0YWNrLXVzaW5nLXBhcmFtZXRlcnMnLFxuICAgICdvcmRlci1jb25zdW1pbmcnLFxuICBdO1xuXG4gIGZvciAoY29uc3Qgc3RhY2sgb2YgZXhwZWN0ZWRTdGFja3MpIHtcbiAgICBleHBlY3QobGlzdGluZykudG9Db250YWluKGZpeHR1cmUuZnVsbFN0YWNrTmFtZShzdGFjaykpO1xuICB9XG59KSk7XG5cbmludGVnVGVzdCgnc3ludGhpbmcgYSBzdGFnZSB3aXRoIGVycm9ycyBsZWFkcyB0byBmYWlsdXJlJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IG91dHB1dCA9IGF3YWl0IGZpeHR1cmUuY2RrKFsnc3ludGgnXSwge1xuICAgIGFsbG93RXJyRXhpdDogdHJ1ZSxcbiAgICBtb2RFbnY6IHtcbiAgICAgIElOVEVHX1NUQUNLX1NFVDogJ3N0YWdlLXdpdGgtZXJyb3JzJyxcbiAgICB9LFxuICB9KTtcblxuICBleHBlY3Qob3V0cHV0KS50b0NvbnRhaW4oJ1RoaXMgaXMgYW4gZXJyb3InKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdzeW50aGluZyBhIHN0YWdlIHdpdGggZXJyb3JzIGNhbiBiZSBzdXBwcmVzc2VkJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGF3YWl0IGZpeHR1cmUuY2RrKFsnc3ludGgnLCAnLS1uby12YWxpZGF0aW9uJ10sIHtcbiAgICBtb2RFbnY6IHtcbiAgICAgIElOVEVHX1NUQUNLX1NFVDogJ3N0YWdlLXdpdGgtZXJyb3JzJyxcbiAgICB9LFxuICB9KTtcbn0pKTtcblxuaW50ZWdUZXN0KCdkZXBsb3kgc3RhY2sgd2l0aG91dCByZXNvdXJjZScsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICAvLyBEZXBsb3kgdGhlIHN0YWNrIHdpdGhvdXQgcmVzb3VyY2VzXG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdjb25kaXRpb25hbC1yZXNvdXJjZScsIHsgbW9kRW52OiB7IE5PX1JFU09VUkNFOiAnVFJVRScgfSB9KTtcblxuICAvLyBUaGlzIHNob3VsZCBoYXZlIHN1Y2NlZWRlZCBidXQgbm90IGRlcGxveWVkIHRoZSBzdGFjay5cbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ2NvbmRpdGlvbmFsLXJlc291cmNlJykgfSkpXG4gICAgLnJlamVjdHMudG9UaHJvdygnY29uZGl0aW9uYWwtcmVzb3VyY2UgZG9lcyBub3QgZXhpc3QnKTtcblxuICAvLyBEZXBsb3kgdGhlIHN0YWNrIHdpdGggcmVzb3VyY2VzXG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdjb25kaXRpb25hbC1yZXNvdXJjZScpO1xuXG4gIC8vIFRoZW4gYWdhaW4gV0lUSE9VVCByZXNvdXJjZXMgKHRoaXMgc2hvdWxkIGRlc3Ryb3kgdGhlIHN0YWNrKVxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnY29uZGl0aW9uYWwtcmVzb3VyY2UnLCB7IG1vZEVudjogeyBOT19SRVNPVVJDRTogJ1RSVUUnIH0gfSk7XG5cbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ2NvbmRpdGlvbmFsLXJlc291cmNlJykgfSkpXG4gICAgLnJlamVjdHMudG9UaHJvdygnY29uZGl0aW9uYWwtcmVzb3VyY2UgZG9lcyBub3QgZXhpc3QnKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdJQU0gZGlmZicsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBvdXRwdXQgPSBhd2FpdCBmaXh0dXJlLmNkayhbJ2RpZmYnLCBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ2lhbS10ZXN0JyldKTtcblxuICAvLyBSb3VnaGx5IGNoZWNrIGZvciBhIHRhYmxlIGxpa2UgdGhpczpcbiAgLy9cbiAgLy8g4pSM4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSALeKUgOKUgOKUrOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUkFxuICAvLyDilIIgICDilIIgUmVzb3VyY2UgICAgICAgIOKUgiBFZmZlY3Qg4pSCIEFjdGlvbiAgICAgICAgIOKUgiBQcmluY2lwYWwgICAgICAgICAgICAgICAgICAgICDilIIgQ29uZGl0aW9uIOKUglxuICAvLyDilJzilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKRcbiAgLy8g4pSCICsg4pSCICR7U29tZVJvbGUuQXJufSDilIIgQWxsb3cgIOKUgiBzdHM6QXNzdW1lUm9sZSDilIIgU2VydmljZTplYzIuYW1hem9uYXdzLmNvbSAgICAg4pSCICAgICAgICAgICDilIJcbiAgLy8g4pSU4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYXG5cbiAgZXhwZWN0KG91dHB1dCkudG9Db250YWluKCcke1NvbWVSb2xlLkFybn0nKTtcbiAgZXhwZWN0KG91dHB1dCkudG9Db250YWluKCdzdHM6QXNzdW1lUm9sZScpO1xuICBleHBlY3Qob3V0cHV0KS50b0NvbnRhaW4oJ2VjMi5hbWF6b25hd3MuY29tJyk7XG59KSk7XG5cbmludGVnVGVzdCgnZmFzdCBkZXBsb3knLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gd2UgYXJlIHVzaW5nIGEgc3RhY2sgd2l0aCBhIG5lc3RlZCBzdGFjayBiZWNhdXNlIENGTiB3aWxsIGFsd2F5cyBhdHRlbXB0IHRvXG4gIC8vIHVwZGF0ZSBhIG5lc3RlZCBzdGFjaywgd2hpY2ggd2lsbCBhbGxvdyB1cyB0byB2ZXJpZnkgdGhhdCB1cGRhdGVzIGFyZSBhY3R1YWxseVxuICAvLyBza2lwcGVkIHVubGVzcyAtLWZvcmNlIGlzIHNwZWNpZmllZC5cbiAgY29uc3Qgc3RhY2tBcm4gPSBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnd2l0aC1uZXN0ZWQtc3RhY2snLCB7IGNhcHR1cmVTdGRlcnI6IGZhbHNlIH0pO1xuICBjb25zdCBjaGFuZ2VTZXQxID0gYXdhaXQgZ2V0TGF0ZXN0Q2hhbmdlU2V0KCk7XG5cbiAgLy8gRGVwbG95IHRoZSBzYW1lIHN0YWNrIGFnYWluLCB0aGVyZSBzaG91bGQgYmUgbm8gbmV3IGNoYW5nZSBzZXQgY3JlYXRlZFxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnd2l0aC1uZXN0ZWQtc3RhY2snKTtcbiAgY29uc3QgY2hhbmdlU2V0MiA9IGF3YWl0IGdldExhdGVzdENoYW5nZVNldCgpO1xuICBleHBlY3QoY2hhbmdlU2V0Mi5DaGFuZ2VTZXRJZCkudG9FcXVhbChjaGFuZ2VTZXQxLkNoYW5nZVNldElkKTtcblxuICAvLyBEZXBsb3kgdGhlIHN0YWNrIGFnYWluIHdpdGggLS1mb3JjZSwgbm93IHdlIHNob3VsZCBjcmVhdGUgYSBjaGFuZ2VzZXRcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ3dpdGgtbmVzdGVkLXN0YWNrJywgeyBvcHRpb25zOiBbJy0tZm9yY2UnXSB9KTtcbiAgY29uc3QgY2hhbmdlU2V0MyA9IGF3YWl0IGdldExhdGVzdENoYW5nZVNldCgpO1xuICBleHBlY3QoY2hhbmdlU2V0My5DaGFuZ2VTZXRJZCkubm90LnRvRXF1YWwoY2hhbmdlU2V0Mi5DaGFuZ2VTZXRJZCk7XG5cbiAgLy8gRGVwbG95IHRoZSBzdGFjayBhZ2FpbiB3aXRoIHRhZ3MsIGV4cGVjdGVkIHRvIGNyZWF0ZSBhIG5ldyBjaGFuZ2VzZXRcbiAgLy8gZXZlbiB0aG91Z2ggdGhlIHJlc291cmNlcyBkaWRuJ3QgY2hhbmdlLlxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnd2l0aC1uZXN0ZWQtc3RhY2snLCB7IG9wdGlvbnM6IFsnLS10YWdzJywgJ2tleT12YWx1ZSddIH0pO1xuICBjb25zdCBjaGFuZ2VTZXQ0ID0gYXdhaXQgZ2V0TGF0ZXN0Q2hhbmdlU2V0KCk7XG4gIGV4cGVjdChjaGFuZ2VTZXQ0LkNoYW5nZVNldElkKS5ub3QudG9FcXVhbChjaGFuZ2VTZXQzLkNoYW5nZVNldElkKTtcblxuICBhc3luYyBmdW5jdGlvbiBnZXRMYXRlc3RDaGFuZ2VTZXQoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7IFN0YWNrTmFtZTogc3RhY2tBcm4gfSk7XG4gICAgaWYgKCFyZXNwb25zZS5TdGFja3M/LlswXSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0RpZCBub3QgZ2V0IGEgQ2hhbmdlU2V0IGF0IGFsbCcpOyB9XG4gICAgZml4dHVyZS5sb2coYEZvdW5kIENoYW5nZSBTZXQgJHtyZXNwb25zZS5TdGFja3M/LlswXS5DaGFuZ2VTZXRJZH1gKTtcbiAgICByZXR1cm4gcmVzcG9uc2UuU3RhY2tzPy5bMF07XG4gIH1cbn0pKTtcblxuaW50ZWdUZXN0KCdmYWlsZWQgZGVwbG95IGRvZXMgbm90IGhhbmcnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gdGhpcyB3aWxsIGhhbmcgaWYgd2UgaW50cm9kdWNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNjQwMyBhZ2Fpbi5cbiAgYXdhaXQgZXhwZWN0KGZpeHR1cmUuY2RrRGVwbG95KCdmYWlsZWQnKSkucmVqZWN0cy50b1Rocm93KCdleGl0ZWQgd2l0aCBlcnJvcicpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2NhbiBzdGlsbCBsb2FkIG9sZCBhc3NlbWJsaWVzJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGN4QXNtRGlyID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCAnY2RrLWludGVnLWN4Jyk7XG5cbiAgY29uc3QgdGVzdEFzc2VtYmxpZXNEaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnY2xvdWQtYXNzZW1ibGllcycpO1xuICBmb3IgKGNvbnN0IGFzbWRpciBvZiBhd2FpdCBsaXN0Q2hpbGREaXJzKHRlc3RBc3NlbWJsaWVzRGlyZWN0b3J5KSkge1xuICAgIGZpeHR1cmUubG9nKGBBU1NFTUJMWSAke2FzbWRpcn1gKTtcbiAgICBhd2FpdCBjbG9uZURpcmVjdG9yeShhc21kaXIsIGN4QXNtRGlyKTtcblxuICAgIC8vIFNvbWUgZmlsZXMgaW4gdGhlIGFzbSBkaXJlY3RvcnkgdGhhdCBoYXZlIGEgLmpzIGV4dGVuc2lvbiBhcmVcbiAgICAvLyBhY3R1YWxseSB0cmVhdGVkIGFzIHRlbXBsYXRlcy4gRXZhbHVhdGUgdGhlbSB1c2luZyBOb2RlSlMuXG4gICAgY29uc3QgdGVtcGxhdGVzID0gYXdhaXQgbGlzdENoaWxkcmVuKGN4QXNtRGlyLCBmdWxsUGF0aCA9PiBQcm9taXNlLnJlc29sdmUoZnVsbFBhdGguZW5kc1dpdGgoJy5qcycpKSk7XG4gICAgZm9yIChjb25zdCB0ZW1wbGF0ZSBvZiB0ZW1wbGF0ZXMpIHtcbiAgICAgIGNvbnN0IHRhcmdldE5hbWUgPSB0ZW1wbGF0ZS5yZXBsYWNlKC8uanMkLywgJycpO1xuICAgICAgYXdhaXQgc2hlbGwoW3Byb2Nlc3MuZXhlY1BhdGgsIHRlbXBsYXRlLCAnPicsIHRhcmdldE5hbWVdLCB7XG4gICAgICAgIGN3ZDogY3hBc21EaXIsXG4gICAgICAgIG91dHB1dDogZml4dHVyZS5vdXRwdXQsXG4gICAgICAgIG1vZEVudjoge1xuICAgICAgICAgIFRFU1RfQUNDT1VOVDogYXdhaXQgZml4dHVyZS5hd3MuYWNjb3VudCgpLFxuICAgICAgICAgIFRFU1RfUkVHSU9OOiBmaXh0dXJlLmF3cy5yZWdpb24sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBVc2UgdGhpcyBkaXJlY3RvcnkgYXMgYSBDbG91ZCBBc3NlbWJseVxuICAgIGNvbnN0IG91dHB1dCA9IGF3YWl0IGZpeHR1cmUuY2RrKFtcbiAgICAgICctLWFwcCcsIGN4QXNtRGlyLFxuICAgICAgJy12JyxcbiAgICAgICdzeW50aCcsXG4gICAgXSk7XG5cbiAgICAvLyBBc3NlcnQgdGhhdCB0aGVyZSB3YXMgbm8gcHJvdmlkZXJFcnJvciBpbiBDREsncyBzdGRlcnJcbiAgICAvLyBCZWNhdXNlIHdlIHJlbHkgb24gdGhlIGFwcC9mcmFtZXdvcmsgdG8gYWN0dWFsbHkgZXJyb3IgaW4gY2FzZSB0aGVcbiAgICAvLyBwcm92aWRlciBmYWlscywgd2UgaW5zcGVjdCB0aGUgbG9ncyBoZXJlLlxuICAgIGV4cGVjdChvdXRwdXQpLm5vdC50b0NvbnRhaW4oJyRwcm92aWRlckVycm9yJyk7XG4gIH1cbn0pKTtcblxuaW50ZWdUZXN0KCdnZW5lcmF0aW5nIGFuZCBsb2FkaW5nIGFzc2VtYmx5Jywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGFzbU91dHB1dERpciA9IGAke2ZpeHR1cmUuaW50ZWdUZXN0RGlyfS1jZGstaW50ZWctYXNtYDtcbiAgYXdhaXQgZml4dHVyZS5zaGVsbChbJ3JtJywgJy1yZicsIGFzbU91dHB1dERpcl0pO1xuXG4gIC8vIFN5bnRoZXNpemUgYSBDbG91ZCBBc3NlbWJseSB0b3RoZSBkZWZhdWx0IGRpcmVjdG9yeSAoY2RrLm91dCkgYW5kIGEgc3BlY2lmaWMgZGlyZWN0b3J5LlxuICBhd2FpdCBmaXh0dXJlLmNkayhbJ3N5bnRoJ10pO1xuICBhd2FpdCBmaXh0dXJlLmNkayhbJ3N5bnRoJywgJy0tb3V0cHV0JywgYXNtT3V0cHV0RGlyXSk7XG5cbiAgLy8gY2RrLm91dCBpbiB0aGUgY3VycmVudCBkaXJlY3RvcnkgYW5kIHRoZSBpbmRpY2F0ZWQgLS1vdXRwdXQgc2hvdWxkIGJlIHRoZSBzYW1lXG4gIGF3YWl0IGZpeHR1cmUuc2hlbGwoWydkaWZmJywgJ2Nkay5vdXQnLCBhc21PdXRwdXREaXJdKTtcblxuICAvLyBDaGVjayB0aGF0IHdlIGNhbiAnbHMnIHRoZSBzeW50aGVzaXplZCBhc20uXG4gIC8vIENoYW5nZSB0byBzb21lIHJhbmRvbSBkaXJlY3RvcnkgdG8gbWFrZSBzdXJlIHdlJ3JlIG5vdCBhY2NpZGVudGFsbHkgbG9hZGluZyBjZGsuanNvblxuICBjb25zdCBsaXN0ID0gYXdhaXQgZml4dHVyZS5jZGsoWyctLWFwcCcsIGFzbU91dHB1dERpciwgJ2xzJ10sIHsgY3dkOiBvcy50bXBkaXIoKSB9KTtcbiAgLy8gU2FtZSBzdGFja3Mgd2Uga25vdyBhcmUgaW4gdGhlIGFwcFxuICBleHBlY3QobGlzdCkudG9Db250YWluKGAke2ZpeHR1cmUuc3RhY2tOYW1lUHJlZml4fS1sYW1iZGFgKTtcbiAgZXhwZWN0KGxpc3QpLnRvQ29udGFpbihgJHtmaXh0dXJlLnN0YWNrTmFtZVByZWZpeH0tdGVzdC0xYCk7XG4gIGV4cGVjdChsaXN0KS50b0NvbnRhaW4oYCR7Zml4dHVyZS5zdGFja05hbWVQcmVmaXh9LXRlc3QtMmApO1xuXG4gIC8vIENoZWNrIHRoYXQgd2UgY2FuIHVzZSAnLicgYW5kIGp1c3Qgc3ludGggLHRoZSBnZW5lcmF0ZWQgYXNtXG4gIGNvbnN0IHN0YWNrVGVtcGxhdGUgPSBhd2FpdCBmaXh0dXJlLmNkayhbJy0tYXBwJywgJy4nLCAnc3ludGgnLCBmaXh0dXJlLmZ1bGxTdGFja05hbWUoJ3Rlc3QtMicpXSwge1xuICAgIGN3ZDogYXNtT3V0cHV0RGlyLFxuICB9KTtcbiAgZXhwZWN0KHN0YWNrVGVtcGxhdGUpLnRvQ29udGFpbigndG9waWMxNTJEODRBMzcnKTtcblxuICAvLyBEZXBsb3kgYSBMYW1iZGEgZnJvbSB0aGUgY29waWVkIGFzbVxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnbGFtYmRhJywgeyBvcHRpb25zOiBbJy1hJywgJy4nXSwgY3dkOiBhc21PdXRwdXREaXIgfSk7XG5cbiAgLy8gUmVtb3ZlIChyZW5hbWUpIHRoZSBvcmlnaW5hbCBjdXN0b20gZG9ja2VyIGZpbGUgdGhhdCB3YXMgdXNlZCBkdXJpbmcgc3ludGguXG4gIC8vIHRoaXMgdmVyaWZpZXMgdGhhdCB0aGUgYXNzZW1seSBoYXMgYSBjb3B5IG9mIGl0IGFuZCB0aGF0IHRoZSBtYW5pZmVzdCB1c2VzXG4gIC8vIHJlbGF0aXZlIHBhdGhzIHRvIHJlZmVyZW5jZSB0byBpdC5cbiAgY29uc3QgY3VzdG9tRG9ja2VyRmlsZSA9IHBhdGguam9pbihmaXh0dXJlLmludGVnVGVzdERpciwgJ2RvY2tlcicsICdEb2NrZXJmaWxlLkN1c3RvbScpO1xuICBhd2FpdCBmcy5yZW5hbWUoY3VzdG9tRG9ja2VyRmlsZSwgYCR7Y3VzdG9tRG9ja2VyRmlsZX1+YCk7XG4gIHRyeSB7XG5cbiAgICAvLyBkZXBsb3kgYSBkb2NrZXIgaW1hZ2Ugd2l0aCBjdXN0b20gZmlsZSB3aXRob3V0IHN5bnRoICh1c2VzIGFzc2V0cylcbiAgICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnZG9ja2VyLXdpdGgtY3VzdG9tLWZpbGUnLCB7IG9wdGlvbnM6IFsnLWEnLCAnLiddLCBjd2Q6IGFzbU91dHB1dERpciB9KTtcblxuICB9IGZpbmFsbHkge1xuICAgIC8vIFJlbmFtZSBiYWNrIHRvIHJlc3RvcmUgZml4dHVyZSB0byBvcmlnaW5hbCBzdGF0ZVxuICAgIGF3YWl0IGZzLnJlbmFtZShgJHtjdXN0b21Eb2NrZXJGaWxlfX5gLCBjdXN0b21Eb2NrZXJGaWxlKTtcbiAgfVxufSkpO1xuXG5pbnRlZ1Rlc3QoJ3RlbXBsYXRlcyBvbiBkaXNrIGNvbnRhaW4gbWV0YWRhdGEgcmVzb3VyY2UsIGFsc28gaW4gbmVzdGVkIGFzc2VtYmxpZXMnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgLy8gU3ludGggZmlyc3QsIGFuZCBzd2l0Y2ggb24gdmVyc2lvbiByZXBvcnRpbmcgYmVjYXVzZSBjZGsuanNvbiBpcyBkaXNhYmxpbmcgaXRcbiAgYXdhaXQgZml4dHVyZS5jZGsoWydzeW50aCcsICctLXZlcnNpb24tcmVwb3J0aW5nPXRydWUnXSk7XG5cbiAgLy8gTG9hZCB0ZW1wbGF0ZSBmcm9tIGRpc2sgZnJvbSByb290IGFzc2VtYmx5XG4gIGNvbnN0IHRlbXBsYXRlQ29udGVudHMgPSBhd2FpdCBmaXh0dXJlLnNoZWxsKFsnY2F0JywgJ2Nkay5vdXQvKi1sYW1iZGEudGVtcGxhdGUuanNvbiddKTtcblxuICBleHBlY3QoSlNPTi5wYXJzZSh0ZW1wbGF0ZUNvbnRlbnRzKS5SZXNvdXJjZXMuQ0RLTWV0YWRhdGEpLnRvQmVUcnV0aHkoKTtcblxuICAvLyBMb2FkIHRlbXBsYXRlIGZyb20gbmVzdGVkIGFzc2VtYmx5XG4gIGNvbnN0IG5lc3RlZFRlbXBsYXRlQ29udGVudHMgPSBhd2FpdCBmaXh0dXJlLnNoZWxsKFsnY2F0JywgJ2Nkay5vdXQvYXNzZW1ibHktKi1zdGFnZS8qLXN0YWdlLVN0YWNrSW5TdGFnZS50ZW1wbGF0ZS5qc29uJ10pO1xuXG4gIGV4cGVjdChKU09OLnBhcnNlKG5lc3RlZFRlbXBsYXRlQ29udGVudHMpLlJlc291cmNlcy5DREtNZXRhZGF0YSkudG9CZVRydXRoeSgpO1xufSkpO1xuXG5hc3luYyBmdW5jdGlvbiBsaXN0Q2hpbGRyZW4ocGFyZW50OiBzdHJpbmcsIHByZWQ6ICh4OiBzdHJpbmcpID0+IFByb21pc2U8Ym9vbGVhbj4pIHtcbiAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBhd2FpdCBmcy5yZWFkZGlyKHBhcmVudCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSkge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKHBhcmVudCwgY2hpbGQudG9TdHJpbmcoKSk7XG4gICAgaWYgKGF3YWl0IHByZWQoZnVsbFBhdGgpKSB7XG4gICAgICByZXQucHVzaChmdWxsUGF0aCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGxpc3RDaGlsZERpcnMocGFyZW50OiBzdHJpbmcpIHtcbiAgcmV0dXJuIGxpc3RDaGlsZHJlbihwYXJlbnQsIGFzeW5jIChmdWxsUGF0aDogc3RyaW5nKSA9PiAoYXdhaXQgZnMuc3RhdChmdWxsUGF0aCkpLmlzRGlyZWN0b3J5KCkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWFkVGVtcGxhdGUoZml4dHVyZTogVGVzdEZpeHR1cmUsIHN0YWNrTmFtZTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgY29uc3QgZnVsbFN0YWNrTmFtZSA9IGZpeHR1cmUuZnVsbFN0YWNrTmFtZShzdGFja05hbWUpO1xuICBjb25zdCB0ZW1wbGF0ZVBhdGggPSBwYXRoLmpvaW4oZml4dHVyZS5pbnRlZ1Rlc3REaXIsICdjZGsub3V0JywgYCR7ZnVsbFN0YWNrTmFtZX0udGVtcGxhdGUuanNvbmApO1xuICByZXR1cm4gSlNPTi5wYXJzZSgoYXdhaXQgZnMucmVhZEZpbGUodGVtcGxhdGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS50b1N0cmluZygpKTtcbn1cbiJdfQ==