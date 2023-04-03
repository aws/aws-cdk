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
    test('test instantiating Asset Image', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app);
        const asset = new lib_1.TarballImageAsset(stack, 'Image', {
            tarballFile: __dirname + '/demo-tarball/empty.tar',
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
            tarballFile: 'test/demo-tarball/empty.tar',
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
            tarballFile: 'test/demo-tarball/empty.tar',
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
            tarballFile: 'test/demo-tarball/empty.tar',
        });
        const asset2 = new lib_1.TarballImageAsset(stack2, 'MyAsset', {
            tarballFile: 'test/demo-tarball/empty.tar',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFyYmFsbC1hc3NldC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFyYmFsbC1hc3NldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixvREFBK0M7QUFDL0Msd0NBQXdDO0FBRXhDLHdDQUFvRTtBQUNwRSx5Q0FBeUM7QUFDekMsZ0NBQTJDO0FBRTNDLGdDQUFnQztBQUdoQyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1FBQzFDLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksdUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUNsRCxXQUFXLEVBQUUsU0FBUyxHQUFHLHlCQUF5QjtTQUNuRCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLE9BQU87UUFDUCxNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFckQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEUs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b3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBUYXJiYWxsSW1hZ2VBc3NldCB9IGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cblxuZGVzY3JpYmUoJ2ltYWdlIGFzc2V0JywgKCkgPT4ge1xuICB0ZXN0KCd0ZXN0IGluc3RhbnRpYXRpbmcgQXNzZXQgSW1hZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBhc3NldCA9IG5ldyBUYXJiYWxsSW1hZ2VBc3NldChzdGFjaywgJ0ltYWdlJywge1xuICAgICAgdGFyYmFsbEZpbGU6IF9fZGlybmFtZSArICcvZGVtby10YXJiYWxsL2VtcHR5LnRhcicsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNtID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbWFuaWZlc3RBcnRpZmFjdCA9IGdldEFzc2V0TWFuaWZlc3QoYXNtKTtcbiAgICBjb25zdCBtYW5pZmVzdCA9IHJlYWRBc3NldE1hbmlmZXN0KG1hbmlmZXN0QXJ0aWZhY3QpO1xuXG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmZpbGVzID8/IHt9KS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgZXhwZWN0KE9iamVjdC5rZXlzKG1hbmlmZXN0LmRvY2tlckltYWdlcyA/PyB7fSkubGVuZ3RoKS50b0JlKDEpO1xuXG4gICAgZXhwZWN0KG1hbmlmZXN0LmRvY2tlckltYWdlcz8uW2Fzc2V0LmFzc2V0SGFzaF0/LmRlc3RpbmF0aW9ucz8uWydjdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nXSkudG9TdHJpY3RFcXVhbChcbiAgICAgIHtcbiAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OiR7QVdTOjpBY2NvdW50SWR9OnJvbGUvY2RrLWhuYjY1OWZkcy1pbWFnZS1wdWJsaXNoaW5nLXJvbGUtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICBpbWFnZVRhZzogYXNzZXQuYXNzZXRIYXNoLFxuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ2Nkay1obmI2NTlmZHMtY29udGFpbmVyLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBleHBlY3QobWFuaWZlc3QuZG9ja2VySW1hZ2VzPy5bYXNzZXQuYXNzZXRIYXNoXT8uc291cmNlKS50b1N0cmljdEVxdWFsKFxuICAgICAge1xuICAgICAgICBleGVjdXRhYmxlOiBbXG4gICAgICAgICAgJ3NoJyxcbiAgICAgICAgICAnLWMnLFxuICAgICAgICAgIGBkb2NrZXIgbG9hZCAtaSBhc3NldC4ke2Fzc2V0LmFzc2V0SGFzaH0udGFyIHwgdGFpbCAtbiAxIHwgc2VkIFwicy9Mb2FkZWQgaW1hZ2U6IC8vZ1wiYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcblxuICAgIC8vIEFzc2V0U3RhZ2luZyBpbiBUYXJiYWxsSW1hZ2VBc3NldCB1c2VzIGB0aGlzYCBhcyBzY29wZSdcbiAgICBleHBlY3QoYXNzZXQubm9kZS50cnlGaW5kQ2hpbGQoJ1N0YWdpbmcnKSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXQucmVwb3NpdG9yeS5ncmFudFB1bGwgY2FuIGJlIHVzZWQgdG8gZ3JhbnQgYSBwcmluY2lwYWwgcGVybWlzc2lvbnMgdG8gdXNlIHRoZSBpbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgIGNvbnN0IGFzc2V0ID0gbmV3IFRhcmJhbGxJbWFnZUFzc2V0KHN0YWNrLCAnSW1hZ2UnLCB7XG4gICAgICB0YXJiYWxsRmlsZTogJ3Rlc3QvZGVtby10YXJiYWxsL2VtcHR5LnRhcicsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXNzZXQucmVwb3NpdG9yeS5ncmFudFB1bGwodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICAgICAgICAgJ2VjcjpCYXRjaEdldEltYWdlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzplY3I6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOnJlcG9zaXRvcnkvJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnY2RrLWhuYjY1OWZkcy1jb250YWluZXItYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgJ1BvbGljeU5hbWUnOiAnTXlVc2VyRGVmYXVsdFBvbGljeTdCODk3NDI2JyxcbiAgICAgICdVc2Vycyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdSZWYnOiAnTXlVc2VyREM0NTAyOEInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9ja2VyIGRpcmVjdG9yeSBpcyBzdGFnZWQgaWYgYXNzZXQgc3RhZ2luZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICAgIGNvbnN0IGltYWdlID0gbmV3IFRhcmJhbGxJbWFnZUFzc2V0KHN0YWNrLCAnTXlBc3NldCcsIHtcbiAgICAgIHRhcmJhbGxGaWxlOiAndGVzdC9kZW1vLXRhcmJhbGwvZW1wdHkudGFyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKHBhdGguam9pbihzZXNzaW9uLmRpcmVjdG9yeSwgYGFzc2V0LiR7aW1hZ2UuYXNzZXRIYXNofS50YXJgKSkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHRoZSBmaWxlIGRvZXMgbm90IGV4aXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgVGFyYmFsbEltYWdlQXNzZXQoc3RhY2ssICdNeUFzc2V0Jywge1xuICAgICAgICB0YXJiYWxsRmlsZTogYC9kb2VzL25vdC9leGlzdC8ke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDk5OTkpfWAsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgZmluZCBmaWxlIGF0Lyk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ltYWdlVGFnIGlzIGNvcnJlY3QgZm9yIGRpZmZlcmVudCBzdGFjayBzeW50aGVzaXplcnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IERlZmF1bHRTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgZG9ja2VyVGFnUHJlZml4OiAnYmFuYW5hJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIGNvbnN0IGFzc2V0MSA9IG5ldyBUYXJiYWxsSW1hZ2VBc3NldChzdGFjazEsICdNeUFzc2V0Jywge1xuICAgICAgdGFyYmFsbEZpbGU6ICd0ZXN0L2RlbW8tdGFyYmFsbC9lbXB0eS50YXInLFxuICAgIH0pO1xuICAgIGNvbnN0IGFzc2V0MiA9IG5ldyBUYXJiYWxsSW1hZ2VBc3NldChzdGFjazIsICdNeUFzc2V0Jywge1xuICAgICAgdGFyYmFsbEZpbGU6ICd0ZXN0L2RlbW8tdGFyYmFsbC9lbXB0eS50YXInLFxuICAgIH0pO1xuXG4gICAgdGVzdCgnc3RhY2sgd2l0aCBkZWZhdWx0IHN5bnRoZXNpemVyJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGFzc2V0MS5hc3NldEhhc2gpLnRvRXF1YWwoJzk1YzkyNGM4NGY1ZDAyM2JlNGVkZWU1NDBjYjJjYjQwMWE0OWYxMTVkMDFlZDQwM2IyODhmNmNiNDEyNzcxZGYnKTtcbiAgICAgIGV4cGVjdChhc3NldDEuaW1hZ2VUYWcpLnRvRXF1YWwoJzk1YzkyNGM4NGY1ZDAyM2JlNGVkZWU1NDBjYjJjYjQwMWE0OWYxMTVkMDFlZDQwM2IyODhmNmNiNDEyNzcxZGYnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N0YWNrIHdpdGggb3ZlcndyaXR0ZW4gc3ludGhlc2l6ZXInLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYXNzZXQyLmFzc2V0SGFzaCkudG9FcXVhbCgnOTVjOTI0Yzg0ZjVkMDIzYmU0ZWRlZTU0MGNiMmNiNDAxYTQ5ZjExNWQwMWVkNDAzYjI4OGY2Y2I0MTI3NzFkZicpO1xuICAgICAgZXhwZWN0KGFzc2V0Mi5pbWFnZVRhZykudG9FcXVhbCgnYmFuYW5hOTVjOTI0Yzg0ZjVkMDIzYmU0ZWRlZTU0MGNiMmNiNDAxYTQ5ZjExNWQwMWVkNDAzYjI4OGY2Y2I0MTI3NzFkZicpO1xuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbmZ1bmN0aW9uIGlzQXNzZXRNYW5pZmVzdCh4OiBjeGFwaS5DbG91ZEFydGlmYWN0KTogeCBpcyBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3Qge1xuICByZXR1cm4geCBpbnN0YW5jZW9mIGN4YXBpLkFzc2V0TWFuaWZlc3RBcnRpZmFjdDtcbn1cblxuZnVuY3Rpb24gZ2V0QXNzZXRNYW5pZmVzdChhc206IGN4YXBpLkNsb3VkQXNzZW1ibHkpOiBjeGFwaS5Bc3NldE1hbmlmZXN0QXJ0aWZhY3Qge1xuICBjb25zdCBtYW5pZmVzdEFydGlmYWN0ID0gYXNtLmFydGlmYWN0cy5maWx0ZXIoaXNBc3NldE1hbmlmZXN0KVswXTtcbiAgaWYgKCFtYW5pZmVzdEFydGlmYWN0KSB7IHRocm93IG5ldyBFcnJvcignbm8gYXNzZXQgbWFuaWZlc3QgaW4gYXNzZW1ibHknKTsgfVxuICByZXR1cm4gbWFuaWZlc3RBcnRpZmFjdDtcbn1cblxuZnVuY3Rpb24gcmVhZEFzc2V0TWFuaWZlc3QobWFuaWZlc3RBcnRpZmFjdDogY3hhcGkuQXNzZXRNYW5pZmVzdEFydGlmYWN0KTogY3hzY2hlbWEuQXNzZXRNYW5pZmVzdCB7XG4gIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhtYW5pZmVzdEFydGlmYWN0LmZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpO1xufVxuIl19