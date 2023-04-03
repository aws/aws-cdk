"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const lambda = require("../lib");
describe('FunctionUrl', () => {
    test('default function url', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new lambda.FunctionUrl(stack, 'FunctionUrl', {
            function: fn,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
            AuthType: 'AWS_IAM',
            TargetFunctionArn: {
                'Fn::GetAtt': [
                    'MyLambdaCCE802FB',
                    'Arn',
                ],
            },
        });
    });
    test('all function url options', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new lambda.FunctionUrl(stack, 'FunctionUrl', {
            function: fn,
            authType: lambda.FunctionUrlAuthType.NONE,
            cors: {
                allowCredentials: true,
                allowedOrigins: ['https://example.com'],
                allowedMethods: [lambda.HttpMethod.GET],
                allowedHeaders: ['X-Custom-Header'],
                maxAge: cdk.Duration.seconds(300),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Url', {
            AuthType: 'NONE',
            TargetFunctionArn: {
                'Fn::GetAtt': [
                    'MyLambdaCCE802FB',
                    'Arn',
                ],
            },
            Cors: {
                AllowCredentials: true,
                AllowHeaders: [
                    'X-Custom-Header',
                ],
                AllowMethods: [
                    'GET',
                ],
                AllowOrigins: [
                    'https://example.com',
                ],
                MaxAge: 300,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunctionUrl',
            FunctionName: {
                'Fn::GetAtt': [
                    'MyLambdaCCE802FB',
                    'Arn',
                ],
            },
            Principal: '*',
            FunctionUrlAuthType: 'NONE',
        });
    });
    test('function url with alias', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const aliasName = 'prod';
        const alias = new lambda.Alias(stack, 'Alias', {
            aliasName,
            version: fn.currentVersion,
        });
        // WHEN
        new lambda.FunctionUrl(stack, 'FunctionUrl', {
            function: alias,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::Lambda::Url', {
            DependsOn: ['Alias325C5727'],
            Properties: {
                AuthType: 'AWS_IAM',
                TargetFunctionArn: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
                Qualifier: aliasName,
            },
        });
    });
    test('throws when configured with Version', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const version = new lambda.Version(stack, 'Version', {
            lambda: fn,
            maxEventAge: cdk.Duration.hours(1),
            retryAttempts: 0,
        });
        // WHEN
        expect(() => {
            new lambda.FunctionUrl(stack, 'FunctionUrl', {
                function: version,
            });
        }).toThrow(/FunctionUrl cannot be used with a Version/);
    });
    test('grantInvokeUrl: adds appropriate permissions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.AccountPrincipal('1234'),
        });
        const fn = new lambda.Function(stack, 'MyLambda', {
            code: new lambda.InlineCode('hello()'),
            handler: 'index.hello',
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const fnUrl = new lambda.FunctionUrl(stack, 'FunctionUrl', {
            function: fn,
        });
        // WHEN
        fnUrl.grantInvokeUrl(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'lambda:InvokeFunctionUrl',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'MyLambdaCCE802FB',
                                'Arn',
                            ],
                        },
                    },
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tdXJsLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbi11cmwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLGlDQUFpQztBQUVqQyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUNoRCxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztZQUN0QyxPQUFPLEVBQUUsYUFBYTtZQUN0QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUMzQyxRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxRQUFRLEVBQUUsU0FBUztZQUNuQixpQkFBaUIsRUFBRTtnQkFDakIsWUFBWSxFQUFFO29CQUNaLGtCQUFrQjtvQkFDbEIsS0FBSztpQkFDTjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5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RUFBRSxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDaEQsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDdEMsT0FBTyxFQUFFLGFBQWE7WUFDdEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztTQUNwQyxDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUN6RCxRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNCLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxNQUFNLEVBQUUsMEJBQTBCO3dCQUNsQyxNQUFNLEVBQUUsT0FBTzt3QkFDZixRQUFRLEVBQUU7NEJBQ1IsWUFBWSxFQUFFO2dDQUNaLGtCQUFrQjtnQ0FDbEIsS0FBSzs2QkFDTjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0Z1bmN0aW9uVXJsJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IGZ1bmN0aW9uIHVybCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvblVybChzdGFjaywgJ0Z1bmN0aW9uVXJsJywge1xuICAgICAgZnVuY3Rpb246IGZuLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6VXJsJywge1xuICAgICAgQXV0aFR5cGU6ICdBV1NfSUFNJyxcbiAgICAgIFRhcmdldEZ1bmN0aW9uQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeUxhbWJkYUNDRTgwMkZCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbCBmdW5jdGlvbiB1cmwgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvblVybChzdGFjaywgJ0Z1bmN0aW9uVXJsJywge1xuICAgICAgZnVuY3Rpb246IGZuLFxuICAgICAgYXV0aFR5cGU6IGxhbWJkYS5GdW5jdGlvblVybEF1dGhUeXBlLk5PTkUsXG4gICAgICBjb3JzOiB7XG4gICAgICAgIGFsbG93Q3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgIGFsbG93ZWRPcmlnaW5zOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXSxcbiAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFtsYW1iZGEuSHR0cE1ldGhvZC5HRVRdLFxuICAgICAgICBhbGxvd2VkSGVhZGVyczogWydYLUN1c3RvbS1IZWFkZXInXSxcbiAgICAgICAgbWF4QWdlOiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMDApLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlVybCcsIHtcbiAgICAgIEF1dGhUeXBlOiAnTk9ORScsXG4gICAgICBUYXJnZXRGdW5jdGlvbkFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQ29yczoge1xuICAgICAgICBBbGxvd0NyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICBBbGxvd0hlYWRlcnM6IFtcbiAgICAgICAgICAnWC1DdXN0b20tSGVhZGVyJyxcbiAgICAgICAgXSxcbiAgICAgICAgQWxsb3dNZXRob2RzOiBbXG4gICAgICAgICAgJ0dFVCcsXG4gICAgICAgIF0sXG4gICAgICAgIEFsbG93T3JpZ2luczogW1xuICAgICAgICAgICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgXSxcbiAgICAgICAgTWF4QWdlOiAzMDAsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvblVybCcsXG4gICAgICBGdW5jdGlvbk5hbWU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015TGFtYmRhQ0NFODAyRkInLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgRnVuY3Rpb25VcmxBdXRoVHlwZTogJ05PTkUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmdW5jdGlvbiB1cmwgd2l0aCBhbGlhcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gICAgY29uc3QgYWxpYXNOYW1lID0gJ3Byb2QnO1xuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ0FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGxhbWJkYS5GdW5jdGlvblVybChzdGFjaywgJ0Z1bmN0aW9uVXJsJywge1xuICAgICAgZnVuY3Rpb246IGFsaWFzLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6TGFtYmRhOjpVcmwnLCB7XG4gICAgICBEZXBlbmRzT246IFsnQWxpYXMzMjVDNTcyNyddLFxuICAgICAgUHJvcGVydGllczoge1xuICAgICAgICBBdXRoVHlwZTogJ0FXU19JQU0nLFxuICAgICAgICBUYXJnZXRGdW5jdGlvbkFybjogeyAnRm46OkdldEF0dCc6IFsnTXlMYW1iZGFDQ0U4MDJGQicsICdBcm4nXSB9LFxuICAgICAgICBRdWFsaWZpZXI6IGFsaWFzTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGNvbmZpZ3VyZWQgd2l0aCBWZXJzaW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTXlMYW1iZGEnLCB7XG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLklubGluZUNvZGUoJ2hlbGxvKCknKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcbiAgICBjb25zdCB2ZXJzaW9uID0gbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAnVmVyc2lvbicsIHtcbiAgICAgIGxhbWJkYTogZm4sXG4gICAgICBtYXhFdmVudEFnZTogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgcmV0cnlBdHRlbXB0czogMCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGxhbWJkYS5GdW5jdGlvblVybChzdGFjaywgJ0Z1bmN0aW9uVXJsJywge1xuICAgICAgICBmdW5jdGlvbjogdmVyc2lvbixcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Z1bmN0aW9uVXJsIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBWZXJzaW9uLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50SW52b2tlVXJsOiBhZGRzIGFwcHJvcHJpYXRlIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgnMTIzNCcpLFxuICAgIH0pO1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ015TGFtYmRhJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdoZWxsbygpJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGVsbG8nLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gICAgY29uc3QgZm5VcmwgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uVXJsKHN0YWNrLCAnRnVuY3Rpb25VcmwnLCB7XG4gICAgICBmdW5jdGlvbjogZm4sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZm5VcmwuZ3JhbnRJbnZva2VVcmwocm9sZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvblVybCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnTXlMYW1iZGFDQ0U4MDJGQicsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19