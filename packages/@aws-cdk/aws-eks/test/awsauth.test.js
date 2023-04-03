"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const util_1 = require("./util");
const lib_1 = require("../lib");
const aws_auth_1 = require("../lib/aws-auth");
/* eslint-disable max-len */
const CLUSTER_VERSION = lib_1.KubernetesVersion.V1_16;
describe('aws auth', () => {
    test('throws when adding a role from a different stack', () => {
        const app = new cdk.App();
        const clusterStack = new cdk.Stack(app, 'ClusterStack');
        const roleStack = new cdk.Stack(app, 'RoleStack');
        const awsAuth = new aws_auth_1.AwsAuth(clusterStack, 'Auth', {
            cluster: new lib_1.Cluster(clusterStack, 'Cluster', { version: lib_1.KubernetesVersion.V1_17 }),
        });
        const role = new iam.Role(roleStack, 'Role', { assumedBy: new iam.AnyPrincipal() });
        expect(() => {
            awsAuth.addRoleMapping(role, { groups: ['group'] });
        }).toThrow('RoleStack/Role should be defined in the scope of the ClusterStack stack to prevent circular dependencies');
    });
    test('throws when adding a user from a different stack', () => {
        const app = new cdk.App();
        const clusterStack = new cdk.Stack(app, 'ClusterStack');
        const userStack = new cdk.Stack(app, 'UserStack');
        const awsAuth = new aws_auth_1.AwsAuth(clusterStack, 'Auth', {
            cluster: new lib_1.Cluster(clusterStack, 'Cluster', { version: lib_1.KubernetesVersion.V1_17 }),
        });
        const user = new iam.User(userStack, 'User');
        expect(() => {
            awsAuth.addUserMapping(user, { groups: ['group'] });
        }).toThrow('UserStack/User should be defined in the scope of the ClusterStack stack to prevent circular dependencies');
    });
    test('empty aws-auth', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'cluster', { version: CLUSTER_VERSION, prune: false });
        // WHEN
        new aws_auth_1.AwsAuth(stack, 'AwsAuth', { cluster });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: JSON.stringify([{
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    metadata: { name: 'aws-auth', namespace: 'kube-system' },
                    data: { mapRoles: '[]', mapUsers: '[]', mapAccounts: '[]' },
                }]),
        });
    });
    test('addRoleMapping and addUserMapping can be used to define the aws-auth ConfigMap', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });
        const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
        const user = new iam.User(stack, 'user');
        // WHEN
        cluster.awsAuth.addRoleMapping(role, { groups: ['role-group1'], username: 'roleuser' });
        cluster.awsAuth.addRoleMapping(role, { groups: ['role-group2', 'role-group3'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'], username: 'foo' });
        cluster.awsAuth.addAccount('112233');
        cluster.awsAuth.addAccount('5566776655');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs(lib_1.KubernetesManifest.RESOURCE_TYPE, 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterNodegroupDefaultCapacityNodeGroupRole55953B04',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"roleuser\\",\\"groups\\":[\\"role-group1\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"role-group2\\",\\"role-group3\\"]}]","mapUsers":"[{\\"userarn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'user2C2B57AE',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'user2C2B57AE',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]},{\\"userarn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'user2C2B57AE',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"foo\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]}]","mapAccounts":"[\\"112233\\",\\"5566776655\\"]"}}]',
                    ],
                ],
            },
        });
    });
    test('imported users and roles can be also be used', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION });
        const role = iam.Role.fromRoleArn(stack, 'imported-role', 'arn:aws:iam::123456789012:role/S3Access');
        const user = iam.User.fromUserName(stack, 'import-user', 'MyUserName');
        // WHEN
        cluster.awsAuth.addRoleMapping(role, { groups: ['group1'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['group2'] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterNodegroupDefaultCapacityNodeGroupRole55953B04',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"username\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"groups\\":[\\"group1\\"]}]","mapUsers":"[{\\"userarn\\":\\"arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':user/MyUserName\\",\\"username\\":\\"arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':user/MyUserName\\",\\"groups\\":[\\"group2\\"]}]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('addMastersRole after addNodegroup correctly', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'Cluster', { version: CLUSTER_VERSION, prune: false });
        cluster.addNodegroupCapacity('NG');
        const role = iam.Role.fromRoleArn(stack, 'imported-role', 'arn:aws:iam::123456789012:role/S3Access');
        // WHEN
        cluster.awsAuth.addMastersRole(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesManifest.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterMastersRole9AA35625',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterNodegroupDefaultCapacityNodeGroupRole55953B04',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterNodegroupNGNodeGroupRole7C078920',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"username\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"groups\\":[\\"system:masters\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
            ClusterName: {
                Ref: 'Cluster9EE0221C',
            },
            RoleArn: {
                'Fn::GetAtt': [
                    'ClusterCreationRole360249B6',
                    'Arn',
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzYXV0aC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzYXV0aC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsaUNBQTBDO0FBQzFDLGdDQUF3RTtBQUN4RSw4Q0FBMEM7QUFFMUMsNEJBQTRCO0FBRTVCLE1BQU0sZUFBZSxHQUFHLHVCQUFpQixDQUFDLEtBQUssQ0FBQztBQUVoRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDeEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFPLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRTtZQUNoRCxPQUFPLEVBQUUsSUFBSSxhQUFPLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSx1QkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNwRixDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFcEYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFD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QztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IHRlc3RGaXh0dXJlTm9WcGMgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2x1c3RlciwgS3ViZXJuZXRlc01hbmlmZXN0LCBLdWJlcm5ldGVzVmVyc2lvbiB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBd3NBdXRoIH0gZnJvbSAnLi4vbGliL2F3cy1hdXRoJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5jb25zdCBDTFVTVEVSX1ZFUlNJT04gPSBLdWJlcm5ldGVzVmVyc2lvbi5WMV8xNjtcblxuZGVzY3JpYmUoJ2F3cyBhdXRoJywgKCkgPT4ge1xuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhZGRpbmcgYSByb2xlIGZyb20gYSBkaWZmZXJlbnQgc3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBjbHVzdGVyU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0NsdXN0ZXJTdGFjaycpO1xuICAgIGNvbnN0IHJvbGVTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUm9sZVN0YWNrJyk7XG4gICAgY29uc3QgYXdzQXV0aCA9IG5ldyBBd3NBdXRoKGNsdXN0ZXJTdGFjaywgJ0F1dGgnLCB7XG4gICAgICBjbHVzdGVyOiBuZXcgQ2x1c3RlcihjbHVzdGVyU3RhY2ssICdDbHVzdGVyJywgeyB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8xNyB9KSxcbiAgICB9KTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHJvbGVTdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhd3NBdXRoLmFkZFJvbGVNYXBwaW5nKHJvbGUsIHsgZ3JvdXBzOiBbJ2dyb3VwJ10gfSk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdSb2xlU3RhY2svUm9sZSBzaG91bGQgYmUgZGVmaW5lZCBpbiB0aGUgc2NvcGUgb2YgdGhlIENsdXN0ZXJTdGFjayBzdGFjayB0byBwcmV2ZW50IGNpcmN1bGFyIGRlcGVuZGVuY2llcycsXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gYWRkaW5nIGEgdXNlciBmcm9tIGEgZGlmZmVyZW50IHN0YWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3QgY2x1c3RlclN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdDbHVzdGVyU3RhY2snKTtcbiAgICBjb25zdCB1c2VyU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1VzZXJTdGFjaycpO1xuICAgIGNvbnN0IGF3c0F1dGggPSBuZXcgQXdzQXV0aChjbHVzdGVyU3RhY2ssICdBdXRoJywge1xuICAgICAgY2x1c3RlcjogbmV3IENsdXN0ZXIoY2x1c3RlclN0YWNrLCAnQ2x1c3RlcicsIHsgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTcgfSksXG4gICAgfSk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcih1c2VyU3RhY2ssICdVc2VyJyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXdzQXV0aC5hZGRVc2VyTWFwcGluZyh1c2VyLCB7IGdyb3VwczogWydncm91cCddIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAnVXNlclN0YWNrL1VzZXIgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhlIHNjb3BlIG9mIHRoZSBDbHVzdGVyU3RhY2sgc3RhY2sgdG8gcHJldmVudCBjaXJjdWxhciBkZXBlbmRlbmNpZXMnLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtcHR5IGF3cy1hdXRoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ2NsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiwgcHJ1bmU6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBd3NBdXRoKHN0YWNrLCAnQXdzQXV0aCcsIHsgY2x1c3RlciB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFt7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBtZXRhZGF0YTogeyBuYW1lOiAnYXdzLWF1dGgnLCBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScgfSxcbiAgICAgICAgZGF0YTogeyBtYXBSb2xlczogJ1tdJywgbWFwVXNlcnM6ICdbXScsIG1hcEFjY291bnRzOiAnW10nIH0sXG4gICAgICB9XSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFJvbGVNYXBwaW5nIGFuZCBhZGRVc2VyTWFwcGluZyBjYW4gYmUgdXNlZCB0byBkZWZpbmUgdGhlIGF3cy1hdXRoIENvbmZpZ01hcCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAncm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpIH0pO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICd1c2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZFJvbGVNYXBwaW5nKHJvbGUsIHsgZ3JvdXBzOiBbJ3JvbGUtZ3JvdXAxJ10sIHVzZXJuYW1lOiAncm9sZXVzZXInIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRSb2xlTWFwcGluZyhyb2xlLCB7IGdyb3VwczogWydyb2xlLWdyb3VwMicsICdyb2xlLWdyb3VwMyddIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRVc2VyTWFwcGluZyh1c2VyLCB7IGdyb3VwczogWyd1c2VyLWdyb3VwMScsICd1c2VyLWdyb3VwMiddIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRVc2VyTWFwcGluZyh1c2VyLCB7IGdyb3VwczogWyd1c2VyLWdyb3VwMScsICd1c2VyLWdyb3VwMiddLCB1c2VybmFtZTogJ2ZvbycgfSk7XG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZEFjY291bnQoJzExMjIzMycpO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRBY2NvdW50KCc1NTY2Nzc2NjU1Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiQ29uZmlnTWFwXCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcImF3cy1hdXRoXCIsXCJuYW1lc3BhY2VcIjpcImt1YmUtc3lzdGVtXCJ9LFwiZGF0YVwiOntcIm1hcFJvbGVzXCI6XCJbe1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDbHVzdGVyTWFzdGVyc1JvbGU5QUEzNTYyNScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTptYXN0ZXJzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJOb2RlZ3JvdXBEZWZhdWx0Q2FwYWNpdHlOb2RlR3JvdXBSb2xlNTU5NTNCMDQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwic3lzdGVtOm5vZGU6e3tFQzJQcml2YXRlRE5TTmFtZX19XFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOmJvb3RzdHJhcHBlcnNcXFxcXCIsXFxcXFwic3lzdGVtOm5vZGVzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3JvbGVDN0I3RTc3NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJyb2xldXNlclxcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInJvbGUtZ3JvdXAxXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3JvbGVDN0I3RTc3NScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAncm9sZUM3QjdFNzc1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwicm9sZS1ncm91cDJcXFxcXCIsXFxcXFwicm9sZS1ncm91cDNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbe1xcXFxcInVzZXJhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3VzZXIyQzJCNTdBRScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAndXNlcjJDMkI1N0FFJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwidXNlci1ncm91cDFcXFxcXCIsXFxcXFwidXNlci1ncm91cDJcXFxcXCJdfSx7XFxcXFwidXNlcmFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAndXNlcjJDMkI1N0FFJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcImZvb1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInVzZXItZ3JvdXAxXFxcXFwiLFxcXFxcInVzZXItZ3JvdXAyXFxcXFwiXX1dXCIsXCJtYXBBY2NvdW50c1wiOlwiW1xcXFxcIjExMjIzM1xcXFxcIixcXFxcXCI1NTY2Nzc2NjU1XFxcXFwiXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgdXNlcnMgYW5kIHJvbGVzIGNhbiBiZSBhbHNvIGJlIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ2ltcG9ydGVkLXJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1MzQWNjZXNzJyk7XG4gICAgY29uc3QgdXNlciA9IGlhbS5Vc2VyLmZyb21Vc2VyTmFtZShzdGFjaywgJ2ltcG9ydC11c2VyJywgJ015VXNlck5hbWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmF3c0F1dGguYWRkUm9sZU1hcHBpbmcocm9sZSwgeyBncm91cHM6IFsnZ3JvdXAxJ10gfSk7XG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZFVzZXJNYXBwaW5nKHVzZXIsIHsgZ3JvdXBzOiBbJ2dyb3VwMiddIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiQ29uZmlnTWFwXCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcImF3cy1hdXRoXCIsXCJuYW1lc3BhY2VcIjpcImt1YmUtc3lzdGVtXCIsXCJsYWJlbHNcIjp7XCJhd3MuY2RrLmVrcy9wcnVuZS1jODJlY2VjYWJmNzdlMDNlMzU5MGYyZWJlMDJhZGJhODY0MWQxYjNlNzZcIjpcIlwifX0sXCJkYXRhXCI6e1wibWFwUm9sZXNcIjpcIlt7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3Rlck1hc3RlcnNSb2xlOUFBMzU2MjUnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOm1hc3RlcnNcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3Rlck5vZGVncm91cERlZmF1bHRDYXBhY2l0eU5vZGVHcm91cFJvbGU1NTk1M0IwNCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX1cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJzeXN0ZW06Ym9vdHN0cmFwcGVyc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZXNcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCJhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvUzNBY2Nlc3NcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1MzQWNjZXNzXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwiZ3JvdXAxXFxcXFwiXX1dXCIsXCJtYXBVc2Vyc1wiOlwiW3tcXFxcXCJ1c2VyYXJuXFxcXFwiOlxcXFxcImFybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnVzZXIvTXlVc2VyTmFtZVxcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzp1c2VyL015VXNlck5hbWVcXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJncm91cDJcXFxcXCJdfV1cIixcIm1hcEFjY291bnRzXCI6XCJbXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTWFzdGVyc1JvbGUgYWZ0ZXIgYWRkTm9kZWdyb3VwIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sIHBydW5lOiBmYWxzZSB9KTtcbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdORycpO1xuICAgIGNvbnN0IHJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ2ltcG9ydGVkLXJvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1MzQWNjZXNzJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZE1hc3RlcnNSb2xlKHJvbGUpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiQ29uZmlnTWFwXCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcImF3cy1hdXRoXCIsXCJuYW1lc3BhY2VcIjpcImt1YmUtc3lzdGVtXCJ9LFwiZGF0YVwiOntcIm1hcFJvbGVzXCI6XCJbe1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJNYXN0ZXJzUm9sZTlBQTM1NjI1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDbHVzdGVyTWFzdGVyc1JvbGU5QUEzNTYyNScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTptYXN0ZXJzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJOb2RlZ3JvdXBEZWZhdWx0Q2FwYWNpdHlOb2RlR3JvdXBSb2xlNTU5NTNCMDQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwic3lzdGVtOm5vZGU6e3tFQzJQcml2YXRlRE5TTmFtZX19XFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOmJvb3RzdHJhcHBlcnNcXFxcXCIsXFxcXFwic3lzdGVtOm5vZGVzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJOb2RlZ3JvdXBOR05vZGVHcm91cFJvbGU3QzA3ODkyMCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX1cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJzeXN0ZW06Ym9vdHN0cmFwcGVyc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZXNcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCJhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvUzNBY2Nlc3NcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL1MzQWNjZXNzXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwic3lzdGVtOm1hc3RlcnNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbXVwiLFwibWFwQWNjb3VudHNcIjpcIltdXCJ9fV0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgQ2x1c3Rlck5hbWU6IHtcbiAgICAgICAgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgIH0sXG4gICAgICBSb2xlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdDbHVzdGVyQ3JlYXRpb25Sb2xlMzYwMjQ5QjYnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==