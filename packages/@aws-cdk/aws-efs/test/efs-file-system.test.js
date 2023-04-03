"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
let stack = new core_1.Stack();
let vpc = new ec2.Vpc(stack, 'VPC');
beforeEach(() => {
    stack = new core_1.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
});
test('encryption is enabled by default', () => {
    const customStack = new core_1.Stack();
    const customVpc = new ec2.Vpc(customStack, 'VPC');
    new lib_1.FileSystem(customVpc, 'EfsFileSystem', {
        vpc: customVpc,
    });
    assertions_1.Template.fromStack(customStack).hasResourceProperties('AWS::EFS::FileSystem', {
        Encrypted: true,
    });
});
test('default file system is created correctly', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    // THEN
    const assertions = assertions_1.Template.fromStack(stack);
    assertions.hasResource('AWS::EFS::FileSystem', {
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
    });
    assertions.resourceCountIs('AWS::EFS::MountTarget', 2);
    assertions.resourceCountIs('AWS::EC2::SecurityGroup', 1);
});
test('unencrypted file system is created correctly with default KMS', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: false,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        Encrypted: false,
    });
});
test('encrypted file system is created correctly with default KMS', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: true,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        Encrypted: true,
    });
});
test('encrypted file system is created correctly with custom KMS', () => {
    const key = new kms.Key(stack, 'customKeyFS');
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: true,
        kmsKey: key,
    });
    // THEN
    /*
     * CDK appends 8-digit MD5 hash of the resource path to the logical Id of the resource in order to make sure
     * that the id is unique across multiple stacks. There isnt a direct way to identify the exact name of the resource
     * in generated CDK, hence hardcoding the MD5 hash here for assertion. Assumption is that the path of the Key wont
     * change in this UT. Checked the unique id by generating the cloud formation stack.
     */
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        Encrypted: true,
        KmsKeyId: {
            'Fn::GetAtt': [
                'customKeyFSDDB87C6D',
                'Arn',
            ],
        },
    });
});
test('file system is created correctly with a life cycle property', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        lifecyclePolicy: lib_1.LifecyclePolicy.AFTER_7_DAYS,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        LifecyclePolicies: [{
                TransitionToIA: 'AFTER_7_DAYS',
            }],
    });
});
test('file system is created correctly with a life cycle property and out of infrequent access property', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        lifecyclePolicy: lib_1.LifecyclePolicy.AFTER_7_DAYS,
        outOfInfrequentAccessPolicy: lib_1.OutOfInfrequentAccessPolicy.AFTER_1_ACCESS,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        LifecyclePolicies: [
            {
                TransitionToIA: 'AFTER_7_DAYS',
            },
            {
                TransitionToPrimaryStorageClass: 'AFTER_1_ACCESS',
            },
        ],
    });
});
test('LifecyclePolicies should be disabled when lifecyclePolicy and outInfrequentAccessPolicy are not specified', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        LifecyclePolicies: assertions_1.Match.absent(),
    });
});
test('file system is created correctly with performance mode', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        performanceMode: lib_1.PerformanceMode.MAX_IO,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        PerformanceMode: 'maxIO',
    });
});
test('file system is created correctly with bursting throughput mode', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: lib_1.ThroughputMode.BURSTING,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        ThroughputMode: 'bursting',
    });
});
test('file system is created correctly with elastic throughput mode', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: lib_1.ThroughputMode.ELASTIC,
        performanceMode: lib_1.PerformanceMode.GENERAL_PURPOSE,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        ThroughputMode: 'elastic',
    });
});
test('Exception when throughput mode is set to ELASTIC, performance mode cannot be MaxIO', () => {
    expect(() => {
        new lib_1.FileSystem(stack, 'EfsFileSystem', {
            vpc,
            throughputMode: lib_1.ThroughputMode.ELASTIC,
            performanceMode: lib_1.PerformanceMode.MAX_IO,
        });
    }).toThrowError(/ThroughputMode ELASTIC is not supported for file systems with performanceMode MAX_IO/);
});
test('Exception when throughput mode is set to PROVISIONED, but provisioned throughput is not set', () => {
    expect(() => {
        new lib_1.FileSystem(stack, 'EfsFileSystem', {
            vpc,
            throughputMode: lib_1.ThroughputMode.PROVISIONED,
        });
    }).toThrowError(/Property provisionedThroughputPerSecond is required when throughputMode is PROVISIONED/);
});
test('fails when provisioned throughput is less than the valid range', () => {
    expect(() => new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: lib_1.ThroughputMode.PROVISIONED,
        provisionedThroughputPerSecond: core_1.Size.kibibytes(10),
    })).toThrow(/cannot be converted into a whole number/);
});
test('fails when provisioned throughput is not a whole number of mebibytes', () => {
    expect(() => {
        new lib_1.FileSystem(stack, 'EfsFileSystem2', {
            vpc,
            throughputMode: lib_1.ThroughputMode.PROVISIONED,
            provisionedThroughputPerSecond: core_1.Size.kibibytes(2050),
        });
    }).toThrowError(/cannot be converted into a whole number/);
});
test('file system is created correctly with provisioned throughput mode', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: lib_1.ThroughputMode.PROVISIONED,
        provisionedThroughputPerSecond: core_1.Size.mebibytes(5),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        ThroughputMode: 'provisioned',
        ProvisionedThroughputInMibps: 5,
    });
});
test('existing file system is imported correctly using id', () => {
    // WHEN
    const fs = lib_1.FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
        fileSystemId: 'fs123',
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
            allowAllOutbound: false,
        }),
    });
    fs.connections.allowToAnyIpv4(ec2.Port.tcp(443));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
        GroupId: 'sg-123456789',
    });
});
test('existing file system is imported correctly using arn', () => {
    // WHEN
    const arn = stack.formatArn({
        service: 'elasticfilesystem',
        resource: 'file-system',
        resourceName: 'fs-12912923',
    });
    const fs = lib_1.FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
        fileSystemArn: arn,
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
            allowAllOutbound: false,
        }),
    });
    fs.connections.allowToAnyIpv4(ec2.Port.tcp(443));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
        GroupId: 'sg-123456789',
    });
    expect(fs.fileSystemArn).toEqual(arn);
    expect(fs.fileSystemId).toEqual('fs-12912923');
});
test('must throw an error when trying to import a fileSystem without specifying id or arn', () => {
    // WHEN
    expect(() => {
        lib_1.FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
                allowAllOutbound: false,
            }),
        });
    }).toThrow(/One of fileSystemId or fileSystemArn, but not both, must be provided./);
});
test('must throw an error when trying to import a fileSystem specifying both id and arn', () => {
    // WHEN
    const arn = stack.formatArn({
        service: 'elasticfilesystem',
        resource: 'file-system',
        resourceName: 'fs-12912923',
    });
    expect(() => {
        lib_1.FileSystem.fromFileSystemAttributes(stack, 'existingFS', {
            fileSystemArn: arn,
            fileSystemId: 'fs-12343435',
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
                allowAllOutbound: false,
            }),
        });
    }).toThrow(/One of fileSystemId or fileSystemArn, but not both, must be provided./);
});
test('support granting permissions', () => {
    const fileSystem = new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AnyPrincipal(),
    });
    fileSystem.grant(role, 'elasticfilesystem:ClientWrite');
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'elasticfilesystem:ClientWrite',
                    Effect: 'Allow',
                    Resource: {
                        'Fn::GetAtt': [
                            'EfsFileSystem37910666',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        PolicyName: 'RoleDefaultPolicy5FFB7DAB',
        Roles: [
            {
                Ref: 'Role1ABCC5F0',
            },
        ],
    });
});
test('support tags', () => {
    // WHEN
    const fileSystem = new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    core_1.Tags.of(fileSystem).add('Name', 'LookAtMeAndMyFancyTags');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        FileSystemTags: [
            { Key: 'Name', Value: 'LookAtMeAndMyFancyTags' },
        ],
    });
});
test('file system is created correctly when given a name', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        fileSystemName: 'MyNameableFileSystem',
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        FileSystemTags: [
            { Key: 'Name', Value: 'MyNameableFileSystem' },
        ],
    });
});
test('auto-named if none provided', () => {
    // WHEN
    const fileSystem = new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        FileSystemTags: [
            { Key: 'Name', Value: fileSystem.node.path },
        ],
    });
});
test('removalPolicy is DESTROY', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', { vpc, removalPolicy: core_1.RemovalPolicy.DESTROY });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('AWS::EFS::FileSystem', {
        DeletionPolicy: 'Delete',
        UpdateReplacePolicy: 'Delete',
    });
});
test('can specify backup policy', () => {
    // WHEN
    new lib_1.FileSystem(stack, 'EfsFileSystem', { vpc, enableAutomaticBackups: true });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        BackupPolicy: {
            Status: 'ENABLED',
        },
    });
});
test('can create when using a VPC with multiple subnets per availability zone', () => {
    // create a vpc with two subnets in the same availability zone.
    const oneAzVpc = new ec2.Vpc(stack, 'Vpc', {
        maxAzs: 1,
        subnetConfiguration: [{ name: 'One', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }, { name: 'Two', subnetType: ec2.SubnetType.PRIVATE_ISOLATED }],
        natGateways: 0,
    });
    new lib_1.FileSystem(stack, 'EfsFileSystem', {
        vpc: oneAzVpc,
    });
    // make sure only one mount target is created.
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EFS::MountTarget', 1);
});
test('can specify file system policy', () => {
    // WHEN
    const myFileSystemPolicy = new iam.PolicyDocument({
        statements: [new iam.PolicyStatement({
                actions: [
                    'elasticfilesystem:ClientWrite',
                    'elasticfilesystem:ClientMount',
                ],
                principals: [new iam.ArnPrincipal('arn:aws:iam::111122223333:role/Testing_Role')],
                resources: ['arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd'],
                conditions: {
                    Bool: {
                        'elasticfilesystem:AccessedViaMountTarget': 'true',
                    },
                },
            })],
    });
    new lib_1.FileSystem(stack, 'EfsFileSystem', { vpc, fileSystemPolicy: myFileSystemPolicy });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EFS::FileSystem', {
        FileSystemPolicy: {
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: {
                        AWS: 'arn:aws:iam::111122223333:role/Testing_Role',
                    },
                    Action: [
                        'elasticfilesystem:ClientWrite',
                        'elasticfilesystem:ClientMount',
                    ],
                    Resource: 'arn:aws:elasticfilesystem:us-east-2:111122223333:file-system/fs-1234abcd',
                    Condition: {
                        Bool: {
                            'elasticfilesystem:AccessedViaMountTarget': 'true',
                        },
                    },
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWZzLWZpbGUtc3lzdGVtLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlZnMtZmlsZS1zeXN0ZW0udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBaUU7QUFDakUsZ0NBQW1IO0FBRW5ILElBQUksS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUVwQyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDcEIsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO0lBQzVDLE1BQU0sV0FBVyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFaEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRCxJQUFJLGdCQUFVLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRTtRQUN6QyxHQUFHLEVBQUUsU0FBUztLQUNmLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFO1FBQzVFLFNBQVMsRUFBRSxJQUFJO0tBQ2hCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxPQUFPO0lBQ1AsSUFBSSxnQkFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7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Q2hCLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsT0FBTztvQkFDZixTQUFTLEVBQUU7d0JBQ1QsR0FBRyxFQUFFLDZDQUE2QztxQkFDbkQ7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLCtCQUErQjt3QkFDL0IsK0JBQStCO3FCQUNoQztvQkFDRCxRQUFRLEVBQUUsMEVBQTBFO29CQUNwRixTQUFTLEVBQUU7d0JBQ1QsSUFBSSxFQUFFOzRCQUNKLDBDQUEwQyxFQUFFLE1BQU07eUJBQ25EO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBTaXplLCBTdGFjaywgVGFncyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSwgTGlmZWN5Y2xlUG9saWN5LCBQZXJmb3JtYW5jZU1vZGUsIFRocm91Z2hwdXRNb2RlLCBPdXRPZkluZnJlcXVlbnRBY2Nlc3NQb2xpY3kgfSBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2sgPSBuZXcgU3RhY2soKTtcbmxldCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbn0pO1xuXG50ZXN0KCdlbmNyeXB0aW9uIGlzIGVuYWJsZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgY29uc3QgY3VzdG9tU3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBjdXN0b21WcGMgPSBuZXcgZWMyLlZwYyhjdXN0b21TdGFjaywgJ1ZQQycpO1xuICBuZXcgRmlsZVN5c3RlbShjdXN0b21WcGMsICdFZnNGaWxlU3lzdGVtJywge1xuICAgIHZwYzogY3VzdG9tVnBjLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soY3VzdG9tU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFRlM6OkZpbGVTeXN0ZW0nLCB7XG4gICAgRW5jcnlwdGVkOiB0cnVlLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdkZWZhdWx0IGZpbGUgc3lzdGVtIGlzIGNyZWF0ZWQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHtcbiAgICB2cGMsXG4gIH0pO1xuICAvLyBUSEVOXG4gIGNvbnN0IGFzc2VydGlvbnMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICBhc3NlcnRpb25zLmhhc1Jlc291cmNlKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gIH0pO1xuICBhc3NlcnRpb25zLnJlc291cmNlQ291bnRJcygnQVdTOjpFRlM6Ok1vdW50VGFyZ2V0JywgMik7XG4gIGFzc2VydGlvbnMucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cCcsIDEpO1xufSk7XG5cbnRlc3QoJ3VuZW5jcnlwdGVkIGZpbGUgc3lzdGVtIGlzIGNyZWF0ZWQgY29ycmVjdGx5IHdpdGggZGVmYXVsdCBLTVMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgIHZwYyxcbiAgICBlbmNyeXB0ZWQ6IGZhbHNlLFxuICB9KTtcbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFRlM6OkZpbGVTeXN0ZW0nLCB7XG4gICAgRW5jcnlwdGVkOiBmYWxzZSxcbiAgfSk7XG59KTtcblxudGVzdCgnZW5jcnlwdGVkIGZpbGUgc3lzdGVtIGlzIGNyZWF0ZWQgY29ycmVjdGx5IHdpdGggZGVmYXVsdCBLTVMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgIHZwYyxcbiAgICBlbmNyeXB0ZWQ6IHRydWUsXG4gIH0pO1xuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2VuY3J5cHRlZCBmaWxlIHN5c3RlbSBpcyBjcmVhdGVkIGNvcnJlY3RseSB3aXRoIGN1c3RvbSBLTVMnLCAoKSA9PiB7XG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnY3VzdG9tS2V5RlMnKTtcblxuICAvLyBXSEVOXG4gIG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHtcbiAgICB2cGMsXG4gICAgZW5jcnlwdGVkOiB0cnVlLFxuICAgIGttc0tleToga2V5LFxuICB9KTtcbiAgLy8gVEhFTlxuXG4gIC8qXG4gICAqIENESyBhcHBlbmRzIDgtZGlnaXQgTUQ1IGhhc2ggb2YgdGhlIHJlc291cmNlIHBhdGggdG8gdGhlIGxvZ2ljYWwgSWQgb2YgdGhlIHJlc291cmNlIGluIG9yZGVyIHRvIG1ha2Ugc3VyZVxuICAgKiB0aGF0IHRoZSBpZCBpcyB1bmlxdWUgYWNyb3NzIG11bHRpcGxlIHN0YWNrcy4gVGhlcmUgaXNudCBhIGRpcmVjdCB3YXkgdG8gaWRlbnRpZnkgdGhlIGV4YWN0IG5hbWUgb2YgdGhlIHJlc291cmNlXG4gICAqIGluIGdlbmVyYXRlZCBDREssIGhlbmNlIGhhcmRjb2RpbmcgdGhlIE1ENSBoYXNoIGhlcmUgZm9yIGFzc2VydGlvbi4gQXNzdW1wdGlvbiBpcyB0aGF0IHRoZSBwYXRoIG9mIHRoZSBLZXkgd29udFxuICAgKiBjaGFuZ2UgaW4gdGhpcyBVVC4gQ2hlY2tlZCB0aGUgdW5pcXVlIGlkIGJ5IGdlbmVyYXRpbmcgdGhlIGNsb3VkIGZvcm1hdGlvbiBzdGFjay5cbiAgICovXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBFbmNyeXB0ZWQ6IHRydWUsXG4gICAgS21zS2V5SWQ6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnY3VzdG9tS2V5RlNEREI4N0M2RCcsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmaWxlIHN5c3RlbSBpcyBjcmVhdGVkIGNvcnJlY3RseSB3aXRoIGEgbGlmZSBjeWNsZSBwcm9wZXJ0eScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICAgIGxpZmVjeWNsZVBvbGljeTogTGlmZWN5Y2xlUG9saWN5LkFGVEVSXzdfREFZUyxcbiAgfSk7XG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIExpZmVjeWNsZVBvbGljaWVzOiBbe1xuICAgICAgVHJhbnNpdGlvblRvSUE6ICdBRlRFUl83X0RBWVMnLFxuICAgIH1dLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmaWxlIHN5c3RlbSBpcyBjcmVhdGVkIGNvcnJlY3RseSB3aXRoIGEgbGlmZSBjeWNsZSBwcm9wZXJ0eSBhbmQgb3V0IG9mIGluZnJlcXVlbnQgYWNjZXNzIHByb3BlcnR5JywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHtcbiAgICB2cGMsXG4gICAgbGlmZWN5Y2xlUG9saWN5OiBMaWZlY3ljbGVQb2xpY3kuQUZURVJfN19EQVlTLFxuICAgIG91dE9mSW5mcmVxdWVudEFjY2Vzc1BvbGljeTogT3V0T2ZJbmZyZXF1ZW50QWNjZXNzUG9saWN5LkFGVEVSXzFfQUNDRVNTLFxuICB9KTtcbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFRlM6OkZpbGVTeXN0ZW0nLCB7XG4gICAgTGlmZWN5Y2xlUG9saWNpZXM6IFtcbiAgICAgIHtcbiAgICAgICAgVHJhbnNpdGlvblRvSUE6ICdBRlRFUl83X0RBWVMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgVHJhbnNpdGlvblRvUHJpbWFyeVN0b3JhZ2VDbGFzczogJ0FGVEVSXzFfQUNDRVNTJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnTGlmZWN5Y2xlUG9saWNpZXMgc2hvdWxkIGJlIGRpc2FibGVkIHdoZW4gbGlmZWN5Y2xlUG9saWN5IGFuZCBvdXRJbmZyZXF1ZW50QWNjZXNzUG9saWN5IGFyZSBub3Qgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHtcbiAgICB2cGMsXG4gIH0pO1xuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBMaWZlY3ljbGVQb2xpY2llczogTWF0Y2guYWJzZW50KCksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZpbGUgc3lzdGVtIGlzIGNyZWF0ZWQgY29ycmVjdGx5IHdpdGggcGVyZm9ybWFuY2UgbW9kZScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICAgIHBlcmZvcm1hbmNlTW9kZTogUGVyZm9ybWFuY2VNb2RlLk1BWF9JTyxcbiAgfSk7XG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIFBlcmZvcm1hbmNlTW9kZTogJ21heElPJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZmlsZSBzeXN0ZW0gaXMgY3JlYXRlZCBjb3JyZWN0bHkgd2l0aCBidXJzdGluZyB0aHJvdWdocHV0IG1vZGUnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgIHZwYyxcbiAgICB0aHJvdWdocHV0TW9kZTogVGhyb3VnaHB1dE1vZGUuQlVSU1RJTkcsXG4gIH0pO1xuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBUaHJvdWdocHV0TW9kZTogJ2J1cnN0aW5nJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZmlsZSBzeXN0ZW0gaXMgY3JlYXRlZCBjb3JyZWN0bHkgd2l0aCBlbGFzdGljIHRocm91Z2hwdXQgbW9kZScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICAgIHRocm91Z2hwdXRNb2RlOiBUaHJvdWdocHV0TW9kZS5FTEFTVElDLFxuICAgIHBlcmZvcm1hbmNlTW9kZTogUGVyZm9ybWFuY2VNb2RlLkdFTkVSQUxfUFVSUE9TRSxcbiAgfSk7XG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIFRocm91Z2hwdXRNb2RlOiAnZWxhc3RpYycsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0V4Y2VwdGlvbiB3aGVuIHRocm91Z2hwdXQgbW9kZSBpcyBzZXQgdG8gRUxBU1RJQywgcGVyZm9ybWFuY2UgbW9kZSBjYW5ub3QgYmUgTWF4SU8nLCAoKSA9PiB7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgICAgdnBjLFxuICAgICAgdGhyb3VnaHB1dE1vZGU6IFRocm91Z2hwdXRNb2RlLkVMQVNUSUMsXG4gICAgICBwZXJmb3JtYW5jZU1vZGU6IFBlcmZvcm1hbmNlTW9kZS5NQVhfSU8sXG4gICAgfSk7XG4gIH0pLnRvVGhyb3dFcnJvcigvVGhyb3VnaHB1dE1vZGUgRUxBU1RJQyBpcyBub3Qgc3VwcG9ydGVkIGZvciBmaWxlIHN5c3RlbXMgd2l0aCBwZXJmb3JtYW5jZU1vZGUgTUFYX0lPLyk7XG59KTtcblxudGVzdCgnRXhjZXB0aW9uIHdoZW4gdGhyb3VnaHB1dCBtb2RlIGlzIHNldCB0byBQUk9WSVNJT05FRCwgYnV0IHByb3Zpc2lvbmVkIHRocm91Z2hwdXQgaXMgbm90IHNldCcsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgICB2cGMsXG4gICAgICB0aHJvdWdocHV0TW9kZTogVGhyb3VnaHB1dE1vZGUuUFJPVklTSU9ORUQsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3dFcnJvcigvUHJvcGVydHkgcHJvdmlzaW9uZWRUaHJvdWdocHV0UGVyU2Vjb25kIGlzIHJlcXVpcmVkIHdoZW4gdGhyb3VnaHB1dE1vZGUgaXMgUFJPVklTSU9ORUQvKTtcbn0pO1xuXG50ZXN0KCdmYWlscyB3aGVuIHByb3Zpc2lvbmVkIHRocm91Z2hwdXQgaXMgbGVzcyB0aGFuIHRoZSB2YWxpZCByYW5nZScsICgpID0+IHtcbiAgZXhwZWN0KCgpID0+IG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHtcbiAgICB2cGMsXG4gICAgdGhyb3VnaHB1dE1vZGU6IFRocm91Z2hwdXRNb2RlLlBST1ZJU0lPTkVELFxuICAgIHByb3Zpc2lvbmVkVGhyb3VnaHB1dFBlclNlY29uZDogU2l6ZS5raWJpYnl0ZXMoMTApLFxuICB9KSkudG9UaHJvdygvY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIGEgd2hvbGUgbnVtYmVyLyk7XG59KTtcblxudGVzdCgnZmFpbHMgd2hlbiBwcm92aXNpb25lZCB0aHJvdWdocHV0IGlzIG5vdCBhIHdob2xlIG51bWJlciBvZiBtZWJpYnl0ZXMnLCAoKSA9PiB7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtMicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHRocm91Z2hwdXRNb2RlOiBUaHJvdWdocHV0TW9kZS5QUk9WSVNJT05FRCxcbiAgICAgIHByb3Zpc2lvbmVkVGhyb3VnaHB1dFBlclNlY29uZDogU2l6ZS5raWJpYnl0ZXMoMjA1MCksXG4gICAgfSk7XG4gIH0pLnRvVGhyb3dFcnJvcigvY2Fubm90IGJlIGNvbnZlcnRlZCBpbnRvIGEgd2hvbGUgbnVtYmVyLyk7XG59KTtcblxudGVzdCgnZmlsZSBzeXN0ZW0gaXMgY3JlYXRlZCBjb3JyZWN0bHkgd2l0aCBwcm92aXNpb25lZCB0aHJvdWdocHV0IG1vZGUnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgIHZwYyxcbiAgICB0aHJvdWdocHV0TW9kZTogVGhyb3VnaHB1dE1vZGUuUFJPVklTSU9ORUQsXG4gICAgcHJvdmlzaW9uZWRUaHJvdWdocHV0UGVyU2Vjb25kOiBTaXplLm1lYmlieXRlcyg1KSxcbiAgfSk7XG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIFRocm91Z2hwdXRNb2RlOiAncHJvdmlzaW9uZWQnLFxuICAgIFByb3Zpc2lvbmVkVGhyb3VnaHB1dEluTWlicHM6IDUsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2V4aXN0aW5nIGZpbGUgc3lzdGVtIGlzIGltcG9ydGVkIGNvcnJlY3RseSB1c2luZyBpZCcsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBmcyA9IEZpbGVTeXN0ZW0uZnJvbUZpbGVTeXN0ZW1BdHRyaWJ1dGVzKHN0YWNrLCAnZXhpc3RpbmdGUycsIHtcbiAgICBmaWxlU3lzdGVtSWQ6ICdmczEyMycsXG4gICAgc2VjdXJpdHlHcm91cDogZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzdGFjaywgJ1NHJywgJ3NnLTEyMzQ1Njc4OScsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgIH0pLFxuICB9KTtcblxuICBmcy5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC50Y3AoNDQzKSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBFZ3Jlc3MnLCB7XG4gICAgR3JvdXBJZDogJ3NnLTEyMzQ1Njc4OScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2V4aXN0aW5nIGZpbGUgc3lzdGVtIGlzIGltcG9ydGVkIGNvcnJlY3RseSB1c2luZyBhcm4nLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgY29uc3QgYXJuID0gc3RhY2suZm9ybWF0QXJuKHtcbiAgICBzZXJ2aWNlOiAnZWxhc3RpY2ZpbGVzeXN0ZW0nLFxuICAgIHJlc291cmNlOiAnZmlsZS1zeXN0ZW0nLFxuICAgIHJlc291cmNlTmFtZTogJ2ZzLTEyOTEyOTIzJyxcbiAgfSk7XG4gIGNvbnN0IGZzID0gRmlsZVN5c3RlbS5mcm9tRmlsZVN5c3RlbUF0dHJpYnV0ZXMoc3RhY2ssICdleGlzdGluZ0ZTJywge1xuICAgIGZpbGVTeXN0ZW1Bcm46IGFybixcbiAgICBzZWN1cml0eUdyb3VwOiBlYzIuU2VjdXJpdHlHcm91cC5mcm9tU2VjdXJpdHlHcm91cElkKHN0YWNrLCAnU0cnLCAnc2ctMTIzNDU2Nzg5Jywge1xuICAgICAgYWxsb3dBbGxPdXRib3VuZDogZmFsc2UsXG4gICAgfSksXG4gIH0pO1xuXG4gIGZzLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LnRjcCg0NDMpKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEVncmVzcycsIHtcbiAgICBHcm91cElkOiAnc2ctMTIzNDU2Nzg5JyxcbiAgfSk7XG5cbiAgZXhwZWN0KGZzLmZpbGVTeXN0ZW1Bcm4pLnRvRXF1YWwoYXJuKTtcbiAgZXhwZWN0KGZzLmZpbGVTeXN0ZW1JZCkudG9FcXVhbCgnZnMtMTI5MTI5MjMnKTtcbn0pO1xuXG50ZXN0KCdtdXN0IHRocm93IGFuIGVycm9yIHdoZW4gdHJ5aW5nIHRvIGltcG9ydCBhIGZpbGVTeXN0ZW0gd2l0aG91dCBzcGVjaWZ5aW5nIGlkIG9yIGFybicsICgpID0+IHtcbiAgLy8gV0hFTlxuICBleHBlY3QoKCkgPT4ge1xuICAgIEZpbGVTeXN0ZW0uZnJvbUZpbGVTeXN0ZW1BdHRyaWJ1dGVzKHN0YWNrLCAnZXhpc3RpbmdGUycsIHtcbiAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdTRycsICdzZy0xMjM0NTY3ODknLCB7XG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL09uZSBvZiBmaWxlU3lzdGVtSWQgb3IgZmlsZVN5c3RlbUFybiwgYnV0IG5vdCBib3RoLCBtdXN0IGJlIHByb3ZpZGVkLi8pO1xufSk7XG5cbnRlc3QoJ211c3QgdGhyb3cgYW4gZXJyb3Igd2hlbiB0cnlpbmcgdG8gaW1wb3J0IGEgZmlsZVN5c3RlbSBzcGVjaWZ5aW5nIGJvdGggaWQgYW5kIGFybicsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBhcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgIHNlcnZpY2U6ICdlbGFzdGljZmlsZXN5c3RlbScsXG4gICAgcmVzb3VyY2U6ICdmaWxlLXN5c3RlbScsXG4gICAgcmVzb3VyY2VOYW1lOiAnZnMtMTI5MTI5MjMnLFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIEZpbGVTeXN0ZW0uZnJvbUZpbGVTeXN0ZW1BdHRyaWJ1dGVzKHN0YWNrLCAnZXhpc3RpbmdGUycsIHtcbiAgICAgIGZpbGVTeXN0ZW1Bcm46IGFybixcbiAgICAgIGZpbGVTeXN0ZW1JZDogJ2ZzLTEyMzQzNDM1JyxcbiAgICAgIHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwLmZyb21TZWN1cml0eUdyb3VwSWQoc3RhY2ssICdTRycsICdzZy0xMjM0NTY3ODknLCB7XG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL09uZSBvZiBmaWxlU3lzdGVtSWQgb3IgZmlsZVN5c3RlbUFybiwgYnV0IG5vdCBib3RoLCBtdXN0IGJlIHByb3ZpZGVkLi8pO1xufSk7XG5cbnRlc3QoJ3N1cHBvcnQgZ3JhbnRpbmcgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICB9KTtcblxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCksXG4gIH0pO1xuXG4gIGZpbGVTeXN0ZW0uZ3JhbnQocm9sZSwgJ2VsYXN0aWNmaWxlc3lzdGVtOkNsaWVudFdyaXRlJyk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50V3JpdGUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdFZnNGaWxlU3lzdGVtMzc5MTA2NjYnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBQb2xpY3lOYW1lOiAnUm9sZURlZmF1bHRQb2xpY3k1RkZCN0RBQicsXG4gICAgUm9sZXM6IFtcbiAgICAgIHtcbiAgICAgICAgUmVmOiAnUm9sZTFBQkNDNUYwJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnc3VwcG9ydCB0YWdzJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICB9KTtcbiAgVGFncy5vZihmaWxlU3lzdGVtKS5hZGQoJ05hbWUnLCAnTG9va0F0TWVBbmRNeUZhbmN5VGFncycpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIEZpbGVTeXN0ZW1UYWdzOiBbXG4gICAgICB7IEtleTogJ05hbWUnLCBWYWx1ZTogJ0xvb2tBdE1lQW5kTXlGYW5jeVRhZ3MnIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnZmlsZSBzeXN0ZW0gaXMgY3JlYXRlZCBjb3JyZWN0bHkgd2hlbiBnaXZlbiBhIG5hbWUnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywge1xuICAgIGZpbGVTeXN0ZW1OYW1lOiAnTXlOYW1lYWJsZUZpbGVTeXN0ZW0nLFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFRlM6OkZpbGVTeXN0ZW0nLCB7XG4gICAgRmlsZVN5c3RlbVRhZ3M6IFtcbiAgICAgIHsgS2V5OiAnTmFtZScsIFZhbHVlOiAnTXlOYW1lYWJsZUZpbGVTeXN0ZW0nIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnYXV0by1uYW1lZCBpZiBub25lIHByb3ZpZGVkJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IGZpbGVTeXN0ZW0gPSBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBGaWxlU3lzdGVtVGFnczogW1xuICAgICAgeyBLZXk6ICdOYW1lJywgVmFsdWU6IGZpbGVTeXN0ZW0ubm9kZS5wYXRoIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgncmVtb3ZhbFBvbGljeSBpcyBERVNUUk9ZJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIG5ldyBGaWxlU3lzdGVtKHN0YWNrLCAnRWZzRmlsZVN5c3RlbScsIHsgdnBjLCByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1kgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVGUzo6RmlsZVN5c3RlbScsIHtcbiAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IGJhY2t1cCBwb2xpY3knLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IEZpbGVTeXN0ZW0oc3RhY2ssICdFZnNGaWxlU3lzdGVtJywgeyB2cGMsIGVuYWJsZUF1dG9tYXRpY0JhY2t1cHM6IHRydWUgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFRlM6OkZpbGVTeXN0ZW0nLCB7XG4gICAgQmFja3VwUG9saWN5OiB7XG4gICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gY3JlYXRlIHdoZW4gdXNpbmcgYSBWUEMgd2l0aCBtdWx0aXBsZSBzdWJuZXRzIHBlciBhdmFpbGFiaWxpdHkgem9uZScsICgpID0+IHtcbiAgLy8gY3JlYXRlIGEgdnBjIHdpdGggdHdvIHN1Ym5ldHMgaW4gdGhlIHNhbWUgYXZhaWxhYmlsaXR5IHpvbmUuXG4gIGNvbnN0IG9uZUF6VnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnLCB7XG4gICAgbWF4QXpzOiAxLFxuICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7IG5hbWU6ICdPbmUnLCBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEIH0sIHsgbmFtZTogJ1R3bycsIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfSVNPTEFURUQgfV0sXG4gICAgbmF0R2F0ZXdheXM6IDAsXG4gIH0pO1xuICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7XG4gICAgdnBjOiBvbmVBelZwYyxcbiAgfSk7XG4gIC8vIG1ha2Ugc3VyZSBvbmx5IG9uZSBtb3VudCB0YXJnZXQgaXMgY3JlYXRlZC5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUZTOjpNb3VudFRhcmdldCcsIDEpO1xufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IGZpbGUgc3lzdGVtIHBvbGljeScsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBteUZpbGVTeXN0ZW1Qb2xpY3kgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICBzdGF0ZW1lbnRzOiBbbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50V3JpdGUnLFxuICAgICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50TW91bnQnLFxuICAgICAgXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjExMTEyMjIyMzMzMzpyb2xlL1Rlc3RpbmdfUm9sZScpXSxcbiAgICAgIHJlc291cmNlczogWydhcm46YXdzOmVsYXN0aWNmaWxlc3lzdGVtOnVzLWVhc3QtMjoxMTExMjIyMjMzMzM6ZmlsZS1zeXN0ZW0vZnMtMTIzNGFiY2QnXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgQm9vbDoge1xuICAgICAgICAgICdlbGFzdGljZmlsZXN5c3RlbTpBY2Nlc3NlZFZpYU1vdW50VGFyZ2V0JzogJ3RydWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KV0sXG4gIH0pO1xuICBuZXcgRmlsZVN5c3RlbShzdGFjaywgJ0Vmc0ZpbGVTeXN0ZW0nLCB7IHZwYywgZmlsZVN5c3RlbVBvbGljeTogbXlGaWxlU3lzdGVtUG9saWN5IH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUZTOjpGaWxlU3lzdGVtJywge1xuICAgIEZpbGVTeXN0ZW1Qb2xpY3k6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiAnYXJuOmF3czppYW06OjExMTEyMjIyMzMzMzpyb2xlL1Rlc3RpbmdfUm9sZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdlbGFzdGljZmlsZXN5c3RlbTpDbGllbnRXcml0ZScsXG4gICAgICAgICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50TW91bnQnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOmVsYXN0aWNmaWxlc3lzdGVtOnVzLWVhc3QtMjoxMTExMjIyMjMzMzM6ZmlsZS1zeXN0ZW0vZnMtMTIzNGFiY2QnLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgQm9vbDoge1xuICAgICAgICAgICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06QWNjZXNzZWRWaWFNb3VudFRhcmdldCc6ICd0cnVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTsiXX0=