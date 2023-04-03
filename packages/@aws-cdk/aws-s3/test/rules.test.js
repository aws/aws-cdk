"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('rules', () => {
    test('Bucket with expiration days', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            lifecycleRules: [{
                    expiration: core_1.Duration.days(30),
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        ExpirationInDays: 30,
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Can use addLifecycleRule() to add a lifecycle rule', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const bucket = new lib_1.Bucket(stack, 'Bucket');
        bucket.addLifecycleRule({
            expiration: core_1.Duration.days(30),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        ExpirationInDays: 30,
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Bucket with expiration date', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            lifecycleRules: [{
                    expirationDate: new Date('2018-01-01'),
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        ExpirationDate: '2018-01-01T00:00:00',
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Bucket with transition rule', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            lifecycleRules: [{
                    transitions: [{
                            storageClass: lib_1.StorageClass.GLACIER,
                            transitionAfter: core_1.Duration.days(30),
                        }],
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        Transitions: [{
                                StorageClass: 'GLACIER',
                                TransitionInDays: 30,
                            }],
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Bucket with expiredObjectDeleteMarker', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            lifecycleRules: [{
                    expiredObjectDeleteMarker: true,
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        ExpiredObjectDeleteMarker: true,
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Noncurrent transistion rule with versions to retain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN: Noncurrent version to retain available
        new lib_1.Bucket(stack, 'Bucket1', {
            lifecycleRules: [{
                    noncurrentVersionExpiration: core_1.Duration.days(10),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: lib_1.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                            transitionAfter: core_1.Duration.days(10),
                            noncurrentVersionsToRetain: 1,
                        },
                    ],
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        NoncurrentVersionExpiration: {
                            NoncurrentDays: 10,
                        },
                        NoncurrentVersionTransitions: [
                            {
                                NewerNoncurrentVersions: 1,
                                StorageClass: 'GLACIER_IR',
                                TransitionInDays: 10,
                            },
                        ],
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Noncurrent transistion rule without versions to retain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN: Noncurrent version to retain not set
        new lib_1.Bucket(stack, 'Bucket1', {
            lifecycleRules: [{
                    noncurrentVersionExpiration: core_1.Duration.days(10),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: lib_1.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                            transitionAfter: core_1.Duration.days(10),
                        },
                    ],
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        NoncurrentVersionExpiration: {
                            NoncurrentDays: 10,
                        },
                        NoncurrentVersionTransitions: [
                            {
                                StorageClass: 'GLACIER_IR',
                                TransitionInDays: 10,
                            },
                        ],
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Noncurrent expiration rule with versions to retain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN: Noncurrent version to retain available
        new lib_1.Bucket(stack, 'Bucket1', {
            lifecycleRules: [{
                    noncurrentVersionExpiration: core_1.Duration.days(10),
                    noncurrentVersionsToRetain: 1,
                    noncurrentVersionTransitions: [
                        {
                            storageClass: lib_1.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                            transitionAfter: core_1.Duration.days(10),
                        },
                    ],
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        NoncurrentVersionExpiration: {
                            NoncurrentDays: 10,
                            NewerNoncurrentVersions: 1,
                        },
                        NoncurrentVersionTransitions: [
                            {
                                StorageClass: 'GLACIER_IR',
                                TransitionInDays: 10,
                            },
                        ],
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Noncurrent expiration rule without versions to retain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN: Noncurrent version to retain not set
        new lib_1.Bucket(stack, 'Bucket1', {
            lifecycleRules: [{
                    noncurrentVersionExpiration: core_1.Duration.days(10),
                    noncurrentVersionTransitions: [
                        {
                            storageClass: lib_1.StorageClass.GLACIER_INSTANT_RETRIEVAL,
                            transitionAfter: core_1.Duration.days(10),
                        },
                    ],
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        NoncurrentVersionExpiration: {
                            NoncurrentDays: 10,
                        },
                        NoncurrentVersionTransitions: [
                            {
                                StorageClass: 'GLACIER_IR',
                                TransitionInDays: 10,
                            },
                        ],
                        Status: 'Enabled',
                    }],
            },
        });
    });
    test('Bucket with object size rules', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Bucket(stack, 'Bucket', {
            lifecycleRules: [{
                    objectSizeLessThan: 0,
                    objectSizeGreaterThan: 0,
                }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            LifecycleConfiguration: {
                Rules: [{
                        ObjectSizeLessThan: 0,
                        ObjectSizeGreaterThan: 0,
                        Status: 'Enabled',
                    }],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZXMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJ1bGVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQWdEO0FBQ2hELGdDQUE4QztBQUU5QyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNyQixJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLGNBQWMsRUFBRSxDQUFDO29CQUNmLFVBQVUsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztpQkFDOUIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRSxzQkFBc0IsRUFBRTtnQkFDdEIsS0FBSyxFQUFFLENBQUM7d0JBQ04sZ0JBQWdCLEVBQUUsRUFBRTt3QkFDcEIsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztZQUN0QixVQUFVLEVBQUUsZUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTixnQkFBZ0IsRUFBRSxFQUFFO3dCQUNwQixNQUFNLEVBQUUsU0FBUztxQkFDbEIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLGNBQWMsRUFBRSxDQUFDO29CQUNmLGNBQWMsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7aUJBQ3ZDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7WUFDakUsc0JBQXNCLEVBQUU7Z0JBQ3RCLEtBQUssRUFBRSxDQUFDO3dCQUNOLGNBQWMsRUFBRSxxQkFBcUI7d0JBQ3JDLE1BQU0sRUFBRSxTQUFTO3FCQUNsQixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDMUIsY0FBYyxFQUFFLENBQUM7b0JBQ2YsV0FBVyxFQUFFLENBQUM7NEJBQ1osWUFBWSxFQUFFLGtCQUFZLENBQUMsT0FBTzs0QkFDbEMsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3lCQUNuQyxDQUFDO2lCQUNILENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUU7WUFDakUsc0JBQXNCLEVBQUU7Z0JBQ3RCLEtBQUssRUFBRSxDQUFDO3dCQUNOLFdBQVcsRUFBRSxDQUFDO2dDQUNaLFlBQVksRUFBRSxTQUFTO2dDQUN2QixnQkFBZ0IsRUFBRSxFQUFFOzZCQUNyQixDQUFDO3dCQUNGLE1BQU0sRUFBRSxTQUFTO3FCQUNsQixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDMUIsY0FBYyxFQUFFLENBQUM7b0JBQ2YseUJBQXlCLEVBQUUsSUFBSTtpQkFDaEMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtZQUNqRSxzQkFBc0IsRUFBRTtnQkFDdEIsS0FBSyxFQUFFLENBQUM7d0JBQ04seUJBQXlCLEVBQUUsSUFBSTt3QkFDL0IsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUMvRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQiwrQ0FBK0M7UUFDL0MsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUMzQixjQUFjLEVBQUUsQ0FBQztvQkFDZiwyQkFBMkIsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsNEJBQTRCLEVBQUU7d0JBQzVCOzRCQUNFLFlBQVksRUFBRSxrQkFBWSxDQUFDLHlCQUF5Qjs0QkFDcEQsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzRCQUNsQywwQkFBMEIsRUFBRSxDQUFDO3lCQUM5QjtxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTiwyQkFBMkIsRUFBRTs0QkFDM0IsY0FBYyxFQUFFLEVBQUU7eUJBQ25CO3dCQUNELDRCQUE0QixFQUFFOzRCQUM1QjtnQ0FDRSx1QkFBdUIsRUFBRSxDQUFDO2dDQUMxQixZQUFZLEVBQUUsWUFBWTtnQ0FDMUIsZ0JBQWdCLEVBQUUsRUFBRTs2QkFDckI7eUJBQ0Y7d0JBQ0QsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNsRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQiw2Q0FBNkM7UUFDN0MsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUMzQixjQUFjLEVBQUUsQ0FBQztvQkFDZiwyQkFBMkIsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsNEJBQTRCLEVBQUU7d0JBQzVCOzRCQUNFLFlBQVksRUFBRSxrQkFBWSxDQUFDLHlCQUF5Qjs0QkFDcEQsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3lCQUNuQztxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTiwyQkFBMkIsRUFBRTs0QkFDM0IsY0FBYyxFQUFFLEVBQUU7eUJBQ25CO3dCQUNELDRCQUE0QixFQUFFOzRCQUM1QjtnQ0FDRSxZQUFZLEVBQUUsWUFBWTtnQ0FDMUIsZ0JBQWdCLEVBQUUsRUFBRTs2QkFDckI7eUJBQ0Y7d0JBQ0QsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLEdBQUcsRUFBRTtRQUM5RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQiwrQ0FBK0M7UUFDL0MsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUMzQixjQUFjLEVBQUUsQ0FBQztvQkFDZiwyQkFBMkIsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsMEJBQTBCLEVBQUUsQ0FBQztvQkFDN0IsNEJBQTRCLEVBQUU7d0JBQzVCOzRCQUNFLFlBQVksRUFBRSxrQkFBWSxDQUFDLHlCQUF5Qjs0QkFDcEQsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3lCQUNuQztxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTiwyQkFBMkIsRUFBRTs0QkFDM0IsY0FBYyxFQUFFLEVBQUU7NEJBQ2xCLHVCQUF1QixFQUFFLENBQUM7eUJBQzNCO3dCQUNELDRCQUE0QixFQUFFOzRCQUM1QjtnQ0FDRSxZQUFZLEVBQUUsWUFBWTtnQ0FDMUIsZ0JBQWdCLEVBQUUsRUFBRTs2QkFDckI7eUJBQ0Y7d0JBQ0QsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtRQUNqRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQiw2Q0FBNkM7UUFDN0MsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUMzQixjQUFjLEVBQUUsQ0FBQztvQkFDZiwyQkFBMkIsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDOUMsNEJBQTRCLEVBQUU7d0JBQzVCOzRCQUNFLFlBQVksRUFBRSxrQkFBWSxDQUFDLHlCQUF5Qjs0QkFDcEQsZUFBZSxFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3lCQUNuQztxQkFDRjtpQkFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTiwyQkFBMkIsRUFBRTs0QkFDM0IsY0FBYyxFQUFFLEVBQUU7eUJBQ25CO3dCQUNELDRCQUE0QixFQUFFOzRCQUM1QjtnQ0FDRSxZQUFZLEVBQUUsWUFBWTtnQ0FDMUIsZ0JBQWdCLEVBQUUsRUFBRTs2QkFDckI7eUJBQ0Y7d0JBQ0QsTUFBTSxFQUFFLFNBQVM7cUJBQ2xCLENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUN6QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUMxQixjQUFjLEVBQUUsQ0FBQztvQkFDZixrQkFBa0IsRUFBRSxDQUFDO29CQUNyQixxQkFBcUIsRUFBRSxDQUFDO2lCQUN6QixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFO1lBQ2pFLHNCQUFzQixFQUFFO2dCQUN0QixLQUFLLEVBQUUsQ0FBQzt3QkFDTixrQkFBa0IsRUFBRSxDQUFDO3dCQUNyQixxQkFBcUIsRUFBRSxDQUFDO3dCQUN4QixNQUFNLEVBQUUsU0FBUztxQkFDbEIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEJ1Y2tldCwgU3RvcmFnZUNsYXNzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3J1bGVzJywgKCkgPT4ge1xuICB0ZXN0KCdCdWNrZXQgd2l0aCBleHBpcmF0aW9uIGRheXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBsaWZlY3ljbGVSdWxlczogW3tcbiAgICAgICAgZXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygzMCksXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTGlmZWN5Y2xlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBSdWxlczogW3tcbiAgICAgICAgICBFeHBpcmF0aW9uSW5EYXlzOiAzMCxcbiAgICAgICAgICBTdGF0dXM6ICdFbmFibGVkJyxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gdXNlIGFkZExpZmVjeWNsZVJ1bGUoKSB0byBhZGQgYSBsaWZlY3ljbGUgcnVsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICAgIGJ1Y2tldC5hZGRMaWZlY3ljbGVSdWxlKHtcbiAgICAgIGV4cGlyYXRpb246IER1cmF0aW9uLmRheXMoMzApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMaWZlY3ljbGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFJ1bGVzOiBbe1xuICAgICAgICAgIEV4cGlyYXRpb25JbkRheXM6IDMwLFxuICAgICAgICAgIFN0YXR1czogJ0VuYWJsZWQnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1Y2tldCB3aXRoIGV4cGlyYXRpb24gZGF0ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIGxpZmVjeWNsZVJ1bGVzOiBbe1xuICAgICAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUoJzIwMTgtMDEtMDEnKSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMaWZlY3ljbGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFJ1bGVzOiBbe1xuICAgICAgICAgIEV4cGlyYXRpb25EYXRlOiAnMjAxOC0wMS0wMVQwMDowMDowMCcsXG4gICAgICAgICAgU3RhdHVzOiAnRW5hYmxlZCcsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggdHJhbnNpdGlvbiBydWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgbGlmZWN5Y2xlUnVsZXM6IFt7XG4gICAgICAgIHRyYW5zaXRpb25zOiBbe1xuICAgICAgICAgIHN0b3JhZ2VDbGFzczogU3RvcmFnZUNsYXNzLkdMQUNJRVIsXG4gICAgICAgICAgdHJhbnNpdGlvbkFmdGVyOiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgICAgICAgfV0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTGlmZWN5Y2xlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBSdWxlczogW3tcbiAgICAgICAgICBUcmFuc2l0aW9uczogW3tcbiAgICAgICAgICAgIFN0b3JhZ2VDbGFzczogJ0dMQUNJRVInLFxuICAgICAgICAgICAgVHJhbnNpdGlvbkluRGF5czogMzAsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgU3RhdHVzOiAnRW5hYmxlZCcsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggZXhwaXJlZE9iamVjdERlbGV0ZU1hcmtlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgICAgIGxpZmVjeWNsZVJ1bGVzOiBbe1xuICAgICAgICBleHBpcmVkT2JqZWN0RGVsZXRlTWFya2VyOiB0cnVlLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIExpZmVjeWNsZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUnVsZXM6IFt7XG4gICAgICAgICAgRXhwaXJlZE9iamVjdERlbGV0ZU1hcmtlcjogdHJ1ZSxcbiAgICAgICAgICBTdGF0dXM6ICdFbmFibGVkJyxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdOb25jdXJyZW50IHRyYW5zaXN0aW9uIHJ1bGUgd2l0aCB2ZXJzaW9ucyB0byByZXRhaW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTjogTm9uY3VycmVudCB2ZXJzaW9uIHRvIHJldGFpbiBhdmFpbGFibGVcbiAgICBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0MScsIHtcbiAgICAgIGxpZmVjeWNsZVJ1bGVzOiBbe1xuICAgICAgICBub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb246IER1cmF0aW9uLmRheXMoMTApLFxuICAgICAgICBub25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RvcmFnZUNsYXNzOiBTdG9yYWdlQ2xhc3MuR0xBQ0lFUl9JTlNUQU5UX1JFVFJJRVZBTCxcbiAgICAgICAgICAgIHRyYW5zaXRpb25BZnRlcjogRHVyYXRpb24uZGF5cygxMCksXG4gICAgICAgICAgICBub25jdXJyZW50VmVyc2lvbnNUb1JldGFpbjogMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIExpZmVjeWNsZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUnVsZXM6IFt7XG4gICAgICAgICAgTm9uY3VycmVudFZlcnNpb25FeHBpcmF0aW9uOiB7XG4gICAgICAgICAgICBOb25jdXJyZW50RGF5czogMTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOb25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIE5ld2VyTm9uY3VycmVudFZlcnNpb25zOiAxLFxuICAgICAgICAgICAgICBTdG9yYWdlQ2xhc3M6ICdHTEFDSUVSX0lSJyxcbiAgICAgICAgICAgICAgVHJhbnNpdGlvbkluRGF5czogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgU3RhdHVzOiAnRW5hYmxlZCcsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTm9uY3VycmVudCB0cmFuc2lzdGlvbiBydWxlIHdpdGhvdXQgdmVyc2lvbnMgdG8gcmV0YWluJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU46IE5vbmN1cnJlbnQgdmVyc2lvbiB0byByZXRhaW4gbm90IHNldFxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQxJywge1xuICAgICAgbGlmZWN5Y2xlUnVsZXM6IFt7XG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygxMCksXG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uVHJhbnNpdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdG9yYWdlQ2xhc3M6IFN0b3JhZ2VDbGFzcy5HTEFDSUVSX0lOU1RBTlRfUkVUUklFVkFMLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkFmdGVyOiBEdXJhdGlvbi5kYXlzKDEwKSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICAgIExpZmVjeWNsZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgUnVsZXM6IFt7XG4gICAgICAgICAgTm9uY3VycmVudFZlcnNpb25FeHBpcmF0aW9uOiB7XG4gICAgICAgICAgICBOb25jdXJyZW50RGF5czogMTAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOb25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFN0b3JhZ2VDbGFzczogJ0dMQUNJRVJfSVInLFxuICAgICAgICAgICAgICBUcmFuc2l0aW9uSW5EYXlzOiAxMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBTdGF0dXM6ICdFbmFibGVkJyxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdOb25jdXJyZW50IGV4cGlyYXRpb24gcnVsZSB3aXRoIHZlcnNpb25zIHRvIHJldGFpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOOiBOb25jdXJyZW50IHZlcnNpb24gdG8gcmV0YWluIGF2YWlsYWJsZVxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQxJywge1xuICAgICAgbGlmZWN5Y2xlUnVsZXM6IFt7XG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjogRHVyYXRpb24uZGF5cygxMCksXG4gICAgICAgIG5vbmN1cnJlbnRWZXJzaW9uc1RvUmV0YWluOiAxLFxuICAgICAgICBub25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RvcmFnZUNsYXNzOiBTdG9yYWdlQ2xhc3MuR0xBQ0lFUl9JTlNUQU5UX1JFVFJJRVZBTCxcbiAgICAgICAgICAgIHRyYW5zaXRpb25BZnRlcjogRHVyYXRpb24uZGF5cygxMCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMaWZlY3ljbGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFJ1bGVzOiBbe1xuICAgICAgICAgIE5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgTm9uY3VycmVudERheXM6IDEwLFxuICAgICAgICAgICAgTmV3ZXJOb25jdXJyZW50VmVyc2lvbnM6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBOb25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFN0b3JhZ2VDbGFzczogJ0dMQUNJRVJfSVInLFxuICAgICAgICAgICAgICBUcmFuc2l0aW9uSW5EYXlzOiAxMCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBTdGF0dXM6ICdFbmFibGVkJyxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdOb25jdXJyZW50IGV4cGlyYXRpb24gcnVsZSB3aXRob3V0IHZlcnNpb25zIHRvIHJldGFpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOOiBOb25jdXJyZW50IHZlcnNpb24gdG8gcmV0YWluIG5vdCBzZXRcbiAgICBuZXcgQnVja2V0KHN0YWNrLCAnQnVja2V0MScsIHtcbiAgICAgIGxpZmVjeWNsZVJ1bGVzOiBbe1xuICAgICAgICBub25jdXJyZW50VmVyc2lvbkV4cGlyYXRpb246IER1cmF0aW9uLmRheXMoMTApLFxuICAgICAgICBub25jdXJyZW50VmVyc2lvblRyYW5zaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RvcmFnZUNsYXNzOiBTdG9yYWdlQ2xhc3MuR0xBQ0lFUl9JTlNUQU5UX1JFVFJJRVZBTCxcbiAgICAgICAgICAgIHRyYW5zaXRpb25BZnRlcjogRHVyYXRpb24uZGF5cygxMCksXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBMaWZlY3ljbGVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFJ1bGVzOiBbe1xuICAgICAgICAgIE5vbmN1cnJlbnRWZXJzaW9uRXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgTm9uY3VycmVudERheXM6IDEwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgTm9uY3VycmVudFZlcnNpb25UcmFuc2l0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBTdG9yYWdlQ2xhc3M6ICdHTEFDSUVSX0lSJyxcbiAgICAgICAgICAgICAgVHJhbnNpdGlvbkluRGF5czogMTAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgU3RhdHVzOiAnRW5hYmxlZCcsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVja2V0IHdpdGggb2JqZWN0IHNpemUgcnVsZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBCdWNrZXQoc3RhY2ssICdCdWNrZXQnLCB7XG4gICAgICBsaWZlY3ljbGVSdWxlczogW3tcbiAgICAgICAgb2JqZWN0U2l6ZUxlc3NUaGFuOiAwLFxuICAgICAgICBvYmplY3RTaXplR3JlYXRlclRoYW46IDAsXG4gICAgICB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgTGlmZWN5Y2xlQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBSdWxlczogW3tcbiAgICAgICAgICBPYmplY3RTaXplTGVzc1RoYW46IDAsXG4gICAgICAgICAgT2JqZWN0U2l6ZUdyZWF0ZXJUaGFuOiAwLFxuICAgICAgICAgIFN0YXR1czogJ0VuYWJsZWQnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=