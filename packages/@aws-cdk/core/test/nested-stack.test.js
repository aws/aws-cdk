"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_extra_1 = require("fs-extra");
const util_1 = require("./util");
const lib_1 = require("../lib");
describe('nested-stack', () => {
    test('a nested-stack has a defaultChild', () => {
        const stack = new lib_1.Stack();
        var nestedStack = new lib_1.NestedStack(stack, 'MyNestedStack');
        var cfn_nestedStack = (nestedStack.node.defaultChild);
        cfn_nestedStack.addPropertyOverride('TemplateURL', 'http://my-url.com');
        expect(util_1.toCloudFormation(stack)).toEqual({
            Resources: {
                MyNestedStackNestedStackMyNestedStackNestedStackResource9C617903: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        TemplateURL: 'http://my-url.com',
                    },
                    Type: 'AWS::CloudFormation::Stack',
                    UpdateReplacePolicy: 'Delete',
                },
            },
        });
    });
    test('a nested-stack has a description in templateOptions.', () => {
        const description = 'This is a description.';
        const stack = new lib_1.Stack();
        var nestedStack = new lib_1.NestedStack(stack, 'MyNestedStack', {
            description,
        });
        expect(nestedStack.templateOptions.description).toEqual(description);
    });
    test('can create cross region references when crossRegionReferences=true', () => {
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
        const nestedStack = new lib_1.NestedStack(stack1, 'Nested1');
        const nestedStack2 = new lib_1.NestedStack(stack2, 'Nested2');
        // WHEN
        const myResource = new MyResource(nestedStack, 'Resource1');
        new lib_1.CfnResource(nestedStack2, 'Resource2', {
            type: 'My::Resource',
            properties: {
                Prop1: myResource.name,
            },
        });
        // THEN
        const assembly = app.synth();
        const nestedTemplate2 = JSON.parse(fs_extra_1.readFileSync(path.join(assembly.directory, `${nestedStack2.artifactId}.nested.template.json`), 'utf8'));
        expect(nestedTemplate2).toMatchObject({
            Resources: {
                Resource2: {
                    Properties: {
                        Prop1: {
                            Ref: 'referencetoStack2ExportsReader861D07DCcdkexportsStack2Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E',
                        },
                    },
                    Type: 'My::Resource',
                },
            },
        });
        const template2 = assembly.getStackByName(stack2.stackName).template;
        expect(template2?.Resources).toMatchObject({
            ExportsReader8B249524: {
                DeletionPolicy: 'Delete',
                Properties: {
                    ReaderProps: {
                        imports: {
                            '/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E': '{{resolve:ssm:/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E}}',
                        },
                        region: 'bermuda-triangle-42',
                        prefix: 'Stack2',
                    },
                    ServiceToken: {
                        'Fn::GetAtt': [
                            'CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68',
                            'Arn',
                        ],
                    },
                },
                Type: 'Custom::CrossRegionExportReader',
                UpdateReplacePolicy: 'Delete',
            },
        });
        const template1 = assembly.getStackByName(stack1.stackName).template;
        const nestedTemplate1 = JSON.parse(fs_extra_1.readFileSync(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8'));
        expect(nestedTemplate1?.Outputs).toEqual({
            Stack1Nested1Resource178AEB067Ref: {
                Value: {
                    Ref: 'Resource1CCD41AB7',
                },
            },
        });
        expect(template1?.Resources).toMatchObject({
            ExportsWriterbermudatriangle42E59594276156AC73: {
                DeletionPolicy: 'Delete',
                Properties: {
                    WriterProps: {
                        exports: {
                            '/cdk/exports/Stack2/Stack1bermudatriangle1337FnGetAttNested1NestedStackNested1NestedStackResourceCD0AD36BOutputsStack1Nested1Resource178AEB067RefCEEE331E': {
                                'Fn::GetAtt': [
                                    'Nested1NestedStackNested1NestedStackResourceCD0AD36B',
                                    'Outputs.Stack1Nested1Resource178AEB067Ref',
                                ],
                            },
                        },
                        region: 'bermuda-triangle-42',
                    },
                    ServiceToken: {
                        'Fn::GetAtt': [
                            'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                            'Arn',
                        ],
                    },
                },
                Type: 'Custom::CrossRegionExportWriter',
                UpdateReplacePolicy: 'Delete',
            },
        });
    });
    test('cannot create cross region references when crossRegionReferences=false', () => {
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
                account: '123456789012',
                region: 'bermuda-triangle-42',
            },
        });
        const nestedStack = new lib_1.NestedStack(stack1, 'MyNestedStack');
        // WHEN
        const myResource = new MyResource(nestedStack, 'MyResource');
        new lib_1.CfnOutput(stack2, 'Output', {
            value: myResource.name,
        });
        // THEN
        expect(() => util_1.toCloudFormation(stack2)).toThrow(/Cannot use resource 'Stack1\/MyNestedStack\/MyResource' in a cross-environment fashion/);
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXN0ZWQtc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUU3Qix1Q0FBd0M7QUFDeEMsaUNBQTBDO0FBQzFDLGdDQUVnQjtBQUVoQixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMxRCxJQUFJLGVBQWUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFhLENBQUM7UUFDbEUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0QyxTQUFTLEVBQUU7Z0JBQ1QsZ0VBQWdFLEVBQUU7b0JBQ2hFLGNBQWMsRUFBRSxRQUFRO29CQUN4QixVQUFVLEVBQUU7d0JBQ1YsV0FBVyxFQUFFLG1CQUFtQjtxQkFDakM7b0JBQ0QsSUFBSSxFQUFFLDRCQUE0QjtvQkFDbEMsbUJBQW1CLEVBQUUsUUFBUTtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxNQUFNLFdBQVcsR0FBRyx3QkFBd0IsQ0FBQztRQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBQzFCLElBQUksV0FBVyxHQUFHLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO1lBQ3hELFdBQVc7U0FD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QUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNwRSxNQUFNLEVBQUUsRUFBRTtZQUNWLE9BQU8sRUFBRSxFQUFFO1lBQ1gsUUFBUSxFQUFFLGFBQWE7WUFDdkIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLE9BQU8sRUFBRSxXQUFXO1NBQ3JCLENBQUMsQ0FBQztLQUNKO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyByZWFkRmlsZVN5bmMgfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7XG4gIFN0YWNrLCBOZXN0ZWRTdGFjaywgQ2ZuU3RhY2ssIFJlc291cmNlLCBDZm5SZXNvdXJjZSwgQXBwLCBDZm5PdXRwdXQsXG59IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCduZXN0ZWQtc3RhY2snLCAoKSA9PiB7XG4gIHRlc3QoJ2EgbmVzdGVkLXN0YWNrIGhhcyBhIGRlZmF1bHRDaGlsZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHZhciBuZXN0ZWRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ015TmVzdGVkU3RhY2snKTtcbiAgICB2YXIgY2ZuX25lc3RlZFN0YWNrID0gKG5lc3RlZFN0YWNrLm5vZGUuZGVmYXVsdENoaWxkKSBhcyBDZm5TdGFjaztcbiAgICBjZm5fbmVzdGVkU3RhY2suYWRkUHJvcGVydHlPdmVycmlkZSgnVGVtcGxhdGVVUkwnLCAnaHR0cDovL215LXVybC5jb20nKTtcbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TmVzdGVkU3RhY2tOZXN0ZWRTdGFja015TmVzdGVkU3RhY2tOZXN0ZWRTdGFja1Jlc291cmNlOUM2MTc5MDM6IHtcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgVGVtcGxhdGVVUkw6ICdodHRwOi8vbXktdXJsLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG4gIHRlc3QoJ2EgbmVzdGVkLXN0YWNrIGhhcyBhIGRlc2NyaXB0aW9uIGluIHRlbXBsYXRlT3B0aW9ucy4nLCAoKSA9PiB7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSAnVGhpcyBpcyBhIGRlc2NyaXB0aW9uLic7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICB2YXIgbmVzdGVkU3RhY2sgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdNeU5lc3RlZFN0YWNrJywge1xuICAgICAgZGVzY3JpcHRpb24sXG4gICAgfSk7XG5cbiAgICBleHBlY3QobmVzdGVkU3RhY2sudGVtcGxhdGVPcHRpb25zLmRlc2NyaXB0aW9uKS50b0VxdWFsKGRlc2NyaXB0aW9uKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGNyZWF0ZSBjcm9zcyByZWdpb24gcmVmZXJlbmNlcyB3aGVuIGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgfSxcbiAgICAgIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBuZXN0ZWRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjazEsICdOZXN0ZWQxJyk7XG4gICAgY29uc3QgbmVzdGVkU3RhY2syID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMiwgJ05lc3RlZDInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2UobmVzdGVkU3RhY2ssICdSZXNvdXJjZTEnKTtcblxuICAgIG5ldyBDZm5SZXNvdXJjZShuZXN0ZWRTdGFjazIsICdSZXNvdXJjZTInLCB7XG4gICAgICB0eXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUHJvcDE6IG15UmVzb3VyY2UubmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBuZXN0ZWRUZW1wbGF0ZTIgPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBgJHtuZXN0ZWRTdGFjazIuYXJ0aWZhY3RJZH0ubmVzdGVkLnRlbXBsYXRlLmpzb25gKSwgJ3V0ZjgnKSk7XG4gICAgZXhwZWN0KG5lc3RlZFRlbXBsYXRlMikudG9NYXRjaE9iamVjdCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgUmVzb3VyY2UyOiB7XG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUHJvcDE6IHtcbiAgICAgICAgICAgICAgUmVmOiAncmVmZXJlbmNldG9TdGFjazJFeHBvcnRzUmVhZGVyODYxRDA3RENjZGtleHBvcnRzU3RhY2syU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN0ZuR2V0QXR0TmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qk91dHB1dHNTdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWZDRUVFMzMxRScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ015OjpSZXNvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHRlbXBsYXRlMiA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMi5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGV4cGVjdCh0ZW1wbGF0ZTI/LlJlc291cmNlcykudG9NYXRjaE9iamVjdCh7XG4gICAgICBFeHBvcnRzUmVhZGVyOEIyNDk1MjQ6IHtcbiAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN0ZuR2V0QXR0TmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qk91dHB1dHNTdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWZDRUVFMzMxRSc6ICd7e3Jlc29sdmU6c3NtOi9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN0ZuR2V0QXR0TmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qk91dHB1dHNTdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWZDRUVFMzMxRX19JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgICAgICAgIHByZWZpeDogJ1N0YWNrMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ2NjQ3QjY4JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyJyxcbiAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHRlbXBsYXRlMSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrMS5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgIGNvbnN0IG5lc3RlZFRlbXBsYXRlMSA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksIGAke25lc3RlZFN0YWNrLmFydGlmYWN0SWR9Lm5lc3RlZC50ZW1wbGF0ZS5qc29uYCksICd1dGY4JykpO1xuICAgIGV4cGVjdChuZXN0ZWRUZW1wbGF0ZTE/Lk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmOiB7XG4gICAgICAgIFZhbHVlOiB7XG4gICAgICAgICAgUmVmOiAnUmVzb3VyY2UxQ0NENDFBQjcnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCh0ZW1wbGF0ZTE/LlJlc291cmNlcykudG9NYXRjaE9iamVjdCh7XG4gICAgICBFeHBvcnRzV3JpdGVyYmVybXVkYXRyaWFuZ2xlNDJFNTk1OTQyNzYxNTZBQzczOiB7XG4gICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMWJlcm11ZGF0cmlhbmdsZTEzMzdGbkdldEF0dE5lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkJPdXRwdXRzU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmQ0VFRTMzMUUnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2QicsXG4gICAgICAgICAgICAgICAgICAnT3V0cHV0cy5TdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWYnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyJyxcbiAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgY3JlYXRlIGNyb3NzIHJlZ2lvbiByZWZlcmVuY2VzIHdoZW4gY3Jvc3NSZWdpb25SZWZlcmVuY2VzPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtMTMzNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBuZXN0ZWRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjazEsICdNeU5lc3RlZFN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKG5lc3RlZFN0YWNrLCAnTXlSZXNvdXJjZScpO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IG15UmVzb3VyY2UubmFtZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gdG9DbG91ZEZvcm1hdGlvbihzdGFjazIpKS50b1Rocm93KFxuICAgICAgL0Nhbm5vdCB1c2UgcmVzb3VyY2UgJ1N0YWNrMVxcL015TmVzdGVkU3RhY2tcXC9NeVJlc291cmNlJyBpbiBhIGNyb3NzLWVudmlyb25tZW50IGZhc2hpb24vKTtcbiAgfSk7XG59KTtcblxuY2xhc3MgTXlSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHBoeXNpY2FsTmFtZT86IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgeyBwaHlzaWNhbE5hbWUgfSk7XG5cbiAgICBjb25zdCByZXMgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ015OjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzLnJlZi50b1N0cmluZygpKTtcbiAgICB0aGlzLmFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUocmVzLmdldEF0dCgnQXJuJykudG9TdHJpbmcoKSwge1xuICAgICAgcmVnaW9uOiAnJyxcbiAgICAgIGFjY291bnQ6ICcnLFxuICAgICAgcmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgc2VydmljZTogJ215c2VydmljZScsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==