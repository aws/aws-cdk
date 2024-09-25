"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const mockfs = require("mock-fs");
const fake_listener_1 = require("./fake-listener");
const mock_aws_1 = require("./mock-aws");
const lib_1 = require("../lib");
let aws;
beforeEach(() => {
    mockfs({
        '/simple/cdk.out/assets.json': JSON.stringify({
            version: cloud_assembly_schema_1.Manifest.version(),
            files: {
                theAsset: {
                    source: {
                        path: 'some_file',
                    },
                    destinations: {
                        theDestination1: {
                            region: 'us-north-50',
                            assumeRoleArn: 'arn:aws:role',
                            bucketName: 'some_bucket',
                            objectKey: 'some_key',
                        },
                        theDestination2: {
                            region: 'us-north-50',
                            assumeRoleArn: 'arn:aws:role',
                            bucketName: 'some_bucket',
                            objectKey: 'some_key2',
                        },
                    },
                },
            },
        }),
        '/simple/cdk.out/some_file': 'FILE_CONTENTS',
    });
    aws = (0, mock_aws_1.mockAws)();
    // Accept all S3 uploads as new
    aws.mockS3.getBucketLocation = (0, mock_aws_1.mockedApiResult)({});
    aws.mockS3.listObjectsV2 = (0, mock_aws_1.mockedApiResult)({ Contents: undefined });
    aws.mockS3.upload = (0, mock_aws_1.mockUpload)();
});
afterEach(() => {
    mockfs.restore();
});
test('test listener', async () => {
    const progressListener = new fake_listener_1.FakeListener();
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener });
    await pub.publish();
    const allMessages = progressListener.messages.join('\n');
    // Log mentions asset/destination ids
    expect(allMessages).toContain('theAsset:theDestination1');
    expect(allMessages).toContain('theAsset:theDestination2');
});
test('test publishing in parallel', async () => {
    const progressListener = new fake_listener_1.FakeListener();
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener, publishInParallel: true });
    await pub.publish();
    const allMessages = progressListener.messages.join('\n');
    // Log mentions asset/destination ids
    expect(allMessages).toContain('theAsset:theDestination1');
    expect(allMessages).toContain('theAsset:theDestination2');
});
test('test abort', async () => {
    const progressListener = new fake_listener_1.FakeListener(true);
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws, progressListener });
    await pub.publish();
    const allMessages = progressListener.messages.join('\n');
    // We never get to asset 2
    expect(allMessages).not.toContain('theAsset:theDestination2');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2dyZXNzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwRUFBMEQ7QUFDMUQsa0NBQWtDO0FBQ2xDLG1EQUErQztBQUMvQyx5Q0FBa0U7QUFDbEUsZ0NBQXdEO0FBRXhELElBQUksR0FBK0IsQ0FBQztBQUNwQyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsTUFBTSxDQUFDO1FBQ0wsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUM1QyxPQUFPLEVBQUUsZ0NBQVEsQ0FBQyxPQUFPLEVBQUU7WUFDM0IsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUU7d0JBQ04sSUFBSSxFQUFFLFdBQVc7cUJBQ2xCO29CQUNELFlBQVksRUFBRTt3QkFDWixlQUFlLEVBQUU7NEJBQ2YsTUFBTSxFQUFFLGFBQWE7NEJBQ3JCLGFBQWEsRUFBRSxjQUFjOzRCQUM3QixVQUFVLEVBQUUsYUFBYTs0QkFDekIsU0FBUyxFQUFFLFVBQVU7eUJBQ3RCO3dCQUNELGVBQWUsRUFBRTs0QkFDZixNQUFNLEVBQUUsYUFBYTs0QkFDckIsYUFBYSxFQUFFLGNBQWM7NEJBQzdCLFVBQVUsRUFBRSxhQUFhOzRCQUN6QixTQUFTLEVBQUUsV0FBVzt5QkFDdkI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7UUFDRiwyQkFBMkIsRUFBRSxlQUFlO0tBQzdDLENBQUMsQ0FBQztJQUVILEdBQUcsR0FBRyxJQUFBLGtCQUFPLEdBQUUsQ0FBQztJQUVoQiwrQkFBK0I7SUFDL0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFBLDBCQUFlLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsSUFBQSwwQkFBZSxFQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDcEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBQSxxQkFBVSxHQUFFLENBQUM7QUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsR0FBRyxFQUFFO0lBQ2IsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLElBQUksRUFBRTtJQUMvQixNQUFNLGdCQUFnQixHQUFHLElBQUksNEJBQVksRUFBRSxDQUFDO0lBRTVDLE1BQU0sR0FBRyxHQUFHLElBQUkscUJBQWUsQ0FBQyxtQkFBYSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUN0RyxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVwQixNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXpELHFDQUFxQztJQUNyQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEtBQUssSUFBSSxFQUFFO0lBQzdDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSw0QkFBWSxFQUFFLENBQUM7SUFFNUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBZSxDQUFDLG1CQUFhLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvSCxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVwQixNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXpELHFDQUFxQztJQUNyQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDMUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLElBQUksRUFBRTtJQUM1QixNQUFNLGdCQUFnQixHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFlLENBQUMsbUJBQWEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDdEcsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFcEIsTUFBTSxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV6RCwwQkFBMEI7SUFDMUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hbmlmZXN0IH0gZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIG1vY2tmcyBmcm9tICdtb2NrLWZzJztcbmltcG9ydCB7IEZha2VMaXN0ZW5lciB9IGZyb20gJy4vZmFrZS1saXN0ZW5lcic7XG5pbXBvcnQgeyBtb2NrQXdzLCBtb2NrZWRBcGlSZXN1bHQsIG1vY2tVcGxvYWQgfSBmcm9tICcuL21vY2stYXdzJztcbmltcG9ydCB7IEFzc2V0TWFuaWZlc3QsIEFzc2V0UHVibGlzaGluZyB9IGZyb20gJy4uL2xpYic7XG5cbmxldCBhd3M6IFJldHVyblR5cGU8dHlwZW9mIG1vY2tBd3M+O1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIG1vY2tmcyh7XG4gICAgJy9zaW1wbGUvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIHRoZUFzc2V0OiB7XG4gICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICBwYXRoOiAnc29tZV9maWxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAgICAgdGhlRGVzdGluYXRpb24xOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLW5vcnRoLTUwJyxcbiAgICAgICAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjphd3M6cm9sZScsXG4gICAgICAgICAgICAgIGJ1Y2tldE5hbWU6ICdzb21lX2J1Y2tldCcsXG4gICAgICAgICAgICAgIG9iamVjdEtleTogJ3NvbWVfa2V5JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGVEZXN0aW5hdGlvbjI6IHtcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtbm9ydGgtNTAnLFxuICAgICAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlJyxcbiAgICAgICAgICAgICAgYnVja2V0TmFtZTogJ3NvbWVfYnVja2V0JyxcbiAgICAgICAgICAgICAgb2JqZWN0S2V5OiAnc29tZV9rZXkyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgJy9zaW1wbGUvY2RrLm91dC9zb21lX2ZpbGUnOiAnRklMRV9DT05URU5UUycsXG4gIH0pO1xuXG4gIGF3cyA9IG1vY2tBd3MoKTtcblxuICAvLyBBY2NlcHQgYWxsIFMzIHVwbG9hZHMgYXMgbmV3XG4gIGF3cy5tb2NrUzMuZ2V0QnVja2V0TG9jYXRpb24gPSBtb2NrZWRBcGlSZXN1bHQoe30pO1xuICBhd3MubW9ja1MzLmxpc3RPYmplY3RzVjIgPSBtb2NrZWRBcGlSZXN1bHQoeyBDb250ZW50czogdW5kZWZpbmVkIH0pO1xuICBhd3MubW9ja1MzLnVwbG9hZCA9IG1vY2tVcGxvYWQoKTtcbn0pO1xuXG5hZnRlckVhY2goKCkgPT4ge1xuICBtb2NrZnMucmVzdG9yZSgpO1xufSk7XG5cbnRlc3QoJ3Rlc3QgbGlzdGVuZXInLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHByb2dyZXNzTGlzdGVuZXIgPSBuZXcgRmFrZUxpc3RlbmVyKCk7XG5cbiAgY29uc3QgcHViID0gbmV3IEFzc2V0UHVibGlzaGluZyhBc3NldE1hbmlmZXN0LmZyb21QYXRoKCcvc2ltcGxlL2Nkay5vdXQnKSwgeyBhd3MsIHByb2dyZXNzTGlzdGVuZXIgfSk7XG4gIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgY29uc3QgYWxsTWVzc2FnZXMgPSBwcm9ncmVzc0xpc3RlbmVyLm1lc3NhZ2VzLmpvaW4oJ1xcbicpO1xuXG4gIC8vIExvZyBtZW50aW9ucyBhc3NldC9kZXN0aW5hdGlvbiBpZHNcbiAgZXhwZWN0KGFsbE1lc3NhZ2VzKS50b0NvbnRhaW4oJ3RoZUFzc2V0OnRoZURlc3RpbmF0aW9uMScpO1xuICBleHBlY3QoYWxsTWVzc2FnZXMpLnRvQ29udGFpbigndGhlQXNzZXQ6dGhlRGVzdGluYXRpb24yJyk7XG59KTtcblxudGVzdCgndGVzdCBwdWJsaXNoaW5nIGluIHBhcmFsbGVsJywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwcm9ncmVzc0xpc3RlbmVyID0gbmV3IEZha2VMaXN0ZW5lcigpO1xuXG4gIGNvbnN0IHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL3NpbXBsZS9jZGsub3V0JyksIHsgYXdzLCBwcm9ncmVzc0xpc3RlbmVyLCBwdWJsaXNoSW5QYXJhbGxlbDogdHJ1ZSB9KTtcbiAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICBjb25zdCBhbGxNZXNzYWdlcyA9IHByb2dyZXNzTGlzdGVuZXIubWVzc2FnZXMuam9pbignXFxuJyk7XG5cbiAgLy8gTG9nIG1lbnRpb25zIGFzc2V0L2Rlc3RpbmF0aW9uIGlkc1xuICBleHBlY3QoYWxsTWVzc2FnZXMpLnRvQ29udGFpbigndGhlQXNzZXQ6dGhlRGVzdGluYXRpb24xJyk7XG4gIGV4cGVjdChhbGxNZXNzYWdlcykudG9Db250YWluKCd0aGVBc3NldDp0aGVEZXN0aW5hdGlvbjInKTtcbn0pO1xuXG50ZXN0KCd0ZXN0IGFib3J0JywgYXN5bmMgKCkgPT4ge1xuICBjb25zdCBwcm9ncmVzc0xpc3RlbmVyID0gbmV3IEZha2VMaXN0ZW5lcih0cnVlKTtcblxuICBjb25zdCBwdWIgPSBuZXcgQXNzZXRQdWJsaXNoaW5nKEFzc2V0TWFuaWZlc3QuZnJvbVBhdGgoJy9zaW1wbGUvY2RrLm91dCcpLCB7IGF3cywgcHJvZ3Jlc3NMaXN0ZW5lciB9KTtcbiAgYXdhaXQgcHViLnB1Ymxpc2goKTtcblxuICBjb25zdCBhbGxNZXNzYWdlcyA9IHByb2dyZXNzTGlzdGVuZXIubWVzc2FnZXMuam9pbignXFxuJyk7XG5cbiAgLy8gV2UgbmV2ZXIgZ2V0IHRvIGFzc2V0IDJcbiAgZXhwZWN0KGFsbE1lc3NhZ2VzKS5ub3QudG9Db250YWluKCd0aGVBc3NldDp0aGVEZXN0aW5hdGlvbjInKTtcbn0pOyJdfQ==