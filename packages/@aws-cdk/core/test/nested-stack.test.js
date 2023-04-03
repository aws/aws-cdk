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
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
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
        const nestedTemplate2 = JSON.parse((0, fs_extra_1.readFileSync)(path.join(assembly.directory, `${nestedStack2.artifactId}.nested.template.json`), 'utf8'));
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
        const nestedTemplate1 = JSON.parse((0, fs_extra_1.readFileSync)(path.join(assembly.directory, `${nestedStack.artifactId}.nested.template.json`), 'utf8'));
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
        expect(() => (0, util_1.toCloudFormation)(stack2)).toThrow(/Cannot use resource 'Stack1\/MyNestedStack\/MyResource' in a cross-environment fashion/);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXN0ZWQtc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUU3Qix1Q0FBd0M7QUFDeEMsaUNBQTBDO0FBQzFDLGdDQUVnQjtBQUVoQixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMxRCxJQUFJLGVBQWUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFhLENBQUM7UUFDbEUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnRUFBZ0UsRUFBRTtvQkFDaEUsY0FBYyxFQUFFLFFBQVE7b0JBQ3hCLFVBQVUsRUFBRTt3QkFDVixXQUFXLEVBQUUsbUJBQW1CO3FCQUNqQztvQkFDRCxJQUFJLEVBQUUsNEJBQTRCO29CQUNsQyxtQkFBbUIsRUFBRSxRQUFRO2lCQUM5QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLHdCQUF3QixDQUFDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDeEQsV0FB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QUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3BFLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxRQUFRLEVBQUUsYUFBYTtZQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsT0FBTyxFQUFFLFdBQVc7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge1xuICBTdGFjaywgTmVzdGVkU3RhY2ssIENmblN0YWNrLCBSZXNvdXJjZSwgQ2ZuUmVzb3VyY2UsIEFwcCwgQ2ZuT3V0cHV0LFxufSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnbmVzdGVkLXN0YWNrJywgKCkgPT4ge1xuICB0ZXN0KCdhIG5lc3RlZC1zdGFjayBoYXMgYSBkZWZhdWx0Q2hpbGQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICB2YXIgbmVzdGVkU3RhY2sgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2ssICdNeU5lc3RlZFN0YWNrJyk7XG4gICAgdmFyIGNmbl9uZXN0ZWRTdGFjayA9IChuZXN0ZWRTdGFjay5ub2RlLmRlZmF1bHRDaGlsZCkgYXMgQ2ZuU3RhY2s7XG4gICAgY2ZuX25lc3RlZFN0YWNrLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ1RlbXBsYXRlVVJMJywgJ2h0dHA6Ly9teS11cmwuY29tJyk7XG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeU5lc3RlZFN0YWNrTmVzdGVkU3RhY2tNeU5lc3RlZFN0YWNrTmVzdGVkU3RhY2tSZXNvdXJjZTlDNjE3OTAzOiB7XG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFRlbXBsYXRlVVJMOiAnaHR0cDovL215LXVybC5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGb3JtYXRpb246OlN0YWNrJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdhIG5lc3RlZC1zdGFjayBoYXMgYSBkZXNjcmlwdGlvbiBpbiB0ZW1wbGF0ZU9wdGlvbnMuJywgKCkgPT4ge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gJ1RoaXMgaXMgYSBkZXNjcmlwdGlvbi4nO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgdmFyIG5lc3RlZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrLCAnTXlOZXN0ZWRTdGFjaycsIHtcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG5lc3RlZFN0YWNrLnRlbXBsYXRlT3B0aW9ucy5kZXNjcmlwdGlvbikudG9FcXVhbChkZXNjcmlwdGlvbik7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjcmVhdGUgY3Jvc3MgcmVnaW9uIHJlZmVyZW5jZXMgd2hlbiBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgfSxcbiAgICAgIGNyb3NzUmVnaW9uUmVmZXJlbmNlczogdHJ1ZSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3QgbmVzdGVkU3RhY2sgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2sxLCAnTmVzdGVkMScpO1xuICAgIGNvbnN0IG5lc3RlZFN0YWNrMiA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjazIsICdOZXN0ZWQyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbXlSZXNvdXJjZSA9IG5ldyBNeVJlc291cmNlKG5lc3RlZFN0YWNrLCAnUmVzb3VyY2UxJyk7XG5cbiAgICBuZXcgQ2ZuUmVzb3VyY2UobmVzdGVkU3RhY2syLCAnUmVzb3VyY2UyJywge1xuICAgICAgdHlwZTogJ015OjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3AxOiBteVJlc291cmNlLm5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgbmVzdGVkVGVtcGxhdGUyID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgYCR7bmVzdGVkU3RhY2syLmFydGlmYWN0SWR9Lm5lc3RlZC50ZW1wbGF0ZS5qc29uYCksICd1dGY4JykpO1xuICAgIGV4cGVjdChuZXN0ZWRUZW1wbGF0ZTIpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlMjoge1xuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFByb3AxOiB7XG4gICAgICAgICAgICAgIFJlZjogJ3JlZmVyZW5jZXRvU3RhY2syRXhwb3J0c1JlYWRlcjg2MUQwN0RDY2RrZXhwb3J0c1N0YWNrMlN0YWNrMWJlcm11ZGF0cmlhbmdsZTEzMzdGbkdldEF0dE5lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkJPdXRwdXRzU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmQ0VFRTMzMUUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCB0ZW1wbGF0ZTIgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazIuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBleHBlY3QodGVtcGxhdGUyPy5SZXNvdXJjZXMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgRXhwb3J0c1JlYWRlcjhCMjQ5NTI0OiB7XG4gICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMWJlcm11ZGF0cmlhbmdsZTEzMzdGbkdldEF0dE5lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkJPdXRwdXRzU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmQ0VFRTMzMUUnOiAne3tyZXNvbHZlOnNzbTovY2RrL2V4cG9ydHMvU3RhY2syL1N0YWNrMWJlcm11ZGF0cmlhbmdsZTEzMzdGbkdldEF0dE5lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkJPdXRwdXRzU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmQ0VFRTMzMUV9fScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICAgICAgICBwcmVmaXg6ICdTdGFjazInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXI0NjY0N0I2OCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFJlYWRlcicsXG4gICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCB0ZW1wbGF0ZTEgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjazEuc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICBjb25zdCBuZXN0ZWRUZW1wbGF0ZTEgPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCBgJHtuZXN0ZWRTdGFjay5hcnRpZmFjdElkfS5uZXN0ZWQudGVtcGxhdGUuanNvbmApLCAndXRmOCcpKTtcbiAgICBleHBlY3QobmVzdGVkVGVtcGxhdGUxPy5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgIFN0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZjoge1xuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgIFJlZjogJ1Jlc291cmNlMUNDRDQxQUI3JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QodGVtcGxhdGUxPy5SZXNvdXJjZXMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgRXhwb3J0c1dyaXRlcmJlcm11ZGF0cmlhbmdsZTQyRTU5NTk0Mjc2MTU2QUM3Mzoge1xuICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3Rm5HZXRBdHROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCT3V0cHV0c1N0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZkNFRUUzMzFFJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ05lc3RlZDFOZXN0ZWRTdGFja05lc3RlZDFOZXN0ZWRTdGFja1Jlc291cmNlQ0QwQUQzNkInLFxuICAgICAgICAgICAgICAgICAgJ091dHB1dHMuU3RhY2sxTmVzdGVkMVJlc291cmNlMTc4QUVCMDY3UmVmJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IGNyZWF0ZSBjcm9zcyByZWdpb24gcmVmZXJlbmNlcyB3aGVuIGNyb3NzUmVnaW9uUmVmZXJlbmNlcz1mYWxzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTEzMzcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgbmVzdGVkU3RhY2sgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2sxLCAnTXlOZXN0ZWRTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShuZXN0ZWRTdGFjaywgJ015UmVzb3VyY2UnKTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ091dHB1dCcsIHtcbiAgICAgIHZhbHVlOiBteVJlc291cmNlLm5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHRvQ2xvdWRGb3JtYXRpb24oc3RhY2syKSkudG9UaHJvdyhcbiAgICAgIC9DYW5ub3QgdXNlIHJlc291cmNlICdTdGFjazFcXC9NeU5lc3RlZFN0YWNrXFwvTXlSZXNvdXJjZScgaW4gYSBjcm9zcy1lbnZpcm9ubWVudCBmYXNoaW9uLyk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIE15UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSBhcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwaHlzaWNhbE5hbWU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgcGh5c2ljYWxOYW1lIH0pO1xuXG4gICAgY29uc3QgcmVzID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlcy5yZWYudG9TdHJpbmcoKSk7XG4gICAgdGhpcy5hcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlcy5nZXRBdHQoJ0FybicpLnRvU3RyaW5nKCksIHtcbiAgICAgIHJlZ2lvbjogJycsXG4gICAgICBhY2NvdW50OiAnJyxcbiAgICAgIHJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHNlcnZpY2U6ICdteXNlcnZpY2UnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=