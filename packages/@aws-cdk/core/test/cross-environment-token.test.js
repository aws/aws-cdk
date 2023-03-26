"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('cross environment', () => {
    describe('CrossEnvironmentToken', () => {
        test('can reference an ARN with a fixed physical name directly in a different account', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack1 = new lib_1.Stack(app, 'Stack1', {
                env: {
                    account: '123456789012',
                    region: 'bermuda-triangle-1337',
                },
            });
            const myResource = new MyResource(stack1, 'MyResource', 'PhysicalName');
            const stack2 = new lib_1.Stack(app, 'Stack2', {
                env: {
                    account: '234567890123',
                    region: 'bermuda-triangle-42',
                },
            });
            // WHEN
            new lib_1.CfnOutput(stack2, 'Output', {
                value: myResource.arn,
            });
            // THEN
            expect((0, util_1.toCloudFormation)(stack2)).toEqual({
                Outputs: {
                    Output: {
                        Value: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':myservice:::my-resource/PhysicalName',
                                ],
                            ],
                        },
                    },
                },
            });
        });
        test('can reference a fixed physical name directly in a different account', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack1 = new lib_1.Stack(app, 'Stack1', {
                env: {
                    account: '123456789012',
                    region: 'bermuda-triangle-1337',
                },
            });
            const stack2 = new lib_1.Stack(app, 'Stack2', {
                env: {
                    account: '234567890123',
                    region: 'bermuda-triangle-42',
                },
            });
            // WHEN
            const myResource = new MyResource(stack1, 'MyResource', 'PhysicalName');
            new lib_1.CfnOutput(stack2, 'Output', {
                value: myResource.name,
            });
            // THEN
            expect((0, util_1.toCloudFormation)(stack2)).toEqual({
                Outputs: {
                    Output: {
                        Value: 'PhysicalName',
                    },
                },
            });
        });
        test('can reference an ARN with an assigned physical name directly in a different account', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack1 = new lib_1.Stack(app, 'Stack1', {
                env: {
                    account: '123456789012',
                    region: 'bermuda-triangle-1337',
                },
            });
            const myResource = new MyResource(stack1, 'MyResource', lib_1.PhysicalName.GENERATE_IF_NEEDED);
            const stack2 = new lib_1.Stack(app, 'Stack2', {
                env: {
                    account: '234567890123',
                    region: 'bermuda-triangle-42',
                },
            });
            // WHEN
            new lib_1.CfnOutput(stack2, 'Output', {
                value: myResource.arn,
            });
            // THEN
            expect((0, util_1.toCloudFormation)(stack2)).toEqual({
                Outputs: {
                    Output: {
                        Value: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':myservice:::my-resource/stack1stack1myresourcec54ced43683ebf9a3c4c',
                                ],
                            ],
                        },
                    },
                },
            });
        });
        test('can reference an assigned physical name directly in a different account', () => {
            // GIVEN
            const app = new lib_1.App();
            const stack1 = new lib_1.Stack(app, 'Stack1', {
                env: {
                    account: '123456789012',
                    region: 'bermuda-triangle-1337',
                },
            });
            const stack2 = new lib_1.Stack(app, 'Stack2', {
                env: {
                    account: '234567890123',
                    region: 'bermuda-triangle-42',
                },
            });
            // WHEN
            const myResource = new MyResource(stack1, 'MyResource', lib_1.PhysicalName.GENERATE_IF_NEEDED);
            new lib_1.CfnOutput(stack2, 'Output', {
                value: myResource.name,
            });
            // THEN
            expect((0, util_1.toCloudFormation)(stack2)).toEqual({
                Outputs: {
                    Output: {
                        Value: 'stack1stack1myresourcec54ced43683ebf9a3c4c',
                    },
                },
            });
        });
    });
    test('cannot reference a deploy-time physical name across environments', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', {
            env: {
                account: '123456789012',
                region: 'bermuda-triangle-1337',
            },
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', {
            env: {
                account: '234567890123',
                region: 'bermuda-triangle-42',
            },
        });
        // WHEN
        const myResource = new MyResource(stack1, 'MyResource');
        new lib_1.CfnOutput(stack2, 'Output', {
            value: myResource.name,
        });
        // THEN
        expect(() => (0, util_1.toCloudFormation)(stack2)).toThrow(/Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion/);
    });
    test('can reference a deploy-time physical name across regions, when crossRegionReferences=true', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', {
            env: {
                account: '123456789012',
                region: 'bermuda-triangle-1337',
            },
            crossRegionReferences: true,
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', {
            env: {
                account: '123456789012',
                region: 'bermuda-triangle-42',
            },
            crossRegionReferences: true,
        });
        // WHEN
        const myResource = new MyResource(stack1, 'MyResource');
        new lib_1.CfnOutput(stack2, 'Output', {
            value: myResource.name,
        });
        // THEN
        const assembly = app.synth();
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template1?.Resources).toMatchObject({
            'ExportsWriterbermudatriangle42E59594276156AC73': {
                'DeletionPolicy': 'Delete',
                'Properties': {
                    'WriterProps': {
                        'exports': {
                            '/cdk/exports/Stack2/Stack1bermudatriangle1337RefMyResource6073B41F66B72887': {
                                'Ref': 'MyResource6073B41F',
                            },
                        },
                        'region': 'bermuda-triangle-42',
                    },
                    'ServiceToken': {
                        'Fn::GetAtt': [
                            'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                            'Arn',
                        ],
                    },
                },
                'Type': 'Custom::CrossRegionExportWriter',
                'UpdateReplacePolicy': 'Delete',
            },
        });
        expect(template2?.Outputs).toEqual({
            'Output': {
                'Value': {
                    'Fn::GetAtt': [
                        'ExportsReader8B249524',
                        '/cdk/exports/Stack2/Stack1bermudatriangle1337RefMyResource6073B41F66B72887',
                    ],
                },
            },
        });
    });
    test('cannot reference a deploy-time physical name across regions, when crossRegionReferences=false', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'Stack1', {
            env: {
                account: '123456789012',
                region: 'bermuda-triangle-1337',
            },
            crossRegionReferences: true,
        });
        const stack2 = new lib_1.Stack(app, 'Stack2', {
            env: {
                account: '123456789012',
                region: 'bermuda-triangle-42',
            },
            crossRegionReferences: false,
        });
        // WHEN
        const myResource = new MyResource(stack1, 'MyResource');
        new lib_1.CfnOutput(stack2, 'Output', {
            value: myResource.name,
        });
        // THEN
        expect(() => (0, util_1.toCloudFormation)(stack2)).toThrow(/Cannot use resource 'Stack1\/MyResource' in a cross-environment fashion/);
    });
    test('cross environment when stack is a substack', () => {
        const app = new lib_1.App();
        const parentStack = new lib_1.Stack(app, 'ParentStack', {
            env: { account: '112233', region: 'us-east-1' },
        });
        const childStack = new lib_1.Stack(parentStack, 'ChildStack', {
            env: { account: '998877', region: 'eu-west-2' },
        });
        const childResource = new MyResource(childStack, 'ChildResource', lib_1.PhysicalName.GENERATE_IF_NEEDED);
        new lib_1.CfnResource(parentStack, 'ParentResource', {
            type: 'Parent::Resource',
            properties: {
                RefToChildResource: childResource.name,
            },
        });
        const assembly = app.synth();
        expect(assembly.getStackByName(parentStack.stackName).template?.Resources).toEqual({
            ParentResource: {
                Type: 'Parent::Resource',
                Properties: {
                    RefToChildResource: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
                },
            },
        });
        expect(assembly.getStackByName(childStack.stackName).template?.Resources).toEqual({
            ChildResource8C37244D: {
                Type: 'My::Resource',
                Properties: {
                    resourceName: 'parentstackchildstack83c5ackchildresource852877eeb919bda2008e',
                },
            },
        });
    });
});
test.each([undefined, 'SomeName'])('stack.exportValue() on name attributes with PhysicalName=%s', physicalName => {
    // Check that automatic exports and manual exports look the same
    // GIVEN - auto
    const appA = new lib_1.App();
    const producerA = new lib_1.Stack(appA, 'Producer');
    const resourceA = new MyResource(producerA, 'Resource', physicalName);
    const consumerA = new lib_1.Stack(appA, 'Consumer');
    new lib_1.CfnOutput(consumerA, 'ConsumeName', { value: resourceA.name });
    new lib_1.CfnOutput(consumerA, 'ConsumeArn', { value: resourceA.arn });
    // WHEN - manual
    const appM = new lib_1.App();
    const producerM = new lib_1.Stack(appM, 'Producer');
    const resourceM = new MyResource(producerM, 'Resource', physicalName);
    producerM.exportValue(resourceM.name);
    producerM.exportValue(resourceM.arn);
    // THEN - producers are the same
    const templateA = appA.synth().getStackByName(producerA.stackName).template;
    const templateM = appM.synth().getStackByName(producerM.stackName).template;
    expect(templateA).toEqual(templateM);
});
test('can instantiate resource with constructed physicalname ARN', () => {
    const stack = new lib_1.Stack();
    new MyResourceWithConstructedArnAttribute(stack, 'Resource');
});
class MyResource extends lib_1.Resource {
    constructor(scope, id, physicalName) {
        super(scope, id, { physicalName });
        const res = new lib_1.CfnResource(this, 'Resource', {
            type: 'My::Resource',
            properties: {
                resourceName: this.physicalName,
            },
        });
        this.name = this.getResourceNameAttribute(res.ref.toString());
        this.arn = this.getResourceArnAttribute(res.getAtt('Arn').toString(), {
            region: '',
            account: '',
            resource: 'my-resource',
            resourceName: this.physicalName,
            service: 'myservice',
        });
    }
}
/**
 * Some resources build their own Arn attribute by constructing strings
 *
 * This will be because the L1 doesn't expose a `{ Fn::GetAtt: ['Arn'] }`.
 *
 * They won't be able to `exportValue()` it, but it shouldn't crash.
 */
