"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appsync_1 = require("aws-cdk-lib/aws-appsync");
/*
 * Creates an Appsync GraphQL API with API_KEY authorization.
 * Testing for API_KEY Authorization.
 *
 * Stack verification steps:
 * Deploy stack, get api-key and endpoint.
 * Check if authorization occurs with empty get.
 *
 * -- bash verify.integ.auth-apikey.sh --start                      -- deploy stack               --
 * -- aws appsync list-graphql-apis                                 -- obtain api id && endpoint  --
 * -- aws appsync list-api-keys --api-id [API ID]                   -- obtain api key             --
 * -- bash verify.integ.auth-apikey.sh --check [APIKEY] [ENDPOINT]  -- check if fails/success     --
 * -- bash verify.integ.auth-apikey.sh --clean                      -- clean dependencies/stack   --
 */
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-appsync-integ');
const api = new aws_appsync_1.GraphqlApi(stack, 'Api', {
    name: 'Integ_Test_APIKey',
    schema: aws_appsync_1.SchemaFile.fromAsset((0, path_1.join)(__dirname, 'appsync.auth.graphql')),
    authorizationConfig: {
        defaultAuthorization: {
            authorizationType: aws_appsync_1.AuthorizationType.API_KEY,
            apiKeyConfig: {
                // Rely on default expiration date provided by the API so we have a deterministic snapshot
                expires: undefined,
            },
        },
    },
});
const testTable = new aws_dynamodb_1.Table(stack, 'TestTable', {
    billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
        name: 'id',
        type: aws_dynamodb_1.AttributeType.STRING,
    },
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const testDS = api.addDynamoDbDataSource('testDataSource', testTable);
testDS.createResolver('QueryGetTests', {
    typeName: 'Query',
    fieldName: 'getTests',
    requestMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbScanTable(),
    responseMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbResultList(),
});
testDS.createResolver('MutationAddTest', {
    typeName: 'Mutation',
    fieldName: 'addTest',
    requestMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbPutItem(aws_appsync_1.PrimaryKey.partition('id').auto(), aws_appsync_1.Values.projecting('test')),
    responseMappingTemplate: aws_appsync_1.MappingTemplate.dynamoDbResultItem(),
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXV0aC1hcGlrZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hdXRoLWFwaWtleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE0QjtBQUM1QiwyREFBNkU7QUFDN0UsNkNBQXdEO0FBQ3hELHlEQUF5SDtBQUV6SDs7Ozs7Ozs7Ozs7OztHQWFHO0FBRUgsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBRWxELE1BQU0sR0FBRyxHQUFHLElBQUksd0JBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0lBQ3ZDLElBQUksRUFBRSxtQkFBbUI7SUFDekIsTUFBTSxFQUFFLHdCQUFVLENBQUMsU0FBUyxDQUFDLElBQUEsV0FBSSxFQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3JFLG1CQUFtQixFQUFFO1FBQ25CLG9CQUFvQixFQUFFO1lBQ3BCLGlCQUFpQixFQUFFLCtCQUFpQixDQUFDLE9BQU87WUFDNUMsWUFBWSxFQUFFO2dCQUNaLDBGQUEwRjtnQkFDMUYsT0FBTyxFQUFFLFNBQVM7YUFDbkI7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7SUFDOUMsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtJQUN4QyxZQUFZLEVBQUU7UUFDWixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07S0FDM0I7SUFDRCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxPQUFPO0NBQ3JDLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUV0RSxNQUFNLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRTtJQUNyQyxRQUFRLEVBQUUsT0FBTztJQUNqQixTQUFTLEVBQUUsVUFBVTtJQUNyQixzQkFBc0IsRUFBRSw2QkFBZSxDQUFDLGlCQUFpQixFQUFFO0lBQzNELHVCQUF1QixFQUFFLDZCQUFlLENBQUMsa0JBQWtCLEVBQUU7Q0FDOUQsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRTtJQUN2QyxRQUFRLEVBQUUsVUFBVTtJQUNwQixTQUFTLEVBQUUsU0FBUztJQUNwQixzQkFBc0IsRUFBRSw2QkFBZSxDQUFDLGVBQWUsQ0FBQyx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxvQkFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNySCx1QkFBdUIsRUFBRSw2QkFBZSxDQUFDLGtCQUFrQixFQUFFO0NBQzlELENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIEJpbGxpbmdNb2RlLCBUYWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvblR5cGUsIEdyYXBocWxBcGksIE1hcHBpbmdUZW1wbGF0ZSwgUHJpbWFyeUtleSwgU2NoZW1hRmlsZSwgVmFsdWVzIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcHN5bmMnO1xuXG4vKlxuICogQ3JlYXRlcyBhbiBBcHBzeW5jIEdyYXBoUUwgQVBJIHdpdGggQVBJX0tFWSBhdXRob3JpemF0aW9uLlxuICogVGVzdGluZyBmb3IgQVBJX0tFWSBBdXRob3JpemF0aW9uLlxuICpcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqIERlcGxveSBzdGFjaywgZ2V0IGFwaS1rZXkgYW5kIGVuZHBvaW50LlxuICogQ2hlY2sgaWYgYXV0aG9yaXphdGlvbiBvY2N1cnMgd2l0aCBlbXB0eSBnZXQuXG4gKlxuICogLS0gYmFzaCB2ZXJpZnkuaW50ZWcuYXV0aC1hcGlrZXkuc2ggLS1zdGFydCAgICAgICAgICAgICAgICAgICAgICAtLSBkZXBsb3kgc3RhY2sgICAgICAgICAgICAgICAtLVxuICogLS0gYXdzIGFwcHN5bmMgbGlzdC1ncmFwaHFsLWFwaXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBvYnRhaW4gYXBpIGlkICYmIGVuZHBvaW50ICAtLVxuICogLS0gYXdzIGFwcHN5bmMgbGlzdC1hcGkta2V5cyAtLWFwaS1pZCBbQVBJIElEXSAgICAgICAgICAgICAgICAgICAtLSBvYnRhaW4gYXBpIGtleSAgICAgICAgICAgICAtLVxuICogLS0gYmFzaCB2ZXJpZnkuaW50ZWcuYXV0aC1hcGlrZXkuc2ggLS1jaGVjayBbQVBJS0VZXSBbRU5EUE9JTlRdICAtLSBjaGVjayBpZiBmYWlscy9zdWNjZXNzICAgICAtLVxuICogLS0gYmFzaCB2ZXJpZnkuaW50ZWcuYXV0aC1hcGlrZXkuc2ggLS1jbGVhbiAgICAgICAgICAgICAgICAgICAgICAtLSBjbGVhbiBkZXBlbmRlbmNpZXMvc3RhY2sgICAtLVxuICovXG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1hcHBzeW5jLWludGVnJyk7XG5cbmNvbnN0IGFwaSA9IG5ldyBHcmFwaHFsQXBpKHN0YWNrLCAnQXBpJywge1xuICBuYW1lOiAnSW50ZWdfVGVzdF9BUElLZXknLFxuICBzY2hlbWE6IFNjaGVtYUZpbGUuZnJvbUFzc2V0KGpvaW4oX19kaXJuYW1lLCAnYXBwc3luYy5hdXRoLmdyYXBocWwnKSksXG4gIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgLy8gUmVseSBvbiBkZWZhdWx0IGV4cGlyYXRpb24gZGF0ZSBwcm92aWRlZCBieSB0aGUgQVBJIHNvIHdlIGhhdmUgYSBkZXRlcm1pbmlzdGljIHNuYXBzaG90XG4gICAgICAgIGV4cGlyZXM6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuXG5jb25zdCB0ZXN0VGFibGUgPSBuZXcgVGFibGUoc3RhY2ssICdUZXN0VGFibGUnLCB7XG4gIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gIHBhcnRpdGlvbktleToge1xuICAgIG5hbWU6ICdpZCcsXG4gICAgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkcsXG4gIH0sXG4gIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCB0ZXN0RFMgPSBhcGkuYWRkRHluYW1vRGJEYXRhU291cmNlKCd0ZXN0RGF0YVNvdXJjZScsIHRlc3RUYWJsZSk7XG5cbnRlc3REUy5jcmVhdGVSZXNvbHZlcignUXVlcnlHZXRUZXN0cycsIHtcbiAgdHlwZU5hbWU6ICdRdWVyeScsXG4gIGZpZWxkTmFtZTogJ2dldFRlc3RzJyxcbiAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiU2NhblRhYmxlKCksXG4gIHJlc3BvbnNlTWFwcGluZ1RlbXBsYXRlOiBNYXBwaW5nVGVtcGxhdGUuZHluYW1vRGJSZXN1bHRMaXN0KCksXG59KTtcblxudGVzdERTLmNyZWF0ZVJlc29sdmVyKCdNdXRhdGlvbkFkZFRlc3QnLCB7XG4gIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICBmaWVsZE5hbWU6ICdhZGRUZXN0JyxcbiAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUHV0SXRlbShQcmltYXJ5S2V5LnBhcnRpdGlvbignaWQnKS5hdXRvKCksIFZhbHVlcy5wcm9qZWN0aW5nKCd0ZXN0JykpLFxuICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogTWFwcGluZ1RlbXBsYXRlLmR5bmFtb0RiUmVzdWx0SXRlbSgpLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19