import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as kms from "@aws-cdk/aws-kms";
import * as cxprotocol from "@aws-cdk/cloud-assembly-schema";
import {Stack} from "@aws-cdk/core";
import {EfsFileSystem, EfsLifecyclePolicyProperty, EfsPerformanceMode, EfsThroughputMode} from "../lib/efs-file-system";

let stack = new Stack();
let vpc = new ec2.Vpc(stack, 'VPC');

beforeEach( () => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
});

test('default file system is created correctly', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem'));
    expectCDK(stack).to(haveResource('AWS::EFS::MountTarget'));
    expectCDK(stack).to(haveResource('AWS::EC2::SecurityGroup'));
});

test('unencrypted file system is created correctly with default KMS', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: false
    });
    // THEN
    expectCDK(stack).notTo(haveResource('AWS::EFS::FileSystem', {
        Encrypted: true,
    }));
});

test('encrypted file system is created correctly with default KMS', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: true
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        Encrypted: true,
    }));
});

test('encrypted file system is created correctly with custom KMS', () => {
    const key = new kms.Key(stack, 'customKeyFS');

    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        encrypted: true,
        kmsKey: key
    });
    // THEN

    /**
     * CDK appends 8-digit MD5 hash of the resource path to the logical Id of the resource in order to make sure
     * that the id is unique across multiple stacks. There isnt a direct way to identify the exact name of the resource
     * in generated CDK, hence hardcoding the MD5 hash here for assertion. Assumption is that the path of the Key wont
     * change in this UT. Checked the unique id by generating the cloud formation stack.
     */
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        Encrypted: true,
        KmsKeyId: {
            Ref: 'customKeyFSDDB87C6D'
        }
    }));
});

test('file system is created correctly with life cycle property', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        lifecyclePolicy: EfsLifecyclePolicyProperty.AFTER_14_DAYS
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        LifecyclePolicies: [{
            TransitionToIA: "AFTER_14_DAYS"
        }]
    }));
});

test('file system is created correctly with performance mode', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        performanceMode: EfsPerformanceMode.MAX_IO
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        PerformanceMode: "maxIO"
    }));
});

test('file system is created correctly with bursting throughput mode', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: EfsThroughputMode.BURSTING
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        ThroughputMode: "bursting"
    }));
});

test('Exception when throughput mode is set to PROVISIONED, but provisioned throughput is not set', () => {
    expect(() => {
        new EfsFileSystem(stack, 'EfsFileSystem', {
            vpc,
            throughputMode: EfsThroughputMode.PROVISIONED
        });
    }).toThrowError(/Property provisionedThroughputInMibps is required when throughputMode is PROVISIONED/);
});

test('Warning when provisioned throughput is less than the valid range', () => {
    const fileSystem = new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: EfsThroughputMode.PROVISIONED,
        provisionedThroughputInMibps: 0
    });

    expect(fileSystem.node.metadata[0].type).toMatch(cxprotocol.ArtifactMetadataEntryType.WARN);
    expect(fileSystem.node.metadata[0].data).toContain("Valid values for throughput are 1-1024 MiB/s");
    expect(fileSystem.node.metadata[0].data).toContain("You can get this limit increased by contacting AWS Support");

    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem'));
});

test('Warning when provisioned throughput is above than the valid range', () => {
    const fileSystem = new EfsFileSystem(stack, 'EfsFileSystem1', {
        vpc,
        throughputMode: EfsThroughputMode.PROVISIONED,
        provisionedThroughputInMibps: 1025
    });

    expect(fileSystem.node.metadata[0].type).toMatch(cxprotocol.ArtifactMetadataEntryType.WARN);
    expect(fileSystem.node.metadata[0].data).toContain("Valid values for throughput are 1-1024 MiB/s");
    expect(fileSystem.node.metadata[0].data).toContain("You can get this limit increased by contacting AWS Support");

    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem'));
});

test('Error when provisioned throughput is invalid number', () => {
    expect(() => {
        new EfsFileSystem(stack, 'EfsFileSystem2', {
            vpc,
            throughputMode: EfsThroughputMode.PROVISIONED,
            provisionedThroughputInMibps: 1.5
        });
    }).toThrowError(/Invalid input for provisionedThroughputInMibps/);
});

test('file system is created correctly with provisioned throughput mode', () => {
    // WHEN
    new EfsFileSystem(stack, 'EfsFileSystem', {
        vpc,
        throughputMode: EfsThroughputMode.PROVISIONED,
        provisionedThroughputInMibps: 5
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::EFS::FileSystem', {
        ThroughputMode: "provisioned",
        ProvisionedThroughputInMibps: 5
    }));
});

test('existing file system is imported correctly', () => {
    // WHEN
    const fs = EfsFileSystem.fromEfsFileSystemAttributes(stack, "existingFS", {
        fileSystemID: "fs123",
        securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
            allowAllOutbound: false
        })
    });

    fs.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expectCDK(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    }));
});