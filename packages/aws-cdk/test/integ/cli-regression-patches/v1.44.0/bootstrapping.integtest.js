"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_helpers_1 = require("./aws-helpers");
const cdk_helpers_1 = require("./cdk-helpers");
jest.setTimeout(600000);
const QUALIFIER = randomString();
beforeAll(async () => {
    await cdk_helpers_1.prepareAppFixture();
});
beforeEach(async () => {
    await cdk_helpers_1.cleanup();
});
afterEach(async () => {
    await cdk_helpers_1.cleanup();
});
test('can bootstrap without execution', async () => {
    var _a;
    const bootstrapStackName = cdk_helpers_1.fullStackName('bootstrap-stack');
    await cdk_helpers_1.cdk(['bootstrap',
        '--toolkit-stack-name', bootstrapStackName,
        '--no-execute']);
    const resp = await aws_helpers_1.cloudFormation('describeStacks', {
        StackName: bootstrapStackName,
    });
    expect((_a = resp.Stacks) === null || _a === void 0 ? void 0 : _a[0].StackStatus).toEqual('REVIEW_IN_PROGRESS');
});
test('upgrade legacy bootstrap stack to new bootstrap stack while in use', async () => {
    const bootstrapStackName = cdk_helpers_1.fullStackName('bootstrap-stack');
    const legacyBootstrapBucketName = `aws-cdk-bootstrap-integ-test-legacy-bckt-${randomString()}`;
    const newBootstrapBucketName = `aws-cdk-bootstrap-integ-test-v2-bckt-${randomString()}`;
    cdk_helpers_1.rememberToDeleteBucket(legacyBootstrapBucketName); // This one will leak
    cdk_helpers_1.rememberToDeleteBucket(newBootstrapBucketName); // This one shouldn't leak if the test succeeds, but let's be safe in case it doesn't
    // Legacy bootstrap
    await cdk_helpers_1.cdk(['bootstrap',
        '--toolkit-stack-name', bootstrapStackName,
        '--bootstrap-bucket-name', legacyBootstrapBucketName]);
    // Deploy stack that uses file assets
    await cdk_helpers_1.cdkDeploy('lambda', {
        options: ['--toolkit-stack-name', bootstrapStackName],
    });
    // Upgrade bootstrap stack to "new" style
    await cdk_helpers_1.cdk(['bootstrap',
        '--toolkit-stack-name', bootstrapStackName,
        '--bootstrap-bucket-name', newBootstrapBucketName,
        '--qualifier', QUALIFIER], {
        modEnv: {
            CDK_NEW_BOOTSTRAP: '1',
        },
    });
    // (Force) deploy stack again
    // --force to bypass the check which says that the template hasn't changed.
    await cdk_helpers_1.cdkDeploy('lambda', {
        options: [
            '--toolkit-stack-name', bootstrapStackName,
            '--force',
        ],
    });
});
test.skip('deploy new style synthesis to new style bootstrap', async () => {
    const bootstrapStackName = cdk_helpers_1.fullStackName('bootstrap-stack');
    await cdk_helpers_1.cdk(['bootstrap',
        '--toolkit-stack-name', bootstrapStackName,
        '--qualifier', QUALIFIER,
        '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess',
    ], {
        modEnv: {
            CDK_NEW_BOOTSTRAP: '1',
        },
    });
    // Deploy stack that uses file assets
    await cdk_helpers_1.cdkDeploy('lambda', {
        options: [
            '--toolkit-stack-name', bootstrapStackName,
            '--context', `@aws-cdk/core:bootstrapQualifier=${QUALIFIER}`,
            '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
        ],
    });
});
test('deploy old style synthesis to new style bootstrap', async () => {
    const bootstrapStackName = cdk_helpers_1.fullStackName('bootstrap-stack');
    await cdk_helpers_1.cdk(['bootstrap',
        '--toolkit-stack-name', bootstrapStackName,
        '--qualifier', QUALIFIER,
        '--cloudformation-execution-policies', 'arn:aws:iam::aws:policy/AdministratorAccess',
    ], {
        modEnv: {
            CDK_NEW_BOOTSTRAP: '1',
        },
    });
    // Deploy stack that uses file assets
    await cdk_helpers_1.cdkDeploy('lambda', {
        options: [
            '--toolkit-stack-name', bootstrapStackName,
        ],
    });
});
test('deploying new style synthesis to old style bootstrap fails', async () => {
    const bootstrapStackName = cdk_helpers_1.fullStackName('bootstrap-stack');
    await cdk_helpers_1.cdk(['bootstrap', '--toolkit-stack-name', bootstrapStackName]);
    // Deploy stack that uses file assets, this fails because the bootstrap stack
    // is version checked.
    await expect(cdk_helpers_1.cdkDeploy('lambda', {
        options: [
            '--toolkit-stack-name', bootstrapStackName,
            '--context', '@aws-cdk/core:newStyleStackSynthesis=1',
        ],
    })).rejects.toThrow('exited with error');
});
test('can create multiple legacy bootstrap stacks', async () => {
    var _a;
    const bootstrapStackName1 = cdk_helpers_1.fullStackName('bootstrap-stack-1');
    const bootstrapStackName2 = cdk_helpers_1.fullStackName('bootstrap-stack-2');
    // deploy two toolkit stacks into the same environment (see #1416)
    // one with tags
    await cdk_helpers_1.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName1, '--tags', 'Foo=Bar']);
    await cdk_helpers_1.cdk(['bootstrap', '-v', '--toolkit-stack-name', bootstrapStackName2]);
    const response = await aws_helpers_1.cloudFormation('describeStacks', { StackName: bootstrapStackName1 });
    expect((_a = response.Stacks) === null || _a === void 0 ? void 0 : _a[0].Tags).toEqual([
        { Key: 'Foo', Value: 'Bar' },
    ]);
});
function randomString() {
    // Crazy
    return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwcGluZy5pbnRlZ3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJib290c3RyYXBwaW5nLmludGVndGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUErQztBQUMvQywrQ0FBa0g7QUFFbEgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFPLENBQUMsQ0FBQztBQUV6QixNQUFNLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQztBQUVqQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDbkIsTUFBTSwrQkFBaUIsRUFBRSxDQUFDO0FBQzVCLENBQUMsQ0FBQyxDQUFDO0FBRUgsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3BCLE1BQU0scUJBQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ25CLE1BQU0scUJBQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFOztJQUNqRCxNQUFNLGtCQUFrQixHQUFHLDJCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUU1RCxNQUFNLGlCQUFHLENBQUMsQ0FBQyxXQUFXO1FBQ3BCLHNCQUFzQixFQUFFLGtCQUFrQjtRQUMxQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBRW5CLE1BQU0sSUFBSSxHQUFHLE1BQU0sNEJBQWMsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNsRCxTQUFTLEVBQUUsa0JBQWtCO0tBQzlCLENBQUMsQ0FBQztJQUVILE1BQU0sT0FBQyxJQUFJLENBQUMsTUFBTSwwQ0FBRyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDckUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsb0VBQW9FLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDcEYsTUFBTSxrQkFB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RSxDQUFDLENBQUM7QUFDL0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi9hd3MtaGVscGVycyc7XG5pbXBvcnQgeyBjZGssIGNka0RlcGxveSwgY2xlYW51cCwgZnVsbFN0YWNrTmFtZSwgcHJlcGFyZUFwcEZpeHR1cmUsIHJlbWVtYmVyVG9EZWxldGVCdWNrZXQgfSBmcm9tICcuL2Nkay1oZWxwZXJzJztcblxuamVzdC5zZXRUaW1lb3V0KDYwMF8wMDApO1xuXG5jb25zdCBRVUFMSUZJRVIgPSByYW5kb21TdHJpbmcoKTtcblxuYmVmb3JlQWxsKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgcHJlcGFyZUFwcEZpeHR1cmUoKTtcbn0pO1xuXG5iZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgY2xlYW51cCgpO1xufSk7XG5cbmFmdGVyRWFjaChhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGNsZWFudXAoKTtcbn0pO1xuXG50ZXN0KCdjYW4gYm9vdHN0cmFwIHdpdGhvdXQgZXhlY3V0aW9uJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBib290c3RyYXBTdGFja05hbWUgPSBmdWxsU3RhY2tOYW1lKCdib290c3RyYXAtc3RhY2snKTtcblxuICBhd2FpdCBjZGsoWydib290c3RyYXAnLFxuICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICAnLS1uby1leGVjdXRlJ10pO1xuXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBjbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7XG4gICAgU3RhY2tOYW1lOiBib290c3RyYXBTdGFja05hbWUsXG4gIH0pO1xuXG4gIGV4cGVjdChyZXNwLlN0YWNrcz8uWzBdLlN0YWNrU3RhdHVzKS50b0VxdWFsKCdSRVZJRVdfSU5fUFJPR1JFU1MnKTtcbn0pO1xuXG50ZXN0KCd1cGdyYWRlIGxlZ2FjeSBib290c3RyYXAgc3RhY2sgdG8gbmV3IGJvb3RzdHJhcCBzdGFjayB3aGlsZSBpbiB1c2UnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZSA9IGZ1bGxTdGFja05hbWUoJ2Jvb3RzdHJhcC1zdGFjaycpO1xuXG4gIGNvbnN0IGxlZ2FjeUJvb3RzdHJhcEJ1Y2tldE5hbWUgPSBgYXdzLWNkay1ib290c3RyYXAtaW50ZWctdGVzdC1sZWdhY3ktYmNrdC0ke3JhbmRvbVN0cmluZygpfWA7XG4gIGNvbnN0IG5ld0Jvb3RzdHJhcEJ1Y2tldE5hbWUgPSBgYXdzLWNkay1ib290c3RyYXAtaW50ZWctdGVzdC12Mi1iY2t0LSR7cmFuZG9tU3RyaW5nKCl9YDtcbiAgcmVtZW1iZXJUb0RlbGV0ZUJ1Y2tldChsZWdhY3lCb290c3RyYXBCdWNrZXROYW1lKTsgIC8vIFRoaXMgb25lIHdpbGwgbGVha1xuICByZW1lbWJlclRvRGVsZXRlQnVja2V0KG5ld0Jvb3RzdHJhcEJ1Y2tldE5hbWUpOyAgICAgLy8gVGhpcyBvbmUgc2hvdWxkbid0IGxlYWsgaWYgdGhlIHRlc3Qgc3VjY2VlZHMsIGJ1dCBsZXQncyBiZSBzYWZlIGluIGNhc2UgaXQgZG9lc24ndFxuXG4gIC8vIExlZ2FjeSBib290c3RyYXBcbiAgYXdhaXQgY2RrKFsnYm9vdHN0cmFwJyxcbiAgICAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUsXG4gICAgJy0tYm9vdHN0cmFwLWJ1Y2tldC1uYW1lJywgbGVnYWN5Qm9vdHN0cmFwQnVja2V0TmFtZV0pO1xuXG4gIC8vIERlcGxveSBzdGFjayB0aGF0IHVzZXMgZmlsZSBhc3NldHNcbiAgYXdhaXQgY2RrRGVwbG95KCdsYW1iZGEnLCB7XG4gICAgb3B0aW9uczogWyctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZV0sXG4gIH0pO1xuXG4gIC8vIFVwZ3JhZGUgYm9vdHN0cmFwIHN0YWNrIHRvIFwibmV3XCIgc3R5bGVcbiAgYXdhaXQgY2RrKFsnYm9vdHN0cmFwJyxcbiAgICAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUsXG4gICAgJy0tYm9vdHN0cmFwLWJ1Y2tldC1uYW1lJywgbmV3Qm9vdHN0cmFwQnVja2V0TmFtZSxcbiAgICAnLS1xdWFsaWZpZXInLCBRVUFMSUZJRVJdLCB7XG4gICAgbW9kRW52OiB7XG4gICAgICBDREtfTkVXX0JPT1RTVFJBUDogJzEnLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIChGb3JjZSkgZGVwbG95IHN0YWNrIGFnYWluXG4gIC8vIC0tZm9yY2UgdG8gYnlwYXNzIHRoZSBjaGVjayB3aGljaCBzYXlzIHRoYXQgdGhlIHRlbXBsYXRlIGhhc24ndCBjaGFuZ2VkLlxuICBhd2FpdCBjZGtEZXBsb3koJ2xhbWJkYScsIHtcbiAgICBvcHRpb25zOiBbXG4gICAgICAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUsXG4gICAgICAnLS1mb3JjZScsXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95IG5ldyBzdHlsZSBzeW50aGVzaXMgdG8gbmV3IHN0eWxlIGJvb3RzdHJhcCcsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZnVsbFN0YWNrTmFtZSgnYm9vdHN0cmFwLXN0YWNrJyk7XG5cbiAgYXdhaXQgY2RrKFsnYm9vdHN0cmFwJyxcbiAgICAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUsXG4gICAgJy0tcXVhbGlmaWVyJywgUVVBTElGSUVSLFxuICAgICctLWNsb3VkZm9ybWF0aW9uLWV4ZWN1dGlvbi1wb2xpY2llcycsICdhcm46YXdzOmlhbTo6YXdzOnBvbGljeS9BZG1pbmlzdHJhdG9yQWNjZXNzJyxcbiAgXSwge1xuICAgIG1vZEVudjoge1xuICAgICAgQ0RLX05FV19CT09UU1RSQVA6ICcxJyxcbiAgICB9LFxuICB9KTtcblxuICAvLyBEZXBsb3kgc3RhY2sgdGhhdCB1c2VzIGZpbGUgYXNzZXRzXG4gIGF3YWl0IGNka0RlcGxveSgnbGFtYmRhJywge1xuICAgIG9wdGlvbnM6IFtcbiAgICAgICctLXRvb2xraXQtc3RhY2stbmFtZScsIGJvb3RzdHJhcFN0YWNrTmFtZSxcbiAgICAgICctLWNvbnRleHQnLCBgQGF3cy1jZGsvY29yZTpib290c3RyYXBRdWFsaWZpZXI9JHtRVUFMSUZJRVJ9YCxcbiAgICAgICctLWNvbnRleHQnLCAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzPTEnLFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RlcGxveSBvbGQgc3R5bGUgc3ludGhlc2lzIHRvIG5ldyBzdHlsZSBib290c3RyYXAnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGJvb3RzdHJhcFN0YWNrTmFtZSA9IGZ1bGxTdGFja05hbWUoJ2Jvb3RzdHJhcC1zdGFjaycpO1xuXG4gIGF3YWl0IGNkayhbJ2Jvb3RzdHJhcCcsXG4gICAgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgICctLXF1YWxpZmllcicsIFFVQUxJRklFUixcbiAgICAnLS1jbG91ZGZvcm1hdGlvbi1leGVjdXRpb24tcG9saWNpZXMnLCAnYXJuOmF3czppYW06OmF3czpwb2xpY3kvQWRtaW5pc3RyYXRvckFjY2VzcycsXG4gIF0sIHtcbiAgICBtb2RFbnY6IHtcbiAgICAgIENES19ORVdfQk9PVFNUUkFQOiAnMScsXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gRGVwbG95IHN0YWNrIHRoYXQgdXNlcyBmaWxlIGFzc2V0c1xuICBhd2FpdCBjZGtEZXBsb3koJ2xhbWJkYScsIHtcbiAgICBvcHRpb25zOiBbXG4gICAgICAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUsXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVwbG95aW5nIG5ldyBzdHlsZSBzeW50aGVzaXMgdG8gb2xkIHN0eWxlIGJvb3RzdHJhcCBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lID0gZnVsbFN0YWNrTmFtZSgnYm9vdHN0cmFwLXN0YWNrJyk7XG5cbiAgYXdhaXQgY2RrKFsnYm9vdHN0cmFwJywgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lXSk7XG5cbiAgLy8gRGVwbG95IHN0YWNrIHRoYXQgdXNlcyBmaWxlIGFzc2V0cywgdGhpcyBmYWlscyBiZWNhdXNlIHRoZSBib290c3RyYXAgc3RhY2tcbiAgLy8gaXMgdmVyc2lvbiBjaGVja2VkLlxuICBhd2FpdCBleHBlY3QoY2RrRGVwbG95KCdsYW1iZGEnLCB7XG4gICAgb3B0aW9uczogW1xuICAgICAgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lLFxuICAgICAgJy0tY29udGV4dCcsICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXM9MScsXG4gICAgXSxcbiAgfSkpLnJlamVjdHMudG9UaHJvdygnZXhpdGVkIHdpdGggZXJyb3InKTtcbn0pO1xuXG50ZXN0KCdjYW4gY3JlYXRlIG11bHRpcGxlIGxlZ2FjeSBib290c3RyYXAgc3RhY2tzJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBib290c3RyYXBTdGFja05hbWUxID0gZnVsbFN0YWNrTmFtZSgnYm9vdHN0cmFwLXN0YWNrLTEnKTtcbiAgY29uc3QgYm9vdHN0cmFwU3RhY2tOYW1lMiA9IGZ1bGxTdGFja05hbWUoJ2Jvb3RzdHJhcC1zdGFjay0yJyk7XG5cbiAgLy8gZGVwbG95IHR3byB0b29sa2l0IHN0YWNrcyBpbnRvIHRoZSBzYW1lIGVudmlyb25tZW50IChzZWUgIzE0MTYpXG4gIC8vIG9uZSB3aXRoIHRhZ3NcbiAgYXdhaXQgY2RrKFsnYm9vdHN0cmFwJywgJy12JywgJy0tdG9vbGtpdC1zdGFjay1uYW1lJywgYm9vdHN0cmFwU3RhY2tOYW1lMSwgJy0tdGFncycsICdGb289QmFyJ10pO1xuICBhd2FpdCBjZGsoWydib290c3RyYXAnLCAnLXYnLCAnLS10b29sa2l0LXN0YWNrLW5hbWUnLCBib290c3RyYXBTdGFja05hbWUyXSk7XG5cbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7IFN0YWNrTmFtZTogYm9vdHN0cmFwU3RhY2tOYW1lMSB9KTtcbiAgZXhwZWN0KHJlc3BvbnNlLlN0YWNrcz8uWzBdLlRhZ3MpLnRvRXF1YWwoW1xuICAgIHsgS2V5OiAnRm9vJywgVmFsdWU6ICdCYXInIH0sXG4gIF0pO1xufSk7XG5cbmZ1bmN0aW9uIHJhbmRvbVN0cmluZygpIHtcbiAgLy8gQ3JhenlcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnJlcGxhY2UoL1teYS16MC05XSsvZywgJycpO1xufVxuIl19
