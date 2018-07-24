import s3 = require('@aws-cdk/aws-s3');
import { cloudformation } from './lambda.generated';
import { LambdaRuntime } from './runtime';

export abstract class LambdaCode {
    public abstract toJSON(runtime: LambdaRuntime): cloudformation.FunctionResource.CodeProperty;
}

export class LambdaS3Code extends LambdaCode {
    private bucketName: s3.BucketName;

    constructor(bucket: s3.BucketRef, private key: string, private objectVersion?: string) {
        super();

        if (!bucket.bucketName) {
            throw new Error('bucketName is undefined for the provided bucket');
        }

        this.bucketName = bucket.bucketName;
    }

    public toJSON(_runtime: LambdaRuntime): cloudformation.FunctionResource.CodeProperty {
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

    public toJSON(runtime: LambdaRuntime): cloudformation.FunctionResource.CodeProperty {
        if (!runtime.supportsInlineCode) {
            throw new Error(`Inline source not supported for: ${runtime.name}`);
        }

        return {
            zipFile: this.code
        };
    }
}
