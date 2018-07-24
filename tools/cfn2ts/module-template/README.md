## Low-level AWS CloudFormation Resources Library
The `@aws-cdk/resources` library is automatically generated from the
[CloudFormation Resource specification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html).
It provides access to all resource types CloudFormation supports, in a low-level API. You should prefer depending on
higher level construct libraries (such as `aws-cdk-ec2`, `aws-cdk-s3`, ...) as they will offer more expressive APIs and in many cases will
also provide additional validations.

### Usage
The library bundles each AWS service resources in a dedicated namespace. Simply import the namespaces you need and work
with the classes it defines:

```ts
import { Construct } from '@aws-cdk/cdk';
import { kms, s3 } from '@aws-cdk/resources';

/**
 * The Bucket class in the aws-cdk-s3 library provides much better
 * functionality than what is presented in this toy example.
 */
export class EncryptedBucket extends Construct {
    public readonly bucketArn: BucketArn;

    constructor(parent: Construct, name: string) {
        super(parent, name);
        const kmsKey = new kms.KeyResource(parent, 'BucketEncryption', {
            enableKeyRotation: true,
            keyPolicy
        });
        const bucket = new s3.BucketResource(parent, 'BucketName', {
            bucketEncryption: {
                serverSideEncryptionConfiguration: {
                    serverSideEncryptionByDefault: {
                        kmsMasterKeyId: kmsKey.keyArn,
                        sseAlgorithm: 'aws:kms'
                    }
                }
            }
        });
        this.bucketArn = bucket.bucketArn;
    }
}
```
