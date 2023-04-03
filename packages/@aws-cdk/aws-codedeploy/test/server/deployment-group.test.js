"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const lbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const cdk = require("@aws-cdk/core");
const codedeploy = require("../../lib");
/* eslint-disable quote-props */
describe('CodeDeploy Server Deployment Group', () => {
    test('can be created by explicitly passing an Application', () => {
        const stack = new cdk.Stack();
        const application = new codedeploy.ServerApplication(stack, 'MyApp');
        new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
            application,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'ApplicationName': {
                'Ref': 'MyApp3CE31C26',
            },
        });
    });
    test('can create a deployment group with no alarms', () => {
        const stack = new cdk.Stack();
        stack.node.setContext('@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup', true);
        const application = new codedeploy.ServerApplication(stack, 'MyApp');
        new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
            application,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            AlarmConfiguration: {
                Enabled: false,
                Alarms: assertions_1.Match.absent(),
            },
        });
    });
    test('creating an application with physical name if needed', () => {
        const stack = new cdk.Stack(undefined, undefined, { env: { account: '12345', region: 'us-test-1' } });
        const stack2 = new cdk.Stack(undefined, undefined, { env: { account: '12346', region: 'us-test-2' } });
        const serverDeploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });
        new cdk.CfnOutput(stack2, 'Output', {
            value: serverDeploymentGroup.application.applicationName,
        });
        assertions_1.Template.fromStack(stack2).hasOutput('Output', {
            Value: 'defaultmydgapplication78dba0bb0c7580b32033',
        });
    });
    test('can be imported', () => {
        const stack = new cdk.Stack();
        const application = codedeploy.ServerApplication.fromServerApplicationName(stack, 'MyApp', 'MyApp');
        const deploymentGroup = codedeploy.ServerDeploymentGroup.fromServerDeploymentGroupAttributes(stack, 'MyDG', {
            application,
            deploymentGroupName: 'MyDG',
        });
        expect(deploymentGroup).not.toEqual(undefined);
    });
    test('uses good linux install agent script', () => {
        const stack = new cdk.Stack();
        const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoScalingGroups: [asg],
            installAgent: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            'UserData': {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '#!/bin/bash\nset +e\nPKG_CMD=`which yum 2>/dev/null`\nset -e\nif [ -z "$PKG_CMD" ]; then\nPKG_CMD=apt-get\nelse\nPKG_CMD=yum\nfi\n$PKG_CMD update -y\nset +e\n$PKG_CMD install -y ruby2.0\nRUBY2_INSTALL=$?\nset -e\nif [ $RUBY2_INSTALL -ne 0 ]; then\n$PKG_CMD install -y ruby\nfi\nAWS_CLI_PACKAGE_NAME=awscli\nif [ "$PKG_CMD" = "yum" ]; then\nAWS_CLI_PACKAGE_NAME=aws-cli\nfi\n$PKG_CMD install -y $AWS_CLI_PACKAGE_NAME\nTMP_DIR=`mktemp -d`\ncd $TMP_DIR\naws s3 cp s3://aws-codedeploy-',
                            {
                                'Ref': 'AWS::Region',
                            },
                            '/latest/install . --region ',
                            {
                                'Ref': 'AWS::Region',
                            },
                            '\nchmod +x ./install\n./install auto\nrm -fr $TMP_DIR',
                        ],
                    ],
                },
            },
        });
    });
    test('uses good windows install agent script', () => {
        const stack = new cdk.Stack();
        const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
            machineImage: new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE, {}),
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoScalingGroups: [asg],
            installAgent: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', {
            'UserData': {
                'Fn::Base64': {
                    'Fn::Join': [
                        '',
                        [
                            '<powershell>Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName\naws s3 cp s3://aws-codedeploy-',
                            {
                                'Ref': 'AWS::Region',
                            },
                            '/latest/codedeploy-agent.msi $TEMPDIR\\codedeploy-agent.msi\ncd $TEMPDIR\n.\\codedeploy-agent.msi /quiet /l c:\\temp\\host-agent-install-log.txt</powershell>',
                        ],
                    ],
                },
            },
        });
    });
    test('created with ASGs contains the ASG names', () => {
        const stack = new cdk.Stack();
        const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoScalingGroups: [asg],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoScalingGroups': [
                {
                    'Ref': 'ASG46ED3070',
                },
            ],
        });
    });
    test('created without ASGs but adding them later contains the ASG names', () => {
        const stack = new cdk.Stack();
        const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.STANDARD3, ec2.InstanceSize.SMALL),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
        deploymentGroup.addAutoScalingGroup(asg);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoScalingGroups': [
                {
                    'Ref': 'ASG46ED3070',
                },
            ],
        });
    });
    test('can be created with an ALB Target Group as the load balancer', () => {
        const stack = new cdk.Stack();
        const alb = new lbv2.ApplicationLoadBalancer(stack, 'ALB', {
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        const listener = alb.addListener('Listener', { protocol: lbv2.ApplicationProtocol.HTTP });
        const targetGroup = listener.addTargets('Fleet', { protocol: lbv2.ApplicationProtocol.HTTP });
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            loadBalancer: codedeploy.LoadBalancer.application(targetGroup),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'LoadBalancerInfo': {
                'TargetGroupInfoList': [
                    {
                        'Name': {
                            'Fn::GetAtt': [
                                'ALBListenerFleetGroup008CEEE4',
                                'TargetGroupName',
                            ],
                        },
                    },
                ],
            },
            'DeploymentStyle': {
                'DeploymentOption': 'WITH_TRAFFIC_CONTROL',
            },
        });
    });
    test('can be created with an NLB Target Group as the load balancer', () => {
        const stack = new cdk.Stack();
        const nlb = new lbv2.NetworkLoadBalancer(stack, 'NLB', {
            vpc: new ec2.Vpc(stack, 'VPC'),
        });
        const listener = nlb.addListener('Listener', { port: 80 });
        const targetGroup = listener.addTargets('Fleet', { port: 80 });
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            loadBalancer: codedeploy.LoadBalancer.network(targetGroup),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'LoadBalancerInfo': {
                'TargetGroupInfoList': [
                    {
                        'Name': {
                            'Fn::GetAtt': [
                                'NLBListenerFleetGroupB882EC86',
                                'TargetGroupName',
                            ],
                        },
                    },
                ],
            },
            'DeploymentStyle': {
                'DeploymentOption': 'WITH_TRAFFIC_CONTROL',
            },
        });
    });
    test('can be created with a single EC2 instance tag set with a single or no value', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            ec2InstanceTags: new codedeploy.InstanceTagSet({
                'some-key': ['some-value'],
                'other-key': [],
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'Ec2TagSet': {
                'Ec2TagSetList': [
                    {
                        'Ec2TagGroup': [
                            {
                                'Key': 'some-key',
                                'Value': 'some-value',
                                'Type': 'KEY_AND_VALUE',
                            },
                            {
                                'Key': 'other-key',
                                'Type': 'KEY_ONLY',
                            },
                        ],
                    },
                ],
            },
        });
    });
    test('can be created with two on-premise instance tag sets with multiple values or without a key', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            onPremiseInstanceTags: new codedeploy.InstanceTagSet({
                'some-key': ['some-value', 'another-value'],
            }, {
                '': ['keyless-value'],
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'OnPremisesTagSet': {
                'OnPremisesTagSetList': [
                    {
                        'OnPremisesTagGroup': [
                            {
                                'Key': 'some-key',
                                'Value': 'some-value',
                                'Type': 'KEY_AND_VALUE',
                            },
                            {
                                'Key': 'some-key',
                                'Value': 'another-value',
                                'Type': 'KEY_AND_VALUE',
                            },
                        ],
                    },
                    {
                        'OnPremisesTagGroup': [
                            {
                                'Value': 'keyless-value',
                                'Type': 'VALUE_ONLY',
                            },
                        ],
                    },
                ],
            },
        });
    });
    test('cannot be created with an instance tag set containing a keyless, valueless filter', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
                onPremiseInstanceTags: new codedeploy.InstanceTagSet({
                    '': [],
                }),
            });
        }).toThrow();
    });
    test('cannot be created with an instance tag set containing 4 instance tag groups', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
                onPremiseInstanceTags: new codedeploy.InstanceTagSet({}, {}, {}, {}),
            });
        }).toThrow(/3/);
    });
    test('can have alarms added to it after being created', () => {
        const stack = new cdk.Stack();
        const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
            metric: new cloudwatch.Metric({
                metricName: 'Errors',
                namespace: 'my.namespace',
            }),
            threshold: 1,
            evaluationPeriods: 1,
        });
        const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
        deploymentGroup.addAlarm(alarm);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AlarmConfiguration': {
                'Alarms': [
                    {
                        'Name': {
                            'Ref': 'Alarm1F9009D71',
                        },
                    },
                ],
                'Enabled': true,
            },
        });
    });
    test('only automatically rolls back failed deployments by default', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoRollbackConfiguration': {
                'Enabled': true,
                'Events': [
                    'DEPLOYMENT_FAILURE',
                ],
            },
        });
    });
    test('rolls back alarmed deployments if at least one alarm has been added', () => {
        const stack = new cdk.Stack();
        const alarm = new cloudwatch.Alarm(stack, 'Alarm1', {
            metric: new cloudwatch.Metric({
                metricName: 'Errors',
                namespace: 'my.namespace',
            }),
            threshold: 1,
            evaluationPeriods: 1,
        });
        const deploymentGroup = new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoRollback: {
                failedDeployment: false,
            },
        });
        deploymentGroup.addAlarm(alarm);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoRollbackConfiguration': {
                'Enabled': true,
                'Events': [
                    'DEPLOYMENT_STOP_ON_ALARM',
                ],
            },
        });
    });
    test('setting to roll back on alarms without providing any results in an exception', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoRollback: {
                deploymentInAlarm: true,
            },
        });
        expect(() => app.synth()).toThrow(/deploymentInAlarm/);
    });
    test('disable automatic rollback', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoRollback: {
                deploymentInAlarm: false,
                failedDeployment: false,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoRollbackConfiguration': {
                'Enabled': false,
            },
        });
    });
    test('disable automatic rollback when all options are false', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            autoRollback: {
                deploymentInAlarm: false,
                failedDeployment: false,
                stoppedDeployment: false,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'AutoRollbackConfiguration': {
                'Enabled': false,
            },
        });
    });
    test('can be used with an imported ALB Target Group as the load balancer', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentGroup(stack, 'DeploymentGroup', {
            loadBalancer: codedeploy.LoadBalancer.application(lbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedAlbTg', {
                targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myAlbTargetGroup/73e2d6bc24d8a067',
            })),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
            'LoadBalancerInfo': {
                'TargetGroupInfoList': [
                    {
                        'Name': 'myAlbTargetGroup',
                    },
                ],
            },
            'DeploymentStyle': {
                'DeploymentOption': 'WITH_TRAFFIC_CONTROL',
            },
        });
    });
    test('fail with more than 100 characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'a'.repeat(101),
        });
        expect(() => app.synth()).toThrow(`Deployment group name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
    });
    test('fail with unallowed characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
            deploymentGroupName: 'my name',
        });
        expect(() => app.synth()).toThrow('Deployment group name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
    });
    describe('deploymentGroup from ARN in different account and region', () => {
        let stack;
        let application;
        let group;
        const account = '222222222222';
        const region = 'theregion-1';
        beforeEach(() => {
            stack = new cdk.Stack(undefined, 'Stack', { env: { account: '111111111111', region: 'blabla-1' } });
            application = codedeploy.ServerApplication.fromServerApplicationArn(stack, 'Application', `arn:aws:codedeploy:${region}:${account}:application:MyApplication`);
            group = codedeploy.ServerDeploymentGroup.fromServerDeploymentGroupAttributes(stack, 'Group', {
                application,
                deploymentGroupName: 'DeploymentGroup',
            });
        });
        test('knows its account and region', () => {
            // THEN
            expect(application.env).toEqual(expect.objectContaining({ account, region }));
            expect(group.env).toEqual(expect.objectContaining({ account, region }));
        });
        test('references the predefined DeploymentGroupConfig in the right region', () => {
            expect(group.deploymentConfig.deploymentConfigArn).toEqual(expect.stringContaining(`:codedeploy:${region}:${account}:deploymentconfig:CodeDeployDefault.OneAtATime`));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1ncm91cC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwbG95bWVudC1ncm91cC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdEQUF3RDtBQUN4RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLDREQUE0RDtBQUM1RCxxQ0FBcUM7QUFDckMsd0NBQXdDO0FBRXhDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO0lBQ2xELElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsTUFBTSxXQUFXLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JFLElBQUksVUFBVSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDbEQsV0FBVztTQUNaLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtDQUFrQyxFQUFFO1lBQ2xGLGlCQUFpQixFQUFFO2dCQUNqQixLQUFLLEVBQUUsZUFBZTthQUN2QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtRQUN4RCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5REFBeUQsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUV2RixNQUFNLFdBQVcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckUsSUFBSSxVQUFVLENBQUMs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LENBQUMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUVBQXFFLEVBQUUsR0FBRyxFQUFFO1lBQy9FLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUNoRixlQUFlLE1BQU0sSUFBSSxPQUFPLGdEQUFnRCxDQUNqRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZWRlcGxveSBmcm9tICcuLi8uLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnQ29kZURlcGxveSBTZXJ2ZXIgRGVwbG95bWVudCBHcm91cCcsICgpID0+IHtcbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgYnkgZXhwbGljaXRseSBwYXNzaW5nIGFuIEFwcGxpY2F0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5TZXJ2ZXJBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgJ0FwcGxpY2F0aW9uTmFtZSc6IHtcbiAgICAgICAgJ1JlZic6ICdNeUFwcDNDRTMxQzI2JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjcmVhdGUgYSBkZXBsb3ltZW50IGdyb3VwIHdpdGggbm8gYWxhcm1zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLWNvZGVkZXBsb3k6cmVtb3ZlQWxhcm1zRnJvbURlcGxveW1lbnRHcm91cCcsIHRydWUpO1xuXG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBuZXcgY29kZWRlcGxveS5TZXJ2ZXJBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgQWxhcm1Db25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBBbGFybXM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRpbmcgYW4gYXBwbGljYXRpb24gd2l0aCBwaHlzaWNhbCBuYW1lIGlmIG5lZWRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgZW52OiB7IGFjY291bnQ6ICcxMjM0NScsIHJlZ2lvbjogJ3VzLXRlc3QtMScgfSB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDYnLCByZWdpb246ICd1cy10ZXN0LTInIH0gfSk7XG4gICAgY29uc3Qgc2VydmVyRGVwbG95bWVudEdyb3VwID0gbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6IGNkay5QaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVELFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IHNlcnZlckRlcGxveW1lbnRHcm91cC5hcHBsaWNhdGlvbi5hcHBsaWNhdGlvbk5hbWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS5oYXNPdXRwdXQoJ091dHB1dCcsIHtcbiAgICAgIFZhbHVlOiAnZGVmYXVsdG15ZGdhcHBsaWNhdGlvbjc4ZGJhMGJiMGM3NTgwYjMyMDMzJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGltcG9ydGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBjb2RlZGVwbG95LlNlcnZlckFwcGxpY2F0aW9uLmZyb21TZXJ2ZXJBcHBsaWNhdGlvbk5hbWUoc3RhY2ssICdNeUFwcCcsICdNeUFwcCcpO1xuICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cCA9IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwLmZyb21TZXJ2ZXJEZXBsb3ltZW50R3JvdXBBdHRyaWJ1dGVzKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGFwcGxpY2F0aW9uLFxuICAgICAgZGVwbG95bWVudEdyb3VwTmFtZTogJ015REcnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGRlcGxveW1lbnRHcm91cCkubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcyBnb29kIGxpbnV4IGluc3RhbGwgYWdlbnQgc2NyaXB0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBU0cnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuU1RBTkRBUkQzLCBlYzIuSW5zdGFuY2VTaXplLlNNQUxMKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgICB2cGM6IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyksXG4gICAgfSk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwczogW2FzZ10sXG4gICAgICBpbnN0YWxsQWdlbnQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGF1bmNoQ29uZmlndXJhdGlvbicsIHtcbiAgICAgICdVc2VyRGF0YSc6IHtcbiAgICAgICAgJ0ZuOjpCYXNlNjQnOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICcjIS9iaW4vYmFzaFxcbnNldCArZVxcblBLR19DTUQ9YHdoaWNoIHl1bSAyPi9kZXYvbnVsbGBcXG5zZXQgLWVcXG5pZiBbIC16IFwiJFBLR19DTURcIiBdOyB0aGVuXFxuUEtHX0NNRD1hcHQtZ2V0XFxuZWxzZVxcblBLR19DTUQ9eXVtXFxuZmlcXG4kUEtHX0NNRCB1cGRhdGUgLXlcXG5zZXQgK2VcXG4kUEtHX0NNRCBpbnN0YWxsIC15IHJ1YnkyLjBcXG5SVUJZMl9JTlNUQUxMPSQ/XFxuc2V0IC1lXFxuaWYgWyAkUlVCWTJfSU5TVEFMTCAtbmUgMCBdOyB0aGVuXFxuJFBLR19DTUQgaW5zdGFsbCAteSBydWJ5XFxuZmlcXG5BV1NfQ0xJX1BBQ0tBR0VfTkFNRT1hd3NjbGlcXG5pZiBbIFwiJFBLR19DTURcIiA9IFwieXVtXCIgXTsgdGhlblxcbkFXU19DTElfUEFDS0FHRV9OQU1FPWF3cy1jbGlcXG5maVxcbiRQS0dfQ01EIGluc3RhbGwgLXkgJEFXU19DTElfUEFDS0FHRV9OQU1FXFxuVE1QX0RJUj1gbWt0ZW1wIC1kYFxcbmNkICRUTVBfRElSXFxuYXdzIHMzIGNwIHMzOi8vYXdzLWNvZGVkZXBsb3ktJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnL2xhdGVzdC9pbnN0YWxsIC4gLS1yZWdpb24gJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnXFxuY2htb2QgK3ggLi9pbnN0YWxsXFxuLi9pbnN0YWxsIGF1dG9cXG5ybSAtZnIgJFRNUF9ESVInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcyBnb29kIHdpbmRvd3MgaW5zdGFsbCBhZ2VudCBzY3JpcHQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5TVEFOREFSRDMsIGVjMi5JbnN0YW5jZVNpemUuU01BTEwpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLldpbmRvd3NJbWFnZShlYzIuV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxOV9FTkdMSVNIX0ZVTExfQkFTRSwge30pLFxuICAgICAgdnBjOiBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpLFxuICAgIH0pO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cHM6IFthc2ddLFxuICAgICAgaW5zdGFsbEFnZW50OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7XG4gICAgICAnVXNlckRhdGEnOiB7XG4gICAgICAgICdGbjo6QmFzZTY0Jzoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnPHBvd2Vyc2hlbGw+U2V0LVZhcmlhYmxlIC1OYW1lIFRFTVBESVIgLVZhbHVlIChOZXctVGVtcG9yYXJ5RmlsZSkuRGlyZWN0b3J5TmFtZVxcbmF3cyBzMyBjcCBzMzovL2F3cy1jb2RlZGVwbG95LScsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJy9sYXRlc3QvY29kZWRlcGxveS1hZ2VudC5tc2kgJFRFTVBESVJcXFxcY29kZWRlcGxveS1hZ2VudC5tc2lcXG5jZCAkVEVNUERJUlxcbi5cXFxcY29kZWRlcGxveS1hZ2VudC5tc2kgL3F1aWV0IC9sIGM6XFxcXHRlbXBcXFxcaG9zdC1hZ2VudC1pbnN0YWxsLWxvZy50eHQ8L3Bvd2Vyc2hlbGw+JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZWQgd2l0aCBBU0dzIGNvbnRhaW5zIHRoZSBBU0cgbmFtZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5TVEFOREFSRDMsIGVjMi5JbnN0YW5jZVNpemUuU01BTEwpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYzogbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKSxcbiAgICB9KTtcblxuICAgIG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXBzOiBbYXNnXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgICdBdXRvU2NhbGluZ0dyb3Vwcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdSZWYnOiAnQVNHNDZFRDMwNzAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlZCB3aXRob3V0IEFTR3MgYnV0IGFkZGluZyB0aGVtIGxhdGVyIGNvbnRhaW5zIHRoZSBBU0cgbmFtZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FTRycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5TVEFOREFSRDMsIGVjMi5JbnN0YW5jZVNpemUuU01BTEwpLFxuICAgICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICAgIHZwYzogbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cCA9IG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcpO1xuICAgIGRlcGxveW1lbnRHcm91cC5hZGRBdXRvU2NhbGluZ0dyb3VwKGFzZyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICAnQXV0b1NjYWxpbmdHcm91cHMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnUmVmJzogJ0FTRzQ2RUQzMDcwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggYW4gQUxCIFRhcmdldCBHcm91cCBhcyB0aGUgbG9hZCBiYWxhbmNlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGFsYiA9IG5ldyBsYnYyLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKHN0YWNrLCAnQUxCJywge1xuICAgICAgdnBjOiBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpLFxuICAgIH0pO1xuICAgIGNvbnN0IGxpc3RlbmVyID0gYWxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcHJvdG9jb2w6IGxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQIH0pO1xuICAgIGNvbnN0IHRhcmdldEdyb3VwID0gbGlzdGVuZXIuYWRkVGFyZ2V0cygnRmxlZXQnLCB7IHByb3RvY29sOiBsYnYyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCB9KTtcblxuICAgIG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIGxvYWRCYWxhbmNlcjogY29kZWRlcGxveS5Mb2FkQmFsYW5jZXIuYXBwbGljYXRpb24odGFyZ2V0R3JvdXApLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgJ0xvYWRCYWxhbmNlckluZm8nOiB7XG4gICAgICAgICdUYXJnZXRHcm91cEluZm9MaXN0JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQUxCTGlzdGVuZXJGbGVldEdyb3VwMDA4Q0VFRTQnLFxuICAgICAgICAgICAgICAgICdUYXJnZXRHcm91cE5hbWUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdEZXBsb3ltZW50U3R5bGUnOiB7XG4gICAgICAgICdEZXBsb3ltZW50T3B0aW9uJzogJ1dJVEhfVFJBRkZJQ19DT05UUk9MJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBjcmVhdGVkIHdpdGggYW4gTkxCIFRhcmdldCBHcm91cCBhcyB0aGUgbG9hZCBiYWxhbmNlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IG5sYiA9IG5ldyBsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdOTEInLCB7XG4gICAgICB2cGM6IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJyksXG4gICAgfSk7XG4gICAgY29uc3QgbGlzdGVuZXIgPSBubGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywgeyBwb3J0OiA4MCB9KTtcbiAgICBjb25zdCB0YXJnZXRHcm91cCA9IGxpc3RlbmVyLmFkZFRhcmdldHMoJ0ZsZWV0JywgeyBwb3J0OiA4MCB9KTtcblxuICAgIG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIGxvYWRCYWxhbmNlcjogY29kZWRlcGxveS5Mb2FkQmFsYW5jZXIubmV0d29yayh0YXJnZXRHcm91cCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICAnTG9hZEJhbGFuY2VySW5mbyc6IHtcbiAgICAgICAgJ1RhcmdldEdyb3VwSW5mb0xpc3QnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdOTEJMaXN0ZW5lckZsZWV0R3JvdXBCODgyRUM4NicsXG4gICAgICAgICAgICAgICAgJ1RhcmdldEdyb3VwTmFtZScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ0RlcGxveW1lbnRTdHlsZSc6IHtcbiAgICAgICAgJ0RlcGxveW1lbnRPcHRpb24nOiAnV0lUSF9UUkFGRklDX0NPTlRST0wnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCBhIHNpbmdsZSBFQzIgaW5zdGFuY2UgdGFnIHNldCB3aXRoIGEgc2luZ2xlIG9yIG5vIHZhbHVlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJywge1xuICAgICAgZWMySW5zdGFuY2VUYWdzOiBuZXcgY29kZWRlcGxveS5JbnN0YW5jZVRhZ1NldChcbiAgICAgICAge1xuICAgICAgICAgICdzb21lLWtleSc6IFsnc29tZS12YWx1ZSddLFxuICAgICAgICAgICdvdGhlci1rZXknOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICAnRWMyVGFnU2V0Jzoge1xuICAgICAgICAnRWMyVGFnU2V0TGlzdCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRWMyVGFnR3JvdXAnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnS2V5JzogJ3NvbWUta2V5JyxcbiAgICAgICAgICAgICAgICAnVmFsdWUnOiAnc29tZS12YWx1ZScsXG4gICAgICAgICAgICAgICAgJ1R5cGUnOiAnS0VZX0FORF9WQUxVRScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnS2V5JzogJ290aGVyLWtleScsXG4gICAgICAgICAgICAgICAgJ1R5cGUnOiAnS0VZX09OTFknLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgd2l0aCB0d28gb24tcHJlbWlzZSBpbnN0YW5jZSB0YWcgc2V0cyB3aXRoIG11bHRpcGxlIHZhbHVlcyBvciB3aXRob3V0IGEga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJywge1xuICAgICAgb25QcmVtaXNlSW5zdGFuY2VUYWdzOiBuZXcgY29kZWRlcGxveS5JbnN0YW5jZVRhZ1NldChcbiAgICAgICAge1xuICAgICAgICAgICdzb21lLWtleSc6IFsnc29tZS12YWx1ZScsICdhbm90aGVyLXZhbHVlJ10sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnJzogWydrZXlsZXNzLXZhbHVlJ10sXG4gICAgICAgIH0sXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgJ09uUHJlbWlzZXNUYWdTZXQnOiB7XG4gICAgICAgICdPblByZW1pc2VzVGFnU2V0TGlzdCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnT25QcmVtaXNlc1RhZ0dyb3VwJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0tleSc6ICdzb21lLWtleScsXG4gICAgICAgICAgICAgICAgJ1ZhbHVlJzogJ3NvbWUtdmFsdWUnLFxuICAgICAgICAgICAgICAgICdUeXBlJzogJ0tFWV9BTkRfVkFMVUUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0tleSc6ICdzb21lLWtleScsXG4gICAgICAgICAgICAgICAgJ1ZhbHVlJzogJ2Fub3RoZXItdmFsdWUnLFxuICAgICAgICAgICAgICAgICdUeXBlJzogJ0tFWV9BTkRfVkFMVUUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdPblByZW1pc2VzVGFnR3JvdXAnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnVmFsdWUnOiAna2V5bGVzcy12YWx1ZScsXG4gICAgICAgICAgICAgICAgJ1R5cGUnOiAnVkFMVUVfT05MWScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgYmUgY3JlYXRlZCB3aXRoIGFuIGluc3RhbmNlIHRhZyBzZXQgY29udGFpbmluZyBhIGtleWxlc3MsIHZhbHVlbGVzcyBmaWx0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJywge1xuICAgICAgICBvblByZW1pc2VJbnN0YW5jZVRhZ3M6IG5ldyBjb2RlZGVwbG95Lkluc3RhbmNlVGFnU2V0KHtcbiAgICAgICAgICAnJzogW10sXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdjYW5ub3QgYmUgY3JlYXRlZCB3aXRoIGFuIGluc3RhbmNlIHRhZyBzZXQgY29udGFpbmluZyA0IGluc3RhbmNlIHRhZyBncm91cHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJywge1xuICAgICAgICBvblByZW1pc2VJbnN0YW5jZVRhZ3M6IG5ldyBjb2RlZGVwbG95Lkluc3RhbmNlVGFnU2V0KHt9LCB7fSwge30sIHt9KSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coLzMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGhhdmUgYWxhcm1zIGFkZGVkIHRvIGl0IGFmdGVyIGJlaW5nIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBhbGFybSA9IG5ldyBjbG91ZHdhdGNoLkFsYXJtKHN0YWNrLCAnQWxhcm0xJywge1xuICAgICAgbWV0cmljOiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgICBtZXRyaWNOYW1lOiAnRXJyb3JzJyxcbiAgICAgICAgbmFtZXNwYWNlOiAnbXkubmFtZXNwYWNlJyxcbiAgICAgIH0pLFxuICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgZXZhbHVhdGlvblBlcmlvZHM6IDEsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXBsb3ltZW50R3JvdXAgPSBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdEZXBsb3ltZW50R3JvdXAnKTtcbiAgICBkZXBsb3ltZW50R3JvdXAuYWRkQWxhcm0oYWxhcm0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgJ0FsYXJtQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgJ0FsYXJtcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6IHtcbiAgICAgICAgICAgICAgJ1JlZic6ICdBbGFybTFGOTAwOUQ3MScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdFbmFibGVkJzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29ubHkgYXV0b21hdGljYWxseSByb2xscyBiYWNrIGZhaWxlZCBkZXBsb3ltZW50cyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnRGVwbG95bWVudEdyb3VwJyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICAnQXV0b1JvbGxiYWNrQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgJ0VuYWJsZWQnOiB0cnVlLFxuICAgICAgICAnRXZlbnRzJzogW1xuICAgICAgICAgICdERVBMT1lNRU5UX0ZBSUxVUkUnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sbHMgYmFjayBhbGFybWVkIGRlcGxveW1lbnRzIGlmIGF0IGxlYXN0IG9uZSBhbGFybSBoYXMgYmVlbiBhZGRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGFsYXJtID0gbmV3IGNsb3Vkd2F0Y2guQWxhcm0oc3RhY2ssICdBbGFybTEnLCB7XG4gICAgICBtZXRyaWM6IG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICAgIG1ldHJpY05hbWU6ICdFcnJvcnMnLFxuICAgICAgICBuYW1lc3BhY2U6ICdteS5uYW1lc3BhY2UnLFxuICAgICAgfSksXG4gICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICBldmFsdWF0aW9uUGVyaW9kczogMSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlcGxveW1lbnRHcm91cCA9IG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBmYWlsZWREZXBsb3ltZW50OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZGVwbG95bWVudEdyb3VwLmFkZEFsYXJtKGFsYXJtKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgICdBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAnRW5hYmxlZCc6IHRydWUsXG4gICAgICAgICdFdmVudHMnOiBbXG4gICAgICAgICAgJ0RFUExPWU1FTlRfU1RPUF9PTl9BTEFSTScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzZXR0aW5nIHRvIHJvbGwgYmFjayBvbiBhbGFybXMgd2l0aG91dCBwcm92aWRpbmcgYW55IHJlc3VsdHMgaW4gYW4gZXhjZXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBhdXRvUm9sbGJhY2s6IHtcbiAgICAgICAgZGVwbG95bWVudEluQWxhcm06IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9kZXBsb3ltZW50SW5BbGFybS8pO1xuICB9KTtcblxuICB0ZXN0KCdkaXNhYmxlIGF1dG9tYXRpYyByb2xsYmFjaycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRHcm91cChzdGFjaywgJ0RlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgIGF1dG9Sb2xsYmFjazoge1xuICAgICAgICBkZXBsb3ltZW50SW5BbGFybTogZmFsc2UsXG4gICAgICAgIGZhaWxlZERlcGxveW1lbnQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgICdBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAnRW5hYmxlZCc6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZSBhdXRvbWF0aWMgcm9sbGJhY2sgd2hlbiBhbGwgb3B0aW9ucyBhcmUgZmFsc2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBhdXRvUm9sbGJhY2s6IHtcbiAgICAgICAgZGVwbG95bWVudEluQWxhcm06IGZhbHNlLFxuICAgICAgICBmYWlsZWREZXBsb3ltZW50OiBmYWxzZSxcbiAgICAgICAgc3RvcHBlZERlcGxveW1lbnQ6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRHcm91cCcsIHtcbiAgICAgICdBdXRvUm9sbGJhY2tDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAnRW5hYmxlZCc6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cblxuICB0ZXN0KCdjYW4gYmUgdXNlZCB3aXRoIGFuIGltcG9ydGVkIEFMQiBUYXJnZXQgR3JvdXAgYXMgdGhlIGxvYWQgYmFsYW5jZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdEZXBsb3ltZW50R3JvdXAnLCB7XG4gICAgICBsb2FkQmFsYW5jZXI6IGNvZGVkZXBsb3kuTG9hZEJhbGFuY2VyLmFwcGxpY2F0aW9uKFxuICAgICAgICBsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAuZnJvbVRhcmdldEdyb3VwQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkQWxiVGcnLCB7XG4gICAgICAgICAgdGFyZ2V0R3JvdXBBcm46ICdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6dGFyZ2V0Z3JvdXAvbXlBbGJUYXJnZXRHcm91cC83M2UyZDZiYzI0ZDhhMDY3JyxcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6RGVwbG95bWVudEdyb3VwJywge1xuICAgICAgJ0xvYWRCYWxhbmNlckluZm8nOiB7XG4gICAgICAgICdUYXJnZXRHcm91cEluZm9MaXN0JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ215QWxiVGFyZ2V0R3JvdXAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJ0RlcGxveW1lbnRTdHlsZSc6IHtcbiAgICAgICAgJ0RlcGxveW1lbnRPcHRpb24nOiAnV0lUSF9UUkFGRklDX0NPTlRST0wnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCB3aXRoIG1vcmUgdGhhbiAxMDAgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudEdyb3VwKHN0YWNrLCAnTXlERycsIHtcbiAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdhJy5yZXBlYXQoMTAxKSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdyhgRGVwbG95bWVudCBncm91cCBuYW1lOiBcIiR7J2EnLnJlcGVhdCgxMDEpfVwiIGNhbiBiZSBhIG1heCBvZiAxMDAgY2hhcmFjdGVycy5gKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCB3aXRoIHVuYWxsb3dlZCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAoc3RhY2ssICdNeURHJywge1xuXG4gICAgICBkZXBsb3ltZW50R3JvdXBOYW1lOiAnbXkgbmFtZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coJ0RlcGxveW1lbnQgZ3JvdXAgbmFtZTogXCJteSBuYW1lXCIgY2FuIG9ubHkgY29udGFpbiBsZXR0ZXJzIChhLXosIEEtWiksIG51bWJlcnMgKDAtOSksIHBlcmlvZHMgKC4pLCB1bmRlcnNjb3JlcyAoXyksICsgKHBsdXMgc2lnbnMpLCA9IChlcXVhbHMgc2lnbnMpLCAsIChjb21tYXMpLCBAIChhdCBzaWducyksIC0gKG1pbnVzIHNpZ25zKS4nKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlcGxveW1lbnRHcm91cCBmcm9tIEFSTiBpbiBkaWZmZXJlbnQgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICAgIGxldCBhcHBsaWNhdGlvbjogY29kZWRlcGxveS5JU2VydmVyQXBwbGljYXRpb247XG4gICAgbGV0IGdyb3VwOiBjb2RlZGVwbG95LklTZXJ2ZXJEZXBsb3ltZW50R3JvdXA7XG5cbiAgICBjb25zdCBhY2NvdW50ID0gJzIyMjIyMjIyMjIyMic7XG4gICAgY29uc3QgcmVnaW9uID0gJ3RoZXJlZ2lvbi0xJztcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1N0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScsIHJlZ2lvbjogJ2JsYWJsYS0xJyB9IH0pO1xuXG4gICAgICBhcHBsaWNhdGlvbiA9IGNvZGVkZXBsb3kuU2VydmVyQXBwbGljYXRpb24uZnJvbVNlcnZlckFwcGxpY2F0aW9uQXJuKHN0YWNrLCAnQXBwbGljYXRpb24nLCBgYXJuOmF3czpjb2RlZGVwbG95OiR7cmVnaW9ufToke2FjY291bnR9OmFwcGxpY2F0aW9uOk15QXBwbGljYXRpb25gKTtcbiAgICAgIGdyb3VwID0gY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50R3JvdXAuZnJvbVNlcnZlckRlcGxveW1lbnRHcm91cEF0dHJpYnV0ZXMoc3RhY2ssICdHcm91cCcsIHtcbiAgICAgICAgYXBwbGljYXRpb24sXG4gICAgICAgIGRlcGxveW1lbnRHcm91cE5hbWU6ICdEZXBsb3ltZW50R3JvdXAnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdrbm93cyBpdHMgYWNjb3VudCBhbmQgcmVnaW9uJywgKCkgPT4ge1xuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGFwcGxpY2F0aW9uLmVudikudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGFjY291bnQsIHJlZ2lvbiB9KSk7XG4gICAgICBleHBlY3QoZ3JvdXAuZW52KS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgYWNjb3VudCwgcmVnaW9uIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlZmVyZW5jZXMgdGhlIHByZWRlZmluZWQgRGVwbG95bWVudEdyb3VwQ29uZmlnIGluIHRoZSByaWdodCByZWdpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZ3JvdXAuZGVwbG95bWVudENvbmZpZy5kZXBsb3ltZW50Q29uZmlnQXJuKS50b0VxdWFsKGV4cGVjdC5zdHJpbmdDb250YWluaW5nKFxuICAgICAgICBgOmNvZGVkZXBsb3k6JHtyZWdpb259OiR7YWNjb3VudH06ZGVwbG95bWVudGNvbmZpZzpDb2RlRGVwbG95RGVmYXVsdC5PbmVBdEFUaW1lYCxcbiAgICAgICkpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19