import { lambda } from 'aws-cdk-resources';
import { BucketName, BucketRef } from 'aws-cdk-s3';
import { LambdaRuntime } from './runtime';

export abstract class LambdaCode {
    public abstract toJSON(runtime: LambdaRuntime): lambda.FunctionResource.CodeProperty;
}

export class LambdaS3Code extends LambdaCode {
    private bucketName: BucketName;

    constructor(bucket: BucketRef, private key: string, private objectVersion?: string) {
        super();

        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }

        this.bucketName = bucket.bucketName;
    }

    public toJSON(_runtime: LambdaRuntime): lambda.FunctionResource.CodeProperty {
        return {
            s3Bucket: this.bucketName,
            s3Key: this.key,
            s3ObjectVersion: this.objectVersion
        };
    }
}

export class LambdaInlineCode extends LambdaCode {
    constructor(private code: string) {
        super();

        if (code.length > 4096) {
            throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
        }
    }

    public toJSON(runtime: LambdaRuntime): lambda.FunctionResource.CodeProperty {
        const allowed = [
            LambdaRuntime.NodeJS,
            LambdaRuntime.NodeJS43,
            LambdaRuntime.NodeJS610,
            LambdaRuntime.Python27,
            LambdaRuntime.Python36
        ];

        if (!allowed.find(a => a === runtime)) {
            throw new Error(`Inline source only allowed for: ${allowed.join(', ')}`);
        }

        return {
            zipFile: this.code
        };
    }
}
