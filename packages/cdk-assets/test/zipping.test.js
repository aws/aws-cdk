"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Separate test file since the archiving module doesn't work well with 'mock-fs'
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const mock_aws_1 = require("./mock-aws");
const lib_1 = require("../lib");
let aws;
beforeEach(() => {
    (0, cdk_build_tools_1.bockfs)({
        '/simple/cdk.out/assets.json': JSON.stringify({
            version: cloud_assembly_schema_1.Manifest.version(),
            files: {
                theAsset: {
                    source: {
                        path: 'some_dir',
                        packaging: 'zip',
                    },
                    destinations: {
                        theDestination: {
                            region: 'us-north-50',
                            assumeRoleArn: 'arn:aws:role',
                            bucketName: 'some_bucket',
                            objectKey: 'some_key',
                        },
                    },
                },
            },
        }),
        '/simple/cdk.out/some_dir/some_file': 'FILE_CONTENTS',
    });
    aws = (0, mock_aws_1.mockAws)();
    // Accept all S3 uploads as new
    aws.mockS3.listObjectsV2 = (0, mock_aws_1.mockedApiResult)({ Contents: undefined });
    aws.mockS3.upload = (0, mock_aws_1.mockUpload)();
});
afterEach(() => {
    cdk_build_tools_1.bockfs.restore();
});
test('Take a zipped upload', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath(cdk_build_tools_1.bockfs.path('/simple/cdk.out')), { aws });
    await pub.publish();
    expect(aws.mockS3.upload).toHaveBeenCalledWith(expect.objectContaining({
        Bucket: 'some_bucket',
        Key: 'some_key',
        ContentType: 'application/zip',
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwcGluZy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiemlwcGluZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUZBQWlGO0FBQ2pGLDhEQUFrRDtBQUNsRCwwRUFBMEQ7QUFDMUQseUNBQWtFO0FBQ2xFLGdDQUF3RDtBQUV4RCxJQUFJLEdBQStCLENBQUM7QUFDcEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUEsd0JBQU0sRUFBQztRQUNMLDZCQUE2QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDNUMsT0FBTyxFQUFFLGdDQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUU7b0JBQ1IsTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRSxVQUFVO3dCQUNoQixTQUFTLEVBQUUsS0FBSztxQkFDakI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGNBQWMsRUFBRTs0QkFDZCxNQUFNLEVBQUUsYUFBYTs0QkFDckIsYUFBYSxFQUFFLGNBQWM7NEJBQzdCLFVBQVUsRUFBRSxhQUFhOzRCQUN6QixTQUFTLEVBQUUsVUFBVTt5QkFDdEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFDRixvQ0FBb0MsRUFBRSxlQUFlO0tBQ3RELENBQUMsQ0FBQztJQUVILEdBQUcsR0FBRyxJQUFBLGtCQUFPLEdBQUUsQ0FBQztJQUVoQiwrQkFBK0I7SUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsSUFBQSwwQkFBZSxFQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDcEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBQSxxQkFBVSxHQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsR0FBRyxFQUFFO0lBQ2Isd0JBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFlLENBQUMsbUJBQWEsQ0FBQyxRQUFRLENBQUMsd0JBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUVqRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVwQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDckUsTUFBTSxFQUFFLGFBQWE7UUFDckIsR0FBRyxFQUFFLFVBQVU7UUFDZixXQUFXLEVBQUUsaUJBQWlCO0tBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBTZXBhcmF0ZSB0ZXN0IGZpbGUgc2luY2UgdGhlIGFyY2hpdmluZyBtb2R1bGUgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCAnbW9jay1mcydcbmltcG9ydCB7IGJvY2tmcyB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBNYW5pZmVzdCB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBtb2NrQXdzLCBtb2NrZWRBcGlSZXN1bHQsIG1vY2tVcGxvYWQgfSBmcm9tICcuL21vY2stYXdzJztcbmltcG9ydCB7IEFzc2V0TWFuaWZlc3QsIEFzc2V0UHVibGlzaGluZyB9IGZyb20gJy4uL2xpYic7XG5cbmxldCBhd3M6IFJldHVyblR5cGU8dHlwZW9mIG1vY2tBd3M+O1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIGJvY2tmcyh7XG4gICAgJy9zaW1wbGUvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIHRoZUFzc2V0OiB7XG4gICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICBwYXRoOiAnc29tZV9kaXInLFxuICAgICAgICAgICAgcGFja2FnaW5nOiAnemlwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgICAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlJyxcbiAgICAgICAgICAgICAgYnVja2V0TmFtZTogJ3NvbWVfYnVja2V0JyxcbiAgICAgICAgICAgICAgb2JqZWN0S2V5OiAnc29tZV9rZXknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnL3NpbXBsZS9jZGsub3V0L3NvbWVfZGlyL3NvbWVfZmlsZSc6ICdGSUxFX0NPTlRFTlRTJyxcbiAgfSk7XG5cbiAgYXdzID0gbW9ja0F3cygpO1xuXG4gIC8vIEFjY2VwdCBhbGwgUzMgdXBsb2FkcyBhcyBuZXdcbiAgYXdzLm1vY2tTMy5saXN0T2JqZWN0c1YyID0gbW9ja2VkQXBpUmVzdWx0KHsgQ29udGVudHM6IHVuZGVmaW5lZCB9KTtcbiAgYXdzLm1vY2tTMy51cGxvYWQgPSBtb2NrVXBsb2FkKCk7XG59KTtcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgYm9ja2ZzLnJlc3RvcmUoKTtcbn0pO1xuXG50ZXN0KCdUYWtlIGEgemlwcGVkIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgcHViID0gbmV3IEFzc2V0UHVibGlzaGluZyhBc3NldE1hbmlmZXN0LmZyb21QYXRoKGJvY2tmcy5wYXRoKCcvc2ltcGxlL2Nkay5vdXQnKSksIHsgYXdzIH0pO1xuXG4gIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgZXhwZWN0KGF3cy5tb2NrUzMudXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgQnVja2V0OiAnc29tZV9idWNrZXQnLFxuICAgIEtleTogJ3NvbWVfa2V5JyxcbiAgICBDb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL3ppcCcsXG4gIH0pKTtcbn0pO1xuIl19