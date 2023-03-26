"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('image asset', () => {
    const tarballFile = path.join(__dirname, 'demo-tarball', 'empty.tar');
    test('test instantiating Asset Image', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app);
        const asset = new lib_1.TarballImageAsset(stack, 'Image', {
            tarballFile,
        });
        // WHEN
        const asm = app.synth();
        // THEN
        const manifestArtifact = getAssetManifest(asm);
        const manifest = readAssetManifest(manifestArtifact);
        expect(Object.keys(manifest.files ?? {}).length).toBe(1);
        expect(Object.keys(manifest.dockerImages ?? {}).length).toBe(1);
        expect(manifest.dockerImages?.[asset.assetHash]?.destinations?.['current_account-current_region']).toStrictEqual({
            assumeRoleArn: 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-hnb659fds-image-publishing-role-${AWS::AccountId}-${AWS::Region}',
            imageTag: asset.assetHash,
            repositoryName: 'cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}',
        });
        expect(manifest.dockerImages?.[asset.assetHash]?.source).toStrictEqual({
            executable: [
                'sh',
                '-c',
                `docker load -i asset.${asset.assetHash}.tar | tail -n 1 | sed "s/Loaded image: //g"`,
            ],
        });
        // AssetStaging in TarballImageAsset uses `this` as scope'
        expect(asset.node.tryFindChild('Staging')).toBeDefined();
    });
    test('asset.repository.grantPull can be used to grant a principal permissions to use the image', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'MyUser');
        const asset = new lib_1.TarballImageAsset(stack, 'Image', {
            tarballFile,
        });
        // WHEN
        asset.repository.grantPull(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                'Statement': [
                    {
                        'Action': [
                            'ecr:BatchCheckLayerAvailability',
                            'ecr:GetDownloadUrlForLayer',
                            'ecr:BatchGetImage',
                        ],
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        'Ref': 'AWS::Partition',
                                    },
                                    ':ecr:',
                                    {
                                        'Ref': 'AWS::Region',
                                    },
                                    ':',
                                    {
                                        'Ref': 'AWS::AccountId',
                                    },
                                    ':repository/',
                                    {
                                        'Fn::Sub': 'cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}',
                                    },
                                ],
                            ],
                        },
                    },
                    {
                        'Action': 'ecr:GetAuthorizationToken',
                        'Effect': 'Allow',
                        'Resource': '*',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'MyUserDefaultPolicy7B897426',
            'Users': [
                {
                    'Ref': 'MyUserDC45028B',
                },
            ],
        });
    });
    test('docker directory is staged if asset staging is enabled', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app);
        const image = new lib_1.TarballImageAsset(stack, 'MyAsset', {
            tarballFile,
        });
        const session = app.synth();
        expect(fs.existsSync(path.join(session.directory, `asset.${image.assetHash}.tar`))).toBe(true);
    });
    test('fails if the file does not exist', () => {
        const stack = new core_1.Stack();
        // THEN
        expect(() => {
            new lib_1.TarballImageAsset(stack, 'MyAsset', {
                tarballFile: `/does/not/exist/${Math.floor(Math.random() * 9999)}`,
            });
        }).toThrow(/Cannot find file at/);
    });
    describe('imageTag is correct for different stack synthesizers', () => {
        const stack1 = new core_1.Stack();
        const stack2 = new core_1.Stack(undefined, undefined, {
            synthesizer: new core_1.DefaultStackSynthesizer({
                dockerTagPrefix: 'banana',
            }),
        });
        const asset1 = new lib_1.TarballImageAsset(stack1, 'MyAsset', {
            tarballFile,
        });
        const asset2 = new lib_1.TarballImageAsset(stack2, 'MyAsset', {
            tarballFile,
        });
        test('stack with default synthesizer', () => {
            expect(asset1.assetHash).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
            expect(asset1.imageTag).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
        });
        test('stack with overwritten synthesizer', () => {
            expect(asset2.assetHash).toEqual('95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
            expect(asset2.imageTag).toEqual('banana95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df');
        });
    });
});
function isAssetManifest(x) {
    return x instanceof cxapi.AssetManifestArtifact;
}
function getAssetManifest(asm) {
    const manifestArtifact = asm.artifacts.filter(isAssetManifest)[0];
    if (!manifestArtifact) {
        throw new Error('no asset manifest in assembly');
    }
    return manifestArtifact;
}
function readAssetManifest(manifestArtifact) {
    return JSON.parse(fs.readFileSync(manifestArtifact.file, { encoding: 'utf-8' }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyYmFsbC1hc3NldC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFyYmFsbC1hc3NldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixvREFBK0M7QUFDL0Msd0NBQXdDO0FBRXhDLHdDQUFvRTtBQUNwRSx5Q0FBeUM7QUFDekMsZ0NBQTJDO0FBRTNDLGdDQUFnQztBQUdoQyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEUsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUMxQyxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUFpQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDbEQsV0FBVztTQUNaLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFeEIsT0FBTztRQUNQLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVyRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FB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cG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgVGFyYmFsbEltYWdlQXNzZXQgfSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5cbmRlc2NyaWJlKCdpbWFnZSBhc3NldCcsICgpID0+IHtcbiAgY29uc3QgdGFyYmFsbEZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZGVtby10YXJiYWxsJywgJ2VtcHR5LnRhcicpO1xuICB0ZXN0KCd0ZXN0IGluc3RhbnRpYXRpbmcgQXNzZXQgSW1hZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBhc3NldCA9IG5ldyBUYXJiYWxsSW1hZ2VBc3NldChzdGFjaywgJ0ltYWdlJywge1xuICAgICAgdGFyYmFsbEZpbGUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KG1hbmlmZXN0QXJ0aWZhY3QpO1xuXG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzID8/IHt9KS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmRvY2tlckltYWdlcyA/PyB7fSkubGVuZ3RoKS50b0JlKDEpO1xuXG4gICAgZXhwZWN0KG1hbmlmZXN0LmRvY2tlckltYWdlcz8uW2Fzc2V0LmFzc2V0SGFzaF0/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXSkudG9TdHJpY3RFcXVhbChcbiAgICAgIHtcbiAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLWhuYjY1OWZkcy1pbWFnZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICBpbWFnZVRhZzogYXNzZXQuYXNzZXRIYXNoLFxuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ2Nkay1obmI2NTlmZHMtY29udGFpbmVyLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBleHBlY3QobWFuaWZlc3QuZG9ja2VySW1hZ2VzPy5bYXNzZXQuYXNzZXRIYXNoXT8uc291cmNlKS50b1N0cmljdEVxdWFsKFxuICAgICAge1xuICAgICAgICBleGVjdXRhYmxlOiBbXG4gICAgICAgICAgJ3NoJyxcbiAgICAgICAgICAnLWMnLFxuICAgICAgICAgIGBkb2NrZXIgbG9hZCAtaSBhc3NldC4ke2Fzc2V0LmFzc2V0SGFzaH0udGFyIHwgdGFpbCAtbiAxIHwgc2VkIFwicy9Mb2FkZWQgaW1hZ2U6IC8vZ1wiYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIC8vIEFzc2V0U3RhZ2luZyBpbiBUYXJiYWxsSW1hZ2VBc3NldCB1c2VzIGB0aGlzYCBhcyBzY29wZSdcbiAgICBleHBlY3QoYXNzZXQubm9kZS50cnlGaW5kQ2hpbGQoJ1N0YWdpbmcnKSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXQucmVwb3NpdG9yeS5ncmFudFB1bGwgY2FuIGJlIHVzZWQgdG8gZ3JhbnQgYSBwcmluY2lwYWwgcGVybWlzc2lvbnMgdG8gdXNlIHRoZSBpbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgIGNvbnN0IGFzc2V0ID0gbmV3IFRhcmJhbGxJbWFnZUFzc2V0KHN0YWNrLCAnSW1hZ2UnLCB7XG4gICAgICB0YXJiYWxsRmlsZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhc3NldC5yZXBvc2l0b3J5LmdyYW50UHVsbCh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAnZWNyOkJhdGNoR2V0SW1hZ2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmVjcjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cmVwb3NpdG9yeS8nLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdjZGstaG5iNjU5ZmRzLWNvbnRhaW5lci1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICAnUG9saWN5TmFtZSc6ICdNeVVzZXJEZWZhdWx0UG9saWN5N0I4OTc0MjYnLFxuICAgICAgJ1VzZXJzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdNeVVzZXJEQzQ1MDI4QicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkb2NrZXIgZGlyZWN0b3J5IGlzIHN0YWdlZCBpZiBhc3NldCBzdGFnaW5nIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgVGFyYmFsbEltYWdlQXNzZXQoc3RhY2ssICdNeUFzc2V0Jywge1xuICAgICAgdGFyYmFsbEZpbGUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZXNzaW9uID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oc2Vzc2lvbi5kaXJlY3RvcnksIGBhc3NldC4ke2ltYWdlLmFzc2V0SGFzaH0udGFyYCkpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiB0aGUgZmlsZSBkb2VzIG5vdCBleGlzdCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFRhcmJhbGxJbWFnZUFzc2V0KHN0YWNrLCAnTXlBc3NldCcsIHtcbiAgICAgICAgdGFyYmFsbEZpbGU6IGAvZG9lcy9ub3QvZXhpc3QvJHtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5OTk5KX1gLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IGZpbmQgZmlsZSBhdC8pO1xuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbWFnZVRhZyBpcyBjb3JyZWN0IGZvciBkaWZmZXJlbnQgc3RhY2sgc3ludGhlc2l6ZXJzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIGRvY2tlclRhZ1ByZWZpeDogJ2JhbmFuYScsXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBjb25zdCBhc3NldDEgPSBuZXcgVGFyYmFsbEltYWdlQXNzZXQoc3RhY2sxLCAnTXlBc3NldCcsIHtcbiAgICAgIHRhcmJhbGxGaWxlLFxuICAgIH0pO1xuICAgIGNvbnN0IGFzc2V0MiA9IG5ldyBUYXJiYWxsSW1hZ2VBc3NldChzdGFjazIsICdNeUFzc2V0Jywge1xuICAgICAgdGFyYmFsbEZpbGUsXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzdGFjayB3aXRoIGRlZmF1bHQgc3ludGhlc2l6ZXInLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYXNzZXQxLmFzc2V0SGFzaCkudG9FcXVhbCgnOTVjOTI0Yzg0ZjVkMDIzYmU0ZWRlZTU0MGNiMmNiNDAxYTQ5ZjExNWQwMWVkNDAzYjI4OGY2Y2I0MTI3NzFkZicpO1xuICAgICAgZXhwZWN0KGFzc2V0MS5pbWFnZVRhZykudG9FcXVhbCgnOTVjOTI0Yzg0ZjVkMDIzYmU0ZWRlZTU0MGNiMmNiNDAxYTQ5ZjExNWQwMWVkNDAzYjI4OGY2Y2I0MTI3NzFkZicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3RhY2sgd2l0aCBvdmVyd3JpdHRlbiBzeW50aGVzaXplcicsICgpID0+IHtcbiAgICAgIGV4cGVjdChhc3NldDIuYXNzZXRIYXNoKS50b0VxdWFsKCc5NWM5MjRjODRmNWQwMjNiZTRlZGVlNTQwY2IyY2I0MDFhNDlmMTE1ZDAxZWQ0MDNiMjg4ZjZjYjQxMjc3MWRmJyk7XG4gICAgICBleHBlY3QoYXNzZXQyLmltYWdlVGFnKS50b0VxdWFsKCdiYW5hbmE5NWM5MjRjODRmNWQwMjNiZTRlZGVlNTQwY2IyY2I0MDFhNDlmMTE1ZDAxZWQ0MDNiMjg4ZjZjYjQxMjc3MWRmJyk7XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gaXNBc3NldE1hbmlmZXN0KHg6IGN4YXBpLkNsb3VkQXJ0aWZhY3QpOiB4IGlzIGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdCB7XG4gIHJldHVybiB4IGluc3RhbmNlb2YgY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0O1xufVxuXG5mdW5jdGlvbiBnZXRBc3NldE1hbmlmZXN0KGFzbTogY3hhcGkuQ2xvdWRBc3NlbWJseSk6IGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdCB7XG4gIGNvbnN0IG1hbmlmZXN0QXJ0aWZhY3QgPSBhc20uYXJ0aWZhY3RzLmZpbHRlcihpc0Fzc2V0TWFuaWZlc3QpWzBdO1xuICBpZiAoIW1hbmlmZXN0QXJ0aWZhY3QpIHsgdGhyb3cgbmV3IEVycm9yKCdubyBhc3NldCBtYW5pZmVzdCBpbiBhc3NlbWJseScpOyB9XG4gIHJldHVybiBtYW5pZmVzdEFydGlmYWN0O1xufVxuXG5mdW5jdGlvbiByZWFkQXNzZXRNYW5pZmVzdChtYW5pZmVzdEFydGlmYWN0OiBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3QpOiBjeHNjaGVtYS5Bc3NldE1hbmlmZXN0IHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKG1hbmlmZXN0QXJ0aWZhY3QuZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG59XG4iXX0=