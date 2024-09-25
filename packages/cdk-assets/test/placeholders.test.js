"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const mockfs = require("mock-fs");
const mock_aws_1 = require("./mock-aws");
const lib_1 = require("../lib");
let aws;
beforeEach(() => {
    mockfs({
        '/simple/cdk.out/assets.json': JSON.stringify({
            version: cloud_assembly_schema_1.Manifest.version(),
            files: {
                fileAsset: {
                    type: 'file',
                    source: {
                        path: 'some_file',
                    },
                    destinations: {
                        theDestination: {
                            // Absence of region
                            assumeRoleArn: 'arn:aws:role-${AWS::AccountId}',
                            bucketName: 'some_bucket-${AWS::AccountId}-${AWS::Region}',
                            objectKey: 'some_key-${AWS::AccountId}-${AWS::Region}',
                        },
                    },
                },
            },
            dockerImages: {
                dockerAsset: {
                    type: 'docker-image',
                    source: {
                        directory: 'dockerdir',
                    },
                    destinations: {
                        theDestination: {
                            // Explicit region
                            region: 'explicit_region',
                            assumeRoleArn: 'arn:aws:role-${AWS::AccountId}',
                            repositoryName: 'repo-${AWS::AccountId}-${AWS::Region}',
                            imageTag: 'abcdef',
                        },
                    },
                },
            },
        }),
        '/simple/cdk.out/some_file': 'FILE_CONTENTS',
    });
    aws = (0, mock_aws_1.mockAws)();
});
afterEach(() => {
    mockfs.restore();
});
test('check that placeholders are replaced', async () => {
    const pub = new lib_1.AssetPublishing(lib_1.AssetManifest.fromPath('/simple/cdk.out'), { aws });
    aws.mockS3.getBucketLocation = (0, mock_aws_1.mockedApiResult)({});
    aws.mockS3.listObjectsV2 = (0, mock_aws_1.mockedApiResult)({ Contents: [{ Key: 'some_key-current_account-current_region' }] });
    aws.mockEcr.describeImages = (0, mock_aws_1.mockedApiResult)({ /* No error == image exists */});
    await pub.publish();
    expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
        assumeRoleArn: 'arn:aws:role-current_account',
    }));
    expect(aws.ecrClient).toHaveBeenCalledWith(expect.objectContaining({
        region: 'explicit_region',
        assumeRoleArn: 'arn:aws:role-current_account',
    }));
    expect(aws.mockS3.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
        Bucket: 'some_bucket-current_account-current_region',
        Prefix: 'some_key-current_account-current_region',
        MaxKeys: 1,
    }));
    expect(aws.mockEcr.describeImages).toHaveBeenCalledWith(expect.objectContaining({
        imageIds: [{ imageTag: 'abcdef' }],
        repositoryName: 'repo-current_account-explicit_region',
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBFQUEwRDtBQUMxRCxrQ0FBa0M7QUFDbEMseUNBQXNEO0FBQ3RELGdDQUF3RDtBQUV4RCxJQUFJLEdBQStCLENBQUM7QUFDcEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLE1BQU0sQ0FBQztRQUNMLDZCQUE2QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDNUMsT0FBTyxFQUFFLGdDQUFRLENBQUMsT0FBTyxFQUFFO1lBQzNCLEtBQUssRUFBRTtnQkFDTCxTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFLE1BQU07b0JBQ1osTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRSxXQUFXO3FCQUNsQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osY0FBYyxFQUFFOzRCQUNkLG9CQUFvQjs0QkFDcEIsYUFBYSxFQUFFLGdDQUFnQzs0QkFDL0MsVUFBVSxFQUFFLDhDQUE4Qzs0QkFDMUQsU0FBUyxFQUFFLDJDQUEyQzt5QkFDdkQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFlBQVksRUFBRTtnQkFDWixXQUFXLEVBQUU7b0JBQ1gsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLE1BQU0sRUFBRTt3QkFDTixTQUFTLEVBQUUsV0FBVztxQkFDdkI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGNBQWMsRUFBRTs0QkFDZCxrQkFBa0I7NEJBQ2xCLE1BQU0sRUFBRSxpQkFBaUI7NEJBQ3pCLGFBQWEsRUFBRSxnQ0FBZ0M7NEJBQy9DLGNBQWMsRUFBRSx1Q0FBdUM7NEJBQ3ZELFFBQVEsRUFBRSxRQUFRO3lCQUNuQjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUNGLDJCQUEyQixFQUFFLGVBQWU7S0FDN0MsQ0FBQyxDQUFDO0lBRUgsR0FBRyxHQUFHLElBQUEsa0JBQU8sR0FBRSxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxDQUFDLEdBQUcsRUFBRTtJQUNiLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtJQUN0RCxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFlLENBQUMsbUJBQWEsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsR0FBRyxJQUFBLDBCQUFlLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsSUFBQSwwQkFBZSxFQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvRyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxJQUFBLDBCQUFlLEVBQUMsRUFBRSw4QkFBOEIsQ0FBRSxDQUFDLENBQUM7SUFFakYsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDaEUsYUFBYSxFQUFFLDhCQUE4QjtLQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVKLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQ2pFLE1BQU0sRUFBRSxpQkFBaUI7UUFDekIsYUFBYSxFQUFFLDhCQUE4QjtLQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVKLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1RSxNQUFNLEVBQUUsNENBQTRDO1FBQ3BELE1BQU0sRUFBRSx5Q0FBeUM7UUFDakQsT0FBTyxFQUFFLENBQUM7S0FDWCxDQUFDLENBQUMsQ0FBQztJQUVKLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM5RSxRQUFRLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQztRQUNsQyxjQUFjLEVBQUUsc0NBQXNDO0tBQ3ZELENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYW5pZmVzdCB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBtb2NrZnMgZnJvbSAnbW9jay1mcyc7XG5pbXBvcnQgeyBtb2NrQXdzLCBtb2NrZWRBcGlSZXN1bHQgfSBmcm9tICcuL21vY2stYXdzJztcbmltcG9ydCB7IEFzc2V0TWFuaWZlc3QsIEFzc2V0UHVibGlzaGluZyB9IGZyb20gJy4uL2xpYic7XG5cbmxldCBhd3M6IFJldHVyblR5cGU8dHlwZW9mIG1vY2tBd3M+O1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIG1vY2tmcyh7XG4gICAgJy9zaW1wbGUvY2RrLm91dC9hc3NldHMuanNvbic6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZlcnNpb246IE1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGZpbGVzOiB7XG4gICAgICAgIGZpbGVBc3NldDoge1xuICAgICAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgIHBhdGg6ICdzb21lX2ZpbGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVzdGluYXRpb25zOiB7XG4gICAgICAgICAgICB0aGVEZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgICAvLyBBYnNlbmNlIG9mIHJlZ2lvblxuICAgICAgICAgICAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlLSR7QVdTOjpBY2NvdW50SWR9JyxcbiAgICAgICAgICAgICAgYnVja2V0TmFtZTogJ3NvbWVfYnVja2V0LSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICAgICAgb2JqZWN0S2V5OiAnc29tZV9rZXktJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGRvY2tlckltYWdlczoge1xuICAgICAgICBkb2NrZXJBc3NldDoge1xuICAgICAgICAgIHR5cGU6ICdkb2NrZXItaW1hZ2UnLFxuICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgZGlyZWN0b3J5OiAnZG9ja2VyZGlyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgICAgICAgLy8gRXhwbGljaXQgcmVnaW9uXG4gICAgICAgICAgICAgIHJlZ2lvbjogJ2V4cGxpY2l0X3JlZ2lvbicsXG4gICAgICAgICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUtJHtBV1M6OkFjY291bnRJZH0nLFxuICAgICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogJ3JlcG8tJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICBpbWFnZVRhZzogJ2FiY2RlZicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgICcvc2ltcGxlL2Nkay5vdXQvc29tZV9maWxlJzogJ0ZJTEVfQ09OVEVOVFMnLFxuICB9KTtcblxuICBhd3MgPSBtb2NrQXdzKCk7XG59KTtcblxuYWZ0ZXJFYWNoKCgpID0+IHtcbiAgbW9ja2ZzLnJlc3RvcmUoKTtcbn0pO1xuXG50ZXN0KCdjaGVjayB0aGF0IHBsYWNlaG9sZGVycyBhcmUgcmVwbGFjZWQnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHB1YiA9IG5ldyBBc3NldFB1Ymxpc2hpbmcoQXNzZXRNYW5pZmVzdC5mcm9tUGF0aCgnL3NpbXBsZS9jZGsub3V0JyksIHsgYXdzIH0pO1xuICBhd3MubW9ja1MzLmdldEJ1Y2tldExvY2F0aW9uID0gbW9ja2VkQXBpUmVzdWx0KHt9KTtcbiAgYXdzLm1vY2tTMy5saXN0T2JqZWN0c1YyID0gbW9ja2VkQXBpUmVzdWx0KHsgQ29udGVudHM6IFt7IEtleTogJ3NvbWVfa2V5LWN1cnJlbnRfYWNjb3VudC1jdXJyZW50X3JlZ2lvbicgfV0gfSk7XG4gIGF3cy5tb2NrRWNyLmRlc2NyaWJlSW1hZ2VzID0gbW9ja2VkQXBpUmVzdWx0KHsgLyogTm8gZXJyb3IgPT0gaW1hZ2UgZXhpc3RzICovIH0pO1xuXG4gIGF3YWl0IHB1Yi5wdWJsaXNoKCk7XG5cbiAgZXhwZWN0KGF3cy5zM0NsaWVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgIGFzc3VtZVJvbGVBcm46ICdhcm46YXdzOnJvbGUtY3VycmVudF9hY2NvdW50JyxcbiAgfSkpO1xuXG4gIGV4cGVjdChhd3MuZWNyQ2xpZW50KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgcmVnaW9uOiAnZXhwbGljaXRfcmVnaW9uJyxcbiAgICBhc3N1bWVSb2xlQXJuOiAnYXJuOmF3czpyb2xlLWN1cnJlbnRfYWNjb3VudCcsXG4gIH0pKTtcblxuICBleHBlY3QoYXdzLm1vY2tTMy5saXN0T2JqZWN0c1YyKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgQnVja2V0OiAnc29tZV9idWNrZXQtY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJyxcbiAgICBQcmVmaXg6ICdzb21lX2tleS1jdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nLFxuICAgIE1heEtleXM6IDEsXG4gIH0pKTtcblxuICBleHBlY3QoYXdzLm1vY2tFY3IuZGVzY3JpYmVJbWFnZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICBpbWFnZUlkczogW3sgaW1hZ2VUYWc6ICdhYmNkZWYnIH1dLFxuICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwby1jdXJyZW50X2FjY291bnQtZXhwbGljaXRfcmVnaW9uJyxcbiAgfSkpO1xufSk7XG4iXX0=