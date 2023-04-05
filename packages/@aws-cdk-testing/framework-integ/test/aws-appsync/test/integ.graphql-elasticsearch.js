"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const es = require("aws-cdk-lib/aws-elasticsearch");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const appsync = require("aws-cdk-lib/aws-appsync");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'appsync-elasticsearch');
const user = new aws_iam_1.User(stack, 'User');
const domain = new es.Domain(stack, 'Domain', {
    version: es.ElasticsearchVersion.V7_1,
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
const api = new appsync.GraphqlApi(stack, 'api', {
    name: 'api',
    schema: appsync.SchemaFile.fromAsset(path.join(__dirname, 'appsync.test.graphql')),
});
const ds = api.addElasticsearchDataSource('ds', domain);
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
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZ3JhcGhxbC1lbGFzdGljc2VhcmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZ3JhcGhxbC1lbGFzdGljc2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG9EQUFvRDtBQUNwRCxpREFBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUVuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDMUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQzVDLE9BQU8sRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSTtJQUNyQyxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0lBQ3hDLHdCQUF3QixFQUFFO1FBQ3hCLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTztLQUM1QjtJQUNELGdCQUFnQixFQUFFO1FBQ2hCLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7SUFDRCxvQkFBb0IsRUFBRSxJQUFJO0lBQzFCLFlBQVksRUFBRSxJQUFJO0NBQ25CLENBQUMsQ0FBQztBQUVILE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQy9DLElBQUksRUFBRSxLQUFLO0lBQ1gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7Q0FDbkYsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLDBCQUEwQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUV4RCxFQUFFLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtJQUNqQyxRQUFRLEVBQUUsT0FBTztJQUNqQixTQUFTLEVBQUUsVUFBVTtJQUNyQixzQkFBc0IsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hFLE9BQU8sRUFBRSxZQUFZO1FBQ3JCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsRUFBRTtZQUNmLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLEVBQUUsRUFBRTthQUNUO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCx1QkFBdUIsRUFBRSxPQUFPLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3pFLE9BQU8sRUFBRSxZQUFZO1FBQ3JCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsTUFBTSxFQUFFO1lBQ04sT0FBTyxFQUFFLEVBQUU7WUFDWCxXQUFXLEVBQUUsRUFBRTtZQUNmLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLEVBQUUsRUFBRTtnQkFDUixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxFQUFFO3dCQUNKLE1BQU0sRUFBRSx5Q0FBeUM7cUJBQ2xEO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY3NlYXJjaCc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBwc3luYyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXBwc3luYy1lbGFzdGljc2VhcmNoJyk7XG5jb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdVc2VyJyk7XG5jb25zdCBkb21haW4gPSBuZXcgZXMuRG9tYWluKHN0YWNrLCAnRG9tYWluJywge1xuICB2ZXJzaW9uOiBlcy5FbGFzdGljc2VhcmNoVmVyc2lvbi5WN18xLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBmaW5lR3JhaW5lZEFjY2Vzc0NvbnRyb2w6IHtcbiAgICBtYXN0ZXJVc2VyQXJuOiB1c2VyLnVzZXJBcm4sXG4gIH0sXG4gIGVuY3J5cHRpb25BdFJlc3Q6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICB9LFxuICBub2RlVG9Ob2RlRW5jcnlwdGlvbjogdHJ1ZSxcbiAgZW5mb3JjZUh0dHBzOiB0cnVlLFxufSk7XG5cbmNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkoc3RhY2ssICdhcGknLCB7XG4gIG5hbWU6ICdhcGknLFxuICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hRmlsZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FwcHN5bmMudGVzdC5ncmFwaHFsJykpLFxufSk7XG5cbmNvbnN0IGRzID0gYXBpLmFkZEVsYXN0aWNzZWFyY2hEYXRhU291cmNlKCdkcycsIGRvbWFpbik7XG5cbmRzLmNyZWF0ZVJlc29sdmVyKCdRdWVyeUdldFRlc3RzJywge1xuICB0eXBlTmFtZTogJ1F1ZXJ5JyxcbiAgZmllbGROYW1lOiAnZ2V0VGVzdHMnLFxuICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKEpTT04uc3RyaW5naWZ5KHtcbiAgICB2ZXJzaW9uOiAnMjAxNy0wMi0yOCcsXG4gICAgb3BlcmF0aW9uOiAnR0VUJyxcbiAgICBwYXRoOiAnL2lkL3Bvc3QvX3NlYXJjaCcsXG4gICAgcGFyYW1zOiB7XG4gICAgICBoZWFkZXJzOiB7fSxcbiAgICAgIHF1ZXJ5U3RyaW5nOiB7fSxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgZnJvbTogMCxcbiAgICAgICAgc2l6ZTogNTAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pKSxcbiAgcmVzcG9uc2VNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoSlNPTi5zdHJpbmdpZnkoe1xuICAgIHZlcnNpb246ICcyMDE3LTAyLTI4JyxcbiAgICBvcGVyYXRpb246ICdHRVQnLFxuICAgIHBhdGg6ICcvaWQvcG9zdC9fc2VhcmNoJyxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgcXVlcnlTdHJpbmc6IHt9LFxuICAgICAgYm9keToge1xuICAgICAgICBmcm9tOiAwLFxuICAgICAgICBzaXplOiA1MCxcbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICB0ZXJtOiB7XG4gICAgICAgICAgICBhdXRob3I6ICckdXRpbC50b0pzb24oJGNvbnRleHQuYXJndW1lbnRzLmF1dGhvciknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pKSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==