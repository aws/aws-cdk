"use strict";
/**
 * This file asserts that it is possible to write a custom stacksynthesizer that will synthesize
 * ONE thing to the asset manifest, while returning another thing (including tokens) to the
 * CloudFormation template -- without reaching into the library internals
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('use custom synthesizer', () => {
    // GIVEN
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack', {
        synthesizer: new CustomSynthesizer(),
    });
    // WHEN
    const asset = new lib_1.DockerImageAsset(stack, 'MyAsset', {
        directory: path.join(__dirname, 'demo-image'),
    });
    new core_1.CfnResource(stack, 'TestResource', {
        type: 'CDK::TestResource',
        properties: {
            ImageUri: asset.imageUri,
            ImageTag: asset.imageTag,
        },
    });
    // THEN
    const assembly = app.synth();
    const stackArtifact = assembly.getStackArtifact(stack.artifactId);
    const assetArtifact = stackArtifact.dependencies[0];
    const stackTemplate = assertions_1.Template.fromJSON(stackArtifact.template);
    stackTemplate.hasResourceProperties('CDK::TestResource', {
        ImageUri: { 'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/${RepositoryName}:0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14' },
        ImageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
    });
    expect(assetArtifact.contents).toEqual(expect.objectContaining({
        dockerImages: expect.objectContaining({
            '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14': {
                destinations: {
                    'current_account-current_region': {
                        repositoryName: 'write-repo',
                        imageTag: '0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
                    },
                },
                source: {
                    directory: 'asset.0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
                },
            },
        }),
    }));
});
class CustomSynthesizer extends core_1.StackSynthesizer {
    constructor() {
        super(...arguments);
        this.manifest = new core_1.AssetManifestBuilder();
    }
    bind(stack) {
        super.bind(stack);
        this.parameter = new core_1.CfnParameter(stack, 'RepositoryName');
    }
    addFileAsset(asset) {
        void (asset);
        throw new Error('file assets not supported here');
    }
    addDockerImageAsset(asset) {
        const dest = this.manifest.defaultAddDockerImageAsset(this.boundStack, asset, {
            repositoryName: 'write-repo',
        });
        return this.cloudFormationLocationFromDockerImageAsset({
            ...dest,
            repositoryName: ['${', this.parameter.logicalId, '}'].join(''),
        });
    }
    synthesize(session) {
        // NOTE: Explicitly not adding template to asset manifest
        this.synthesizeTemplate(session);
        const assetManifestId = this.manifest.emitManifest(this.boundStack, session);
        this.emitArtifact(session, {
            additionalDependencies: [assetManifestId],
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXN5bnRoZXNpcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXN5bnRoZXNpcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILDZCQUE2QjtBQUM3QixvREFBK0M7QUFDL0Msd0NBQXVOO0FBRXZOLGdDQUEwQztBQUUxQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLFFBQVE7SUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7UUFDcEMsV0FBVyxFQUFFLElBQUksaUJBQWlCLEVBQUU7S0FDckMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUNuRCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO0tBQzlDLENBQUMsQ0FBQztJQUNILElBQUksa0JBQVcsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQ3JDLElBQUksRUFBRSxtQkFBbUI7UUFDekIsVUFBVSxFQUFFO1lBQ1YsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUN6QjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDN0IsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRSxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBMEIsQ0FBQztJQUU3RSxNQUFNLGFBQWEsR0FBRyxxQkFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEUsYUFBYSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1FBQ3ZELFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSwrSUFBK0ksRUFBRTtRQUN4SyxRQUFRLEVBQUUsa0VBQWtFO0tBQzdFLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3RCxZQUFZLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1lBQ3BDLGtFQUFrRSxFQUFFO2dCQUNsRSxZQUFZLEVBQUU7b0JBQ1osZ0NBQWdDLEVBQUU7d0JBQ2hDLGNBQWMsRUFBRSxZQUFZO3dCQUM1QixRQUFRLEVBQUUsa0VBQWtFO3FCQUM3RTtpQkFDRjtnQkFDRCxNQUFNLEVBQUU7b0JBQ04sU0FBUyxFQUFFLHdFQUF3RTtpQkFDcEY7YUFDRjtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxpQkFBa0IsU0FBUSx1QkFBZ0I7SUFBaEQ7O1FBQ21CLGFBQVEsR0FBRyxJQUFJLDJCQUFvQixFQUFFLENBQUM7SUFpQ3pELENBQUM7SUE5QlUsSUFBSSxDQUFDLEtBQVk7UUFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksbUJBQVksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztLQUM1RDtJQUVELFlBQVksQ0FBQyxLQUFzQjtRQUNqQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7S0FDbkQ7SUFFRCxtQkFBbUIsQ0FBQyxLQUE2QjtRQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFO1lBQzVFLGNBQWMsRUFBRSxZQUFZO1NBQzdCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLDBDQUEwQyxDQUFDO1lBQ3JELEdBQUcsSUFBSTtZQUNQLGNBQWMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ2hFLENBQUMsQ0FBQztLQUNKO0lBRUQsVUFBVSxDQUFDLE9BQTBCO1FBQ25DLHlEQUF5RDtRQUN6RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU3RSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRTtZQUN6QixzQkFBc0IsRUFBRSxDQUFDLGVBQWUsQ0FBQztTQUMxQyxDQUFDLENBQUM7S0FDSjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGZpbGUgYXNzZXJ0cyB0aGF0IGl0IGlzIHBvc3NpYmxlIHRvIHdyaXRlIGEgY3VzdG9tIHN0YWNrc3ludGhlc2l6ZXIgdGhhdCB3aWxsIHN5bnRoZXNpemVcbiAqIE9ORSB0aGluZyB0byB0aGUgYXNzZXQgbWFuaWZlc3QsIHdoaWxlIHJldHVybmluZyBhbm90aGVyIHRoaW5nIChpbmNsdWRpbmcgdG9rZW5zKSB0byB0aGVcbiAqIENsb3VkRm9ybWF0aW9uIHRlbXBsYXRlIC0tIHdpdGhvdXQgcmVhY2hpbmcgaW50byB0aGUgbGlicmFyeSBpbnRlcm5hbHNcbiAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrU3ludGhlc2l6ZXIsIEZpbGVBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIERvY2tlckltYWdlQXNzZXRTb3VyY2UsIERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgSVN5bnRoZXNpc1Nlc3Npb24sIEFwcCwgU3RhY2ssIEFzc2V0TWFuaWZlc3RCdWlsZGVyLCBDZm5QYXJhbWV0ZXIsIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBc3NldE1hbmlmZXN0QXJ0aWZhY3QgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldCB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBjdXN0b20gc3ludGhlc2l6ZXInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgc3ludGhlc2l6ZXI6IG5ldyBDdXN0b21TeW50aGVzaXplcigpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGFzc2V0ID0gbmV3IERvY2tlckltYWdlQXNzZXQoc3RhY2ssICdNeUFzc2V0Jywge1xuICAgIGRpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2RlbW8taW1hZ2UnKSxcbiAgfSk7XG4gIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Rlc3RSZXNvdXJjZScsIHtcbiAgICB0eXBlOiAnQ0RLOjpUZXN0UmVzb3VyY2UnLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIEltYWdlVXJpOiBhc3NldC5pbWFnZVVyaSxcbiAgICAgIEltYWdlVGFnOiBhc3NldC5pbWFnZVRhZyxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gIGNvbnN0IHN0YWNrQXJ0aWZhY3QgPSBhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpO1xuICBjb25zdCBhc3NldEFydGlmYWN0ID0gc3RhY2tBcnRpZmFjdC5kZXBlbmRlbmNpZXNbMF0gYXMgQXNzZXRNYW5pZmVzdEFydGlmYWN0O1xuXG4gIGNvbnN0IHN0YWNrVGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tSlNPTihzdGFja0FydGlmYWN0LnRlbXBsYXRlKTtcbiAgc3RhY2tUZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0NESzo6VGVzdFJlc291cmNlJywge1xuICAgIEltYWdlVXJpOiB7ICdGbjo6U3ViJzogJyR7QVdTOjpBY2NvdW50SWR9LmRrci5lY3IuJHtBV1M6OlJlZ2lvbn0uJHtBV1M6OlVSTFN1ZmZpeH0vJHtSZXBvc2l0b3J5TmFtZX06MGEzMzU1YmUxMjA1MWM5OTg0YmYyYjBiMmJiYTRlNmVhNTM1OTY4ZTViNmU3Mzk2NDQ5NzAxNzMyZmU1ZWQxNCcgfSxcbiAgICBJbWFnZVRhZzogJzBhMzM1NWJlMTIwNTFjOTk4NGJmMmIwYjJiYmE0ZTZlYTUzNTk2OGU1YjZlNzM5NjQ0OTcwMTczMmZlNWVkMTQnLFxuICB9KTtcblxuICBleHBlY3QoYXNzZXRBcnRpZmFjdC5jb250ZW50cykudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgZG9ja2VySW1hZ2VzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAnMGEzMzU1YmUxMjA1MWM5OTg0YmYyYjBiMmJiYTRlNmVhNTM1OTY4ZTViNmU3Mzk2NDQ5NzAxNzMyZmU1ZWQxNCc6IHtcbiAgICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICAgJ2N1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbic6IHtcbiAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnd3JpdGUtcmVwbycsXG4gICAgICAgICAgICBpbWFnZVRhZzogJzBhMzM1NWJlMTIwNTFjOTk4NGJmMmIwYjJiYmE0ZTZlYTUzNTk2OGU1YjZlNzM5NjQ0OTcwMTczMmZlNWVkMTQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAgIGRpcmVjdG9yeTogJ2Fzc2V0LjBhMzM1NWJlMTIwNTFjOTk4NGJmMmIwYjJiYmE0ZTZlYTUzNTk2OGU1YjZlNzM5NjQ0OTcwMTczMmZlNWVkMTQnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSkpO1xufSk7XG5cbmNsYXNzIEN1c3RvbVN5bnRoZXNpemVyIGV4dGVuZHMgU3RhY2tTeW50aGVzaXplciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbWFuaWZlc3QgPSBuZXcgQXNzZXRNYW5pZmVzdEJ1aWxkZXIoKTtcbiAgcHJpdmF0ZSBwYXJhbWV0ZXI/OiBDZm5QYXJhbWV0ZXI7XG5cbiAgb3ZlcnJpZGUgYmluZChzdGFjazogU3RhY2spIHtcbiAgICBzdXBlci5iaW5kKHN0YWNrKTtcblxuICAgIHRoaXMucGFyYW1ldGVyID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ1JlcG9zaXRvcnlOYW1lJyk7XG4gIH1cblxuICBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICB2b2lkKGFzc2V0KTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpbGUgYXNzZXRzIG5vdCBzdXBwb3J0ZWQgaGVyZScpO1xuICB9XG5cbiAgYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgY29uc3QgZGVzdCA9IHRoaXMubWFuaWZlc3QuZGVmYXVsdEFkZERvY2tlckltYWdlQXNzZXQodGhpcy5ib3VuZFN0YWNrLCBhc3NldCwge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6ICd3cml0ZS1yZXBvJyxcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jbG91ZEZvcm1hdGlvbkxvY2F0aW9uRnJvbURvY2tlckltYWdlQXNzZXQoe1xuICAgICAgLi4uZGVzdCxcbiAgICAgIHJlcG9zaXRvcnlOYW1lOiBbJyR7JywgdGhpcy5wYXJhbWV0ZXIhLmxvZ2ljYWxJZCwgJ30nXS5qb2luKCcnKSxcbiAgICB9KTtcbiAgfVxuXG4gIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICAvLyBOT1RFOiBFeHBsaWNpdGx5IG5vdCBhZGRpbmcgdGVtcGxhdGUgdG8gYXNzZXQgbWFuaWZlc3RcbiAgICB0aGlzLnN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uKTtcbiAgICBjb25zdCBhc3NldE1hbmlmZXN0SWQgPSB0aGlzLm1hbmlmZXN0LmVtaXRNYW5pZmVzdCh0aGlzLmJvdW5kU3RhY2ssIHNlc3Npb24pO1xuXG4gICAgdGhpcy5lbWl0QXJ0aWZhY3Qoc2Vzc2lvbiwge1xuICAgICAgYWRkaXRpb25hbERlcGVuZGVuY2llczogW2Fzc2V0TWFuaWZlc3RJZF0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==