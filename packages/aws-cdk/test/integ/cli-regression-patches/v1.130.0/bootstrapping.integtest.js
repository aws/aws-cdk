"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const cdk_1 = require("../helpers/cdk");
const test_helpers_1 = require("../helpers/test-helpers");
const timeout = process.env.CODEBUILD_BUILD_ID ? // if the process is running in CodeBuild
    3600000 : // 1 hour
    600000; // 10 minutes
jest.setTimeout(timeout);
process.stdout.write(`bootstrapping.integtest.ts: Setting jest time out to ${timeout} ms`);
test_helpers_1.integTest('can bootstrap without execution', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
    const bootstrapStackName = fixture.bootstrapStackName;
    await fixture.cdkBootstrapLegacy({
        toolkitStackName: bootstrapStackName,
        noExecute: true,
    });
    const resp = await fixture.aws.cloudFormation('describeStacks', {
        StackName: bootstrapStackName,
    });
    expect((_a = resp.Stacks) === null || _a === void 0 ? void 0 : _a[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
}));
test_helpers_1.integTest('upgrade legacy bootstrap stack to new bootstrap stack while in use', cdk_1.withDefaultFixture(async (fixture) => {
    const bootstrapStackName = fixture.bootstrapStackName;
    const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${cdk_1.randomString()}`;
    const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${cdk_1.randomString()}`;
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
test_helpers_1.integTest('can and deploy if omitting execution policies', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('deploy new style synthesis to new style bootstrap', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('deploy new style synthesis to new style bootstrap (with docker image)', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('deploy old style synthesis to new style bootstrap', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('can create a legacy bootstrap stack with --public-access-block-configuration=false', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
    const bootstrapStackName = fixture.bootstrapStackName;
    await fixture.cdkBootstrapLegacy({
        verbose: true,
        toolkitStackName: bootstrapStackName,
        publicAccessBlockConfiguration: false,
        tags: 'Foo=Bar',
    });
    const response = await fixture.aws.cloudFormation('describeStacks', { StackName: bootstrapStackName });
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Tags).toEqual([
        { Key: 'Foo', Value: 'Bar' },
    ]);
}));
test_helpers_1.integTest('can create multiple legacy bootstrap stacks', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Tags).toEqual([
        { Key: 'Foo', Value: 'Bar' },
    ]);
}));
test_helpers_1.integTest('can dump the template, modify and use it to deploy a custom bootstrap stack', cdk_1.withDefaultFixture(async (fixture) => {
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
test_helpers_1.integTest('switch on termination protection, switch is left alone on re-bootstrap', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].EnableTerminationProtection).toEqual(true);
}));
test_helpers_1.integTest('add tags, left alone on re-bootstrap', cdk_1.withDefaultFixture(async (fixture) => {
    var _a;
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
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Tags).toEqual([
        { Key: 'Foo', Value: 'Bar' },
    ]);
}));
test_helpers_1.integTest('can deploy modern-synthesized stack even if bootstrap stack name is unknown', cdk_1.withDefaultFixture(async (fixture) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwcGluZy5pbnRlZ3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJib290c3RyYXBwaW5nLmludGVndGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0Isd0NBQWtFO0FBQ2xFLDBEQUFvRDtBQUVwRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7SUFDeEYsT0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTO0lBQ3JCLE1BQU8sQ0FBQyxDQUFDLGFBQWE7QUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3REFBd0QsT0FBTyxLQUFLLENBQUMsQ0FBQztBQUUzRix3QkFBUyxDQUFDLGlDQUFpQyxFQUFFLHdCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRTs7SUFDaEYsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUM7SUFFdEQsTUFBTSxPQUFPLENBQUMsa0JBQWtCLENBQUM7UUFDL0IsZ0JBQWdCLEVBQUUsa0JBQWtCO1FBQ3BDLFNBQVMsRUFBRSxJQUFJO0tBQ2hCLENBQUMsQ0FBQztJQUVILE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUU7UUFDOUQsU0FBUyxFQUFFLGtCQUFrQjtLQUM5QixDQUFDLENBQUM7SUFFSCxNQUFNLE9BQUMsSUFBSSxDQUFDLE1BQU0sMENBQUcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3JFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFSix3QkFBUyxDQUFDLG9FQUFvRSxFQUFFLHdCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUs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QUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7S0FDN0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVKLHdCQUFTLENBQUMsNkVBQTZFLEVBQUUsd0JBQWtCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzVILE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDO0lBRXRELE1BQU0sT0FBTyxDQUFDLGtCQUFrQixDQUFDO1FBQy9CLGdCQUFnQixFQUFFLGtCQUFrQjtRQUNwQyxrQkFBa0IsRUFBRSw2Q0FBNkM7S0FDbEUsQ0FBQyxDQUFDO0lBRUgscUNBQXFDO0lBQ3JDLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxFQUFFO1lBQ1AsOEZBQThGO1lBQzlGLHlFQUF5RTtZQUN6RSxzQkFBc0IsRUFBRSx3QkFBd0I7WUFDaEQsV0FBVyxFQUFFLG9DQUFvQyxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ3BFLFdBQVcsRUFBRSx3Q0FBd0M7U0FDdEQ7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHJhbmRvbVN0cmluZywgd2l0aERlZmF1bHRGaXh0dXJlIH0gZnJvbSAnLi4vaGVscGVycy9jZGsnO1xuaW1wb3J0IHsgaW50ZWdUZXN0IH0gZnJvbSAnLi4vaGVscGVycy90ZXN0LWhlbHBlcnMnO1xuXG5jb25zdCB0aW1lb3V0ID0gcHJvY2Vzcy5lbnYuQ09ERUJVSUxEX0JVSUxEX0lEID8gLy8gaWYgdGhlIHByb2Nlc3MgaXMgcnVubmluZyBpbiBDb2RlQnVpbGRcbiAgM182MDBfMDAwIDogLy8gMSBob3VyXG4gIDYwMF8wMDA7IC8vIDEwIG1pbnV0ZXNcbmplc3Quc2V0VGltZW91dCh0aW1lb3V0KTtcbnByb2Nlc3Muc3Rkb3V0LndyaXRlKGBib290c3RyYXBwaW5nLmludGVndGVzdC50czogU2V0dGluZyBqZXN0IHRpbWUgb3V0IHRvICR7dGltZW91dH0gbXNgKTtcblxuaW50ZWdUZXN0KCdjYW4gYm9vdHN0cmFwIHdpdGhvdXQgZXhlY3V0aW9uJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZSA9IGZpeHR1cmUuYm9vdHN0cmFwU3RhY2tOYW1lO1xuXG4gIGF3YWl0IGZpeHR1cmUuY2RrQm9vdHN0cmFwTGVnYWN5KHtcbiAgICB0b29sa2l0U3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUsXG4gICAgbm9FeGVjdXRlOiB0cnVlLFxuICB9KTtcblxuICBjb25zdCByZXNwID0gYXdhaXQgZml4dHVyZS5hd3MuY2xvdWRGb3JtYXRpb24oJ2Rlc2NyaWJlU3RhY2tzJywge1xuICAgIFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICB9KTtcblxuICBleHBlY3QocmVzcC5TdGFja3M/LlswXS5TdGFja1N0YXR1cykudG9FcXVhbCgnUkVWSUVXX0lOX1BST0dSRVNTJyk7XG59KSk7XG5cbmludGVnVGVzdCgndXBncmFkZSBsZWdhY3kgYm9vdHN0cmFwIHN0YWNrIHRvIG5ldyBib290c3RyYXAgc3RhY2sgd2hpbGUgaW4gdXNlJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZSA9IGZpeHR1cmUuYm9vdHN0cmFwU3RhY2tOYW1lO1xuXG4gIGNvbnN0IGxlZ2FjeUJvb3RzdHJhcEJ1Y2tldE5hbWUgPSBgYXdzLWNkay1ib290c3RyYXAtaW50ZWctdGVzdC1sZWdhY3ktYmNrdC0ke3JhbmRvbVN0cmluZygpfWA7XG4gIGNvbnN0IG5ld0Jvb3RzdHJhcEJ1Y2tldE5hbWUgPSBgYXdzLWNkay1ib290c3RyYXAtaW50ZWctdGVzdC12Mi1iY2t0LSR7cmFuZG9tU3RyaW5nKCl9YDtcbiAgZml4dHVyZS5yZW1lbWJlclRvRGVsZXRlQnVja2V0KGxlZ2FjeUJvb3RzdHJhcEJ1Y2tldE5hbWUpOyAvLyBUaGlzIG9uZSB3aWxsIGxlYWtcbiAgZml4dHVyZS5yZW1lbWJlclRvRGVsZXRlQnVja2V0KG5ld0Jvb3RzdHJhcEJ1Y2tldE5hbWUpOyAvLyBUaGlzIG9uZSBzaG91bGRuJ3QgbGVhayBpZiB0aGUgdGVzdCBzdWNjZWVkcywgYnV0IGxldCdzIGJlIHNhZmUgaW4gY2FzZSBpdCBkb2Vzbid0XG5cbiAgLy8gTGVnYWN5IGJvb3RzdHJhcFxuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcExlZ2FjeSh7XG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIGJvb3RzdHJhcEJ1Y2tldE5hbWU6IGxlZ2FjeUJvb3RzdHJhcEJ1Y2tldE5hbWUsXG4gIH0pO1xuXG4gIC8vIERlcGxveSBzdGFjayB0aGF0IHVzZXMgZmlsZSBhc3NldHNcbiAgYXdhaXQgZml4dHVyZS5jZGtEZXBsb3koJ2xhbWJkYScsIHtcbiAgICBvcHRpb25zOiBbJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lXSxcbiAgfSk7XG5cbiAgLy8gVXBncmFkZSBib290c3RyYXAgc3RhY2sgdG8gXCJuZXdcIiBzdHlsZVxuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcE1vZGVybih7XG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIGJvb3RzdHJhcEJ1Y2tldE5hbWU6IG5ld0Jvb3RzdHJhcEJ1Y2tldE5hbWUsXG4gICAgY2ZuRXhlY3V0aW9uUG9saWN5OiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQWRtaW5pc3RyYXRvckFjY2VzcycsXG4gIH0pO1xuXG4gIC8vIChGb3JjZSkgZGVwbG95IHN0YWNrIGFnYWluXG4gIC8vIC0tZm9yY2UgdG8gYnlwYXNzIHRoZSBjaGVjayB3aGljaCBzYXlzIHRoYXQgdGhlIHRlbXBsYXRlIGhhc24ndCBjaGFuZ2VkLlxuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnbGFtYmRhJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICAgICctLWZvcmNlJyxcbiAgICBdLFxuICB9KTtcbn0pKTtcblxuaW50ZWdUZXN0KCdjYW4gYW5kIGRlcGxveSBpZiBvbWl0dGluZyBleGVjdXRpb24gcG9saWNpZXMnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZml4dHVyZS5ib290c3RyYXBTdGFja05hbWU7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBNb2Rlcm4oe1xuICAgIHRvb2xraXRTdGFja05hbWU6IGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgfSk7XG5cbiAgLy8gRGVwbG95IHN0YWNrIHRoYXQgdXNlcyBmaWxlIGFzc2V0c1xuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnbGFtYmRhJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICAgICctLWNvbnRleHQnLCBgQGF3cy1jZGsvY29yZTpib290c3RyYXBRdWFsaWZpZXI9JHtmaXh0dXJlLnF1YWxpZmllcn1gLFxuICAgICAgJy0tY29udGV4dCcsICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9MScsXG4gICAgXSxcbiAgfSk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IG5ldyBzdHlsZSBzeW50aGVzaXMgdG8gbmV3IHN0eWxlIGJvb3RzdHJhcCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBib290c3RyYXBTdGFja05hbWUgPSBmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZTtcblxuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcE1vZGVybih7XG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIGNmbkV4ZWN1dGlvblBvbGljeTogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L0FkbWluaXN0cmF0b3JBY2Nlc3MnLFxuICB9KTtcblxuICAvLyBEZXBsb3kgc3RhY2sgdGhhdCB1c2VzIGZpbGUgYXNzZXRzXG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdsYW1iZGEnLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgICAgJy0tY29udGV4dCcsIGBAYXdzLWNkay9jb3JlOmJvb3RzdHJhcFF1YWxpZmllcj0ke2ZpeHR1cmUucXVhbGlmaWVyfWAsXG4gICAgICAnLS1jb250ZXh0JywgJ0Bhd3MtY2RrL2NvcmU6bmV3U3R5bGVTdGFja1N5bnRoZXNpcz0xJyxcbiAgICBdLFxuICB9KTtcbn0pKTtcblxuaW50ZWdUZXN0KCdkZXBsb3kgbmV3IHN0eWxlIHN5bnRoZXNpcyB0byBuZXcgc3R5bGUgYm9vdHN0cmFwICh3aXRoIGRvY2tlciBpbWFnZSknLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZml4dHVyZS5ib290c3RyYXBTdGFja05hbWU7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBNb2Rlcm4oe1xuICAgIHRvb2xraXRTdGFja05hbWU6IGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICBjZm5FeGVjdXRpb25Qb2xpY3k6ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BZG1pbmlzdHJhdG9yQWNjZXNzJyxcbiAgfSk7XG5cbiAgLy8gRGVwbG95IHN0YWNrIHRoYXQgdXNlcyBmaWxlIGFzc2V0c1xuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnZG9ja2VyJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICAgICctLWNvbnRleHQnLCBgQGF3cy1jZGsvY29yZTpib290c3RyYXBRdWFsaWZpZXI9JHtmaXh0dXJlLnF1YWxpZmllcn1gLFxuICAgICAgJy0tY29udGV4dCcsICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9MScsXG4gICAgXSxcbiAgfSk7XG59KSk7XG5cbmludGVnVGVzdCgnZGVwbG95IG9sZCBzdHlsZSBzeW50aGVzaXMgdG8gbmV3IHN0eWxlIGJvb3RzdHJhcCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBib290c3RyYXBTdGFja05hbWUgPSBmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZTtcblxuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcE1vZGVybih7XG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIGNmbkV4ZWN1dGlvblBvbGljeTogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L0FkbWluaXN0cmF0b3JBY2Nlc3MnLFxuICB9KTtcblxuICAvLyBEZXBsb3kgc3RhY2sgdGhhdCB1c2VzIGZpbGUgYXNzZXRzXG4gIGF3YWl0IGZpeHR1cmUuY2RrRGVwbG95KCdsYW1iZGEnLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIF0sXG4gIH0pO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2NhbiBjcmVhdGUgYSBsZWdhY3kgYm9vdHN0cmFwIHN0YWNrIHdpdGggLS1wdWJsaWMtYWNjZXNzLWJsb2NrLWNvbmZpZ3VyYXRpb249ZmFsc2UnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZml4dHVyZS5ib290c3RyYXBTdGFja05hbWU7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBMZWdhY3koe1xuICAgIHZlcmJvc2U6IHRydWUsXG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIHB1YmxpY0FjY2Vzc0Jsb2NrQ29uZmlndXJhdGlvbjogZmFsc2UsXG4gICAgdGFnczogJ0Zvbz1CYXInLFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUgfSk7XG4gIGV4cGVjdChyZXNwb25zZS5TdGFja3M/LlswXS5UYWdzKS50b0VxdWFsKFtcbiAgICB7IEtleTogJ0ZvbycsIFZhbHVlOiAnQmFyJyB9LFxuICBdKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdjYW4gY3JlYXRlIG11bHRpcGxlIGxlZ2FjeSBib290c3RyYXAgc3RhY2tzJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZTEgPSBgJHtmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZX0tMWA7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZTIgPSBgJHtmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZX0tMmA7XG5cbiAgLy8gZGVwbG95IHR3byB0b29sa2l0IHN0YWNrcyBpbnRvIHRoZSBzYW1lIGVudmlyb25tZW50IChzZWUgIzE0MTYpXG4gIC8vIG9uZSB3aXRoIHRhZ3NcbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBMZWdhY3koe1xuICAgIHZlcmJvc2U6IHRydWUsXG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lMSxcbiAgICB0YWdzOiAnRm9vPUJhcicsXG4gIH0pO1xuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcExlZ2FjeSh7XG4gICAgdmVyYm9zZTogdHJ1ZSxcbiAgICB0b29sa2l0U3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUyLFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUxIH0pO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uVGFncykudG9FcXVhbChbXG4gICAgeyBLZXk6ICdGb28nLCBWYWx1ZTogJ0JhcicgfSxcbiAgXSk7XG59KSk7XG5cbmludGVnVGVzdCgnY2FuIGR1bXAgdGhlIHRlbXBsYXRlLCBtb2RpZnkgYW5kIHVzZSBpdCB0byBkZXBsb3kgYSBjdXN0b20gYm9vdHN0cmFwIHN0YWNrJywgd2l0aERlZmF1bHRGaXh0dXJlKGFzeW5jIChmaXh0dXJlKSA9PiB7XG4gIGxldCB0ZW1wbGF0ZSA9IGF3YWl0IGZpeHR1cmUuY2RrQm9vdHN0cmFwTW9kZXJuKHtcbiAgICAvLyB0b29sa2l0U3RhY2tOYW1lIGRvZXNuJ3QgbWF0dGVyIGZvciB0aGlzIHBhcnRpY3VsYXIgaW52b2NhdGlvblxuICAgIHRvb2xraXRTdGFja05hbWU6IGZpeHR1cmUuYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIHNob3dUZW1wbGF0ZTogdHJ1ZSxcbiAgICBjbGlPcHRpb25zOiB7XG4gICAgICBjYXB0dXJlU3RkZXJyOiBmYWxzZSxcbiAgICB9LFxuICB9KTtcblxuICBleHBlY3QodGVtcGxhdGUpLnRvQ29udGFpbignQm9vdHN0cmFwVmVyc2lvbjonKTtcblxuICB0ZW1wbGF0ZSArPSAnXFxuJyArIFtcbiAgICAnICBUd2lkZGxlRGVlOicsXG4gICAgJyAgICBWYWx1ZTogVGVtcGxhdGUgZ290IHR3aWRkbGVkJyxcbiAgXS5qb2luKCdcXG4nKTtcblxuICBjb25zdCBmaWxlbmFtZSA9IHBhdGguam9pbihmaXh0dXJlLmludGVnVGVzdERpciwgYCR7Zml4dHVyZS5xdWFsaWZpZXJ9LXRlbXBsYXRlLnlhbWxgKTtcbiAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgdGVtcGxhdGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gIGF3YWl0IGZpeHR1cmUuY2RrQm9vdHN0cmFwTW9kZXJuKHtcbiAgICB0b29sa2l0U3RhY2tOYW1lOiBmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICB0ZW1wbGF0ZTogZmlsZW5hbWUsXG4gICAgY2ZuRXhlY3V0aW9uUG9saWN5OiAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQWRtaW5pc3RyYXRvckFjY2VzcycsXG4gIH0pO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ3N3aXRjaCBvbiB0ZXJtaW5hdGlvbiBwcm90ZWN0aW9uLCBzd2l0Y2ggaXMgbGVmdCBhbG9uZSBvbiByZS1ib290c3RyYXAnLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZml4dHVyZS5ib290c3RyYXBTdGFja05hbWU7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBNb2Rlcm4oe1xuICAgIHZlcmJvc2U6IHRydWUsXG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIHRlcm1pbmF0aW9uUHJvdGVjdGlvbjogdHJ1ZSxcbiAgICBjZm5FeGVjdXRpb25Qb2xpY3k6ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BZG1pbmlzdHJhdG9yQWNjZXNzJyxcbiAgfSk7XG4gIGF3YWl0IGZpeHR1cmUuY2RrQm9vdHN0cmFwTW9kZXJuKHtcbiAgICB2ZXJib3NlOiB0cnVlLFxuICAgIHRvb2xraXRTdGFja05hbWU6IGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICBmb3JjZTogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmaXh0dXJlLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7IFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lIH0pO1xuICBleHBlY3QocmVzcG9uc2UuU3RhY2tzPy5bMF0uRW5hYmxlVGVybWluYXRpb25Qcm90ZWN0aW9uKS50b0VxdWFsKHRydWUpO1xufSkpO1xuXG5pbnRlZ1Rlc3QoJ2FkZCB0YWdzLCBsZWZ0IGFsb25lIG9uIHJlLWJvb3RzdHJhcCcsIHdpdGhEZWZhdWx0Rml4dHVyZShhc3luYyAoZml4dHVyZSkgPT4ge1xuICBjb25zdCBib290c3RyYXBTdGFja05hbWUgPSBmaXh0dXJlLmJvb3RzdHJhcFN0YWNrTmFtZTtcblxuICBhd2FpdCBmaXh0dXJlLmNka0Jvb3RzdHJhcE1vZGVybih7XG4gICAgdmVyYm9zZTogdHJ1ZSxcbiAgICB0b29sa2l0U3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUsXG4gICAgdGFnczogJ0Zvbz1CYXInLFxuICAgIGNmbkV4ZWN1dGlvblBvbGljeTogJ2Fybjphd3M6aWFtOjphd3M6cG9saWN5L0FkbWluaXN0cmF0b3JBY2Nlc3MnLFxuICB9KTtcbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBNb2Rlcm4oe1xuICAgIHZlcmJvc2U6IHRydWUsXG4gICAgdG9vbGtpdFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgIGZvcmNlOiB0cnVlLFxuICB9KTtcblxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZpeHR1cmUuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHsgU3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUgfSk7XG4gIGV4cGVjdChyZXNwb25zZS5TdGFja3M/LlswXS5UYWdzKS50b0VxdWFsKFtcbiAgICB7IEtleTogJ0ZvbycsIFZhbHVlOiAnQmFyJyB9LFxuICBdKTtcbn0pKTtcblxuaW50ZWdUZXN0KCdjYW4gZGVwbG95IG1vZGVybi1zeW50aGVzaXplZCBzdGFjayBldmVuIGlmIGJvb3RzdHJhcCBzdGFjayBuYW1lIGlzIHVua25vd24nLCB3aXRoRGVmYXVsdEZpeHR1cmUoYXN5bmMgKGZpeHR1cmUpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZml4dHVyZS5ib290c3RyYXBTdGFja05hbWU7XG5cbiAgYXdhaXQgZml4dHVyZS5jZGtCb290c3RyYXBNb2Rlcm4oe1xuICAgIHRvb2xraXRTdGFja05hbWU6IGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICBjZm5FeGVjdXRpb25Qb2xpY3k6ICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BZG1pbmlzdHJhdG9yQWNjZXNzJyxcbiAgfSk7XG5cbiAgLy8gRGVwbG95IHN0YWNrIHRoYXQgdXNlcyBmaWxlIGFzc2V0c1xuICBhd2FpdCBmaXh0dXJlLmNka0RlcGxveSgnbGFtYmRhJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgIC8vIEV4cGxpY2l0eSBwYXNzIGEgbmFtZSB0aGF0J3Mgc3VyZSB0byBub3QgZXhpc3QsIG90aGVyd2lzZSB0aGUgQ0xJIG1pZ2h0IGFjY2lkZW50YWxseSBmaW5kIGFcbiAgICAgIC8vIGRlZmF1bHQgYm9vdHN0cmFjcCBzdGFjayBpZiB0aGF0IGhhcHBlbnMgdG8gYmUgaW4gdGhlIGFjY291bnQgYWxyZWFkeS5cbiAgICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsICdEZWZpbml0ZWx5RG9lc05vdEV4aXN0JyxcbiAgICAgICctLWNvbnRleHQnLCBgQGF3cy1jZGsvY29yZTpib290c3RyYXBRdWFsaWZpZXI9JHtmaXh0dXJlLnF1YWxpZmllcn1gLFxuICAgICAgJy0tY29udGV4dCcsICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9MScsXG4gICAgXSxcbiAgfSk7XG59KSk7XG4iXX0=