"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const lambda = require("@aws-cdk/aws-lambda");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const codedeploy = require("../../lib");
function mockFunction(stack, id) {
    return new lambda.Function(stack, id, {
        code: lambda.Code.fromInline('mock'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_14_X,
    });
}
function mockAlias(stack) {
    return new lambda.Alias(stack, 'Alias', {
        aliasName: 'my-alias',
        version: new lambda.Version(stack, 'Version', {
            lambda: mockFunction(stack, 'Function'),
        }),
    });
}
let stack;
let application;
let alias;
beforeEach(() => {
    stack = new cdk.Stack();
    application = new codedeploy.LambdaApplication(stack, 'MyApp');
    alias = mockAlias(stack);
});
cdk_build_tools_1.testDeprecated('custom resource created', () => {
    // WHEN
    const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
        ServiceToken: {
            'Fn::GetAtt': [
                'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                'Arn',
            ],
        },
        Create: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
        Update: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
        Delete: '{"service":"CodeDeploy","action":"deleteDeploymentConfig","parameters":{"deploymentConfigName":"CustomConfig.LambdaCanary5Percent1Minutes"}}',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'codedeploy:CreateDeploymentConfig',
                    Effect: 'Allow',
                    Resource: '*',
                },
                {
                    Action: 'codedeploy:DeleteDeploymentConfig',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
    });
});
cdk_build_tools_1.testDeprecated('custom resource created with specific name', () => {
    // WHEN
    const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
        deploymentConfigName: 'MyDeploymentConfig',
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
        Create: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"MyDeploymentConfig"}}',
        Update: '{"service":"CodeDeploy","action":"createDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig","computePlatform":"Lambda","trafficRoutingConfig":{"type":"TimeBasedCanary","timeBasedCanary":{"canaryInterval":"1","canaryPercentage":"5"}}},"physicalResourceId":{"id":"MyDeploymentConfig"}}',
        Delete: '{"service":"CodeDeploy","action":"deleteDeploymentConfig","parameters":{"deploymentConfigName":"MyDeploymentConfig"}}',
    });
});
cdk_build_tools_1.testDeprecated('fail with more than 100 characters in name', () => {
    const app = new cdk.App();
    const stackWithApp = new cdk.Stack(app);
    new codedeploy.CustomLambdaDeploymentConfig(stackWithApp, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
        deploymentConfigName: 'a'.repeat(101),
    });
    expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
});
cdk_build_tools_1.testDeprecated('fail with unallowed characters in name', () => {
    const app = new cdk.App();
    const stackWithApp = new cdk.Stack(app);
    new codedeploy.CustomLambdaDeploymentConfig(stackWithApp, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
        deploymentConfigName: 'my name',
    });
    expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
});
cdk_build_tools_1.testDeprecated('can create linear custom config', () => {
    // WHEN
    const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.LINEAR,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
        DeploymentConfigName: 'CustomConfig.LambdaLinear5PercentEvery1Minutes',
    });
});
cdk_build_tools_1.testDeprecated('can create canary custom config', () => {
    // WHEN
    const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
        DeploymentConfigName: 'CustomConfig.LambdaCanary5Percent1Minutes',
    });
});
cdk_build_tools_1.testDeprecated('dependency on the config exists to ensure ordering', () => {
    // WHEN
    const config = new codedeploy.CustomLambdaDeploymentConfig(stack, 'CustomConfig', {
        type: codedeploy.CustomLambdaDeploymentConfigType.CANARY,
        interval: cdk.Duration.minutes(1),
        percentage: 5,
    });
    new codedeploy.LambdaDeploymentGroup(stack, 'MyDG', {
        application,
        alias,
        deploymentConfig: config,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeDeploy::DeploymentGroup', {
        Properties: {
            DeploymentConfigName: 'CustomConfig.LambdaCanary5Percent1Minutes',
        },
        DependsOn: [
            'CustomConfigDeploymentConfigCustomResourcePolicy0426B684',
            'CustomConfigDeploymentConfigE9E1F384',
        ],
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRlcGxveW1lbnQtY29uZmlnLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tZGVwbG95bWVudC1jb25maWcudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4Q0FBOEM7QUFDOUMsOERBQTBEO0FBQzFELHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFFeEMsU0FBUyxZQUFZLENBQUMsS0FBZ0IsRUFBRSxFQUFVO0lBQ2hELE9BQU8sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7UUFDcEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNwQyxPQUFPLEVBQUUsZUFBZTtRQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO0tBQ3BDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRCxTQUFTLFNBQVMsQ0FBQyxLQUFnQjtJQUNqQyxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1FBQ3RDLFNBQVMsRUFBRSxVQUFVO1FBQ3JCLE9BQU8sRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxNQUFNLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7U0FDeEMsQ0FBQztLQUNILENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxXQUF5QyxDQUFDO0FBQzlDLElBQUksS0FBbUIsQ0FBQztBQUV4QixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0Qs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QUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDaEYsSUFBSSxFQUFFLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQyxNQUFNO1FBQ3hELFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakMsVUFBVSxFQUFFLENBQUM7S0FDZCxDQUFDLENBQUM7SUFDSCxJQUFJLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ2xELFdBQVc7UUFDWCxLQUFLO1FBQ0wsZ0JBQWdCLEVBQUUsTUFBTTtLQUN6QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGtDQUFrQyxFQUFFO1FBQ3hFLFVBQVUsRUFBRTtZQUNWLG9CQUFvQixFQUFFLDJDQUEyQztTQUNsRTtRQUNELFNBQVMsRUFBRTtZQUNULDBEQUEwRDtZQUMxRCxzQ0FBc0M7U0FDdkM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlZGVwbG95IGZyb20gJy4uLy4uL2xpYic7XG5cbmZ1bmN0aW9uIG1vY2tGdW5jdGlvbihzdGFjazogY2RrLlN0YWNrLCBpZDogc3RyaW5nKSB7XG4gIHJldHVybiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCBpZCwge1xuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ21vY2snKSxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gIH0pO1xufVxuZnVuY3Rpb24gbW9ja0FsaWFzKHN0YWNrOiBjZGsuU3RhY2spIHtcbiAgcmV0dXJuIG5ldyBsYW1iZGEuQWxpYXMoc3RhY2ssICdBbGlhcycsIHtcbiAgICBhbGlhc05hbWU6ICdteS1hbGlhcycsXG4gICAgdmVyc2lvbjogbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAnVmVyc2lvbicsIHtcbiAgICAgIGxhbWJkYTogbW9ja0Z1bmN0aW9uKHN0YWNrLCAnRnVuY3Rpb24nKSxcbiAgICB9KSxcbiAgfSk7XG59XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xubGV0IGFwcGxpY2F0aW9uOiBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uO1xubGV0IGFsaWFzOiBsYW1iZGEuQWxpYXM7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gIGFsaWFzID0gbW9ja0FsaWFzKHN0YWNrKTtcbn0pO1xuXG5cbnRlc3REZXByZWNhdGVkKCdjdXN0b20gcmVzb3VyY2UgY3JlYXRlZCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBjb25maWcgPSBuZXcgY29kZWRlcGxveS5DdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnQ3VzdG9tQ29uZmlnJywge1xuICAgIHR5cGU6IGNvZGVkZXBsb3kuQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1R5cGUuQ0FOQVJZLFxuICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICBwZXJjZW50YWdlOiA1LFxuICB9KTtcbiAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICBhcHBsaWNhdGlvbixcbiAgICBhbGlhcyxcbiAgICBkZXBsb3ltZW50Q29uZmlnOiBjb25maWcsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTJywge1xuICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdBV1M2NzlmNTNmYWMwMDI0MzBjYjBkYTViNzk4MmJkMjI4NzJEMTY0QzRDJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgQ3JlYXRlOiAne1wic2VydmljZVwiOlwiQ29kZURlcGxveVwiLFwiYWN0aW9uXCI6XCJjcmVhdGVEZXBsb3ltZW50Q29uZmlnXCIsXCJwYXJhbWV0ZXJzXCI6e1wiZGVwbG95bWVudENvbmZpZ05hbWVcIjpcIkN1c3RvbUNvbmZpZy5MYW1iZGFDYW5hcnk1UGVyY2VudDFNaW51dGVzXCIsXCJjb21wdXRlUGxhdGZvcm1cIjpcIkxhbWJkYVwiLFwidHJhZmZpY1JvdXRpbmdDb25maWdcIjp7XCJ0eXBlXCI6XCJUaW1lQmFzZWRDYW5hcnlcIixcInRpbWVCYXNlZENhbmFyeVwiOntcImNhbmFyeUludGVydmFsXCI6XCIxXCIsXCJjYW5hcnlQZXJjZW50YWdlXCI6XCI1XCJ9fX0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiQ3VzdG9tQ29uZmlnLkxhbWJkYUNhbmFyeTVQZXJjZW50MU1pbnV0ZXNcIn19JyxcbiAgICBVcGRhdGU6ICd7XCJzZXJ2aWNlXCI6XCJDb2RlRGVwbG95XCIsXCJhY3Rpb25cIjpcImNyZWF0ZURlcGxveW1lbnRDb25maWdcIixcInBhcmFtZXRlcnNcIjp7XCJkZXBsb3ltZW50Q29uZmlnTmFtZVwiOlwiQ3VzdG9tQ29uZmlnLkxhbWJkYUNhbmFyeTVQZXJjZW50MU1pbnV0ZXNcIixcImNvbXB1dGVQbGF0Zm9ybVwiOlwiTGFtYmRhXCIsXCJ0cmFmZmljUm91dGluZ0NvbmZpZ1wiOntcInR5cGVcIjpcIlRpbWVCYXNlZENhbmFyeVwiLFwidGltZUJhc2VkQ2FuYXJ5XCI6e1wiY2FuYXJ5SW50ZXJ2YWxcIjpcIjFcIixcImNhbmFyeVBlcmNlbnRhZ2VcIjpcIjVcIn19fSxcInBoeXNpY2FsUmVzb3VyY2VJZFwiOntcImlkXCI6XCJDdXN0b21Db25maWcuTGFtYmRhQ2FuYXJ5NVBlcmNlbnQxTWludXRlc1wifX0nLFxuICAgIERlbGV0ZTogJ3tcInNlcnZpY2VcIjpcIkNvZGVEZXBsb3lcIixcImFjdGlvblwiOlwiZGVsZXRlRGVwbG95bWVudENvbmZpZ1wiLFwicGFyYW1ldGVyc1wiOntcImRlcGxveW1lbnRDb25maWdOYW1lXCI6XCJDdXN0b21Db25maWcuTGFtYmRhQ2FuYXJ5NVBlcmNlbnQxTWludXRlc1wifX0nLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdjb2RlZGVwbG95OkNyZWF0ZURlcGxveW1lbnRDb25maWcnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnY29kZWRlcGxveTpEZWxldGVEZXBsb3ltZW50Q29uZmlnJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2N1c3RvbSByZXNvdXJjZSBjcmVhdGVkIHdpdGggc3BlY2lmaWMgbmFtZScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBjb25maWcgPSBuZXcgY29kZWRlcGxveS5DdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnQ3VzdG9tQ29uZmlnJywge1xuICAgIHR5cGU6IGNvZGVkZXBsb3kuQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1R5cGUuQ0FOQVJZLFxuICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICBwZXJjZW50YWdlOiA1LFxuICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiAnTXlEZXBsb3ltZW50Q29uZmlnJyxcbiAgfSk7XG4gIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgYXBwbGljYXRpb24sXG4gICAgYWxpYXMsXG4gICAgZGVwbG95bWVudENvbmZpZzogY29uZmlnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXUycsIHtcbiAgICBDcmVhdGU6ICd7XCJzZXJ2aWNlXCI6XCJDb2RlRGVwbG95XCIsXCJhY3Rpb25cIjpcImNyZWF0ZURlcGxveW1lbnRDb25maWdcIixcInBhcmFtZXRlcnNcIjp7XCJkZXBsb3ltZW50Q29uZmlnTmFtZVwiOlwiTXlEZXBsb3ltZW50Q29uZmlnXCIsXCJjb21wdXRlUGxhdGZvcm1cIjpcIkxhbWJkYVwiLFwidHJhZmZpY1JvdXRpbmdDb25maWdcIjp7XCJ0eXBlXCI6XCJUaW1lQmFzZWRDYW5hcnlcIixcInRpbWVCYXNlZENhbmFyeVwiOntcImNhbmFyeUludGVydmFsXCI6XCIxXCIsXCJjYW5hcnlQZXJjZW50YWdlXCI6XCI1XCJ9fX0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiTXlEZXBsb3ltZW50Q29uZmlnXCJ9fScsXG4gICAgVXBkYXRlOiAne1wic2VydmljZVwiOlwiQ29kZURlcGxveVwiLFwiYWN0aW9uXCI6XCJjcmVhdGVEZXBsb3ltZW50Q29uZmlnXCIsXCJwYXJhbWV0ZXJzXCI6e1wiZGVwbG95bWVudENvbmZpZ05hbWVcIjpcIk15RGVwbG95bWVudENvbmZpZ1wiLFwiY29tcHV0ZVBsYXRmb3JtXCI6XCJMYW1iZGFcIixcInRyYWZmaWNSb3V0aW5nQ29uZmlnXCI6e1widHlwZVwiOlwiVGltZUJhc2VkQ2FuYXJ5XCIsXCJ0aW1lQmFzZWRDYW5hcnlcIjp7XCJjYW5hcnlJbnRlcnZhbFwiOlwiMVwiLFwiY2FuYXJ5UGVyY2VudGFnZVwiOlwiNVwifX19LFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6e1wiaWRcIjpcIk15RGVwbG95bWVudENvbmZpZ1wifX0nLFxuICAgIERlbGV0ZTogJ3tcInNlcnZpY2VcIjpcIkNvZGVEZXBsb3lcIixcImFjdGlvblwiOlwiZGVsZXRlRGVwbG95bWVudENvbmZpZ1wiLFwicGFyYW1ldGVyc1wiOntcImRlcGxveW1lbnRDb25maWdOYW1lXCI6XCJNeURlcGxveW1lbnRDb25maWdcIn19JyxcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2ZhaWwgd2l0aCBtb3JlIHRoYW4gMTAwIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2tXaXRoQXBwID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBuZXcgY29kZWRlcGxveS5DdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnKHN0YWNrV2l0aEFwcCwgJ0N1c3RvbUNvbmZpZycsIHtcbiAgICB0eXBlOiBjb2RlZGVwbG95LkN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdUeXBlLkNBTkFSWSxcbiAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgcGVyY2VudGFnZTogNSxcbiAgICBkZXBsb3ltZW50Q29uZmlnTmFtZTogJ2EnLnJlcGVhdCgxMDEpLFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coYERlcGxveW1lbnQgY29uZmlnIG5hbWU6IFwiJHsnYScucmVwZWF0KDEwMSl9XCIgY2FuIGJlIGEgbWF4IG9mIDEwMCBjaGFyYWN0ZXJzLmApO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCdmYWlsIHdpdGggdW5hbGxvd2VkIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2tXaXRoQXBwID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBuZXcgY29kZWRlcGxveS5DdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnKHN0YWNrV2l0aEFwcCwgJ0N1c3RvbUNvbmZpZycsIHtcbiAgICB0eXBlOiBjb2RlZGVwbG95LkN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdUeXBlLkNBTkFSWSxcbiAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgcGVyY2VudGFnZTogNSxcbiAgICBkZXBsb3ltZW50Q29uZmlnTmFtZTogJ215IG5hbWUnLFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coJ0RlcGxveW1lbnQgY29uZmlnIG5hbWU6IFwibXkgbmFtZVwiIGNhbiBvbmx5IGNvbnRhaW4gbGV0dGVycyAoYS16LCBBLVopLCBudW1iZXJzICgwLTkpLCBwZXJpb2RzICguKSwgdW5kZXJzY29yZXMgKF8pLCArIChwbHVzIHNpZ25zKSwgPSAoZXF1YWxzIHNpZ25zKSwgLCAoY29tbWFzKSwgQCAoYXQgc2lnbnMpLCAtIChtaW51cyBzaWducykuJyk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2NhbiBjcmVhdGUgbGluZWFyIGN1c3RvbSBjb25maWcnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgY29uZmlnID0gbmV3IGNvZGVkZXBsb3kuQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZyhzdGFjaywgJ0N1c3RvbUNvbmZpZycsIHtcbiAgICB0eXBlOiBjb2RlZGVwbG95LkN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdUeXBlLkxJTkVBUixcbiAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgcGVyY2VudGFnZTogNSxcbiAgfSk7XG4gIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgYXBwbGljYXRpb24sXG4gICAgYWxpYXMsXG4gICAgZGVwbG95bWVudENvbmZpZzogY29uZmlnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICBEZXBsb3ltZW50Q29uZmlnTmFtZTogJ0N1c3RvbUNvbmZpZy5MYW1iZGFMaW5lYXI1UGVyY2VudEV2ZXJ5MU1pbnV0ZXMnLFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnY2FuIGNyZWF0ZSBjYW5hcnkgY3VzdG9tIGNvbmZpZycsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBjb25maWcgPSBuZXcgY29kZWRlcGxveS5DdXN0b21MYW1iZGFEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnQ3VzdG9tQ29uZmlnJywge1xuICAgIHR5cGU6IGNvZGVkZXBsb3kuQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZ1R5cGUuQ0FOQVJZLFxuICAgIGludGVydmFsOiBjZGsuRHVyYXRpb24ubWludXRlcygxKSxcbiAgICBwZXJjZW50YWdlOiA1LFxuICB9KTtcbiAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICBhcHBsaWNhdGlvbixcbiAgICBhbGlhcyxcbiAgICBkZXBsb3ltZW50Q29uZmlnOiBjb25maWcsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgIERlcGxveW1lbnRDb25maWdOYW1lOiAnQ3VzdG9tQ29uZmlnLkxhbWJkYUNhbmFyeTVQZXJjZW50MU1pbnV0ZXMnLFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnZGVwZW5kZW5jeSBvbiB0aGUgY29uZmlnIGV4aXN0cyB0byBlbnN1cmUgb3JkZXJpbmcnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgY29uZmlnID0gbmV3IGNvZGVkZXBsb3kuQ3VzdG9tTGFtYmRhRGVwbG95bWVudENvbmZpZyhzdGFjaywgJ0N1c3RvbUNvbmZpZycsIHtcbiAgICB0eXBlOiBjb2RlZGVwbG95LkN1c3RvbUxhbWJkYURlcGxveW1lbnRDb25maWdUeXBlLkNBTkFSWSxcbiAgICBpbnRlcnZhbDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgcGVyY2VudGFnZTogNSxcbiAgfSk7XG4gIG5ldyBjb2RlZGVwbG95LkxhbWJkYURlcGxveW1lbnRHcm91cChzdGFjaywgJ015REcnLCB7XG4gICAgYXBwbGljYXRpb24sXG4gICAgYWxpYXMsXG4gICAgZGVwbG95bWVudENvbmZpZzogY29uZmlnLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIERlcGxveW1lbnRDb25maWdOYW1lOiAnQ3VzdG9tQ29uZmlnLkxhbWJkYUNhbmFyeTVQZXJjZW50MU1pbnV0ZXMnLFxuICAgIH0sXG4gICAgRGVwZW5kc09uOiBbXG4gICAgICAnQ3VzdG9tQ29uZmlnRGVwbG95bWVudENvbmZpZ0N1c3RvbVJlc291cmNlUG9saWN5MDQyNkI2ODQnLFxuICAgICAgJ0N1c3RvbUNvbmZpZ0RlcGxveW1lbnRDb25maWdFOUUxRjM4NCcsXG4gICAgXSxcbiAgfSk7XG59KTtcbiJdfQ==