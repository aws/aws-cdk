"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const cloud_artifact_1 = require("./cloud-artifact");
require("../jest");
let templateFilePath;
let synthStack;
let noOutputStack;
beforeEach(done => {
    synthStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: {
                    PropA: 'somevalue',
                },
            },
            AnotherResource: {
                Type: 'Some::AnotherResource',
                Properties: {
                    PropA: 'anothervalue',
                },
            },
        },
        Outputs: {
            TestOutput: {
                Value: {
                    'Fn::GetAtt': [
                        'SomeResource',
                        'Arn',
                    ],
                },
                Export: {
                    Name: 'TestOutputExportName',
                },
            },
            ComplexExportNameOutput: {
                Value: {
                    'Fn::GetAtt': [
                        'ComplexOutputResource',
                        'Arn',
                    ],
                },
                Export: {
                    Name: {
                        'Fn::Sub': '${AWS::StackName}-ComplexExportNameOutput',
                    },
                },
            },
        },
    });
    noOutputStack = cloud_artifact_1.mkStack({
        Resources: {
            SomeResource: {
                Type: 'Some::Resource',
                Properties: {
                    PropA: 'somevalue',
                },
            },
        },
    });
    done();
});
test('haveOutput should assert true when output with correct name is provided', () => {
    expect(synthStack).toHaveOutput({
        outputName: 'TestOutput',
    });
});
test('haveOutput should assert false when output with incorrect name is provided', () => {
    expect(synthStack).not.toHaveOutput({
        outputName: 'WrongOutput',
    });
});
test('haveOutput should assert true when output with correct name and export name is provided', () => {
    expect(synthStack).toHaveOutput({
        outputName: 'TestOutput',
        exportName: 'TestOutputExportName',
    });
});
test('haveOutput should assert false when output with correct name and incorrect export name is provided', () => {
    expect(synthStack).not.toHaveOutput({
        outputName: 'TestOutput',
        exportName: 'WrongTestOutputExportName',
    });
});
test('haveOutput should assert true when output with correct name, export name and value is provided', () => {
    expect(synthStack).toHaveOutput({
        outputName: 'TestOutput',
        exportName: 'TestOutputExportName',
        outputValue: {
            'Fn::GetAtt': [
                'SomeResource',
                'Arn',
            ],
        },
    });
});
test('haveOutput should assert false when output with correct name and export name and incorrect value is provided', () => {
    expect(synthStack).not.toHaveOutput({
        outputName: 'TestOutput',
        exportName: 'TestOutputExportName',
        outputValue: 'SomeWrongValue',
    });
});
test('haveOutput should assert true when output with correct export name and value is provided', () => {
    expect(synthStack).toHaveOutput({
        exportName: 'TestOutputExportName',
        outputValue: {
            'Fn::GetAtt': [
                'SomeResource',
                'Arn',
            ],
        },
    });
});
test('haveOutput should assert false when output with correct export name and incorrect value is provided', () => {
    expect(synthStack).not.toHaveOutput({
        exportName: 'TestOutputExportName',
        outputValue: 'WrongValue',
    });
});
test('haveOutput should assert true when output with correct output name and value is provided', () => {
    expect(synthStack).toHaveOutput({
        outputName: 'TestOutput',
        outputValue: {
            'Fn::GetAtt': [
                'SomeResource',
                'Arn',
            ],
        },
    });
});
test('haveOutput should assert false when output with correct output name and incorrect value is provided', () => {
    expect(synthStack).not.toHaveOutput({
        outputName: 'TestOutput',
        outputValue: 'WrongValue',
    });
});
test('haveOutput should assert false when asserting against noOutputStack', () => {
    expect(noOutputStack).not.toHaveOutput({
        outputName: 'TestOutputName',
        exportName: 'TestExportName',
        outputValue: 'TestOutputValue',
    });
});
test('haveOutput should throw Error when none of outputName and exportName is provided', () => {
    expect(() => expect(synthStack).toHaveOutput({ outputValue: 'SomeValue' }))
        .toThrow('At least one of [outputName, exportName] should be provided');
});
test('haveOutput should be able to handle complex exportName values', () => {
    expect(synthStack).toHaveOutput({
        exportName: { 'Fn::Sub': '${AWS::StackName}-ComplexExportNameOutput' },
        outputValue: {
            'Fn::GetAtt': [
                'ComplexOutputResource',
                'Arn',
            ],
        },
    });
});
afterEach(done => {
    if (templateFilePath) {
        fs_1.unlink(templateFilePath, done);
    }
    else {
        done();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGF2ZS1vdXRwdXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhdmUtb3V0cHV0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBNEI7QUFFNUIscURBQTJDO0FBQzNDLG1CQUFpQjtBQUVqQixJQUFJLGdCQUF3QixDQUFDO0FBQzdCLElBQUksVUFBNkMsQ0FBQztBQUNsRCxJQUFJLGFBQWdELENBQUM7QUFFckQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hCLFVBQVUsR0FBRyx3QkFBTyxDQUFDO1FBQ25CLFNBQVMsRUFBRTtZQUNULFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUU7b0JBQ1YsS0FBSyxFQUFFLFdBQVc7aUJBQ25CO2FBQ0Y7WUFDRCxlQUFlLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLHVCQUF1QjtnQkFDN0IsVUFBVSxFQUFFO29CQUNWLEtBQUssRUFBRSxjQUFjO2lCQUN0QjthQUNGO1NBQ0Y7UUFDRCxPQUFPLEVBQUU7WUFDUCxVQUFVLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFO29CQUNMLFlBQVksRUFBRTt3QkFDWixjQUFjO3dCQUNkLEtBQUs7cUJBQ047aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxzQkFBc0I7aUJBQzdCO2FBQ0Y7WUFDRCx1QkFBdUIsRUFBRTtnQkFDdkIsS0FBSyxFQUFFO29CQUNMLFlBQVksRUFBRTt3QkFDWix1QkFBdUI7d0JBQ3ZCLEtBQUs7cUJBQ047aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRTt3QkFDSixTQUFTLEVBQUUsMkNBQTJDO3FCQUN2RDtpQkFDRjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxhQUFhLEdBQUcsd0JBQU8sQ0FBQztRQUN0QixTQUFTLEVBQUU7WUFDVCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsVUFBVSxFQUFF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WUFBWTtLQUMxQixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7SUFDL0UsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7UUFDckMsVUFBVSxFQUFFLGdCQUFnQjtRQUM1QixVQUFVLEVBQUUsZ0JBQWdCO1FBQzVCLFdBQVcsRUFBRSxpQkFBaUI7S0FDL0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsa0ZBQWtGLEVBQUUsR0FBRyxFQUFFO0lBQzVGLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDeEUsT0FBTyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO0lBQ3pFLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDOUIsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLDJDQUEyQyxFQUFFO1FBQ3RFLFdBQVcsRUFBRTtZQUNYLFlBQVksRUFBRTtnQkFDWix1QkFBdUI7Z0JBQ3ZCLEtBQUs7YUFDTjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDZixJQUFJLGdCQUFnQixFQUFFO1FBQ3BCLFdBQU0sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNoQztTQUFNO1FBQ0wsSUFBSSxFQUFFLENBQUM7S0FDUjtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdW5saW5rIH0gZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IG1rU3RhY2sgfSBmcm9tICcuL2Nsb3VkLWFydGlmYWN0JztcbmltcG9ydCAnLi4vamVzdCc7XG5cbmxldCB0ZW1wbGF0ZUZpbGVQYXRoOiBzdHJpbmc7XG5sZXQgc3ludGhTdGFjazogY3hhcGkuQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0O1xubGV0IG5vT3V0cHV0U3RhY2s6IGN4YXBpLkNsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdDtcblxuYmVmb3JlRWFjaChkb25lID0+IHtcbiAgc3ludGhTdGFjayA9IG1rU3RhY2soe1xuICAgIFJlc291cmNlczoge1xuICAgICAgU29tZVJlc291cmNlOiB7XG4gICAgICAgIFR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICBQcm9wQTogJ3NvbWV2YWx1ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQW5vdGhlclJlc291cmNlOiB7XG4gICAgICAgIFR5cGU6ICdTb21lOjpBbm90aGVyUmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUHJvcEE6ICdhbm90aGVydmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIE91dHB1dHM6IHtcbiAgICAgIFRlc3RPdXRwdXQ6IHtcbiAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTb21lUmVzb3VyY2UnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0OiB7XG4gICAgICAgICAgTmFtZTogJ1Rlc3RPdXRwdXRFeHBvcnROYW1lJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBDb21wbGV4RXhwb3J0TmFtZU91dHB1dDoge1xuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0NvbXBsZXhPdXRwdXRSZXNvdXJjZScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnQ6IHtcbiAgICAgICAgICBOYW1lOiB7XG4gICAgICAgICAgICAnRm46OlN1Yic6ICcke0FXUzo6U3RhY2tOYW1lfS1Db21wbGV4RXhwb3J0TmFtZU91dHB1dCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG4gIG5vT3V0cHV0U3RhY2sgPSBta1N0YWNrKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIFNvbWVSZXNvdXJjZToge1xuICAgICAgICBUeXBlOiAnU29tZTo6UmVzb3VyY2UnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgUHJvcEE6ICdzb21ldmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbiAgZG9uZSgpO1xufSk7XG5cbnRlc3QoJ2hhdmVPdXRwdXQgc2hvdWxkIGFzc2VydCB0cnVlIHdoZW4gb3V0cHV0IHdpdGggY29ycmVjdCBuYW1lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykudG9IYXZlT3V0cHV0KHtcbiAgICBvdXRwdXROYW1lOiAnVGVzdE91dHB1dCcsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2hhdmVPdXRwdXQgc2hvdWxkIGFzc2VydCBmYWxzZSB3aGVuIG91dHB1dCB3aXRoIGluY29ycmVjdCBuYW1lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykubm90LnRvSGF2ZU91dHB1dCh7XG4gICAgb3V0cHV0TmFtZTogJ1dyb25nT3V0cHV0JyxcbiAgfSk7XG59KTtcblxudGVzdCgnaGF2ZU91dHB1dCBzaG91bGQgYXNzZXJ0IHRydWUgd2hlbiBvdXRwdXQgd2l0aCBjb3JyZWN0IG5hbWUgYW5kIGV4cG9ydCBuYW1lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykudG9IYXZlT3V0cHV0KHtcbiAgICBvdXRwdXROYW1lOiAnVGVzdE91dHB1dCcsXG4gICAgZXhwb3J0TmFtZTogJ1Rlc3RPdXRwdXRFeHBvcnROYW1lJyxcbiAgfSk7XG59KTtcblxudGVzdCgnaGF2ZU91dHB1dCBzaG91bGQgYXNzZXJ0IGZhbHNlIHdoZW4gb3V0cHV0IHdpdGggY29ycmVjdCBuYW1lIGFuZCBpbmNvcnJlY3QgZXhwb3J0IG5hbWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChzeW50aFN0YWNrKS5ub3QudG9IYXZlT3V0cHV0KHtcbiAgICBvdXRwdXROYW1lOiAnVGVzdE91dHB1dCcsXG4gICAgZXhwb3J0TmFtZTogJ1dyb25nVGVzdE91dHB1dEV4cG9ydE5hbWUnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdoYXZlT3V0cHV0IHNob3VsZCBhc3NlcnQgdHJ1ZSB3aGVuIG91dHB1dCB3aXRoIGNvcnJlY3QgbmFtZSwgZXhwb3J0IG5hbWUgYW5kIHZhbHVlIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykudG9IYXZlT3V0cHV0KHtcbiAgICBvdXRwdXROYW1lOiAnVGVzdE91dHB1dCcsXG4gICAgZXhwb3J0TmFtZTogJ1Rlc3RPdXRwdXRFeHBvcnROYW1lJyxcbiAgICBvdXRwdXRWYWx1ZToge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdTb21lUmVzb3VyY2UnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnaGF2ZU91dHB1dCBzaG91bGQgYXNzZXJ0IGZhbHNlIHdoZW4gb3V0cHV0IHdpdGggY29ycmVjdCBuYW1lIGFuZCBleHBvcnQgbmFtZSBhbmQgaW5jb3JyZWN0IHZhbHVlIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykubm90LnRvSGF2ZU91dHB1dCh7XG4gICAgb3V0cHV0TmFtZTogJ1Rlc3RPdXRwdXQnLFxuICAgIGV4cG9ydE5hbWU6ICdUZXN0T3V0cHV0RXhwb3J0TmFtZScsXG4gICAgb3V0cHV0VmFsdWU6ICdTb21lV3JvbmdWYWx1ZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2hhdmVPdXRwdXQgc2hvdWxkIGFzc2VydCB0cnVlIHdoZW4gb3V0cHV0IHdpdGggY29ycmVjdCBleHBvcnQgbmFtZSBhbmQgdmFsdWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChzeW50aFN0YWNrKS50b0hhdmVPdXRwdXQoe1xuICAgIGV4cG9ydE5hbWU6ICdUZXN0T3V0cHV0RXhwb3J0TmFtZScsXG4gICAgb3V0cHV0VmFsdWU6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnU29tZVJlc291cmNlJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2hhdmVPdXRwdXQgc2hvdWxkIGFzc2VydCBmYWxzZSB3aGVuIG91dHB1dCB3aXRoIGNvcnJlY3QgZXhwb3J0IG5hbWUgYW5kIGluY29ycmVjdCB2YWx1ZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgZXhwZWN0KHN5bnRoU3RhY2spLm5vdC50b0hhdmVPdXRwdXQoe1xuICAgIGV4cG9ydE5hbWU6ICdUZXN0T3V0cHV0RXhwb3J0TmFtZScsXG4gICAgb3V0cHV0VmFsdWU6ICdXcm9uZ1ZhbHVlJyxcbiAgfSk7XG59KTtcblxudGVzdCgnaGF2ZU91dHB1dCBzaG91bGQgYXNzZXJ0IHRydWUgd2hlbiBvdXRwdXQgd2l0aCBjb3JyZWN0IG91dHB1dCBuYW1lIGFuZCB2YWx1ZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgZXhwZWN0KHN5bnRoU3RhY2spLnRvSGF2ZU91dHB1dCh7XG4gICAgb3V0cHV0TmFtZTogJ1Rlc3RPdXRwdXQnLFxuICAgIG91dHB1dFZhbHVlOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ1NvbWVSZXNvdXJjZScsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdoYXZlT3V0cHV0IHNob3VsZCBhc3NlcnQgZmFsc2Ugd2hlbiBvdXRwdXQgd2l0aCBjb3JyZWN0IG91dHB1dCBuYW1lIGFuZCBpbmNvcnJlY3QgdmFsdWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gIGV4cGVjdChzeW50aFN0YWNrKS5ub3QudG9IYXZlT3V0cHV0KHtcbiAgICBvdXRwdXROYW1lOiAnVGVzdE91dHB1dCcsXG4gICAgb3V0cHV0VmFsdWU6ICdXcm9uZ1ZhbHVlJyxcbiAgfSk7XG59KTtcblxudGVzdCgnaGF2ZU91dHB1dCBzaG91bGQgYXNzZXJ0IGZhbHNlIHdoZW4gYXNzZXJ0aW5nIGFnYWluc3Qgbm9PdXRwdXRTdGFjaycsICgpID0+IHtcbiAgZXhwZWN0KG5vT3V0cHV0U3RhY2spLm5vdC50b0hhdmVPdXRwdXQoe1xuICAgIG91dHB1dE5hbWU6ICdUZXN0T3V0cHV0TmFtZScsXG4gICAgZXhwb3J0TmFtZTogJ1Rlc3RFeHBvcnROYW1lJyxcbiAgICBvdXRwdXRWYWx1ZTogJ1Rlc3RPdXRwdXRWYWx1ZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2hhdmVPdXRwdXQgc2hvdWxkIHRocm93IEVycm9yIHdoZW4gbm9uZSBvZiBvdXRwdXROYW1lIGFuZCBleHBvcnROYW1lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4gZXhwZWN0KHN5bnRoU3RhY2spLnRvSGF2ZU91dHB1dCh7IG91dHB1dFZhbHVlOiAnU29tZVZhbHVlJyB9KSlcbiAgICAudG9UaHJvdygnQXQgbGVhc3Qgb25lIG9mIFtvdXRwdXROYW1lLCBleHBvcnROYW1lXSBzaG91bGQgYmUgcHJvdmlkZWQnKTtcbn0pO1xuXG50ZXN0KCdoYXZlT3V0cHV0IHNob3VsZCBiZSBhYmxlIHRvIGhhbmRsZSBjb21wbGV4IGV4cG9ydE5hbWUgdmFsdWVzJywgKCkgPT4ge1xuICBleHBlY3Qoc3ludGhTdGFjaykudG9IYXZlT3V0cHV0KHtcbiAgICBleHBvcnROYW1lOiB7ICdGbjo6U3ViJzogJyR7QVdTOjpTdGFja05hbWV9LUNvbXBsZXhFeHBvcnROYW1lT3V0cHV0JyB9LFxuICAgIG91dHB1dFZhbHVlOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NvbXBsZXhPdXRwdXRSZXNvdXJjZScsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5hZnRlckVhY2goZG9uZSA9PiB7XG4gIGlmICh0ZW1wbGF0ZUZpbGVQYXRoKSB7XG4gICAgdW5saW5rKHRlbXBsYXRlRmlsZVBhdGgsIGRvbmUpO1xuICB9IGVsc2Uge1xuICAgIGRvbmUoKTtcbiAgfVxufSk7Il19