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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZXN0ZWQtc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUU3Qix1Q0FBd0M7QUFDeEMsaUNBQTBDO0FBQzFDLGdDQUVnQjtBQUVoQixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMxRCxJQUFJLGVBQWUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFhLENBQUM7UUFDbEUsZUFBZSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnRUFBZ0UsRUFBRTtvQkFDaEUsY0FBYyxFQUFFLFFBQVE7b0JBQ3hCLFVBQVUsRUFBRTt3QkFDVixXQUFXLEVBQUUsbUJBQW1CO3FCQUNqQztvQkFDRCxJQUFJLEVBQUUsNEJBQTRCO29CQUNsQyxtQkFBbUIsRUFBRSxRQUFRO2lCQUM5QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLHdCQUF3QixDQUFDO1FBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDeEQsV0FB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QUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3BFLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7WUFDWCxRQUFRLEVBQUUsYUFBYTtZQUN2QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsT0FBTyxFQUFFLFdBQVc7U0FDckIsQ0FBQyxDQUFDO0tBQ0o7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtcbiAgU3RhY2ssIE5lc3RlZFN0YWNrLCBDZm5TdGFjaywgUmVzb3VyY2UsIENmblJlc291cmNlLCBBcHAsIENmbk91dHB1dCxcbn0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ25lc3RlZC1zdGFjaycsICgpID0+IHtcbiAgdGVzdCgnYSBuZXN0ZWQtc3RhY2sgaGFzIGEgZGVmYXVsdENoaWxkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgdmFyIG5lc3RlZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrLCAnTXlOZXN0ZWRTdGFjaycpO1xuICAgIHZhciBjZm5fbmVzdGVkU3RhY2sgPSAobmVzdGVkU3RhY2subm9kZS5kZWZhdWx0Q2hpbGQpIGFzIENmblN0YWNrO1xuICAgIGNmbl9uZXN0ZWRTdGFjay5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdUZW1wbGF0ZVVSTCcsICdodHRwOi8vbXktdXJsLmNvbScpO1xuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlOZXN0ZWRTdGFja05lc3RlZFN0YWNrTXlOZXN0ZWRTdGFja05lc3RlZFN0YWNrUmVzb3VyY2U5QzYxNzkwMzoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBUZW1wbGF0ZVVSTDogJ2h0dHA6Ly9teS11cmwuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgnYSBuZXN0ZWQtc3RhY2sgaGFzIGEgZGVzY3JpcHRpb24gaW4gdGVtcGxhdGVPcHRpb25zLicsICgpID0+IHtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICdUaGlzIGlzIGEgZGVzY3JpcHRpb24uJztcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHZhciBuZXN0ZWRTdGFjayA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjaywgJ015TmVzdGVkU3RhY2snLCB7XG4gICAgICBkZXNjcmlwdGlvbixcbiAgICB9KTtcblxuICAgIGV4cGVjdChuZXN0ZWRTdGFjay50ZW1wbGF0ZU9wdGlvbnMuZGVzY3JpcHRpb24pLnRvRXF1YWwoZGVzY3JpcHRpb24pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY3JlYXRlIGNyb3NzIHJlZ2lvbiByZWZlcmVuY2VzIHdoZW4gY3Jvc3NSZWdpb25SZWZlcmVuY2VzPXRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgIH0sXG4gICAgICBjcm9zc1JlZ2lvblJlZmVyZW5jZXM6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICB9LFxuICAgICAgY3Jvc3NSZWdpb25SZWZlcmVuY2VzOiB0cnVlLFxuICAgIH0pO1xuICAgIGNvbnN0IG5lc3RlZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMSwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCBuZXN0ZWRTdGFjazIgPSBuZXcgTmVzdGVkU3RhY2soc3RhY2syLCAnTmVzdGVkMicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG15UmVzb3VyY2UgPSBuZXcgTXlSZXNvdXJjZShuZXN0ZWRTdGFjaywgJ1Jlc291cmNlMScpO1xuXG4gICAgbmV3IENmblJlc291cmNlKG5lc3RlZFN0YWNrMiwgJ1Jlc291cmNlMicsIHtcbiAgICAgIHR5cGU6ICdNeTo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQcm9wMTogbXlSZXNvdXJjZS5uYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IG5lc3RlZFRlbXBsYXRlMiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksIGAke25lc3RlZFN0YWNrMi5hcnRpZmFjdElkfS5uZXN0ZWQudGVtcGxhdGUuanNvbmApLCAndXRmOCcpKTtcbiAgICBleHBlY3QobmVzdGVkVGVtcGxhdGUyKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXNvdXJjZTI6IHtcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQcm9wMToge1xuICAgICAgICAgICAgICBSZWY6ICdyZWZlcmVuY2V0b1N0YWNrMkV4cG9ydHNSZWFkZXI4NjFEMDdEQ2Nka2V4cG9ydHNTdGFjazJTdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3Rm5HZXRBdHROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCT3V0cHV0c1N0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZkNFRUUzMzFFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgdGVtcGxhdGUyID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2syLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgZXhwZWN0KHRlbXBsYXRlMj8uUmVzb3VyY2VzKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIEV4cG9ydHNSZWFkZXI4QjI0OTUyNDoge1xuICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3Rm5HZXRBdHROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCT3V0cHV0c1N0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZkNFRUUzMzFFJzogJ3t7cmVzb2x2ZTpzc206L2Nkay9leHBvcnRzL1N0YWNrMi9TdGFjazFiZXJtdWRhdHJpYW5nbGUxMzM3Rm5HZXRBdHROZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCT3V0cHV0c1N0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZkNFRUUzMzFFfX0nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2lvbjogJ2Jlcm11ZGEtdHJpYW5nbGUtNDInLFxuICAgICAgICAgICAgcHJlZml4OiAnU3RhY2syJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyNDY2NDdCNjgnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRSZWFkZXInLFxuICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgdGVtcGxhdGUxID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2sxLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgY29uc3QgbmVzdGVkVGVtcGxhdGUxID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgYCR7bmVzdGVkU3RhY2suYXJ0aWZhY3RJZH0ubmVzdGVkLnRlbXBsYXRlLmpzb25gKSwgJ3V0ZjgnKSk7XG4gICAgZXhwZWN0KG5lc3RlZFRlbXBsYXRlMT8uT3V0cHV0cykudG9FcXVhbCh7XG4gICAgICBTdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWY6IHtcbiAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICBSZWY6ICdSZXNvdXJjZTFDQ0Q0MUFCNycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHRlbXBsYXRlMT8uUmVzb3VyY2VzKS50b01hdGNoT2JqZWN0KHtcbiAgICAgIEV4cG9ydHNXcml0ZXJiZXJtdWRhdHJpYW5nbGU0MkU1OTU5NDI3NjE1NkFDNzM6IHtcbiAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9TdGFjazIvU3RhY2sxYmVybXVkYXRyaWFuZ2xlMTMzN0ZuR2V0QXR0TmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qk91dHB1dHNTdGFjazFOZXN0ZWQxUmVzb3VyY2UxNzhBRUIwNjdSZWZDRUVFMzMxRSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdOZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCJyxcbiAgICAgICAgICAgICAgICAgICdPdXRwdXRzLlN0YWNrMU5lc3RlZDFSZXNvdXJjZTE3OEFFQjA2N1JlZicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdpb246ICdiZXJtdWRhLXRyaWFuZ2xlLTQyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCBjcmVhdGUgY3Jvc3MgcmVnaW9uIHJlZmVyZW5jZXMgd2hlbiBjcm9zc1JlZ2lvblJlZmVyZW5jZXM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS0xMzM3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyxcbiAgICAgICAgcmVnaW9uOiAnYmVybXVkYS10cmlhbmdsZS00MicsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IG5lc3RlZFN0YWNrID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMSwgJ015TmVzdGVkU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteVJlc291cmNlID0gbmV3IE15UmVzb3VyY2UobmVzdGVkU3RhY2ssICdNeVJlc291cmNlJyk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjazIsICdPdXRwdXQnLCB7XG4gICAgICB2YWx1ZTogbXlSZXNvdXJjZS5uYW1lLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMikpLnRvVGhyb3coXG4gICAgICAvQ2Fubm90IHVzZSByZXNvdXJjZSAnU3RhY2sxXFwvTXlOZXN0ZWRTdGFja1xcL015UmVzb3VyY2UnIGluIGEgY3Jvc3MtZW52aXJvbm1lbnQgZmFzaGlvbi8pO1xuICB9KTtcbn0pO1xuXG5jbGFzcyBNeVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgYXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcGh5c2ljYWxOYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IHBoeXNpY2FsTmFtZSB9KTtcblxuICAgIGNvbnN0IHJlcyA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnTXk6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXMucmVmLnRvU3RyaW5nKCkpO1xuICAgIHRoaXMuYXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZShyZXMuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpLCB7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgYWNjb3VudDogJycsXG4gICAgICByZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBzZXJ2aWNlOiAnbXlzZXJ2aWNlJyxcbiAgICB9KTtcbiAgfVxufVxuIl19