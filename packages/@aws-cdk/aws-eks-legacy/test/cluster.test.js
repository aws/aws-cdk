"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const eks = require("../lib");
const spot_interrupt_handler_1 = require("../lib/spot-interrupt-handler");
const util_1 = require("./util");
/* eslint-disable max-len */
cdk_build_tools_1.describeDeprecated('cluster', () => {
    test('a default cluster spans all subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            ResourcesVpcConfig: {
                SubnetIds: [
                    { Ref: 'VPCPublicSubnet1SubnetB4246D30' },
                    { Ref: 'VPCPublicSubnet2Subnet74179F39' },
                    { Ref: 'VPCPrivateSubnet1Subnet8BCA10E0' },
                    { Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A' },
                ],
            },
        });
    });
    test('if "vpc" is not specified, vpc with default configuration will be created', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        // WHEN
        new eks.Cluster(stack, 'cluster');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    });
    describe('default capacity', () => {
        test('x2 m5.large by default', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster');
            // THEN
            expect(cluster.defaultCapacity).toBeDefined();
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '2' });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm5.large' });
        });
        test('quantity and type can be customized', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', {
                defaultCapacity: 10,
                defaultCapacityInstance: new ec2.InstanceType('m2.xlarge'),
            });
            // THEN
            expect(cluster.defaultCapacity).toBeDefined();
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', { DesiredCapacity: '10' });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LaunchConfiguration', { InstanceType: 'm2.xlarge' });
        });
        test('defaultCapacity=0 will not allocate at all', () => {
            // GIVEN
            const { stack } = util_1.testFixtureNoVpc();
            // WHEN
            const cluster = new eks.Cluster(stack, 'cluster', { defaultCapacity: 0 });
            // THEN
            expect(cluster.defaultCapacity).toBeUndefined();
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 0);
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::LaunchConfiguration', 0);
        });
    });
    test('creating a cluster tags the private VPC subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
            Tags: [
                { Key: 'aws-cdk:subnet-name', Value: 'Private' },
                { Key: 'aws-cdk:subnet-type', Value: 'Private' },
                { Key: 'kubernetes.io/role/internal-elb', Value: '1' },
                { Key: 'Name', Value: 'Stack/VPC/PrivateSubnet1' },
            ],
        });
    });
    test('creating a cluster tags the public VPC subnets', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Subnet', {
            MapPublicIpOnLaunch: true,
            Tags: [
                { Key: 'aws-cdk:subnet-name', Value: 'Public' },
                { Key: 'aws-cdk:subnet-type', Value: 'Public' },
                { Key: 'kubernetes.io/role/elb', Value: '1' },
                { Key: 'Name', Value: 'Stack/VPC/PublicSubnet1' },
            ],
        });
    });
    test('adding capacity creates an ASG with tags', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // WHEN
        cluster.addCapacity('Default', {
            instanceType: new ec2.InstanceType('t2.medium'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
            Tags: [
                {
                    Key: { 'Fn::Join': ['', ['kubernetes.io/cluster/', { Ref: 'ClusterEB0386A7' }]] },
                    PropagateAtLaunch: true,
                    Value: 'owned',
                },
                {
                    Key: 'Name',
                    PropagateAtLaunch: true,
                    Value: 'Stack/Cluster/Default',
                },
            ],
        });
    });
    test('exercise export/import', () => {
        // GIVEN
        const { stack: stack1, vpc, app } = util_1.testFixture();
        const stack2 = new cdk.Stack(app, 'stack2', { env: { region: 'us-east-1' } });
        const cluster = new eks.Cluster(stack1, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // WHEN
        const imported = eks.Cluster.fromClusterAttributes(stack2, 'Imported', {
            clusterArn: cluster.clusterArn,
            vpc: cluster.vpc,
            clusterEndpoint: cluster.clusterEndpoint,
            clusterName: cluster.clusterName,
            securityGroups: cluster.connections.securityGroups,
            clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
        });
        // this should cause an export/import
        new cdk.CfnOutput(stack2, 'ClusterARN', { value: imported.clusterArn });
        // THEN
        assertions_1.Template.fromStack(stack2).templateMatches({
            Outputs: {
                ClusterARN: {
                    Value: {
                        'Fn::ImportValue': 'Stack:ExportsOutputFnGetAttClusterEB0386A7Arn2F2E3C3F',
                    },
                },
            },
        });
    });
    test('disabled features when kubectl is disabled', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        expect(() => cluster.awsAuth).toThrow(/Cannot define aws-auth mappings if kubectl is disabled/);
        expect(() => cluster.addResource('foo', {})).toThrow(/Cannot define a KubernetesManifest resource on a cluster with kubectl disabled/);
        expect(() => cluster.addCapacity('boo', { instanceType: new ec2.InstanceType('r5d.24xlarge'), mapRole: true })).toThrow(/Cannot map instance IAM role to RBAC if kubectl is disabled for the cluster/);
        expect(() => new eks.HelmChart(stack, 'MyChart', { cluster, chart: 'chart' })).toThrow(/Cannot define a Helm chart on a cluster with kubectl disabled/);
    });
    test('mastersRole can be used to map an IAM role to "system:masters" (required kubectl)', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
        // WHEN
        new eks.Cluster(stack, 'Cluster', { vpc, mastersRole: role, defaultCapacity: 0 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('addResource can be used to apply k8s manifests on this cluster', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });
        // WHEN
        cluster.addResource('manifest1', { foo: 123 });
        cluster.addResource('manifest2', { bar: 123 }, { boor: [1, 2, 3] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
            Manifest: '[{"foo":123}]',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
            Manifest: '[{"bar":123},{"boor":[1,2,3]}]',
        });
    });
    test('when kubectl is enabled (default) adding capacity will automatically map its IAM role', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });
        // WHEN
        cluster.addCapacity('default', {
            instanceType: new ec2.InstanceType('t2.nano'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterdefaultInstanceRoleF20A29CD',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('addCapacity will *not* map the IAM role if mapRole is false', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, defaultCapacity: 0 });
        // WHEN
        cluster.addCapacity('default', {
            instanceType: new ec2.InstanceType('t2.nano'),
            mapRole: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);
    });
    test('addCapacity will *not* map the IAM role if kubectl is disabled', () => {
        // GIVEN
        const { stack, vpc } = util_1.testFixture();
        const cluster = new eks.Cluster(stack, 'Cluster', { vpc, kubectlEnabled: false, defaultCapacity: 0 });
        // WHEN
        cluster.addCapacity('default', {
            instanceType: new ec2.InstanceType('t2.nano'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);
    });
    describe('outputs', () => {
        test('aws eks update-kubeconfig is the only output synthesized by default', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster');
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
                ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1']] } },
            });
        });
        test('if masters role is defined, it should be included in the config command', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
            new eks.Cluster(stack, 'Cluster', { mastersRole });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterConfigCommand43AAE40F: { Value: { 'Fn::Join': ['', ['aws eks update-kubeconfig --name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
                ClusterGetTokenCommand06AE992E: { Value: { 'Fn::Join': ['', ['aws eks get-token --cluster-name ', { Ref: 'Cluster9EE0221C' }, ' --region us-east-1 --role-arn ', { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] }]] } },
            });
        });
        test('if `outputConfigCommand=false` will disabled the output', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            const mastersRole = new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() });
            new eks.Cluster(stack, 'Cluster', {
                mastersRole,
                outputConfigCommand: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toBeUndefined(); // no outputs
        });
        test('`outputClusterName` can be used to synthesize an output with the cluster name', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                outputConfigCommand: false,
                outputClusterName: true,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterClusterNameEB26049E: { Value: { Ref: 'Cluster9EE0221C' } },
            });
        });
        test('`outputMastersRoleArn` can be used to synthesize an output with the arn of the masters role if defined', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                outputConfigCommand: false,
                outputMastersRoleArn: true,
                mastersRole: new iam.Role(stack, 'masters', { assumedBy: new iam.AccountRootPrincipal() }),
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterMastersRoleArnB15964B1: { Value: { 'Fn::GetAtt': ['masters0D04F23D', 'Arn'] } },
            });
        });
        test('when adding capacity, instance role ARN will not be outputed only if we do not auto-map aws-auth', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            // WHEN
            new eks.Cluster(stack, 'Cluster', {
                outputConfigCommand: false,
                kubectlEnabled: false,
            });
            // THEN
            const assembly = app.synth();
            const template = assembly.getStackByName(stack.stackName).template;
            expect(template.Outputs).toEqual({
                ClusterDefaultCapacityInstanceRoleARN7DADF219: {
                    Value: { 'Fn::GetAtt': ['ClusterDefaultCapacityInstanceRole3E209969', 'Arn'] },
                },
            });
        });
    });
    describe('boostrap user-data', () => {
        test('rendered by default for ASGs', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
            // WHEN
            cluster.addCapacity('MyCapcity', { instanceType: new ec2.InstanceType('m3.xlargs') });
            // THEN
            const template = app.synth().getStackByName(stack.stackName).template;
            const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
            expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        });
        test('not rendered if bootstrap is disabled', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
            // WHEN
            cluster.addCapacity('MyCapcity', {
                instanceType: new ec2.InstanceType('m3.xlargs'),
                bootstrapEnabled: false,
            });
            // THEN
            const template = app.synth().getStackByName(stack.stackName).template;
            const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
            expect(userData).toEqual({ 'Fn::Base64': '#!/bin/bash' });
        });
        // cursory test for options: see test.user-data.ts for full suite
        test('bootstrap options', () => {
            // GIVEN
            const { app, stack } = util_1.testFixtureNoVpc();
            const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
            // WHEN
            cluster.addCapacity('MyCapcity', {
                instanceType: new ec2.InstanceType('m3.xlargs'),
                bootstrapOptions: {
                    kubeletExtraArgs: '--node-labels FOO=42',
                },
            });
            // THEN
            const template = app.synth().getStackByName(stack.stackName).template;
            const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
            expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --node-labels FOO=42" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
        });
        describe('spot instances', () => {
            test('nodes labeled an tainted accordingly', () => {
                // GIVEN
                const { app, stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
                // WHEN
                cluster.addCapacity('MyCapcity', {
                    instanceType: new ec2.InstanceType('m3.xlargs'),
                    spotPrice: '0.01',
                });
                // THEN
                const template = app.synth().getStackByName(stack.stackName).template;
                const userData = template.Resources.ClusterMyCapcityLaunchConfig58583345.Properties.UserData;
                expect(userData).toEqual({ 'Fn::Base64': { 'Fn::Join': ['', ['#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ', { Ref: 'Cluster9EE0221C' }, ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule" --use-max-pods true\n/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ClusterMyCapcityASGD4CD8B97 --region us-east-1']] } });
            });
            test('if kubectl is enabled, the interrupt handler is added', () => {
                // GIVEN
                const { stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
                // WHEN
                cluster.addCapacity('MyCapcity', {
                    instanceType: new ec2.InstanceType('m3.xlargs'),
                    spotPrice: '0.01',
                });
                // THEN
                assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesResource.RESOURCE_TYPE, { Manifest: JSON.stringify(spot_interrupt_handler_1.spotInterruptHandler()) });
            });
            test('if kubectl is disabled, interrupt handler is not added', () => {
                // GIVEN
                const { stack } = util_1.testFixtureNoVpc();
                const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0, kubectlEnabled: false });
                // WHEN
                cluster.addCapacity('MyCapcity', {
                    instanceType: new ec2.InstanceType('m3.xlargs'),
                    spotPrice: '0.01',
                });
                // THEN
                assertions_1.Template.fromStack(stack).resourceCountIs(eks.KubernetesResource.RESOURCE_TYPE, 0);
            });
        });
    });
    test('if bootstrap is disabled cannot specify options', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new eks.Cluster(stack, 'Cluster', { defaultCapacity: 0 });
        // THEN
        expect(() => cluster.addCapacity('MyCapcity', {
            instanceType: new ec2.InstanceType('m3.xlargs'),
            bootstrapEnabled: false,
            bootstrapOptions: { awsApiRetryAttempts: 10 },
        })).toThrow(/Cannot specify "bootstrapOptions" if "bootstrapEnabled" is false/);
    });
    test('EKS-Optimized AMI with GPU support', () => {
        // GIVEN
        const { app, stack } = util_1.testFixtureNoVpc();
        // WHEN
        new eks.Cluster(stack, 'cluster', {
            defaultCapacity: 2,
            defaultCapacityInstance: new ec2.InstanceType('g4dn.xlarge'),
        });
        // THEN
        const assembly = app.synth();
        const parameters = assembly.getStackByName(stack.stackName).template.Parameters;
        expect(Object.entries(parameters).some(([k, v]) => k.startsWith('SsmParameterValueawsserviceeksoptimizedami') && v.Default.includes('amazon-linux2-gpu'))).toEqual(true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2x1c3Rlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsMEVBQXFFO0FBQ3JFLGlDQUF1RDtBQUV2RCw0QkFBNEI7QUFFNUIsb0NBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLFFBQVE7UUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLGtCQUFXLEVBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV0RixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsa0JBQWtCLEVBQUU7Z0JBQ2xCLFNBQVMsRUFBRTtvQkFDVCxFQUFFLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRTtvQkFDekMsRUFBRSxHQUFHLEVBQUUsZ0NBQWdDLEVBQUU7b0JBQ3pDLEVBQUUsR0FBRyxFQUFFLGlDQUFpQyxFQUFFO29CQUMxQyxFQUFFLEdBQUcsRUFBRSxpQ0FBaUMsRUFBRTtpQkFDM0M7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJFQUEyRSxFQUFFLEdBQUcsRUFBRTtRQUNyRixRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLHVCQUFnQixFQUFFLENBQUM7UUFFckMsT0FBTztRQUNQLElB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Q0FBQztJQUVuQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IGRlc2NyaWJlRGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IHNwb3RJbnRlcnJ1cHRIYW5kbGVyIH0gZnJvbSAnLi4vbGliL3Nwb3QtaW50ZXJydXB0LWhhbmRsZXInO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUsIHRlc3RGaXh0dXJlTm9WcGMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgnY2x1c3RlcicsICgpID0+IHtcbiAgdGVzdCgnYSBkZWZhdWx0IGNsdXN0ZXIgc3BhbnMgYWxsIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogZmFsc2UsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkNsdXN0ZXInLCB7XG4gICAgICBSZXNvdXJjZXNWcGNDb25maWc6IHtcbiAgICAgICAgU3VibmV0SWRzOiBbXG4gICAgICAgICAgeyBSZWY6ICdWUENQdWJsaWNTdWJuZXQxU3VibmV0QjQyNDZEMzAnIH0sXG4gICAgICAgICAgeyBSZWY6ICdWUENQdWJsaWNTdWJuZXQyU3VibmV0NzQxNzlGMzknIH0sXG4gICAgICAgICAgeyBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyB9LFxuICAgICAgICAgIHsgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDJTdWJuZXRDRkNEQUE3QScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpZiBcInZwY1wiIGlzIG5vdCBzcGVjaWZpZWQsIHZwYyB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbiB3aWxsIGJlIGNyZWF0ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6VlBDJywgMSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2RlZmF1bHQgY2FwYWNpdHknLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCd4MiBtNS5sYXJnZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5KS50b0JlRGVmaW5lZCgpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7IERlc2lyZWRDYXBhY2l0eTogJzInIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7IEluc3RhbmNlVHlwZTogJ201LmxhcmdlJyB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgncXVhbnRpdHkgYW5kIHR5cGUgY2FuIGJlIGN1c3RvbWl6ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5OiAxMCxcbiAgICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMi54bGFyZ2UnKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkpLnRvQmVEZWZpbmVkKCk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6QXV0b1NjYWxpbmdHcm91cCcsIHsgRGVzaXJlZENhcGFjaXR5OiAnMTAnIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxhdW5jaENvbmZpZ3VyYXRpb24nLCB7IEluc3RhbmNlVHlwZTogJ20yLnhsYXJnZScgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHRDYXBhY2l0eT0wIHdpbGwgbm90IGFsbG9jYXRlIGF0IGFsbCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjbHVzdGVyLmRlZmF1bHRDYXBhY2l0eSkudG9CZVVuZGVmaW5lZCgpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCAwKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkF1dG9TY2FsaW5nOjpMYXVuY2hDb25maWd1cmF0aW9uJywgMCk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRpbmcgYSBjbHVzdGVyIHRhZ3MgdGhlIHByaXZhdGUgVlBDIHN1Ym5ldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogZmFsc2UsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlN1Ym5ldCcsIHtcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgeyBLZXk6ICdhd3MtY2RrOnN1Ym5ldC1uYW1lJywgVmFsdWU6ICdQcml2YXRlJyB9LFxuICAgICAgICB7IEtleTogJ2F3cy1jZGs6c3VibmV0LXR5cGUnLCBWYWx1ZTogJ1ByaXZhdGUnIH0sXG4gICAgICAgIHsgS2V5OiAna3ViZXJuZXRlcy5pby9yb2xlL2ludGVybmFsLWVsYicsIFZhbHVlOiAnMScgfSxcbiAgICAgICAgeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdTdGFjay9WUEMvUHJpdmF0ZVN1Ym5ldDEnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRpbmcgYSBjbHVzdGVyIHRhZ3MgdGhlIHB1YmxpYyBWUEMgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMsIGt1YmVjdGxFbmFibGVkOiBmYWxzZSwgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U3VibmV0Jywge1xuICAgICAgTWFwUHVibGljSXBPbkxhdW5jaDogdHJ1ZSxcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAgeyBLZXk6ICdhd3MtY2RrOnN1Ym5ldC1uYW1lJywgVmFsdWU6ICdQdWJsaWMnIH0sXG4gICAgICAgIHsgS2V5OiAnYXdzLWNkazpzdWJuZXQtdHlwZScsIFZhbHVlOiAnUHVibGljJyB9LFxuICAgICAgICB7IEtleTogJ2t1YmVybmV0ZXMuaW8vcm9sZS9lbGInLCBWYWx1ZTogJzEnIH0sXG4gICAgICAgIHsgS2V5OiAnTmFtZScsIFZhbHVlOiAnU3RhY2svVlBDL1B1YmxpY1N1Ym5ldDEnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIGNhcGFjaXR5IGNyZWF0ZXMgYW4gQVNHIHdpdGggdGFncycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogZmFsc2UsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkF1dG9TY2FsaW5nR3JvdXAnLCB7XG4gICAgICBUYWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2t1YmVybmV0ZXMuaW8vY2x1c3Rlci8nLCB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfV1dIH0sXG4gICAgICAgICAgUHJvcGFnYXRlQXRMYXVuY2g6IHRydWUsXG4gICAgICAgICAgVmFsdWU6ICdvd25lZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdOYW1lJyxcbiAgICAgICAgICBQcm9wYWdhdGVBdExhdW5jaDogdHJ1ZSxcbiAgICAgICAgICBWYWx1ZTogJ1N0YWNrL0NsdXN0ZXIvRGVmYXVsdCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZXhlcmNpc2UgZXhwb3J0L2ltcG9ydCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2s6IHN0YWNrMSwgdnBjLCBhcHAgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IGNkay5TdGFjayhhcHAsICdzdGFjazInLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjazEsICdDbHVzdGVyJywgeyB2cGMsIGt1YmVjdGxFbmFibGVkOiBmYWxzZSwgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrMiwgJ0ltcG9ydGVkJywge1xuICAgICAgY2x1c3RlckFybjogY2x1c3Rlci5jbHVzdGVyQXJuLFxuICAgICAgdnBjOiBjbHVzdGVyLnZwYyxcbiAgICAgIGNsdXN0ZXJFbmRwb2ludDogY2x1c3Rlci5jbHVzdGVyRW5kcG9pbnQsXG4gICAgICBjbHVzdGVyTmFtZTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBjbHVzdGVyLmNvbm5lY3Rpb25zLnNlY3VyaXR5R3JvdXBzLFxuICAgICAgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YTogY2x1c3Rlci5jbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhLFxuICAgIH0pO1xuXG4gICAgLy8gdGhpcyBzaG91bGQgY2F1c2UgYW4gZXhwb3J0L2ltcG9ydFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrMiwgJ0NsdXN0ZXJBUk4nLCB7IHZhbHVlOiBpbXBvcnRlZC5jbHVzdGVyQXJuIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBPdXRwdXRzOiB7XG4gICAgICAgIENsdXN0ZXJBUk46IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpJbXBvcnRWYWx1ZSc6ICdTdGFjazpFeHBvcnRzT3V0cHV0Rm5HZXRBdHRDbHVzdGVyRUIwMzg2QTdBcm4yRjJFM0MzRicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZWQgZmVhdHVyZXMgd2hlbiBrdWJlY3RsIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMsIGt1YmVjdGxFbmFibGVkOiBmYWxzZSwgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYXdzQXV0aCkudG9UaHJvdygvQ2Fubm90IGRlZmluZSBhd3MtYXV0aCBtYXBwaW5ncyBpZiBrdWJlY3RsIGlzIGRpc2FibGVkLyk7XG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkUmVzb3VyY2UoJ2ZvbycsIHt9KSkudG9UaHJvdygvQ2Fubm90IGRlZmluZSBhIEt1YmVybmV0ZXNNYW5pZmVzdCByZXNvdXJjZSBvbiBhIGNsdXN0ZXIgd2l0aCBrdWJlY3RsIGRpc2FibGVkLyk7XG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ2JvbycsIHsgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgncjVkLjI0eGxhcmdlJyksIG1hcFJvbGU6IHRydWUgfSkpLnRvVGhyb3coXG4gICAgICAvQ2Fubm90IG1hcCBpbnN0YW5jZSBJQU0gcm9sZSB0byBSQkFDIGlmIGt1YmVjdGwgaXMgZGlzYWJsZWQgZm9yIHRoZSBjbHVzdGVyLyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBla3MuSGVsbUNoYXJ0KHN0YWNrLCAnTXlDaGFydCcsIHsgY2x1c3RlciwgY2hhcnQ6ICdjaGFydCcgfSkpLnRvVGhyb3coL0Nhbm5vdCBkZWZpbmUgYSBIZWxtIGNoYXJ0IG9uIGEgY2x1c3RlciB3aXRoIGt1YmVjdGwgZGlzYWJsZWQvKTtcblxuICB9KTtcblxuICB0ZXN0KCdtYXN0ZXJzUm9sZSBjYW4gYmUgdXNlZCB0byBtYXAgYW4gSUFNIHJvbGUgdG8gXCJzeXN0ZW06bWFzdGVyc1wiIChyZXF1aXJlZCBrdWJlY3RsKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAncm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYywgbWFzdGVyc1JvbGU6IHJvbGUsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc1Jlc291cmNlLlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJDb25maWdNYXBcIixcIm1ldGFkYXRhXCI6e1wibmFtZVwiOlwiYXdzLWF1dGhcIixcIm5hbWVzcGFjZVwiOlwia3ViZS1zeXN0ZW1cIn0sXCJkYXRhXCI6e1wibWFwUm9sZXNcIjpcIlt7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAncm9sZUM3QjdFNzc1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOm1hc3RlcnNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbXVwiLFwibWFwQWNjb3VudHNcIjpcIltdXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkUmVzb3VyY2UgY2FuIGJlIHVzZWQgdG8gYXBwbHkgazhzIG1hbmlmZXN0cyBvbiB0aGlzIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYywgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkUmVzb3VyY2UoJ21hbmlmZXN0MScsIHsgZm9vOiAxMjMgfSk7XG4gICAgY2x1c3Rlci5hZGRSZXNvdXJjZSgnbWFuaWZlc3QyJywgeyBiYXI6IDEyMyB9LCB7IGJvb3I6IFsxLCAyLCAzXSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc1Jlc291cmNlLlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiAnW3tcImZvb1wiOjEyM31dJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzUmVzb3VyY2UuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6ICdbe1wiYmFyXCI6MTIzfSx7XCJib29yXCI6WzEsMiwzXX1dJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4ga3ViZWN0bCBpcyBlbmFibGVkIChkZWZhdWx0KSBhZGRpbmcgY2FwYWNpdHkgd2lsbCBhdXRvbWF0aWNhbGx5IG1hcCBpdHMgSUFNIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IHZwYywgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ2RlZmF1bHQnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5uYW5vJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiQ29uZmlnTWFwXCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcImF3cy1hdXRoXCIsXCJuYW1lc3BhY2VcIjpcImt1YmUtc3lzdGVtXCJ9LFwiZGF0YVwiOntcIm1hcFJvbGVzXCI6XCJbe1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJkZWZhdWx0SW5zdGFuY2VSb2xlRjIwQTI5Q0QnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwic3lzdGVtOm5vZGU6e3tFQzJQcml2YXRlRE5TTmFtZX19XFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOmJvb3RzdHJhcHBlcnNcXFxcXCIsXFxcXFwic3lzdGVtOm5vZGVzXFxcXFwiXX1dXCIsXCJtYXBVc2Vyc1wiOlwiW11cIixcIm1hcEFjY291bnRzXCI6XCJbXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZENhcGFjaXR5IHdpbGwgKm5vdCogbWFwIHRoZSBJQU0gcm9sZSBpZiBtYXBSb2xlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2cGMsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdkZWZhdWx0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubmFubycpLFxuICAgICAgbWFwUm9sZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoZWtzLkt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCAwKTtcblxuICB9KTtcblxuICB0ZXN0KCdhZGRDYXBhY2l0eSB3aWxsICpub3QqIG1hcCB0aGUgSUFNIHJvbGUgaWYga3ViZWN0bCBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2ssIHZwYyB9ID0gdGVzdEZpeHR1cmUoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdnBjLCBrdWJlY3RsRW5hYmxlZDogZmFsc2UsIGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdkZWZhdWx0Jywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubmFubycpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKGVrcy5LdWJlcm5ldGVzUmVzb3VyY2UuUkVTT1VSQ0VfVFlQRSwgMCk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ291dHB1dHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYXdzIGVrcyB1cGRhdGUta3ViZWNvbmZpZyBpcyB0aGUgb25seSBvdXRwdXQgc3ludGhlc2l6ZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLk91dHB1dHMpLnRvRXF1YWwoe1xuICAgICAgICBDbHVzdGVyQ29uZmlnQ29tbWFuZDQzQUFFNDBGOiB7IFZhbHVlOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhd3MgZWtzIHVwZGF0ZS1rdWJlY29uZmlnIC0tbmFtZSAnLCB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSwgJyAtLXJlZ2lvbiB1cy1lYXN0LTEnXV0gfSB9LFxuICAgICAgICBDbHVzdGVyR2V0VG9rZW5Db21tYW5kMDZBRTk5MkU6IHsgVmFsdWU6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2F3cyBla3MgZ2V0LXRva2VuIC0tY2x1c3Rlci1uYW1lICcsIHsgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyB9LCAnIC0tcmVnaW9uIHVzLWVhc3QtMSddXSB9IH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnaWYgbWFzdGVycyByb2xlIGlzIGRlZmluZWQsIGl0IHNob3VsZCBiZSBpbmNsdWRlZCBpbiB0aGUgY29uZmlnIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnbWFzdGVycycsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBtYXN0ZXJzUm9sZSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgICAgQ2x1c3RlckNvbmZpZ0NvbW1hbmQ0M0FBRTQwRjogeyBWYWx1ZTogeyAnRm46OkpvaW4nOiBbJycsIFsnYXdzIGVrcyB1cGRhdGUta3ViZWNvbmZpZyAtLW5hbWUgJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1yZWdpb24gdXMtZWFzdC0xIC0tcm9sZS1hcm4gJywgeyAnRm46OkdldEF0dCc6IFsnbWFzdGVyczBEMDRGMjNEJywgJ0FybiddIH1dXSB9IH0sXG4gICAgICAgIENsdXN0ZXJHZXRUb2tlbkNvbW1hbmQwNkFFOTkyRTogeyBWYWx1ZTogeyAnRm46OkpvaW4nOiBbJycsIFsnYXdzIGVrcyBnZXQtdG9rZW4gLS1jbHVzdGVyLW5hbWUgJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1yZWdpb24gdXMtZWFzdC0xIC0tcm9sZS1hcm4gJywgeyAnRm46OkdldEF0dCc6IFsnbWFzdGVyczBEMDRGMjNEJywgJ0FybiddIH1dXSB9IH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnaWYgYG91dHB1dENvbmZpZ0NvbW1hbmQ9ZmFsc2VgIHdpbGwgZGlzYWJsZWQgdGhlIG91dHB1dCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdtYXN0ZXJzJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSB9KTtcbiAgICAgIG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgICBvdXRwdXRDb25maWdDb21tYW5kOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgZXhwZWN0KHRlbXBsYXRlLk91dHB1dHMpLnRvQmVVbmRlZmluZWQoKTsgLy8gbm8gb3V0cHV0c1xuXG4gICAgfSk7XG5cbiAgICB0ZXN0KCdgb3V0cHV0Q2x1c3Rlck5hbWVgIGNhbiBiZSB1c2VkIHRvIHN5bnRoZXNpemUgYW4gb3V0cHV0IHdpdGggdGhlIGNsdXN0ZXIgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgb3V0cHV0Q29uZmlnQ29tbWFuZDogZmFsc2UsXG4gICAgICAgIG91dHB1dENsdXN0ZXJOYW1lOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodGVtcGxhdGUuT3V0cHV0cykudG9FcXVhbCh7XG4gICAgICAgIENsdXN0ZXJDbHVzdGVyTmFtZUVCMjYwNDlFOiB7IFZhbHVlOiB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSB9LFxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2BvdXRwdXRNYXN0ZXJzUm9sZUFybmAgY2FuIGJlIHVzZWQgdG8gc3ludGhlc2l6ZSBhbiBvdXRwdXQgd2l0aCB0aGUgYXJuIG9mIHRoZSBtYXN0ZXJzIHJvbGUgaWYgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgb3V0cHV0Q29uZmlnQ29tbWFuZDogZmFsc2UsXG4gICAgICAgIG91dHB1dE1hc3RlcnNSb2xlQXJuOiB0cnVlLFxuICAgICAgICBtYXN0ZXJzUm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnbWFzdGVycycsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZW1ibHkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGV4cGVjdCh0ZW1wbGF0ZS5PdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgICAgQ2x1c3Rlck1hc3RlcnNSb2xlQXJuQjE1OTY0QjE6IHsgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ21hc3RlcnMwRDA0RjIzRCcsICdBcm4nXSB9IH0sXG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2hlbiBhZGRpbmcgY2FwYWNpdHksIGluc3RhbmNlIHJvbGUgQVJOIHdpbGwgbm90IGJlIG91dHB1dGVkIG9ubHkgaWYgd2UgZG8gbm90IGF1dG8tbWFwIGF3cy1hdXRoJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICBvdXRwdXRDb25maWdDb21tYW5kOiBmYWxzZSxcbiAgICAgICAga3ViZWN0bEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBleHBlY3QodGVtcGxhdGUuT3V0cHV0cykudG9FcXVhbCh7XG4gICAgICAgIENsdXN0ZXJEZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZVJvbGVBUk43REFERjIxOToge1xuICAgICAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRGVmYXVsdENhcGFjaXR5SW5zdGFuY2VSb2xlM0UyMDk5NjknLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdib29zdHJhcCB1c2VyLWRhdGEnLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCdyZW5kZXJlZCBieSBkZWZhdWx0IGZvciBBU0dzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7IGRlZmF1bHRDYXBhY2l0eTogMCB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnTXlDYXBjaXR5JywgeyBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMy54bGFyZ3MnKSB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFjay5zdGFja05hbWUpLnRlbXBsYXRlO1xuICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICBleHBlY3QodXNlckRhdGEpLnRvRXF1YWwoeyAnRm46OkJhc2U2NCc6IHsgJ0ZuOjpKb2luJzogWycnLCBbJyMhL2Jpbi9iYXNoXFxuc2V0IC1vIHh0cmFjZVxcbi9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLCB7IFJlZjogJ0NsdXN0ZXI5RUUwMjIxQycgfSwgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS11c2UtbWF4LXBvZHMgdHJ1ZVxcbi9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBDbHVzdGVyTXlDYXBjaXR5QVNHRDRDRDhCOTcgLS1yZWdpb24gdXMtZWFzdC0xJ11dIH0gfSk7XG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ25vdCByZW5kZXJlZCBpZiBib290c3RyYXAgaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBhcHAsIHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICBib290c3RyYXBFbmFibGVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFwcC5zeW50aCgpLmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGU7XG4gICAgICBjb25zdCB1c2VyRGF0YSA9IHRlbXBsYXRlLlJlc291cmNlcy5DbHVzdGVyTXlDYXBjaXR5TGF1bmNoQ29uZmlnNTg1ODMzNDUuUHJvcGVydGllcy5Vc2VyRGF0YTtcbiAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogJyMhL2Jpbi9iYXNoJyB9KTtcblxuICAgIH0pO1xuXG4gICAgLy8gY3Vyc29yeSB0ZXN0IGZvciBvcHRpb25zOiBzZWUgdGVzdC51c2VyLWRhdGEudHMgZm9yIGZ1bGwgc3VpdGVcbiAgICB0ZXN0KCdib290c3RyYXAgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ015Q2FwY2l0eScsIHtcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgIGJvb3RzdHJhcE9wdGlvbnM6IHtcbiAgICAgICAgICBrdWJlbGV0RXh0cmFBcmdzOiAnLS1ub2RlLWxhYmVscyBGT089NDInLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgIGNvbnN0IHVzZXJEYXRhID0gdGVtcGxhdGUuUmVzb3VyY2VzLkNsdXN0ZXJNeUNhcGNpdHlMYXVuY2hDb25maWc1ODU4MzM0NS5Qcm9wZXJ0aWVzLlVzZXJEYXRhO1xuICAgICAgZXhwZWN0KHVzZXJEYXRhKS50b0VxdWFsKHsgJ0ZuOjpCYXNlNjQnOiB7ICdGbjo6Sm9pbic6IFsnJywgWycjIS9iaW4vYmFzaFxcbnNldCAtbyB4dHJhY2VcXG4vZXRjL2Vrcy9ib290c3RyYXAuc2ggJywgeyBSZWY6ICdDbHVzdGVyOUVFMDIyMUMnIH0sICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZCAgLS1ub2RlLWxhYmVscyBGT089NDJcIiAtLXVzZS1tYXgtcG9kcyB0cnVlXFxuL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBTdGFjayAtLXJlc291cmNlIENsdXN0ZXJNeUNhcGNpdHlBU0dENENEOEI5NyAtLXJlZ2lvbiB1cy1lYXN0LTEnXV0gfSB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3Nwb3QgaW5zdGFuY2VzJywgKCkgPT4ge1xuXG4gICAgICB0ZXN0KCdub2RlcyBsYWJlbGVkIGFuIHRhaW50ZWQgYWNjb3JkaW5nbHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEdJVkVOXG4gICAgICAgIGNvbnN0IHsgYXBwLCBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgICAgIC8vIFdIRU5cbiAgICAgICAgY2x1c3Rlci5hZGRDYXBhY2l0eSgnTXlDYXBjaXR5Jywge1xuICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ20zLnhsYXJncycpLFxuICAgICAgICAgIHNwb3RQcmljZTogJzAuMDEnLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUSEVOXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZTtcbiAgICAgICAgY29uc3QgdXNlckRhdGEgPSB0ZW1wbGF0ZS5SZXNvdXJjZXMuQ2x1c3Rlck15Q2FwY2l0eUxhdW5jaENvbmZpZzU4NTgzMzQ1LlByb3BlcnRpZXMuVXNlckRhdGE7XG4gICAgICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbCh7ICdGbjo6QmFzZTY0JzogeyAnRm46OkpvaW4nOiBbJycsIFsnIyEvYmluL2Jhc2hcXG5zZXQgLW8geHRyYWNlXFxuL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsIHsgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyB9LCAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9RWMyU3BvdCAtLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGVcIiAtLXVzZS1tYXgtcG9kcyB0cnVlXFxuL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBTdGFjayAtLXJlc291cmNlIENsdXN0ZXJNeUNhcGNpdHlBU0dENENEOEI5NyAtLXJlZ2lvbiB1cy1lYXN0LTEnXV0gfSB9KTtcblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2lmIGt1YmVjdGwgaXMgZW5hYmxlZCwgdGhlIGludGVycnVwdCBoYW5kbGVyIGlzIGFkZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBHSVZFTlxuICAgICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyBkZWZhdWx0Q2FwYWNpdHk6IDAgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgICAgc3BvdFByaWNlOiAnMC4wMScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCB7IE1hbmlmZXN0OiBKU09OLnN0cmluZ2lmeShzcG90SW50ZXJydXB0SGFuZGxlcigpKSB9KTtcblxuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2lmIGt1YmVjdGwgaXMgZGlzYWJsZWQsIGludGVycnVwdCBoYW5kbGVyIGlzIG5vdCBhZGRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gR0lWRU5cbiAgICAgICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgICAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwLCBrdWJlY3RsRW5hYmxlZDogZmFsc2UgfSk7XG5cbiAgICAgICAgLy8gV0hFTlxuICAgICAgICBjbHVzdGVyLmFkZENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTMueGxhcmdzJyksXG4gICAgICAgICAgc3BvdFByaWNlOiAnMC4wMScsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRIRU5cbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoZWtzLkt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCAwKTtcblxuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdpZiBib290c3RyYXAgaXMgZGlzYWJsZWQgY2Fubm90IHNwZWNpZnkgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgZGVmYXVsdENhcGFjaXR5OiAwIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZENhcGFjaXR5KCdNeUNhcGNpdHknLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtMy54bGFyZ3MnKSxcbiAgICAgIGJvb3RzdHJhcEVuYWJsZWQ6IGZhbHNlLFxuICAgICAgYm9vdHN0cmFwT3B0aW9uczogeyBhd3NBcGlSZXRyeUF0dGVtcHRzOiAxMCB9LFxuICAgIH0pKS50b1Rocm93KC9DYW5ub3Qgc3BlY2lmeSBcImJvb3RzdHJhcE9wdGlvbnNcIiBpZiBcImJvb3RzdHJhcEVuYWJsZWRcIiBpcyBmYWxzZS8pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ0VLUy1PcHRpbWl6ZWQgQU1JIHdpdGggR1BVIHN1cHBvcnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFwcCwgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdjbHVzdGVyJywge1xuICAgICAgZGVmYXVsdENhcGFjaXR5OiAyLFxuICAgICAgZGVmYXVsdENhcGFjaXR5SW5zdGFuY2U6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdnNGRuLnhsYXJnZScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgY29uc3QgcGFyYW1ldGVycyA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKHN0YWNrLnN0YWNrTmFtZSkudGVtcGxhdGUuUGFyYW1ldGVycztcbiAgICBleHBlY3QoT2JqZWN0LmVudHJpZXMocGFyYW1ldGVycykuc29tZShcbiAgICAgIChbaywgdl0pID0+IGsuc3RhcnRzV2l0aCgnU3NtUGFyYW1ldGVyVmFsdWVhd3NzZXJ2aWNlZWtzb3B0aW1pemVkYW1pJykgJiYgKHYgYXMgYW55KS5EZWZhdWx0LmluY2x1ZGVzKCdhbWF6b24tbGludXgyLWdwdScpLFxuICAgICkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgfSk7XG59KTtcbiJdfQ==