class MyResourceWithConstructedArnAttribute extends lib_1.Resource {
    constructor(scope, id, physicalName) {
        super(scope, id, { physicalName });
        const res = new lib_1.CfnResource(this, 'Resource', {
            type: 'My::Resource',
            properties: {
                resourceName: this.physicalName,
            },
        });
        this.name = this.getResourceNameAttribute(res.ref.toString());
        this.arn = this.getResourceArnAttribute(lib_1.Stack.of(this).formatArn({
            resource: 'my-resource',
            resourceName: res.ref.toString(),
            service: 'myservice',
        }), {
            resource: 'my-resource',
            resourceName: this.physicalName,
            service: 'myservice',
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtZW52aXJvbm1lbnQtdG9rZW4udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLWVudmlyb25tZW50LXRva2VuLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEM7QUFDMUMsZ0NBQW9GO0FBRXBGLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDckMsSUFBSSxDQUFDLGlGQUFpRixFQUFFLEdBQUcsRUFBRTtZQUMzRixRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7aUJBQ2hDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RSxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSxxQkFBcUI7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLElBQUksZUFBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQzlCLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRzthQUN0QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUU7d0JB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RUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDNUMsSUFBSSxFQUFFLGNBQWM7WUFDcEIsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWTthQUNoQztTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUMvRCxRQUFRLEVBQUUsYUFBYTtZQUN2QixZQUFZLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7WUFDaEMsT0FBTyxFQUFFLFdBQVc7U0FDckIsQ0FBQyxFQUFFO1lBQ0YsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUMsQ0FBQztLQUNKO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQXBwLCBDZm5PdXRwdXQsIENmblJlc291cmNlLCBQaHlzaWNhbE5hbWUsIFJlc291cmNlLCBTdGFjayB9IGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdjcm9zcyBlbnZpcm9ubWVudCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0Nyb3NzRW52aXJvbm1lbnRUb2tlbicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gcmVmZXJlbmNlIGFuIEFSTiB3aXRoIGEgZml4ZWQgcGh5c2ljYWwgbmFtZSBkaXJlY3RseSBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShzdGFjazEsICdNeVJlc291cmNlJywgJ1BoeXNpY2FsTmFtZScpO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMjM0NTY3ODkwMTIzJyxcbiAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6IG15UmVzb3VyY2UuYXJuLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMikpLnRvRXF1YWwoe1xuICAgICAgICBPdXRwdXRzOiB7XG4gICAgICAgICAgT3V0cHV0OiB7XG4gICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpteXNlcnZpY2U6OjpteS1yZXNvdXJjZS9QaHlzaWNhbE5hbWUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiByZWZlcmVuY2UgYSBmaXhlZCBwaHlzaWNhbCBuYW1lIGRpcmVjdGx5IGluIGEgZGlmZmVyZW50IGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzIzNDU2Nzg5MDEyMycsXG4gICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKHN0YWNrMSwgJ015UmVzb3VyY2UnLCAnUGh5c2ljYWxOYW1lJyk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6IG15UmVzb3VyY2UubmFtZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b0VxdWFsKHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIE91dHB1dDoge1xuICAgICAgICAgICAgVmFsdWU6ICdQaHlzaWNhbE5hbWUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiByZWZlcmVuY2UgYW4gQVJOIHdpdGggYW4gYXNzaWduZWQgcGh5c2ljYWwgbmFtZSBkaXJlY3RseSBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShzdGFjazEsICdNeVJlc291cmNlJywgUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCk7XG5cbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgICB2YWx1ZTogbXlSZXNvdXJjZS5hcm4sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9FcXVhbCh7XG4gICAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgICBPdXRwdXQ6IHtcbiAgICAgICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOm15c2VydmljZTo6Om15LXJlc291cmNlL3N0YWNrMXN0YWNrMW15cmVzb3VyY2VjNTRjZWQ0MzY4M2ViZjlhM2M0YycsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHJlZmVyZW5jZSBhbiBhc3NpZ25lZCBwaHlzaWNhbCBuYW1lIGRpcmVjdGx5IGluIGEgZGlmZmVyZW50IGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzIzNDU2Nzg5MDEyMycsXG4gICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKHN0YWNrMSwgJ015UmVzb3VyY2UnLCBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVEKTtcbiAgICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgICB2YWx1ZTogbXlSZXNvdXJjZS5uYW1lLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMikpLnRvRXF1YWwoe1xuICAgICAgICBPdXRwdXRzOiB7XG4gICAgICAgICAgT3V0cHV0OiB7XG4gICAgICAgICAgICBWYWx1ZTogJ3N0YWNrMXN0YWNrMW15cmVzb3VyY2VjNTRjZWQ0MzY4M2ViZjlhM2M0YycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgcmVmZXJlbmNlIGEgZGVwbG95LXRpbWUgcGh5c2ljYWwgbmFtZSBhY3Jvc3MgZW52aXJvbm1lbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzIzNDU2Nzg5MDEyMycsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2Uoc3RhY2sxLCAnTXlSZXNvdXJjZScpO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IG15UmVzb3VyY2UubmFtZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b1Rocm93KFxuICAgICAgL0Nhbm5vdCB1c2UgcmVzb3VyY2UgJ1N0YWNrMVxcL015UmVzb3VyY2UnIGluIGEgY3Jvc3MtZW52aXJvbm1lbnQgZmFzaGlvbi8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcmVmZXJlbmNlIGEgZGVwbG95LXRpbWUgcGh5c2ljYWwgbmFtZSBhY3Jvc3MgcmVnaW9ucywgd2hlbiBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgfSxcbiAgICAgIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKHN0YWNrMSwgJ015UmVzb3VyY2UnKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgIHZhbHVlOiBteVJlc291cmNlLm5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTE/LlJlc291cmNlcykudG9NYXRjaE9iamVjdCh7XG4gICAgICAnRXhwb3J0c1dyaXRlcmJlcm11ZGF0cmlhbmdsZTQyRTU5NTk0Mjc2MTU2QUM3Myc6IHtcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdXcml0ZXJQcm9wcyc6IHtcbiAgICAgICAgICAgICdleHBvcnRzJzoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3UmVmTXlSZXNvdXJjZTYwNzNCNDFGNjZCNzI4ODcnOiB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdNeVJlc291cmNlNjA3M0I0MUYnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdyZWdpb24nOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnU2VydmljZVRva2VuJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1R5cGUnOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgICdVcGRhdGVSZXBsYWNlUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTI/Lk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgJ091dHB1dCc6IHtcbiAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3UmVmTXlSZXNvdXJjZTYwNzNCNDFGNjZCNzI4ODcnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgcmVmZXJlbmNlIGEgZGVwbG95LXRpbWUgcGh5c2ljYWwgbmFtZSBhY3Jvc3MgcmVnaW9ucywgd2hlbiBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2Uoc3RhY2sxLCAnTXlSZXNvdXJjZScpO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IG15UmVzb3VyY2UubmFtZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b1Rocm93KFxuICAgICAgL0Nhbm5vdCB1c2UgcmVzb3VyY2UgJ1N0YWNrMVxcL015UmVzb3VyY2UnIGluIGEgY3Jvc3MtZW52aXJvbm1lbnQgZmFzaGlvbi8pO1xuICB9KTtcblxuICB0ZXN0KCdjcm9zcyBlbnZpcm9ubWVudCB3aGVuIHN0YWNrIGlzIGEgc3Vic3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3QgcGFyZW50U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGFyZW50U3RhY2snLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzExMjIzMycsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoaWxkU3RhY2sgPSBuZXcgU3RhY2socGFyZW50U3RhY2ssICdDaGlsZFN0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICc5OTg4NzcnLCByZWdpb246ICdldS13ZXN0LTInIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGlsZFJlc291cmNlID0gbmV3IE15UmVzb3VyY2UoY2hpbGRTdGFjaywgJ0NoaWxkUmVzb3VyY2UnLCBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVEKTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShwYXJlbnRTdGFjaywgJ1BhcmVudFJlc291cmNlJywge1xuICAgICAgdHlwZTogJ1BhcmVudDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWZUb0NoaWxkUmVzb3VyY2U6IGNoaWxkUmVzb3VyY2UubmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHBhcmVudFN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU/LlJlc291cmNlcykudG9FcXVhbCh7XG4gICAgICBQYXJlbnRSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnUGFyZW50OjpSZXNvdXJjZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBSZWZUb0NoaWxkUmVzb3VyY2U6ICdwYXJlbnRzdGFja2NoaWxkc3RhY2s4M2M1YWNrY2hpbGRyZXNvdXJjZTg1Mjg3N2VlYjkxOWJkYTIwMDhlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoY2hpbGRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgQ2hpbGRSZXNvdXJjZThDMzcyNDREOiB7XG4gICAgICAgIFR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcmVzb3VyY2VOYW1lOiAncGFyZW50c3RhY2tjaGlsZHN0YWNrODNjNWFja2NoaWxkcmVzb3VyY2U4NTI4NzdlZWI5MTliZGEyMDA4ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0LmVhY2goW3VuZGVmaW5lZCwgJ1NvbWVOYW1lJ10pKCdzdGFjay5leHBvcnRWYWx1ZSgpIG9uIG5hbWUgYXR0cmlidXRlcyB3aXRoIFBoeXNpY2FsTmFtZT0lcycsIHBoeXNpY2FsTmFtZSA9PiB7XG4gIC8vIENoZWNrIHRoYXQgYXV0b21hdGljIGV4cG9ydHMgYW5kIG1hbnVhbCBleHBvcnRzIGxvb2sgdGhlIHNhbWVcbiAgLy8gR0lWRU4gLSBhdXRvXG4gIGNvbnN0IGFwcEEgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHByb2R1Y2VyQSA9IG5ldyBTdGFjayhhcHBBLCAnUHJvZHVjZXInKTtcbiAgY29uc3QgcmVzb3VyY2VBID0gbmV3IE15UmVzb3VyY2UocHJvZHVjZXJBLCAnUmVzb3VyY2UnLCBwaHlzaWNhbE5hbWUpO1xuXG4gIGNvbnN0IGNvbnN1bWVyQSA9IG5ldyBTdGFjayhhcHBBLCAnQ29uc3VtZXInKTtcbiAgbmV3IENmbk91dHB1dChjb25zdW1lckEsICdDb25zdW1lTmFtZScsIHsgdmFsdWU6IHJlc291cmNlQS5uYW1lIH0pO1xuICBuZXcgQ2ZuT3V0cHV0KGNvbnN1bWVyQSwgJ0NvbnN1bWVBcm4nLCB7IHZhbHVlOiByZXNvdXJjZUEuYXJuIH0pO1xuXG4gIC8vIFdIRU4gLSBtYW51YWxcbiAgY29uc3QgYXBwTSA9IG5ldyBBcHAoKTtcbiAgY29uc3QgcHJvZHVjZXJNID0gbmV3IFN0YWNrKGFwcE0sICdQcm9kdWNlcicpO1xuICBjb25zdCByZXNvdXJjZU0gPSBuZXcgTXlSZXNvdXJjZShwcm9kdWNlck0sICdSZXNvdXJjZScsIHBoeXNpY2FsTmFtZSk7XG4gIHByb2R1Y2VyTS5leHBvcnRWYWx1ZShyZXNvdXJjZU0ubmFtZSk7XG4gIHByb2R1Y2VyTS5leHBvcnRWYWx1ZShyZXNvdXJjZU0uYXJuKTtcblxuICAvLyBUSEVOIC0gcHJvZHVjZXJzIGFyZSB0aGUgc2FtZVxuICBjb25zdCB0ZW1wbGF0ZUEgPSBhcHBBLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUocHJvZHVjZXJBLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gIGNvbnN0IHRlbXBsYXRlTSA9IGFwcE0uc3ludGgoKS5nZXRTdGFja0J5TmFtZShwcm9kdWNlck0uc3RhY2tOYW1lKS50ZW1wbGF0ZTtcblxuICBleHBlY3QodGVtcGxhdGVBKS50b0VxdWFsKHRlbXBsYXRlTSk7XG59KTtcblxudGVzdCgnY2FuIGluc3RhbnRpYXRlIHJlc291cmNlIHdpdGggY29uc3RydWN0ZWQgcGh5c2ljYWxuYW1lIEFSTicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgbmV3IE15UmVzb3VyY2VXaXRoQ29uc3RydWN0ZWRBcm5BdHRyaWJ1dGUoc3RhY2ssICdSZXNvdXJjZScpO1xufSk7XG5cbmNsYXNzIE15UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSBhcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwaHlzaWNhbE5hbWU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgcGh5c2ljYWxOYW1lIH0pO1xuXG4gICAgY29uc3QgcmVzID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlcy5yZWYudG9TdHJpbmcoKSk7XG4gICAgdGhpcy5hcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlcy5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCksIHtcbiAgICAgIHJlZ2lvbjogJycsXG4gICAgICBhY2NvdW50OiAnJyxcbiAgICAgIHJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNlcnZpY2U6ICdteXNlcnZpY2UnLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU29tZSByZXNvdXJjZXMgYnVpbGQgdGhlaXIgb3duIEFybiBhdHRyaWJ1dGUgYnkgY29uc3RydWN0aW5nIHN0cmluZ3NcbiAqXG4gKiBUaGlzIHdpbGwgYmUgYmVjYXVzZSB0aGUgTDEgZG9lc24ndCBleHBvc2UgYSBgeyBGbjo6R2V0QXR0OiBbJ0FybiddIH1gLlxuICpcbiAqIFRoZXkgd29uJ3QgYmUgYWJsZSB0byBgZXhwb3J0VmFsdWUoKWAgaXQsIGJ1dCBpdCBzaG91bGRuJ3QgY3Jhc2guXG4gKi9cbmNsYXNzIE15UmVzb3VyY2VXaXRoQ29uc3RydWN0ZWRBcm5BdHRyaWJ1dGUgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSBhcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwaHlzaWNhbE5hbWU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgcGh5c2ljYWxOYW1lIH0pO1xuXG4gICAgY29uc3QgcmVzID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlcy5yZWYudG9TdHJpbmcoKSk7XG4gICAgdGhpcy5hcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgIHJlc291cmNlTmFtZTogcmVzLnJlZi50b1N0cmluZygpLFxuICAgICAgc2VydmljZTogJ215c2VydmljZScsXG4gICAgfSksIHtcbiAgICAgIHJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNlcnZpY2U6ICdteXNlcnZpY2UnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=