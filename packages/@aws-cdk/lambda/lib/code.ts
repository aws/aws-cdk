import { lambda } from '@aws-cdk/resources';
import { BucketName, BucketRef } from '@aws-cdk/s3';
import { FunctionRuntime } from './runtime';

export abstract class FunctionCode {
    public abstract toJSON(runtime: FunctionRuntime): lambda.FunctionResource.CodeProperty;
}

export class FunctionS3Code extends FunctionCode {
    private bucketName: BucketName;

    constructor(bucket: BucketRef, private key: string, private objectVersion?: string) {
        super();

        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }

        this.bucketName = bucket.bucketName;
    }

    public toJSON(_runtime: FunctionRuntime): lambda.FunctionResource.CodeProperty {
        return {
            s3Bucket: this.bucketName,
            s3Key: this.key,
            s3ObjectVersion: this.objectVersion
        };
    }
}

export class FunctionInlineCode extends FunctionCode {
    constructor(private code: string) {
        super();

        if (code.length > 4096) {
            throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
        }
    }

    public toJSON(runtime: FunctionRuntime): lambda.FunctionResource.CodeProperty {
        if (!runtime.supportsInlineCode) {
            throw new Error(`Inline source not supported for: ${runtime.name}`);
        }

        return {
            zipFile: this.code
        };
    }
}
