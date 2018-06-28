import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Bucket } from '../lib';

export = {
    'can set up replication'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const source = new Bucket(stack, 'Source', { versioned: true });
        const dest = new Bucket(stack, 'Dest', { versioned: true });

        // WHEN
        source.enableBucketReplication(dest);

        // THEN
        expect(stack).to(haveResource('AWS::S3::Bucket', {
            ReplicationConfiguration: {
                Role: { "Fn::GetAtt": [ "SourceReplicationRole3A0201A1", "Arn" ] },
                Rules: [{
                    Destination: {
                        Bucket: { "Fn::GetAtt": [ "DestC383B82A", "Arn" ] }
                    },
                    Prefix: "",
                    SourceSelectionCriteria: { SseKmsEncryptedObjects: { Status: "Enabled" } },
                    Status: "Enabled"
                }]
            },
            VersioningConfiguration: { Status: "Enabled" }
        }));

        expect(stack).to(haveResource('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [{
                    Action: "sts:AssumeRole",
                    Effect: "Allow",
                    Principal: { Service: "s3.amazonaws.com" }
                }],
            }
        }));

        test.done();
    },

    'target account rewriting'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const source = new Bucket(stack, 'Source', { versioned: true });
        const dest = new Bucket(stack, 'Dest', { versioned: true });

        // WHEN
        source.enableBucketReplication(dest, [{ newOwnerAccount: '1234' }]);

        // THEN
        expect(stack).to(haveResource('AWS::S3::Bucket', {
            ReplicationConfiguration: {
                Rules: [{
                    Destination: {
                        AccessControlTranslation: { Owner: 'Destination' },
                        Account: '1234',
                    },
                }]
            },
        }));

        test.done();
    }
};