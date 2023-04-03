"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('CloudFront Function', () => {
    test('minimal example', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack', {
            env: { account: '123456789012', region: 'testregion' },
        });
        new lib_1.Function(stack, 'CF2', {
            code: lib_1.FunctionCode.fromInline('code'),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                CF2D7241DD7: {
                    Type: 'AWS::CloudFront::Function',
                    Properties: {
                        Name: 'testregionStackCF2CE3F783F',
                        AutoPublish: true,
                        FunctionCode: 'code',
                        FunctionConfig: {
                            Comment: 'testregionStackCF2CE3F783F',
                            Runtime: 'cloudfront-js-1.0',
                        },
                    },
                },
            },
        });
    });
    test('minimal example in environment agnostic stack', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack');
        new lib_1.Function(stack, 'CF2', {
            code: lib_1.FunctionCode.fromInline('code'),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                CF2D7241DD7: {
                    Type: 'AWS::CloudFront::Function',
                    Properties: {
                        Name: {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    'StackCF2CE3F783F',
                                ],
                            ],
                        },
                        AutoPublish: true,
                        FunctionCode: 'code',
                        FunctionConfig: {
                            Comment: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        'StackCF2CE3F783F',
                                    ],
                                ],
                            },
                            Runtime: 'cloudfront-js-1.0',
                        },
                    },
                },
            },
        });
    });
    test('maximum example', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack', {
            env: { account: '123456789012', region: 'testregion' },
        });
        new lib_1.Function(stack, 'CF2', {
            code: lib_1.FunctionCode.fromInline('code'),
            comment: 'My super comment',
            functionName: 'FunctionName',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                CF2D7241DD7: {
                    Type: 'AWS::CloudFront::Function',
                    Properties: {
                        Name: 'FunctionName',
                        AutoPublish: true,
                        FunctionCode: 'code',
                        FunctionConfig: {
                            Comment: 'My super comment',
                            Runtime: 'cloudfront-js-1.0',
                        },
                    },
                },
            },
        });
    });
    test('code from external file', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack', {
            env: { account: '123456789012', region: 'testregion' },
        });
        new lib_1.Function(stack, 'CF2', {
            code: lib_1.FunctionCode.fromFile({ filePath: path.join(__dirname, 'function-code.js') }),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                CF2D7241DD7: {
                    Type: 'AWS::CloudFront::Function',
                    Properties: {
                        Name: 'testregionStackCF2CE3F783F',
                        AutoPublish: true,
                        FunctionCode: 'function handler(event) {\n  return event.request;\n}',
                        FunctionConfig: {
                            Comment: 'testregionStackCF2CE3F783F',
                            Runtime: 'cloudfront-js-1.0',
                        },
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bmN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isb0RBQStDO0FBQy9DLHdDQUEyQztBQUMzQyxnQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUVuQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtZQUNwQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUU7U0FDdkQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUN6QixJQUFJLEVBQUUsa0JBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQ3RDLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFO29CQUNYLElBQUksRUFBRSwyQkFBMkI7b0JBQ2pDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsNEJBQTRCO3dCQUNsQyxXQUFXLEVBQUUsSUFBSTt3QkFDakIsWUFBWSxFQUFFLE1BQU07d0JBQ3BCLGNBQWMsRUFBRTs0QkFDZCxPQUFPLEVBQUUsNEJBQTRCOzRCQUNyQyxPQUFPLEVBQUUsbUJBQW1CO3lCQUM3QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1FBQ3pELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFF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RUFBRSwyQkFBMkI7b0JBQ2pDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsNEJBQTRCO3dCQUNsQyxXQUFXLEVBQUUsSUFBSTt3QkFDakIsWUFBWSxFQUFFLHVEQUF1RDt3QkFDckUsY0FBYyxFQUFFOzRCQUNkLE9BQU8sRUFBRSw0QkFBNEI7NEJBQ3JDLE9BQU8sRUFBRSxtQkFBbUI7eUJBQzdCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGdW5jdGlvbiwgRnVuY3Rpb25Db2RlIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0Nsb3VkRnJvbnQgRnVuY3Rpb24nLCAoKSA9PiB7XG5cbiAgdGVzdCgnbWluaW1hbCBleGFtcGxlJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndGVzdHJlZ2lvbicgfSxcbiAgICB9KTtcbiAgICBuZXcgRnVuY3Rpb24oc3RhY2ssICdDRjInLCB7XG4gICAgICBjb2RlOiBGdW5jdGlvbkNvZGUuZnJvbUlubGluZSgnY29kZScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIENGMkQ3MjQxREQ3OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6RnVuY3Rpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICd0ZXN0cmVnaW9uU3RhY2tDRjJDRTNGNzgzRicsXG4gICAgICAgICAgICBBdXRvUHVibGlzaDogdHJ1ZSxcbiAgICAgICAgICAgIEZ1bmN0aW9uQ29kZTogJ2NvZGUnLFxuICAgICAgICAgICAgRnVuY3Rpb25Db25maWc6IHtcbiAgICAgICAgICAgICAgQ29tbWVudDogJ3Rlc3RyZWdpb25TdGFja0NGMkNFM0Y3ODNGJyxcbiAgICAgICAgICAgICAgUnVudGltZTogJ2Nsb3VkZnJvbnQtanMtMS4wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21pbmltYWwgZXhhbXBsZSBpbiBlbnZpcm9ubWVudCBhZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBuZXcgRnVuY3Rpb24oc3RhY2ssICdDRjInLCB7XG4gICAgICBjb2RlOiBGdW5jdGlvbkNvZGUuZnJvbUlubGluZSgnY29kZScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIENGMkQ3MjQxREQ3OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6RnVuY3Rpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdTdGFja0NGMkNFM0Y3ODNGJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEF1dG9QdWJsaXNoOiB0cnVlLFxuICAgICAgICAgICAgRnVuY3Rpb25Db2RlOiAnY29kZScsXG4gICAgICAgICAgICBGdW5jdGlvbkNvbmZpZzoge1xuICAgICAgICAgICAgICBDb21tZW50OiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICdTdGFja0NGMkNFM0Y3ODNGJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUnVudGltZTogJ2Nsb3VkZnJvbnQtanMtMS4wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21heGltdW0gZXhhbXBsZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3Rlc3RyZWdpb24nIH0sXG4gICAgfSk7XG4gICAgbmV3IEZ1bmN0aW9uKHN0YWNrLCAnQ0YyJywge1xuICAgICAgY29kZTogRnVuY3Rpb25Db2RlLmZyb21JbmxpbmUoJ2NvZGUnKSxcbiAgICAgIGNvbW1lbnQ6ICdNeSBzdXBlciBjb21tZW50JyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ0Z1bmN0aW9uTmFtZScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQ0YyRDcyNDFERDc6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZyb250OjpGdW5jdGlvbicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZTogJ0Z1bmN0aW9uTmFtZScsXG4gICAgICAgICAgICBBdXRvUHVibGlzaDogdHJ1ZSxcbiAgICAgICAgICAgIEZ1bmN0aW9uQ29kZTogJ2NvZGUnLFxuICAgICAgICAgICAgRnVuY3Rpb25Db25maWc6IHtcbiAgICAgICAgICAgICAgQ29tbWVudDogJ015IHN1cGVyIGNvbW1lbnQnLFxuICAgICAgICAgICAgICBSdW50aW1lOiAnY2xvdWRmcm9udC1qcy0xLjAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29kZSBmcm9tIGV4dGVybmFsIGZpbGUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICAgIH0pO1xuICAgIG5ldyBGdW5jdGlvbihzdGFjaywgJ0NGMicsIHtcbiAgICAgIGNvZGU6IEZ1bmN0aW9uQ29kZS5mcm9tRmlsZSh7IGZpbGVQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnVuY3Rpb24tY29kZS5qcycpIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIENGMkQ3MjQxREQ3OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGcm9udDo6RnVuY3Rpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICd0ZXN0cmVnaW9uU3RhY2tDRjJDRTNGNzgzRicsXG4gICAgICAgICAgICBBdXRvUHVibGlzaDogdHJ1ZSxcbiAgICAgICAgICAgIEZ1bmN0aW9uQ29kZTogJ2Z1bmN0aW9uIGhhbmRsZXIoZXZlbnQpIHtcXG4gIHJldHVybiBldmVudC5yZXF1ZXN0O1xcbn0nLFxuICAgICAgICAgICAgRnVuY3Rpb25Db25maWc6IHtcbiAgICAgICAgICAgICAgQ29tbWVudDogJ3Rlc3RyZWdpb25TdGFja0NGMkNFM0Y3ODNGJyxcbiAgICAgICAgICAgICAgUnVudGltZTogJ2Nsb3VkZnJvbnQtanMtMS4wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=