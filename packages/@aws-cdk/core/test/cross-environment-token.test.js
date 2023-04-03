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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvc3MtZW52aXJvbm1lbnQtdG9rZW4udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyb3NzLWVudmlyb25tZW50LXRva2VuLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBMEM7QUFDMUMsZ0NBQW9GO0FBRXBGLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDckMsSUFBSSxDQUFDLGlGQUFpRixFQUFFLEdBQUcsRUFBRTtZQUMzRixRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7aUJBQ2hDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV4RSxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSxxQkFBcUI7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLElBQUksZUFBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQzlCLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRzthQUN0QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUU7d0JBQ04sS0FBSyxFQUFFOzRCQUNMLFVBQVUsRUFBRTtnQ0FDVixFQUFFO2dDQUNGO29DQUNFLE1BQU07b0NBQ047d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0QsdUNBQXVDO2lDQUN4Qzs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUMvRSxRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7aUJBQ2hDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtnQkFDdEMsR0FBRyxFQUFFO29CQUNILE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUscUJBQXFCO2lCQUM5QjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksZUFBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQzlCLEtBQUssRUFBRSxVQUFVLENBQUMsSUFBSTthQUN2QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUU7d0JBQ04sS0FBSyxFQUFFLGNBQWM7cUJBQ3RCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUZBQXFGLEVBQUUsR0FBRyxFQUFFO1lBQy9GLFFBQVE7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7Z0JBQ3RDLEdBQUcsRUFBRTtvQkFDSCxPQUFPLEVBQUUsY0FBYztvQkFDdkIsTUFBTSxFQUFFLHVCQUF1QjtpQkFDaEM7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLGtCQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUV6RixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSxxQkFBcUI7aUJBQzlCO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLElBQUksZUFBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQzlCLEtBQUssRUFBRSxVQUFVLENBQUMsR0FBRzthQUN0QixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUU7d0JBQ04sS0FBSyxFQUFFOzRCQUNMLFVBQVUsRUFBRTtnQ0FDVixFQUFFO2dDQUNGO29DQUNFLE1BQU07b0NBQ047d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0QscUVBQXFFO2lDQUN0RTs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtZQUNuRixRQUFRO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLGNBQWM7b0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7aUJBQ2hDO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtnQkFDdEMsR0FBRyxFQUFFO29CQUNILE9BQU8sRUFBRSxjQUFjO29CQUN2QixNQUFNLEVBQUUscUJBQXFCO2lCQUM5QjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLGtCQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN6RixJQUFJLGVBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO2dCQUM5QixLQUFLLEVBQUUsVUFBVSxDQUFDLElBQUk7YUFDdkIsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN2QyxPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFO3dCQUNOLEtBQUssRUFBRSw0Q0FBNEM7cUJBQ3BEO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7UUFDNUUsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUN0QyxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLE1BQU0sRUFBRSx1QkFBdUI7YUFDaEM7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLHFCQUFxQjthQUM5QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEQsSUFBSSxlQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUM5QixLQUFLLEVBQUUsVUFBVSxDQUFDLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHVCQUFnQixFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUM1Qyx5RUFBeUUsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJGQUEyRixFQUFFLEdBQUcsRUFBRTtRQUNyRyxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLHVCQUF1QjthQUNoQztZQUNELHFCQUFxQixFQUFFLElBQUk7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUN0QyxHQUFHLEVBQUU7Z0JBQ0gsT0FBTyxFQUFFLGNBQWM7Z0JBQ3ZCLE1BQU0sRUFBRSxxQkFBcUI7YUFDOUI7WUFDRCxxQkFBcUIsRUFBRSxJQUFJO1NBQzVCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEQsSUFBSSxlQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtZQUM5QixLQUFLLEVBQUUsVUFBVSxDQUFDLElBQUk7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDckUsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRXJFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQ3pDLGdEQUFnRCxFQUFFO2dCQUNoRCxnQkFBZ0IsRUFBRSxRQUFRO2dCQUMxQixZQUFZLEVBQUU7b0JBQ1osYUFBYSxFQUFFO3dCQUNiLFNBQVMsRUFBRTs0QkFDVCw0RUFBNEUsRUFBRTtnQ0FDNUUsS0FBSyxFQUFFLG9CQUFvQjs2QkFDNUI7eUJBQ0Y7d0JBQ0QsUUFBUSxFQUFFLHFCQUFxQjtxQkFDaEM7b0JBQ0QsY0FBYyxFQUFFO3dCQUNkLFlBQVksRUFBRTs0QkFDWixvRUFBb0U7NEJBQ3BFLEtBQUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLGlDQUFpQztnQkFDekMscUJBQXFCLEVBQUUsUUFBUTthQUNoQztTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pDLFFBQVEsRUFBRTtnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWSxFQUFFO3dCQUNaLHVCQUF1Qjt3QkFDdkIsNEVBQTRFO3FCQUM3RTtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0ZBQStGLEVBQUUsR0FBRyxFQUFFO1FBQ3pHLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDdEMsR0FBRyxFQUFFO2dCQUNILE9BQU8sRUFBRSxjQUFjO2dCQUN2QixNQUFNLEVBQUUsdUJBQXVCO2FBQ2hDO1lBQ0QscUJBQXFCLEVBQUUsSUFBSTtTQUM1QixDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO1lBQ3RDLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLHFCQUFxQjthQUM5QjtZQUNELHFCQUFxQixFQUFFLEtBQUs7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN4RCxJQUFJLGVBQVMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO1lBQzlCLEtBQUssRUFBRSxVQUFVLENBQUMsSUFBSTtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzVDLHlFQUF5RSxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7UUFFdEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRTtZQUNoRCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxXQUFLLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRTtZQUN0RCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7U0FDaEQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFLGVBQWUsRUFBRSxrQkFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFbkcsSUFBSSxpQkFBVyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRTtZQUM3QyxJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLFVBQVUsRUFBRTtnQkFDVixrQkFBa0IsRUFBRSxhQUFhLENBQUMsSUFBSTthQUN2QztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU3QixNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNqRixjQUFjLEVBQUU7Z0JBQ2QsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsVUFBVSxFQUFFO29CQUNWLGtCQUFrQixFQUFFLCtEQUErRDtpQkFDcEY7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2hGLHFCQUFxQixFQUFFO2dCQUNyQixJQUFJLEVBQUUsY0FBYztnQkFDcEIsVUFBVSxFQUFFO29CQUNWLFlBQVksRUFBRSwrREFBK0Q7aUJBQzlFO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLDZEQUE2RCxFQUFFLFlBQVksQ0FBQyxFQUFFO0lBQy9HLGdFQUFnRTtJQUNoRSxlQUFlO0lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxTQUFHLEVBQUUsQ0FBQztJQUN2QixNQUFNLFNBQVMsR0FBRyxJQUFJLFdBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUV0RSxNQUFNLFNBQVMsR0FBRyxJQUFJLFdBQUssQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUMsSUFBSSxlQUFTLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRSxJQUFJLGVBQVMsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRWpFLGdCQUFnQjtJQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO0lBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksV0FBSyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5QyxNQUFNLFNBQVMsR0FBRyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3RFLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXJDLGdDQUFnQztJQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFDNUUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBRTVFLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO0lBQ3RFLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7SUFDMUIsSUFBSSxxQ0FBcUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDL0QsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVcsU0FBUSxjQUFRO0lBSS9CLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsWUFBcUI7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQzVDLElBQUksRUFBRSxjQUFjO1lBQ3BCLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7YUFDaEM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNwRSxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFFO1lBQ1gsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVEOzs7Ozs7R0FNRztBQUNILE1BQU0scUNBQXNDLFNBQVEsY0FBUTtJQUkxRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFlBQXFCO1FBQzdELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUVuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUM1QyxJQUFJLEVBQUUsY0FBYztZQUNwQixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQy9ELFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFlBQVksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtZQUNoQyxPQUFPLEVBQUUsV0FBVztTQUNyQixDQUFDLEVBQUU7WUFDRixRQUFRLEVBQUUsYUFBYTtZQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsT0FBTyxFQUFFLFdBQVc7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBDZm5SZXNvdXJjZSwgUGh5c2ljYWxOYW1lLCBSZXNvdXJjZSwgU3RhY2sgfSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnY3Jvc3MgZW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdDcm9zc0Vudmlyb25tZW50VG9rZW4nLCAoKSA9PiB7XG4gICAgdGVzdCgnY2FuIHJlZmVyZW5jZSBhbiBBUk4gd2l0aCBhIGZpeGVkIHBoeXNpY2FsIG5hbWUgZGlyZWN0bHkgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2Uoc3RhY2sxLCAnTXlSZXNvdXJjZScsICdQaHlzaWNhbE5hbWUnKTtcblxuICAgICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzIzNDU2Nzg5MDEyMycsXG4gICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IENmbk91dHB1dChzdGFjazIsICdPdXRwdXQnLCB7XG4gICAgICAgIHZhbHVlOiBteVJlc291cmNlLmFybixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b0VxdWFsKHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIE91dHB1dDoge1xuICAgICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6bXlzZXJ2aWNlOjo6bXktcmVzb3VyY2UvUGh5c2ljYWxOYW1lJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gcmVmZXJlbmNlIGEgZml4ZWQgcGh5c2ljYWwgbmFtZSBkaXJlY3RseSBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShzdGFjazEsICdNeVJlc291cmNlJywgJ1BoeXNpY2FsTmFtZScpO1xuICAgICAgbmV3IENmbk91dHB1dChzdGFjazIsICdPdXRwdXQnLCB7XG4gICAgICAgIHZhbHVlOiBteVJlc291cmNlLm5hbWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9FcXVhbCh7XG4gICAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgICBPdXRwdXQ6IHtcbiAgICAgICAgICAgIFZhbHVlOiAnUGh5c2ljYWxOYW1lJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gcmVmZXJlbmNlIGFuIEFSTiB3aXRoIGFuIGFzc2lnbmVkIHBoeXNpY2FsIG5hbWUgZGlyZWN0bHkgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2Uoc3RhY2sxLCAnTXlSZXNvdXJjZScsIFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQpO1xuXG4gICAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBhY2NvdW50OiAnMjM0NTY3ODkwMTIzJyxcbiAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6IG15UmVzb3VyY2UuYXJuLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMikpLnRvRXF1YWwoe1xuICAgICAgICBPdXRwdXRzOiB7XG4gICAgICAgICAgT3V0cHV0OiB7XG4gICAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpteXNlcnZpY2U6OjpteS1yZXNvdXJjZS9zdGFjazFzdGFjazFteXJlc291cmNlYzU0Y2VkNDM2ODNlYmY5YTNjNGMnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiByZWZlcmVuY2UgYW4gYXNzaWduZWQgcGh5c2ljYWwgbmFtZSBkaXJlY3RseSBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnLFxuICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShzdGFjazEsICdNeVJlc291cmNlJywgUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCk7XG4gICAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgICAgdmFsdWU6IG15UmVzb3VyY2UubmFtZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b0VxdWFsKHtcbiAgICAgICAgT3V0cHV0czoge1xuICAgICAgICAgIE91dHB1dDoge1xuICAgICAgICAgICAgVmFsdWU6ICdzdGFjazFzdGFjazFteXJlc291cmNlYzU0Y2VkNDM2ODNlYmY5YTNjNGMnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IHJlZmVyZW5jZSBhIGRlcGxveS10aW1lIHBoeXNpY2FsIG5hbWUgYWNyb3NzIGVudmlyb25tZW50cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcyMzQ1Njc4OTAxMjMnLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKHN0YWNrMSwgJ015UmVzb3VyY2UnKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgIHZhbHVlOiBteVJlc291cmNlLm5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9UaHJvdyhcbiAgICAgIC9DYW5ub3QgdXNlIHJlc291cmNlICdTdGFjazFcXC9NeVJlc291cmNlJyBpbiBhIGNyb3NzLWVudmlyb25tZW50IGZhc2hpb24vKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHJlZmVyZW5jZSBhIGRlcGxveS10aW1lIHBoeXNpY2FsIG5hbWUgYWNyb3NzIHJlZ2lvbnMsIHdoZW4gY3Jvc3NSZWdpb25SZWZlcmVuY2VzPXRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShzdGFjazEsICdNeVJlc291cmNlJyk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjazIsICdPdXRwdXQnLCB7XG4gICAgICB2YWx1ZTogbXlSZXNvdXJjZS5uYW1lLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgICBleHBlY3QodGVtcGxhdGUxPy5SZXNvdXJjZXMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgJ0V4cG9ydHNXcml0ZXJiZXJtdWRhdHJpYW5nbGU0MkU1OTU5NDI3NjE1NkFDNzMnOiB7XG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnV3JpdGVyUHJvcHMnOiB7XG4gICAgICAgICAgICAnZXhwb3J0cyc6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN1JlZk15UmVzb3VyY2U2MDczQjQxRjY2QjcyODg3Jzoge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnTXlSZXNvdXJjZTYwNzNCNDFGJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAncmVnaW9uJzogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1NlcnZpY2VUb2tlbic6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdUeXBlJzogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QodGVtcGxhdGUyPy5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgICdPdXRwdXQnOiB7XG4gICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdFeHBvcnRzUmVhZGVyOEIyNDk1MjQnLFxuICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN1JlZk15UmVzb3VyY2U2MDczQjQxRjY2QjcyODg3JyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IHJlZmVyZW5jZSBhIGRlcGxveS10aW1lIHBoeXNpY2FsIG5hbWUgYWNyb3NzIHJlZ2lvbnMsIHdoZW4gY3Jvc3NSZWdpb25SZWZlcmVuY2VzPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgfSxcbiAgICAgIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKHN0YWNrMSwgJ015UmVzb3VyY2UnKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgIHZhbHVlOiBteVJlc291cmNlLm5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9UaHJvdyhcbiAgICAgIC9DYW5ub3QgdXNlIHJlc291cmNlICdTdGFjazFcXC9NeVJlc291cmNlJyBpbiBhIGNyb3NzLWVudmlyb25tZW50IGZhc2hpb24vKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MgZW52aXJvbm1lbnQgd2hlbiBzdGFjayBpcyBhIHN1YnN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIGNvbnN0IHBhcmVudFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BhcmVudFN0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMTIyMzMnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGlsZFN0YWNrID0gbmV3IFN0YWNrKHBhcmVudFN0YWNrLCAnQ2hpbGRTdGFjaycsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnOTk4ODc3JywgcmVnaW9uOiAnZXUtd2VzdC0yJyB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hpbGRSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKGNoaWxkU3RhY2ssICdDaGlsZFJlc291cmNlJywgUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UocGFyZW50U3RhY2ssICdQYXJlbnRSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdQYXJlbnQ6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUmVmVG9DaGlsZFJlc291cmNlOiBjaGlsZFJlc291cmNlLm5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChhc3NlbWJseS5nZXRTdGFja0J5TmFtZShwYXJlbnRTdGFjay5zdGFja05hbWUpLnRlbXBsYXRlPy5SZXNvdXJjZXMpLnRvRXF1YWwoe1xuICAgICAgUGFyZW50UmVzb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ1BhcmVudDo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUmVmVG9DaGlsZFJlc291cmNlOiAncGFyZW50c3RhY2tjaGlsZHN0YWNrODNjNWFja2NoaWxkcmVzb3VyY2U4NTI4NzdlZWI5MTliZGEyMDA4ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKGNoaWxkU3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZT8uUmVzb3VyY2VzKS50b0VxdWFsKHtcbiAgICAgIENoaWxkUmVzb3VyY2U4QzM3MjQ0RDoge1xuICAgICAgICBUeXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIHJlc291cmNlTmFtZTogJ3BhcmVudHN0YWNrY2hpbGRzdGFjazgzYzVhY2tjaGlsZHJlc291cmNlODUyODc3ZWViOTE5YmRhMjAwOGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdC5lYWNoKFt1bmRlZmluZWQsICdTb21lTmFtZSddKSgnc3RhY2suZXhwb3J0VmFsdWUoKSBvbiBuYW1lIGF0dHJpYnV0ZXMgd2l0aCBQaHlzaWNhbE5hbWU9JXMnLCBwaHlzaWNhbE5hbWUgPT4ge1xuICAvLyBDaGVjayB0aGF0IGF1dG9tYXRpYyBleHBvcnRzIGFuZCBtYW51YWwgZXhwb3J0cyBsb29rIHRoZSBzYW1lXG4gIC8vIEdJVkVOIC0gYXV0b1xuICBjb25zdCBhcHBBID0gbmV3IEFwcCgpO1xuICBjb25zdCBwcm9kdWNlckEgPSBuZXcgU3RhY2soYXBwQSwgJ1Byb2R1Y2VyJyk7XG4gIGNvbnN0IHJlc291cmNlQSA9IG5ldyBNeVJlc291cmNlKHByb2R1Y2VyQSwgJ1Jlc291cmNlJywgcGh5c2ljYWxOYW1lKTtcblxuICBjb25zdCBjb25zdW1lckEgPSBuZXcgU3RhY2soYXBwQSwgJ0NvbnN1bWVyJyk7XG4gIG5ldyBDZm5PdXRwdXQoY29uc3VtZXJBLCAnQ29uc3VtZU5hbWUnLCB7IHZhbHVlOiByZXNvdXJjZUEubmFtZSB9KTtcbiAgbmV3IENmbk91dHB1dChjb25zdW1lckEsICdDb25zdW1lQXJuJywgeyB2YWx1ZTogcmVzb3VyY2VBLmFybiB9KTtcblxuICAvLyBXSEVOIC0gbWFudWFsXG4gIGNvbnN0IGFwcE0gPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHByb2R1Y2VyTSA9IG5ldyBTdGFjayhhcHBNLCAnUHJvZHVjZXInKTtcbiAgY29uc3QgcmVzb3VyY2VNID0gbmV3IE15UmVzb3VyY2UocHJvZHVjZXJNLCAnUmVzb3VyY2UnLCBwaHlzaWNhbE5hbWUpO1xuICBwcm9kdWNlck0uZXhwb3J0VmFsdWUocmVzb3VyY2VNLm5hbWUpO1xuICBwcm9kdWNlck0uZXhwb3J0VmFsdWUocmVzb3VyY2VNLmFybik7XG5cbiAgLy8gVEhFTiAtIHByb2R1Y2VycyBhcmUgdGhlIHNhbWVcbiAgY29uc3QgdGVtcGxhdGVBID0gYXBwQS5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHByb2R1Y2VyQS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICBjb25zdCB0ZW1wbGF0ZU0gPSBhcHBNLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUocHJvZHVjZXJNLnN0YWNrTmFtZSkudGVtcGxhdGU7XG5cbiAgZXhwZWN0KHRlbXBsYXRlQSkudG9FcXVhbCh0ZW1wbGF0ZU0pO1xufSk7XG5cbnRlc3QoJ2NhbiBpbnN0YW50aWF0ZSByZXNvdXJjZSB3aXRoIGNvbnN0cnVjdGVkIHBoeXNpY2FsbmFtZSBBUk4nLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIG5ldyBNeVJlc291cmNlV2l0aENvbnN0cnVjdGVkQXJuQXR0cmlidXRlKHN0YWNrLCAnUmVzb3VyY2UnKTtcbn0pO1xuXG5jbGFzcyBNeVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcGh5c2ljYWxOYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHBoeXNpY2FsTmFtZSB9KTtcblxuICAgIGNvbnN0IHJlcyA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXMucmVmLnRvU3RyaW5nKCkpO1xuICAgIHRoaXMuYXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXMuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpLCB7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgYWNjb3VudDogJycsXG4gICAgICByZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBzZXJ2aWNlOiAnbXlzZXJ2aWNlJyxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFNvbWUgcmVzb3VyY2VzIGJ1aWxkIHRoZWlyIG93biBBcm4gYXR0cmlidXRlIGJ5IGNvbnN0cnVjdGluZyBzdHJpbmdzXG4gKlxuICogVGhpcyB3aWxsIGJlIGJlY2F1c2UgdGhlIEwxIGRvZXNuJ3QgZXhwb3NlIGEgYHsgRm46OkdldEF0dDogWydBcm4nXSB9YC5cbiAqXG4gKiBUaGV5IHdvbid0IGJlIGFibGUgdG8gYGV4cG9ydFZhbHVlKClgIGl0LCBidXQgaXQgc2hvdWxkbid0IGNyYXNoLlxuICovXG5jbGFzcyBNeVJlc291cmNlV2l0aENvbnN0cnVjdGVkQXJuQXR0cmlidXRlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcGh5c2ljYWxOYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHBoeXNpY2FsTmFtZSB9KTtcblxuICAgIGNvbnN0IHJlcyA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXMucmVmLnRvU3RyaW5nKCkpO1xuICAgIHRoaXMuYXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgcmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICByZXNvdXJjZU5hbWU6IHJlcy5yZWYudG9TdHJpbmcoKSxcbiAgICAgIHNlcnZpY2U6ICdteXNlcnZpY2UnLFxuICAgIH0pLCB7XG4gICAgICByZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBzZXJ2aWNlOiAnbXlzZXJ2aWNlJyxcbiAgICB9KTtcbiAgfVxufVxuIl19