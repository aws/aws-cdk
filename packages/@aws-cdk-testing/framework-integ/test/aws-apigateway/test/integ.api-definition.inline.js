"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
/*
 * Stack verification steps:
 * * `curl -i <CFN output PetsURL>` should return HTTP code 200
 */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'integtest-restapi-fromdefinition-inline');
const api = new apigateway.SpecRestApi(stack, 'my-api', {
    cloudWatchRole: true,
    apiDefinition: apigateway.ApiDefinition.fromInline({
        openapi: '3.0.2',
        info: {
            version: '1.0.0',
            title: 'Test API for CDK',
        },
        paths: {
            '/pets': {
                get: {
                    'summary': 'Test Method',
                    'operationId': 'testMethod',
                    'responses': {
                        200: {
                            description: 'A paged array of pets',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/Empty',
                                    },
                                },
                            },
                        },
                    },
                    'x-amazon-apigateway-integration': {
                        responses: {
                            default: {
                                statusCode: '200',
                            },
                        },
                        requestTemplates: {
                            'application/json': '{"statusCode": 200}',
                        },
                        passthroughBehavior: 'when_no_match',
                        type: 'mock',
                    },
                },
            },
        },
        components: {
            schemas: {
                Empty: {
                    title: 'Empty Schema',
                    type: 'object',
                },
            },
        },
    }),
});
new cdk.CfnOutput(stack, 'PetsURL', {
    value: api.urlForPath('/pets'),
});
new integ_tests_alpha_1.IntegTest(app, 'inline-api-definition', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXBpLWRlZmluaXRpb24uaW5saW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYXBpLWRlZmluaXRpb24uaW5saW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCx5REFBeUQ7QUFFekQ7OztHQUdHO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSx5Q0FBeUMsQ0FBQyxDQUFDO0FBRTVFLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ3RELGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGFBQWEsRUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztRQUNqRCxPQUFPLEVBQUUsT0FBTztRQUNoQixJQUFJLEVBQUU7WUFDSixPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFLLEVBQUUsa0JBQWtCO1NBQzFCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLEdBQUcsRUFBRTtvQkFDSCxTQUFTLEVBQUUsYUFBYTtvQkFDeEIsYUFBYSxFQUFFLFlBQVk7b0JBQzNCLFdBQVcsRUFBRTt3QkFDWCxHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLHVCQUF1Qjs0QkFDcEMsT0FBTyxFQUFFO2dDQUNQLGtCQUFrQixFQUFFO29DQUNsQixNQUFNLEVBQUU7d0NBQ04sSUFBSSxFQUFFLDRCQUE0QjtxQ0FDbkM7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsaUNBQWlDLEVBQUU7d0JBQ2pDLFNBQVMsRUFBRTs0QkFDVCxPQUFPLEVBQUU7Z0NBQ1AsVUFBVSxFQUFFLEtBQUs7NkJBQ2xCO3lCQUNGO3dCQUNELGdCQUFnQixFQUFFOzRCQUNoQixrQkFBa0IsRUFBRSxxQkFBcUI7eUJBQzFDO3dCQUNELG1CQUFtQixFQUFFLGVBQWU7d0JBQ3BDLElBQUksRUFBRSxNQUFNO3FCQUNiO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUU7b0JBQ0wsS0FBSyxFQUFFLGNBQWM7b0JBQ3JCLElBQUksRUFBRSxRQUFRO2lCQUNmO2FBQ0Y7U0FDRjtLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUNsQyxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7Q0FDL0IsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTtJQUMxQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG4vKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBgY3VybCAtaSA8Q0ZOIG91dHB1dCBQZXRzVVJMPmAgc2hvdWxkIHJldHVybiBIVFRQIGNvZGUgMjAwXG4gKi9cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZ3Rlc3QtcmVzdGFwaS1mcm9tZGVmaW5pdGlvbi1pbmxpbmUnKTtcblxuY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuU3BlY1Jlc3RBcGkoc3RhY2ssICdteS1hcGknLCB7XG4gIGNsb3VkV2F0Y2hSb2xlOiB0cnVlLFxuICBhcGlEZWZpbml0aW9uOiBhcGlnYXRld2F5LkFwaURlZmluaXRpb24uZnJvbUlubGluZSh7XG4gICAgb3BlbmFwaTogJzMuMC4yJyxcbiAgICBpbmZvOiB7XG4gICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgdGl0bGU6ICdUZXN0IEFQSSBmb3IgQ0RLJyxcbiAgICB9LFxuICAgIHBhdGhzOiB7XG4gICAgICAnL3BldHMnOiB7XG4gICAgICAgIGdldDoge1xuICAgICAgICAgICdzdW1tYXJ5JzogJ1Rlc3QgTWV0aG9kJyxcbiAgICAgICAgICAnb3BlcmF0aW9uSWQnOiAndGVzdE1ldGhvZCcsXG4gICAgICAgICAgJ3Jlc3BvbnNlcyc6IHtcbiAgICAgICAgICAgIDIwMDoge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0EgcGFnZWQgYXJyYXkgb2YgcGV0cycsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHtcbiAgICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICAkcmVmOiAnIy9jb21wb25lbnRzL3NjaGVtYXMvRW1wdHknLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICd4LWFtYXpvbi1hcGlnYXRld2F5LWludGVncmF0aW9uJzoge1xuICAgICAgICAgICAgcmVzcG9uc2VzOiB7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3tcInN0YXR1c0NvZGVcIjogMjAwfScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogJ3doZW5fbm9fbWF0Y2gnLFxuICAgICAgICAgICAgdHlwZTogJ21vY2snLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY29tcG9uZW50czoge1xuICAgICAgc2NoZW1hczoge1xuICAgICAgICBFbXB0eToge1xuICAgICAgICAgIHRpdGxlOiAnRW1wdHkgU2NoZW1hJyxcbiAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSksXG59KTtcblxubmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdQZXRzVVJMJywge1xuICB2YWx1ZTogYXBpLnVybEZvclBhdGgoJy9wZXRzJyksXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdpbmxpbmUtYXBpLWRlZmluaXRpb24nLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19