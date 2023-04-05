"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const opensearch = require("aws-cdk-lib/aws-opensearchservice");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const appsync = require("aws-cdk-lib/aws-appsync");
class OpensSearch23Stack extends cdk.Stack {
    constructor(scope) {
        super(scope, 'appsync-opensearch');
        const user = new aws_iam_1.User(this, 'User');
        const domain = new opensearch.Domain(this, 'Domain', {
            version: opensearch.EngineVersion.OPENSEARCH_2_3,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            fineGrainedAccessControl: {
                masterUserArn: user.userArn,
            },
            encryptionAtRest: {
                enabled: true,
            },
            nodeToNodeEncryption: true,
            enforceHttps: true,
        });
        const api = new appsync.GraphqlApi(this, 'api', {
            name: 'api',
            schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
        });
        const ds = api.addOpenSearchDataSource('ds', domain);
        ds.createResolver('QueryGetTests', {
            typeName: 'Query',
            fieldName: 'getTests',
            requestMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
                version: '2017-02-28',
                operation: 'GET',
                path: '/id/post/_search',
                params: {
                    headers: {},
                    queryString: {},
                    body: {
                        from: 0,
                        size: 50,
                    },
                },
            })),
            responseMappingTemplate: appsync.MappingTemplate.fromString(JSON.stringify({
                version: '2017-02-28',
                operation: 'GET',
                path: '/id/post/_search',
                params: {
                    headers: {},
                    queryString: {},
                    body: {
                        from: 0,
                        size: 50,
                        query: {
                            term: {
                                author: '$util.toJson($context.arguments.author)',
                            },
                        },
                    },
                },
            })),
        });
    }
}
const app = new cdk.App();
const testCase = new OpensSearch23Stack(app);
new integ_tests_alpha_1.IntegTest(app, 'opensearch-2.3-stack', {
    testCases: [testCase],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ3JhcGhxbC1vcGVuc2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZ3JhcGhxbC1vcGVuc2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLGlEQUEyQztBQUMzQyxnRUFBZ0U7QUFDaEUsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUV2RCxtREFBbUQ7QUFFbkQsTUFBTSxrQkFBbUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN4QyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUVuQyxNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDbkQsT0FBTyxFQUFFLFVBQVUsQ0FBQyxhQUFhLENBQUMsY0FBYztZQUNoRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLHdCQUF3QixFQUFFO2dCQUN4QixhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDNUI7WUFDRCxnQkFBZ0IsRUFBRTtnQkFDaEIsT0FBTyxFQUFFLElBQUk7YUFDZDtZQUNELG9CQUFvQixFQUFFLElBQUk7WUFDMUIsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDOUMsSUFBSSxFQUFFLEtBQUs7WUFDWCxNQUFNLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztTQUNuRixDQUFDLENBQUM7UUFFSCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXJELEVBQUUsQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFO1lBQ2pDLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3hFLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFFO29CQUNmLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsQ0FBQzt3QkFDUCxJQUFJLEVBQUUsRUFBRTtxQkFDVDtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILHVCQUF1QixFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ3pFLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsSUFBSSxFQUFFLGtCQUFrQjtnQkFDeEIsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFFO29CQUNmLElBQUksRUFBRTt3QkFDSixJQUFJLEVBQUUsQ0FBQzt3QkFDUCxJQUFJLEVBQUUsRUFBRTt3QkFDUixLQUFLLEVBQUU7NEJBQ0wsSUFBSSxFQUFFO2dDQUNKLE1BQU0sRUFBRSx5Q0FBeUM7NkJBQ2xEO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QyxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLHNCQUFzQixFQUFFO0lBQ3pDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztDQUN0QixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgb3BlbnNlYXJjaCBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtb3BlbnNlYXJjaHNlcnZpY2UnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBwc3luYyc7XG5cbmNsYXNzIE9wZW5zU2VhcmNoMjNTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ2FwcHN5bmMtb3BlbnNlYXJjaCcpO1xuXG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHRoaXMsICdVc2VyJyk7XG5cbiAgICBjb25zdCBkb21haW4gPSBuZXcgb3BlbnNlYXJjaC5Eb21haW4odGhpcywgJ0RvbWFpbicsIHtcbiAgICAgIHZlcnNpb246IG9wZW5zZWFyY2guRW5naW5lVmVyc2lvbi5PUEVOU0VBUkNIXzJfMyxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBmaW5lR3JhaW5lZEFjY2Vzc0NvbnRyb2w6IHtcbiAgICAgICAgbWFzdGVyVXNlckFybjogdXNlci51c2VyQXJuLFxuICAgICAgfSxcbiAgICAgIGVuY3J5cHRpb25BdFJlc3Q6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBub2RlVG9Ob2RlRW5jcnlwdGlvbjogdHJ1ZSxcbiAgICAgIGVuZm9yY2VIdHRwczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ2FwaScsIHtcbiAgICAgIG5hbWU6ICdhcGknLFxuICAgICAgc2NoZW1hOiBhcHBzeW5jLlNjaGVtYUZpbGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdhcHBzeW5jLnRlc3QuZ3JhcGhxbCcpKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRzID0gYXBpLmFkZE9wZW5TZWFyY2hEYXRhU291cmNlKCdkcycsIGRvbWFpbik7XG5cbiAgICBkcy5jcmVhdGVSZXNvbHZlcignUXVlcnlHZXRUZXN0cycsIHtcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGROYW1lOiAnZ2V0VGVzdHMnLFxuICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHZlcnNpb246ICcyMDE3LTAyLTI4JyxcbiAgICAgICAgb3BlcmF0aW9uOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9pZC9wb3N0L19zZWFyY2gnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICBxdWVyeVN0cmluZzoge30sXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgIHNpemU6IDUwLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSksXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHZlcnNpb246ICcyMDE3LTAyLTI4JyxcbiAgICAgICAgb3BlcmF0aW9uOiAnR0VUJyxcbiAgICAgICAgcGF0aDogJy9pZC9wb3N0L19zZWFyY2gnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICBxdWVyeVN0cmluZzoge30sXG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgIHNpemU6IDUwLFxuICAgICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgICAgdGVybToge1xuICAgICAgICAgICAgICAgIGF1dGhvcjogJyR1dGlsLnRvSnNvbigkY29udGV4dC5hcmd1bWVudHMuYXV0aG9yKScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IE9wZW5zU2VhcmNoMjNTdGFjayhhcHApO1xubmV3IEludGVnVGVzdChhcHAsICdvcGVuc2VhcmNoLTIuMy1zdGFjaycsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19