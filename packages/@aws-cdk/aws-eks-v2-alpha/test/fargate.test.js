"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda_layer_kubectl_v31_1 = require("@aws-cdk/lambda-layer-kubectl-v31");
const assertions_1 = require("aws-cdk-lib/assertions");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const core_1 = require("aws-cdk-lib/core");
const eks = require("../lib");
const CLUSTER_VERSION = eks.KubernetesVersion.V1_25;
describe('fargate', () => {
    test('can be added to a cluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
            Selectors: [{ Namespace: 'default' }],
        });
    });
    test('supports specifying a profile name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            fargateProfileName: 'MyProfileName',
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
            Selectors: [{ Namespace: 'default' }],
            FargateProfileName: 'MyProfileName',
        });
    });
    test('supports custom execution role', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        const myRole = new iam.Role(stack, 'MyRole', { assumedBy: new iam.AnyPrincipal() });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            podExecutionRole: myRole,
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
            Selectors: [{ Namespace: 'default' }],
        });
    });
    test('supports tags through aspects', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
        });
        core_1.Tags.of(stack).add('aspectTag', 'hello');
        core_1.Tags.of(cluster).add('propTag', '123');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            Selectors: [{ Namespace: 'default' }],
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
            Tags: [
                {
                    Key: 'aspectTag',
                    Value: 'hello',
                },
                {
                    Key: 'propTag',
                    Value: '123',
                },
            ],
        });
    });
    test('supports specifying vpc', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        const vpc = ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
            vpcId: 'vpc123',
            availabilityZones: ['az1'],
            privateSubnetIds: ['priv1'],
        });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
            Selectors: [{ Namespace: 'default' }],
            Subnets: ['priv1'],
        });
    });
    test('fails if there are no selectors or if there are more than 5', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        expect(() => cluster.addFargateProfile('MyProfile', { selectors: [] }));
        expect(() => cluster.addFargateProfile('MyProfile', {
            selectors: [
                { namespace: '1' },
                { namespace: '2' },
                { namespace: '3' },
                { namespace: '4' },
                { namespace: '5' },
                { namespace: '6' },
            ],
        }));
    });
    test('FargateCluster creates an EKS cluster fully managed by Fargate', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
            ResourceName: 'deployment/coredns',
            ResourceNamespace: 'kube-system',
            ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
            RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
            ClusterName: {
                Ref: 'FargateCluster7CCD5F93',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: {
                Ref: 'FargateCluster7CCD5F93',
            },
            PodExecutionRoleArn: {
                'Fn::GetAtt': [
                    'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                    'Arn',
                ],
            },
            Selectors: [
                { Namespace: 'default' },
                { Namespace: 'kube-system' },
            ],
        });
    });
    test('can create FargateCluster with a custom profile', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            defaultProfile: {
                fargateProfileName: 'my-app', selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
            },
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: {
                Ref: 'FargateCluster7CCD5F93',
            },
            FargateProfileName: 'my-app',
            PodExecutionRoleArn: {
                'Fn::GetAtt': [
                    'FargateClusterfargateprofilemyappPodExecutionRole875B4635',
                    'Arn',
                ],
            },
            Selectors: [
                { Namespace: 'foo' },
                { Namespace: 'bar' },
            ],
        });
    });
    test('custom profile name is "custom" if no custom profile name is provided', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            defaultProfile: {
                selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
            },
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: {
                Ref: 'FargateCluster7CCD5F93',
            },
            PodExecutionRoleArn: {
                'Fn::GetAtt': [
                    'FargateClusterfargateprofilecustomPodExecutionRoleDB415F19',
                    'Arn',
                ],
            },
            Selectors: [
                { Namespace: 'foo' },
                { Namespace: 'bar' },
            ],
        });
    });
    test('multiple Fargate profiles added to a cluster are processed sequentially', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', {
            version: CLUSTER_VERSION,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // WHEN
        cluster.addFargateProfile('MyProfile1', {
            selectors: [{ namespace: 'namespace1' }],
        });
        cluster.addFargateProfile('MyProfile2', {
            selectors: [{ namespace: 'namespace2' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::FargateProfile', {
            ClusterName: { Ref: 'MyCluster4C1BA579' },
            PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37', 'Arn'] },
            Selectors: [{ Namespace: 'namespace1' }],
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::EKS::FargateProfile', {
            Properties: {
                ClusterName: { Ref: 'MyCluster4C1BA579' },
                PodExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile2PodExecutionRoleD1151CCF', 'Arn'] },
                Selectors: [{ Namespace: 'namespace2' }],
            },
            DependsOn: [
                'MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37',
                'MyClusterfargateprofileMyProfile1879D501A',
            ],
        });
    });
    test('supports passing secretsEncryptionKey with FargateCluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            version: CLUSTER_VERSION,
            secretsEncryptionKey: new kms.Key(stack, 'Key'),
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            EncryptionConfig: [{
                    Provider: {
                        KeyArn: {
                            'Fn::GetAtt': [
                                'Key961B73FD',
                                'Arn',
                            ],
                        },
                    },
                    Resources: ['secrets'],
                }],
        });
    });
    test('supports cluster logging with FargateCluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            version: CLUSTER_VERSION,
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::Cluster', {
            Logging: {
                ClusterLogging: {
                    EnabledTypes: [
                        { Type: 'api' },
                        { Type: 'authenticator' },
                        { Type: 'scheduler' },
                    ],
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0ZBQW9FO0FBQ3BFLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBK0M7QUFDL0MsOEJBQThCO0FBRTlCLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7QUFFcEQsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDdkIsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtRQUNyQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNsRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7WUFDckMsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtZQUN6QyxtQkFBbUIsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNsRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7WUFDckMsa0JBQWtCLEVBQUUsZUFBZTtZQUNuQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztTQUN0QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFO1lBQ3pDLG1CQUFtQixFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsMERBQTBELEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDMUcsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7WUFDckMsa0JBQWtCLEVBQUUsZUFBZTtTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDbEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQzthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVwRixPQUFPO1FBQ1AsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRTtZQUNyQyxnQkFBZ0IsRUFBRSxNQUFNO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDO1NBQ3RDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7WUFDekMsbUJBQW1CLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNoRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDekMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDbEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQzthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFO1lBQ3JDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDO1NBQ3RDLENBQUMsQ0FBQztRQUVILFdBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN6QyxXQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkMsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDO1lBQ3JDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtZQUN6QyxtQkFBbUIsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDBEQUEwRCxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzFHLElBQUksRUFBRTtnQkFDSjtvQkFDRSxHQUFHLEVBQUUsV0FBVztvQkFDaEIsS0FBSyxFQUFFLE9BQU87aUJBQ2Y7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLFNBQVM7b0JBQ2QsS0FBSyxFQUFFLEtBQUs7aUJBQ2I7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRTtRQUNuQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtZQUNsRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3BELEtBQUssRUFBRSxRQUFRO1lBQ2YsaUJBQWlCLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDMUIsZ0JBQWdCLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDNUIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7WUFDckMsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7WUFDckMsR0FBRztTQUNKLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7WUFDekMsbUJBQW1CLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUMxRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUNyQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDbkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ2xELE9BQU8sRUFBRSxlQUFlO1lBQ3hCLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7YUFDekQ7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFO1lBQ2xELFNBQVMsRUFBRTtnQkFDVCxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xCLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDbEIsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFO2dCQUNsQixFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7Z0JBQ2xCLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDbEIsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7UUFDMUUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQzthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxvQ0FBb0MsRUFBRTtZQUNwRixZQUFZLEVBQUUsb0JBQW9CO1lBQ2xDLGlCQUFpQixFQUFFLGFBQWE7WUFDaEMsY0FBYyxFQUFFLGlHQUFpRztZQUNqSCxnQkFBZ0IsRUFBRSw2RkFBNkY7WUFDL0csV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSx3QkFBd0I7YUFDOUI7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLHdCQUF3QjthQUM5QjtZQUNELG1CQUFtQixFQUFFO2dCQUNuQixZQUFZLEVBQUU7b0JBQ1osNkRBQTZEO29CQUM3RCxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUN4QixFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUU7YUFDN0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsY0FBYyxFQUFFO2dCQUNkLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQzthQUN0RjtZQUNELE9BQU8sRUFBRSxlQUFlO1lBQ3hCLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7YUFDekQ7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7WUFDMUUsV0FBVyxFQUFFO2dCQUNYLEdBQUcsRUFBRSx3QkFBd0I7YUFDOUI7WUFDRCxrQkFBa0IsRUFBRSxRQUFRO1lBQzVCLG1CQUFtQixFQUFFO2dCQUNuQixZQUFZLEVBQUU7b0JBQ1osMkRBQTJEO29CQUMzRCxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO2dCQUNwQixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7YUFDckI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDakYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO2FBQ3hEO1lBQ0QsT0FBTyxFQUFFLGVBQWU7WUFDeEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQzthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywwQkFBMEIsRUFBRTtZQUMxRSxXQUFXLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLHdCQUF3QjthQUM5QjtZQUNELG1CQUFtQixFQUFFO2dCQUNuQixZQUFZLEVBQUU7b0JBQ1osNERBQTREO29CQUM1RCxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFO2dCQUNwQixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUU7YUFDckI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5RUFBeUUsRUFBRSxHQUFHLEVBQUU7UUFDbkYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDbEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQzthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxPQUFPLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUU7WUFDdEMsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDBCQUEwQixFQUFFO1lBQzFFLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtZQUN6QyxtQkFBbUIsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzNHLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsRUFBRTtZQUNoRSxVQUFVLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFO2dCQUN6QyxtQkFBbUIsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUMzRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsQ0FBQzthQUN6QztZQUNELFNBQVMsRUFBRTtnQkFDVCwyREFBMkQ7Z0JBQzNELDJDQUEyQzthQUM1QztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNyRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBRVAsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtZQUM5QyxPQUFPLEVBQUUsZUFBZTtZQUN4QixvQkFBb0IsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUMvQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1lBQ25FLGdCQUFnQixFQUFFLENBQUM7b0JBQ2pCLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ04sWUFBWSxFQUFFO2dDQUNaLGFBQWE7Z0NBQ2IsS0FBSzs2QkFDTjt5QkFDRjtxQkFDRjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQ3ZCLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUVQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsY0FBYyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHO2dCQUMzQixHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYTtnQkFDckMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7YUFDbEM7WUFDRCxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFO1lBQ25FLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUU7b0JBQ2QsWUFBWSxFQUFFO3dCQUNaLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTt3QkFDZixFQUFFLElBQUksRUFBRSxlQUFlLEVBQUU7d0JBQ3pCLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtxQkFDdEI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBLdWJlY3RsVjMxTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzEnO1xuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCB7IFN0YWNrLCBUYWdzIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY29uc3QgQ0xVU1RFUl9WRVJTSU9OID0gZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzI1O1xuXG5kZXNjcmliZSgnZmFyZ2F0ZScsICgpID0+IHtcbiAgdGVzdCgnY2FuIGJlIGFkZGVkIHRvIGEgY2x1c3RlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHtcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ015Q2x1c3RlcjRDMUJBNTc5JyB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgIFNlbGVjdG9yczogW3sgTmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1cHBvcnRzIHNwZWNpZnlpbmcgYSBwcm9maWxlIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzFMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdNeVByb2ZpbGUnLCB7XG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdNeVByb2ZpbGVOYW1lJyxcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ015Q2x1c3RlcjRDMUJBNTc5JyB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgIFNlbGVjdG9yczogW3sgTmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgICBGYXJnYXRlUHJvZmlsZU5hbWU6ICdNeVByb2ZpbGVOYW1lJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VwcG9ydHMgY3VzdG9tIGV4ZWN1dGlvbiByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3QgbXlSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCkgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlJywge1xuICAgICAgcG9kRXhlY3V0aW9uUm9sZTogbXlSb2xlLFxuICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkZhcmdhdGVQcm9maWxlJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHsgUmVmOiAnTXlDbHVzdGVyNEMxQkE1NzknIH0sXG4gICAgICBQb2RFeGVjdXRpb25Sb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeVJvbGVGNDhGRkUwNCcsICdBcm4nXSB9LFxuICAgICAgU2VsZWN0b3JzOiBbeyBOYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VwcG9ydHMgdGFncyB0aHJvdWdoIGFzcGVjdHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzFMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdNeVByb2ZpbGUnLCB7XG4gICAgICBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH1dLFxuICAgIH0pO1xuXG4gICAgVGFncy5vZihzdGFjaykuYWRkKCdhc3BlY3RUYWcnLCAnaGVsbG8nKTtcbiAgICBUYWdzLm9mKGNsdXN0ZXIpLmFkZCgncHJvcFRhZycsICcxMjMnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkZhcmdhdGVQcm9maWxlJywge1xuICAgICAgU2VsZWN0b3JzOiBbeyBOYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ015Q2x1c3RlcjRDMUJBNTc5JyB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgIFRhZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIEtleTogJ2FzcGVjdFRhZycsXG4gICAgICAgICAgVmFsdWU6ICdoZWxsbycsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBLZXk6ICdwcm9wVGFnJyxcbiAgICAgICAgICBWYWx1ZTogJzEyMycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyBzcGVjaWZ5aW5nIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHtcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdNeVZwYycsIHtcbiAgICAgIHZwY0lkOiAndnBjMTIzJyxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2F6MSddLFxuICAgICAgcHJpdmF0ZVN1Ym5ldElkczogWydwcml2MSddLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ015Q2x1c3RlcjRDMUJBNTc5JyB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgIFNlbGVjdG9yczogW3sgTmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgICBTdWJuZXRzOiBbJ3ByaXYxJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHRoZXJlIGFyZSBubyBzZWxlY3RvcnMgb3IgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiA1JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHsgc2VsZWN0b3JzOiBbXSB9KSk7XG4gICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW1xuICAgICAgICB7IG5hbWVzcGFjZTogJzEnIH0sXG4gICAgICAgIHsgbmFtZXNwYWNlOiAnMicgfSxcbiAgICAgICAgeyBuYW1lc3BhY2U6ICczJyB9LFxuICAgICAgICB7IG5hbWVzcGFjZTogJzQnIH0sXG4gICAgICAgIHsgbmFtZXNwYWNlOiAnNScgfSxcbiAgICAgICAgeyBuYW1lc3BhY2U6ICc2JyB9LFxuICAgICAgXSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0ZhcmdhdGVDbHVzdGVyIGNyZWF0ZXMgYW4gRUtTIGNsdXN0ZXIgZnVsbHkgbWFuYWdlZCBieSBGYXJnYXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkZhcmdhdGVDbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzFMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNQYXRjaCcsIHtcbiAgICAgIFJlc291cmNlTmFtZTogJ2RlcGxveW1lbnQvY29yZWRucycsXG4gICAgICBSZXNvdXJjZU5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgIEFwcGx5UGF0Y2hKc29uOiAne1wic3BlY1wiOntcInRlbXBsYXRlXCI6e1wibWV0YWRhdGFcIjp7XCJhbm5vdGF0aW9uc1wiOntcImVrcy5hbWF6b25hd3MuY29tL2NvbXB1dGUtdHlwZVwiOlwiZmFyZ2F0ZVwifX19fX0nLFxuICAgICAgUmVzdG9yZVBhdGNoSnNvbjogJ3tcInNwZWNcIjp7XCJ0ZW1wbGF0ZVwiOntcIm1ldGFkYXRhXCI6e1wiYW5ub3RhdGlvbnNcIjp7XCJla3MuYW1hem9uYXdzLmNvbS9jb21wdXRlLXR5cGVcIjpcImVjMlwifX19fX0nLFxuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnRmFyZ2F0ZUNsdXN0ZXI3Q0NENUY5MycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0ZhcmdhdGVDbHVzdGVyN0NDRDVGOTMnLFxuICAgICAgfSxcbiAgICAgIFBvZEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0ZhcmdhdGVDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVkZWZhdWx0UG9kRXhlY3V0aW9uUm9sZTY2RjI2MTBFJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTZWxlY3RvcnM6IFtcbiAgICAgICAgeyBOYW1lc3BhY2U6ICdkZWZhdWx0JyB9LFxuICAgICAgICB7IE5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGNyZWF0ZSBGYXJnYXRlQ2x1c3RlciB3aXRoIGEgY3VzdG9tIHByb2ZpbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuRmFyZ2F0ZUNsdXN0ZXIoc3RhY2ssICdGYXJnYXRlQ2x1c3RlcicsIHtcbiAgICAgIGRlZmF1bHRQcm9maWxlOiB7XG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ215LWFwcCcsIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZm9vJyB9LCB7IG5hbWVzcGFjZTogJ2JhcicgfV0sXG4gICAgICB9LFxuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7XG4gICAgICAgIFJlZjogJ0ZhcmdhdGVDbHVzdGVyN0NDRDVGOTMnLFxuICAgICAgfSxcbiAgICAgIEZhcmdhdGVQcm9maWxlTmFtZTogJ215LWFwcCcsXG4gICAgICBQb2RFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdGYXJnYXRlQ2x1c3RlcmZhcmdhdGVwcm9maWxlbXlhcHBQb2RFeGVjdXRpb25Sb2xlODc1QjQ2MzUnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFNlbGVjdG9yczogW1xuICAgICAgICB7IE5hbWVzcGFjZTogJ2ZvbycgfSxcbiAgICAgICAgeyBOYW1lc3BhY2U6ICdiYXInIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gcHJvZmlsZSBuYW1lIGlzIFwiY3VzdG9tXCIgaWYgbm8gY3VzdG9tIHByb2ZpbGUgbmFtZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywge1xuICAgICAgZGVmYXVsdFByb2ZpbGU6IHtcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdmb28nIH0sIHsgbmFtZXNwYWNlOiAnYmFyJyB9XSxcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzFMYXllcihzdGFjaywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFS1M6OkZhcmdhdGVQcm9maWxlJywge1xuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnRmFyZ2F0ZUNsdXN0ZXI3Q0NENUY5MycsXG4gICAgICB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnRmFyZ2F0ZUNsdXN0ZXJmYXJnYXRlcHJvZmlsZWN1c3RvbVBvZEV4ZWN1dGlvblJvbGVEQjQxNUYxOScsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU2VsZWN0b3JzOiBbXG4gICAgICAgIHsgTmFtZXNwYWNlOiAnZm9vJyB9LFxuICAgICAgICB7IE5hbWVzcGFjZTogJ2JhcicgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIEZhcmdhdGUgcHJvZmlsZXMgYWRkZWQgdG8gYSBjbHVzdGVyIGFyZSBwcm9jZXNzZWQgc2VxdWVudGlhbGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlMScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnbmFtZXNwYWNlMScgfV0sXG4gICAgfSk7XG4gICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlMicsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnbmFtZXNwYWNlMicgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ015Q2x1c3RlcjRDMUJBNTc5JyB9LFxuICAgICAgUG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGUxUG9kRXhlY3V0aW9uUm9sZTc5NEU5RTM3JywgJ0FybiddIH0sXG4gICAgICBTZWxlY3RvcnM6IFt7IE5hbWVzcGFjZTogJ25hbWVzcGFjZTEnIH1dLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUtTOjpGYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgQ2x1c3Rlck5hbWU6IHsgUmVmOiAnTXlDbHVzdGVyNEMxQkE1NzknIH0sXG4gICAgICAgIFBvZEV4ZWN1dGlvblJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015Q2x1c3RlcmZhcmdhdGVwcm9maWxlTXlQcm9maWxlMlBvZEV4ZWN1dGlvblJvbGVEMTE1MUNDRicsICdBcm4nXSB9LFxuICAgICAgICBTZWxlY3RvcnM6IFt7IE5hbWVzcGFjZTogJ25hbWVzcGFjZTInIH1dLFxuICAgICAgfSxcbiAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGUxUG9kRXhlY3V0aW9uUm9sZTc5NEU5RTM3JyxcbiAgICAgICAgJ015Q2x1c3RlcmZhcmdhdGVwcm9maWxlTXlQcm9maWxlMTg3OUQ1MDFBJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1cHBvcnRzIHBhc3Npbmcgc2VjcmV0c0VuY3J5cHRpb25LZXkgd2l0aCBGYXJnYXRlQ2x1c3RlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG5cbiAgICBuZXcgZWtzLkZhcmdhdGVDbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgICBzZWNyZXRzRW5jcnlwdGlvbktleTogbmV3IGttcy5LZXkoc3RhY2ssICdLZXknKSxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6Q2x1c3RlcicsIHtcbiAgICAgIEVuY3J5cHRpb25Db25maWc6IFt7XG4gICAgICAgIFByb3ZpZGVyOiB7XG4gICAgICAgICAgS2V5QXJuOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0tleTk2MUI3M0ZEJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFJlc291cmNlczogWydzZWNyZXRzJ10sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VwcG9ydHMgY2x1c3RlciBsb2dnaW5nIHdpdGggRmFyZ2F0ZUNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVBJLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5BVVRIRU5USUNBVE9SLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5TQ0hFRFVMRVIsXG4gICAgICBdLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpDbHVzdGVyJywge1xuICAgICAgTG9nZ2luZzoge1xuICAgICAgICBDbHVzdGVyTG9nZ2luZzoge1xuICAgICAgICAgIEVuYWJsZWRUeXBlczogW1xuICAgICAgICAgICAgeyBUeXBlOiAnYXBpJyB9LFxuICAgICAgICAgICAgeyBUeXBlOiAnYXV0aGVudGljYXRvcicgfSxcbiAgICAgICAgICAgIHsgVHlwZTogJ3NjaGVkdWxlcicgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==